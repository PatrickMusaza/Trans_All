import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, Bike, Users, MapPin, Calendar as CalendarIcon, Clock, Navigation, Route } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleMap from "@/components/VehicleMap";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Book = () => {
  const [transportType, setTransportType] = useState("bus");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [routeStops, setRouteStops] = useState<any[]>([]);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [availableTrips, setAvailableTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const transportOptions = [
    { id: "bus", label: "Bus", icon: Bus, color: "text-blue-600" },
    { id: "moto", label: "Moto-Taxi", icon: Bike, color: "text-green-600" },
    { id: "share", label: "Ride Share", icon: Users, color: "text-purple-600" },
  ];

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      const route = routes.find(r => r.id === selectedRoute);
      if (route && route.stops) {
        setRouteStops(route.stops);
      } else {
        setRouteStops([]);
      }
      setPickup("");
      setDestination("");
    }
  }, [selectedRoute, routes]);

  useEffect(() => {
    if (date && time && selectedRoute) {
      searchTrips();
    }
  }, [date, time, selectedRoute]);

  const fetchRoutes = async () => {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching routes:', error);
    } else {
      setRoutes(data || []);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setUseCurrentLocation(true);
          setPickup("Current Location");
          setLoading(false);
          toast({
            title: "Location Found",
            description: "Using your current location as pickup point",
          });
        },
        (error) => {
          setLoading(false);
          toast({
            title: "Location Error",
            description: "Could not get your current location",
            variant: "destructive",
          });
        }
      );
    } else {
      setLoading(false);
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  const searchTrips = async () => {
    if (!date || !time || !selectedRoute) return;

    setLoading(true);
    const dateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        routes (
          id,
          name,
          start_location,
          end_location,
          fare_amount,
          distance_km
        ),
        vehicles (
          id,
          vehicle_type,
          plate_number,
          capacity
        )
      `)
      .eq('route_id', selectedRoute)
      .eq('status', 'scheduled')
      .gte('departure_time', dateTime.toISOString())
      .gt('available_seats', 0);

    if (error) {
      console.error('Error fetching trips:', error);
    } else {
      setAvailableTrips(data || []);
    }
    setLoading(false);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a trip",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    if (!selectedTrip) {
      toast({
        title: "Select a Trip",
        description: "Please select a trip from the available options",
        variant: "destructive",
      });
      return;
    }

    const trip = availableTrips.find(t => t.id === selectedTrip);
    if (!trip) return;

    const totalAmount = trip.routes.fare_amount * seatsToBook;

    const { error } = await supabase
      .from('bookings')
      .insert([{
        trip_id: selectedTrip,
        user_id: user.id,
        seats_booked: seatsToBook,
        total_amount: totalAmount,
        status: 'confirmed',
        payment_status: 'pending',
      }]);

    if (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Update available seats
      await supabase
        .from('trips')
        .update({ available_seats: trip.available_seats - seatsToBook })
        .eq('id', selectedTrip);

      toast({
        title: "Booking Successful!",
        description: `Your booking for ${trip.routes.name} has been confirmed`,
      });
      
      navigate('/dashboard/bookings');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Book Your Ride
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto animate-fade-in-up">
            Choose your transport option and plan your journey
          </p>
        </div>
      </section>

      <section className="py-12 -mt-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-8 shadow-large animate-scale-in">
            <form onSubmit={handleBooking} className="space-y-8">
              {/* Transport Type Selection */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">Select Transport Type</Label>
                <RadioGroup value={transportType} onValueChange={setTransportType} className="grid grid-cols-3 gap-4">
                  {transportOptions.map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-medium",
                        transportType === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <RadioGroupItem value={option.id} className="sr-only" />
                      <option.icon className={cn("h-8 w-8", option.color)} />
                      <span className="font-medium text-sm">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Route Selection */}
              <div className="space-y-2">
                <Label htmlFor="route" className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" />
                  Select Route
                </Label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name} ({route.start_location} → {route.end_location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pickup Location */}
              {selectedRoute && (
                <div className="space-y-2">
                  <Label htmlFor="pickup" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Pickup Stop
                  </Label>
                  <div className="flex gap-2">
                    <Select 
                      value={useCurrentLocation ? "current" : pickup} 
                      onValueChange={(value) => {
                        if (value === "current") {
                          getCurrentLocation();
                        } else {
                          setUseCurrentLocation(false);
                          setPickup(value);
                        }
                      }}
                      disabled={!selectedRoute}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pickup stop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            Use Current Location
                          </div>
                        </SelectItem>
                        {routeStops.map((stop, index) => (
                          <SelectItem key={index} value={stop.name}>
                            {stop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Destination */}
              {selectedRoute && pickup && (
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Destination Stop
                  </Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination stop" />
                    </SelectTrigger>
                    <SelectContent>
                      {routeStops
                        .filter(stop => stop.name !== pickup)
                        .map((stop, index) => (
                          <SelectItem key={index} value={stop.name}>
                            {stop.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Available Trips */}
              {availableTrips.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Trips</Label>
                  <RadioGroup value={selectedTrip || ''} onValueChange={setSelectedTrip}>
                    {availableTrips.map((trip) => (
                      <label
                        key={trip.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                          selectedTrip === trip.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={trip.id} />
                          <div>
                            <p className="font-semibold">{trip.routes?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(trip.departure_time), 'PPp')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {trip.vehicles?.vehicle_type} - {trip.vehicles?.plate_number}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">RWF {trip.routes?.fare_amount}</p>
                          <p className="text-xs text-muted-foreground">
                            {trip.available_seats} seats available
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Number of Seats */}
              {selectedTrip && (
                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    max={availableTrips.find(t => t.id === selectedTrip)?.available_seats || 1}
                    value={seatsToBook}
                    onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
                    required
                  />
                </div>
              )}

              {/* Search Button */}
              {selectedRoute && pickup && destination && date && time && !availableTrips.length && (
                <Button 
                  type="button"
                  onClick={searchTrips}
                  size="lg" 
                  className="w-full bg-gradient-primary shadow-medium"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search Available Trips'}
                </Button>
              )}

              {/* Submit Button */}
              {selectedTrip && (
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-primary shadow-medium"
                  disabled={loading}
                >
                  Confirm Booking
                </Button>
              )}
            </form>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">5min</div>
              <p className="text-muted-foreground">Average Wait Time</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-muted-foreground">On-Time Arrival</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Service Available</p>
            </Card>
          </div>

          {/* Live Vehicle Tracking Map */}
          <div className="mt-12 max-w-5xl mx-auto">
            <VehicleMap />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Book;
