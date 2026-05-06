import { useState } from "react";
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
} from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Patients", color: "text-blue-600 dark:text-blue-400" },
  { icon: Stethoscope, value: "500+", label: "Expert Doctors", color: "text-green-600 dark:text-green-400" },
  { icon: Activity, value: "50,000+", label: "Consultations", color: "text-purple-600 dark:text-purple-400" },
  { icon: Globe, value: "100+", label: "Cities Covered", color: "text-amber-600 dark:text-amber-400" },
];

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

const teamMembers = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Founder & CEO",
    specialty: "Cardiologist",
    bio: "With 20+ years of healthcare experience, Dr. Kumar envisioned a platform that makes quality healthcare accessible to everyone.",
    initials: "RK",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Chief Medical Officer",
    specialty: "Neurologist",
    bio: "Dr. Sharma leads our medical team, ensuring the highest standards of care and clinical excellence across all services.",
    initials: "PS",
  },
  {
    name: "Amit Patel",
    role: "CTO",
    specialty: "Technology Lead",
    bio: "Amit brings 15 years of tech expertise, building the robust platform that powers MediscanAI's innovative features.",
    initials: "AP",
  },
  {
    name: "Sarah Johnson",
    role: "Head of Patient Care",
    specialty: "Healthcare Management",
    bio: "Sarah ensures every patient receives personalized attention and a seamless healthcare experience.",
    initials: "SJ",
  },
];

const testimonials = [
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
];

export default function AboutUs() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 dark:from-green-900 dark:to-neutral-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
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
      <section className="py-12 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all"
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
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
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
                and healthcare providers.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
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
                everywhere.
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
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
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
            })}
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
              <div
                key={index}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {member.initials}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {member.role}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {member.specialty}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What People Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-700 rounded-xl p-6 shadow-sm"
              >
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
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-800 rounded-2xl p-8 sm:p-12 text-center">
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
                className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Sign Up as Patient
              </Link>
              <Link
                to="/doctor/signup"
                className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition font-medium"
              >
                Join as Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}