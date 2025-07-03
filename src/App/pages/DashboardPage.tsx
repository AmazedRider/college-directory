import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { Link } from 'react-router-dom';
import { Search, Award, Map, Book, Plus, Loader2, CheckCircle, Clock, AlertTriangle, Star, Shield, MessageCircle, User, FileText, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getGuides, getBlogPosts } from '../../lib/api';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    university: '',
    program: '',
    country: '',
    intake: '',
    deadline: '',
    status: 'Preparing Documents'
  });
  const [submitting, setSubmitting] = useState(false);

  // Profile edit modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    full_name: '',
    email: '',
    country: '',
    avatar_url: ''
  });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [selectedGalleryAvatar, setSelectedGalleryAvatar] = useState('');

  // Use free DiceBear avatars for instant, reliable illustrated avatars
  const defaultAvatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=AI',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Student',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Scholar',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Explorer',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Bookworm',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Rocket',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Owl',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Cat',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Dog',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Fox',
  ];

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  // Fetch applications
  useEffect(() => {
    async function fetchApplications() {
      setAppLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('deadline', { ascending: true });
      setApplications(data || []);
      setAppLoading(false);
    }
    if (user) fetchApplications();
  }, [user]);

  // Fetch scholarships (for alerts)
  useEffect(() => {
    async function fetchScholarships() {
      const today = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(today.getDate() + 30);
      const { data } = await supabase
        .from('scholarships')
        .select('*')
        .gte('deadline', today.toISOString())
        .lte('deadline', thirtyDays.toISOString())
        .order('deadline', { ascending: true });
      setScholarships(data || []);
    }
    fetchScholarships();
  }, []);

  // Fetch top agencies
  useEffect(() => {
    async function fetchAgencies() {
      const { data } = await supabase
        .from('agencies')
        .select('*')
        .eq('status', 'approved')
        .order('trust_score', { ascending: false })
        .limit(2);
      setAgencies(data || []);
    }
    fetchAgencies();
  }, []);

  // Fetch guides and blog posts
  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      const guidesData = await getGuides();
      setGuides(guidesData.slice(0, 2));
      const blogsData = await getBlogPosts();
      setBlogPosts(blogsData.slice(0, 2));
      setLoading(false);
    }
    fetchContent();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          ...formData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Add new application to the list
      setApplications(prev => [data, ...prev]);
      
      // Reset form and close modal
      setFormData({
        university: '',
        program: '',
        country: '',
        intake: '',
        deadline: '',
        status: 'Preparing Documents'
      });
      setShowAddModal(false);
      
      // Show success message (you can add toast notification here)
      toast.success('Application added successfully!');
    } catch (error) {
      console.error('Error adding application:', error);
      toast.error('Failed to add application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Application process steps (animated timeline)
  const appSteps = [
    'Preparing Documents',
    'Under Review',
    'Accepted',
    'Rejected'
  ];

  // Profile strength calculation
  const profileStrength = profile ?
    [profile.full_name, profile.email, profile.country, profile.avatar_url].filter(Boolean).length * 25 : 0;

  // Upcoming deadlines
  const today = new Date();
  const upcomingDeadlines = applications.filter(app => {
    const deadline = new Date(app.deadline);
    return deadline >= today && (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30;
  }).slice(0, 3);

  // Animated card classes - changed from floating to slide-in and hover effects
  const cardClass = "bg-white rounded-2xl shadow-lg border border-[#ececff] p-6 hover:shadow-2xl hover:border-[#6c47ff]/30 transition-all duration-300 transform hover:-translate-y-1";

  // Open profile modal with current profile
  const handleEditProfile = () => {
    setEditProfile({
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      country: profile?.country || '',
      avatar_url: profile?.avatar_url || '',
    });
    setSelectedGalleryAvatar(profile?.avatar_gallery || '');
    setShowProfileModal(true);
  };

  // Handle profile input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({ ...prev, [name]: value }));
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast.error('Failed to upload avatar');
      setAvatarUploading(false);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setEditProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
    setAvatarUploading(false);
    toast.success('Avatar uploaded!');
  };

  // Handle profile save
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { full_name, email, country } = editProfile;
    let avatarToSave = editProfile.avatar_url;
    let galleryToSave = selectedGalleryAvatar;
    if (selectedGalleryAvatar) {
      avatarToSave = selectedGalleryAvatar;
      galleryToSave = selectedGalleryAvatar;
    }
    if (editProfile.avatar_url && !selectedGalleryAvatar) {
      galleryToSave = '';
    }
    const updated_at = new Date().toISOString();
    const { error } = await supabase.from('profiles').update({ full_name, email, country, avatar_url: avatarToSave, avatar_gallery: galleryToSave, updated_at }).eq('id', user.id);
    if (error) {
      console.error('Supabase profile update error:', error);
      toast.error('Failed to update profile');
    } else {
      setProfile((prev: any) => ({ ...prev, full_name, email, country, avatar_url: avatarToSave, avatar_gallery: galleryToSave }));
      setShowProfileModal(false);
      toast.success('Profile updated!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex flex-col items-center py-0 px-2">
      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-700">Edit Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <img
                    src={editProfile.avatar_url || selectedGalleryAvatar || '/default-avatar.png'}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow mb-2 hover:opacity-80 transition"
                  />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                />
                {avatarUploading && <span className="text-xs text-blue-500 mt-1">Uploading...</span>}
                {/* Avatar Gallery */}
                <div className="flex gap-2 mt-3 flex-wrap justify-center">
                  {defaultAvatars.map((avatar, idx) => (
                    <button
                      type="button"
                      key={avatar}
                      className={`rounded-full border-2 ${selectedGalleryAvatar === avatar ? 'border-blue-500' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-blue-200`}
                      onClick={() => {
                        setSelectedGalleryAvatar(avatar);
                        setEditProfile(prev => ({ ...prev, avatar_url: '' })); // Clear upload if picking gallery
                      }}
                    >
                      <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-12 h-12 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={editProfile.full_name}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-blue-200 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editProfile.email}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-blue-200 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={editProfile.country}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-blue-200 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 mt-4 transition-all"
                disabled={avatarUploading}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center justify-center min-h-[40vh] py-12 px-4 text-center relative">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-blue-200 via-blue-100 to-pink-100 shadow-lg mb-6 border-4 border-white relative">
          <img
            src={profile?.avatar_url || profile?.avatar_gallery || '/default-avatar.png'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 shadow"
          />
          <button
            onClick={handleEditProfile}
            className="absolute bottom-2 right-2 bg-white border border-blue-200 rounded-full p-1.5 shadow hover:bg-blue-50 transition"
            title="Edit Profile"
          >
            <User className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-blue-900">Welcome, {(profile?.full_name || (profile?.email ? profile.email.split('@')[0] : '')) || 'User'}!</h1>
        <p className="text-lg text-blue-500 mb-4">Your personalized dashboard for all things study abroad.</p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold text-base shadow-sm border border-blue-200">Applications <span className="font-bold ml-1">({applications.length})</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-base shadow-sm border border-green-200">Scholarships <span className="font-bold ml-1">({scholarships.length})</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-base shadow-sm border border-yellow-200">Profile Strength <span className="font-bold ml-1">({profileStrength}%)</span></span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 px-2">
        {/* Applications Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <Map className="w-8 h-8 text-blue-500 mb-2" />
          <div className="text-3xl font-extrabold text-blue-900">{applications.length}</div>
          <div className="text-blue-500 font-semibold">Applications</div>
        </div>
        {/* Scholarships Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <Award className="w-8 h-8 text-green-500 mb-2" />
          <div className="text-3xl font-extrabold text-green-900">{scholarships.length}</div>
          <div className="text-green-500 font-semibold">Scholarships</div>
        </div>
        {/* Profile Strength Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <User className="w-8 h-8 text-yellow-500 mb-2" />
          <div className="text-3xl font-extrabold text-yellow-900">{profileStrength}%</div>
          <div className="w-full bg-yellow-100 rounded-full h-2 mt-2 mb-1">
            <div className="bg-yellow-400 h-2 rounded-full transition-all duration-300" style={{ width: `${profileStrength}%` }}></div>
          </div>
          <div className="text-yellow-500 font-semibold">Profile Strength</div>
        </div>
        {/* Upcoming Deadlines Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all duration-200">
          <Clock className="w-8 h-8 text-pink-500 mb-2" />
          <div className="text-3xl font-extrabold text-pink-900">{upcomingDeadlines.length}</div>
          <div className="text-pink-500 font-semibold">Upcoming Deadlines</div>
          <ul className="mt-2 w-full text-xs text-pink-700">
            {upcomingDeadlines.length === 0 && <li>No deadlines soon</li>}
            {upcomingDeadlines.map(app => (
              <li key={app.id} className="flex justify-between items-center w-full">
                <span>{app.university}</span>
                <span>{new Date(app.deadline).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Recent Activity Section */}
      <div className="w-full max-w-5xl mx-auto mb-12 px-2">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2"><Map className="w-5 h-5 text-blue-400" /> Applications</h3>
            {appLoading ? (
              <div className="animate-pulse h-6 bg-blue-50 rounded mb-2 w-3/4" />
            ) : applications.length === 0 ? (
              <div className="text-blue-400">No applications yet.</div>
            ) : (
              <ul className="divide-y divide-blue-50">
                {applications.slice(0, 4).map(app => (
                  <li key={app.id} className="py-2 flex justify-between items-center">
                    <span className="font-medium text-blue-900">{app.university}</span>
                    <span className="text-xs text-blue-500">{app.status}</span>
                    <span className="text-xs text-blue-400">{new Date(app.deadline).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Recent Scholarships */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-2"><Award className="w-5 h-5 text-green-400" /> Scholarships</h3>
            {loading ? (
              <div className="animate-pulse h-6 bg-green-50 rounded mb-2 w-3/4" />
            ) : scholarships.length === 0 ? (
              <div className="text-green-400">No scholarships found.</div>
            ) : (
              <ul className="divide-y divide-green-50">
                {scholarships.slice(0, 4).map(sch => (
                  <li key={sch.id} className="py-2 flex justify-between items-center">
                    <span className="font-medium text-green-900">{sch.name}</span>
                    <span className="text-xs text-green-500">{sch.amount}</span>
                    <span className="text-xs text-green-400">{sch.deadline ? new Date(sch.deadline).toLocaleDateString() : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#6c47ff]">Add New Application</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
                  placeholder="e.g. University of Toronto"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
                  placeholder="e.g. Master of Computer Science"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
                  placeholder="e.g. Canada"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intake</label>
                <input
                  type="text"
                  name="intake"
                  value={formData.intake}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
                  placeholder="e.g. Fall 2024"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c47ff] focus:border-transparent"
                  required
                >
                  <option value="Preparing Documents">Preparing Documents</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#7b61ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </div>
                  ) : (
                    'Add Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Header */}
      <div className="w-full flex flex-col items-center justify-center mt-4 mb-6 animate-fade-in">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-[#e9edfb] via-[#f8f6ff] to-[#f9f6ff] rounded-3xl shadow-2xl p-8 border border-[#ececff] hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#6c47ff] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#6c47ff] mb-1">Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!</h1>
              <p className="text-gray-600 text-lg font-medium">Your personalized study abroad dashboard</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-gray-500">Profile Strength</span>
            <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 rounded-full bg-gradient-to-r from-[#6c47ff] to-[#a084ff] transition-all duration-500" style={{ width: `${profileStrength}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{profileStrength}% complete</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link to="/course-finder" className={cardClass}>
          <div className="flex flex-col items-center">
            <Search className="w-10 h-10 text-primary mb-2" />
            <span className="font-bold text-lg text-[#6c47ff]">Course Finder</span>
            <span className="text-gray-600 text-sm text-center mt-1">Search thousands of courses worldwide with smart filters.</span>
          </div>
        </Link>
        <Link to="/scholarship-finder" className={cardClass}>
          <div className="flex flex-col items-center">
            <Award className="w-10 h-10 text-orange-500 mb-2" />
            <span className="font-bold text-lg text-[#6c47ff]">Scholarship Finder</span>
            <span className="text-gray-600 text-sm text-center mt-1">Discover scholarships with eligibility indicators and guidance.</span>
          </div>
        </Link>
        <Link to="/agencies" className={cardClass}>
          <div className="flex flex-col items-center">
            <Map className="w-10 h-10 text-orange-500 mb-2" />
            <span className="font-bold text-lg text-[#6c47ff]">Consultancy Directory</span>
            <span className="text-gray-600 text-sm text-center mt-1">Find verified consultants with trust scores and reviews.</span>
          </div>
        </Link>
        <Link to="/knowledge-hub" className={cardClass}>
          <div className="flex flex-col items-center">
            <Book className="w-10 h-10 text-emerald-500 mb-2" />
            <span className="font-bold text-lg text-[#6c47ff]">Knowledge Hub</span>
            <span className="text-gray-600 text-sm text-center mt-1">Access expert guides, visa info, and application resources.</span>
          </div>
        </Link>
      </div>

      {/* Animated Application Process Timeline */}
      <div className="w-full max-w-5xl mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-[#ececff] p-6 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#6c47ff] mb-2">Application Process</h2>
            <div className="flex flex-row items-center gap-4 overflow-x-auto">
              {appSteps.map((step, idx) => {
                const isActive = applications.some(app => app.status === step);
                return (
                  <div key={step} className={`flex flex-col items-center relative ${idx < appSteps.length - 1 ? 'mr-8' : ''}`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${isActive ? 'bg-[#6c47ff] text-white border-[#6c47ff]' : 'bg-gray-100 text-gray-400 border-gray-300'} shadow transition-all duration-300 hover:scale-110`}>{
                      step === 'Preparing Documents' ? <FileText className="w-6 h-6" /> :
                      step === 'Under Review' ? <Clock className="w-6 h-6" /> :
                      step === 'Accepted' ? <CheckCircle className="w-6 h-6" /> :
                      <AlertTriangle className="w-6 h-6" />
                    }</div>
                    <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-[#6c47ff]' : 'text-gray-400'}`}>{step}</span>
                    {idx < appSteps.length - 1 && <div className="absolute top-5 right-[-2rem] w-8 h-1 bg-gradient-to-r from-[#6c47ff] to-[#a084ff] rounded-full" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* My Applications */}
        <div className={cardClass + " relative"}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#6c47ff]">My Applications</h2>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-primary hover:underline text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {appLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No applications yet. Start by adding your first application!</div>
          ) : (
            <ul className="space-y-4">
              {applications.slice(0, 3).map(app => (
                <li key={app.id} className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-[#f4f6fa] to-[#f9f6ff] shadow hover:shadow-md hover:bg-gradient-to-r hover:from-[#e9edfb] hover:to-[#f8f6ff] transition-all duration-200">
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-gray-900">{app.university}</span>
                    <span className="text-xs text-gray-500">{app.program} • {app.country}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{app.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className={cardClass}>
          <h2 className="text-lg font-bold text-[#6c47ff] mb-4">Upcoming Deadlines</h2>
          {upcomingDeadlines.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No upcoming deadlines in the next 30 days.</div>
          ) : (
            <ul className="space-y-4">
              {upcomingDeadlines.map(app => (
                <li key={app.id} className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-[#f4f6fa] to-[#f9f6ff] shadow hover:shadow-md hover:bg-gradient-to-r hover:from-[#e9edfb] hover:to-[#f8f6ff] transition-all duration-200">
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-gray-900">{app.university}</span>
                    <span className="text-xs text-gray-500">{app.program} • {app.country}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">Deadline</span>
                    <span className="font-bold text-red-600">{new Date(app.deadline).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Scholarship Alerts */}
        <div className={cardClass}>
          <h2 className="text-lg font-bold text-[#6c47ff] mb-4">Scholarship Alerts</h2>
          {scholarships.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No scholarships with deadlines in the next 30 days.</div>
          ) : (
            <ul className="space-y-4">
              {scholarships.slice(0, 3).map(sch => (
                <li key={sch.id} className="flex flex-col gap-1 p-3 rounded-lg bg-gradient-to-r from-[#f4f6fa] to-[#f9f6ff] shadow hover:shadow-md hover:bg-gradient-to-r hover:from-[#e9edfb] hover:to-[#f8f6ff] transition-all duration-200">
                  <span className="font-semibold text-gray-900">{sch.name}</span>
                  <span className="text-xs text-gray-500">{sch.eligibility}</span>
                  <span className="text-xs text-gray-500">Deadline: <span className="font-bold text-red-600">{new Date(sch.deadline).toLocaleDateString()}</span></span>
                  <span className="text-xs text-blue-600 font-semibold">{sch.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Consultant Spotlight */}
        <div className={cardClass}>
          <h2 className="text-lg font-bold text-[#6c47ff] mb-4">Consultant Spotlight</h2>
          {agencies.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No top-rated agencies found.</div>
          ) : (
            <ul className="space-y-4">
              {agencies.map(agency => (
                <li key={agency.id} className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-[#f4f6fa] to-[#f9f6ff] shadow hover:shadow-md hover:bg-gradient-to-r hover:from-[#e9edfb] hover:to-[#f8f6ff] transition-all duration-200">
                  <div className="w-12 h-12 bg-[#6c47ff] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{agency.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-gray-900">{agency.name}</span>
                    <span className="text-xs text-gray-500">{agency.location}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-600"><Shield className="w-4 h-4" /> {agency.trust_score}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Knowledge Hub Highlights */}
        <div className={cardClass}>
          <h2 className="text-lg font-bold text-[#6c47ff] mb-4">Knowledge Hub Highlights</h2>
          <div className="flex flex-col gap-4">
            {guides.map(guide => (
              <Link key={guide.id} to={`/guide/${guide.slug}`} className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-[#f4f6fa] to-[#f9f6ff] hover:shadow-md hover:bg-gradient-to-r hover:from-[#e9edfb] hover:to-[#f8f6ff] transition-all duration-200">
                <Book className="w-6 h-6 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">{guide.title}</span>
                  <span className="text-xs text-gray-500">{guide.category}</span>
                </div>
              </Link>
            ))}
            {blogPosts.map(post => (
              <Link key={post.id} to={`/blog/post/${post.id}`} className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-[#f4f6fa] to-[#f9f6ff] hover:shadow-md hover:bg-gradient-to-r hover:from-[#e9edfb] hover:to-[#f8f6ff] transition-all duration-200">
                <Book className="w-6 h-6 text-indigo-500" />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">{post.title}</span>
                  <span className="text-xs text-gray-500">{post.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Need Help? Card */}
        <div className={cardClass + " flex flex-col items-center justify-center text-center"}>
          <MessageCircle className="w-10 h-10 text-[#6c47ff] mb-2" />
          <span className="font-bold text-lg text-[#6c47ff]">Need Help?</span>
          <span className="text-gray-600 text-sm mt-1 mb-3">Chat with our assistant or reach out to support for guidance.</span>
          <Link to="/contact" className="inline-block px-6 py-2 bg-[#6c47ff] text-white rounded-full font-bold shadow hover:bg-[#7b61ff] hover:scale-105 hover:shadow-xl transition-all duration-300 text-base">Contact Support</Link>
        </div>
      </div>
    </div>
  );
} 