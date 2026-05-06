import { useState, useContext } from "react";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  Edit,
  ThumbsUp,
  MessageCircle,
  Activity,
  FileText,
  UserPlus,
  Settings,
  Building2,
  BadgeCheck,
  Quote,
  IndianRupee,
  Share2,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import EditProfileModal from "../../components/doctor/profile/EditProfileModal";
import ProfilePhotoUpload from "../../components/doctor/profile/ProfilePhotoUpload";

const tabOptions = [
  { value: "overview", label: "Overview" },
  { value: "reviews", label: "Reviews" },
  { value: "activity", label: "Activity" },
];

export default function DoctorProfile() {
  const { loginUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const getActivityIcon = (iconName) => {
    switch (iconName) {
      case "calendar":
        return <Calendar className="w-5 h-5" />;
      case "file-text":
        return <FileText className="w-5 h-5" />;
      case "user-plus":
        return <UserPlus className="w-5 h-5" />;
      case "book-open":
        return <BookOpen className="w-5 h-5" />;
      case "settings":
        return <Settings className="w-5 h-5" />;
      case "message":
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getActivityColor = (iconName) => {
    switch (iconName) {
      case "calendar":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "file-text":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
      case "user-plus":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "book-open":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
      case "settings":
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
      case "message":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i * 0.5}
        className={`w-4 h-4 ${i < Math.round(rating)
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-300 dark:text-gray-600"
          }`}
      />
    ));
  };

  const getFullName = () => {
    return `Dr. ${loginUser?.firstName || ""} ${loginUser?.lastName || ""}`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                Professional Information
              </h3>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                <Edit className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Specialty</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {loginUser?.specialty || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Sub Specialty</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {loginUser?.subSpecialty || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Medical Degree</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {loginUser?.medicalDegree || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">License Number</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                  {loginUser?.licenseNumber || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">University</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {loginUser?.university || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Experience</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {loginUser?.yearsOfExperience || 0} Years
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Consultation Fee</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {loginUser?.consultationFee || 0}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Languages</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {loginUser?.languages?.length > 0
                    ? loginUser.languages.join(", ")
                    : "Not set"}
                </p>
              </div>
            </div>

            {loginUser?.certifications?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Certifications
                </h4>
                <div className="space-y-2">
                  {loginUser?.certifications.map((cert, index) => (
                    <div key={index * 0.5} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loginUser?.memberships?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Professional Memberships
                </h4>
                <div className="space-y-2">
                  {loginUser?.memberships.map((member, index) => (
                    <div key={index * 0.5} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {loginUser?.clinicName && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Clinic Information
                </h3>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition">
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {loginUser?.clinicName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {loginUser?.clinicAddress}
                      {loginUser?.clinicCity && `, ${loginUser?.clinicCity}`}
                      {loginUser?.clinicState && `, ${loginUser?.clinicState}`}
                      {loginUser?.clinicPincode && ` - ${loginUser?.clinicPincode}`}
                    </p>
                  </div>
                </div>
                {loginUser?.clinicPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{loginUser?.clinicPhone}</p>
                  </div>
                )}
                {loginUser?.clinicEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{loginUser?.clinicEmail}</p>
                  </div>
                )}
                {loginUser?.clinicWebsite && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-blue-600 dark:text-blue-400">{loginUser?.clinicWebsite}</p>
                  </div>
                )}
              </div>

              {loginUser?.clinicTimings && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Clinic Timings
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(loginUser?.clinicTimings).map(([day, time]) => (
                      <div key={day} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {day}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {time?.start && time?.end ? `${time.start} - ${time.end}` : "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {loginUser?.rating || 0} / 5
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{loginUser?.totalReviews || 0} reviews</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Patients</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {(loginUser?.totalPatients || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Appointments</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {(loginUser?.totalAppointments || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {loginUser?.successRate || 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Publications</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {loginUser?.publications || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                    <Award className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Awards</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {loginUser?.awards || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Patient Reviews
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">{renderStars(loginUser?.rating || 0)}</div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {loginUser?.rating || 0} out of 5 ({loginUser?.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        {loginUser?.reviews?.length > 0 ? (
          <div className="space-y-6">
            {loginUser?.reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="border-b border-gray-100 dark:border-neutral-700 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {review.patientName?.split(" ").map(n => n[0]).join("") || "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {review.patientName}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDate(review.date)}</span>
                          {review.appointmentType && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-700 capitalize">
                              {review.appointmentType}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <div className="mt-2 relative">
                      <Quote className="absolute -top-1 -left-1 w-5 h-5 text-gray-200 dark:text-neutral-700" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">
                        {review.review}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition">
                        <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                        <MessageCircle className="w-3.5 h-3.5" /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Patient reviews will appear here once you start receiving them
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h3>
        {loginUser?.recentActivity?.length > 0 ? (
          <div className="space-y-4">
            {loginUser?.recentActivity.map((act, index) => (
              <div key={act._id || index} className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${getActivityColor(act.icon)}`}>
                  {getActivityIcon(act.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {act.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {act.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatTimeAgo(act.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recent activity
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your recent actions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage your professional profile
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <ProfilePhotoUpload />


            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getFullName()}
                </h3>
                {loginUser?.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-green-600 dark:text-green-400 font-medium mt-1">
                {loginUser?.specialty || "Specialty not set"}
              </p>
              {loginUser?.bio ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                  {loginUser?.bio}
                </p>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 italic">
                  No bio added yet.{" "}
                  <button className="text-green-600 dark:text-green-400 hover:underline">
                    Add bio
                  </button>
                </p>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {renderStars(loginUser?.rating || 0)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                    {loginUser?.rating || 0}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({loginUser?.totalReviews || 0} reviews)
                  </span>
                </div>
                {loginUser?.clinicCity && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {loginUser?.clinicCity}{loginUser?.clinicState ? `, ${loginUser?.clinicState}` : ""}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  {loginUser?.profileCompletion || 0}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Profile Complete
              </p>
            </div>
          </div>
        </div>

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
          {activeTab === "reviews" && renderReviews()}
          {activeTab === "activity" && renderActivity()}
        </div>

        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      </div>
    </div>
  );
}