import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { Search, Building, User, Plus, Star, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
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
  const [filters, setFilters] = useState({
    lookingFor: '',
    propertyType: '',
    bhkConfig: '',
    preferredLocations: [],
  });
  const [enums, setEnums] = useState({
    propertyFor: [],
    apartmentType: [],
    bhkType: [],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/properties/all_enum`);
        setEnums(response.data);
      } catch (error) {
        console.error("Error fetching enums:", error);
      }
    };

    fetchEnums();
  }, []);

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please log in to make a call or message.");
    }
  };

  const handleContactClick = async (event, requirement, type) => {
  event.preventDefault();

  if (!user) {
    toast.error("You must be logged in to contact.");
    return;
  }

  if (!requirement?.requirementId) {
    toast.error("Invalid requirement data.");
    console.error("Requirement object missing requirementId:", requirement);
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/requirement/use-contact`,
      null,
      {
        params: {
          userId: user.id,
          requirementId: requirement.requirementId,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    toast.success(response.data.message);

    // After backend success, trigger contact action
    if (type === "call") {
      window.location.href = `tel:${requirement.phoneNumber}`;
    } else if (type === "whatsapp") {
      window.open(`https://wa.me/${requirement.phoneNumber}`, "_blank");
    }

  } catch (error) {
    const errorMsg = error?.response?.data?.message || "Unable to use contact.";
    toast.error(errorMsg);
  }
};

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/requirement/all`, {
        params: { page, size, ...filters },
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
    fetchRequirements();
  }, [page, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const clearFilters = () => {
    setFilters({
      lookingFor: '',
      propertyType: '',
      bhkConfig: '',
      preferredLocations: [],
    });
  };

  const formatBHK = (bhkEnum) => {
  if (!bhkEnum) return 'BHK';

  // Remove leading underscore
  const cleanEnum = bhkEnum.startsWith('_') ? bhkEnum.slice(1) : bhkEnum;

  const parts = cleanEnum.split('_');

  // RK case
  if (parts.length === 2 && parts[1] === 'RK') {
    return `${parts[0]} RK`;
  }

  // BHK cases (remove last part 'BHK' and join the rest with dot)
  const bhkNumber = parts.slice(0, -1).join('.'); // e.g. ['2', '5'] => "2.5"
  return `${bhkNumber} BHK`;
};

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {/* <div className="relative flex-1 max-w-xs">
              <select
                value={filters.lookingFor}
                onChange={(e) => handleFilterChange('lookingFor', e.target.value)}
                className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">Looking For</option>
                {enums.propertyFor?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 max-w-xs">
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">Property Type</option>
                {enums.apartmentType?.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 max-w-xs">
              <select
                value={filters.bhkConfig}
                onChange={(e) => handleFilterChange('bhkConfig', e.target.value)}
                className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">BHK Config</option>
                {enums.bhkType?.map((item) => (
                  <option key={item} value={item}>{formatBHK(item)}</option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 max-w-xs">
              <select
                value={filters.preferredLocations}
                onChange={(e) => handleFilterChange('preferredLocations', [e.target.value])}
                className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">Preferred Locations</option>
                <option value="Bibwewadi">Bibwewadi</option>
                <option value="Baner">Baner</option>
                <option value="Kothrud">Kothrud</option>
                <option value="Kharadi">Kharadi</option>
                <option value="Wakad">Wakad</option>
              </select>
            </div> */}
            <button
              onClick={clearFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requirements.length > 0 ? (
                  requirements.map((requirement, index) => (
                    <tr key={requirement.requirementId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-2 py-4">
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
                          {/* <a
                            href={user ? `tel:${requirement.phoneNumber}` : "#"}
                            onClick={handleClick}
                            className={`inline-flex items-center gap-1 ${
                              user ? "bg-blue-700 hover:bg-blue-800 cursor-pointer" : "bg-gray-400 cursor-not-allowed"
                            } text-white text-xs font-medium py-1.5 px-3 rounded-full shadow transition duration-200 ${
                              user ? "hover:scale-105" : ""
                            }`}
                          >
                            <Phone size={14} /> Call
                          </a> */}

                          <a
                                                href={user ? `tel:${requirement.phoneNumber}` : "#"}
                                                onClick={(e) => handleContactClick(e, req, "call")}
                                                className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 ${
                                                  user ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl" : "bg-gray-400 cursor-not-allowed shadow-sm sm:shadow-md"
                                                } text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 ${
                                                  user ? "hover:scale-105 active:scale-95" : ""
                                                } flex-1 xs:flex-none min-w-0`}
                                              >
                                                <Phone size={14} className={`sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${user ? "group-hover:animate-pulse" : ""} flex-shrink-0`} />
                                                <span className="truncate">Call Now</span>
                                              </a>
                          


                          {/* <a
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
                          </a> */}


                          <a
                                                href={user ? `https://wa.me/${requirement.phoneNumber}` : "#"}
                                                onClick={(e) => handleContactClick(e, req, "whatsapp")}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 ${
                                                  user ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl" : "bg-gray-400 cursor-not-allowed shadow-sm sm:shadow-md"
                                                } text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 ${
                                                  user ? "hover:scale-105 active:scale-95" : ""
                                                } flex-1 xs:flex-none min-w-0`}
                                              >
                                                <MessageCircle size={14} className={`sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${user ? "group-hover:animate-bounce" : ""} flex-shrink-0`} />
                                                <span className="truncate">WhatsApp</span>
                                              </a>

                        </div>
                      </td>
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
