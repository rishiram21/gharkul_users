// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, AuthContext } from './context/Authcontext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Listing from './pages/Listings';
// import Signin from './pages/Signin';
// import Signup from './pages/Signup';
// import Postproperty from './pages/Postproperty';
// import HomePage from './pages/HomePage';
// import Aboutus from './pages/Aboutus';
// import Contactus from './pages/Contactus';
// import Postrequirement from './pages/Postrequirement';
// import Propertydetails from './subpages/Propertydetails';
// import Subscription from './pages/Subscription';
// import UserProfile from './pages/UserProfile';
// import CheckoutPage from './pages/CheckoutPage';
// import PrivacyPolicy from './pages/PrivacyPolicy';
// import RazorpayPage from './components/RazorpayPage';
// import FeaturedRequirement from './pages/FeaturedRequirement';
// import Editproperty from './subpages/Editproperty';
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = React.useContext(AuthContext);
//   return isAuthenticated ? children : <Navigate to="/signin" />;
// };

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <div className="App">
//           <Navbar />
//           <main className="min-h-screen">
//             <Routes>
//               {/* Main Pages */}
//               <Route path="/" element={<HomePage />} />
//               <Route path="/home" element={<HomePage />} />
//               <Route path="/listing" element={<Listing />} />
//               <Route path="/featured" element={<FeaturedRequirement />} />
//               <Route path="/subscription" element={<Subscription />} />
//               <Route path="/checkout" element={<CheckoutPage />} />
//               <Route path="/razorpay" element={<RazorpayPage />} /> {/* Add the Razorpay route */}
//               <Route path="/about" element={<Aboutus />} />
//               <Route path="/contact" element={<Contactus />} />
//               <Route path="/privacy" element={<PrivacyPolicy />} />
//               <Route path="/signin" element={<Signin />} />
//               <Route path="/signup" element={<Signup />} />

//               {/* Protected Routes */}
//               <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
//               <Route
//                 path="/postproperty"
//                 element={
//                   <ProtectedRoute>
//                     <Postproperty />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/postrequirement"
//                 element={
//                   <ProtectedRoute>
//                     <Postrequirement />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Sub-Pages */}
//               <Route path="/listing/:id" element={<Propertydetails />} />

//               <Route path="/editproperty/:propertyId" element={<Editproperty />} />


              
              
//             </Routes>

//           </main>
//               <ToastContainer position="top-right" autoClose={3000} />

//           <Footer />
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/Authcontext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Listing from './pages/Listings';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Postproperty from './pages/Postproperty';
import HomePage from './pages/HomePage';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';
import Postrequirement from './pages/Postrequirement';
import Propertydetails from './subpages/Propertydetails';
import Subscription from './pages/Subscription';
import UserProfile from './pages/UserProfile';
import CheckoutPage from './pages/CheckoutPage';
// import PrivacyPolicy from './pages/PrivacyPolicy';
import RazorpayPage from './components/RazorpayPage';
import FeaturedRequirement from './pages/FeaturedRequirement';
import Editproperty from './subpages/Editproperty';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

// Wrapper to use hooks outside Router
const AppContent = () => {
  const location = useLocation();
  const hideFooterRoutes = ['/listing'];

  return (
    <div className="App">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/featured" element={<FeaturedRequirement />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/razorpay" element={<RazorpayPage />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/contact" element={<Contactus />} />
          {/* <Route path="/privacy" element={<PrivacyPolicy />} /> */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/postproperty" element={<ProtectedRoute><Postproperty /></ProtectedRoute>} />
          <Route path="/postrequirement" element={<ProtectedRoute><Postrequirement /></ProtectedRoute>} />

          {/* Sub-Pages */}
          <Route path="/listing/:id" element={<Propertydetails />} />
          <Route path="/editproperty/:propertyId" element={<Editproperty />} />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
