import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Users, Sparkles, Shield, Smartphone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/download.jpg";
import appMockup from "@/assets/bus.png";
import happyCommuters from "@/assets/happy-commuters.jpg";

const Home = () => {
  const features = [
    {
      icon: Clock,
      title: "Real-Time Schedules",
      description: "Get accurate arrival times for buses and moto-taxis at your location.",
    },
    {
      icon: MapPin,
      title: "Smart Route Planning",
      description: "Find the fastest route to your destination with multiple transport options.",
    },
    {
      icon: Users,
      title: "Ride Sharing",
      description: "Share rides with other commuters and reduce transportation costs.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Verified drivers and vehicles with real-time tracking for your safety.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Predictions",
      description: "Machine learning algorithms predict arrival times and optimize routes.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Access from any device - responsive design for seamless experience.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "1000+", label: "Registered Drivers" },
    { value: "200+", label: "Routes Covered" },
    { value: "98%", label: "User Satisfaction" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-primary-foreground animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Smart Transportation for Modern Rwanda
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Real-time bus schedules, moto-taxi availability, and intelligent route planning. 
              Travel smarter, arrive faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-large">
                  Book a Ride Now
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:block animate-fade-in-up">
            <img 
              src={appMockup} 
              alt="TransConnect Mobile App" 
              className="w-full max-w-full mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Why Choose TransConnect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of public transportation with our innovative features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-medium transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img 
                src={heroImage} 
                alt="Happy Commuters" 
                className="rounded-2xl shadow-large"
              />
            </div>
            <div className="text-primary-foreground animate-fade-in-up">
              <h2 className="text-4xl font-bold mb-6">
                Join Thousands of Satisfied Commuters
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Experience hassle-free commuting with real-time updates, verified drivers, 
                and the most efficient routes across Rwanda.
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-large">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
