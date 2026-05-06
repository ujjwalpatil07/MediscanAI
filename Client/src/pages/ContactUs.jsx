import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  FileText,
  Shield,
  CheckCircle,
  Loader2,
} from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 1800-123-4567", "+91 98765-43210"],
    description: "Available 24/7 for emergencies",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["support@mediscanai.com", "info@mediscanai.com"],
    description: "We'll respond within 24 hours",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: MapPin,
    title: "Office",
    details: ["123 Healthcare Avenue", "Medical District, Mumbai - 400053"],
    description: "Visit us during business hours",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: Clock,
    title: "Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 2:00 PM"],
    description: "Closed on Sundays",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const faqItems = [
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment by browsing our doctor listings, selecting a doctor, and choosing an available time slot. You can also use the 'Book Appointment' feature from your patient dashboard.",
  },
  {
    question: "Is my medical data secure?",
    answer: "Yes, absolutely. We use enterprise-grade encryption and follow strict HIPAA guidelines to ensure your medical data is completely secure and private.",
  },
  {
    question: "Can I get a refund if I cancel?",
    answer: "Yes, cancellations made 24 hours before the appointment are eligible for a full refund. Late cancellations may incur a small processing fee.",
  },
  {
    question: "How do video consultations work?",
    answer: "Video consultations are conducted through our secure platform. You'll receive a link before your appointment. Just click the link at the scheduled time to join the call.",
  },
  {
    question: "Can I change my doctor after booking?",
    answer: "Yes, you can reschedule or change your doctor up to 24 hours before the appointment through your dashboard.",
  },
];

const subjectOptions = [
  "General Inquiry",
  "Technical Support",
  "Appointment Issue",
  "Billing Question",
  "Feedback",
  "Partnership",
  "Media",
  "Other",
];

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.phone && !/^\+?[\d\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 dark:from-green-900 dark:to-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Have questions or need help? We're here for you. Reach out to us
            and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {info.title}
                  </h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm text-gray-600 dark:text-gray-400">
                      {detail}
                    </p>
                  ))}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border ${errors.name
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-200 dark:border-neutral-600 focus:ring-green-600"
                            } focus:outline-none focus:ring-2 text-sm`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border ${errors.email
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-200 dark:border-neutral-600 focus:ring-green-600"
                            } focus:outline-none focus:ring-2 text-sm`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border ${errors.phone
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-200 dark:border-neutral-600 focus:ring-green-600"
                            } focus:outline-none focus:ring-2 text-sm`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border ${errors.subject
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-200 dark:border-neutral-600 focus:ring-green-600"
                            } focus:outline-none focus:ring-2 text-sm`}
                        >
                          <option value="">Select a subject</option>
                          {subjectOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {errors.subject && (
                          <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        className={`w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-900 dark:text-gray-100 border ${errors.message
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 dark:border-neutral-600 focus:ring-green-600"
                          } focus:outline-none focus:ring-2 text-sm resize-none`}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-2">
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-100 dark:border-neutral-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenFaq(openFaq === index ? null : index)
                        }
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">
                          {item.question}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""
                            }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openFaq === index && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Still have questions?
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Our support team is ready to help you with any questions.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Phone className="w-4 h-4" />
                    <span>+91 1800-123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}