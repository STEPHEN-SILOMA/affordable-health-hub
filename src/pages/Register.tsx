import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, ArrowLeft, User, Phone, CreditCard, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const steps = ["Personal Info", "Contact", "Choose Plan", "Confirm"];

const Register = () => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Msingi");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFinish = () => {
    try {
      signup({ firstName, lastName, email, phone, county, plan: selectedPlan }, password);
      toast({ title: "Welcome to AfyaConnect!", description: "Your account has been created." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
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
          <h2 className="font-heading text-3xl font-bold mb-4">Join 120,000+ Kenyans with affordable health cover</h2>
          <p className="text-primary-foreground/70 leading-relaxed">No paperwork. No waiting period. Pay with M-Pesa and start your coverage immediately.</p>
          <div className="mt-8 space-y-3">
            {["Register in under 2 minutes", "Start with KES 50/day", "Cover starts instantly"].map((t) => (
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

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i <= step ? "bg-gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 w-8 transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Personal Details</h2>
                  <p className="text-sm text-muted-foreground mb-6">Enter your details as they appear on your ID.</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>First Name</Label><Input placeholder="Wanjiku" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                      <div><Label>Last Name</Label><Input placeholder="Kamau" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                    </div>
                    <div><Label>Password</Label><Input placeholder="Create a password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                    <div><Label>Date of Birth</Label><Input type="date" /></div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Contact Info</h2>
                  <p className="text-sm text-muted-foreground mb-6">We'll send your digital card via SMS.</p>
                  <div className="space-y-4">
                    <div><Label>M-Pesa Phone Number</Label><Input placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                    <div><Label>Email</Label><Input placeholder="wanjiku@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div><Label>County</Label><Input placeholder="Nairobi" value={county} onChange={(e) => setCounty(e.target.value)} /></div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Choose Your Plan</h2>
                  <p className="text-sm text-muted-foreground mb-6">You can change plans anytime.</p>
                  <div className="space-y-3">
                    {[
                      { name: "Msingi", price: "KES 50/day", desc: "Individual outpatient + inpatient" },
                      { name: "Familia", price: "KES 1,500/mo", desc: "Family cover with dental & maternity" },
                      { name: "Chama", price: "KES 1,000/member/mo", desc: "Group rates for 10+ members" },
                    ].map((p, i) => (
                      <Card key={p.name} onClick={() => setSelectedPlan(p.name)} className={`cursor-pointer border-2 transition-all ${selectedPlan === p.name ? "border-primary shadow-card" : "border-border hover:border-primary/30"}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-heading font-semibold text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.desc}</p>
                          </div>
                          <span className="text-sm font-bold text-primary">{p.price}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Confirm & Pay</h2>
                  <p className="text-sm text-muted-foreground mb-6">Review your details and make your first payment.</p>
                  <Card className="shadow-card border-border mb-6">
                    <CardContent className="p-4 space-y-3">
                      {[
                        { label: "Name", value: `${firstName || "—"} ${lastName || "—"}` },
                        { label: "Plan", value: selectedPlan },
                        { label: "M-Pesa", value: phone || "—" },
                        { label: "Email", value: email || "—" },
                      ].map((r) => (
                        <div key={r.label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{r.label}</span>
                          <span className="text-foreground font-medium">{r.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <div className="bg-success/10 rounded-xl p-4 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">M-Pesa STK Push</p>
                      <p className="text-xs text-muted-foreground">You'll receive a prompt on {phone || "your phone"} to complete registration.</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} className="bg-gradient-hero text-primary-foreground gap-1">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} className="bg-gradient-accent text-accent-foreground gap-1">
                <CreditCard className="w-4 h-4" /> Create Account
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
