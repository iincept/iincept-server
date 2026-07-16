import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check, Loader2, User, Home } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/authSlice';
import axiosClient from '../../services/axiosClient';

export default function Settings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // profile or homepage

  const [form, setForm] = useState({
    name: user?.name || 'Admin Boss',
    email: user?.email || 'admin@iincept.com',
    password: '',
    confirmPassword: ''
  });

  const [siteForm, setSiteForm] = useState({
    announcement: '',
    heroTitle1: '',
    heroSubtitle1: '',
    heroButtonText1: '',
    heroTitle2: '',
    heroSubtitle2: '',
    heroButtonText2: '',
    shippingCharge: '',
    taxPercentage: '',
    freeShippingThreshold: '',
  });

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data) {
        setSiteForm({
          announcement: response.data.announcement || '',
          heroTitle1: response.data.heroTitle1 || '',
          heroSubtitle1: response.data.heroSubtitle1 || '',
          heroButtonText1: response.data.heroButtonText1 || '',
          heroTitle2: response.data.heroTitle2 || '',
          heroSubtitle2: response.data.heroSubtitle2 || '',
          heroButtonText2: response.data.heroButtonText2 || '',
          shippingCharge: response.data.shippingCharge || 0,
          taxPercentage: response.data.taxPercentage || 0,
          freeShippingThreshold: response.data.freeShippingThreshold || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.put('/auth/profile', {
        name: form.name,
        email: form.email,
        password: form.password || undefined
      });
      
      dispatch(updateUser(response.data));
      showSuccessMessage('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put('/settings', siteForm);
      showSuccessMessage('Homepage & system settings updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="text-left space-y-6">
      {success && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-3 border border-zinc-800 animate-in fade-in slide-in-from-bottom-5 duration-300 z-50">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-zinc-900 font-sans">Settings & Manager</h1>
        <p className="text-zinc-500 mt-1 text-sm">Configure administrator profiles, website announcement banners, and landing layouts.</p>
      </header>

      {/* Tabs list bar */}
      <div className="flex gap-2 border-b border-zinc-150 pb-px mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-0 bg-transparent ${
            activeTab === 'profile'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-650'
          }`}
        >
          <User className="h-4 w-4" />
          Admin Profile
        </button>
        <button
          onClick={() => setActiveTab('homepage')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-0 bg-transparent ${
            activeTab === 'homepage'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-650'
          }`}
        >
          <Home className="h-4 w-4" />
          Homepage & Systems
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm p-8 max-w-xl mx-auto">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Admin Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm transition-all"
              />
            </div>

            <hr className="border-zinc-100 my-4" />

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">New Password (Optional)</label>
              <input
                type="password"
                placeholder="Leave empty to keep existing password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm transition-all"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-black hover:bg-zinc-900 disabled:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase shadow-sm transition-all cursor-pointer border-0"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-150 shadow-sm p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSiteSubmit} className="space-y-6">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest block mb-1">PROMOTIONAL BANNER</span>
              <label className="block text-xs font-bold text-zinc-650 uppercase tracking-wider mb-2">Top Banner Announcement Notice</label>
              <input
                type="text"
                value={siteForm.announcement}
                onChange={(e) => setSiteForm({...siteForm, announcement: e.target.value})}
                placeholder="e.g. 🔥 FREE SHIPPING ON ORDERS ABOVE INR 1,499"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#0071e3] outline-none text-sm transition-all font-semibold text-zinc-800"
              />
            </div>

            <hr className="border-zinc-100" />

            <div className="space-y-4">
              <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest block">HERO SLIDER CAROUSEL CONFIGURATIONS</span>
              
              <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl space-y-4">
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Hero Banner 1</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Title Overlay</label>
                    <input
                      type="text"
                      value={siteForm.heroTitle1}
                      onChange={(e) => setSiteForm({...siteForm, heroTitle1: e.target.value})}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Button CTA Label</label>
                    <input
                      type="text"
                      value={siteForm.heroButtonText1}
                      onChange={(e) => setSiteForm({...siteForm, heroButtonText1: e.target.value})}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Subtitle Description</label>
                  <input
                    type="text"
                    value={siteForm.heroSubtitle1}
                    onChange={(e) => setSiteForm({...siteForm, heroSubtitle1: e.target.value})}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-2xl space-y-4">
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Hero Banner 2</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Title Overlay</label>
                    <input
                      type="text"
                      value={siteForm.heroTitle2}
                      onChange={(e) => setSiteForm({...siteForm, heroTitle2: e.target.value})}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Button CTA Label</label>
                    <input
                      type="text"
                      value={siteForm.heroButtonText2}
                      onChange={(e) => setSiteForm({...siteForm, heroButtonText2: e.target.value})}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Subtitle Description</label>
                  <input
                    type="text"
                    value={siteForm.heroSubtitle2}
                    onChange={(e) => setSiteForm({...siteForm, heroSubtitle2: e.target.value})}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-zinc-200 text-xs focus:border-[#0071e3] outline-none"
                  />
                </div>
              </div>
            </div>

            <hr className="border-zinc-100" />

            <div className="space-y-4">
              <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest block">ORDER & SHIPPING PARAMETERS</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Base Shipping Charge (₹)</label>
                  <input
                    type="number"
                    value={siteForm.shippingCharge}
                    onChange={(e) => setSiteForm({...siteForm, shippingCharge: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:border-[#0071e3] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={siteForm.taxPercentage}
                    onChange={(e) => setSiteForm({...siteForm, taxPercentage: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:border-[#0071e3] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Free Shipping Min (₹)</label>
                  <input
                    type="number"
                    value={siteForm.freeShippingThreshold}
                    onChange={(e) => setSiteForm({...siteForm, freeShippingThreshold: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:border-[#0071e3] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-black hover:bg-zinc-900 disabled:bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase shadow-sm transition-all cursor-pointer border-0"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Publish Live Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
