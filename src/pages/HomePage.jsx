import React, { useState, useEffect, useContext } from 'react';
import { Search, Star, Phone, MessageCircle, User , Share2, MapPin, Home, Building, Users, Filter, Menu, X, ChevronLeft, ChevronRight, Calendar, ChartArea, Square, Maximize,FileText  } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../context/Authcontext";
import { toast } from 'react-toastify';
import { UserIcon } from '@heroicons/react/24/solid';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getRelativeTime = (timestamp) => {
  const now = dayjs();
  const created = dayjs(timestamp);
  const diffInMinutes = now.diff(created, "minute");

  if (diffInMinutes < 60) {
    return "Just now";
  }
  return created.fromNow(); // e.g., "2 hours ago", "3 days ago"
};

  
const HomePage = () => {
  const [requirements, setRequirements] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useContext(AuthContext);
  const [transactionType, setTransactionType] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [loading,setLoading] = useState([]);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/requirement/all`, {
        params: { page, size },
      });
      const data = response.data;
      // Filter requirements to only include those with status "ACTIVE"
      const activeRequirements = data.content.filter(requirements => requirements.status === 'ACTIVE');
      setRequirements(activeRequirements);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRequirements([]);
    } finally {
      setLoading(false);
    }
  };



  // Navigation functions
const prevSlide = () => {
  setCurrentSlide((prev) => (prev === 0 ? requirements.length - 1 : prev - 1));
};

const nextSlide = () => {
  setCurrentSlide((prev) => (prev === requirements.length - 1 ? 0 : prev + 1));
};

const goToSlide = (index) => {
  setCurrentSlide(index);
};

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
  navigate('/listing', {
    state: {
      propertyName: searchTerm,
      propertyFor: transactionType,
      selectedLocations: selectedLocations,
    },
  });
};

  const toggleLocation = (location) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const formatPrice = (price) => {
  if (price >= 10000000) return `${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)}Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)}L`;
  if (price >= 1000) return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
  return price;
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

  const bhkNumber = parts.slice(0, -1).join('.'); 
  return `${bhkNumber} BHK`;
};

  const handleClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Please log in to make a call or message.");
    }
  };


const handleCallClick = async (event, property) => {
  event.preventDefault();

  if (!user) {
    toast.error("You must be logged in to make a call.");
    return;
  }

  if (!property || !property.postedByUserId) {
    toast.error("Invalid property details.");
    console.error("Invalid property object:", property);
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/subscriptions/use-contact-or-chat`,
      null,
      {
        params: {
          userId: user.id,
          propertyId: property.propertyId,
        },
      }
    );

    toast.success(response?.data?.message || "Connecting agent...");

    setTimeout(() => {
      window.location.href = `tel:${property.postedByUserPhoneNumber || ''}`;
    }, 500);

  } catch (error) {
    console.error("Error accessing contact:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.statusText ||
      "Something went wrong while accessing contact.";

    toast.error(errorMessage);
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




  useEffect(() => {
    const getRequirements = async () => {
      const data = await fetchRequirements();
      setRequirements(data);
    };

    getRequirements();
  }, []);

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const page = 0;  // first page
      const size = 100; // fetch up to 20 to safely get enough RENT and SELL
      const sort = 'propertyId';
      const direction = 'asc';

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/properties/get`,
        {
          params: { page, size, sort, direction },
        }
      );

      // Paginated response has 'content' field containing the properties array
      const allProperties = response.data.content || [];

      // Filter and slice top 3 RENT and SELL properties
      const rentProperties = allProperties.filter(
        (property) => property.propertyFor === 'RENT'
      ).slice(0, 3);

      const saleProperties = allProperties.filter(
        (property) => property.propertyFor === 'SELL'
      ).slice(0, 3);

      const featuredProps = [...rentProperties, ...saleProperties];

      setFeaturedProperties(featuredProps);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  fetchProperties();
}, []);




  const projects = [
    {
      id: 1,
      title: "Skyline Residences",
      subtitle: "Premium 2 & 3 BHK Apartments",
      location: "Baner, Pune",
      price: "₹85 Lakh - ₹1.2 Cr",
      status: "60% Complete",
      completion: "Dec 2025",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      badge: "New Launch",
      badgeColor: "bg-green-500"
    },
    {
      id: 2,
      title: "Heritage Gardens",
      subtitle: "Luxury Villa Community",
      location: "Kharadi, Pune",
      price: "₹1.8 Cr - ₹2.5 Cr",
      status: "40% Complete",
      completion: "Mar 2026",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      badge: "Premium",
      badgeColor: "bg-purple-500"
    },
    {
      id: 3,
      title: "Tech Park Towers",
      subtitle: "Smart 1, 2 & 3 BHK Homes",
      location: "Hinjewadi, Pune",
      price: "₹55 Lakh - ₹95 Lakh",
      status: "75% Complete",
      completion: "Aug 2025",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      badge: "Fast Track",
      badgeColor: "bg-orange-500"
    },
    {
      id: 4,
      title: "Riverside Enclave",
      subtitle: "Waterfront Apartments",
      location: "Wakad, Pune",
      price: "₹70 Lakh - ₹1.1 Cr",
      status: "30% Complete",
      completion: "Jun 2026",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      badge: "Exclusive",
      badgeColor: "bg-blue-500"
    }
  ];

  // For projects slider
const [projectSlide, setProjectSlide] = useState(0);
const [isProjectAutoPlaying, setIsProjectAutoPlaying] = useState(true);

const prevSlide1 = () => {
  setProjectSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
};

const nextSlide1 = () => {
  setProjectSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
};

const goToSlide1 = (index) => {
  setProjectSlide(index);
};

const handleProjectMouseEnter = () => 
  setIsProjectAutoPlaying(false);

const handleProjectMouseLeave = () => 
  setIsProjectAutoPlaying(true);

useEffect(() => {
  if (!isProjectAutoPlaying || projects.length <= 1) return;

  const interval = setInterval(() => {
    nextSlide1();
  }, 4000);

  return () => clearInterval(interval);
}, [projectSlide, isProjectAutoPlaying, projects.length]);


  useEffect(() => {
  if (!isAutoPlaying || requirements.length <= 1) return;

  const interval = setInterval(() => {
    nextSlide();
  }, 4000);

  return () => clearInterval(interval);
}, [currentSlide, isAutoPlaying, requirements.length]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  

  return (
    <div className="min-h-screen bg-white">
     {/* Search Section */}
<section className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-4 sm:py-6 md:py-8 overflow-hidden">
  {/* Enhanced Background Pattern */}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-50/20 to-transparent"></div>
    <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-gradient-to-r from-blue-300/20 to-blue-400/30 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
    <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-gradient-to-r from-blue-200/25 to-blue-300/35 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
    <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-gradient-to-r from-white/40 to-blue-100/50 rounded-full blur-lg sm:blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
    
    {/* Geometric dots - Hidden on very small screens */}
    <div className="hidden sm:block absolute top-20 left-20 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce"></div>
    <div className="hidden sm:block absolute top-40 left-40 w-1 h-1 bg-blue-500/50 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
    <div className="hidden sm:block absolute bottom-40 right-40 w-3 h-3 bg-blue-300/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
  </div>

  <div className="relative w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
    {/* Search Container with Enhanced Glass Effect */}
    <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-5 md:p-6 border border-white/30 hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500">
      
      {/* Search Bar with Enhanced Styling */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <div className="relative group">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 sm:w-5 h-4 sm:h-5 z-10 group-focus-within:text-blue-600 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search by property name..."
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-blue-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/90 backdrop-blur-sm placeholder-gray-500 hover:border-blue-300 shadow-sm hover:shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {/* Transaction Type with Enhanced Design */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <h3 className="text-sm sm:text-base font-bold text-gray-700 mb-3 sm:mb-4 text-center flex items-center justify-center gap-2">
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full"></div>
          Transaction Type
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full"></div>
        </h3>
        <div className="flex justify-center gap-2 sm:gap-3 ">
          {["RENT", "BUY"].map((option) => (
            <button
              key={option}
              onClick={() => setTransactionType(option)}
              className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3  rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 relative overflow-hidden group flex-1 max-w-[120px] sm:max-w-none ${
                transactionType === option
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-300/50'
                  : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
              }`}
            >
              <span className="relative z-10">{option}</span>
              {transactionType !== option && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Location Selection with Enhanced Chips */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <h3 className="text-sm sm:text-base font-bold text-gray-700 mb-3 sm:mb-4 text-center flex items-center justify-center gap-2">
          <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
          Select Locations
        </h3>
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
          {["Bibwewadi", "Baner", "Kothrud", "Kharadi", "Wakad"].map((location) => (
            <button
              key={location}
              onClick={() => toggleLocation(location)}
              className={`px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 relative overflow-hidden group ${
                selectedLocations.includes(location)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-300/50'
                  : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
              }`}
            >
              <span className="relative z-10 truncate">{location}</span>
              {!selectedLocations.includes(location) && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          ))}
        </div>
        {selectedLocations.length > 0 && (
          <div className="text-center mt-3">
            <span className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-blue-200/50">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
              {selectedLocations.length} location{selectedLocations.length > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Search Button */}
      <div className="text-center">
        <button
          onClick={handleSearch}
          className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 text-sm sm:text-base shadow-xl sm:shadow-2xl hover:shadow-blue-400/25 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300/50 relative overflow-hidden group w-full sm:w-auto"
        >
          <Search className="w-4 sm:w-5 h-4 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10">Search Properties</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  </div>
</section>




        {/* Featured Requirements Section */}
<section className="py-6 md:py-8 lg:py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white border-b border-gray-100/50">
  <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
    {/* Enhanced Header */}
    <div className="text-center mb-4 md:mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-3">
        {/* Left Side: Icon and Title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500 drop-shadow-sm" />
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text">
            Featured Requirements
          </h2>
        </div>

        {/* Right Side: View All Link */}
        <Link to="/featured">
          <button className="group flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base text-blue-600 hover:text-blue-700 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm hover:bg-blue-50/80 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
            View All
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </Link>
      </div>
    </div>

    {/* Slider Container */}
    <div className="relative max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
      {/* Enhanced Navigation Arrows - Hidden on very small screens */}
      <button
        disabled={requirements.length <= 1}
        onClick={prevSlide}
        className={`hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:bg-white group ${
          requirements.length <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'
        }`}
      >
        <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 lg:translate-x-6 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 lg:p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:bg-white group hover:scale-110"
      >
        <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
      </button>

      {/* Enhanced Slider Content */}
      <div className="overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {requirements.map((req, index) => (
            <div key={req.requirementId} className="w-full flex-shrink-0 p-0.5 sm:p-1">
              <div className="bg-gradient-to-br from-white via-blue-50/20 to-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100/50 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] relative overflow-hidden">
                
                {/* Background Decoration - Reduced on mobile */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-2xl lg:blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-tr from-blue-50/40 to-transparent rounded-full blur-xl lg:blur-2xl"></div>

                <div className="relative z-10 space-y-4 sm:space-y-5 lg:space-y-6 text-center">
                  {/* Property Information */}
                  <div className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 capitalize leading-tight">
                      Looking For
                    </h2>
                    
                    <div className="flex flex-col xs:flex-row gap-2 justify-center items-center text-xs sm:text-sm font-medium">
                      <span className="bg-gray-100/80 text-gray-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
                         {req.bhkConfig} 
                      </span>
                      <span className="bg-green-100/80 text-green-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold whitespace-nowrap">
                        ₹{req.minBudget.toLocaleString()} - ₹{req.maxBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Preferred Locations */}
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-700 flex items-center justify-center gap-1 sm:gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      Preferred Locations
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center max-w-full">
                      {req.preferredLocations.map((location, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xs sm:text-sm font-medium shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 hover:scale-105 break-words"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div className="bg-gray-50/80 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-700 flex items-center justify-center gap-1 sm:gap-2">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      Additional Requirements
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {req.additionalRequirements}
                    </p>
                  </div>

                  {/* Enhanced Contact Buttons */}
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center pt-1 sm:pt-2">
                    {/* Call Button */}
                    <a
                      href={user ? `tel:${req.phoneNumber}` : "#"}
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

                    



                    {/* WhatsApp Button */}
                    <a
                      href={user ? `https://wa.me/${req.phoneNumber}` : "#"}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Slide Counter */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
        {/* Mobile Navigation Dots - Only show on mobile */}
        <div className="flex sm:hidden gap-1.5">
          {requirements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-blue-600 w-4' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <div className="text-xs sm:text-sm font-medium text-gray-600 bg-white/80 px-2 sm:px-3 py-1 rounded-full border border-gray-200">
          {Math.min(currentSlide + 1, requirements.length)} of {requirements.length}
        </div>
      </div>
    </div>
  </div>
</section>


{/* Rental Handpicked */}
<section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white relative overflow-hidden">
  <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="text-center mb-8 md:mb-12">
     
      <h2 className="text-1xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-blue-600 bg-clip-text text-transparent mb-3">
        Handpicked Properties for Rent
      </h2>
      {/* <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
        Discover premium properties curated by our expert team for the perfect rental opportunity
      </p> */}
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
    </div>
    <div className="md:hidden">
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {featuredProperties.filter(property => property.propertyFor === 'RENT').map((property) => (
          <Link
            key={property.propertyId}
            to={`/listing/${property.propertyId}`}
            className="flex-none w-80 snap-center"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group h-[540px] flex flex-col">
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
                  alt={property.propertyName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                    {formatBHK(property.bhkType) || 'Property'}
                  </span>
                </div>
                {/* <div className="absolute right-4 top-4">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                    {property.createdAt}
                  </span>
                </div> */}
                <div className="absolute right-4 top-4">
  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
    {getRelativeTime(property.createdAt)}
  </span>
</div>

              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-base text-gray-800 flex-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                    {property.propertyName || 'Property Title'}
                  </h3>
                  <span className="text-blue-600 font-bold text-base ml-3 whitespace-nowrap">
                    ₹{formatPrice(property.expectedPrice) || 'Price'}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 mb-3">
                  <div className="bg-gray-100 p-1.5 rounded-full mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <p className="text-sm line-clamp-1">
                    {`${property.address.area}, ${property.address.city}, ${property.address.state} - ${property.address.pinCode}`}
                  </p>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-lg mb-4 flex items-center justify-between gap-x-6">
  {/* Carpet Area */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-green-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg> */}
      <Square></Square>
    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">{property.carpetArea || 'NA'}</div>
    <div className="text-xs text-gray-500">Carpet Area</div>
  </div>

  {/* Built-up Area */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-indigo-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
      </svg> */}
      <Maximize></Maximize>
    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">{property.totalBuildUpArea || 'NA'}</div>
    <div className="text-xs text-gray-500">Built-up</div>
  </div>

  {/* Floor Info */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-orange-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
      </svg> */}
      <Building></Building>

    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">
      {property.floor || 'NA'}/{property.totalFloors || 'NA'}
    </div>
    <div className="text-xs text-gray-500">Floor</div>
  </div>
</div>

                <div className="bg-gray-50 px-3 py-2 rounded-lg mb-4 flex items-center gap-x-3">
  <User className="w-4 h-4 text-indigo-600" />

  <label className="text-sm text-gray-600 font-medium">Preferred Tenants</label> :
  <span className="text-gray-700 text-sm font-bold">
    {property.preferred_tenants || 'NA'}
  </span>
</div>
                <div className="flex items-center justify-between mb-5 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
  {/* Avatar or Icon */}
  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
  <UserIcon className="text-white w-5 h-5" />
</div>

  {/* User Info */}
  <div className="min-w-0 flex-1">
    <p className="text-sm text-gray-500">
      {property.postedByUserName || 'Unknown'}
    </p>
    <p className="font-medium text-gray-800 text-sm truncate">
      {property.postedByUserRole || 'Unknown'}
    </p>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-2 ml-4">
    {/* Call Button */}
    <a
      href="#"
      onClick={(event) => handleCallClick(event, property)}
      className="flex items-center gap-1 bg-cyan-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
    >
      <Phone className="w-4 h-4" /> 
    </a>

    {/* WhatsApp Button */}
    <a
      href={`https://wa.me/${property.phoneNumber}`}
      onClick={(event) => handleCallClick(event, property)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.84 11.84 0 0 0 12 0C5.37 0 0 5.37 0 12a11.86 11.86 0 0 0 1.59 5.96L0 24l6.27-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zm-8.5 17.49a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.63-.23-.37A9.92 9.92 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.04 7.02 2.93a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.9 9.9zm5.39-7.43c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.14-.17.2-.34.21-.63.07-.29-.14-1.23-.46-2.34-1.48-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.28.29-.47.1-.2.05-.37-.02-.51-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35s-1 1-1 2.43 1.02 2.81 1.16 3.01c.14.2 2 3.2 4.86 4.49.68.29 1.21.46 1.62.59.68.21 1.3.18 1.78.11.54-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.11-.26-.18-.55-.32z"/>
      </svg>
      
    </a>
  </div>
</div>

              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-1 gap-2">
        {featuredProperties.filter(property => property.propertyFor === 'RENT').map((_, index) => (
          <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
        ))}
      </div>
    </div>
    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProperties.filter(property => property.propertyFor === 'RENT').map((property) => (
        <Link
          key={property.propertyId}
          to={`/listing/${property.propertyId}`}
          className="block group"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 h-[510px] flex flex-col">
            <div className="relative h-48 overflow-hidden flex-shrink-0">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
                alt={property.propertyName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                  {formatBHK(property.bhkType) || 'Property'}
                </span>
              </div>
              <div className="absolute right-4 top-4">
  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
    {getRelativeTime(property.createdAt)}
  </span>
</div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg text-gray-800 flex-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                  {property.propertyName || 'Property Title'}
                </h3>
                <span className="text-blue-600 font-bold text-lg ml-4 whitespace-nowrap">
                  ₹{formatPrice(property.expectedPrice) || 'Price'}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <div className="bg-gray-100 p-2 rounded-full mr-3 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <p className="text-base line-clamp-1">
                  {`${property.address.area}, ${property.address.city}, ${property.address.state} ${property.address.pinCode}`}
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-lg mb-1 flex items-center justify-between gap-x-6">
  {/* Carpet Area */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-green-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg> */}
      <Square></Square>
    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">{property.carpetArea || 'NA'}</div>
    <div className="text-xs text-gray-500">Carpet Area</div>
  </div>

  {/* Built-up Area */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-indigo-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
      </svg> */}
      <Maximize></Maximize>
    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">{property.totalBuildUpArea || 'NA'}</div>
    <div className="text-xs text-gray-500">Built-up</div>
  </div>

  {/* Floor Info */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-orange-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
      </svg> */}
      <Building></Building>

    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">
      {property.floor || 'NA'}/{property.totalFloors || 'NA'}
    </div>
    <div className="text-xs text-gray-500">Floor</div>
  </div>
</div>

                <div className="bg-gray-50 px-3 py-2 rounded-lg mb-1 flex items-center gap-x-3">
  <User className="w-4 h-4 text-indigo-600" />

  <label className="text-sm text-gray-600 font-medium">Preferred Tenants</label> :
  <span className="text-gray-700 text-sm font-bold">
    {property.preferred_tenants || 'NA'}
  </span>
</div>
              <div className="flex items-center justify-between mb-5 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
  {/* Avatar or Icon */}
  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
  <UserIcon className="text-white w-5 h-5" />
</div>

  {/* User Info */}
  <div className="min-w-0 flex-1">
    <p className="text-sm text-gray-500">
      {property.postedByUserName || 'Unknown'}
    </p>
    <p className="font-medium text-gray-800 text-sm truncate">
      {property.postedByUserRole || 'Unknown'}
    </p>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-2 ml-4">
    {/* Call Button */}
    <a
      href="#"
      onClick={(event) => handleCallClick(event, property)}
      className="flex items-center gap-1 bg-cyan-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
    >
      <Phone className="w-4 h-4" /> 
    </a>

    {/* WhatsApp Button */}
    <a
      href={`https://wa.me/${property.phoneNumber}`}
      onClick={(event) => handleCallClick(event, property)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.84 11.84 0 0 0 12 0C5.37 0 0 5.37 0 12a11.86 11.86 0 0 0 1.59 5.96L0 24l6.27-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zm-8.5 17.49a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.63-.23-.37A9.92 9.92 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.04 7.02 2.93a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.9 9.9zm5.39-7.43c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.14-.17.2-.34.21-.63.07-.29-.14-1.23-.46-2.34-1.48-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.28.29-.47.1-.2.05-.37-.02-.51-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35s-1 1-1 2.43 1.02 2.81 1.16 3.01c.14.2 2 3.2 4.86 4.49.68.29 1.21.46 1.62.59.68.21 1.3.18 1.78.11.54-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.11-.26-.18-.55-.32z"/>
      </svg>
      
    </a>
  </div>
</div>

            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Buy Handpicked */}
<section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white relative overflow-hidden">
  <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="text-center mb-8 md:mb-12">
     
      <h2 className="text-1xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-blue-600 bg-clip-text text-transparent mb-1">
        Handpicked Properties for Sale
      </h2>
      {/* <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
        Discover premium properties curated by our expert team for the perfect investment opportunity
      </p> */}
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
    </div>
    <div className="md:hidden">
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {featuredProperties.filter(property => property.propertyFor === 'SELL').map((property) => (
          <Link
            key={property.propertyId}
            to={`/listing/${property.propertyId}`}
            className="flex-none w-80 snap-center"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group h-[540px] flex flex-col">
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
                  alt={property.propertyName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                    {formatBHK(property.bhkType) || 'Property'}
                  </span>
                </div>
                <div className="absolute right-4 top-4">
  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
    {getRelativeTime(property.createdAt)}
  </span>
</div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-base text-gray-800 flex-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                    {property.propertyName || 'Property Title'}
                  </h3>
                  <span className="text-blue-600 font-bold text-base ml-3 whitespace-nowrap">
                    ₹{formatPrice(property.expectedPrice) || 'Price'}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 mb-3">
                  <div className="bg-gray-100 p-1.5 rounded-full mr-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <p className="text-sm line-clamp-1">
                    {`${property.address.area}, ${property.address.city}, ${property.address.state} ${property.address.pinCode}`}
                  </p>
                </div>
                 <div className="bg-gray-50 px-4 py-3 rounded-lg mb-4 flex items-center justify-between gap-x-6">
  {/* Carpet Area */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-green-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg> */}
      <Square></Square>
    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">{property.carpetArea || 'NA'}</div>
    <div className="text-xs text-gray-500">Carpet Area</div>
  </div>

  {/* Built-up Area */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-indigo-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
      </svg> */}
      <Maximize></Maximize>
    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">{property.totalBuildUpArea || 'NA'}</div>
    <div className="text-xs text-gray-500">Built-up</div>
  </div>

  {/* Floor Info */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-orange-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
      </svg> */}
      <Building></Building>

    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">
      {property.floor || 'NA'}/{property.totalFloors || 'NA'}
    </div>
    <div className="text-xs text-gray-500">Floor</div>
  </div>
</div>

                <div className="bg-gray-50 px-3 py-2 rounded-lg mb-4 flex items-center gap-x-3">
  <User className="w-4 h-4 text-indigo-600" />

  <label className="text-sm text-gray-600 font-medium">Preferred Tenants</label> :
  <span className="text-gray-700 text-sm font-bold">
    {property.preferred_tenants || 'NA'}
  </span>
</div>
                <div className="flex items-center justify-between mb-5 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
  {/* Avatar or Icon */}
  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
  <UserIcon className="text-white w-5 h-5" />
</div>

  {/* User Info */}
  <div className="min-w-0 flex-1">
    <p className="text-sm text-gray-500">
      {property.postedByUserName || 'Unknown'}
    </p>
    <p className="font-medium text-gray-800 text-sm truncate">
      {property.postedByUserRole || 'Unknown'}
    </p>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-2 ml-4">
    {/* Call Button */}
    <a
      href="#"
      onClick={(event) => handleCallClick(event, property)}
      className="flex items-center gap-1 bg-cyan-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
    >
      <Phone className="w-4 h-4" /> 
    </a>

    {/* WhatsApp Button */}
    <a
      href={`https://wa.me/${property.phoneNumber}`}
      onClick={(event) => handleCallClick(event, property)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.84 11.84 0 0 0 12 0C5.37 0 0 5.37 0 12a11.86 11.86 0 0 0 1.59 5.96L0 24l6.27-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zm-8.5 17.49a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.63-.23-.37A9.92 9.92 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.04 7.02 2.93a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.9 9.9zm5.39-7.43c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.14-.17.2-.34.21-.63.07-.29-.14-1.23-.46-2.34-1.48-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.28.29-.47.1-.2.05-.37-.02-.51-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35s-1 1-1 2.43 1.02 2.81 1.16 3.01c.14.2 2 3.2 4.86 4.49.68.29 1.21.46 1.62.59.68.21 1.3.18 1.78.11.54-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.11-.26-.18-.55-.32z"/>
      </svg>
      
    </a>
  </div>
</div>

              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-6 gap-2">
        {featuredProperties.filter(property => property.propertyFor === 'SELL').map((_, index) => (
          <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
        ))}
      </div>
    </div>
    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProperties.filter(property => property.propertyFor === 'SELL').map((property) => (
        <Link
          key={property.propertyId}
          to={`/listing/${property.propertyId}`}
          className="block group"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 h-[540px] flex flex-col">
            <div className="relative h-48 overflow-hidden flex-shrink-0">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
                alt={property.propertyName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                  {formatBHK(property.bhkType) || 'Property'}
                </span>
              </div>
              <div className="absolute right-4 top-4">
  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
    {getRelativeTime(property.createdAt)}
  </span>
</div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg text-gray-800 flex-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                  {property.propertyName || 'Property Title'}
                </h3>
                <span className="text-blue-600 font-bold text-lg ml-4 whitespace-nowrap">
                  ₹{formatPrice(property.expectedPrice) || 'Price'}
                </span>
              </div>
              <div className="flex items-center text-gray-500 mb-2">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <p className="text-base line-clamp-1">
                  {`${property.address.area}, ${property.address.city}, ${property.address.state} ${property.address.pinCode}`}
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-lg mb-4 flex items-center justify-between gap-x-6">
  {/* Carpet Area */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-green-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg> */}
      <Square></Square>
    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">{property.carpetArea || 'NA'}</div>
    <div className="text-xs text-gray-500">Carpet Area</div>
  </div>

  {/* Built-up Area */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-indigo-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
      </svg> */}
      <Maximize></Maximize>
    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">{property.totalBuildUpArea || 'NA'}</div>
    <div className="text-xs text-gray-500">Built-up</div>
  </div>

  {/* Floor Info */}
  <div className="flex flex-col items-center text-center">
    <div className="bg-orange-100 p-2 rounded-xl">
      {/* <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
      </svg> */}
      <Building></Building>

    </div>
    <div className="mt-1 text-sm font-medium text-gray-800">
      {property.floor || 'NA'}/{property.totalFloors || 'NA'}
    </div>
    <div className="text-xs text-gray-500">Floor</div>
  </div>
</div>

                <div className="bg-gray-50 px-3 py-2 rounded-lg mb-4 flex items-center gap-x-3">
  <User className="w-4 h-4 text-indigo-600" />

  <label className="text-sm text-gray-600 font-medium">Preferred Tenants</label> :
  <span className="text-gray-700 text-sm font-bold">
    {property.preferred_tenants || 'NA'}
  </span>
</div>
              <div className="flex items-center justify-between mb-5 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
  {/* Avatar or Icon */}
  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
  <UserIcon className="text-white w-5 h-5" />
</div>

  {/* User Info */}
  <div className="min-w-0 flex-1">
    <p className="text-sm text-gray-500">
      {property.postedByUserName || 'Unknown'}
    </p>
    <p className="font-medium text-gray-800 text-sm truncate">
      {property.postedByUserRole || 'Unknown'}
    </p>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-2 ml-4">
    {/* Call Button */}
    <a
      href="#"
      onClick={(event) => handleCallClick(event, property)}
      className="flex items-center gap-1 bg-cyan-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
    >
      <Phone className="w-4 h-4" /> 
    </a>

    {/* WhatsApp Button */}
    <a
      href={`https://wa.me/${property.phoneNumber}`}
      onClick={(event) => handleCallClick(event, property)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48A11.84 11.84 0 0 0 12 0C5.37 0 0 5.37 0 12a11.86 11.86 0 0 0 1.59 5.96L0 24l6.27-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zm-8.5 17.49a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.63-.23-.37A9.92 9.92 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.04 7.02 2.93a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.9 9.9zm5.39-7.43c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.14-.17.2-.34.21-.63.07-.29-.14-1.23-.46-2.34-1.48-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.28.29-.47.1-.2.05-.37-.02-.51-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35s-1 1-1 2.43 1.02 2.81 1.16 3.01c.14.2 2 3.2 4.86 4.49.68.29 1.21.46 1.62.59.68.21 1.3.18 1.78.11.54-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.11-.26-.18-.55-.32z"/>
      </svg>
      
    </a>
  </div>
</div>

            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>


      {/* Under Construction Projects */}
      <section className="py-6 md:py-8 bg-white">
  <div className="max-w-5xl mx-auto px-3 md:px-6 lg:px-8">

    {/* Title + View All */}
    <div className="flex items-center justify-center mb-4 md:mb-6">
      <h2 className="text-lg md:text-2xl font-bold text-gray-800">
        Top Under Construction Projects
      </h2>
    </div>

    {/* Slider Container */}
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={handleProjectMouseEnter}
      onMouseLeave={handleProjectMouseLeave}
    >
      {/* Navigation Arrows */}
      {/* <button
        onClick={prevSlide1}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button> */}

      {/* <button
        onClick={nextSlide1}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button> */}

      {/* Main Slide Wrapper */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${projectSlide * 100}%)` }}
        >
          {projects.map((project) => (
            <div key={project.id} className="w-full flex-shrink-0">
              <div className="h-60 md:h-80 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Project Info */}
                <div className="absolute bottom-4 left-4 md:left-6 text-white">
                  <h3 className="text-lg md:text-xl font-bold mb-1">
                    {project.title}
                  </h3>
                  <p className="text-blue-100 text-sm md:text-base mb-2">
                    {project.subtitle}
                  </p>
                  <div className="flex items-center space-x-1 text-blue-200 text-xs md:text-sm">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{project.location}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 md:right-6 text-right text-white">
                  <div className="text-xl md:text-2xl font-bold mb-1">{project.price}</div>
                  <div className="text-blue-100 text-sm md:text-base mb-1">{project.status}</div>
                  <div className="flex items-center justify-end space-x-1 text-blue-200 text-xs md:text-sm">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{project.completion}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 md:right-6">
                  <span className={`${project.badgeColor} text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium`}>
                    {project.badge}
                  </span>
                </div>
                <div className="absolute top-4 left-4 md:left-6">
                  <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs md:text-sm font-medium">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide1(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === projectSlide ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Thumbnail Navigation */}
      {/* <div className="flex justify-center space-x-2 mt-4 overflow-x-auto pb-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            onClick={() => goToSlide1(index)}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
              index === projectSlide
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-800 truncate max-w-20">
                {project.title}
              </div>
              <div className="text-xs text-gray-600">
                {project.location.split(',')[0]}
              </div>
            </div>
          </button>
        ))}
      </div> */}
    </div>
  </div>
</section>


      {/* Quick Stats */}
      <section className="py-6 md:py-8 bg-blue-50">
        <div className="max-w-5xl mx-auto px-3 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">100 +</div>
              <div className="text-gray-600 text-sm md:text-base">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">1000 +</div>
              <div className="text-gray-600 text-sm md:text-base">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">20 +</div>
              <div className="text-gray-600 text-sm md:text-base">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600 text-sm md:text-base">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;




// import React, { useState, useEffect, useContext } from 'react';
// import { Search, Star, Phone, MessageCircle, User, Share2, MapPin, Home, Building, Users, Filter, Menu, X, ChevronLeft, ChevronRight, Calendar, ChartArea, Square, Maximize, FileText } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from "../context/Authcontext";
// import { toast } from 'react-toastify';
// import { UserIcon } from '@heroicons/react/24/solid';
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";

// dayjs.extend(relativeTime);

// const getRelativeTime = (timestamp) => {
//   const now = dayjs();
//   const created = dayjs(timestamp);
//   const diffInMinutes = now.diff(created, "minute");

//   if (diffInMinutes < 60) {
//     return "Just now";
//   }
//   return created.fromNow();
// };

// const HomePage = () => {
//   const [requirements, setRequirements] = useState([]);
//   const [error, setError] = useState(null); // Added missing error state
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const [featuredProperties, setFeaturedProperties] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const { user } = useContext(AuthContext);
//   const [transactionType, setTransactionType] = useState('');
//   const [selectedLocations, setSelectedLocations] = useState([]);
//   const [loading, setLoading] = useState(false); // Fixed array to boolean
//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
  
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const fetchRequirements = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/requirement/all`, {
//         params: { page, size },
//       });
//       const data = response.data;
//       const activeRequirements = data.content.filter(requirements => requirements.status === 'ACTIVE');
//       setRequirements(activeRequirements);
//       setTotalPages(data.totalPages);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       setRequirements([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Navigation functions
//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? requirements.length - 1 : prev - 1));
//   };

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev === requirements.length - 1 ? 0 : prev + 1));
//   };

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//   };

//   const handleSearch = () => {
//     navigate('/listing', {
//       state: {
//         propertyName: searchTerm,
//         propertyFor: transactionType,
//         selectedLocations: selectedLocations,
//       },
//     });
//   };

//   const toggleLocation = (location) => {
//     if (selectedLocations.includes(location)) {
//       setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
//     } else {
//       setSelectedLocations([...selectedLocations, location]);
//     }
//   };

//   const formatPrice = (price) => {
//     if (price >= 10000000) return `${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)}Cr`;
//     if (price >= 100000) return `${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)}L`;
//     if (price >= 1000) return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
//     return price;
//   };

//   const formatBHK = (bhkEnum) => {
//     if (!bhkEnum) return 'BHK';
//     const cleanEnum = bhkEnum.startsWith('_') ? bhkEnum.slice(1) : bhkEnum;
//     const parts = cleanEnum.split('_');
//     if (parts.length === 2 && parts[1] === 'RK') {
//       return `${parts[0]} RK`;
//     }
//     const bhkNumber = parts.slice(0, -1).join('.'); 
//     return `${bhkNumber} BHK`;
//   };

//   const handleClick = (e) => {
//     if (!user) {
//       e.preventDefault();
//       alert("Please log in to make a call or message.");
//     }
//   };

//   const handleCallClick = async (event, property) => {
//     event.preventDefault();

//     if (!user) {
//       toast.error("You must be logged in to make a call.");
//       return;
//     }

//     if (!property || !property.postedByUserId) {
//       toast.error("Invalid property details.");
//       console.error("Invalid property object:", property);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/api/subscriptions/use-contact-or-chat`,
//         null,
//         {
//           params: {
//             userId: user.id,
//             propertyId: property.propertyId,
//           },
//         }
//       );

//       toast.success(response?.data?.message || "Calling agent...");

//       setTimeout(() => {
//         window.location.href = `tel:${property.postedByUserPhoneNumber || ''}`;
//       }, 500);

//     } catch (error) {
//       console.error("Error accessing contact:", error);
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.response?.statusText ||
//         "Something went wrong while accessing contact.";
//       toast.error(errorMessage);
//     }
//   };

//   const handleCallClickReq = async (event, property) => {
//     event.preventDefault();

//     if (!user) {
//       toast.error("You must be logged in to make a call.");
//       return;
//     }

//     if (!property || !property.postedByUserId) {
//       toast.error("Invalid property details.");
//       console.error("Invalid property object:", property);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/api/subscriptions/use-contact`,
//         null,
//         {
//           params: {
//             userId: user.id,
//             propertyId: property.propertyId,
//           },
//         }
//       );

//       toast.success(response?.data?.message || "Calling agent...");

//       setTimeout(() => {
//         window.location.href = `tel:${property.postedByUserPhoneNumber || ''}`;
//       }, 500);

//     } catch (error) {
//       console.error("Error accessing contact:", error);
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.response?.statusText ||
//         "Something went wrong while accessing contact.";
//       toast.error(errorMessage);
//     }
//   };

//   useEffect(() => {
//     fetchRequirements();
//   }, [page]); // Added dependency

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const page = 0;
//         const size = 100;
//         const sort = 'propertyId';
//         const direction = 'asc';

//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/api/properties/get`,
//           {
//             params: { page, size, sort, direction },
//           }
//         );

//         const allProperties = response.data.content || [];
//         const rentProperties = allProperties.filter(
//           (property) => property.propertyFor === 'RENT'
//         ).slice(0, 3);

//         const saleProperties = allProperties.filter(
//           (property) => property.propertyFor === 'SELL'
//         ).slice(0, 3);

//         const featuredProps = [...rentProperties, ...saleProperties];
//         setFeaturedProperties(featuredProps);
//       } catch (error) {
//         console.error('Error fetching properties:', error);
//       }
//     };

//     fetchProperties();
//   }, []);

//   const projects = [
//     {
//       id: 1,
//       title: "Skyline Residences",
//       subtitle: "Premium 2 & 3 BHK Apartments",
//       location: "Baner, Pune",
//       price: "₹85 Lakh - ₹1.2 Cr",
//       status: "60% Complete",
//       completion: "Dec 2025",
//       image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
//       badge: "New Launch",
//       badgeColor: "bg-green-500"
//     },
//     {
//       id: 2,
//       title: "Heritage Gardens",
//       subtitle: "Luxury Villa Community",
//       location: "Kharadi, Pune",
//       price: "₹1.8 Cr - ₹2.5 Cr",
//       status: "40% Complete",
//       completion: "Mar 2026",
//       image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
//       badge: "Premium",
//       badgeColor: "bg-purple-500"
//     },
//     {
//       id: 3,
//       title: "Tech Park Towers",
//       subtitle: "Smart 1, 2 & 3 BHK Homes",
//       location: "Hinjewadi, Pune",
//       price: "₹55 Lakh - ₹95 Lakh",
//       status: "75% Complete",
//       completion: "Aug 2025",
//       image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
//       badge: "Fast Track",
//       badgeColor: "bg-orange-500"
//     },
//     {
//       id: 4,
//       title: "Riverside Enclave",
//       subtitle: "Waterfront Apartments",
//       location: "Wakad, Pune",
//       price: "₹70 Lakh - ₹1.1 Cr",
//       status: "30% Complete",
//       completion: "Jun 2026",
//       image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
//       badge: "Exclusive",
//       badgeColor: "bg-blue-500"
//     }
//   ];

//   // For projects slider
//   const [projectSlide, setProjectSlide] = useState(0);
//   const [isProjectAutoPlaying, setIsProjectAutoPlaying] = useState(true);

//   const prevSlide1 = () => {
//     setProjectSlide((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
//   };

//   const nextSlide1 = () => {
//     setProjectSlide((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
//   };

//   const goToSlide1 = (index) => {
//     setProjectSlide(index);
//   };

//   const handleProjectMouseEnter = () => 
//     setIsProjectAutoPlaying(false);

//   const handleProjectMouseLeave = () => 
//     setIsProjectAutoPlaying(true);

//   useEffect(() => {
//     if (!isProjectAutoPlaying || projects.length <= 1) return;

//     const interval = setInterval(() => {
//       nextSlide1();
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [projectSlide, isProjectAutoPlaying, projects.length]);

//   useEffect(() => {
//     if (!isAutoPlaying || requirements.length <= 1) return;

//     const interval = setInterval(() => {
//       nextSlide();
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [currentSlide, isAutoPlaying, requirements.length]);

//   const handleMouseEnter = () => {
//     setIsAutoPlaying(false);
//   };

//   const handleMouseLeave = () => {
//     setIsAutoPlaying(true);
//   };

//   // Property card component to reduce code duplication
//   const PropertyCard = ({ property, className = "" }) => (
//     <Link
//       key={property.propertyId}
//       to={`/listing/${property.propertyId}`}
//       className={`block group ${className}`}
//     >
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
//         <div className="relative h-48 overflow-hidden flex-shrink-0">
//           <img
//             src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
//             alt={property.propertyName}
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
//           <div className="absolute bottom-4 left-4">
//             <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm">
//               {formatBHK(property.bhkType) || 'Property'}
//             </span>
//           </div>
//           <div className="absolute right-4 top-4">
//             <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
//               {getRelativeTime(property.createdAt)}
//             </span>
//           </div>
//         </div>
        
//         <div className="p-4 sm:p-5 flex-1 flex flex-col">
//           <div className="flex justify-between items-start mb-3">
//             <h3 className="font-bold text-base sm:text-lg text-gray-800 flex-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
//               {property.propertyName || 'Property Title'}
//             </h3>
//             <span className="text-blue-600 font-bold text-base sm:text-lg ml-3 whitespace-nowrap">
//               ₹{formatPrice(property.expectedPrice) || 'Price'}
//             </span>
//           </div>
          
//           <div className="flex items-center text-gray-500 mb-3">
//             <div className="bg-gray-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
//               <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
//             </div>
//             <p className="text-sm sm:text-base line-clamp-1">
//               {`${property.address.area}, ${property.address.city}, ${property.address.state} - ${property.address.pinCode}`}
//             </p>
//           </div>

//           <div className="bg-gray-50 px-3 sm:px-4 py-3 rounded-lg mb-3 sm:mb-4 flex items-center justify-between gap-x-4 sm:gap-x-6">
//             {/* Carpet Area */}
//             <div className="flex flex-col items-center text-center">
//               <div className="bg-green-100 p-1.5 sm:p-2 rounded-xl">
//                 <Square className="w-3 h-3 sm:w-5 sm:h-5 text-green-600" />
//               </div>
//               <div className="mt-1 text-xs sm:text-sm font-medium text-gray-800">{property.carpetArea || 'NA'}</div>
//               <div className="text-xs text-gray-500">Carpet Area</div>
//             </div>

//             {/* Built-up Area */}
//             <div className="flex flex-col items-center text-center">
//               <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-xl">
//                 <Maximize className="w-3 h-3 sm:w-5 sm:h-5 text-indigo-600" />
//               </div>
//               <div className="mt-1 text-xs sm:text-sm font-medium text-gray-800">{property.totalBuildUpArea || 'NA'}</div>
//               <div className="text-xs text-gray-500">Built-up</div>
//             </div>

//             {/* Floor Info */}
//             <div className="flex flex-col items-center text-center">
//               <div className="bg-orange-100 p-1.5 sm:p-2 rounded-xl">
//                 <Building className="w-3 h-3 sm:w-5 sm:h-5 text-orange-600" />
//               </div>
//               <div className="mt-1 text-xs sm:text-sm font-medium text-gray-800">
//                 {property.floor || 'NA'}/{property.totalFloors || 'NA'}
//               </div>
//               <div className="text-xs text-gray-500">Floor</div>
//             </div>
//           </div>

//           {property.preferred_tenants && (
//             <div className="bg-gray-50 px-3 py-2 rounded-lg mb-3 flex items-center gap-x-3">
//               <User className="w-4 h-4 text-indigo-600" />
//               <label className="text-sm text-gray-600 font-medium">Preferred Tenants:</label>
//               <span className="text-gray-700 text-sm font-bold">
//                 {property.preferred_tenants}
//               </span>
//             </div>
//           )}
          
//           <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mt-auto">
//             {/* Avatar or Icon */}
//             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
//               <UserIcon className="text-white w-4 h-4 sm:w-5 sm:h-5" />
//             </div>

//             {/* User Info */}
//             <div className="min-w-0 flex-1">
//               <p className="text-xs sm:text-sm text-gray-500">
//                 {property.postedByUserName || 'Unknown'}
//               </p>
//               <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">
//                 {property.postedByUserRole || 'Unknown'}
//               </p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2 ml-2 sm:ml-4">
//               {/* Call Button */}
//               <button
//                 onClick={(event) => handleCallClickReq(event, property)}
//                 className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white font-semibold p-2 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
//               >
//                 <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
//               </button>

//               {/* WhatsApp Button */}
//               <a
//                 href={`https://wa.me/${property.phoneNumber}`}
//                 onClick={(event) => handleCallClickReq(event, property)}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-semibold p-2 rounded-xl shadow-lg transition hover:shadow-xl transform hover:scale-105 text-sm"
//               >
//                 <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Search Section */}
//       <section className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-6 sm:py-8 md:py-12 overflow-hidden">
//         {/* Enhanced Background Pattern */}
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-50/20 to-transparent"></div>
//           <div className="absolute top-10 right-10 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-blue-300/20 to-blue-400/30 rounded-full blur-2xl animate-pulse"></div>
//           <div className="absolute bottom-10 left-10 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-r from-blue-200/25 to-blue-300/35 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
//         </div>

//         <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Search Container */}
//           <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/30 hover:shadow-3xl transition-all duration-500">
            
//             {/* Search Bar */}
//             <div className="mb-6">
//               <div className="relative group">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 z-10 group-focus-within:text-blue-600 transition-colors duration-200" />
//                 <input
//                   type="text"
//                   placeholder="Search by property name..."
//                   className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/90 backdrop-blur-sm placeholder-gray-500 hover:border-blue-300 shadow-sm hover:shadow-md"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Transaction Type */}
//             <div className="mb-6">
//               <h3 className="text-base font-bold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 Transaction Type
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//               </h3>
//               <div className="flex justify-center gap-3 flex-wrap">
//                 {["RENT", "BUY"].map((option) => (
//                   <button
//                     key={option}
//                     onClick={() => setTransactionType(option)}
//                     className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 relative overflow-hidden group ${
//                       transactionType === option
//                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-300/50'
//                         : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
//                     }`}
//                   >
//                     <span className="relative z-10">{option}</span>
//                     {transactionType !== option && (
//                       <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Location Selection */}
//             <div className="mb-6">
//               <h3 className="text-base font-bold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
//                 <MapPin className="w-5 h-5 text-blue-500" />
//                 Select Locations
//               </h3>
//               <div className="flex justify-center gap-2 flex-wrap">
//                 {["Bibwewadi", "Baner", "Kothrud", "Kharadi", "Wakad"].map((location) => (
//                   <button
//                     key={location}
//                     onClick={() => toggleLocation(location)}
//                     className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 relative overflow-hidden group ${
//                       selectedLocations.includes(location)
//                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-300/50'
//                         : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
//                     }`}
//                   >
//                     <span className="relative z-10">{location}</span>
//                     {!selectedLocations.includes(location) && (
//                       <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     )}
//                   </button>
//                 ))}
//               </div>
//               {selectedLocations.length > 0 && (
//                 <div className="text-center mt-3">
//                   <span className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                     {selectedLocations.length} location{selectedLocations.length > 1 ? 's' : ''} selected
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Search Button */}
//             <div className="text-center">
//               <button
//                 onClick={handleSearch}
//                 className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-10 py-4 rounded-xl font-bold hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 text-base shadow-2xl hover:shadow-blue-400/25 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300/50 relative overflow-hidden group w-full sm:w-auto"
//               >
//                 <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
//                 <span className="relative z-10">Search Properties</span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Requirements Section */}
//       <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white border-b border-gray-100/50">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="text-center mb-6 md:mb-8">
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="relative">
//                   <Star className="w-6 h-6 text-blue-500 drop-shadow-sm" />
//                   <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
//                 </div>
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text">
//                   Featured Requirements
//                 </h2>
//               </div>

//               <Link to="/featured">
//                 <button className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-full border border-blue-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm hover:bg-blue-50/80 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
//                   View All
//                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
//                 </button>
//               </Link>
//             </div>
//           </div>

//           {/* Requirements Slider */}
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//           ) : error ? (
//             <div className="text-center py-20 text-red-600">
//               <p>Error loading requirements: {error}</p>
//             </div>
//           ) : requirements.length > 0 ? (
//             <div 
//               className="relative max-w-3xl mx-auto"
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}
//             >
//               {/* Navigation Arrows */}
//               <button
//                 disabled={requirements.length <= 1}
//                 onClick={prevSlide}
//                 className={`hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:bg-white group ${
//                   requirements.length <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'
//                 }`}
//               >
//                 <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
//               </button>

//               <button
//                 onClick={nextSlide}
//                 className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:bg-white group hover:scale-110"
//               >
//                 <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" />
//               </button>

//               {/* Slider Content */}
//               <div className="overflow-hidden rounded-2xl shadow-xl">
//                 <div
//                   className="flex transition-transform duration-500 ease-out"
//                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                 >
//                   {requirements.map((req) => (
//                     <div key={req.requirementId} className="w-full flex-shrink-0">
//                       <div className="bg-gradient-to-br from-white via-blue-50/20 to-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
                        
//                         {/* Background Decoration */}
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
//                         <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50/40 to-transparent rounded-full blur-2xl"></div>

//                         <div className="relative z-10 space-y-6 text-center">
//                           {/* Property Information */}
//                           <div className="space-y-3">
//                             <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize leading-tight">
//                               Looking For
//                             </h2>
                            
//                             <div className="flex flex-wrap gap-2 justify-center items-center text-sm font-medium">
//                               <span className="bg-gray-100/80 text-gray-700 px-3 py-1.5 rounded-full">
//                                 {req.bhkConfig}
//                               </span>
//                               <span className="bg-green-100/80 text-green-700 px-3 py-1.5 rounded-full font-semibold">
//                                 ₹{req.minBudget.toLocaleString()} - ₹{req.maxBudget.toLocaleString()}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Preferred Locations */}
//                           <div className="space-y-3">
//                             <h3 className="text-sm font-bold text-gray-700 flex items-center justify-center gap-2">
//                               <MapPin className="w-4 h-4 text-blue-500" />
//                               Preferred Locations
//                             </h3>
//                             <div className="flex flex-wrap gap-2 justify-center">
//                               {req.preferredLocations.map((location, idx) => (
//                                 <span
//                                   key={idx}
//                                   className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                                 >
//                                   {location}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>

//                           {/* Additional Requirements */}
//                           <div className="bg-gray-50/80 rounded-xl p-4 space-y-2">
//                             <h3 className="text-sm font-bold text-gray-700 flex items-center justify-center gap-2">
//                               <FileText className="w-4 h-4 text-blue-500" />
//                               Additional Requirements
//                             </h3>
//                             <p className="text-gray-600 text-sm leading-relaxed">
//                               {req.additionalRequirements}
//                             </p>
//                           </div>

//                           {/* Contact Buttons */}
//                           <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
//                             <a
//                               href={user ? `tel:${req.phoneNumber}` : "#"}
//                               onClick={handleClick}
//                               className={`group inline-flex items-center justify-center gap-2 ${
//                                 user ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer shadow-lg hover:shadow-xl" : "bg-gray-400 cursor-not-allowed shadow-md"
//                               } text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
//                                 user ? "hover:scale-105 active:scale-95" : ""
//                               } flex-1 sm:flex-none`}
//                             >
//                               <Phone size={16} className={`${user ? "group-hover:animate-pulse" : ""}`} />
//                               <span>Call Now</span>
//                             </a>

//                             <a
//                               href={user ? `https://wa.me/${req.phoneNumber}` : "#"}
//                               onClick={handleClick}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className={`group inline-flex items-center justify-center gap-2 ${
//                                 user ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl" : "bg-gray-400 cursor-not-allowed shadow-md"
//                               } text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
//                                 user ? "hover:scale-105 active:scale-95" : ""
//                               } flex-1 sm:flex-none`}
//                             >
//                               <MessageCircle size={16} className={`${user ? "group-hover:animate-bounce" : ""}`} />
//                               <span>WhatsApp</span>
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Slide Indicators */}
//               <div className="flex items-center justify-center gap-3 mt-6">
//                 <div className="flex sm:hidden gap-1.5">
//                   {requirements.map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentSlide(index)}
//                       className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                         index === currentSlide 
//                           ? 'bg-blue-600 w-4' 
//                           : 'bg-gray-300 hover:bg-gray-400'
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 <div className="text-sm font-medium text-gray-600 bg-white/80 px-3 py-1 rounded-full border border-gray-200">
//                   {Math.min(currentSlide + 1, requirements.length)} of {requirements.length}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-20 text-gray-500">
//               <p>No featured requirements available at the moment.</p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Rental Properties Section */}
//       <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white relative overflow-hidden">
//         <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
//           <div className="text-center mb-8 md:mb-12">
//             <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-blue-600 bg-clip-text text-transparent mb-3">
//               Handpicked Properties for Rent
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
//           </div>

//           {/* Mobile Horizontal Scroll */}
//           <div className="md:hidden">
//             <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4">
//               <style jsx>{`
//                 .scrollbar-hide {
//                   -ms-overflow-style: none;
//                   scrollbar-width: none;
//                 }
//                 .scrollbar-hide::-webkit-scrollbar {
//                   display: none;
//                 }
//               `}</style>
//               {featuredProperties.filter(property => property.propertyFor === 'RENT').map((property) => (
//                 <PropertyCard key={property.propertyId} property={property} className="flex-none w-80 snap-center" />
//               ))}
//             </div>
//           </div>

//           {/* Desktop Grid */}
//           <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {featuredProperties.filter(property => property.propertyFor === 'RENT').map((property) => (
//               <PropertyCard key={property.propertyId} property={property} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Sale Properties Section */}
//       <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-white relative overflow-hidden">
//         <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
//           <div className="text-center mb-8 md:mb-12">
//             <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-blue-600 bg-clip-text text-transparent mb-3">
//               Handpicked Properties for Sale
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
//           </div>

//           {/* Mobile Horizontal Scroll */}
//           <div className="md:hidden">
//             <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4">
//               {featuredProperties.filter(property => property.propertyFor === 'SELL').map((property) => (
//                 <PropertyCard key={property.propertyId} property={property} className="flex-none w-80 snap-center" />
//               ))}
//             </div>
//           </div>

//           {/* Desktop Grid */}
//           <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {featuredProperties.filter(property => property.propertyFor === 'SELL').map((property) => (
//               <PropertyCard key={property.propertyId} property={property} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Under Construction Projects */}
//       <section className="py-8 md:py-12 bg-white">
//         <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
//           <div className="flex items-center justify-center mb-6 md:mb-8">
//             <h2 className="text-xl md:text-2xl font-bold text-gray-800">
//               Top Under Construction Projects
//             </h2>
//           </div>

//           <div
//             className="relative max-w-4xl mx-auto"
//             onMouseEnter={handleProjectMouseEnter}
//             onMouseLeave={handleProjectMouseLeave}
//           >
//             <div className="relative rounded-lg overflow-hidden shadow-lg">
//               <div
//                 className="flex transition-transform duration-500 ease-in-out"
//                 style={{ transform: `translateX(-${projectSlide * 100}%)` }}
//               >
//                 {projects.map((project) => (
//                   <div key={project.id} className="w-full flex-shrink-0">
//                     <div className="h-60 md:h-80 relative">
//                       <img
//                         src={project.image}
//                         alt={project.title}
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

//                       {/* Project Info */}
//                       <div className="absolute bottom-4 left-4 md:left-6 text-white">
//                         <h3 className="text-lg md:text-xl font-bold mb-1">
//                           {project.title}
//                         </h3>
//                         <p className="text-blue-100 text-sm md:text-base mb-2">
//                           {project.subtitle}
//                         </p>
//                         <div className="flex items-center space-x-1 text-blue-200 text-xs md:text-sm">
//                           <MapPin className="w-3 h-3 md:w-4 md:h-4" />
//                           <span>{project.location}</span>
//                         </div>
//                       </div>

//                       <div className="absolute bottom-4 right-4 md:right-6 text-right text-white">
//                         <div className="text-xl md:text-2xl font-bold mb-1">{project.price}</div>
//                         <div className="text-blue-100 text-sm md:text-base mb-1">{project.status}</div>
//                         <div className="flex items-center justify-end space-x-1 text-blue-200 text-xs md:text-sm">
//                           <Calendar className="w-3 h-3 md:w-4 md:h-4" />
//                           <span>{project.completion}</span>
//                         </div>
//                       </div>

//                       {/* Badges */}
//                       <div className="absolute top-4 right-4 md:right-6">
//                         <span className={`${project.badgeColor} text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium`}>
//                           {project.badge}
//                         </span>
//                       </div>
//                       <div className="absolute top-4 left-4 md:left-6">
//                         <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
//                           <span className="text-white text-xs md:text-sm font-medium">
//                             {project.status}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Dot Indicators */}
//             <div className="flex justify-center space-x-2 mt-4">
//               {projects.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => goToSlide1(index)}
//                   className={`w-2 h-2 rounded-full transition-colors duration-300 ${
//                     index === projectSlide ? 'bg-blue-500' : 'bg-gray-300'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Stats */}
//       <section className="py-8 md:py-12 bg-blue-50">
//         <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
//             <div className="text-center">
//               <div className="text-2xl md:text-3xl font-bold text-blue-600">100+</div>
//               <div className="text-gray-600 text-sm md:text-base">Properties</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl md:text-3xl font-bold text-blue-600">1000+</div>
//               <div className="text-gray-600 text-sm md:text-base">Happy Clients</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl md:text-3xl font-bold text-blue-600">20+</div>
//               <div className="text-gray-600 text-sm md:text-base">Locations</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl md:text-3xl font-bold text-blue-600">24/7</div>
//               <div className="text-gray-600 text-sm md:text-base">Support</div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;
