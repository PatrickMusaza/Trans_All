import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
}

const Ratings = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    if (!user) return;

    // Get driver ID
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
      .from('feedback')
      .select(`
        *,
        trips (
          routes (
            name
          )
        )
      `)
      .eq('driver_id', driverData.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ratings",
        variant: "destructive",
      });
    } else {
      setFeedback(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((acc, curr) => acc + (curr.rating || 0), 0) / data.length;
        setAverageRating(avg);
      }
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Ratings</h1>
          <p className="text-muted-foreground">View feedback from your passengers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating ? 'fill-primary text-primary' : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">Average Rating</p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {feedback.length}
            </div>
            <p className="text-muted-foreground">Total Reviews</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {feedback.filter(f => f.rating >= 4).length}
            </div>
            <p className="text-muted-foreground">Positive Reviews</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Feedback</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-8">Loading...</p>
            ) : feedback.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No feedback yet</p>
            ) : (
              feedback.map((item) => (
                <div key={item.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= item.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.trips?.routes?.name || 'Route N/A'}
                    </span>
                  </div>
                  {item.comment && (
                    <p className="text-sm mb-2">{item.comment}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Ratings;
