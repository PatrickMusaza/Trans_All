import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Ride {
  id: string;
  departure_time: string;
  arrival_time: string;
  available_seats: number;
  status: string;
  routes: {
    name: string;
    start_location: string;
    end_location: string;
  };
}

const Rides = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    if (!user) return;

    // Fetch trips assigned to this driver
    const { data: driverData } = await supabase
      .from('drivers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!driverData) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        routes (
          name,
          start_location,
          end_location
        )
      `)
      .eq('driver_id', driverData.id)
      .order('departure_time', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rides",
        variant: "destructive",
      });
    } else {
      setRides(data || []);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Rides</h1>
          <p className="text-muted-foreground">View your assigned trips</p>
        </div>

        <Card className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Available Seats</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : rides.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No rides assigned yet
                    </TableCell>
                  </TableRow>
                ) : (
                  rides.map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell className="font-medium">
                        {ride.routes?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {ride.departure_time 
                          ? new Date(ride.departure_time).toLocaleString()
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {ride.arrival_time 
                          ? new Date(ride.arrival_time).toLocaleString()
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>{ride.available_seats}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ride.status === 'scheduled' ? 'bg-primary/20 text-primary' : 
                          ride.status === 'in_progress' ? 'bg-warning/20 text-warning' : 
                          'bg-success/20 text-success'
                        }`}>
                          {ride.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Rides;
