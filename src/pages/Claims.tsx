import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Shield, ArrowLeft, FileText, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getClaimsByUser, submitClaim } from "@/lib/mock-claims";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const hospitals = [
  "Kenyatta National Hospital",
  "Nairobi Women's Hospital",
  "Avenue Healthcare",
  "Aga Khan University Hospital",
  "MP Shah Hospital",
  "Mater Hospital",
  "Karen Hospital",
  "Gertrude's Children's Hospital",
];

const statusConfig = {
  Approved: { icon: CheckCircle, color: "bg-success/10 text-success" },
  Pending: { icon: Clock, color: "bg-warning/10 text-warning" },
  Rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive" },
};

const Claims = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [claims, setClaims] = useState(() => user ? getClaimsByUser(user.id) : []);
  const [hospital, setHospital] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const claim = submitClaim({
      userId: user.id,
      hospital,
      amount: Number(amount),
      description,
    });
    setClaims((prev) => [claim, ...prev]);
    setShowForm(false);
    setHospital("");
    setAmount("");
    setDescription("");
    toast({ title: "Claim submitted!", description: `Claim ${claim.id} is now pending review.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-8 gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-heading font-bold text-foreground">Claims</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Your Claims</h1>
            <p className="text-sm text-muted-foreground">{claims.length} total claims</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-hero text-primary-foreground gap-1">
            <Plus className="w-4 h-4" /> New Claim
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg">File a New Claim</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Hospital</Label>
                    <select
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select hospital...</option>
                      {hospitals.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Amount (KES)</Label>
                    <Input type="number" placeholder="5000" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Describe the treatment or service received..." value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={500} />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-gradient-hero text-primary-foreground">Submit Claim</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-3">
          {claims.map((c, i) => {
            const cfg = statusConfig[c.status];
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="shadow-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{c.hospital}</p>
                          <p className="text-xs text-muted-foreground">{c.id} · {c.date}</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{c.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className="text-sm font-medium text-foreground">KES {c.amount.toLocaleString()}</span>
                        <Badge variant="secondary" className={cfg.color}>{c.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          {claims.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No claims yet. File your first claim above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Claims;
