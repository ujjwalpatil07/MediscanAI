import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Calendar,
  Users,
  ArrowRight,
  Search,
  Smile,
  Star,
  Quote,
  CheckCircle,
  Brain,
  Heart,
  Eye,
  Sparkles,
  Briefcase,
  ThumbsUp,
  ChevronRight,
  AlertCircle,
  Clock,
  Award,
  Shield,
  MapPin,
  DollarSign,
  Video,
  PhoneCall,
  Loader2
} from "lucide-react";
import landingHeroImg from "../../../Assets/landingHeroImg.png";
import FAQ from "../components/common/FAQ";
import { getFeaturedDoctors, getLatestBlogs, getLandingStats } from "../services/public.service";
import MedicalBackground from "../components/common/MedicalBackground";

// Reusable Components
const SectionHeader = ({ title, subtitle, badge }) => (
  <div className="text-center mb-12">
    {badge && (
      <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-4 py-2 text-sm mb-4">
        {badge.icon && <badge.icon className="w-4 h-4" />}
        <span>{badge.text}</span>
      </div>
    )}
    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
    {subtitle && <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const LoadingSkeleton = ({ type = "card", count = 4 }) => {
  if (type === "doctor") {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="h-56 bg-gray-200 dark:bg-gray-800"></div>
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded mt-4"></div>
            </div>
          </div>
        ))}
      </>
    );
  }
  if (type === "blog") {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        ))}
      </>
    );
  }
  return null;
};

const DoctorCard = ({ doctor }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-[#161616] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

      {/* Top Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            imgError || !doctor.profilePhoto
              ? `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=10b981&color=fff`
              : doctor.profilePhoto
          }
          alt={`${doctor.firstName} ${doctor.lastName}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={() => setImgError(true)}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-800 dark:text-white">
            {doctor.rating?.toFixed(1) || "4.8"}
          </span>
        </div>

        {/* Verified */}
        {doctor.isVerified && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}

        {/* Doctor Name */}
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>

          <p className="text-green-200 text-sm font-medium">
            {doctor.specialty || "General Physician"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="space-y-3 text-sm mb-5">

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>

            <span>{doctor.yearsOfExperience || 0}+ Years Experience</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>

            <span>{doctor.totalPatients?.toLocaleString() || 0}+ Patients</span>
          </div>

          {doctor.clinicCity && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>

              <span>{doctor.clinicCity}</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-5">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Consultation Fee
              </p>

              <h4 className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{doctor.consultationFee || 500}
              </h4>
            </div>

            <Link
              to={`/doctor/${doctor._id}`}
              className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-all shadow-lg hover:shadow-green-500/20 cursor-pointer z-10"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


const BlogCard = ({ blog }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white dark:bg-gray-900/50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 hover:-translate-y-1">
      <div className="h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={imgError || !blog.coverImage ? "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop" : blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
            {blog.category || "Health Tips"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{blog.excerpt || blog.content?.substring(0, 120)}</p>
        <Link to={`/blog/${blog._id || blog.slug}`} className="inline-flex items-center gap-1 text-green-600 dark:text-green-500 font-semibold hover:gap-2 transition-all text-sm">
          Read Article <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

const StatsCard = ({ value, label, icon: Icon }) => (
  <div className="text-center group">
    <div className="flex justify-center mb-3">
      <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-green-600 dark:text-green-500" />
      </div>
    </div>
    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-white">{label}</div>
  </div>
);

// Main Component
export default function LandingPage() {
  const [doctors, setDoctors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [symptomInput, setSymptomInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const services = [
    { title: "Book Appointment", description: "Schedule with top doctors instantly", icon: Calendar, link: "/doctors" },
    { title: "Video Consultation", description: "Consult from anywhere, anytime", icon: Video, link: "/doctors" },
    { title: "24/7 Support", description: "Emergency assistance always ready", icon: PhoneCall, link: "/support" }
  ];

  const treatments = [
    { title: "Cardiology", description: "Expert heart care with advanced diagnostics", icon: Heart, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
    { title: "Dental Care", description: "Complete oral healthcare for all ages", icon: Stethoscope, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
    { title: "Eye Care", description: "Advanced vision care and surgery", icon: Eye, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" }
  ];

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        const [doctorsRes, blogsRes, statsRes] = await Promise.all([
          getFeaturedDoctors(),
          getLatestBlogs(),
          getLandingStats()
        ]);

        if (doctorsRes.data.success) setDoctors(doctorsRes.data.data);
        if (blogsRes.data.success) setBlogs(blogsRes.data.data.blogs);
        if (statsRes.data.success) setStats(statsRes.data.data);
      } catch (error) {
        console.error("Error fetching landing data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const handleSymptomSubmit = async (e) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    setIsAnalyzing(true);
    // Simulate AI analysis - Replace with actual API call
    setTimeout(() => {
      setIsAnalyzing(false);
      alert(`🤖 AI Analysis Complete\n\nBased on your symptoms: ${symptomInput}\n\nPlease consult with our doctors for accurate diagnosis.`);
      setSymptomInput("");
    }, 1500);
  };

  const trustPoints = [
    "100% Secure Platform", "Certified Doctors", "24/7 Support",
    "Affordable Care", "Quick Booking", "Privacy Protected"
  ];

  const displayStats = useMemo(() => {
    if (!stats) return [
      { value: "99%", label: "Patient Satisfaction", icon: ThumbsUp },
      { value: "50K+", label: "Happy Patients", icon: Smile },
      { value: "200+", label: "Expert Doctors", icon: Briefcase },
      { value: "24/7", label: "Support Available", icon: Clock }
    ];
    return [
      { value: stats.successRate || "99%", label: "Success Rate", icon: Award },
      { value: `${stats.totalPatients?.toLocaleString() || "0"}+`, label: "Happy Patients", icon: Smile },
      { value: `${stats.totalDoctors?.toLocaleString() || "0"}+`, label: "Expert Doctors", icon: Briefcase },
      { value: `${stats.totalAppointments?.toLocaleString() || "0"}+`, label: "Appointments", icon: Calendar }
    ];
  }, [stats]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#101010ed] text-gray-900 dark:text-gray-100">
      
      <MedicalBackground />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30">
        <div className="absolute inset-0 bg-white/40 dark:bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Healthcare Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                Your Health, <span className="text-green-600 dark:text-green-500">Our Priority</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Connect with top doctors, get AI-powered health insights, and receive quality care from the comfort of your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/doctors" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Find Doctor <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/p/symptom-checker" className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 px-6 py-3 rounded-lg font-semibold transition-all">
                  AI Symptom Checker <Brain className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Certified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">50K+ Patients</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src={landingHeroImg} alt="Healthcare" className="w-full max-w-md mx-auto lg:max-w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader title="Our Services" subtitle="Comprehensive healthcare solutions tailored to your needs" />
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Link key={idx} to={service.link} className="group">
              <div className="bg-gray-100 shadow dark:bg-gray-900/50 rounded-xl p-6 text-center hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 hover:-translate-y-1">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-600 dark:bg-green-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          title="Meet Our Expert Doctors"
          subtitle="Choose from our team of certified medical professionals"
          badge={{ icon: Star, text: "Trusted by 50,000+ patients" }}
        />
        {loading ? (
          <LoadingSkeleton type="doctor" count={4} />
        ) : doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No doctors available at the moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-green-600 dark:text-green-500 font-semibold hover:gap-3 transition-all">
            View All Doctors <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* AI Symptom Checker */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/20">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="AI Symptom Checker"
            subtitle="Get instant health insights powered by artificial intelligence"
            badge={{ icon: Brain, text: "AI-Powered Analysis" }}
          />
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
            <form onSubmit={handleSymptomSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Describe your symptoms</label>
                <textarea
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="e.g., I've had a persistent headache for 3 days, along with mild fever and fatigue..."
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                  rows="4"
                  disabled={isAnalyzing}
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing || !symptomInput.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze Symptoms
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl flex items-start gap-3 border border-yellow-200 dark:border-yellow-800/30">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                This AI analysis is for informational purposes only. Always consult a qualified healthcare provider for medical advice and treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader title="Why Choose Us?" subtitle="Experience healthcare redefined with our patient-first approach" />
            <div className="grid grid-cols-2 gap-3 mb-6">
              {trustPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                </div>
              ))}
            </div>
            <Link to="/doctors" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              Book Appointment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {treatments.map((treatment, idx) => (
              <div key={idx} className="bg-gray-100 shadow dark:bg-gray-900/50 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
                <div className={`${treatment.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <treatment.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{treatment.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader title="What Our Patients Say" subtitle="Real experiences from people who trusted us" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 shadow dark:bg-gray-900/50 rounded-xl p-6 relative border border-gray-100 dark:border-gray-800">
            <Quote className="w-10 h-10 text-green-200 dark:text-green-900/50 absolute top-4 right-4" />
            <div className="flex items-center gap-4 mb-4">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" alt="Patient" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Sarah Johnson</h4>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 italic">"Excellent service! The online consultation saved me so much time. The doctor was very professional and caring."</p>
          </div>
          <div className="bg-gray-100 shadow dark:bg-gray-900/50 rounded-xl p-6 relative border border-gray-100 dark:border-gray-800">
            <Quote className="w-10 h-10 text-green-200 dark:text-green-900/50 absolute top-4 right-4" />
            <div className="flex items-center gap-4 mb-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" alt="Patient" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Michael Chen</h4>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 italic">"The platform is incredibly user-friendly. Found a great doctor within minutes. Highly recommended!"</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-teal-700 dark:from-green-900 dark:to-teal-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Start Your Health Journey?</h2>
          <p className="text-xl text-green-100 dark:text-gray-200 mb-8">Join thousands of happy patients who trust us with their health</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/doctors" className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105">
              Book Appointment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/p/symptom-checker" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
              Try AI Symptom Checker <Brain className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}