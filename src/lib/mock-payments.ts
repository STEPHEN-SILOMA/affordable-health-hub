// Mock payments service using localStorage

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  method: "M-Pesa";
  status: "Completed" | "Pending" | "Failed";
  reference: string;
  description: string;
}

const PAYMENTS_KEY = "afya_payments";

const seedPayments: Payment[] = [
  { id: "PAY-001", userId: "usr_001", amount: 1500, date: "2026-02-01", method: "M-Pesa", status: "Completed", reference: "SHJ3K9X2M1", description: "February premium - Msingi" },
  { id: "PAY-002", userId: "usr_001", amount: 1500, date: "2026-01-01", method: "M-Pesa", status: "Completed", reference: "RKL8N7P4Q2", description: "January premium - Msingi" },
  { id: "PAY-003", userId: "usr_001", amount: 1500, date: "2025-12-01", method: "M-Pesa", status: "Completed", reference: "TYU5M3W9R6", description: "December premium - Msingi" },
  { id: "PAY-004", userId: "usr_001", amount: 50, date: "2025-11-15", method: "M-Pesa", status: "Failed", reference: "VBN2X8K1L4", description: "Daily top-up" },
];

function getPayments(): Payment[] {
  const raw = localStorage.getItem(PAYMENTS_KEY);
  if (!raw) {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(seedPayments));
    return seedPayments;
  }
  return JSON.parse(raw);
}

export function getPaymentsByUser(userId: string): Payment[] {
  return getPayments().filter((p) => p.userId === userId);
}

export function simulateMpesaPayment(userId: string, amount: number, description: string): Promise<Payment> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const payments = getPayments();
      const payment: Payment = {
        id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
        userId,
        amount,
        date: new Date().toISOString().split("T")[0],
        method: "M-Pesa",
        status: "Completed",
        reference: Math.random().toString(36).substring(2, 12).toUpperCase(),
        description,
      };
      payments.unshift(payment);
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
      resolve(payment);
    }, 2000); // simulate 2s STK push delay
  });
}
