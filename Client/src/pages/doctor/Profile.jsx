import { Star, MapPin, Phone, Mail, Award } from "lucide-react";
import { doctorInfo, generateReviews } from "../../utils/doctorDummyData";

export default function DoctorProfile() {
  const reviews = generateReviews();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        My Profile
      </h2>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {doctorInfo.firstName[0]}
              {doctorInfo.lastName[0]}
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Dr. {doctorInfo.firstName} {doctorInfo.lastName}
            </h3>
            <p className="text-green-600 dark:text-green-400 font-medium">
              {doctorInfo.specialty}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {doctorInfo.rating} ({doctorInfo.totalReviews} Rates)
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                {doctorInfo.phone}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                {doctorInfo.email}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {doctorInfo.trustPercentage}%
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Trust
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Reviews
        </h3>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 dark:border-neutral-700 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {review.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {review.profession} | {review.date}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {review.review}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}