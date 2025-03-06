import React from 'react';
import { Building2, Star, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Agency } from '../types';
import { AgencyRow } from './AgencyRow';

interface AgencyTableProps {
  agencies: Agency[];
  onStatusChange: (agencyId: string, status: 'approved' | 'rejected') => Promise<void>;
  onVerificationChange: (agencyId: string, is_verified: boolean) => Promise<void>;
  onTrustScoreChange: (agencyId: string, trust_score: number) => Promise<void>;
  onDelete: (agencyId: string) => Promise<void>;
}

export function AgencyTable({
  agencies,
  onStatusChange,
  onVerificationChange,
  onTrustScoreChange,
  onDelete
}: AgencyTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trust Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agencies.map((agency) => (
              <AgencyRow
                key={agency.id}
                agency={agency}
                onStatusChange={onStatusChange}
                onVerificationChange={onVerificationChange}
                onTrustScoreChange={onTrustScoreChange}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}