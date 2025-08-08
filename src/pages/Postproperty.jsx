  import React, { useEffect, useState, useContext } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { AuthContext } from '../context/Authcontext'; // Adjust the import path as necessary
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  const PostProperty = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Access the user from AuthContext
    const pinCodeRegex = /^[1-9][0-9]{0,5}$/; // allow partial match while typing
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10000);
    const [totalPages, setTotalPages] = useState(0);

    const formatIndianNumber = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";

    if (num >= 1e7) return `${(num / 1e7).toFixed(2)} Cr`;
    if (num >= 1e5) return `${(num / 1e5).toFixed(2)} L`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)} K`;
    return num.toString();
  };

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);


    const [clicked, setClicked] = useState(false);

    const handlePost = (e) => {
      e.preventDefault();
      if (clicked) return;

      setClicked(true);

      // Your form submission logic here
      console.log("Property posted!");
    };

    // State declarations remain the same
    const [enums, setEnums] = useState({
      propertyCategory: [],
      furnishedType: [],
      bhkType: [],
      propertyFor: [],
      apartmentType: [],
    });

    useEffect(() => {
      const fetchEnums = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/properties/all_enum`
          );
          setEnums(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching enums:", error);
        }
      };
      fetchEnums();
    }, []);

    const [selectedFiles, setSelectedFiles] = useState([]);

    // Basic state
    const [propertyType, setPropertyType] = useState("");
    const [subPropertyType, setSubPropertyType] = useState("");
    const [transactionType, setTransactionType] = useState("");


    // Property Details
    const [propertyName, setPropertyName] = useState("");
    const [apartmentType, setApartmentType] = useState("");
    const [bhkType, setBhkType] = useState("");
    const [floor, setFloor] = useState("");
    const [totalFloor, setTotalFloor] = useState("");
    const [propertyAge, setPropertyAge] = useState("");
    const [builtUpArea, setBuiltUpArea] = useState("");
    const [carpetArea, setCarpetArea] = useState("");

    // Location Details
    const [area, setArea] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    // Rental/Purchase Details
    // const [expectedRent, setExpectedRent] = useState("");
    const [expectedDeposit, setExpectedDeposit] = useState("");
    const [monthlyMaintenance, setMonthlyMaintenance] = useState("");
    const [availableFrom, setAvailableFrom] = useState("");
    const [preferredTenants, setPreferredTenants] = useState("");
    const [furnishing, setFurnishing] = useState("");
    const [expectedPrice, setExpectedPrice] = useState("");
    const [description, setDescription] = useState("");
    // const [postedByUserPhoneNumber, setpostedByUserPhoneNumber] = useState('');


    // PG Specific
    const [roomType, setRoomType] = useState("");
    const [pgGender, setPgGender] = useState("");
    const [preferredGuests, setPreferredGuests] = useState("");
    const [gateClosingTime, setGateClosingTime] = useState("");

    // Commercial Specific
    const [buildingType, setBuildingType] = useState("");
    const [floorType, setFloorType] = useState("");

    // Land/Plot Specific
    const [plotArea, setPlotArea] = useState("");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [boundaryWall, setBoundaryWall] = useState("");
    const [amenities, setAmenities] = useState({});
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    // useEffect(() => {
    //   const fetchAmenities = async () => {
    //     try {
    //       const response = await fetch(
    //         `${import.meta.env.VITE_BASE_URL}/api/amenities/get`
    //       );
    //       const data = await response.json();
    //       setAmenities(data);
    //     } catch (error) {
    //       console.error("Error fetching amenities:", error);
    //     }
    //   };

    //   fetchAmenities();
    // }, []);

    useEffect(() => {
  const fetchAmenities = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/amenities/get?page=${page}&size=${size}`
      );
      const data = await response.json();
      setAmenities(data.content);       // data.content holds the list
      setTotalPages(data.totalPages);   // to support pagination UI
    } catch (error) {
      console.error("Error fetching amenities:", error);
    }
  };

  fetchAmenities();
}, [page, size]); // Depend on page or size to refetch


    const handleAmenityChange = (amenityId) => {
      setSelectedAmenities((prevState) =>
        prevState.includes(amenityId)
          ? prevState.filter((id) => id !== amenityId)
          : [...prevState, amenityId]
      );
    };

    const cities = ["Pune"];

    const handlePropertyTypeClick = (type) => {
      setPropertyType(type);
      setSubPropertyType("");
      setTransactionType("");
      console.log("Property Type:", type);
    };

    const handleTransactionTypeClick = (type) => {
      setTransactionType(type);
      console.log("Transaction Type:", type);
    };

    // const handleSubmit = async (e) => {
    //   e.preventDefault();

    //   const formData = new FormData();

    //   // Use the user ID from the context
    //   const userId = user?.id; // Access the userId from the user object

    //   if (!userId) {
    //     console.error("User ID is not available");
    //     alert("User ID is not available. Please log in again.");
    //     return;
    //   }

    //   const propertyData = {
    //     postedByUserId: user.id, // Use the user ID from the context
    //     category: propertyType || "RESIDENTIAL",
    //     propertyFor: transactionType || "RENT",
    //     apartmentType: apartmentType || "FLAT",
    //     propertyName: propertyName || "test",
    //     bhkType: bhkType || "BHK_6",
    //     floor: parseInt(floor) || 1,
    //     totalFloors: parseInt(totalFloor) || 1,
    //     totalBuildUpArea: parseFloat(builtUpArea) || 1,
    //     carpetArea: parseFloat(carpetArea) || 1,
    //     address: {
    //       area: area || "test",
    //       city: "Pune",
    //       state: state || "test",
    //       pinCode: pincode || "1",
    //     },
    //     buildingType: buildingType || "",
    //     plotArea: parseFloat(plotArea) || 0,
    //     length: parseFloat(length) || 0,
    //     width: parseFloat(width) || 0,
    //     boundaryWall: boundaryWall || "",
    //     expectedPrice: parseFloat(expectedPrice) || 0,
    //     deposit: parseFloat(expectedDeposit) || 1,
    //     monthlyMaintenance: parseFloat(monthlyMaintenance) || 1,
    //     availableFrom:
    //       new Date(availableFrom).toISOString() || new Date().toISOString(),
    //     preferred_tenants: preferredTenants || "Anyone",
    //     furnishedType: furnishing || "UNFURNISHED",
    //     description: description || "test",
    //     amenityIds: selectedAmenities,
    //     // postedByUserPhoneNumber: postedByUserPhoneNumber || "",

    //   };

    //   console.log("Property Data:", propertyData);

    //   formData.append("property", JSON.stringify(propertyData));

    //   selectedFiles.forEach((file) => {
    //     formData.append("images", file);
    //   });

    //   try {
    //     const response = await axios.post(
    //       `${import.meta.env.VITE_BASE_URL}/api/properties/add`,
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       }
    //     );
    //     console.log("Property posted successfully:", response.data);
    //     alert("Property posted successfully!");
    //     navigate('/listing');
    //   } catch (error) {
    //     console.error(
    //       "Error posting property:",
    //       error.response ? error.response.data : error.message
    //     );
    //     alert("Error posting property. Please try again.");
    //   }
    // };


  //   const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();

  //   const userId = user?.id;
  //   if (!userId) {
  //     console.error("User ID is not available");
  //     alert("User ID is not available. Please log in again.");
  //     return;
  //   }

  //   const propertyData = {
  //     postedByUserId: user.id,
  //     category: propertyType || "RESIDENTIAL",
  //     propertyFor: transactionType || "RENT",
  //     apartmentType: apartmentType || "FLAT",
  //     propertyName: propertyName || "test",
  //     bhkType: bhkType || "BHK_6",
  //     floor: parseInt(floor) || 1,
  //     totalFloors: parseInt(totalFloor) || 1,
  //     totalBuildUpArea: parseFloat(builtUpArea) || 1,
  //     carpetArea: parseFloat(carpetArea) || 1,
  //     address: {
  //       area: area || "test",
  //       city: "Pune",
  //       state: state || "test",
  //       pinCode: pincode || "1",
  //     },
  //     buildingType: buildingType || "",
  //     plotArea: parseFloat(plotArea) || 0,
  //     length: parseFloat(length) || 0,
  //     width: parseFloat(width) || 0,
  //     boundaryWall: boundaryWall || "",
  //     expectedPrice: parseFloat(expectedPrice) || 0,
  //     deposit: parseFloat(expectedDeposit) || 1,
  //     monthlyMaintenance: parseFloat(monthlyMaintenance) || 1,
  //     availableFrom:
  //       new Date(availableFrom).toISOString() || new Date().toISOString(),
  //     preferred_tenants: preferredTenants || "Anyone",
  //     furnishedType: furnishing || "UNFURNISHED",
  //     description: description || "test",
  //     amenityIds: selectedAmenities || [],
  //   };

  //   // console.log("Property Data:", propertyData);
  //   formData.append("property", JSON.stringify(propertyData));

  //   // ✅ Image validation
  //   if (selectedFiles.length === 0) {
  //     try {
  //       alert("No images uploaded. Attaching default image...");

  //       const response = await fetch("/default.png"); // Ensure this image exists in /public
  //       const blob = await response.blob();
  //       const defaultFile = new File([blob], "default.png", { type: blob.type });
  //       formData.append("images", defaultFile);
  //     } catch (error) {
  //       console.error("Failed to load default image:", error);
  //       alert("Default image could not be attached. Please try again.");
  //       return;
  //     }
  //   } else if (selectedFiles.length > 4) {
  //     alert("You can upload a maximum of 4 images.");
  //     return;
  //   } else {
  //     selectedFiles.forEach((file) => {
  //       formData.append("images", file);
  //     });
  //   }

  //   // ✅ Post the form data
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/api/properties/add`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log("Property posted successfully:", response.data);
  //     alert("Property posted successfully!");
  //     navigate('/listing');
  //   } catch (error) {
  //     console.error(
  //       "Error posting property:",
  //       error.response ? error.response.data : error.message
  //     );
  //     alert("Error posting property. Please try again.");
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   const userId = user?.id;
  //   if (!userId) {
  //     console.error("User ID is not available");
  //     toast.error("User ID is not available. Please log in again.");
  //     return;
  //   }

  //   const propertyData = {
  //     postedByUserId: user.id,
  //     category: propertyType || "RESIDENTIAL",
  //     propertyFor: transactionType || "RENT",
  //     apartmentType: apartmentType || "FLAT",
  //     propertyName: propertyName || "test",
  //     bhkType: bhkType || "BHK_6",
  //     floor: parseInt(floor) || 1,
  //     totalFloors: parseInt(totalFloor) || 1,
  //     totalBuildUpArea: parseFloat(builtUpArea) || 1,
  //     carpetArea: parseFloat(carpetArea) || 1,
  //     address: {
  //       area: area || "test",
  //       city: "Pune",
  //       state: state || "test",
  //       pinCode: pincode || "1",
  //     },
  //     buildingType: buildingType || "",
  //     plotArea: parseFloat(plotArea) || 0,
  //     length: parseFloat(length) || 0,
  //     width: parseFloat(width) || 0,
  //     boundaryWall: boundaryWall || "",
  //     expectedPrice: parseFloat(expectedPrice) || 0,
  //     deposit: parseFloat(expectedDeposit) || 1,
  //     monthlyMaintenance: parseFloat(monthlyMaintenance) || 1,
  //     availableFrom: new Date(availableFrom).toISOString() || new Date().toISOString(),
  //     preferred_tenants: preferredTenants || "Anyone",
  //     furnishedType: furnishing || "UNFURNISHED",
  //     description: description || "test",
  //     amenityIds: selectedAmenities || [],
  //   };

  //   formData.append("property", JSON.stringify(propertyData));

  //   if (selectedFiles.length === 0) {
  //     try {
  //       toast.info("No images uploaded. Attaching default image...");
  //       const response = await fetch("/default.png");
  //       const blob = await response.blob();
  //       const defaultFile = new File([blob], "default.png", { type: blob.type });
  //       formData.append("images", defaultFile);
  //     } catch (error) {
  //       console.error("Failed to load default image:", error);
  //       toast.error("Default image could not be attached. Please try again.");
  //       return;
  //     }
  //   } else if (selectedFiles.length > 8) {
  //     toast.error("You can upload a maximum of 8 images.");
  //     return;
  //   } else {
  //     selectedFiles.forEach((file) => {
  //       formData.append("images", file);
  //     });
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/api/properties/add`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     console.log("Property posted successfully:", response.data);
  //     toast.success("Property posted successfully!");


  //     // Navigate or perform other actions as needed
  //     navigate('/listing');
  //   } catch (error) {
  //     console.error(
  //       "Error posting property:",
  //       error.response ? error.response.data : error.message
  //     );

  //     if (error.response && error.response.data && error.response.data.error) {
  //       const errorMessage = error.response.data.error;
  //       if (errorMessage.includes("Post limit exceeded") || errorMessage.includes("Please upgrade your package")) {
  //         toast.error(
  //           <div>
  //             <p>Post limit exceeded. You can only post 3 properties.</p>
  //             <button onClick={() => navigate('/upgrade-package')}>Upgrade Package</button>
  //           </div>
  //         );
  //       } else {
  //         toast.error(errorMessage);
  //       }
  //     } else {
  //       toast.error("Error posting property. Please try again.");
  //     }
  //   }
  // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   const formData = new FormData();
//   const userId = user?.id;

//   if (!userId) {
//     console.error("User ID is not available");
//     toast.error("User ID is not available. Please log in again.");
//     return;
//   }

//   const propertyData = {
//     postedByUserId: user.id,
//     category: propertyType || "RESIDENTIAL",
//     propertyFor: transactionType || "RENT",
//     apartmentType: apartmentType || "FLAT",
//     propertyName: propertyName || "test",
//     bhkType: bhkType || "BHK_6",
//     floor: parseInt(floor) || 1,
//     totalFloors: parseInt(totalFloor) || 1,
//     totalBuildUpArea: parseFloat(builtUpArea) || 1,
//     carpetArea: parseFloat(carpetArea) || 1,
//     address: {
//       area: area || "test",
//       city: "Pune",
//       state: state || "test",
//       pinCode: pincode || "1",
//     },
//     buildingType: buildingType || "",
//     plotArea: parseFloat(plotArea) || 0,
//     length: parseFloat(length) || 0,
//     width: parseFloat(width) || 0,
//     boundaryWall: boundaryWall || "",
//     expectedPrice: parseFloat(expectedPrice) || 0,
//     deposit: parseFloat(expectedDeposit) || 1,
//     monthlyMaintenance: parseFloat(monthlyMaintenance) || 1,
//     availableFrom: new Date(availableFrom).toISOString() || new Date().toISOString(),
//     preferred_tenants: preferredTenants || "Anyone",
//     furnishedType: furnishing || "UNFURNISHED",
//     description: description || "test",
//     amenityIds: selectedAmenities || [],
//   };

//   formData.append("property", JSON.stringify(propertyData));

//   if (selectedFiles.length === 0) {
//     try {
//       toast.info("No images uploaded. Attaching default image...");
//       const response = await fetch("/default.png");
//       const blob = await response.blob();
//       const defaultFile = new File([blob], "default.png", { type: blob.type });
//       formData.append("images", defaultFile);
//     } catch (error) {
//       console.error("Failed to load default image:", error);
//       toast.error("Default image could not be attached. Please try again.");
//       return;
//     }
//   } else if (selectedFiles.length > 8) {
//     toast.error("You can upload a maximum of 8 images.");
//     return;
//   } else {
//     selectedFiles.forEach((file) => {
//       formData.append("images", file);
//     });
//   }

//   try {
//     const response = await axios.post(
//       `${import.meta.env.VITE_BASE_URL}/api/properties/add`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     // Show success message
//     toast.success(response.data.message || "Property posted successfully!");

//     // Optional: Show remaining post count if available
//     if (response.data.remainingPostsUsed !== undefined) {
//       toast.info(`Remaining post count: ${response.data.remainingPostsUsed}`);
//     }

//     // Navigate after a short delay to allow the user to see the success message
//     setTimeout(() => {
//       navigate('/listing');
//     }, 2000); // Adjust the delay as needed

//   } catch (error) {
//     console.error("Error posting property:", error.response ? error.response.data : error.message);

//     // Show error message
//     if (error.response && error.response.data && error.response.data.error) {
//       const errorMessage = error.response.data.error;
//       if (errorMessage.includes("Post limit exceeded") || errorMessage.includes("Please upgrade your package")) {
//         toast.error(
//           <div>
//             <p>Post limit exceeded. You can only post 3 properties.</p>
//             <button onClick={() => navigate('/upgrade-package')}>Upgrade Package</button>
//           </div>
//         );
//       } else {
//         toast.error(errorMessage);
//       }
//     } else {
//       toast.error("Error posting property. Please try again.");
//     }
//   } finally {
//     setIsSubmitting(false);
//   }
// };


const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Show loading toast
  const loadingToast = toast.loading("Posting your property...");

  try {
    // Validate user authentication
    const userId = user?.id;
    if (!userId) {
      toast.dismiss(loadingToast);
      toast.error("Authentication required. Please log in again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/login');
      return;
    }

    // Validate required fields
    // const requiredFields = [
    //   { field: propertyName, name: "Property Name" },
    //   { field: area, name: "Area" },
    //   { field: expectedPrice, name: "Expected Price" },
    //   { field: builtUpArea, name: "Built-up Area" },
    // ];

    // const missingFields = requiredFields.filter(({ field }) => !field || field.trim() === "");
    
    // if (missingFields.length > 0) {
    //   toast.dismiss(loadingToast);
    //   toast.error(`Please fill in required fields: ${missingFields.map(f => f.name).join(", ")}`, {
    //     position: "top-center",
    //     autoClose: 6000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });
    //   return;
    // }

    // Validate numeric fields
    // const numericValidations = [
    //   { value: expectedPrice, name: "Expected Price", min: 1 },
    //   { value: builtUpArea, name: "Built-up Area", min: 1 },
    //   { value: floor, name: "Floor", min: 0 },
    //   { value: totalFloor, name: "Total Floors", min: 1 },
    // ];

    // for (const validation of numericValidations) {
    //   const numValue = parseFloat(validation.value);
    //   if (isNaN(numValue) || numValue < validation.min) {
    //     toast.dismiss(loadingToast);
    //     toast.error(`Please enter a valid ${validation.name} (minimum: ${validation.min})`, {
    //       position: "top-center",
    //       autoClose: 5000,
    //     });
    //     return;
    //   }
    // }

    // Validate floor logic
    const floorNum = parseInt(floor);
    const totalFloorNum = parseInt(totalFloor);
    if (floorNum > totalFloorNum) {
      toast.dismiss(loadingToast);
      toast.error("Floor number cannot be greater than total floors", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Validate date
    const selectedDate = new Date(availableFrom);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.dismiss(loadingToast);
      toast.error("Available from date cannot be in the past", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Prepare form data
    const formData = new FormData();
    const propertyData = {
      postedByUserId: userId,
      category: propertyType || "RESIDENTIAL",
      propertyFor: transactionType || "RENT",
      apartmentType: apartmentType || "FLAT",
      propertyName: propertyName.trim(),
      bhkType: bhkType || 0,
      floor: floorNum,
      totalFloors: totalFloorNum,
      totalBuildUpArea: parseFloat(builtUpArea),
      carpetArea: parseFloat(carpetArea) || 0,
      address: {
        area: area.trim(),
        city: "Pune",
        state: state?.trim() || "Maharashtra",
        pinCode: pincode?.trim() || "411001",
      },
      buildingType: buildingType || "",
      plotArea: parseFloat(plotArea) || 0,
      length: parseFloat(length) || 0,
      width: parseFloat(width) || 0,
      boundaryWall: boundaryWall || "",
      expectedPrice: parseFloat(expectedPrice),
      deposit: parseFloat(expectedDeposit) || 0,
      monthlyMaintenance: parseFloat(monthlyMaintenance) || 0,
      availableFrom: selectedDate.toISOString(),
      preferred_tenants: preferredTenants || "Anyone",
      furnishedType: furnishing || "UNFURNISHED",
      description: description?.trim() || "",
      amenityIds: selectedAmenities || [],
    };

    formData.append("property", JSON.stringify(propertyData));

    // Handle images
    if (selectedFiles.length === 0) {
      try {
        toast.info("No images uploaded. Adding default image...", {
          position: "top-center",
          autoClose: 3000,
        });
        
        const response = await fetch("/default.png");
        if (!response.ok) throw new Error("Default image not found");
        
        const blob = await response.blob();
        const defaultFile = new File([blob], "default.png", { type: blob.type });
        formData.append("images", defaultFile);
      } catch (error) {
        console.error("Failed to load default image:", error);
        toast.dismiss(loadingToast);
        toast.error("Default image could not be loaded. Please upload at least one image.", {
          position: "top-center",
          autoClose: 5000,
        });
        return;
      }
    } else if (selectedFiles.length > 8) {
      toast.dismiss(loadingToast);
      toast.error("Maximum 8 images allowed. Please remove some images.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    } else {
      // Validate file types and sizes
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      for (const file of selectedFiles) {
        if (!allowedTypes.includes(file.type)) {
          toast.dismiss(loadingToast);
          toast.error(`Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`, {
            position: "top-center",
            autoClose: 5000,
          });
          return;
        }
        
        if (file.size > maxFileSize) {
          toast.dismiss(loadingToast);
          toast.error(`File too large: ${file.name}. Maximum size is 5MB.`, {
            position: "top-center",
            autoClose: 5000,
          });
          return;
        }
      }
      
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    // Make API request
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/properties/add`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    // Dismiss loading toast
    toast.dismiss(loadingToast);

    // Show success message with custom styling
    toast.success(
      <div className="flex items-center space-x-2">
        <span className="text-2xl">🎉</span>
        <div>
          <div className="font-semibold text-white-800">Property Posted Successfully!</div>
          <div className="text-sm text-white-600">
            {response.data.message || "Your property is now live"}
          </div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "success-toast",
      }
    );

    // Show remaining post count if available
    if (response.data.remainingPostsUsed !== undefined) {
      setTimeout(() => {
        toast.info(
          <div className="flex items-center space-x-2">
            <span className="text-xl">📊</span>
            <div>
              <div className="font-medium">Posts Remaining</div>
              <div className="text-sm">{response.data.remainingPostsUsed} posts left</div>
            </div>
          </div>,
          {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
          }
        );
      }, 1000);
    }

    // Navigate after showing success message
    setTimeout(() => {
      navigate('/listing', { 
        state: { 
          message: "Property posted successfully!",
          propertyId: response.data.propertyId 
        }
      });
    }, 2500);

  } catch (error) {
    // Dismiss loading toast
    toast.dismiss(loadingToast);
    
    console.error("Error posting property:", error);

    // Handle different types of errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      toast.error(
        <div className="flex items-center space-x-2">
          <span className="text-xl">⏰</span>
          <div>
            <div className="font-medium">Request Timeout</div>
            <div className="text-sm">Please check your connection and try again</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 6000,
        }
      );
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 401) {
        toast.error("Session expired. Please log in again.", {
          position: "top-center",
          autoClose: 5000,
        });
        setTimeout(() => navigate('/login'), 2000);
      } else if (status === 403) {
        const errorMessage = errorData.error || "Access denied";
        
        if (errorMessage.includes("Post limit exceeded") || 
            errorMessage.includes("Please upgrade your package")) {
          toast.error(
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="font-medium">Post Limit Exceeded</div>
                  <div className="text-sm">You can only post 3 properties with your current plan</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  toast.dismiss();
                  navigate('/upgrade-package');
                }}
                className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Upgrade Package
              </button>
            </div>,
            {
              position: "top-center",
              autoClose: 8000,
              closeOnClick: false,
              hideProgressBar: false,
            }
          );
        } else {
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000,
          });
        }
      } else if (status === 413) {
        toast.error("Files too large. Please reduce image sizes and try again.", {
          position: "top-center",
          autoClose: 5000,
        });
      } else if (status === 422) {
        toast.error(errorData.error || "Invalid data provided. Please check your inputs.", {
          position: "top-center",
          autoClose: 5000,
        });
      } else if (status >= 500) {
        toast.error(
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔧</span>
            <div>
              <div className="font-medium">Unable to Post Error</div>
              <div className="text-sm">Post Limit Exceeded please upgrade your plan</div>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 6000,
          }
        );
      } else {
        toast.error(errorData.error || "An unexpected error occurred", {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } else if (error.request) {
      // Network error
      toast.error(
        <div className="flex items-center space-x-2">
          <span className="text-xl">📡</span>
          <div>
            <div className="font-medium">Network Error</div>
            <div className="text-sm">Please check your internet connection</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 6000,
        }
      );
    } else {
      // Unknown error
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  } finally {
    setIsSubmitting(false);
  }
};



    // const handleFileChange = (event) => {
    //   const files = Array.from(event.target.files);
    //   setSelectedFiles(files);
    // };

    // const renderPropertyPhotos = () => (
    //   <div className="mb-6">
    //     <h2 className="text-xl font-semibold mb-4 flex items-center">
    //       <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
    //         6
    //       </span>
    //       Property Photos
    //     </h2>
    //     <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
    //       <p className="mb-2">
    //         {propertyType === "RESIDENTIAL" &&
    //         (transactionType === "RENT" || transactionType === "SELL")
    //           ? "Upload photo"
    //           : "Upload photo"}
    //       </p>
    //       <input
    //         type="file"
    //         multiple
    //         onChange={handleFileChange}
    //         className="mb-4"
    //       />
    //       {/* <button
    //         type="button"
    //         onClick={handleSubmit}
    //         className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
    //       >
    //         Upload Media
    //       </button> */}
    //       {selectedFiles.length > 0 && (
    //         <div className="mt-4">
    //           <p>Selected Files:</p>
    //           <ul>
    //             {selectedFiles.map((file, index) => (
    //               <li key={index}>{file.name}</li>
    //             ))}
    //           </ul>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // );

    const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const totalFiles = selectedFiles.length + files.length;

    if (totalFiles > 8) {
      alert("You can upload a maximum of 8 images.");
      return;
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const renderPropertyPhotos = () => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
          6
        </span>
        Property Photos
      </h2>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
        <p className="mb-2 text-gray-700">
          Upload 1–8 images (required)
        </p>
         <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleFileChange}
    className="mb-4 w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-1 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
  />
        {selectedFiles.length === 0 ? (
          <div className="flex justify-center mt-4">
            <img
              src="/default.png"
              alt="Default"
              className="w-40 h-40 object-cover rounded-lg border"
            />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 place-items-center">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected ${index}`}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        {formSubmitted && selectedFiles.length === 0 && (
          <p className="text-red-600 text-sm mt-2">
            At least one image is required.
          </p>
        )}
        {selectedFiles.length > 8 && (
          <p className="text-red-600 text-sm mt-2">
            You can only upload up to 8 images.
          </p>
        )}
      </div>
    </div>
  );



    const renderBasicSelection = () => (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

        {/* Property Type Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          {enums.propertyCategory.map((type) => (
            <button
              key={type}
              type="button"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                propertyType === type
                  ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={() => handlePropertyTypeClick(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Transaction Type Buttons */}
        {propertyType && (
          <div className="flex flex-wrap gap-3 mb-4">
            {enums.propertyFor
              .filter((type) => {
                if (propertyType === "RESIDENTIAL") {
                  return (
                    type === "RENT" ||
                    type === "SELL" ||
                    type === "PG" ||
                    type === "HOSTEL"
                  );
                } else if (propertyType === "COMMERCIAL") {
                  return type === "RENT" || type === "SELL";
                } else if (propertyType === "PLOT") {
                  return type === "SELL" || type === "RESELL";
                }
                return false;
              })
              .map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    transactionType === type
                      ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => handleTransactionTypeClick(type)}
                >
                  {type}
                </button>
              ))}
          </div>
        )}
      </div>
    );

    const renderPropertyDetails = () => {
      if (!propertyType || !transactionType) {
        console.log("Property Type or Transaction Type not set");
        return null;
      }
      console.log(
        "Rendering Property Details for:",
        propertyType,
        transactionType
      );

      return (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
              2
            </span>
            Property Details
          </h2>

          {/* Residential Rent/Sell */}
          {propertyType === "RESIDENTIAL" &&
            (transactionType === "RENT" || transactionType === "SELL") && (
              <>
                <input
                  type="text"
                  placeholder="Property Name"
                  className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />

                <div className="flex flex-wrap gap-3 mb-3">
                  {enums.apartmentType.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        apartmentType === type
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setApartmentType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-3 mb-3">
                 
                 <select
  className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
  value={bhkType}
  onChange={(e) => setBhkType(e.target.value)}
> 
  <option value="">BHK Type</option>
  {enums.bhkType.map((type) => {
    let label = type;

    // Remove "BHK_" prefix if present
    label = label.replace(/^BHK_/, '');

    // Replace underscores with dots or spaces appropriately
    label = label.replace(/(\d)_5/g, '$1.5');     // 1_5 → 1.5, 5_5 → 5.5 (only when preceded by a digit)
    label = label.replace(/_/g, ' ');             // Any remaining _ → space

    // If it doesn't include "BHK" or "RK", add "BHK"
    if (!label.includes('RK') && !label.includes('BHK')) {
      label += ' BHK';
    }

    return (
      <option key={type} value={type}>
        {label}
      </option>
    );
  })}
</select>


<input
    type="number"
    className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    placeholder="No of Building floors"
    value={totalFloor}
    onChange={(e) => setTotalFloor(e.target.value)}
    min={1}
  />


 <input
    type="number"
    className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    placeholder="Floor"
    value={floor}
    onChange={(e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val <= totalFloor) {
        setFloor(val);
      }
    }}
    min={0}
  />
</div>
  <div className="flex space-x-3 mb-3">
    <input
      type="text"
      placeholder="Built-up Area (sq.ft)"
      className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      value={builtUpArea}
      onChange={(e) => setBuiltUpArea(e.target.value)}
    />
<input
    type="text"
    placeholder="Carpet Area (sq.ft)"
    className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={carpetArea}
    onChange={(e) => {
      const val = e.target.value;
      if (!isNaN(val) && parseFloat(val) < parseFloat(builtUpArea)) {
        setCarpetArea(val);
      }
    }}
  />

</div>
</>
 )}

          {/* PG/Hostel */}
          {propertyType === "RESIDENTIAL" &&
            (transactionType === "PG" || transactionType === "HOSTEL") && (
              <>
                <input
                  type="text"
                  placeholder="Property Name"
                  className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />

                <select
                  className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="">Room Type in PG</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Three">Three</option>
                  <option value="Four">Four</option>
                </select>

                <div className="flex space-x-3 mb-3">
                  <input
                    type="text"
                    placeholder="Built-up Area (sq.ft)"
                    className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Carpet Area (sq.ft)"
                    className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(e.target.value)}
                  />
                </div>
              </>
            )}

          {/* Commercial */}
          {propertyType === "COMMERCIAL" && (
            <>

            <input
                  type="text"
                  placeholder="Property Name"
                  className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  "Office Space",
                  "Shop",
                  "Showroom",
                  "Godown",
                  "Industrial Building",
                  "Other",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      subPropertyType === type
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSubPropertyType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  "Independent House",
                  "Business Park",
                  "Mall",
                  "Standalone Building",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      buildingType === type
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setBuildingType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              

              {/* <div className="flex space-x-3 mb-3">
                <select
                  className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                >
                  <option value="">Floor</option>
                  <option value="Lower Basement">Lower Basement</option>
                  <option value="Ground">Ground</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

                <select
                  className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={floorType}
                  onChange={(e) => setFloorType(e.target.value)}
                >
                  <option value="">Floor Type</option>
                  <option value="Full Building">Full Building</option>
                  <option value="Partial">Partial</option>
                </select>
              </div> */}
              <div className="flex space-x-3 mb-3">

              {/* <select
                className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={propertyAge}
                onChange={(e) => setPropertyAge(e.target.value)}
              >
                <option value="">Age of Property</option>
                <option value="<1">Less than 1 year</option>
                <option value="3-5">3 to 5 years</option>
                <option value="5-10">5 to 10 years</option>
                <option value=">10">More than 10 years</option>
              </select> */}

              <input
  type="number"
  className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
  placeholder="Age of Property (in years)"
  value={propertyAge}
  onChange={(e) => setPropertyAge(e.target.value)}
  min={1}
/>

              <input
    type="number"
    className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    placeholder="No of Building floors"
    value={totalFloor}
    onChange={(e) => setTotalFloor(e.target.value)}
    min={1}
  />


 <input
    type="number"
    className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    placeholder="Floor"
    value={floor}
    onChange={(e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val <= totalFloor) {
        setFloor(val);
      }
    }}
    min={0}
  />
</div>
               <div className="flex space-x-3 mb-3">
              
    <input
      type="text"
      placeholder="Built-up Area (sq.ft)"
      className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      value={builtUpArea}
      onChange={(e) => setBuiltUpArea(e.target.value)}
    />
<input
    type="text"
    placeholder="Carpet Area (sq.ft)"
    className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={carpetArea}
    onChange={(e) => {
      const val = e.target.value;
      if (!isNaN(val) && parseFloat(val) < parseFloat(builtUpArea)) {
        setCarpetArea(val);
      }
    }}
  />
  
</div>
            </>
          )}

          {/* Land/Plot */}
          {propertyType === "PLOT" && (
            <>
              <input
                type="text"
                placeholder="Plot Area (sq.ft)"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={plotArea}
                onChange={(e) => setPlotArea(e.target.value)}
              />

              <div className="flex space-x-3 mb-3">
                <input
                  type="text"
                  placeholder="Length (ft)"
                  className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Width (ft)"
                  className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>

              <div className="flex gap-3 mb-3">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      boundaryWall === option
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setBoundaryWall(option)}
                  >
                    Boundary Wall: {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      );
    };

    const renderLocationDetails = () => {
      if (!propertyType || !transactionType) {
        console.log("Property Type or Transaction Type not set");
        return null;
      }
      console.log(
        "Rendering Location Details for:",
        propertyType,
        transactionType
      );

      return (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
              3
            </span>
            Location Details
          </h2>

          <input
            type="text"
            placeholder="Area"
            className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <div className="flex space-x-3 mb-3">
            <input
              type="text"
              placeholder="State"
              className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />

  <input
    type="text"
    placeholder="Pin Code"
    className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={pincode}
    onChange={(e) => {
      const val = e.target.value;
      if (val === '' || pinCodeRegex.test(val)) {
        setPincode(val);
      }
    }}
  />

          </div>
        </div>
      );
    };

    const renderPricingDetails = () => {
      if (!propertyType || !transactionType) {
        console.log(
          "Pricing Details not rendered. Property Type:",
          propertyType,
          "Transaction Type:",
          transactionType
        );
        return null;
      }
      console.log(
        "Rendering Pricing Details for:",
        propertyType,
        transactionType
      );

      return (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
              4
            </span>
            {propertyType === "RESIDENTIAL" &&
              transactionType === "RENT" &&
              "Rental Details"}
            {propertyType === "RESIDENTIAL" &&
              transactionType === "SELL" &&
              "Resale Details"}
            {propertyType === "RESIDENTIAL" &&
              (transactionType === "PG" || transactionType === "HOSTEL") &&
              "PG Details"}
            {propertyType === "COMMERCIAL" && "Rental Details"}
            {propertyType === "PLOT" && "Resale Details"}
          </h2>

          {/* Residential Rent */}
          {propertyType === "RESIDENTIAL" && transactionType === "RENT" && (
            <>
              <p className="text-gray-600 mb-3">
                Property Available for rent/lease
              </p>

              <div className="flex space-x-3 mb-3">
                <div className="w-1/2">
    <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    placeholder="Rent (INR)"
    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={expectedPrice}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
      setExpectedPrice(value);
    }}
  />

    <p className="text-sm text-gray-500 mt-1">{formatIndianNumber(expectedPrice)}</p>
  </div>

  <div className="w-1/2">
    <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    placeholder="Deposit (INR)"
    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={expectedDeposit}
    onChange={(e) =>
      setExpectedDeposit(e.target.value.replace(/\D/g, '')) // Only digits
    }
  />
    <p className="text-sm text-gray-500 mt-1">{formatIndianNumber(expectedDeposit)}</p>
  </div>
  </div>

              <div className="w-full">
    <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    placeholder="Monthly Maintenance (INR)"
    className="w-full p-3 border border-gray-300 rounded-xl mb-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={monthlyMaintenance}
    onChange={(e) =>
      setMonthlyMaintenance(e.target.value.replace(/\D/g, '')) // Only digits
    }
  />
    <p className="text-sm text-gray-500">{formatIndianNumber(monthlyMaintenance)}</p>
  </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
    Available From
  </label>
  <input
    type="date"
    placeholder="Available From"
    className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={availableFrom}
    onChange={(e) => setAvailableFrom(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // this disables past dates
  />


              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm text-gray-600 w-full mb-2">
                  Preferred Tenants:
                </span>
                {[
                  "Anyone",
                  "Family",
                  "Bachelor Female",
                  "Bachelor Male",
                  "Company",
                ].map((tenant) => (
                  <button
                    key={tenant}
                    type="button"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      preferredTenants === tenant
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setPreferredTenants(tenant)}
                  >
                    {tenant}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm text-gray-600 w-full mb-2">
                  Furnishing:
                </span>
                {enums.furnishedType.map((furnish) => (
                  <button
                    key={furnish}
                    type="button"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      furnishing === furnish
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFurnishing(furnish)}
                  >
                    {furnish}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Description"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          )}

          {/* Residential Sell */}
          {propertyType === "RESIDENTIAL" && transactionType === "SELL" && (
            <>
              <input
                type="text"
                placeholder="Expected Price (INR)"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">
    Available From
  </label>
  <input
    type="date"
    placeholder="Available From"
    className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={availableFrom}
    onChange={(e) => setAvailableFrom(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // this disables past dates
  />


              <textarea
                placeholder="Description"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          )}

          {/* PG/Hostel */}
          {propertyType === "RESIDENTIAL" &&
            (transactionType === "PG" || transactionType === "HOSTEL") && (
              <>
                <div className="flex space-x-3 mb-3">
                  <input
                    type="text"
                    placeholder="Expected Rent (INR)"
                    className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Expected Deposit (INR)"
                    className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={expectedDeposit}
                    onChange={(e) => setExpectedDeposit(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm text-gray-600 w-full mb-2">
                    PG Details:
                  </span>
                  {["Male", "Female", "Others"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        pgGender === gender
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setPgGender(gender)}
                    >
                      {gender}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm text-gray-600 w-full mb-2">
                    Preferred Guests:
                  </span>
                  {["Working", "Student", "Both"].map((guest) => (
                    <button
                      key={guest}
                      type="button"
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        preferredGuests === guest
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setPreferredGuests(guest)}
                    >
                      {guest}
                    </button>
                  ))}
                </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
    Available From
  </label>
  <input
    type="date"
    placeholder="Available From"
    className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={availableFrom}
    onChange={(e) => setAvailableFrom(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // this disables past dates
  />



                {/* <input
                  type="text"
                  placeholder="Gate Closing Time"
                  className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={gateClosingTime}
                  onChange={(e) => setGateClosingTime(e.target.value)}
                /> */}
              </>
            )}

          {/* Commercial */}
          {propertyType === "COMMERCIAL" && (
            <>
              <div className="flex space-x-3 mb-3">
                <input
                  type="text"
                  placeholder="Expected Rent (INR)"
                  className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Expected Deposit (INR)"
                  className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={expectedDeposit}
                  onChange={(e) => setExpectedDeposit(e.target.value)}
                />
              </div>

              {/* <input
                type="date"
                placeholder="Available From"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
              /> */}

              <label className="block text-sm font-medium text-gray-700 mb-1">
    Available From
  </label>
  <input
    type="date"
    placeholder="Available From"
    className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
    value={availableFrom}
    onChange={(e) => setAvailableFrom(e.target.value)}
    min={new Date().toISOString().split("T")[0]} // this disables past dates
  />
            </>
          )}

          {/* Land/Plot */}
          {propertyType === "PLOT" && (
            <>
              <input
                type="text"
                placeholder="Expected Price (INR)"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
              />

              <input
                type="date"
                placeholder="Available From"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
              />

              <textarea
                placeholder="Description"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          )}
        </div>
      );
    };

    const renderAmenities = () => {
      if (!propertyType || !transactionType) return null;

      return (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
              5
            </span>
            Amenities
          </h2>
          <div className="flex flex-wrap gap-3">
            {amenities.map((amenity) => (
              <button
                key={amenity.amenityId}
                type="button"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedAmenities.includes(amenity.amenityId)
                    ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
                onClick={() => handleAmenityChange(amenity.amenityId)}
              >
                {amenity.name}
              </button>
            ))}
          </div>
        </div>
      );
    };


  //   const renderPhoneNumber = () => {
  //   return (
  //     <div className="mb-6">
  //       <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
  //         Enter Mobile Number To Receive Calls <span className="text-red-500">*</span>
  //       </label>
  //       <input
  //         id="phone"
  //         type="tel"
  //         value={postedByUserPhoneNumber}
  //         onChange={(e) => setpostedByUserPhoneNumber(e.target.value)}
  //         placeholder="e.g. 9876543210"
  //         className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
  //         maxLength={10}
  //         required
  //       />
  //     </div>
  //   );
  // };




    return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 lg:py-12">
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Header */}
        <div className="text-center mb-2 sm:mb-2 lg:mb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Post Your Property Here!
          </h1>
        </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <form onSubmit={handleSubmit}>
          {renderBasicSelection()}
          {renderPropertyDetails()}
          {renderLocationDetails()}
          {renderPricingDetails()}
          {renderAmenities()}
          {renderPropertyPhotos()}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Posting Property...</span>
              </div>
            ) : (
              <>🏠 Post My Property</>
            )}
          </button>
        </form>
      </div>
    </div>
    
    {/* Enhanced ToastContainer with custom styling */}
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
    />
    
    {/* Custom CSS for toast styling */}
    <style jsx global>{`
  /* Toast container customization */
  .Toastify__toast {
    border-radius: 12px !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    font-family: 'Inter', sans-serif !important;
    padding: 16px !important;
    color: white !important;
  }

  /* Success Toast */
  .Toastify__toast--success {
    background: linear-gradient(100deg, #10b981 0%, #dc2626 100%) !important;
  }

  /* Error Toast */
  .Toastify__toast--error {
    background: linear-gradient(135deg, #10b981 0%, #dc2626 100%) !important;
  }

  /* Info Toast */
  .Toastify__toast--info {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  }
`}</style>

  </div>
);
};

  export default PostProperty;
