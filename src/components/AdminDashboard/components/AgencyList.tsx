import React from 'react';
import { Agency } from '../types';
import { VerificationStatus } from './VerificationStatus';

interface AgencyListProps {
  agencies: Agency[];
  selectedAgency: Agency | null;
  onSelectAgency: (agency: Agency) => void;
}

export function AgencyList({ agencies, selectedAgency, onSelectAgency }: AgencyListProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-semibold text-gray-900 mb-4">Your Agencies</h2>
      <div className="space-y-2">
        {agencies.map((agency) => (
          <div key={agency.id} className="space-y-2">
            <button
              onClick={() => onSelectAgency(agency)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedAgency?.id === agency.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              {agency.name}
            </button>
            <div className="mt-2 px-4">
              <VerificationStatus agency={agency} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}