import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  Filter,
  Search,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building2,
  Smartphone,
  Wallet,
  Plus,
  Check,
  X,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  FileText,
  IndianRupee,
} from "lucide-react";
import {
  generatePaymentStats,
  generateTransactions,
  generateWithdrawalHistory,
  generateBankAccounts,
} from "../../utils/doctorPaymentDummyData";

const tabOptions = [
  { value: "overview", label: "Overview" },
  { value: "transactions", label: "Transactions" },
  { value: "withdrawals", label: "Withdrawals" },
  { value: "payment-methods", label: "Payment Methods" },
];

const statusOptions = [
  { value: "all", label: "All Transactions" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "amount-high", label: "Amount: High to Low" },
  { value: "amount-low", label: "Amount: Low to High" },
];

export default function DoctorPayments() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats] = useState(generatePaymentStats);
  const [allTransactions] = useState(generateTransactions);
  const [withdrawals] = useState(generateWithdrawalHistory);
  const [bankAccounts] = useState(generateBankAccounts);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [addBankModal, setAddBankModal] = useState(false);

  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (txn) =>
          txn.patientName.toLowerCase().includes(search) ||
          txn.transactionId.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((txn) => txn.status === statusFilter);
    }

    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "amount-high":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-low":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return filtered;
  }, [allTransactions, searchTerm, statusFilter, sortBy]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
      case "failed":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      case "refunded":
        return "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400";
      case "processing":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-400";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <IndianRupee className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3" />
              +15%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(stats.totalEarnings)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total Earnings
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3" />
              +8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(stats.thisMonth)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This Month
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(stats.pendingPayments)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pending Payments
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(stats.totalWithdrawn)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total Withdrawn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <button
              onClick={() => setActiveTab("transactions")}
              className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {allTransactions.slice(0, 5).map((txn) => (
              <div
                key={txn._id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.status === "completed"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : txn.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                    {txn.status === "completed" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : txn.status === "pending" ? (
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {txn.patientName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {txn.appointmentType} • {formatDate(txn.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(txn.amount)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Withdrawal History
            </h3>
            <button
              onClick={() => setActiveTab("withdrawals")}
              className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {withdrawals.slice(0, 3).map((wdr) => (
              <div
                key={wdr._id}
                className="p-4 rounded-lg border border-gray-100 dark:border-neutral-700 hover:border-green-200 dark:hover:border-green-800 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {wdr.method === "Bank Transfer" ? (
                      <Building2 className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-purple-500" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(wdr.amount)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {wdr.method} • {wdr.bankName || wdr.upiId}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(wdr.status)}`}>
                    {wdr.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {formatDate(wdr.date)} • Ref: {wdr.reference}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name or transaction ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-neutral-700">
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Net</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredTransactions.map((txn) => (
              <tr
                key={txn._id}
                className="border-b border-gray-50 dark:border-neutral-700/50 hover:bg-gray-50 dark:hover:bg-neutral-750 transition"
              >
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {txn.transactionId}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {txn.patientName}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize">
                  {txn.appointmentType}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {formatDate(txn.date)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {formatCurrency(txn.amount)}
                </td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">
                  -{formatCurrency(txn.platformFee)}
                </td>
                <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(txn.netAmount)}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>Showing {filteredTransactions.length} transactions</span>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );

  const renderWithdrawals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Withdrawal History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Available balance: {formatCurrency(stats.totalEarnings - stats.totalWithdrawn)}
          </p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Withdrawal
        </button>
      </div>

      <div className="space-y-3">
        {withdrawals.map((wdr) => (
          <div
            key={wdr._id}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${wdr.status === "completed"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-blue-100 dark:bg-blue-900/30"
                  }`}>
                  {wdr.method === "Bank Transfer" ? (
                    <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(wdr.amount)}
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(wdr.status)}`}>
                      {wdr.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {wdr.method}
                    {wdr.bankName && ` • ${wdr.bankName}`}
                    {wdr.upiId && ` • ${wdr.upiId}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {wdr.accountNumber && `Account: ${wdr.accountNumber}`}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(wdr.date)}
                    </span>
                    <span>Ref: {wdr.reference}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                <FileText className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Bank Accounts
        </h3>
        <div className="space-y-3">
          {bankAccounts.map((bank) => (
            <div
              key={bank._id}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {bank.bankName}
                      </h4>
                      {bank.isDefault && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bank.accountHolder}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {bank.accountNumber}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      IFSC: {bank.ifscCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!bank.isDefault && (
                    <button className="text-xs text-green-600 dark:text-green-400 hover:underline">
                      Set as Default
                    </button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setAddBankModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-green-400 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400 transition font-medium text-sm"
      >
        <Plus className="w-4 h-4" />
        Add Bank Account
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payments
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your earnings, transactions, and withdrawals
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <div className="flex overflow-x-auto">
            {tabOptions.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === tab.value
                    ? "border-green-600 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "transactions" && renderTransactions()}
          {activeTab === "withdrawals" && renderWithdrawals()}
          {activeTab === "payment-methods" && renderPaymentMethods()}
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Withdraw Funds
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Available Balance
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalEarnings - stats.totalWithdrawn)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Withdrawal Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <button className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm">
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}