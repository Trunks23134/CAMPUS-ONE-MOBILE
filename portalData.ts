export type RequestStatus = "Processing" | "Ready for Pickup" | "Shipped" | "Completed";
export type PaymentStatus = "under_verification" | "paid";

export type PortalRequest = {
  id: string;
  title: string;
  serviceType: string;
  status: RequestStatus;
  submittedAt?: string;
  description?: string;
};

export type PortalPayment = {
  requestId: string;
  status: PaymentStatus;
  transactionId?: string;
  service?: string;
  amount?: number;
  createdAt?: string;
  receiptLabel?: string;
};

export const mockRequests: PortalRequest[] = [
  {
    id: "REQ-2024-001",
    title: "Alumni Card",
    serviceType: "Card Application",
    status: "Processing",
    submittedAt: "May 1, 2024",
    description: "Initial alumni card processing request.",
  },
  {
    id: "REQ-2024-002",
    title: "Document Request",
    serviceType: "Document Request",
    status: "Ready for Pickup",
    submittedAt: "Apr 28, 2024",
    description: "Certified transcript document request.",
  },
  {
    id: "REQ-2024-003",
    title: "Clearance Routing",
    serviceType: "Clearance Tracker",
    status: "Shipped",
    submittedAt: "Apr 19, 2024",
    description: "Clearance endorsements across departments.",
  },
  {
    id: "REQ-2024-004",
    title: "Profile Verification",
    serviceType: "My Requests",
    status: "Completed",
    submittedAt: "Mar 12, 2024",
    description: "Profile audit and alumni information review.",
  },
  {
    id: "REQ-2024-005",
    title: "Diploma Reprint",
    serviceType: "Document Request",
    status: "Completed",
    submittedAt: "Feb 15, 2024",
    description: "Replacement diploma copy.",
  },
  {
    id: "REQ-2024-006",
    title: "Membership Renewal",
    serviceType: "Billing & Payments",
    status: "Completed",
    submittedAt: "Jan 30, 2024",
    description: "Annual membership fee renewal.",
  },
];

export const mockPayments: PortalPayment[] = [
  {
    requestId: "REQ-2024-001",
    status: "under_verification",
    service: "Alumni Card",
    amount: 300,
    createdAt: "May 2, 2024",
  },
  {
    requestId: "REQ-2024-002",
    transactionId: "PAY-2024-002",
    status: "paid",
    service: "Document Request (shipping)",
    amount: 120,
    createdAt: "Apr 28, 2024",
    receiptLabel: "Download Receipt",
  },
  {
    requestId: "REQ-2024-006",
    transactionId: "PAY-2024-003",
    status: "paid",
    service: "Alumni Membership Fee",
    amount: 50,
    createdAt: "Mar 1, 2024",
    receiptLabel: "Download Receipt",
  },
];

export function getActiveRequests(requests: PortalRequest[]): PortalRequest[] {
  return requests.filter((request) => request.status === "Processing");
}

export function getCompletedRequests(requests: PortalRequest[]): PortalRequest[] {
  return requests.filter((request) => request.status === "Completed");
}

export function getReadyForPickupRequests(requests: PortalRequest[]): PortalRequest[] {
  return requests.filter((request) => request.status === "Ready for Pickup");
}

export function getPendingPayments(payments: PortalPayment[]): PortalPayment[] {
  return payments.filter((payment) => payment.status === "under_verification");
}

export function getPaidPayments(payments: PortalPayment[]): PortalPayment[] {
  return payments.filter((payment) => payment.status === "paid");
}
