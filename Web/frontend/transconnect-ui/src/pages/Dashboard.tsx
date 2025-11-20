import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Users, Bus, TrendingUp, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const { userRoles } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeVehicles: 0,
    tripsToday: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats based on user role
        if (userRoles.includes('admin')) {
          const [usersRes, vehiclesRes, tripsRes, bookingsRes] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'active'),
            supabase.from('trips').select('id', { count: 'exact', head: true }),
            supabase.from('bookings').select('id', { count: 'exact', head: true }),
          ]);

          setStats({
            totalUsers: usersRes.count || 0,
            activeVehicles: vehiclesRes.count || 0,
            tripsToday: tripsRes.count || 0,
            totalBookings: bookingsRes.count || 0,
          });
        } else if (userRoles.includes('user')) {
          const bookingsRes = await supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

          setStats({
            totalUsers: 0,
            activeVehicles: 0,
            tripsToday: 0,
            totalBookings: bookingsRes.count || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [userRoles]);

  const getStatsForRole = () => {
    if (userRoles.includes('admin')) {
      return [
        { icon: Users, label: "Total Users", value: stats.totalUsers.toString(), change: "+12%" },
        { icon: Bus, label: "Active Vehicles", value: stats.activeVehicles.toString(), change: "+8%" },
        { icon: TrendingUp, label: "Total Trips", value: stats.tripsToday.toString(), change: "+23%" },
        { icon: Calendar, label: "Total Bookings", value: stats.totalBookings.toString(), change: "+15%" },
      ];
    } else if (userRoles.includes('driver')) {
      return [
        { icon: TrendingUp, label: "Trips Completed", value: "42", change: "+5%" },
        { icon: Users, label: "Rating", value: "4.8", change: "+0.2" },
        { icon: Calendar, label: "Today's Rides", value: "8", change: "+3" },
        { icon: BarChart, label: "Earnings", value: "RWF 45K", change: "+15%" },
      ];
    } else if (userRoles.includes('user')) {
      return [
        { icon: Calendar, label: "My Bookings", value: stats.totalBookings.toString(), change: "0" },
        { icon: TrendingUp, label: "Trips Taken", value: "15", change: "+3" },
        { icon: Bus, label: "Favorite Routes", value: "3", change: "0" },
        { icon: BarChart, label: "Total Spent", value: "RWF 25K", change: "+12%" },
      ];
    } else if (userRoles.includes('agency_admin')) {
      return [
        { icon: Bus, label: "Total Vehicles", value: stats.activeVehicles.toString(), change: "+2" },
        { icon: Users, label: "Total Drivers", value: "12", change: "+1" },
        { icon: TrendingUp, label: "Trips This Month", value: stats.tripsToday.toString(), change: "+18%" },
        { icon: BarChart, label: "Revenue", value: "RWF 125K", change: "+22%" },
      ];
    }
    return [];
  };

  const roleStats = getStatsForRole();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roleStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-primary p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-success">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <p className="text-muted-foreground">
            Use the sidebar to navigate to different sections and manage your {userRoles.join(', ')} account.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
