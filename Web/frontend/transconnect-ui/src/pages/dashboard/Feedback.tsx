import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  trips?: {
    routes?: {
      name: string;
    };
  };
  drivers?: {
    profiles?: {
      full_name: string;
    };
  };
  profiles?: {
    full_name: string;
  };
}

const Feedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        trips (
          routes (
            name
          )
        ),
        profiles!feedback_user_id_fkey (
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch feedback",
        variant: "destructive",
      });
    } else {
      setFeedback(data || []);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Feedback</h1>
          <p className="text-muted-foreground">View all customer reviews and ratings</p>
        </div>

        <Card className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : feedback.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No feedback available
                    </TableCell>
                  </TableRow>
                ) : (
                  feedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.profiles?.full_name || 'Anonymous'}
                      </TableCell>
                      <TableCell>
                        {item.trips?.routes?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= item.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {item.rating}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        {item.comment || 'No comment'}
                      </TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString()}
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

export default Feedback;
