import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Enroll from "./pages/Enroll";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Dashboard
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardAnnouncements from "./pages/dashboard/DashboardAnnouncements";
import DashboardCourse from "./pages/dashboard/DashboardCourse";
import DashboardCommunity from "./pages/dashboard/DashboardCommunity";
import DashboardTools from "./pages/dashboard/DashboardTools";
import DashboardQA from "./pages/dashboard/DashboardQA";
import DashboardAssignments from "./pages/dashboard/DashboardAssignments";
import DashboardGifts from "./pages/dashboard/DashboardGifts";
import DashboardReviews from "./pages/dashboard/DashboardReviews";
import DashboardSubscription from "./pages/dashboard/DashboardSubscription";
import DashboardProfile from "./pages/dashboard/DashboardProfile";

// Admin
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminQA from "./pages/admin/AdminQA";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminReports from "./pages/admin/AdminReports";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminEmail from "./pages/admin/AdminEmail";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminTools from "./pages/admin/AdminTools";
import AdminWebsite from "./pages/admin/AdminWebsite";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/enroll" element={<Enroll />} />
            <Route path="/auth" element={<Auth />} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
            <Route path="/dashboard/announcements" element={<DashboardLayout><DashboardAnnouncements /></DashboardLayout>} />
            <Route path="/dashboard/course" element={<DashboardLayout><DashboardCourse /></DashboardLayout>} />
            <Route path="/dashboard/community" element={<DashboardLayout><DashboardCommunity /></DashboardLayout>} />
            <Route path="/dashboard/tools" element={<DashboardLayout><DashboardTools /></DashboardLayout>} />
            <Route path="/dashboard/qa" element={<DashboardLayout><DashboardQA /></DashboardLayout>} />
            <Route path="/dashboard/assignments" element={<DashboardLayout><DashboardAssignments /></DashboardLayout>} />
            <Route path="/dashboard/gifts" element={<DashboardLayout><DashboardGifts /></DashboardLayout>} />
            <Route path="/dashboard/reviews" element={<DashboardLayout><DashboardReviews /></DashboardLayout>} />
            <Route path="/dashboard/subscription" element={<DashboardLayout><DashboardSubscription /></DashboardLayout>} />
            <Route path="/dashboard/profile" element={<DashboardLayout><DashboardProfile /></DashboardLayout>} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
            <Route path="/admin/content" element={<AdminLayout><AdminContent /></AdminLayout>} />
            <Route path="/admin/assignments" element={<AdminLayout><AdminAssignments /></AdminLayout>} />
            <Route path="/admin/qa" element={<AdminLayout><AdminQA /></AdminLayout>} />
            <Route path="/admin/reviews" element={<AdminLayout><AdminReviews /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
            <Route path="/admin/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
            <Route path="/admin/email" element={<AdminLayout><AdminEmail /></AdminLayout>} />
            <Route path="/admin/announcements" element={<AdminLayout><AdminAnnouncements /></AdminLayout>} />
            <Route path="/admin/events" element={<AdminLayout><AdminEvents /></AdminLayout>} />
            <Route path="/admin/tools" element={<AdminLayout><AdminTools /></AdminLayout>} />
            <Route path="/admin/website" element={<AdminLayout><AdminWebsite /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
