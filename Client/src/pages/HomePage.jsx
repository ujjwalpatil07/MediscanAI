import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Calendar,
  ArrowRight,
  Search,
  Smile,
  Star,
  CheckCircle,
  Heart,
  Eye,
  ChevronRight,
  Phone,
  Brain,
  Sparkles,
  Briefcase,
  Shield,
  Users,
  Clock,
  Award,
  MapPin,
  Video,
  PhoneCall,
  Loader2,
  AlertCircle
} from "lucide-react";
import homeHeroImg from "../../../Assets/heroImg.png";
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
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

        <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-800 dark:text-white">
            {doctor.rating?.toFixed(1) || "4.8"}
          </span>
        </div>

        {doctor.isVerified && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}

        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <p className="text-green-200 text-sm font-medium">
            {doctor.specialty || "General Physician"}
          </p>
        </div>
      </div>

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
              <p className="text-xs text-gray-500 dark:text-gray-400">Consultation Fee</p>
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
      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-white/90">{label}</div>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [symptomInput, setSymptomInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const treatments = [
    {
      title: "Root Canal Treatment",
      description: "Root canal treatment (endodontics) is a dental procedure used to treat infection at the centre of a tooth.",
      icon: Stethoscope,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
    },
    {
      title: "Cataract Surgery",
      description: "A procedure to remove the cloudy lens of the eye (cataract) and replace it with a clear artificial.",
      icon: Eye,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      title: "Cardiology Care",
      description: "Expert heart care with advanced diagnostics and treatment options for all cardiac conditions.",
      icon: Heart,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    }
  ];

  const services = [
    { title: "Book Appointment", description: "Schedule with top doctors instantly", icon: Calendar, link: "/doctors" },
    { title: "Video Consultation", description: "Consult from anywhere, anytime", icon: Video, link: "/doctors" },
    { title: "24/7 Support", description: "Emergency assistance always ready", icon: PhoneCall, link: "/support" }
  ];

  const whyChoosePoints = [
    "Top quality medical team",
    "State of the art facilities",
    "Discount on all treatments",
    "Enrollment is quick and easy",
    "100% Secure Platform",
    "Affordable Care"
  ];

  const trustPoints = [
    "100% Secure Platform", "Certified Doctors", "24/7 Support",
    "Affordable Care", "Quick Booking", "Privacy Protected"
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
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
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const displayStats = useMemo(() => {
    if (!stats) return [
      { value: "99%", label: "Patient Satisfaction", icon: Smile },
      { value: "50K+", label: "Happy Patients", icon: Users },
      { value: "200+", label: "Expert Doctors", icon: Briefcase },
      { value: "24/7", label: "Support Available", icon: Clock }
    ];
    return [
      { value: stats.successRate || "99%", label: "Success Rate", icon: Award },
      { value: `${stats.totalPatients?.toLocaleString() || "0"}+`, label: "Happy Patients", icon: Users },
      { value: `${stats.totalDoctors?.toLocaleString() || "0"}+`, label: "Expert Doctors", icon: Briefcase },
      { value: `${stats.totalAppointments?.toLocaleString() || "0"}+`, label: "Appointments", icon: Calendar }
    ];
  }, [stats]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBookAppointment = () => {
    navigate("/doctors");
  };

  const handleEmergencyCall = () => {
    alert("Calling emergency hotline: 0900-78601");
  };

  const handleSymptomSubmit = async (e) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert(`🤖 AI Analysis Complete\n\nBased on your symptoms: ${symptomInput}\n\nPlease consult with our doctors for accurate diagnosis.`);
      setSymptomInput("");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#101010ed] text-gray-900 dark:text-gray-100">
      <MedicalBackground />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30">
        <div className="absolute inset-0 bg-white/40 dark:bg-black/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Healthcare Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-green-600 dark:text-green-400">Your Health, Our Priority</span>
                <br />
                Experience Care Like Never Before!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Connect with top doctors, get AI-powered health insights, and receive quality care from the comfort of your home.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleBookAppointment}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Book an appointment <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleEmergencyCall}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  24 x 7 Emergency: 0900-78601
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative mt-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor here..."
                  className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>

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

            <div className="flex justify-center w-[80%] mx-auto">
              <img
                src={homeHeroImg}
                alt="Healthcare"
                className="w-full max-w-md lg:max-w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-900 dark:to-teal-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
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

      {/* Featured Doctors Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Meet Our Specialist Doctors"
            subtitle="Choose from our team of certified medical professionals"
            badge={{ icon: Star, text: "Trusted by thousands of patients" }}
          />
          {loading ? (
            <LoadingSkeleton type="doctor" count={4} />
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No doctors available at the moment.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.slice(0, 4).map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/doctors" className="inline-flex items-center gap-2 text-green-600 dark:text-green-500 font-semibold hover:gap-3 transition-all">
              View All Doctors <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Treatments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader title="Our Treatments" subtitle="Advanced medical treatments with care you can trust" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((treatment, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group dark:hover:bg-gray-800/70">
              <div className="p-6">
                <div className={`${treatment.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <treatment.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{treatment.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{treatment.description}</p>
                <Link to="/treatments" className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold hover:gap-2 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
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

      {/* Why Choose Us Section */}
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
            <button
              onClick={handleBookAppointment}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Book Appointment <Calendar className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-green-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Smile className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">We're Welcoming New Patients And Can't Wait To Meet You.</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of happy patients who trust us with their health journey.
            </p>
            <button
              onClick={handleEmergencyCall}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Phone className="w-4 h-4" />
              Contact Us Now
            </button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="News & Articles" subtitle="Stay informed with latest health tips and medical insights" />
          {loading ? (
            <LoadingSkeleton type="blog" count={3} />
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-green-600 dark:text-green-500 font-semibold hover:gap-3 transition-all">
              Check out more articles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-teal-700 dark:from-green-900 dark:to-teal-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Leave Your Worries At The Door And Enjoy A Healthier Life</h2>
          <p className="text-xl text-green-100 dark:text-gray-200 mb-8">
            Join thousands of happy patients who trust us with their health
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookAppointment}
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Book Appointment <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/p/symptom-checker"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Try AI Symptom Checker <Brain className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}