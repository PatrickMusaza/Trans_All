import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Users, Bus, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  // This is a placeholder dashboard that will be customized based on user role
  const stats = [
    { icon: Users, label: "Total Users", value: "2,543", change: "+12%" },
    { icon: Bus, label: "Active Vehicles", value: "342", change: "+8%" },
    { icon: TrendingUp, label: "Trips Today", value: "1,234", change: "+23%" },
    { icon: BarChart, label: "Revenue", value: "RWF 45M", change: "+15%" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-success">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Placeholder Content */}
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Dashboard Under Construction</h2>
            <p className="text-muted-foreground mb-6">
              Role-specific dashboards (Admin, Driver, User, Agency Admin) will be implemented 
              with full CRUD operations and analytics in the next phase.
            </p>
            <Button className="bg-gradient-primary">
              Explore Features
            </Button>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
