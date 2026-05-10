import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Stethoscope,
  Shield,
  Users,
  Award,
  Globe,
  Clock,
  Video,
  MessageCircle,
  FileText,
  Brain,
  Activity,
  ChevronRight,
  Star,
  Quote,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Loader2
} from "lucide-react";
import { getLandingStats, getFeaturedDoctors, getLatestBlogs } from "../services/public.service";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
    {/* Hero Skeleton */}
    <div className="bg-gradient-to-br from-green-600 to-green-800 dark:from-green-900 dark:to-neutral-900 py-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/20 mx-auto mb-6"></div>
        <div className="h-12 w-64 bg-white/20 rounded-lg mx-auto mb-4"></div>
        <div className="h-6 w-96 bg-white/20 rounded-lg mx-auto"></div>
      </div>
    </div>

    {/* Stats Skeleton */}
    <div className="py-12 -mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-xl p-6 text-center animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-lg mx-auto mb-3"></div>
              <div className="h-8 w-20 bg-gray-200 dark:bg-neutral-700 rounded mx-auto mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Team Member Card Component
const TeamMemberCard = ({ member }) => (
  <div className="group bg-gray-100 dark:bg-neutral-800 rounded-xl shadow-sm p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
        {member.profilePhoto ? (
          <img
            src={member.profilePhoto}
            alt={member.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {member.initials || `${member.firstName?.[0]}${member.lastName?.[0]}`}
          </span>
        )}
      </div>
      {member.role === "Founder & CEO" && (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
          Founder
        </div>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {member.name}
    </h3>
    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
      {member.role}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      {member.specialty}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-3">
      {member.bio}
    </p>

    {/* Social Links */}
    <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <a href="#" className="p-1.5 bg-gray-100 dark:bg-neutral-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
        <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </a>
      <a href="#" className="p-1.5 bg-gray-100 dark:bg-neutral-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
        <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </a>
      <a href="#" className="p-1.5 bg-gray-100 dark:bg-neutral-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </a>
    </div>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
    <Quote className="w-8 h-8 text-green-200 dark:text-green-800 mb-4" />
    <div className="flex mb-3">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < testimonial.rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
            }`}
        />
      ))}
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic">
      "{testimonial.quote}"
    </p>
    <div className="flex items-center gap-3">
      {testimonial.avatar ? (
        <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {testimonial.name?.charAt(0)}
          </span>
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {testimonial.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {testimonial.role}
        </p>
      </div>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;
  return (
    <div className="group bg-gray-100 dark:bg-neutral-700/50 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {feature.description}
      </p>
    </div>
  );
};

// Main Component
export default function AboutUs() {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Static features data (these are UI elements, not dynamic)
  const features = [
    {
      icon: Video,
      title: "Video Consultations",
      description: "Connect with doctors face-to-face through secure, high-quality video calls from the comfort of your home.",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Stay connected with your healthcare provider through instant messaging for quick queries and follow-ups.",
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      icon: Brain,
      title: "AI Symptom Checker",
      description: "Get preliminary assessments of your symptoms using our advanced AI-powered diagnostic tool.",
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description: "Receive and manage your prescriptions digitally. Access your medical records anytime, anywhere.",
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
    {
      icon: Clock,
      title: "Easy Scheduling",
      description: "Book appointments at your convenience with our intuitive scheduling system and get timely reminders.",
      color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security and full HIPAA compliance.",
      color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    },
  ];

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);

        // Fetch stats from API
        const statsRes = await getLandingStats();
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        // Fetch featured doctors for team members
        const doctorsRes = await getFeaturedDoctors();
        if (doctorsRes.data.success) {
          const doctors = doctorsRes.data.data;

          // Transform top 4 doctors into team members
          const transformedTeam = doctors.slice(0, 4).map((doctor, index) => ({
            id: doctor._id,
            name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            role: index === 0 ? "Founder & CEO" : index === 1 ? "Chief Medical Officer" : index === 2 ? "Senior Specialist" : "Lead Consultant",
            specialty: doctor.specialty || "Medical Professional",
            bio: doctor.bio || `${doctor.firstName} ${doctor.lastName} is a renowned ${doctor.specialty || "medical professional"} with ${doctor.yearsOfExperience || 10}+ years of experience in healthcare.`,
            initials: `${doctor.firstName?.[0]}${doctor.lastName?.[0]}`,
            profilePhoto: doctor.profilePhoto,
            email: doctor.email,
            phone: doctor.phone
          }));
          setTeamMembers(transformedTeam);
        }

        // Fetch latest blogs for testimonials or use static testimonials
        const blogsRes = await getLatestBlogs();
        if (blogsRes.data.success && blogsRes.data.data.blogs) {
          const blogs = blogsRes.data.data.blogs;

          // Transform blogs into testimonials format or use static
          const dynamicTestimonials = blogs.slice(0, 3).map(blog => ({
            id: blog._id,
            name: blog.author || "Anonymous Patient",
            role: "Patient",
            quote: blog.excerpt || blog.content?.substring(0, 150) || "Great experience with MediscanAI! The platform is very user-friendly and the doctors are highly professional.",
            rating: 5,
            avatar: blog.authorAvatar || null
          }));

          // If we have blogs, use them, otherwise use static testimonials
          if (dynamicTestimonials.length >= 3) {
            setTestimonials(dynamicTestimonials);
          } else {
            // Static fallback testimonials
            setTestimonials([
              {
                name: "Rahul Mehta",
                role: "Patient",
                quote: "MediscanAI transformed how I manage my health. The video consultations saved me countless hospital visits. The doctors are very professional and caring.",
                rating: 5,
              },
              {
                name: "Dr. Ananya Gupta",
                role: "Cardiologist",
                quote: "As a doctor, this platform has streamlined my practice. I can now reach patients beyond geographical boundaries. The technology is top-notch!",
                rating: 5,
              },
              {
                name: "Priya Desai",
                role: "Patient",
                quote: "The AI symptom checker helped me identify a condition early. Truly a lifesaver! I'm grateful for this amazing platform.",
                rating: 5,
              },
            ]);
          }
        } else {
          // Static fallback testimonials
          setTestimonials([
            {
              name: "Rahul Mehta",
              role: "Patient",
              quote: "MediscanAI transformed how I manage my health. The video consultations saved me countless hospital visits. The doctors are very professional and caring.",
              rating: 5,
            },
            {
              name: "Dr. Ananya Gupta",
              role: "Cardiologist",
              quote: "As a doctor, this platform has streamlined my practice. I can now reach patients beyond geographical boundaries. The technology is top-notch!",
              rating: 5,
            },
            {
              name: "Priya Desai",
              role: "Patient",
              quote: "The AI symptom checker helped me identify a condition early. Truly a lifesaver! I'm grateful for this amazing platform.",
              rating: 5,
            },
          ]);
        }

      } catch (error) {
        console.error("Error fetching about page data:", error);
        // Set fallback testimonials on error
        setTestimonials([
          {
            name: "Rahul Mehta",
            role: "Patient",
            quote: "MediscanAI transformed how I manage my health. The video consultations saved me countless hospital visits.",
            rating: 5,
          },
          {
            name: "Dr. Ananya Gupta",
            role: "Cardiologist",
            quote: "As a doctor, this platform has streamlined my practice. I can now reach patients beyond geographical boundaries.",
            rating: 5,
          },
          {
            name: "Priya Desai",
            role: "Patient",
            quote: "The AI symptom checker helped me identify a condition early. Truly a lifesaver!",
            rating: 5,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Dynamic stats based on API data
  const displayStats = [
    {
      icon: Users,
      value: stats?.totalPatients ? `${stats.totalPatients}+` : "10,000+",
      label: "Happy Patients",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Stethoscope,
      value: stats?.totalDoctors ? `${stats.totalDoctors}+` : "500+",
      label: "Expert Doctors",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: Activity,
      value: stats?.totalAppointments ? `${stats.totalAppointments}+` : "50,000+",
      label: "Consultations",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Globe,
      value: stats?.citiesCovered ? `${stats.citiesCovered}+` : "100+",
      label: "Cities Covered",
      color: "text-amber-600 dark:text-amber-400"
    },
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 dark:from-green-900 dark:to-neutral-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6 animate-bounce">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <HeartPulse className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About <span className="text-green-200">MediscanAI</span>
          </h1>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            We're on a mission to revolutionize healthcare by making quality medical services
            accessible, affordable, and convenient for everyone through innovative technology.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-12 -mt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {displayStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-neutral-800 rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all hover:-translate-y-1 duration-300"
                >
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 dark:bg-neutral-800 rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                To democratize healthcare by providing accessible, affordable, and
                high-quality medical services through innovative technology. We strive
                to eliminate barriers to healthcare access and empower both patients
                and healthcare providers with seamless digital solutions.
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-neutral-800 rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                To become the world's most trusted healthcare platform, connecting
                millions of patients with expert doctors seamlessly. We envision a
                future where quality healthcare is just a click away for everyone,
                everywhere, regardless of geographical boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MediscanAI?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              We combine cutting-edge technology with compassionate care to deliver
              an unparalleled healthcare experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Passionate individuals dedicated to transforming healthcare through technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.id || index} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What People Say
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Real stories from our community of patients and doctors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id || index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-800 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Experience Better Healthcare?
              </h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Join thousands of patients and doctors who are already using MediscanAI
                for seamless healthcare delivery.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/patient/signup"
                  className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-all font-medium hover:shadow-lg transform hover:scale-105 duration-300"
                >
                  Sign Up as Patient
                </Link>
                <Link
                  to="/doctor/signup"
                  className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-medium hover:shadow-lg transform hover:scale-105 duration-300"
                >
                  Join as Doctor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}