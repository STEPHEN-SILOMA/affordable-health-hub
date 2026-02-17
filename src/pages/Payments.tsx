import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, CreditCard, Phone, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getPaymentsByUser, simulateMpesaPayment } from "@/lib/mock-payments";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const statusConfig = {
  Completed: { color: "bg-success/10 text-success" },
  Pending: { color: "bg-warning/10 text-warning" },
  Failed: { color: "bg-destructive/10 text-destructive" },
};

const Payments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState(() => user ? getPaymentsByUser(user.id) : []);
  const [amount, setAmount] = useState("1500");
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!user) return;
    setPaying(true);
    toast({ title: "M-Pesa STK Push sent", description: `Check your phone ${user.phone} to confirm payment.` });
    const payment = await simulateMpesaPayment(user.id, Number(amount), `Premium payment - ${user.plan}`);
    setPayments((prev) => [payment, ...prev]);
    setPaying(false);
    toast({ title: "Payment successful!", description: `KES ${Number(amount).toLocaleString()} received. Ref: ${payment.reference}` });
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
          <span className="font-heading font-bold text-foreground">Payments</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Pay section */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-success" /> Pay via M-Pesa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-success/10 rounded-xl p-4">
              <p className="text-sm text-foreground font-medium">STK Push Simulation</p>
              <p className="text-xs text-muted-foreground">A prompt will be sent to {user?.phone || "your phone"}. This is a demo — payment completes automatically after 2 seconds.</p>
            </div>
            <div>
              <Label>Amount (KES)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" />
            </div>
            <Button onClick={handlePay} disabled={paying || !amount} className="bg-gradient-accent text-accent-foreground gap-2">
              {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {paying ? "Processing..." : "Pay with M-Pesa"}
            </Button>
          </CardContent>
        </Card>

        {/* History */}
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-4">Payment History</h2>
          <div className="space-y-3">
            {payments.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="shadow-card border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${p.status === "Completed" ? "bg-success/10" : p.status === "Failed" ? "bg-destructive/10" : "bg-warning/10"}`}>
                        {p.status === "Completed" ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-destructive" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.description}</p>
                        <p className="text-xs text-muted-foreground">{p.date} · Ref: {p.reference}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span className="text-sm font-medium text-foreground">KES {p.amount.toLocaleString()}</span>
                      <Badge variant="secondary" className={statusConfig[p.status].color}>{p.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {payments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No payments yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
