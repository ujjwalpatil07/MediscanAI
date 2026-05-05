export const generatePaymentStats = () => ({
  totalEarnings: 285000,
  thisMonth: 42500,
  pendingPayments: 12800,
  totalWithdrawn: 242000,
  totalAppointments: 156,
  averageConsultationFee: 550,
});

export const generateTransactions = () => {
  const patients = [
    "Bogdan Krivenchenko",
    "Jenny Wilson",
    "David Miller",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "Robert Fox",
    "John Smith",
    "Dianne Russel",
    "Annette Black",
  ];

  const transactions = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    const amount = Math.floor(Math.random() * 800) + 300;
    const statuses = ["completed", "pending", "failed", "refunded"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const types = ["consultation", "follow-up", "emergency", "online"];
    const type = types[Math.floor(Math.random() * types.length)];

    transactions.push({
      _id: `txn_${(i + 1).toString().padStart(4, "0")}`,
      patientName: patients[i % patients.length],
      appointmentType: type,
      amount,
      status,
      paymentMethod: Math.random() > 0.5 ? "online" : "cash",
      transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: date.toISOString(),
      consultationFee: amount,
      platformFee: Math.floor(amount * 0.1),
      netAmount: Math.floor(amount * 0.9),
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const generateWithdrawalHistory = () => [
  {
    _id: "wdr_001",
    amount: 25000,
    method: "Bank Transfer",
    bankName: "HDFC Bank",
    accountNumber: "****4521",
    status: "completed",
    date: "2024-12-15",
    reference: "WDR20241215001",
  },
  {
    _id: "wdr_002",
    amount: 18000,
    method: "UPI",
    upiId: "doctor***@upi",
    status: "completed",
    date: "2024-11-20",
    reference: "WDR20241120002",
  },
  {
    _id: "wdr_003",
    amount: 32000,
    method: "Bank Transfer",
    bankName: "HDFC Bank",
    accountNumber: "****4521",
    status: "processing",
    date: "2025-01-05",
    reference: "WDR20250105003",
  },
  {
    _id: "wdr_004",
    amount: 15000,
    method: "UPI",
    upiId: "doctor***@upi",
    status: "completed",
    date: "2024-10-10",
    reference: "WDR20241010004",
  },
];

export const generateBankAccounts = () => [
  {
    _id: "bank_001",
    bankName: "HDFC Bank",
    accountHolder: "Dr. Stephen Conley",
    accountNumber: "****4521",
    ifscCode: "HDFC0001234",
    isDefault: true,
  },
  {
    _id: "bank_002",
    bankName: "State Bank of India",
    accountHolder: "Dr. Stephen Conley",
    accountNumber: "****7890",
    ifscCode: "SBIN0005678",
    isDefault: false,
  },
];
