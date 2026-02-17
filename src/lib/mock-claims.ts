// Mock claims service using localStorage

export interface Claim {
  id: string;
  userId: string;
  hospital: string;
  amount: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  description: string;
  receiptUrl?: string;
}

const CLAIMS_KEY = "afya_claims";

const seedClaims: Claim[] = [
  { id: "CLM-2025-0412", userId: "usr_001", hospital: "Kenyatta National Hospital", amount: 3200, date: "2026-02-12", status: "Approved", description: "General consultation and lab tests" },
  { id: "CLM-2025-0398", userId: "usr_001", hospital: "Nairobi Women's Hospital", amount: 7500, date: "2026-01-28", status: "Pending", description: "Dental cleaning and X-ray" },
  { id: "CLM-2025-0371", userId: "usr_001", hospital: "Avenue Healthcare", amount: 1800, date: "2026-01-15", status: "Approved", description: "Prescription medication" },
];

function getClaims(): Claim[] {
  const raw = localStorage.getItem(CLAIMS_KEY);
  if (!raw) {
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(seedClaims));
    return seedClaims;
  }
  return JSON.parse(raw);
}

export function getClaimsByUser(userId: string): Claim[] {
  return getClaims().filter((c) => c.userId === userId);
}

export function submitClaim(claim: Omit<Claim, "id" | "status" | "date">): Claim {
  const claims = getClaims();
  const newClaim: Claim = {
    ...claim,
    id: `CLM-${new Date().getFullYear()}-${String(claims.length + 1).padStart(4, "0")}`,
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
  };
  claims.unshift(newClaim);
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  return newClaim;
}
