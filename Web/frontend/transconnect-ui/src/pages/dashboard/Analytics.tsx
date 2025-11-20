import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const Analytics = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    upcomingTrips: 0,
  });
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [revenueByMonth, setRevenueByMonth] = useState<any[]>([]);
  const [tripStatusData, setTripStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      // Fetch bookings with created_at
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_amount, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (bookingsError) throw bookingsError;

      // Fetch all trips for trip status
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('id, status, departure_time');

      if (tripsError) throw tripsError;

      // Calculate stats
      const totalBookings = bookingsData?.length || 0;
      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
      const upcomingTrips = tripsData?.filter(t => 
        new Date(t.departure_time) > new Date() && t.status === 'scheduled'
      ).length || 0;

      setStats({
        totalBookings,
        totalRevenue,
        averageBookingValue,
        upcomingTrips,
      });

      // Process booking trends (last 6 months)
      const monthlyData: Record<string, { month: string; bookings: number; revenue: number }> = {};
      bookingsData?.forEach(booking => {
        const date = new Date(booking.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, bookings: 0, revenue: 0 };
        }
        monthlyData[monthKey].bookings++;
        monthlyData[monthKey].revenue += booking.total_amount || 0;
      });
      
      const trends = Object.values(monthlyData).slice(-6).map(item => ({
        month: new Date(item.month).toLocaleDateString('en', { month: 'short', year: 'numeric' }),
        bookings: item.bookings,
        revenue: item.revenue
      }));
      setBookingTrends(trends);
      setRevenueByMonth(trends);

      // Status distribution
      const statusCount: Record<string, number> = {};
      bookingsData?.forEach(booking => {
        statusCount[booking.status] = (statusCount[booking.status] || 0) + 1;
      });
      const statusDist = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
      setStatusDistribution(statusDist);

      // Trip status distribution
      const tripStatusCount: Record<string, number> = {};
      tripsData?.forEach(trip => {
        tripStatusCount[trip.status] = (tripStatusCount[trip.status] || 0) + 1;
      });
      const tripStatusDist = Object.entries(tripStatusCount).map(([name, value]) => ({ name, value }));
      setTripStatusData(tripStatusDist);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">View your booking statistics and insights</p>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <p>Loading analytics...</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">RWF {stats.totalRevenue.toFixed(0)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Booking</p>
                  <p className="text-2xl font-bold">RWF {stats.averageBookingValue.toFixed(0)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Trips</p>
                  <p className="text-2xl font-bold">{stats.upcomingTrips}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Number of bookings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Month</CardTitle>
              <CardDescription>Monthly revenue in RWF</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>Breakdown of booking statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trip Status Distribution</CardTitle>
              <CardDescription>Current status of all trips</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tripStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {tripStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
