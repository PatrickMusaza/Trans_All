import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bus, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Form from "../components/Authentication/Form";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    setLoading(false);
    if (!error) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
        <Card className="w-full max-w-md p-8 shadow-large animate-scale-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TransConnect
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-primary shadow-medium"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
      <div className="sign-in-container">
        <div className="left-section">
          <h1>Sign In to Continue with TransConnect</h1>
          <p>
            If you don’t have an account
            <a href="/register" className="register-link">
              {" "}
              Register here!
            </a>
          </p>
        </div>
        <div className="right-section">
          <Form route="api/token/" method="login" />
        </div>
      </div>
    </>
  );
};

export default SignIn;
