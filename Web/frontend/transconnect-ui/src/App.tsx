import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Book from "./pages/Book";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/dashboard/Users";
import Vehicles from "./pages/dashboard/Vehicles";
import RoutesPage from "./pages/dashboard/Routes";
import Bookings from "./pages/dashboard/Bookings";
import Staff from "./pages/dashboard/Staff";
import Drivers from "./pages/dashboard/Drivers";
import Agencies from "./pages/dashboard/Agencies";
import Trips from "./pages/dashboard/Trips";
import Movements from "./pages/dashboard/Movements";
import Notifications from "./pages/dashboard/Notifications";
import Rides from "./pages/dashboard/Rides";
import Ratings from "./pages/dashboard/Ratings";
import Analytics from "./pages/dashboard/Analytics";
import Feedback from "./pages/dashboard/Feedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<Book />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/vehicles" element={<Vehicles />} />
            <Route path="/dashboard/routes" element={<RoutesPage />} />
            <Route path="/dashboard/bookings" element={<Bookings />} />
            <Route path="/dashboard/staff" element={<Staff />} />
            <Route path="/dashboard/drivers" element={<Drivers />} />
            <Route path="/dashboard/agencies" element={<Agencies />} />
            <Route path="/dashboard/trips" element={<Trips />} />
            <Route path="/dashboard/movements" element={<Movements />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
            <Route path="/dashboard/rides" element={<Rides />} />
            <Route path="/dashboard/ratings" element={<Ratings />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/feedback" element={<Feedback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
