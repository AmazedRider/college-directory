import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../../lib/supabase';
import { retryableQuery } from '../../lib/supabase';
import { AgencyTable } from './components/AgencyTable';
import { BulkUploadModal } from './components/BulkUploadModal';
import { AdminRequestsTable } from './components/AdminRequestsTable';
import { AdminAssignments } from './components/AdminAssignments';
import { AdminManagement } from './components/AdminManagement';
import { UserAdminManagement } from './components/UserAdminManagement';
import { BlogManagement } from './components/BlogManagement';
import { Header } from './components/Header';
import { AddAdminModal } from './components/AddAdminModal';
import { Agency, CSVAgency } from './types';
import toast from 'react-hot-toast';

export function SuperAdminDashboard() {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'agencies' | 'admins' | 'blog'>('agencies');
  const [uploadStatus, setUploadStatus] = useState({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0
  });

  useEffect(() => {
    if (user) {
      loadAgencies();
      loadAdminRequests();
      loadAdmins();
    }
  }, [filter, user]);

  const loadAdmins = async () => {
    try {
      // Get all admin profiles (excluding super admins)
      const { data: profilesData, error: profilesError } = await retryableQuery(() =>
        supabase
          .from('profiles')
          .select(`
            id,
            email,
            created_at,
            is_admin
          `)
          .eq('is_admin', true)
          .eq('is_super_admin', false)
      );

      if (profilesError) throw profilesError;

      // Then get agency counts for each admin
      const adminsWithCounts = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { count, error: countError } = await supabase
            .from('agencies')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', profile.id);

          if (countError) throw countError;

          return {
            ...profile,
            agencies_count: count || 0
          };
        })
      );

      setAdmins(adminsWithCounts);
    } catch (error) {
      console.error('Failed to load admins:', error);
      toast.error('Failed to load admins');
    }
  };

  const loadAgencies = async () => {
    try {
      let query = supabase
        .from('agencies')
        .select(`
          *,
          owner:profiles!agencies_owner_id_fkey (
            id,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await retryableQuery(() => query);

      if (error) throw error;
      setAgencies(data || []);
    } catch (error) {
      console.error('Failed to load agencies:', error);
      toast.error('Failed to load agencies');
    } finally {
      setLoading(false);
    }
  };

  const loadAdminRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminRequests(data || []);
    } catch (error) {
      console.error('Failed to load admin requests:', error);
      toast.error('Failed to load admin requests');
    }
  };

  const handleApproveAdminRequest = async (requestId: string) => {
    try {
      // Get request details
      const { data: request, error: requestError } = await supabase
        .from('admin_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Update request status
      const { error: updateError } = await supabase
        .from('admin_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Update user profile to make them an admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', request.user_id);

      if (profileError) throw profileError;

      toast.success('Admin request approved');
      loadAdminRequests();
      loadAdmins(); // Reload admins list
    } catch (error) {
      console.error('Failed to approve admin request:', error);
      toast.error('Failed to approve admin request');
    }
  };

  const handleRejectAdminRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('admin_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;
      toast.success('Admin request rejected');
      loadAdminRequests();
    } catch (error) {
      console.error('Failed to reject admin request:', error);
      toast.error('Failed to reject admin request');
    }
  };

  const handleStatusChange = async (agencyId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ status })
        .eq('id', agencyId);

      if (error) throw error;
      loadAgencies();
      toast.success(`Agency ${status}`);
    } catch (error) {
      toast.error('Failed to update agency status');
    }
  };

  const handleVerificationChange = async (agencyId: string, is_verified: boolean) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ is_verified })
        .eq('id', agencyId);

      if (error) throw error;
      loadAgencies();
      toast.success(`Agency ${is_verified ? 'verified' : 'unverified'}`);
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const handleTrustScoreChange = async (agencyId: string, trust_score: number) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ trust_score })
        .eq('id', agencyId);

      if (error) throw error;
      loadAgencies();
      toast.success('Trust score updated');
    } catch (error) {
      toast.error('Failed to update trust score');
    }
  };

  const handleBulkUpload = async (agencies: CSVAgency[]) => {
    setUploadStatus({
      total: agencies.length,
      processed: 0,
      success: 0,
      failed: 0
    });

    for (const agency of agencies) {
      try {
        const { error } = await supabase
          .from('agencies')
          .insert([{
            name: agency.name,
            location: agency.location,
            description: agency.description,
            contact_email: agency.contact_email,
            trust_score: agency.trust_score || 0,
            price: agency.price || 0,
            contact_phone: agency.contact_phone || '',
            website: agency.website || '',
            business_hours: agency.business_hours || '',
            owner_id: user?.id,
            status: 'pending'
          }]);

        if (error) {
          console.error('Failed to insert agency:', error);
          throw error;
        }

        setUploadStatus(prev => ({
          ...prev,
          processed: prev.processed + 1,
          success: prev.success + 1
        }));
      } catch (error) {
        console.error('Failed to insert agency:', error);
        setUploadStatus(prev => ({
          ...prev,
          processed: prev.processed + 1,
          failed: prev.failed + 1
        }));
      }
    }

    await loadAgencies();
    toast.success('CSV upload completed');
    setShowUploadModal(false);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddAdminModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add New Admin
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Agencies</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Bulk Upload
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('agencies')}
          className={`px-4 py-2 font-medium rounded-lg ${
            activeTab === 'agencies'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Agencies & Admins
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-4 py-2 font-medium rounded-lg ${
            activeTab === 'blog'
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Blog Management
        </button>
      </div>

      <div className="space-y-8">
        {activeTab === 'agencies' ? (
          <>
            <UserAdminManagement />

            <AdminManagement
              admins={admins}
              onAdminDeleted={loadAdmins}
            />

            <AdminRequestsTable
              requests={adminRequests}
              onApprove={handleApproveAdminRequest}
              onReject={handleRejectAdminRequest}
            />

            <AdminAssignments
              agencies={agencies}
              admins={admins}
              onAssignmentChange={loadAgencies}
            />

            <AgencyTable
              agencies={agencies}
              onStatusChange={handleStatusChange}
              onVerificationChange={handleVerificationChange}
              onTrustScoreChange={handleTrustScoreChange}
            />
          </>
        ) : (
          <BlogManagement />
        )}
      </div>

      {showUploadModal && (
        <BulkUploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleBulkUpload}
          uploadStatus={uploadStatus}
        />
      )}

      {showAddAdminModal && (
        <AddAdminModal
          onClose={() => setShowAddAdminModal(false)}
          onAdminAdded={loadAdmins}
        />
      )}
    </div>
  );
}