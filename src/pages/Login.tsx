import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-hero text-primary-foreground p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          <span className="font-heading font-bold text-xl">AfyaConnect</span>
        </Link>
        <div>
          <h2 className="font-heading text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="text-primary-foreground/70 leading-relaxed">Access your dashboard, view claims, and manage your health coverage.</p>
          <div className="mt-8 space-y-3">
            {["Check your cover balance", "Track claim status", "Pay via M-Pesa"].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <CheckCircle className="w-4 h-4 text-primary-foreground/60" /> {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-primary-foreground/40">© 2026 AfyaConnect. Regulated by IRA Kenya.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-heading font-bold text-xl text-foreground">AfyaConnect</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Log In</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input placeholder="wanjiku@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground gap-2">
              <LogIn className="w-4 h-4" /> Log In
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            <strong>Demo:</strong> Use email <span className="text-foreground">wanjiku@email.com</span> with any password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
