import React from 'react';
import { Building2, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Agency } from '../types';

interface AgencyRowProps {
  agency: Agency;
  onStatusChange: (agencyId: string, status: 'approved' | 'rejected') => Promise<void>;
  onVerificationChange: (agencyId: string, is_verified: boolean) => Promise<void>;
  onTrustScoreChange: (agencyId: string, trust_score: number) => Promise<void>;
}

export function AgencyRow({
  agency,
  onStatusChange,
  onVerificationChange,
  onTrustScoreChange
}: AgencyRowProps) {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <div className="font-medium text-gray-900">{agency.name}</div>
            <div className="text-sm text-gray-500">{agency.location}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {agency.owner?.email || 'No owner'}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          agency.status === 'approved' ? 'bg-green-100 text-green-800' :
          agency.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {agency.status === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
          {agency.status === 'rejected' && <XCircle className="h-4 w-4 mr-1" />}
          {agency.status === 'pending' && <AlertCircle className="h-4 w-4 mr-1" />}
          {agency.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onVerificationChange(agency.id, !agency.is_verified)}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            agency.is_verified 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
        >
          {agency.is_verified ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              Verified
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 mr-1" />
              Unverified
            </>
          )}
        </button>
      </td>
      <td className="px-6 py-4">
        <input
          type="number"
          min="0"
          max="100"
          value={agency.trust_score}
          onChange={(e) => onTrustScoreChange(agency.id, Number(e.target.value))}
          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {agency.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(agency.id, 'approved')}
                className="text-green-600 hover:text-green-800"
                title="Approve"
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
              <button
                onClick={() => onStatusChange(agency.id, 'rejected')}
                className="text-red-600 hover:text-red-800"
                title="Reject"
              >
                <ThumbsDown className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}