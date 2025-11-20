import { Card } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import busCommuter from "@/assets/download.jpg";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "Leveraging cutting-edge technology to transform public transportation"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a connected network of commuters, drivers, and transport agencies"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing the highest quality service and user experience"
    }
  ];

  const team = [
    { role: "Technology", count: "15+", description: "Engineers & Developers" },
    { role: "Operations", count: "25+", description: "Support Staff" },
    { role: "Partnerships", count: "50+", description: "Transport Agencies" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-6 animate-fade-in">
            About TransConnect
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in-up">
            Revolutionizing public transportation in Rwanda through innovation and technology
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img 
                src={busCommuter} 
                alt="Moto Driver" 
                className="rounded-2xl shadow-large"
              />
            </div>
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  To provide accessible, reliable, and efficient public transportation solutions 
                  that improve the daily commute for every Rwandan. We aim to reduce waiting times, 
                  optimize routes, and create a seamless travel experience through innovative technology.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-secondary p-3 rounded-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-lg text-muted-foreground">
                  To become the leading intelligent transportation platform in East Africa, 
                  setting the standard for smart mobility solutions and contributing to Rwanda's 
                  vision of becoming a tech-enabled nation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="p-8 text-center hover:shadow-medium transition-all hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-primary p-4 rounded-xl w-fit mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals working to transform transportation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <Card 
                key={index}
                className="p-8 text-center animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl font-bold text-primary mb-2">{item.count}</div>
                <div className="text-lg font-semibold mb-1">{item.role}</div>
                <div className="text-muted-foreground">{item.description}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="py-20 bg-black/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            The Future of Transportation
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in-up">
            We're constantly innovating with AI-powered predictions, enhanced safety features, 
            and expanding our network across Rwanda. Our upcoming features include predictive 
            arrival time refinement, anomaly detection for service alerts, and personalized 
            routing based on your preferences.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
