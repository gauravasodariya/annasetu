import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import { LazyMotion, domAnimation } from "framer-motion";
import AuthContext, { AuthProvider } from "./context/authContext";
import setAuthToken from "./utils/setAuthToken";

import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/Profile";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import DonationForm from "./components/DonationForm";
import DonationDetails from "./components/DonationDetails";
import FoodCart from "./components/food/FoodCart";
import DeliveryHistory from "./components/dashboard/DeliveryHistory";
import MyAssignments from "./components/dashboard/MyAssignments";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

import AdminDashboard from "./components/dashboard/AdminDashboard";
import AdminDonations from "./components/admin/Donations";
import AdminDonationDetails from "./components/admin/DonationDetails";
import AdminAgents from "./components/admin/Agents";
import AdminNGOs from "./components/admin/NGOs.jsx";
import AdminLayout from "./components/admin/AdminLayout";
import InquiryList from "./components/admin/InquiryList";

import DonorDashboard from "./components/dashboard/DonorDashboard.jsx";
import VolunteerDashboard from "./components/dashboard/VolunteerDashboard.jsx";
import NGODashboard from "./components/dashboard/NGODashboard.jsx";
import NGOLayout from "./components/dashboard/NGOLayout.jsx";
import NGODonations from "./components/ngo/NGODonations";
import NGORequestDetails from "./components/ngo/NGORequestDetails";
import NGORequests from "./components/ngo/NGORequests";
import RequestFood from "./components/food/RequestFood";

import VolunteerLayout from "./components/dashboard/VolunteerLayout";
import AssignmentDetails from "./components/dashboard/AssignmentDetails";

axios.defaults.baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const AdminRoute = () => {
  const authContext = React.useContext(AuthContext);
  const { user, loading, isAuthenticated } = authContext || {};

  if (loading) {
    return null; // Don't show spinner while loading
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

const PrivateRoute = ({ children }) => {
  const authContext = React.useContext(AuthContext);
  const { isAuthenticated, loading } = authContext || {};

  if (loading) {
    return null; // Don't show spinner while loading
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LazyMotion features={domAnimation}>
          <AppContent />
        </LazyMotion>
      </Router>
    </AuthProvider>
  );
}

const AppContent = () => {
  const authContext = React.useContext(AuthContext);
  const { isAuthenticated, loading, user } = authContext || {};
  const location = useLocation();

  useEffect(() => {
    authContext.loadUser();
  }, []);

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password");

  if (loading) {
    return null; // Don't show anything while loading auth state
  }
  return (
    <div className="d-flex flex-column min-vh-100">
      {!isAuthRoute && <Header />}

      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/donate" element={<DonationForm />} />
          <Route
            path="/request-food"
            element={
              <PrivateRoute>
                <RequestFood />
              </PrivateRoute>
            }
          />
          <Route
            path="/food-cart"
            element={
              <PrivateRoute>
                <FoodCart />
              </PrivateRoute>
            }
          />
          <Route
            path="/donor"
            element={
              <PrivateRoute>
                <DonorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/donor/donations/:id"
            element={
              <PrivateRoute>
                <DonationDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/donor/donations/:id/edit"
            element={
              <PrivateRoute>
                <DonationForm editMode={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/volunteer"
            element={
              <PrivateRoute>
                <VolunteerLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<VolunteerDashboard />} />
            <Route path="assignments" element={<MyAssignments />} />
            <Route path="assignments/:id" element={<AssignmentDetails />} />
            <Route path="history" element={<DeliveryHistory />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="donations" element={<AdminDonations />} />
              <Route path="donations/:id" element={<AdminDonationDetails />} />
              <Route path="agents" element={<AdminAgents />} />
              <Route path="ngos" element={<AdminNGOs />} />
              <Route path="inquiries" element={<InquiryList />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          <Route
            path="/ngo"
            element={
              <PrivateRoute>
                <NGOLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<NGODashboard />} />
            <Route path="dashboard" element={<NGODashboard />} />
            <Route path="requests" element={<NGORequests />} />
            <Route path="requests/:id" element={<NGORequestDetails />} />
            <Route path="requests/pending" element={<NGORequests />} />
            <Route path="requests/accepted" element={<NGORequests />} />
            <Route path="requests/rejected" element={<NGORequests />} />
            <Route path="donations" element={<NGODonations />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
      {!window.location.pathname.startsWith("/admin") &&
        !window.location.pathname.startsWith("/ngo") &&
        !window.location.pathname.startsWith("/volunteer") && <Footer />}
    </div>
  );
};

export default App;
