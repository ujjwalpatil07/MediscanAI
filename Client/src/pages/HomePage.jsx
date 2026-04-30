import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  Calendar, 
  ArrowRight, 
  Search, 
  Smile, 
  Star, 
  Quote, 
  CheckCircle,
  Heart,
  Eye,
  ChevronRight,
  Phone
} from "lucide-react";
import homeHeroImg from "../../../Assets/heroImg.png";
import FAQ from "../components/common/FAQ";

// Fallback images
const fallbackImages = {
  specialist1: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
  specialist2: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
  specialist3: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
  testimonial1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  testimonial2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  testimonial3: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  testimonial4: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  article1: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop",
  article2: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop",
  article3: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop",
};

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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

  const specialists = [
    { name: "Dr. Jim Carry", specialty: "Orthodontist", experience: "12+ years", rating: 4.9, image: fallbackImages.specialist1 },
    { name: "Dr. Jenny Wilson", specialty: "Periodontist", experience: "10+ years", rating: 4.8, image: fallbackImages.specialist2 },
    { name: "Dr. Robert Fox", specialty: "Cardiologist", experience: "15+ years", rating: 4.9, image: fallbackImages.specialist3 }
  ];

  const whyChoosePoints = [
    "Top quality dental team",
    "State of the art dental services",
    "Discount on all dental treatment",
    "Enrollment is quick and easy"
  ];

  const testimonials = [
    {
      name: "Thomas Daniel",
      role: "Patient",
      content: "Phosfluorescently synergize covalent outsourcing through functional strategic theme areas. Assertively scale strategic portals without distinctive relationships. Holisticly cultivate tactical e-services before fully researched sources.",
      rating: 5,
      image: fallbackImages.testimonial1
    },
    {
      name: "Alena Alex",
      role: "Patient",
      content: "Phosfluorescently synergize covalent outsourcing through functional strategic theme areas. Assertively scale strategic portals without distinctive relationships. Holisticly cultivate tactical e-services before fully researched sources.",
      rating: 5,
      image: fallbackImages.testimonial2
    },
    {
      name: "Thomas Edison",
      role: "Patient",
      content: "Phosfluorescently synergize covalent outsourcing through functional strategic theme areas. Assertively scale strategic portals without distinctive relationships. Holisticly cultivate tactical e-services before fully researched sources.",
      rating: 5,
      image: fallbackImages.testimonial3
    },
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "Phosfluorescently synergize covalent outsourcing through functional strategic theme areas. Assertively scale strategic portals without distinctive relationships. Holisticly cultivate tactical e-services before fully researched sources.",
      rating: 5,
      image: fallbackImages.testimonial4
    }
  ];

  const newsArticles = [
    {
      title: "Care of your Teeth",
      category: "Self Care",
      author: "Anita Jackson",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: fallbackImages.article1
    },
    {
      title: "Care of your Teeth",
      category: "Self Care",
      author: "Anita Jackson",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: fallbackImages.article2
    },
    {
      title: "Care of your Teeth",
      category: "Self Care",
      author: "Anita Jackson",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: fallbackImages.article3
    },
    {
      title: "Care of your Teeth",
      category: "Self Care",
      author: "Anita Jackson",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: fallbackImages.article1
    },
    {
      title: "Care of your Teeth",
      category: "Self Care",
      author: "Anita Jackson",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: fallbackImages.article2
    },
    {
      title: "Care of your Teeth",
      category: "Self Care",
      author: "Anita Jackson",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: fallbackImages.article3
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for doctor:", searchQuery);
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBookAppointment = () => {
    navigate("/doctors");
  };

  const handleEmergencyCall = () => {
    alert("Calling emergency hotline: 0900-78601");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gradient-to-r dark:from-[#0a1a2a] dark:to-[#0d2f2f] dark:text-gray-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-green-600 dark:text-green-400">Your Health, Our Priority</span>
                  <br />
                  Experience Care Like Never Before!
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                We use only the best quality materials on the market in order to provide the best products to our patients. 
                So don't worry about anything and book yourself.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleBookAppointment}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Book an appointment <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleEmergencyCall}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  <Phone className="w-5 h-5" />
                  24 x 7 Emergency: 0900-78601
                </button>
              </div>

              {/* Search Bar */}
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
            </div>

            {/* Right Image */}
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

      {/* Treatments Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

      {/* Meet Our Specialists Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Specialists</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We use only the best quality materials on the market in order to provide the best products to our patients.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {specialists.map((specialist, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center hover:shadow-xl transition-all">
                <img 
                  src={specialist.image} 
                  alt={specialist.name} 
                  className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-green-100 dark:border-green-900/30"
                />
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{specialist.name}</h3>
                <p className="text-green-600 dark:text-green-400 text-sm mb-2">{specialist.specialty}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{specialist.experience} experience</p>
                <div className="flex justify-center gap-0.5 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-teal-700 dark:from-[#0a2a2a] dark:to-[#063333] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Leave Your Worries At The Door And Enjoy A Healthier, More Precise Smile</h2>
          <p className="text-lg text-green-100 dark:text-gray-200 max-w-2xl mx-auto mb-6">
            We use only the best quality materials on the market in order to provide the best products to our patients. 
            So don't worry about anything and book yourself.
          </p>
          <button
            onClick={handleBookAppointment}
            className="inline-flex items-center gap-2 bg-white text-green-600 dark:bg-green-500 dark:text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
          >
            Book Appointment <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why Choose Smile For All Your Dental Treatments?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We use only the best quality materials on the market in order to provide the best products to our patients.
            </p>
            <div className="space-y-3">
              {whyChoosePoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleBookAppointment}
              className="inline-flex items-center gap-2 mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
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
              We use only the best quality materials on the market in order to provide the best products to our patients.
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

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Happy Clients</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We use only the best quality materials on the market in order to provide the best products to our patients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 relative">
                <Quote className="w-8 h-8 text-green-200 dark:text-green-900/30 absolute top-3 right-3" />
                <div className="flex items-center gap-3 mb-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{testimonial.name}</h4>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-4">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Articles Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">News & Articles</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We use only the best quality materials on the market in order to provide the best products to our patients.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.slice(0, 6).map((article, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-40 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded mb-2 inline-block">
                  {article.category}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{article.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{article.description}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">~{article.author}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold hover:gap-3 transition-all">
            Check out more <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Self Care Mini Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 mb-2">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {newsArticles.slice(0, 3).map((article, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden hover:shadow-xl transition-shadow flex">
              <div className="w-28 h-28 overflow-hidden flex-shrink-0">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded inline-block mb-1">
                  {article.category}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{article.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{article.description}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">~{article.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}