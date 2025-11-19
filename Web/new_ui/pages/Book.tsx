import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bus, Bike, Users, MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Book = () => {
  const [transportType, setTransportType] = useState("bus");
  const [date, setDate] = useState<Date>();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const transportOptions = [
    { id: "bus", label: "Bus", icon: Bus, color: "text-blue-600" },
    { id: "moto", label: "Moto-Taxi", icon: Bike, color: "text-green-600" },
    { id: "share", label: "Ride Share", icon: Users, color: "text-purple-600" },
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Booking logic will be connected to backend later
    console.log({ transportType, pickup, destination, date });
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

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="pickup" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Pickup Location
                </Label>
                <Input
                  id="pickup"
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  required
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

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
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full bg-gradient-primary shadow-medium">
                Find Available Rides
              </Button>
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Book;
