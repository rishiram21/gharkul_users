// import React, { useEffect, useState, useCallback, useContext } from 'react';
// import { MapPin, Heart, Phone, Search, X, SlidersHorizontal, Grid, List ,Ruler, Maximize, Square, Building, User  } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { AuthContext } from "../context/Authcontext";
// import { Link } from 'react-router-dom';
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import { toast } from "react-toastify";

// dayjs.extend(relativeTime);

// const getRelativeTime = (timestamp) => {
//   const now = dayjs();
//   const created = dayjs(timestamp);
//   const diffInMinutes = now.diff(created, "minute");

//   if (diffInMinutes < 60) {
//     return "Just now";
//   }
//   return created.fromNow(); // e.g., "2 hours ago", "3 days ago"
// };


// const Listing = () => {
//   const [properties, setProperties] = useState([]);
//   const [filteredProperties, setFilteredProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [currentPage, setCurrentPage] = useState(0);
//   const [itemsPerPage] = useState(12);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(0); // Add this to track total pages

//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [enums, setEnums] = useState({});
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const location = useLocation();
//   const [filters, setFilters] = useState({
//     propertyName: location.state?.propertyName || '',
//     propertyFor: location.state?.propertyFor || '',
//     selectedLocations: location.state?.selectedLocations || [],
//     bhkType: location.state?.bhkType || '',
//     apartmentType: location.state?.apartmentType || '',
//     category: location.state?.category || '',
//     furnishedType: location.state?.furnishedType || '',
//     preferredTenants: location.state?.preferredTenants || '',
//     minPrice: location.state?.minPrice || '',
//     maxPrice: location.state?.maxPrice || '',
//     area: location.state?.area || '',
//     // page: 0,
//     // size: 10,
//   });



//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);


//   const fetchEnums = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/properties/all_enum`);
//       setEnums(response.data);
//     } catch (error) {
//       console.error("Error fetching enums:", error);
//     }
//   };

//   useEffect(() => {
//     fetchEnums();
//   }, []);

//   const formatPrice = (price) => {
//     if (price >= 10000000) return `${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)} Cr`;
//     if (price >= 100000) return `${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)} L`;
//     if (price >= 1000) return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)} k`;
//     return price;
//   };

//   useEffect(() => {
//     if (location.state) {
//       setFilters({
//         propertyName: location.state.propertyName || '',
//         propertyFor: location.state.propertyFor || '',
//         selectedLocations: location.state?.selectedLocations || [],
//         bhkType: location.state.bhkType || '',
//         apartmentType: location.state.apartmentType || '',
//         category: location.state.category || '',
//         furnishedType: location.state.furnishedType || '',
//         preferredTenants: location.state.preferredTenants || '',
//         minPrice: location.state.minPrice || '',
//         maxPrice: location.state.maxPrice || '',
//         area: location.state.area || '',

//         // page: 0,
//         // size: 10,
//       });
//     }
//   }, [location.state]);

//  const formatBHK = (bhkEnum) => {
//   if (!bhkEnum) return 'BHK';

//   // Remove leading underscore
//   const cleanEnum = bhkEnum.startsWith('_') ? bhkEnum.slice(1) : bhkEnum;

//   const parts = cleanEnum.split('_');

//   // RK case
//   if (parts.length === 2 && parts[1] === 'RK') {
//     return `${parts[0]} RK`;
//   }

//   // BHK cases (remove last part 'BHK' and join the rest with dot)
//   const bhkNumber = parts.slice(0, -1).join('.'); // e.g. ['2', '5'] => "2.5"
//   return `${bhkNumber} BHK`;
// };


// const handleCallClick = async (event, property) => {
//   event.preventDefault();

//   if (!user) {
//     toast.error("You must be logged in to make a call.");
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BASE_URL}/api/subscriptions/use-contact-or-chat`,
//       null,
//       {
//         params: {
//           userId: user.id,
//           propertyId: property.propertyId,
//         },
//       }
//     );

//     toast.success(response?.data?.message || "Call access granted");

//     setTimeout(() => {
//       window.location.href = `tel:${property.postedByUserPhoneNumber}`;
//     }, 1000);

//   } catch (error) {
//     console.error("Error accessing contact:", error);

//     const errorMessage =
//       error?.response?.data?.message || // ✅ this is your backend error
//       error?.response?.statusText || 
//       "Something went wrong";

//     toast.error(errorMessage); // ✅ this is what triggers the toast
//   }
// };



//   const fetchProperties = useCallback(async () => {
//   setLoading(true);
//   try {
//     const response = await axios.get(
//       `${import.meta.env.VITE_BASE_URL}/api/properties/get`,
//       {
//         params: {
//           page: currentPage,
//           size: itemsPerPage,
//           sort: 'propertyId',
//           direction: 'desc',
//         },
//       }
//     );

//     const data = response.data;

//     // Only keep properties with status 'ACTIVE'
//     const activeProperties = (data.content || []).filter(
//       property => property.status === 'ACTIVE'
//     );

//     const propertiesWithDefaults = activeProperties.map(property => ({
//       ...property,
//       bhkType: property.bhkType || 'ONE_BHK',
//     }));

//     setProperties(propertiesWithDefaults);
//     setFilteredProperties(propertiesWithDefaults);
//     setTotalItems(data.totalElements || 0); // Optional: You can also recalculate this using activeProperties.length if needed
//     // setTotalItems(activeProperties.length); // replace totalElements

//     setTotalPages(data.totalPages || 0);
//   } catch (error) {
//     console.error(
//       "Error fetching properties:",
//       error.response ? error.response.data : error.message
//     );
//     setProperties([]);
//     setFilteredProperties([]);
//     setTotalItems(0);
//     setTotalPages(0);
//   } finally {
//     setLoading(false);
//   }
// }, [currentPage, itemsPerPage]);


//   useEffect(() => {
//     fetchProperties();
//   }, [currentPage, fetchProperties]);

//   useEffect(() => {
//     let filtered = [...properties];
//     if (filters.searchTerm) {
//       const searchTermLower = filters.searchTerm.toLowerCase();
//       filtered = filtered.filter((property) => {
//         const propertyForDisplay = property.propertyFor?.toUpperCase() === "BUY" ? "SELL" : property.propertyFor;
//         return (
//           property.propertyName?.toLowerCase().includes(searchTermLower) ||
//           property.address?.city?.toLowerCase().includes(searchTermLower) ||
//           property.address?.area?.toLowerCase().includes(searchTermLower) ||
//           propertyForDisplay?.toLowerCase().includes(searchTermLower) ||
//           property.description?.toLowerCase().includes(searchTermLower) ||
//           property.apartmentType?.toLowerCase().includes(searchTermLower) ||
//           property.bhkType?.toLowerCase().includes(searchTermLower) ||
//           property.furnishedType?.toLowerCase().includes(searchTermLower) ||
//           property.propertyFor?.toLowerCase().includes(searchTermLower) ||
//           property.status?.toLowerCase().includes(searchTermLower) ||
//           property.selectedLocations?.toLowerCase().includes(searchTermLower) 

          
//         );
//       });
//     }
//     if (filters.bhkType) {
//       filtered = filtered.filter(property => property.bhkType === filters.bhkType);
//     }
//     if (filters.city) {
//       filtered = filtered.filter(property =>
//         property.address.city.toLowerCase().includes(filters.city.toLowerCase())
//       );
//     }
//     if (filters.area) {
//       filtered = filtered.filter(property =>
//         property.address.area.toLowerCase().includes(filters.area.toLowerCase())
//       );
//     }
//     if (filters.apartmentType) {
//       filtered = filtered.filter(property => property.apartmentType === filters.apartmentType);
//     }
//     if (filters.propertyCategory) {
//       filtered = filtered.filter(property => property.category === filters.propertyCategory);
//     }
//     // if (filters.propertyFor) {
//     //   filtered = filtered.filter(property => property.propertyFor === filters.propertyFor);
//     // }
//     if (filters.furnishedType) {
//       filtered = filtered.filter(property => property.furnishedType === filters.furnishedType);
//     }
//     if (filters.status) {
//       filtered = filtered.filter(property => property.status === filters.status);
//     }

//     if (filters.propertyName) {
//     const searchTermLower = filters.propertyName.toLowerCase();
//     filtered = filtered.filter((property) =>
//       property.propertyName.toLowerCase().includes(searchTermLower)
//     );
//   }

//   if (filters.propertyFor) {
//   if (filters.propertyFor === "BUY") {
//     // Map BUY to SELL properties
//     filtered = filtered.filter((property) => property.propertyFor === "SELL");
//   } else {
//     filtered = filtered.filter((property) => property.propertyFor === filters.propertyFor);
//   }
// }


//   if (filters.selectedLocations && filters.selectedLocations.length > 0) {
//     filtered = filtered.filter((property) =>
//       filters.selectedLocations.includes(property.address.area)
//     );
//   }

//     switch (filters.sortBy) {
//       case 'price_low':
//         filtered.sort((a, b) => a.expectedPrice - b.expectedPrice);
//         break;
//       case 'price_high':
//         filtered.sort((a, b) => b.expectedPrice - a.expectedPrice);
//         break;
//       case 'area_low':
//         filtered.sort((a, b) => a.totalBuildUpArea - b.totalBuildUpArea);
//         break;
//       case 'area_high':
//         filtered.sort((a, b) => b.totalBuildUpArea - a.totalBuildUpArea);
//         break;
//       default:
//         break;
//     }
//     setFilteredProperties(filtered);
//   }, [properties, filters]);

// //    useEffect(() => {
// //   // Inside your fetchProperties or useEffect:
// // const fetchProperties = async () => {
// //   setLoading(true);
// //   try {
// //     const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/properties/search`, {
// //       params: {
// //         // ...all filters here,
// //         size: 9999,
// //         page: 0,
// //       }
// //     });
// //     setProperties(response.data.content);
// //     setFilteredProperties(response.data.content);
// //     setTotalItems(response.data.totalElements);
// //     setTotalPages(1); // Only one page if you do it this way
// //   } catch (error) {
// //     // handle as before
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// //   fetchProperties();
// // }, [filters]);



//   const handleFilterChange = (filterName, value) => {
//     setFilters({ ...filters, [filterName]: value });
//   };

//   const handlePriceRangeChange = (type, value) => {
//     setFilters({ ...filters, [`${type}Price`]: value });
//   };

//   const clearFilters = () => {
//     setFilters({
//       propertyName: '',
//       propertyFor: '',
//       bhkType: '',
//       apartmentType: '',
//       category: '',
//       furnishedType: '',
//       minPrice: '',
//       maxPrice: '',
//       area: '',
//       // page: 0,
//       // size: 10,
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
//         <div className="text-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading properties...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white relative overflow-hidden">
//   {/* Background Elements */}
//   <div className="absolute inset-0 opacity-5">
//     <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
//     <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
//     <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-400 rounded-full blur-2xl"></div>
//   </div>

//   {/* Header */}
//   {/* Top Navigation Bar (Sticky) */}
// <div className="fixed w-full mt-16 top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/30">
//   <div className="max-w-full mx-auto px-6 lg:px-8 py-4">
//     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      
//       {/* Title + Count */}
//       <div className="lg:ml-72">
//         <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Property Listings
//         </h1>
//         <p className="text-slate-600 text-sm mt-1">
//           {totalItems} properties available


//         </p>
//       </div>

//       {/* Search Input */}
//       <div className="w-full max-w-md">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 z-10" />
//           <input
//             type="text"
//             placeholder="Search by name, city, or area..."
//             className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-700 transition-all duration-300"
//             value={filters.searchTerm}
//             onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
//           />
//         </div>
//       </div>

//     </div>
//   </div>
// </div>

//   {/* Fixed Sidebar Filters */}
//   <div className="hidden lg:block fixed top-36 left-0 w-80 rounded-lg z-40 p-6 ">
//     <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-5 h-full flex flex-col">
//       <div className="flex items-center justify-between mb-1 pb-3 border-b border-slate-200">
//         <h3 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
//           Filters
//         </h3>
//         <button
//           onClick={clearFilters}
//           className="text-xs font-medium text-slate-600 hover:text-red-500 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50"
//         >
//           <X className="h-3 w-3" />
//           Clear
//         </button>
//       </div>
      
//       <div className="space-y-4 overflow-y-auto custom-scrollbar flex-grow">
//         {/* BHK Type */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-slate-700">BHK Type</label>
//           <select
//             className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
//             value={filters.bhkType}
//             onChange={(e) => handleFilterChange('bhkType', e.target.value)}
//           >
//             <option value="">All Types</option>
//             {enums.bhkType?.map(option => (
//               <option key={option} value={option}>
//                 {formatBHK(option)}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Apartment Type */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-slate-700">Apartment Type</label>
//           <select
//             className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
//             value={filters.apartmentType}
//             onChange={(e) => handleFilterChange('apartmentType', e.target.value)}
//           >
//             <option value="">All Types</option>
//             {enums.apartmentType?.map(option => (
//               <option key={option} value={option}>
//                 {option.replace('_', ' ')}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Property Category */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-slate-700">Property Category</label>
//           <select
//             className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
//             value={filters.propertyCategory}
//             onChange={(e) => handleFilterChange('propertyCategory', e.target.value)}
//           >
//             <option value="">All Categories</option>
//             {enums.propertyCategory?.map(option => (
//               <option key={option} value={option}>
//                 {option.replace('_', ' ')}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Property For */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-slate-700">Property For</label>
//           <select
//             className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
//             value={filters.propertyFor}
//             onChange={(e) => handleFilterChange('propertyFor', e.target.value)}
//           >
//             <option value="">All</option>
//             {enums.propertyFor?.map(option => (
//               <option key={option} value={option}>
//                 {option.replace('_', ' ')}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Furnished Type */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-slate-700">Furnished Type</label>
//           <select
//             className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
//             value={filters.furnishedType}
//             onChange={(e) => handleFilterChange('furnishedType', e.target.value)}
//           >
//             <option value="">All Types</option>
//             {enums.furnishedType?.map(option => (
//               <option key={option} value={option}>
//                 {option.replace('_', ' ')}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Location */}
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-slate-700">Location</label>
//           <input
//             type="text"
//             placeholder="Enter area"
//             className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
//             value={filters.area}
//             onChange={(e) => handleFilterChange('area', e.target.value)}
//           />
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Main Content */}
//   <div className="relative z-10 lg:ml-72 px-6 lg:px-8 py-3 mt-24">
//     {filteredProperties.length > 0 ? (
//       <>
//         {viewMode === 'grid' && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
//             {filteredProperties.map((property) => (
//               <Link key={property.propertyId} to={`/listing/${property.propertyId}`}>
//                 <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white/30 group h-[480px] flex flex-col">
//                   {/* Image Section */}
//                   <div className="relative h-44 overflow-hidden flex-shrink-0">
//                     {property.propertyGallery && property.propertyGallery.length > 0 ? (
//                       <img
//                         src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
//                         alt={property.propertyName}
//                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
//                         <span className="text-slate-500 text-sm">No Image Available</span>
//                       </div>
//                     )}
                    
//                     {/* Overlays */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                     <div className="absolute bottom-3 left-3">
//                       <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
//                         {formatBHK(property.bhkType) || 'Property'}
//                       </span>
//                     </div>
//                     <div className="absolute right-3 top-3">
//                       <span className="bg-white/90 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
//                         {getRelativeTime(property.createdAt)}
//                       </span>
//                     </div>
//                     <div className="absolute left-3 top-3">
//                       <span className="bg-white/90 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
//                         {property.status}
//                       </span>
//                     </div>
//                     <div className="absolute bottom-3 right-3">
//                       <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
//                         {(property.propertyFor || '').replace('_', ' ')}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Content Section */}
//                   <div className="p-4 flex-1 flex flex-col space-y-3">
//                     {/* Title and Price */}
//                     <div className="flex justify-between items-start gap-3">
//                       <h3 className="font-bold text-base text-slate-800 flex-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
//                         {property.propertyName}
//                       </h3>
//                       <span className="text-blue-600 font-bold text-sm whitespace-nowrap">
//                         ₹{formatPrice(property.expectedPrice) || 'Price'}
//                       </span>
//                     </div>

//                     {/* Location */}
//                     <div className="flex items-center text-slate-600 gap-2">
//                       <div className="bg-slate-100 p-1.5 rounded-full">
//                         <MapPin className="w-3.5 h-3.5" />
//                       </div>
//                       <p className="text-sm line-clamp-1">
//                         {`${property.address?.area}, ${property.address?.city}, ${property.address?.state} ${property.address?.pinCode}`}
//                       </p>
//                     </div>

//                     {/* Property Details */}
//                     <div className="bg-slate-50 px-3 py-2.5 rounded-xl grid grid-cols-3 gap-3">
//                       <div className="flex flex-col items-center text-center">
//                         <div className="bg-green-100 p-1.5 rounded-lg mb-1">
//                           <Square className="w-3.5 h-3.5 text-green-600" />
//                         </div>
//                         <div className="text-xs font-semibold text-slate-800">{property.carpetArea || 'NA'}</div>
//                         <div className="text-xs text-slate-500">Carpet</div>
//                       </div>
//                       <div className="flex flex-col items-center text-center">
//                         <div className="bg-indigo-100 p-1.5 rounded-lg mb-1">
//                           <Maximize className="w-3.5 h-3.5 text-indigo-600" />
//                         </div>
//                         <div className="text-xs font-semibold text-slate-800">{property.totalBuildUpArea || 'NA'}</div>
//                         <div className="text-xs text-slate-500">Built-up</div>
//                       </div>
//                       <div className="flex flex-col items-center text-center">
//                         <div className="bg-orange-100 p-1.5 rounded-lg mb-1">
//                           <Building className="w-3.5 h-3.5 text-orange-600" />
//                         </div>
//                         <div className="text-xs font-semibold text-slate-800">
//                           {property.floor || 'NA'}/{property.totalFloors || 'NA'}
//                         </div>
//                         <div className="text-xs text-slate-500">Floor</div>
//                       </div>
//                     </div>

//                     {/* Preferred Tenants */}
//                     <div className="bg-slate-50 px-3 py-2 rounded-xl flex items-center gap-2">
//                       <User className="w-3.5 h-3.5 text-indigo-600" />
//                       <span className="text-xs text-slate-600">Preferred:</span>
//                       <span className="text-slate-700 text-xs font-semibold">
//                         {property.preferred_tenants || 'NA'}
//                       </span>
//                     </div>

//                     {/* Owner Info */}
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 flex items-center justify-between">
//                       <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
//                         <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//                         </svg>
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <p className="text-xs text-slate-600">
//                           {property.postedByUserName || 'Unknown'}
//                         </p>
//                         <p className="font-medium text-slate-800 text-xs">
//                           {property.postedByUserRole || 'Unknown'}
//                         </p>
//                       </div>
//                       <div className="flex gap-1.5 ml-3">
//                         <a
//                           href="#"
//                           onClick={(event) => handleCallClick(event, property)}
//                           className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
//                         >
//                           <Phone className="w-3.5 h-3.5" />
//                         </a>
//                         <a
//                           href={`https://wa.me/${property.postedByUserPhoneNumber}`}
//                           onClick={(event) => handleCallClick(event, property)}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
//                         >
//                           <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M20.52 3.48A11.84 11.84 0 0 0 12 0C5.37 0 0 5.37 0 12a11.86 11.86 0 0 0 1.59 5.96L0 24l6.27-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zm-8.5 17.49a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.63-.23-.37A9.92 9.92 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.04 7.02 2.93a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.9 9.9zm5.39-7.43c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.14-.17.2-.34.21-.63.07-.29-.14-1.23-.46-2.34-1.48-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.28.29-.47.1-.2.05-.37-.02-.51-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35s-1 1-1 2.43 1.02 2.81 1.16 3.01c.14.2 2 3.2 4.86 4.49.68.29 1.21.46 1.62.59.68.21 1.3.18 1.78.11.54-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.11-.26-.18-.55-.32z" />
//                           </svg>
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </>
//     ) : (
//       <div className="text-center py-16">
//         <div className="inline-block p-6 bg-white/80 rounded-2xl mb-6 backdrop-blur-sm">
//           <SlidersHorizontal className="w-16 h-16 text-slate-300 mx-auto" />
//         </div>
//         <h3 className="text-2xl font-bold text-slate-800 mb-3">No properties found</h3>
//         <p className="text-slate-600 mb-8 max-w-md mx-auto">Try adjusting your filters to discover more properties that match your preferences.</p>
//         <button
//           onClick={clearFilters}
//           className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
//         >
//           Clear All Filters
//         </button>
//       </div>
//     )}
//     {/* Pagination Controls */}
// {totalPages > 1 && (
//   <div className="flex justify-center items-center space-x-2 mt-6 mb-8">
//     <button
//       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
//       disabled={currentPage === 0}
//       className={`px-3 py-1 rounded-md border ${
//         currentPage === 0 ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-blue-600 border-blue-600 hover:bg-blue-100'
//       }`}
//     >
//       Previous
//     </button>

//     {/* Optional: Show page numbers */}
//     {[...Array(totalPages)].map((_, idx) => (
//       <button
//         key={idx}
//         onClick={() => setCurrentPage(idx)}
//         className={`px-3 py-1 rounded-md border ${
//           idx === currentPage ? 'bg-blue-600 text-white' : 'text-blue-600 border-blue-600 hover:bg-blue-100'
//         }`}
//       >
//         {idx + 1}
//       </button>
//     ))}

//     <button
//       onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
//       disabled={currentPage === totalPages - 1}
//       className={`px-3 py-1 rounded-md border ${
//         currentPage === totalPages - 1 ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-blue-600 border-blue-600 hover:bg-blue-100'
//       }`}
//     >
//       Next
//     </button>
//   </div>
// )}

//   </div>

  

  

//   {/* Mobile Filter Modal */}
//   {isFilterModalOpen && (
//     <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end lg:hidden">
//       <div className="bg-white w-80 h-full p-6 overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-bold text-slate-800">Filters</h3>
//           <button
//             onClick={() => setIsFilterModalOpen(false)}
//             className="text-slate-500 hover:text-slate-700"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">BHK Type</label>
//             <select
//               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//               value={filters.bhkType}
//               onChange={(e) => handleFilterChange('bhkType', e.target.value)}
//             >
//               <option value="">All Types</option>
//               {enums.bhkType?.map(option => (
//                 <option key={option} value={option}>
//                   {option.replace('_', ' ')}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Apartment Type</label>
//             <select
//               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//               value={filters.apartmentType}
//               onChange={(e) => handleFilterChange('apartmentType', e.target.value)}
//             >
//               <option value="">All Types</option>
//               {enums.apartmentType?.map(option => (
//                 <option key={option} value={option}>
//                   {option.replace('_', ' ')}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Property Category</label>
//             <select
//               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//               value={filters.propertyCategory}
//               onChange={(e) => handleFilterChange('propertyCategory', e.target.value)}
//             >
//               <option value="">All Categories</option>
//               {enums.propertyCategory?.map(option => (
//                 <option key={option} value={option}>
//                   {option.replace('_', ' ')}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Property For</label>
//             <select
//               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//               value={filters.propertyFor}
//               onChange={(e) => handleFilterChange('propertyFor', e.target.value)}
//             >
//               <option value="">All</option>
//               {enums.propertyFor?.map(option => (
//                 <option key={option} value={option}>
//                   {option.replace('_', ' ')}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Furnished Type</label>
//             <select
//               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//               value={filters.furnishedType}
//               onChange={(e) => handleFilterChange('furnishedType', e.target.value)}
//             >
//               <option value="">All Types</option>
//               {enums.furnishedType?.map(option => (
//                 <option key={option} value={option}>
//                   {option.replace('_', ' ')}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Area</label>
//             <input
//               type="text"
//               placeholder="Enter area"
//               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//               value={filters.area}
//               onChange={(e) => handleFilterChange('area', e.target.value)}
//             />
//           </div>
//           <div className="flex gap-3 mt-8">
//             <button
//               onClick={clearFilters}
//               className="flex-1 bg-slate-200 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors font-medium"
//             >
//               Clear Filters
//             </button>
//             <button
//               onClick={() => setIsFilterModalOpen(false)}
//               className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )}

//   {/* Mobile Filter Button */}
//   <button
//     onClick={() => setIsFilterModalOpen(true)}
//     className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 transform hover:scale-110"
//   >
//     <SlidersHorizontal className="w-6 h-6" />
//   </button>
// </div>
//   );
// };

// export default Listing;



import React, { useEffect, useState, useCallback, useContext } from 'react';
import { MapPin, Heart, Phone, Search, X, SlidersHorizontal, Grid, List, Ruler, Maximize, Square, Building, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "../context/Authcontext";
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

const getRelativeTime = (timestamp) => {
  const now = dayjs();
  const created = dayjs(timestamp);
  const diffInMinutes = now.diff(created, "minute");

  if (diffInMinutes < 60) {
    return "Just now";
  }
  return created.fromNow();
};

const Listing = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [enums, setEnums] = useState({});
  const [searchMode, setSearchMode] = useState(false); // Track if we're in search mode
  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  const [filters, setFilters] = useState({
    propertyName: location.state?.propertyName || '',
    propertyFor: location.state?.propertyFor || '',
    selectedLocations: location.state?.selectedLocations || [],
    bhkType: location.state?.bhkType || '',
    apartmentType: location.state?.apartmentType || '',
    category: location.state?.category || '',
    furnishedType: location.state?.furnishedType || '',
    preferredTenants: location.state?.preferredTenants || '',
    minPrice: location.state?.minPrice || '',
    maxPrice: location.state?.maxPrice || '',
    area: location.state?.area || '',
    searchTerm: '',
    sortBy: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchEnums = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/properties/all_enum`);
      setEnums(response.data);
    } catch (error) {
      console.error("Error fetching enums:", error);
    }
  };

  useEffect(() => {
    fetchEnums();
  }, []);

  const formatPrice = (price) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)} Cr`;
    if (price >= 100000) return `${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)} L`;
    if (price >= 1000) return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)} k`;
    return price;
  };

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

  // Check if any filter has a value (excluding search term)
  const hasActiveFilters = () => {
    const filterKeys = ['propertyName', 'propertyFor', 'bhkType', 'apartmentType', 'category', 'furnishedType', 'preferredTenants', 'minPrice', 'maxPrice', 'area'];
    return filterKeys.some(key => {
      const value = filters[key];
      return value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '');
    }) || (filters.selectedLocations && filters.selectedLocations.length > 0);
  };

  // Search Properties using backend search endpoint
  const searchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const searchParams = {};
      
      if (filters.propertyName) searchParams.propertyName = filters.propertyName;
      if (filters.propertyFor) {
        // Handle BUY -> SELL mapping
        searchParams.propertyFor = filters.propertyFor === "BUY" ? "SELL" : filters.propertyFor;
      }
      if (filters.bhkType) searchParams.bhkType = filters.bhkType;
      if (filters.apartmentType) searchParams.apartmentType = filters.apartmentType;
      if (filters.category) searchParams.category = filters.category;
      if (filters.furnishedType) searchParams.furnishedType = filters.furnishedType;
      if (filters.preferredTenants) searchParams.preferredTenants = filters.preferredTenants;
      if (filters.minPrice) searchParams.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) searchParams.maxPrice = parseFloat(filters.maxPrice);
      if (filters.area) searchParams.area = filters.area;
      
      // Handle selectedLocations (area filter)
      if (filters.selectedLocations && filters.selectedLocations.length > 0) {
        // For now, use the first selected location as area filter
        // You might want to modify backend to handle multiple locations
        searchParams.area = filters.selectedLocations[0];
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/properties/search`,
        { params: searchParams }
      );

      // Filter only ACTIVE properties
      const activeProperties = (response.data || []).filter(
        property => property.status === 'ACTIVE'
      );

      const propertiesWithDefaults = activeProperties.map(property => ({
        ...property,
        bhkType: property.bhkType || 'ONE_BHK',
      }));

      // Apply local search term filter if exists
      let filteredProperties = propertiesWithDefaults;
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        filteredProperties = propertiesWithDefaults.filter((property) => {
          const propertyForDisplay = property.propertyFor?.toUpperCase() === "BUY" ? "SELL" : property.propertyFor;
          return (
            property.propertyName?.toLowerCase().includes(searchTermLower) ||
            property.address?.city?.toLowerCase().includes(searchTermLower) ||
            property.address?.area?.toLowerCase().includes(searchTermLower) ||
            propertyForDisplay?.toLowerCase().includes(searchTermLower) ||
            property.description?.toLowerCase().includes(searchTermLower) ||
            property.apartmentType?.toLowerCase().includes(searchTermLower) ||
            property.bhkType?.toLowerCase().includes(searchTermLower) ||
            property.furnishedType?.toLowerCase().includes(searchTermLower) ||
            property.status?.toLowerCase().includes(searchTermLower)
          );
        });
      }

      // Apply local sorting
      switch (filters.sortBy) {
        case 'price_low':
          filteredProperties.sort((a, b) => a.expectedPrice - b.expectedPrice);
          break;
        case 'price_high':
          filteredProperties.sort((a, b) => b.expectedPrice - a.expectedPrice);
          break;
        case 'area_low':
          filteredProperties.sort((a, b) => a.totalBuildUpArea - b.totalBuildUpArea);
          break;
        case 'area_high':
          filteredProperties.sort((a, b) => b.totalBuildUpArea - a.totalBuildUpArea);
          break;
        default:
          break;
      }

      setProperties(filteredProperties);
      setTotalItems(filteredProperties.length);
      setTotalPages(1); // All results in one page for search
      setCurrentPage(0);
      setSearchMode(true);
    } catch (error) {
      console.error("Error searching properties:", error);
      setProperties([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch all properties with pagination
  const fetchAllProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/properties/get`,
        {
          params: {
            page: currentPage,
            size: itemsPerPage,
            sort: 'propertyId',
            direction: 'desc',
          },
        }
      );

      const data = response.data;

      // Only keep properties with status 'ACTIVE'
      const activeProperties = (data.content || []).filter(
        property => property.status === 'ACTIVE'
      );

      const propertiesWithDefaults = activeProperties.map(property => ({
        ...property,
        bhkType: property.bhkType || 'ONE_BHK',
      }));

      // Apply local search term filter if exists
      let filteredProperties = propertiesWithDefaults;
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        filteredProperties = propertiesWithDefaults.filter((property) => {
          const propertyForDisplay = property.propertyFor?.toUpperCase() === "BUY" ? "SELL" : property.propertyFor;
          return (
            property.propertyName?.toLowerCase().includes(searchTermLower) ||
            property.address?.city?.toLowerCase().includes(searchTermLower) ||
            property.address?.area?.toLowerCase().includes(searchTermLower) ||
            propertyForDisplay?.toLowerCase().includes(searchTermLower) ||
            property.description?.toLowerCase().includes(searchTermLower) ||
            property.apartmentType?.toLowerCase().includes(searchTermLower) ||
            property.bhkType?.toLowerCase().includes(searchTermLower) ||
            property.furnishedType?.toLowerCase().includes(searchTermLower) ||
            property.status?.toLowerCase().includes(searchTermLower)
          );
        });
      }

      setProperties(filteredProperties);
      setTotalItems(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setSearchMode(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters.searchTerm]);

  // Effect to determine whether to search or fetch all
  useEffect(() => {
    if (hasActiveFilters()) {
      searchProperties();
    } else {
      fetchAllProperties();
    }
  }, [searchProperties, fetchAllProperties]);

  // Reset to first page when filters change
  useEffect(() => {
    if (hasActiveFilters()) {
      setCurrentPage(0);
    }
  }, [filters.propertyName, filters.propertyFor, filters.bhkType, filters.apartmentType, filters.category, filters.furnishedType, filters.preferredTenants, filters.minPrice, filters.maxPrice, filters.area, filters.selectedLocations]);

  // Handle search term separately (real-time)
  useEffect(() => {
    if (searchMode || !hasActiveFilters()) {
      // Re-fetch current data when search term changes
      if (hasActiveFilters()) {
        searchProperties();
      } else {
        fetchAllProperties();
      }
    }
  }, [filters.searchTerm]);

  const handleCallClick = async (event, property) => {
    event.preventDefault();

    if (!user) {
      toast.error("You must be logged in to make a call.");
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

      toast.success(response?.data?.message || "Call access granted");

      setTimeout(() => {
        window.location.href = `tel:${property.postedByUserPhoneNumber}`;
      }, 1000);

    } catch (error) {
      console.error("Error accessing contact:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.statusText || 
        "Something went wrong";

      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const clearFilters = () => {
    setFilters({
      propertyName: '',
      propertyFor: '',
      selectedLocations: [],
      bhkType: '',
      apartmentType: '',
      category: '',
      furnishedType: '',
      preferredTenants: '',
      minPrice: '',
      maxPrice: '',
      area: '',
      searchTerm: '',
      sortBy: ''
    });
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-400 rounded-full blur-2xl"></div>
      </div>

      {/* Top Navigation Bar (Sticky) */}
      <div className="fixed w-full mt-16 top-0 z-30 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/30">
        <div className="max-w-full mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Title + Count */}
            <div className="lg:ml-72">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Property Listings
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                {totalItems} properties available
                {searchMode && hasActiveFilters() && " (filtered)"}
              </p>
            </div>

            {/* Search Input */}
            {/* <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 z-10" />
                <input
                  type="text"
                  placeholder="Search by name, city, or area..."
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-slate-700 transition-all duration-300"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
            </div> */}

          </div>
        </div>
      </div>

      {/* Fixed Sidebar Filters */}
      <div className="hidden lg:block fixed top-36 left-0 w-80 rounded-lg z-40 p-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-1 pb-3 border-b border-slate-200">
            <h3 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-slate-600 hover:text-red-500 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </div>
          
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-grow">
            {/* Property Name */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Property Name</label>
              <input
                type="text"
                placeholder="Enter property name"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                value={filters.propertyName}
                onChange={(e) => handleFilterChange('propertyName', e.target.value)}
              />
            </div> */}

            {/* Property For */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Property For</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                value={filters.propertyFor}
                onChange={(e) => handleFilterChange('propertyFor', e.target.value)}
              >
                <option value="">All</option>
                {enums.propertyFor?.map(option => (
                  <option key={option} value={option}>
                    {option.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* BHK Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">BHK Type</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                value={filters.bhkType}
                onChange={(e) => handleFilterChange('bhkType', e.target.value)}
              >
                <option value="">All Types</option>
                {enums.bhkType?.map(option => (
                  <option key={option} value={option}>
                    {formatBHK(option)}
                  </option>
                ))}
              </select>
            </div>

            {/* Apartment Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Apartment Type</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                value={filters.apartmentType}
                onChange={(e) => handleFilterChange('apartmentType', e.target.value)}
              >
                <option value="">All Types</option>
                {enums.apartmentType?.map(option => (
                  <option key={option} value={option}>
                    {option.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Property Category</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {enums.propertyCategory?.map(option => (
                  <option key={option} value={option}>
                    {option.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Furnished Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Furnished Type</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                value={filters.furnishedType}
                onChange={(e) => handleFilterChange('furnishedType', e.target.value)}
              >
                <option value="">All Types</option>
                {enums.furnishedType?.map(option => (
                  <option key={option} value={option}>
                    {option.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div> */}

            {/* Location */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Location</label>
              <input
                type="text"
                placeholder="Enter area"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
              />
            </div> */}

            {/* Sort By */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Sort By</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm shadow-sm transition-all duration-200"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="">Default</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="area_low">Area: Low to High</option>
                <option value="area_high">Area: High to Low</option>
              </select>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 lg:ml-72 px-6 lg:px-8 py-3 mt-24">
        {properties.length > 0 ? (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {properties.map((property) => (
                  <Link key={property.propertyId} to={`/listing/${property.propertyId}`}>
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-white/30 group h-[480px] flex flex-col">
                      {/* Image Section */}
                      <div className="relative h-44 overflow-hidden flex-shrink-0">
                        {property.propertyGallery && property.propertyGallery.length > 0 ? (
                          <img
                            src={`${import.meta.env.VITE_BASE_URL}/media/${property.propertyGallery[0]}`}
                            alt={property.propertyName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <span className="text-slate-500 text-sm">No Image Available</span>
                          </div>
                        )}
                        
                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            {formatBHK(property.bhkType) || 'Property'}
                          </span>
                        </div>
                        <div className="absolute right-3 top-3">
                          <span className="bg-white/90 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                            {getRelativeTime(property.createdAt)}
                          </span>
                        </div>
                        {/* <div className="absolute left-3 top-3">
                          <span className="bg-white/90 text-blue-600 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                            {property.status}
                          </span>
                        </div> */}
                        <div className="absolute bottom-3 right-3">
                          <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            {(property.propertyFor || '').replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 flex-1 flex flex-col space-y-3">
                        {/* Title and Price */}
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-bold text-base text-slate-800 flex-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {property.propertyName}
                          </h3>
                          <span className="text-blue-600 font-bold text-sm whitespace-nowrap">
                            ₹{formatPrice(property.expectedPrice) || 'Price'}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-slate-600 gap-2">
                          <div className="bg-slate-100 p-1.5 rounded-full">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-sm line-clamp-1">
                            {`${property.address?.area}, ${property.address?.city}, ${property.address?.state} ${property.address?.pinCode}`}
                          </p>
                        </div>

                        {/* Property Details */}
                        <div className="bg-slate-50 px-3 py-2.5 rounded-xl grid grid-cols-3 gap-3">
                          <div className="flex flex-col items-center text-center">
                            <div className="bg-green-100 p-1.5 rounded-lg mb-1">
                              <Square className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <div className="text-xs font-semibold text-slate-800">{property.carpetArea || 'NA'}</div>
                            <div className="text-xs text-slate-500">Carpet</div>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <div className="bg-indigo-100 p-1.5 rounded-lg mb-1">
                              <Maximize className="w-3.5 h-3.5 text-indigo-600" />
                            </div>
                            <div className="text-xs font-semibold text-slate-800">{property.totalBuildUpArea || 'NA'}</div>
                            <div className="text-xs text-slate-500">Built-up</div>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <div className="bg-orange-100 p-1.5 rounded-lg mb-1">
                              <Building className="w-3.5 h-3.5 text-orange-600" />
                            </div>
                            <div className="text-xs font-semibold text-slate-800">
                              {property.floor || 'NA'}/{property.totalFloors || 'NA'}
                            </div>
                            <div className="text-xs text-slate-500">Floor</div>
                          </div>
                        </div>

                        {/* Preferred Tenants */}
                        <div className="bg-slate-50 px-3 py-2 rounded-xl flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-xs text-slate-600">Preferred:</span>
                          <span className="text-slate-700 text-xs font-semibold">
                            {property.preferred_tenants || 'NA'}
                          </span>
                        </div>

                        {/* Owner Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 flex items-center justify-between">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-600">
                              {property.postedByUserName || 'Unknown'}
                            </p>
                            <p className="font-medium text-slate-800 text-xs">
                              {property.postedByUserRole || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex gap-1.5 ml-3">
                            <a
                              href="#"
                              onClick={(event) => handleCallClick(event, property)}
                              className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${property.postedByUserPhoneNumber}`}
                              onClick={(event) => handleCallClick(event, property)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.52 3.48A11.84 11.84 0 0 0 12 0C5.37 0 0 5.37 0 12a11.86 11.86 0 0 0 1.59 5.96L0 24l6.27-1.64A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zm-8.5 17.49a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.97.99-3.63-.23-.37A9.92 9.92 0 0 1 2.1 12c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.14 1.04 7.02 2.93a9.87 9.87 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.9 9.9zm5.39-7.43c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.28-.74.94-.91 1.14-.17.2-.34.21-.63.07-.29-.14-1.23-.46-2.34-1.48-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.28.29-.47.1-.2.05-.37-.02-.51-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35s-1 1-1 2.43 1.02 2.81 1.16 3.01c.14.2 2 3.2 4.86 4.49.68.29 1.21.46 1.62.59.68.21 1.3.18 1.78.11.54-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.11-.26-.18-.55-.32z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-white/80 rounded-2xl mb-6 backdrop-blur-sm">
              <SlidersHorizontal className="w-16 h-16 text-slate-300 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No properties found</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Try adjusting your filters to discover more properties that match your preferences.
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination Controls - Only show when not in search mode */}
        {!searchMode && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6 mb-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-md border transition-colors ${
                currentPage === 0 
                  ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                  : 'text-blue-600 border-blue-600 hover:bg-blue-100'
              }`}
            >
              Previous
            </button>

            {/* Page numbers */}
            {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx;
              } else if (currentPage < 3) {
                pageNum = idx;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 5 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-md border transition-colors ${
                    pageNum === currentPage 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'text-blue-600 border-blue-600 hover:bg-blue-100'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1}
              className={`px-4 py-2 rounded-md border transition-colors ${
                currentPage === totalPages - 1 
                  ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                  : 'text-blue-600 border-blue-600 hover:bg-blue-100'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Search Mode Info */}
        {searchMode && hasActiveFilters() && (
          <div className="text-center mt-6 mb-8">
            <p className="text-slate-600 text-sm">
              Showing filtered results. <button 
                onClick={clearFilters} 
                className="text-blue-600 hover:underline font-medium"
              >
                Clear filters
              </button> to see all properties with pagination.
            </p>
          </div>
        )}
      </div>

      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end lg:hidden">
          <div className="bg-white w-80 h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Filters</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Property Name */}
              {/* <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Property Name</label>
                <input
                  type="text"
                  placeholder="Enter property name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={filters.propertyName}
                  onChange={(e) => handleFilterChange('propertyName', e.target.value)}
                />
              </div> */}

              {/* Property For */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Property For</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={filters.propertyFor}
                  onChange={(e) => handleFilterChange('propertyFor', e.target.value)}
                >
                  <option value="">All</option>
                  {enums.propertyFor?.map(option => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* BHK Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">BHK Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={filters.bhkType}
                  onChange={(e) => handleFilterChange('bhkType', e.target.value)}
                >
                  <option value="">All Types</option>
                  {enums.bhkType?.map(option => (
                    <option key={option} value={option}>
                      {formatBHK(option)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Apartment Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Apartment Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={filters.apartmentType}
                  onChange={(e) => handleFilterChange('apartmentType', e.target.value)}
                >
                  <option value="">All Types</option>
                  {enums.apartmentType?.map(option => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Property Category</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {enums.propertyCategory?.map(option => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Furnished Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Furnished Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={filters.furnishedType}
                  onChange={(e) => handleFilterChange('furnishedType', e.target.value)}
                >
                  <option value="">All Types</option>
                  {enums.furnishedType?.map(option => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              {/* <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div> */}

              {/* Area */}
              {/* <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Area</label>
                <input
                  type="text"
                  placeholder="Enter area"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                />
              </div> */}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFilterModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 transform hover:scale-110"
      >
        <SlidersHorizontal className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Listing;