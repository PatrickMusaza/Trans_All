import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Trip {
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
  vehicles: {
    plate_number: string;
    vehicle_type: string;
  };
}

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        routes (
          name,
          start_location,
          end_location
        ),
        vehicles (
          plate_number,
          vehicle_type
        )
      `)
      .order('departure_time', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch trips",
        variant: "destructive",
      });
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this trip?')) return;

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Trip cancelled successfully",
      });
      fetchTrips();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Trips</h1>
          <p className="text-muted-foreground">View and manage scheduled trips</p>
        </div>

        <Card className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Available Seats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : trips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No trips found
                    </TableCell>
                  </TableRow>
                ) : (
                  trips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">
                        {trip.routes?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {trip.vehicles?.plate_number || 'N/A'} ({trip.vehicles?.vehicle_type})
                      </TableCell>
                      <TableCell>
                        {trip.departure_time 
                          ? new Date(trip.departure_time).toLocaleString()
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {trip.arrival_time 
                          ? new Date(trip.arrival_time).toLocaleString()
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>{trip.available_seats}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          trip.status === 'scheduled' ? 'bg-primary/20 text-primary' : 
                          trip.status === 'in_progress' ? 'bg-warning/20 text-warning' : 
                          'bg-success/20 text-success'
                        }`}>
                          {trip.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(trip.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

export default Trips;
