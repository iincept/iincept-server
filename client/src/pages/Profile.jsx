import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Mail, Phone, MapPin, Edit, Plus, Trash2, 
  CheckCircle2, Package, Clock, Eye, X, ArrowRight, Save
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { updateUser } from '../redux/authSlice';
import { cancelOrder } from '../redux/orderSlice';
import axiosClient from '../services/axiosClient';

export default function Profile() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  // Load addresses dynamically from backend
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    try {
      const response = await axiosClient.get('/address');
      setAddresses(response.data || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Profile Edit Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setEditedProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '9876543210'
      });
    }
  }, [user]);

  // Add Address Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Selected Order for Details Modal
  const [activeOrderDetail, setActiveOrderDetail] = useState(null);

  // Tab switching helper
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    dispatch(updateUser(editedProfile));
    setIsEditing(false);
    alert('Profile details updated successfully!');
  };

  const handleMakeDefaultAddress = async (id) => {
    const addr = addresses.find(a => (a._id || a.id) === id);
    if (!addr) return;
    try {
      await axiosClient.put(`/address/${id}`, {
        fullName: addr.fullName,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        isDefault: true
      });
      fetchAddresses();
      alert('Default address updated!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update default address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axiosClient.delete(`/address/${id}`);
        fetchAddresses();
        alert('Address deleted successfully!');
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to delete address.');
      }
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      alert('Please fill out all address fields.');
      return;
    }

    try {
      await axiosClient.post('/address', {
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        address: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        isDefault: newAddress.isDefault
      });
      fetchAddresses();
      setNewAddress({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      setShowAddForm(false);
      alert('Address added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to add address.');
    }
  };

  const handleCancelOrderClick = (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(id));
      alert(`Order #${id} has been cancelled.`);
      if (activeOrderDetail?.id === id) {
        setActiveOrderDetail(prev => prev ? { ...prev, orderStatus: 'Cancelled' } : null);
      }
    }
  };

  const sidebarItems = [
    {
      label: 'Personal Info',
      icon: User,
      onClick: () => setActiveTab('details'),
      isActive: activeTab === 'details'
    },
    {
      label: 'Saved Addresses',
      icon: MapPin,
      onClick: () => setActiveTab('addresses'),
      isActive: activeTab === 'addresses',
      badge: addresses.length
    },
    {
      label: 'Order History',
      icon: Package,
      onClick: () => setActiveTab('orders'),
      isActive: activeTab === 'orders',
      badge: orders.length
    }
  ];

  const STATUS_THEMES = {
    Pending: 'bg-amber-600/10 text-amber-400 border border-amber-500/20',
    Processing: 'bg-blue-600/10 text-blue-400 border border-blue-500/20',
    Shipped: 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20',
    Delivered: 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20',
    Cancelled: 'bg-rose-600/10 text-rose-400 border border-rose-500/20'
  };

  return (
    <div className="space-y-8 py-2 text-left animate-in fade-in duration-300">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Avatar */}
        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 border border-slate-850 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shrink-0">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        {/* User Quick Info */}
        <div className="space-y-1 text-center sm:text-left flex-grow">
          <h1 className="text-2xl font-extrabold text-white">{user?.name || 'Guest User'}</h1>
          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="h-3.5 w-3.5 text-violet-400" />
            {user?.email || 'N/A'}
          </p>
          <span className="inline-block px-3 py-1 bg-violet-600/10 text-violet-400 border border-violet-500/20 text-[10px] font-bold rounded-full mt-2">
            Verified Customer
          </span>
        </div>

        {/* Toggle Edit Button */}
        {activeTab === 'details' && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-semibold hover:border-slate-700 transition-colors"
          >
            <Edit className="h-3.5 w-3.5 text-violet-400" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left pane: Sidebar */}
        <Sidebar title="My Account" items={sidebarItems} />

        {/* Right pane: Active Tab Content */}
        <div className="flex-grow w-full space-y-6">
          
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'details' && (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-5 shadow-xl">
              <h2 className="font-bold text-lg border-b border-slate-850 pb-3 flex items-center gap-2 text-white">
                <User className="h-5 w-5 text-violet-400" />
                Personal Details
              </h2>

              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Phone Number</label>
                      <input 
                        type="tel" 
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 text-xs rounded-xl py-2.5 px-3.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit"
                      className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setEditedProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '9876543210' }); setIsEditing(false); }}
                      className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-450 hover:text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-2 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-500">Name</span>
                    <p className="text-slate-200 font-bold text-sm">{user?.name || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-500">Email</span>
                    <p className="text-slate-200 font-bold text-sm">{user?.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-500">Phone</span>
                    <p className="text-slate-200 font-bold text-sm">{editedProfile.phone || '9876543210'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <h2 className="font-bold text-lg flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5 text-violet-400" />
                  Saved Shipping Addresses
                </h2>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-violet-500/40 text-violet-400 rounded-xl hover:bg-violet-955/20 text-xs font-bold transition-all cursor-pointer"
                >
                  {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  {showAddForm ? 'Close' : 'Add New'}
                </button>
              </div>

              {/* Add Address Form Panel */}
              {showAddForm && (
                <form onSubmit={handleAddAddress} className="p-5 border border-violet-955/40 bg-violet-955/5 bg-violet-950/5 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">New shipping address</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-550 tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-555 tracking-wider">Phone Number</label>
                      <input 
                        type="tel" 
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="9876543210"
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-slate-555 tracking-wider">Address Details</label>
                      <input 
                        type="text" 
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        placeholder="Flat no., Building name, Street name"
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-555 tracking-wider">City</label>
                      <input 
                        type="text" 
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="City"
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-555 tracking-wider">State</label>
                      <input 
                        type="text" 
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="State"
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-555 tracking-wider">Pincode</label>
                      <input 
                        type="text" 
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="400001"
                        className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-200 focus:outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="isDefault" 
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                        className="rounded border-slate-800 bg-slate-950 text-violet-600 focus:ring-violet-500 h-4 w-4"
                      />
                      <label htmlFor="isDefault" className="text-slate-400 font-semibold cursor-pointer">Set as default shipping address</label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit"
                      className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Save Address
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-450 hover:text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="sm:col-span-2 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                    No addresses saved yet. Click 'Add New' to add shipping addresses.
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div 
                      key={addr._id || addr.id}
                      className={`p-4 rounded-xl border text-xs space-y-2.5 relative transition-colors ${addr.isDefault ? 'border-violet-500 bg-violet-950/10' : 'border-slate-800 bg-slate-955/40 bg-slate-950/40'}`}
                    >
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 text-[10px] text-violet-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Default
                        </span>
                      )}
                      
                      <div className="space-y-0.5 text-slate-350 pr-16">
                        <p className="font-extrabold text-slate-200">{addr.fullName}</p>
                        <p>{addr.address}</p>
                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-slate-500 font-semibold mt-1">{addr.phone}</p>
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t border-slate-850/60">
                        {!addr.isDefault && (
                          <button 
                            onClick={() => handleMakeDefaultAddress(addr._id || addr.id)}
                            className="text-[10px] font-bold text-violet-400 hover:text-violet-300 hover:underline cursor-pointer bg-transparent border-0"
                          >
                            Make Default
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteAddress(addr._id || addr.id)}
                          className="text-[10px] font-bold text-rose-400 hover:text-rose-350 hover:underline flex items-center gap-0.5 ml-auto cursor-pointer bg-transparent border-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6 shadow-xl">
              <h2 className="font-bold text-lg border-b border-slate-850 pb-3 flex items-center gap-2 text-white">
                <Package className="h-5 w-5 text-violet-400" />
                Order History
              </h2>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-4">
                    <Package className="h-10 w-10 mx-auto text-slate-700" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-400">No Orders Found</p>
                      <p className="text-xs text-slate-550 max-w-xs mx-auto">You have not placed any orders yet. Head to the store to make a checkout.</p>
                    </div>
                    <Link 
                      to="/shop" 
                      className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Shop Products
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div 
                      key={order.id}
                      className="p-5 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-4 hover:border-slate-800 transition-colors"
                    >
                      {/* Order Info Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-850/60 pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Order ID</span>
                          <p className="font-extrabold text-sm text-slate-200">#{order.id}</p>
                        </div>
                        
                        <div className="space-y-0.5 text-right sm:text-left">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Date Placed</span>
                          <p className="text-xs text-slate-350">{order.createdAt}</p>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${STATUS_THEMES[order.orderStatus] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {order.orderStatus}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="text-xs space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-slate-400">
                            <span>{item.name} <strong className="text-slate-500 font-semibold">x{item.quantity}</strong></span>
                            <span className="font-bold text-slate-300">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-850/60 gap-4">
                        <div className="flex gap-4 text-[10px] text-slate-500 font-semibold uppercase">
                          <span>Method: <strong className="text-slate-300">{order.paymentMethod ? order.paymentMethod.toUpperCase() : 'COD'}</strong></span>
                          <span>Payment: <strong className="text-slate-350">{order.paymentStatus || 'Pending'}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-extrabold text-base text-white">${Number(order.totalAmount).toFixed(2)}</span>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setActiveOrderDetail(order)}
                              className="p-2 bg-slate-950 border border-slate-850 hover:border-violet-500/40 text-violet-400 rounded-xl hover:bg-violet-955/20 transition-all cursor-pointer"
                              aria-label="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
                              <button 
                                onClick={() => handleCancelOrderClick(order.id)}
                                className="px-3 py-1.5 bg-rose-955/20 text-rose-400 hover:bg-rose-955/40 hover:text-rose-300 text-xs font-bold rounded-xl border border-rose-950/30 transition-colors cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Order Details Modal Overlay */}
      {activeOrderDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/20">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-white">Order Details</h3>
                <p className="text-xs text-slate-500">ID: #{activeOrderDetail.id}</p>
              </div>
              <button 
                onClick={() => setActiveOrderDetail(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-left max-h-[70vh] overflow-y-auto">
              
              {/* Status Timeline */}
              <div className="space-y-2">
                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tracking Information</h4>
                <div className="relative pl-6 border-l border-slate-800 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-8 top-0.5 h-4 w-4 rounded-full bg-violet-600 border border-slate-950 flex items-center justify-center shadow">
                      <Clock className="h-2.5 w-2.5 text-white" />
                    </div>
                    <p className="font-bold text-slate-200">Order Placed & Verified</p>
                    <span className="text-[10px] text-slate-500">{activeOrderDetail.createdAt}</span>
                  </div>
                  {activeOrderDetail.orderStatus !== 'Cancelled' ? (
                    <>
                      <div className="relative">
                        <div className={`absolute -left-8 top-0.5 h-4 w-4 rounded-full border border-slate-950 flex items-center justify-center shadow ${
                          ['Processing', 'Shipped', 'Delivered'].includes(activeOrderDetail.orderStatus) ? 'bg-violet-500' : 'bg-slate-800'
                        }`} />
                        <p className={`font-bold ${['Processing', 'Shipped', 'Delivered'].includes(activeOrderDetail.orderStatus) ? 'text-slate-200' : 'text-slate-500'}`}>
                          Processing in Warehouse
                        </p>
                        <span className="text-[10px] text-slate-550">Items packaging under process</span>
                      </div>
                      <div className="relative">
                        <div className={`absolute -left-8 top-0.5 h-4 w-4 rounded-full border border-slate-950 flex items-center justify-center shadow ${
                          ['Shipped', 'Delivered'].includes(activeOrderDetail.orderStatus) ? 'bg-violet-500' : 'bg-slate-800'
                        }`} />
                        <p className={`font-bold ${['Shipped', 'Delivered'].includes(activeOrderDetail.orderStatus) ? 'text-slate-200' : 'text-slate-500'}`}>
                          Shipped & Out for Delivery
                        </p>
                        <span className="text-[10px] text-slate-550">Awaiting transit scan details</span>
                      </div>
                    </>
                  ) : (
                    <div className="relative">
                      <div className="absolute -left-8 top-0.5 h-4 w-4 rounded-full bg-rose-600 border border-slate-950 flex items-center justify-center shadow">
                        <X className="h-2.5 w-2.5 text-white" />
                      </div>
                      <p className="font-bold text-rose-400">Cancelled</p>
                      <span className="text-[10px] text-slate-550">Order cancellation process complete.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3 border-t border-slate-850 pt-4">
                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Items summary</h4>
                <div className="space-y-2 bg-slate-950/20 border border-slate-850 rounded-xl p-3">
                  {activeOrderDetail.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-350">
                      <span>{item.name} <strong className="text-slate-500">x{item.quantity}</strong></span>
                      <span className="font-bold text-slate-200">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Breakdown */}
              <div className="border-t border-slate-850 pt-4 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Payment Method</span>
                  <span className="font-bold text-slate-200 capitalize">{activeOrderDetail.paymentMethod || 'COD'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payment Status</span>
                  <span className="font-bold text-slate-200">{activeOrderDetail.paymentStatus || 'Pending'}</span>
                </div>
                <div className="flex justify-between text-slate-200 font-bold text-sm pt-2 border-t border-slate-850/60">
                  <span>Grand Total</span>
                  <span className="text-violet-400">${Number(activeOrderDetail.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex justify-end gap-3">
              {(activeOrderDetail.orderStatus === 'Pending' || activeOrderDetail.orderStatus === 'Processing') && (
                <button 
                  onClick={() => handleCancelOrderClick(activeOrderDetail.id)}
                  className="px-4 py-2 bg-rose-955/20 hover:bg-rose-955/40 border border-rose-950/30 text-rose-450 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Cancel Order
                </button>
              )}
              <button 
                onClick={() => setActiveOrderDetail(null)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
