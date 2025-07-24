import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Search, Building, User, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { Phone, MessageCircle } from "lucide-react"; // or use react-icons if preferred
import { AuthContext } from '../context/Authcontext';

const FeaturedRequirement = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please log in to make a call or message.");
    }
  };

 const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/requirement/all`, {
        params: { page, size },
      });
      const data = response.data;
      setRequirements(data.content || []);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRequirements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRequirements();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Loading requirements...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-4 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Featured Requirements</h1>
                <p className="text-sm text-gray-600">Manage and view all property requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Requirements Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr. No.</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Looking For</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Property Type</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">BHK Config</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Budget Range</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Preferred Locations</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Additional Requirements</th>
                  <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  {/* <th className="px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requirements.length > 0 ? (
                  requirements.map((requirement, index) => (
                    <tr key={requirement.requirementId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-2 py-4">{requirement.lookingFor}</td>
                      <td className="px-2 py-4">{requirement.propertyType}</td>
                      <td className="px-2 py-4">{requirement.bhkConfig}</td>
                      <td className="px-2 py-4">₹{requirement.minBudget} - ₹{requirement.maxBudget}</td>
                      <td className="px-2 py-4">{requirement.preferredLocations?.join(', ')}</td>
                      <td className="px-2 py-4">{requirement.additionalRequirements}</td>
                      <td className="px-2 py-4">
  <div className="flex gap-2">
    {/* Call Button */}
    <a
      href={user ? `tel:${requirement.phoneNumber}` : "#"}
      onClick={handleClick}
      className={`inline-flex items-center gap-1 ${
        user ? "bg-blue-700 hover:bg-blue-800 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
      } text-white text-xs font-medium py-1.5 px-3 rounded-full shadow transition duration-200 ${
        user ? "hover:scale-105" : ""
      }`}
    >
      <Phone size={14} /> Call
    </a>

    {/* WhatsApp Button */}
    <a
      href={user ? `https://wa.me/${requirement.phoneNumber}` : "#"}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 ${
        user ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-400 cursor-not-allowed"
      } text-white text-xs font-medium py-1.5 px-3 rounded-full shadow transition duration-200 ${
        user ? "hover:scale-105" : ""
      }`}
    >
      <MessageCircle size={14} /> WhatsApp
    </a>
  </div>
</td>
                      {/* <td className="px-2 py-4">{requirement.phoneNumber}</td> */}
                      {/* <td className="px-2 py-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{requirement.phoneNumber}</span>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-gray-600">No requirements found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedRequirement;
