import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bus, Bike, Users, MapPin, Calendar, Shield, Star, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: Bus,
      title: "Bus Tracking",
      description: "Real-time tracking of public buses with accurate arrival predictions and route information.",
      features: [
        "Live bus locations on map",
        "Accurate arrival time predictions",
        "Route planning and alternatives",
        "Seat availability information"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Bike,
      title: "Moto-Taxi Booking",
      description: "Quick and reliable moto-taxi services with verified drivers and competitive pricing.",
      features: [
        "Instant moto-taxi booking",
        "Verified driver profiles",
        "Upfront pricing",
        "Safety features and tracking"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Ride Sharing",
      description: "Share rides with other commuters going in the same direction and save money.",
      features: [
        "Find nearby co-travelers",
        "Split fare options",
        "Scheduled rides",
        "Community ratings"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Route Optimization",
      description: "AI-powered route planning that finds the fastest and most efficient path to your destination.",
      features: [
        "Multi-modal transport options",
        "Traffic-aware routing",
        "Cost comparison",
        "Accessibility options"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const additionalFeatures = [
    {
      icon: Calendar,
      title: "Trip Planning",
      description: "Plan your trips in advance with schedule integration"
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Verified drivers, real-time tracking, and emergency support"
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Rate your experience and help improve service quality"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access transportation information anytime, anywhere"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Our Services
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in-up">
            Comprehensive transportation solutions designed to make your commute easier, 
            safer, and more efficient.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="p-8 hover:shadow-large transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`bg-gradient-to-br ${service.color} p-4 rounded-xl w-fit mb-6`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Additional Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              More features to enhance your transportation experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 text-center hover:shadow-medium transition-all animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-primary p-3 rounded-lg w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            Ready to Experience Smart Transportation?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto animate-fade-in-up">
            Join thousands of satisfied users and transform your daily commute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link to="/book">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Book a Ride
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
