import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Movement {
  id: string;
  driver_id: string;
  vehicle_id: string;
  current_location: {
    lat: number;
    lng: number;
  };
  speed: number;
  status: string;
  timestamp: string;
}

const Movements = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMovements();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('movements')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'movements',
        },
        () => {
          fetchMovements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMovements = async () => {
    const { data, error } = await supabase
      .from('movements')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch movements",
        variant: "destructive",
      });
    } else {
      setMovements(data || []);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Movements</h1>
          <p className="text-muted-foreground">Real-time tracking of vehicle locations</p>
        </div>

        <Card className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Driver ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No movement data available
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">
                        {movement.vehicle_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{movement.driver_id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        {movement.current_location 
                          ? `${movement.current_location.lat.toFixed(6)}, ${movement.current_location.lng.toFixed(6)}`
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>{movement.speed ? `${movement.speed} km/h` : 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          movement.status === 'moving' ? 'bg-success/20 text-success' : 'bg-muted'
                        }`}>
                          {movement.status || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(movement.timestamp).toLocaleString()}
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

export default Movements;
