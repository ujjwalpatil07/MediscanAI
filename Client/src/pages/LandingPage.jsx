import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  MessageCircle, 
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
  AlertCircle
} from "lucide-react";
import landingHeroImg from "../../../Assets/landingHeroImg.png";
import FAQ from "../components/common/FAQ";

// Fallback images in case local imports fail
const fallbackImages = {
  doctor1: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
  doctor2: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  doctor3: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
  doctor4: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
  testimonial1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  testimonial2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
};

export default function LandingPage() {
  const [symptomInput, setSymptomInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const services = [
    {
      title: "Make an Appointment",
      description: "Select best time for you.",
      icon: Calendar,
      color: "bg-green-500",
      link: "/doctors"
    },
    {
      title: "Find the Best Doctor",
      description: "Find the best doctor in a minute.",
      icon: Users,
      color: "bg-green-500",
      link: "/doctors"
    },
    {
      title: "Ask Questions",
      description: "Ask questions any time.",
      icon: MessageCircle,
      color: "bg-green-500",
      link: "/ask"
    }
  ];

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
      title: "ECG (Electrocardiogram)",
      description: "A test that records the electrical activity of the heart to detect heart conditions like arrhythmias or heart attacks.",
      icon: Heart,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    }
  ];

  const doctors = [
    { name: "Dr. Aarti Sharma", specialty: "Cardiologist", experience: "12+ years", rating: 4.9, patients: "1,200+", image: fallbackImages.doctor1 },
    { name: "Dr. Kiran G", specialty: "Endodontist", experience: "8+ years", rating: 4.8, patients: "900+", image: fallbackImages.doctor2 },
    { name: "Dr. Priya Singh", specialty: "Periodontist", experience: "10+ years", rating: 4.9, patients: "1,100+", image: fallbackImages.doctor3 },
    { name: "Dr. Rajesh Kumar", specialty: "Pediatric Dentist", experience: "15+ years", rating: 4.7, patients: "1,500+", image: fallbackImages.doctor4 }
  ];

  const stats = [
    { value: "99%", label: "Positive Feedback", icon: ThumbsUp },
    { value: "2,300+", label: "Happy Patients", icon: Smile },
    { value: "43", label: "Professional Doctors", icon: Briefcase }
  ];

  const newsArticles = [
    {
      title: "The Future of Telemedicine",
      excerpt: "How AI is revolutionizing healthcare delivery and patient outcomes.",
      date: "March 15, 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop"
    },
    {
      title: "5 Tips for Better Dental Health",
      excerpt: "Expert advice on maintaining optimal oral hygiene and preventing common dental issues.",
      date: "March 10, 2024",
      category: "Dental Care",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=400&fit=crop"
    },
    {
      title: "Understanding Heart Health",
      excerpt: "Important signs and symptoms of heart conditions you shouldn't ignore.",
      date: "March 5, 2024",
      category: "Cardiology",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=400&fit=crop"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "Amazing experience! The AI symptom checker was incredibly helpful, and the doctor consultation was thorough and professional.",
      rating: 5,
      image: fallbackImages.testimonial1
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content: "Saved so much time with online consultations. The platform is user-friendly and the doctors are very knowledgeable.",
      rating: 5,
      image: fallbackImages.testimonial2
    }
  ];

  const trustPoints = [
    "Top Quality Dental Materials",
    "State-of-the-art Technology",
    "Discounts on All Dental Treatments",
    "Excellent Service",
    "24/7 Customer Support",
    "Certified Professionals",
    "Quick and Easy Booking",
    "Affordable Pricing"
  ];

  const handleSymptomSubmit = (e) => {
    e.preventDefault();
    if (symptomInput.trim()) {
      console.log("Symptom submitted:", symptomInput);
      alert(`🔍 Analyzing symptoms: ${symptomInput}\n\n🤖 AI Analysis in progress...\n\nThis feature will connect you with our AI health assistant for instant insights.`);
      setSymptomInput("");
    }
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      console.log("Phone number submitted:", phoneNumber);
      alert(`✅ Thank you! We'll contact you at ${phoneNumber} shortly to schedule your appointment.`);
      setPhoneNumber("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#0a1a2a] dark:to-[#0d2f2f] dark:text-gray-300">
      {/* Hero Section - Dark mode uses darker teal */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-teal-700 dark:from-[#0a2a2a] dark:to-[#063333] text-white">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Healthcare Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Find & Search Your Favourite Doctor
              </h1>
              <p className="text-lg sm:text-xl text-green-100 dark:text-gray-200 max-w-xl mx-auto lg:mx-0">
                AI-backed symptoms analysis + live video consultations from certified professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/doctors" className="inline-flex items-center justify-center gap-2 bg-white text-green-600 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                  Book Appointment <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/symptoms" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all">
                  AI Symptom Checker <Brain className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-[90%]">
              <img src={landingHeroImg} alt="LandingHeroImg" className="w-full max-w-md mx-auto lg:max-w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Features/Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Link key={idx} to={service.link} className="group">
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1 dark:hover:bg-gray-800/70">
                <div className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Treatments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Medical Treatments We Offer</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Comprehensive care with cutting-edge technology and expert specialists</p>
        </div>
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

      {/* AI Symptom Analysis */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full px-4 py-2 text-sm mb-4">
              <Brain className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Instant Symptom Analysis, Powered by AI</h2>
            <p className="text-gray-600 dark:text-gray-400">Describe your symptoms and get instant AI-powered health insights. Urgent cases are escalated to certified doctors.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl shadow-xl p-6 md:p-8">
            <form onSubmit={handleSymptomSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Describe your symptoms</label>
                <textarea
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="e.g., 'I have a severe headache and fever for 2 days'"
                  className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  rows="4"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Get AI Diagnosis
              </button>
            </form>
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400">Important: This AI-based symptom checker is intended for informational purposes only and should not be used as a substitute for medical advice, diagnosis, or treatment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Doctors */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Certified Doctors</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Browse through our team of experienced professionals available for consultation. Choose right doctor based on specialty, experience, and hospital affiliation.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group dark:hover:bg-gray-800/70">
              <div className="relative h-48 overflow-hidden">
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-900 dark:text-white">{doctor.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{doctor.name}</h3>
                <p className="text-green-600 dark:text-green-400 text-sm mb-1">{doctor.specialty}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{doctor.experience} experience • {doctor.patients} patients</p>
                <Link to={`/doctor/${idx}`} className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold hover:gap-2 transition-all">
                  View Profile <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section - Dark mode uses darker background */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-600 dark:bg-[#0a2a2a] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-center">
                  <stat.icon className="w-10 h-10" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold">{stat.value}</div>
                <div className="text-green-100 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why Choose Smile For All Your Dental Treatments?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We use only the best quality materials on the market in order to provide the best products to our patients. So don't worry about anything and book yourself.</p>
            <Link to="/doctors" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              Book an appointment <Calendar className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-green-50 dark:bg-gray-800/50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why Trust Us?</h3>
            <div className="grid grid-cols-2 gap-3">
              {trustPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                </div>
              ))}
            </div>
            <Link to="/pricing" className="inline-flex items-center gap-2 mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition-all text-sm">
              Check Price <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* News & Articles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">News & Articles</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Leave Your Worries At The Door And Enjoy A Healthier, More Precise Smile</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {newsArticles.map((article, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow dark:hover:bg-gray-800/70">
              <div className="h-48 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
                  <span className="bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">{article.category}</span>
                  <span className="text-gray-500 dark:text-gray-400">{article.date}</span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{article.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{article.excerpt}</p>
                <Link to="/blog" className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Happy Clients</h2>
            <p className="text-gray-600 dark:text-gray-400">What our patients say about their experience with us</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 relative">
                <Quote className="w-10 h-10 text-green-200 dark:text-green-900/30 absolute top-4 right-4" />
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Dark mode uses darker teal */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-teal-700 dark:from-[#0a2a2a] dark:to-[#063333] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-green-100 dark:text-gray-200 mb-8">Book your first appointment in minutes — no waiting rooms, no paperwork.</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <p className="text-lg mb-6">Our AI-powered system connects you with certified doctors faster than ever. Describe your symptoms, get instant insights, and consult professionals — all from the comfort of your home.</p>
            <Link to="/doctors" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105">
              BOOK APPOINTMENT NOW <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Newsletter Signup */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">We're Welcoming New Patients And Can't Wait To Meet You.</h3>
            <p className="mb-6">Enter your phone number to get started with your health journey.</p>
            <form onSubmit={handlePhoneSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your Phone Number"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 border border-gray-200 dark:border-gray-700"
                required
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}