import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaHardHat, FaPhoneAlt } from 'react-icons/fa';
import StatusBadge from '../../components/dashboard/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { GridSkeleton } from '../../components/dashboard/Skeletons';
import { requirementApi } from '../../services/resourceApi';
import { formatINR, formatDate } from '../../utils/format';
import RequirementMessages from '../../components/customer/RequirementMessages';

const statusOptions = ['Responded', 'In Discussion', 'Accepted', 'Rejected', 'Closed'];

const ReceivedRequirementsPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    requirementApi.received().then(({ data }) => setRequirements(data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await requirementApi.updateStatus(id, { status });
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-heading font-bold text-ink mb-6">Construction Requirements</h1>
      {loading ? (
        <GridSkeleton count={3} cols="md:grid-cols-1" />
      ) : requirements.length === 0 ? (
        <EmptyState icon={FaHardHat} title="No requirements received yet" description="Construction requirements sent to you will appear here." />
      ) : (
        <div className="space-y-4">
          {requirements.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-ink">{r.title}</h3>
                  <p className="text-sm text-muted">From: {r.customer?.name}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="text-sm text-ink/80 mb-2">{r.location} · {r.plotArea?.value} {r.plotArea?.unit} · {r.houseType}</p>
              <p className="text-sm text-ink/80 mb-2">Budget: {formatINR(r.approxBudget)} · {r.bedrooms} BHK, {r.bathrooms} bath, {r.floors} floor(s)</p>
              {r.description && <p className="text-sm text-muted bg-section rounded-lg p-3 mb-3">{r.description}</p>}

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-xs text-muted">
                  {r.customer?.phone && <span className="flex items-center gap-1.5"><FaPhoneAlt /> {r.customer.phone}</span>}
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                <select
                  value=""
                  onChange={(e) => e.target.value && handleStatusChange(r._id, e.target.value)}
                  className="text-sm border border-border rounded-lg px-3 py-1.5"
                >
                  <option value="">Update Status...</option>
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <RequirementMessages requirement={r} viewerRole="contractor" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedRequirementsPage;
