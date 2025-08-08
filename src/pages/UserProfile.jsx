import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/Authcontext';
import {
  User, Phone, Mail, Calendar, Shield, Home, MessageSquare, Heart,
  Trash2, Edit3, Camera, Settings, Bell, Award, TrendingUp,
  MapPin, Building, CreditCard, LogOut, ChevronRight, Star,
  Plus, Filter, Search, Eye, Download, Upload, BarChart3,
  Users, DollarSign, Target, Clock, Briefcase, FileText,
  PieChart, Activity, Zap, Globe, ArrowUp, ArrowDown,
  Calendar as CalendarIcon, Phone as PhoneIcon, Mail as MailIcon,
  MousePointer, Percent, Timer, ChartLine,
  IndianRupee
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';

const UserProfile = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);
  const [requirements, setRequirements] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activePackage, setActivePackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Check if user is broker
  const isBroker = user?.userRole === 'BROKER';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatBHK = (bhkEnum) => {
    if (!bhkEnum) return 'BHK';
    const cleanEnum = bhkEnum.startsWith('_') ? bhkEnum.slice(1) : bhkEnum;
    const parts = cleanEnum.split('_');

    if (parts.length === 2 && parts[1] === 'RK') {
      return `${parts[0]} RK`;
    }

    const bhkNumber = parts.slice(0, -1).join('.');
    return `${bhkNumber} BHK`;
  };

  // Fetch functions - only using real API endpoints
  const fetchRequirements = async () => {
    if (user && user.id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/requirement/user/${user.id}`);
        if (!response.ok) {
          console.error('Failed to fetch requirements');
          return;
        }
        const data = await response.json();
        setRequirements(data);
      } catch (error) {
        console.error('Error fetching requirements:', error);
      }
    }
  };

  const fetchProperties = async () => {
    if (user && user.id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/properties/user/${user.id}`);
        if (!response.ok) {
          console.error('Failed to fetch properties');
          return;
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [user]);

  useEffect(() => {
    fetchProperties();
  }, [user]);

  // Handler functions
  const handleRequirementStatusChange = async (requirementId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/requirement/status/${requirementId}`,
        null,
        { params: { status: newStatus } }
      );
      await fetchRequirements();
      toast.success("Requirement status updated");
    } catch (error) {
      console.error("Error updating requirement status:", error);
      toast.error("Failed to update requirement status");
    }
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/properties/update-status/${propertyId}`,
        null,
        { params: { status: newStatus } }
      );
      await fetchProperties();
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    const fetchActivePackage = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/subscriptions/active-package/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch active package');
        }
        const data = await response.json();
        setActivePackage(data);
      } catch (error) {
        console.error('Error fetching active package:', error);
      }
    };
    if (activeTab === 'subscriptions') {
      fetchActivePackage();
    }
  }, [activeTab, user.id]);

  // Utility functions
  const handleDelete = async (confirmed = false) => {
    try {
      const url = new URL(`${import.meta.env.VITE_BASE_URL}/api/auth/delete-user/${user.id}`);
      if (confirmed) {
        url.searchParams.append('confirmed', 'true');
      }
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      if (!confirmed) {
        setShowModal(true);
      } else {
        alert('✅ Your account has been deleted successfully.');
        navigate("/signin");
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('❌ Failed to delete the account. Please try again later.');
    }
  };

  const confirmDelete = async () => {
    setShowModal(false);
    await handleDelete(true);
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const handleEdit = (property) => {
    navigate(`/editproperty/${property.propertyId}`);
  };

  const getUserData = (field, fallback = 'Not provided') => {
    if (!user) return fallback;
    return user[field] || fallback;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Not provided';
    return phone.startsWith('+91') ? phone : `+91 ${phone}`;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate real metrics from actual data
  const getCalculatedMetrics = () => {
    if (!properties || !requirements) return {};

    const activeProperties = properties.filter(p => p.status === 'ACTIVE' || p.status === 'Available');
    const activeRequirements = requirements.filter(r => r.status === 'ACTIVE');
    
    // Group properties by category
    const propertyByCategory = properties.reduce((acc, property) => {
      const category = property.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Group properties by BHK type
    const propertyByBHK = properties.reduce((acc, property) => {
      const bhk = formatBHK(property.bhkType) || 'Other';
      
      acc[bhk] = (acc[bhk] || 0) + 1;
      return acc;
    }, {});

    // Calculate average property price
    const totalValue = properties.reduce((sum, property) => {
      return sum + (property.expectedPrice || 0);
    }, 0);
    const avgPrice = properties.length > 0 ? totalValue / properties.length : 0;

    return {
      activeProperties: activeProperties.length,
      activeRequirements: activeRequirements.length,
      totalProperties: properties.length,
      totalRequirements: requirements.length,
      propertyByCategory,
      propertyByBHK,
      avgPrice,
      totalValue
    };
  };

  const metrics = getCalculatedMetrics();

  // Simple Chart Component using real data
  const SimpleBarChart = ({ data, title, color = '#6366f1' }) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
          <p className="text-sm text-gray-500">No data available</p>
        </div>
      );
    }

    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value], index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 w-20 truncate">{key}</span>
              <div className="flex-1 mx-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-900 w-6">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tabs configuration based on user role
  const tabs = isBroker ? [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'clients', label: 'Client Requirement', icon: Heart },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] : [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'requirements', label: 'Requirements', icon: Heart },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Stats cards using real data only
  const getStatsCards = () => {
    if (isBroker) {
      return [
        {
          title: 'Total Listings',
          value: metrics.totalProperties || 0,
          icon: Building,
          color: 'from-indigo-500 to-indigo-600',
          description: 'All property listings',
          subtitle: `${metrics.activeProperties || 0} active`
        },
        {
          title: 'Client Leads',
          value: metrics.totalRequirements || 0,
          icon: Users,
          color: 'from-emerald-500 to-emerald-600',
          description: 'Total client requirements',
          subtitle: `${metrics.activeRequirements || 0} active`
        },
        {
          title: 'Portfolio Value',
          value: `₹${metrics.totalValue ? (metrics.totalValue / 100000).toFixed(1) + 'L' : '0'}`,
          icon: IndianRupee,
          color: 'from-amber-500 to-amber-600',
          description: 'Total property value',
          subtitle: metrics.totalProperties > 0 ? `Avg: ₹${(metrics.avgPrice / 100000).toFixed(1)}L` : ''
        },
        {
          title: 'Active Subscriptions',
          value: activePackage ? 1 : 0,
          icon: CreditCard,
          color: 'from-green-500 to-green-600',
          description: 'Current packages'
        }
        // {
        //   title: 'Package Status',
        //   value: activePackage ? 'Active' : 'None',
        //   icon: Target,
        //   color: 'from-rose-500 to-rose-600',
        //   description: 'Current subscription',
        //   subtitle: activePackage ? `₹${activePackage.price.toLocaleString()}` : ''
        // }
      ];
    } else {
      return [
        {
          title: 'Total Properties',
          value: metrics.totalProperties || 0,
          icon: Home,
          color: 'from-blue-500 to-blue-600',
          description: 'Your property listings'
        },
        {
          title: 'Total Requirements',
          value: metrics.totalRequirements || 0,
          icon: Heart,
          color: 'from-purple-500 to-purple-600',
          description: 'Your requirements'
        },
        {
          title: 'Active Subscriptions',
          value: activePackage ? 1 : 0,
          icon: CreditCard,
          color: 'from-green-500 to-green-600',
          description: 'Current packages'
        }
      ];
    }
  };

  // Enhanced Broker Overview using only real data
  const renderBrokerOverview = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {getStatsCards().map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.title}</h3>
              <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">{stat.description}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-600 mt-1 font-medium">{stat.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Real Data Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <SimpleBarChart 
          title="Properties by Category" 
          data={metrics.propertyByCategory} 
          color="#8b5cf6" 
        />
        <SimpleBarChart 
          title="Properties by BHK Type" 
          data={metrics.propertyByBHK} 
          color="#06b6d4" 
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
          <Zap className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-yellow-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          <Link to="/postproperty" className="flex items-center p-3 lg:p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:from-indigo-100 hover:to-indigo-200 transition-all">
            <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-600 mr-3" />
            <div>
              <p className="font-semibold text-gray-900 text-sm lg:text-base">Add Property</p>
              <p className="text-xs lg:text-sm text-gray-600">List new property</p>
            </div>
          </Link>
          <button className="flex items-center p-3 lg:p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all">
            <Users className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600 mr-3" />
            <div>
              <p className="font-semibold text-gray-900 text-sm lg:text-base">View Clients</p>
              <p className="text-xs lg:text-sm text-gray-600">{metrics.totalRequirements || 0} total leads</p>
            </div>
          </button>
          <button className="flex items-center p-3 lg:p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all">
            <Building className="w-6 h-6 lg:w-8 lg:h-8 text-amber-600 mr-3" />
            <div>
              <p className="font-semibold text-gray-900 text-sm lg:text-base">Manage Properties</p>
              <p className="text-xs lg:text-sm text-gray-600">{metrics.totalProperties || 0} listings</p>
            </div>
          </button>
        </div>
      </div>

      {/* Real Portfolio Summary */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
          <Activity className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-blue-500" />
          Portfolio Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Active Properties</p>
                <p className="text-2xl font-bold text-blue-900">{metrics.activeProperties || 0}</p>
              </div>
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Out of {metrics.totalProperties || 0} total
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Active Leads</p>
                <p className="text-2xl font-bold text-green-900">{metrics.activeRequirements || 0}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 text-xs text-green-600">
              Out of {metrics.totalRequirements || 0} total
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Avg Property Value</p>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{metrics.avgPrice ? (metrics.avgPrice / 100000).toFixed(1) + 'L' : '0'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 text-xs text-purple-600">
              {metrics.totalProperties > 0 ? 'Based on current listings' : 'No data available'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Broker Analytics using real data
  const renderBrokerAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Real Data Analytics</h3>
        
        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          <SimpleBarChart title="Properties by Category" data={metrics.propertyByCategory} color="#10b981" />
          <SimpleBarChart title="Properties by BHK Type" data={metrics.propertyByBHK} color="#8b5cf6" />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 lg:p-6">
            <h4 className="font-semibold text-indigo-900 mb-4">Property Portfolio</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-indigo-700">Total Properties</span>
                <span className="font-bold text-indigo-900">{metrics.totalProperties || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700">Active Properties</span>
                <span className="font-bold text-indigo-900">{metrics.activeProperties || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700">Average Value</span>
                <span className="font-bold text-indigo-900">
                  ₹{metrics.avgPrice ? (metrics.avgPrice / 100000).toFixed(1) + 'L' : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700">Total Portfolio</span>
                <span className="font-bold text-indigo-900">
                  ₹{metrics.totalValue ? (metrics.totalValue / 10000000).toFixed(1) + 'Cr' : '0'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 lg:p-6">
            <h4 className="font-semibold text-emerald-900 mb-4">Client Insights</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-emerald-700">Total Requirements</span>
                <span className="font-bold text-emerald-900">{metrics.totalRequirements || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Active Requirements</span>
                <span className="font-bold text-emerald-900">{metrics.activeRequirements || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Subscription</span>
                <span className="font-bold text-emerald-900">{activePackage ? 'Active' : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Package Value</span>
                <span className="font-bold text-emerald-900">
                  ₹{activePackage ? activePackage.price.toLocaleString() : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Data Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Property Status</h4>
            <Building className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{metrics.activeProperties || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Active listings</p>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{
                width: `${metrics.totalProperties > 0 ? (metrics.activeProperties / metrics.totalProperties) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Client Engagement</h4>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{metrics.activeRequirements || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Active leads</p>
          <div className="mt-3 text-xs text-green-600">
            {metrics.totalRequirements > 0 
              ? `${((metrics.activeRequirements / metrics.totalRequirements) * 100).toFixed(1)}% active rate`
              : 'No requirements yet'
            }
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Package Usage</h4>
            <CreditCard className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {activePackage ? activePackage.remainingPostsUsed || 0 : 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Posts remaining</p>
          <div className="mt-3 text-xs text-purple-600">
            {activePackage ? `${activePackage.remainingContactsUsed || 0} contacts left` : 'No active package'}
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Broker Clients with real data
  const renderBrokerClients = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Client Management</h3>
          <p className="text-sm text-gray-600">
            {metrics.totalRequirements || 0} total requirements, {metrics.activeRequirements || 0} active
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
            Active: {metrics.activeRequirements || 0}
          </div>
          <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            Total: {metrics.totalRequirements || 0}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {requirements.length > 0 ? (
          requirements.map((requirement) => (
            <div key={requirement.requirementId} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 lg:p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  requirement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {requirement.status}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{requirement.lookingFor}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Type:</strong> {requirement.propertyType}</p>
                <p><strong>BHK:</strong> {requirement.bhkConfig}</p>
                <p><strong>Budget:</strong> ₹{requirement.minBudget?.toLocaleString()} - ₹{requirement.maxBudget?.toLocaleString()}</p>
                <p><strong>Locations:</strong> {requirement.preferredLocations?.join(', ')}</p>
                <p><strong>Phone:</strong> {requirement.phoneNumber}</p>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <select
                  value={requirement.status}
                  onChange={(e) => handleRequirementStatusChange(requirement.requirementId, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white flex-1 sm:flex-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
                {/* <a 
                  href={`tel:${requirement.phoneNumber}`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-2 bg-indigo-50 rounded-lg text-center"
                >
                  Call Now
                </a> */}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No client requirements yet</p>
            <p className="text-sm text-gray-400">Client requirements will appear here when available</p>
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced Broker Properties
  const renderBrokerProperties = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Property Portfolio</h3>
          <p className="text-sm text-gray-600">
            {metrics.totalProperties || 0} total properties, {metrics.activeProperties || 0} active
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            {/* <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-full sm:w-auto"
            /> */}
          </div>
          <Link to="/postproperty">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {properties.length > 0 ? (
          properties.slice(0, 1000).map((property) => (
            <div key={property.propertyId} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
                  alt={property.propertyName}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  property.status === 'Available' || property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  property.status === 'Under Review' || property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {property.status}
                </div>
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {property.category}
                </div>
              </div>
              <div className="p-4 lg:p-6">
                <h4 className="font-bold text-gray-900 mb-2 text-base lg:text-lg line-clamp-1">{property.propertyName}</h4>
                <p className="text-sm text-gray-600 mb-3 flex items-center line-clamp-1">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  {property.address?.area}, {property.address?.city} - {property.address?.pinCode}
                </p>
                <p className="text-xl lg:text-2xl font-bold text-indigo-600 mb-4">₹{property.expectedPrice?.toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                  <div>
                    <p><strong>Type:</strong> {property.propertyFor}</p>
                    <p><strong>BHK:</strong> {formatBHK(property.bhkType)}</p>
                  </div>
                  <div>
                    <p><strong>Furnished:</strong> {property.furnishedType}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <select
                    value={property.status}
                    onChange={(e) => handleStatusChange(property.propertyId, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No properties listed yet</p>
            <Link to="/postproperty">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all">
                List Your First Property
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  // Owner components (unchanged)
  const renderOwnerOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getStatsCards().map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">{stat.description}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Keep existing owner functions unchanged
  const renderOwnerProperties = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Properties</h3>
          <p className="text-sm text-gray-600">Manage your property listings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            /> */}
          </div>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.slice(0, 1000).map((property) => (
            <div key={property.propertyId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
                  alt={property.propertyName}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  property.status === 'Available' || property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  property.status === 'Under Review' || property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {property.status}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{property.propertyName}</h4>
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {property.address?.area}, {property.address?.city} - {property.address?.pinCode}
                </p>
                <p className="text-lg font-bold text-green-600 mb-3">₹{property.expectedPrice?.toLocaleString()}</p>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Category:</strong> {property.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {property.propertyFor}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>BHK Type:</strong> {formatBHK(property.bhkType)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Furnished Type:</strong> {property.furnishedType}
                  </p>
                  
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit
                  </button>
                  <select
                    value={property.status}
                    onChange={(e) => handleStatusChange(property.propertyId, e.target.value)}
                    className="mt-2 px-2 py-1 border text-sm rounded bg-white shadow-sm"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="text-gray-500 mb-4">You haven't posted any properties yet</p>
            <Link to="/postproperty">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Post Your First Property
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Requirements</h3>
          <p className="text-sm text-gray-600">Manage your property requirements</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requirements.length > 0 ? (
          requirements.map((requirement) => (
            <div key={requirement.requirementId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-900 mb-1">{requirement.lookingFor}</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Property Type:</strong> {requirement.propertyType}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>BHK Configuration:</strong> {requirement.bhkConfig}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Budget:</strong> ₹{requirement.minBudget?.toLocaleString()} - ₹{requirement.maxBudget?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Preferred Locations:</strong> {requirement.preferredLocations?.join(', ')}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Additional Requirements:</strong> {requirement.additionalRequirements}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Phone Number:</strong> {requirement.phoneNumber}
              </p>
              <p className={`text-sm font-medium ${requirement.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Status:</strong> {requirement.status}
              </p>
              <select
                value={requirement.status}
                onChange={(e) => handleRequirementStatusChange(requirement.requirementId, e.target.value)}
                className="mt-2 px-3 py-1 border text-sm rounded bg-white shadow-sm"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">You haven't added any requirements yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">My Subscriptions</h3>
      <p className="text-base text-gray-700">Manage your subscriptions</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePackage ? (
          <div className={`${isBroker ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6 transition-all hover:shadow-lg`}>
            <h4 className={`text-lg font-semibold ${isBroker ? 'text-indigo-700' : 'text-indigo-700'} mb-2`}>{activePackage.packageName}</h4>
            <p className="text-base text-gray-800 mb-2">
              <strong className="text-gray-900">Start Date:</strong> {new Date(activePackage.subscriptionStartDate).toLocaleDateString()}
            </p>
            <p className="text-base text-gray-800 mb-2">
              <strong className="text-gray-900">End Date:</strong> {new Date(activePackage.subscriptionEndDate).toLocaleDateString()}
            </p>
            <p className="text-base text-gray-800 mb-2">
              <strong className="text-gray-900">Remaining Posts:</strong> {activePackage.remainingPostsUsed}
            </p>
            <p className="text-base text-gray-800 mb-2">
              <strong className="text-gray-900">Remaining Contacts:</strong> {activePackage.remainingContactsUsed}
            </p>
            <p className="text-base text-gray-800">
              <strong className="text-gray-900">Price:</strong> ₹{activePackage.price.toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-base text-gray-700">No active subscriptions found.</p>
        )}
      </div>
    </div>
  );

  const renderUserInfo = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">First Name</label>
            <p className="text-gray-900 font-medium">{getUserData('firstName')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Last Name</label>
            <p className="text-gray-900 font-medium">{getUserData('lastName')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900 font-medium">{getUserData('email')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone Number</label>
            <p className="text-gray-900 font-medium">{formatPhoneNumber(getUserData('phoneNumber'))}</p>
          </div>
        </div>
        <div className="space-y-4">
          {getUserData('userRole') === 'BROKER' && (
            <div>
              <label className="text-sm font-medium text-gray-500">RERA Number</label>
              <p className="text-gray-900 font-medium">{getUserData('reraNumber', 'N/A')}</p>
            </div>
          )}
          <div className={`${isBroker ? 'bg-gradient-to-br from-indigo-50 to-purple-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-xl p-4 shadow-inner`}>
            <div className="flex items-center space-x-4">
              <div className={`h-12 w-12 rounded-full ${isBroker ? 'bg-indigo-200 text-indigo-700' : 'bg-blue-200 text-blue-700'} flex items-center justify-center font-bold text-lg`}>
                {getUserData('firstName')?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Role:</p>
                <p className={`${isBroker ? 'text-indigo-700' : 'text-blue-700'} font-semibold uppercase text-sm`}>{getUserData('userRole')}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-1">You are currently logged in as a registered <span className={`font-medium ${isBroker ? 'text-indigo-800' : 'text-blue-800'}`}>{getUserData('userRole')}</span>.</p>
              <p>Make sure your profile is up-to-date.</p>
            </div>
          </div>
        </div>
      </div>
      {user.address && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-base font-semibold text-gray-900 mb-3">Address</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900">{user.address.street}</p>
            <p className="text-gray-600">{user.address.area} - {user.address.pinCode}</p>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => handleDelete(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
            >
              Delete Account
            </button>
            {showModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
                  <h2 className="text-lg font-semibold mb-4">Do you really want to delete this account?</h2>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={cancelDelete}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                    >
                      No
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${isBroker ? 'bg-gradient-to-br from-slate-50 to-indigo-50' : 'bg-gray-50'}`}>
      {/* Header Section - Mobile Optimized */}
      <div className={`${isBroker ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white' : 'bg-white border-b border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4 lg:py-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 lg:gap-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="relative">
                <img
                  src={profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt="Profile"
                  className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 ${isBroker ? 'border-white' : 'border-white'} shadow-lg`}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute bottom-0 right-0 ${isBroker ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-blue-600 hover:bg-blue-700'} text-white p-1.5 lg:p-2 rounded-full transition-colors shadow-lg`}
                >
                  <Camera className="w-3 h-3" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h1 className={`text-xl lg:text-2xl font-bold ${isBroker ? 'text-white' : 'text-gray-900'}`}>
                  {getUserData('firstName')} {getUserData('lastName')}
                </h1>
                <p className={`${isBroker ? 'text-indigo-100' : 'text-gray-600'} flex items-center text-sm lg:text-base`}>
                  {isBroker && <Briefcase className="w-4 h-4 mr-1" />}
                  {getUserData('userRole')}
                  {isBroker && getUserData('reraNumber') && (
                    <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                      RERA: {getUserData('reraNumber')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* Mobile-Optimized Tabs Navigation */}
          <div className="mt-4 lg:mt-6">
            <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-3 lg:py-4 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? isBroker 
                        ? 'border-white text-white' 
                        : 'border-blue-500 text-blue-600'
                      : isBroker
                        ? 'border-transparent text-indigo-100 hover:text-white hover:border-indigo-200'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-1 lg:mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content Section - Mobile Optimized */}
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl">
        {activeTab === 'overview' && (isBroker ? renderBrokerOverview() : renderOwnerOverview())}
        {activeTab === 'analytics' && isBroker && renderBrokerAnalytics()}
        {activeTab === 'clients' && isBroker && renderBrokerClients()}
        {activeTab === 'requirements' && !isBroker && renderRequirements()}
        {activeTab === 'properties' && (isBroker ? renderBrokerProperties() : renderOwnerProperties())}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'settings' && renderUserInfo()}
      </div>
    </div>
  );
};

export default UserProfile;
