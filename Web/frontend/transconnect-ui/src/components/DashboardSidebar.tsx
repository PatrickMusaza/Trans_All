import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Car,
  Bus,
  Route,
  MapPin,
  Bell,
  Star,
  BarChart3,
  BookOpen,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ['admin', 'driver', 'user', 'agency_admin'] },
  
  // Admin & Management
  { title: "Users", url: "/dashboard/users", icon: Users, roles: ['admin'] },
  { title: "Staff", url: "/dashboard/staff", icon: Briefcase, roles: ['admin'] },
  { title: "Agencies", url: "/dashboard/agencies", icon: Briefcase, roles: ['admin'] },
  
  // Fleet Management
  { title: "Drivers", url: "/dashboard/drivers", icon: Car, roles: ['admin', 'agency_admin'] },
  { title: "Vehicles", url: "/dashboard/vehicles", icon: Bus, roles: ['admin', 'agency_admin'] },
  
  // Operations
  { title: "Routes", url: "/dashboard/routes", icon: Route, roles: ['admin', 'agency_admin'] },
  { title: "Trips", url: "/dashboard/trips", icon: Calendar, roles: ['admin', 'agency_admin'] },
  { title: "Movements", url: "/dashboard/movements", icon: MapPin, roles: ['admin'] },
  
  // Driver Operations
  { title: "Rides", url: "/dashboard/rides", icon: Car, roles: ['driver', 'agency_admin'] },
  { title: "Ratings", url: "/dashboard/ratings", icon: Star, roles: ['driver', 'agency_admin'] },
  
  // User Services
  { title: "Bookings", url: "/dashboard/bookings", icon: BookOpen, roles: ['user', 'admin', 'agency_admin'] },
  
  // Analytics & Communication
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, roles: ['admin', 'agency_admin'] },
  { title: "Feedback", url: "/dashboard/feedback", icon: MessageSquare, roles: ['admin', 'agency_admin'] },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell, roles: ['admin', 'agency_admin'] },
];

export function DashboardSidebar() {
  const { userRoles } = useAuth();

  const filteredItems = navItems.filter((item) =>
    item.roles.some((role) => userRoles.includes(role as any))
  );

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
      isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
    );

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">TransConnect</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <NavLink key={item.url} to={item.url} end className={getNavClass}>
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
