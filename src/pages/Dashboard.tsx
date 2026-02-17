import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield, Heart, CreditCard, FileText, Bell, Settings, LogOut, User,
  ChevronRight, TrendingUp, Calendar, Phone, Home, ClipboardList, Menu, X
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getClaimsByUser } from "@/lib/mock-claims";
import { getPaymentsByUser } from "@/lib/mock-payments";

const sidebarLinks = [
  { icon: Home, label: "Overview", href: "/dashboard", active: true },
  { icon: Heart, label: "My Coverage", href: "/dashboard" },
  { icon: ClipboardList, label: "Claims", href: "/claims" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: User, label: "Profile", href: "/dashboard" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const claims = user ? getClaimsByUser(user.id) : [];
  const payments = user ? getPaymentsByUser(user.id) : [];
  const pendingClaims = claims.filter((c) => c.status === "Pending").length;
  const totalPaid = payments.filter((p) => p.status === "Completed").reduce((s, p) => s + p.amount, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user ? user.firstName : "Guest";
  const memberSince = user?.memberSince || "Today";

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sidebar-foreground">AfyaConnect</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                link.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-heading font-bold text-foreground">Jambo, {displayName} 👋</h1>
              <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {pendingClaims > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Plan", value: user?.plan || "Msingi", sub: "Active", icon: Shield, color: "text-primary" },
              { label: "Cover Balance", value: "KES 42,500", sub: "of 50,000", icon: Heart, color: "text-success" },
              { label: "Total Paid", value: `KES ${totalPaid.toLocaleString()}`, sub: `${payments.length} payments`, icon: CreditCard, color: "text-accent" },
              { label: "Claims Filed", value: String(claims.length), sub: `${pendingClaims} pending`, icon: FileText, color: "text-info" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="shadow-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <p className="font-heading text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Coverage Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Outpatient", used: 7500, total: 50000 },
                  { label: "Inpatient", used: 0, total: 200000 },
                  { label: "Dental", used: 3200, total: 15000 },
                  { label: "Maternity", used: 0, total: 100000 },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{c.label}</span>
                      <span className="text-muted-foreground">KES {c.used.toLocaleString()} / {c.total.toLocaleString()}</span>
                    </div>
                    <Progress value={(c.used / c.total) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: FileText, label: "File a Claim", color: "bg-primary/10 text-primary", href: "/claims" },
                  { icon: CreditCard, label: "Make Payment", color: "bg-accent/10 text-accent", href: "/payments" },
                  { icon: Phone, label: "Call Support", color: "bg-info/10 text-info", href: "#" },
                  { icon: Calendar, label: "Book Appointment", color: "bg-success/10 text-success", href: "#" },
                ].map((a) => (
                  <Link key={a.label} to={a.href} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group">
                    <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center`}>
                      <a.icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1 text-sm text-foreground font-medium text-left">{a.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-lg">Recent Claims</CardTitle>
              <Link to="/claims">
                <Button variant="ghost" size="sm" className="text-primary">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {claims.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.hospital}</p>
                        <p className="text-xs text-muted-foreground">{c.id} · {c.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-medium text-foreground hidden sm:block">KES {c.amount.toLocaleString()}</span>
                      <Badge variant="secondary" className={c.status === "Approved" ? "bg-success/10 text-success" : c.status === "Pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}>{c.status}</Badge>
                    </div>
                  </div>
                ))}
                {claims.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No claims yet</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-accent text-accent-foreground shadow-card border-0">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-foreground/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-heading font-bold text-lg">Payment Due Soon</p>
                  <p className="text-sm text-accent-foreground/80">KES 1,500 due on March 1st. Pay via M-Pesa to keep your cover active.</p>
                </div>
              </div>
              <Link to="/payments">
                <Button className="bg-accent-foreground/20 hover:bg-accent-foreground/30 text-accent-foreground border-0 flex-shrink-0">
                  Pay Now via M-Pesa
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
