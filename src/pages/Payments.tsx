import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Smartphone,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import NavLink from "@/components/NavLink";

interface Payment {
  id: string;
  date: string;
  amount: number;
  reference: string;
  status: "completed" | "pending" | "failed";
  method: "m-pesa" | "card" | "bank";
  phone?: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"amount" | "phone" | "confirm">("amount");
  const [formData, setFormData] = useState({
    amount: "",
    phone: "",
    method: "m-pesa",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSTKPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/payments/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: formData.amount,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "STK Push sent",
          description: "Check your phone for the M-Pesa prompt",
        });
        setPaymentStep("amount");
        setFormData({ amount: "", phone: "", method: "m-pesa" });
        fetchPayments();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to initiate payment",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === "pending");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <span className="font-heading font-bold text-lg">AfyaConnect</span>
              <div className="hidden sm:flex gap-1">
                <NavLink href="/dashboard" label="Dashboard" />
                <NavLink href="/claims" label="Claims" />
                <NavLink href="/payments" label="Payments" active />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Payments</h1>
            <p className="text-muted-foreground">Manage your subscription payments and payment history</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Make Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make a Payment</DialogTitle>
                <DialogDescription>
                  {paymentStep === "amount" && "Enter the amount you want to pay"}
                  {paymentStep === "phone" && "Enter your phone number"}
                  {paymentStep === "confirm" && "Confirm your payment details"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSTKPush} className="space-y-4">
                {paymentStep === "amount" && (
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="e.g., 500"
                      min="50"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Minimum amount: KES 50</p>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => setPaymentStep("phone")}
                      disabled={!formData.amount}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {paymentStep === "phone" && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+254700000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Must start with +254</p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setPaymentStep("amount")}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() => setPaymentStep("confirm")}
                        disabled={!formData.phone}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStep === "confirm" && (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-semibold">KES {formData.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-semibold">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method:</span>
                        <span className="font-semibold flex items-center gap-1">
                          <Smartphone className="w-4 h-4" />
                          M-Pesa
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
                      You will receive an M-Pesa popup on your phone. Enter your M-Pesa PIN to complete the payment.
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Complete Payment"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setPaymentStep("amount")}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: CreditCard, label: "Total Paid", value: `KES ${totalPaid}`, color: "text-green-600" },
            { icon: Clock, label: "Pending", value: pendingPayments.length, color: "text-yellow-600" },
            { icon: TrendingUp, label: "Total Transactions", value: payments.length, color: "text-blue-600" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <Card key={i}>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Pending Payments Alert */}
        {pendingPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg"
          >
            <p className="text-yellow-800 font-semibold mb-2">Pending Payments</p>
            <p className="text-sm text-yellow-700">
              You have {pendingPayments.length} pending payment(s). Please complete them to avoid service interruption.
            </p>
          </motion.div>
        )}

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">No payments yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-semibold">KES {payment.amount}</TableCell>
                          <TableCell className="font-mono text-sm">{payment.reference}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {payment.method === "m-pesa" && <Smartphone className="w-4 h-4" />}
                              <span className="capitalize">{payment.method}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(payment.status)}
                              {getStatusBadge(payment.status)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Payments;
