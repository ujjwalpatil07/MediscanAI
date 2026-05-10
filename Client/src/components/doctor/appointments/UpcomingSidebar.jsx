import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Clock, Calendar, Video, Building2, Loader } from "lucide-react";

function UpcomingSidebar({ appointments, loading }) {
  const [showAll, setShowAll] = useState(false);
  const now = new Date();

  const todayAppointments = useMemo(() => {
    const todayStr = now.toLocaleDateString("en-CA");

    return (appointments || [])
      .filter((appt) => {
        if (!appt?.appointmentDate) return false;
        const apptDate = new Date(appt.appointmentDate);
        const apptDateStr = apptDate.toLocaleDateString("en-CA");
        return apptDateStr === todayStr && appt?.status === "upcoming";
      })
      .sort((a, b) => {
        const timeA = new Date(a?.appointmentTime || a?.appointmentDate);
        const timeB = new Date(b?.appointmentTime || b?.appointmentDate);
        return timeA - timeB;
      });
  }, [appointments]);

  const { future, past } = useMemo(() => {
    const f = [];
    const p = [];
    todayAppointments.forEach((appt) => {
      const apptTime = new Date(appt?.appointmentTime);
      if (isNaN(apptTime.getTime()) || apptTime <= now) {
        p.push(appt);
      } else {
        f.push(appt);
      }
    });
    return { future: f, past: p };
  }, [todayAppointments]);

  const display = showAll ? [...future, ...past] : [...future, ...past].slice(0, 5);

  const fmtRemaining = (timeStr) => {
    if (!timeStr) return "";
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return "";
    const diff = d - now;
    if (diff < 0) return "Ended";
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    if (mins > 0) return `${mins}m`;
    return "Now";
  };

  const fmtTime = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    const h = date.getHours() % 12 || 12;
    const m = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${h}:${m} ${ampm}`;
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || "?"}${lastName?.[0] || ""}`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5 sticky top-20">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today&apos;s Schedule</h3>
        </div>
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  const totalCount = future.length + past.length;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-5 sticky top-20">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today&apos;s Schedule</h3>
        {totalCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            {future.length} upcoming
          </span>
        )}
      </div>

      {totalCount > 0 ? (
        <>
          <div className="space-y-2">
            {display.map((appt) => {
              const apptTime = new Date(appt?.appointmentTime);
              const passed = isNaN(apptTime.getTime()) || apptTime <= now;
              return (
                <div
                  key={appt?._id}
                  className={`p-3 rounded-lg border transition-all duration-200 ${passed
                      ? "bg-gray-100/50 dark:bg-neutral-700/30 border-gray-200 dark:border-neutral-700 opacity-50"
                      : "bg-gray-50 dark:bg-neutral-700/50 border-gray-200 dark:border-neutral-700 hover:border-green-300 dark:hover:border-green-700"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${passed ? "bg-gray-200 dark:bg-neutral-600" : "bg-green-100 dark:bg-green-900/30"
                      }`}>
                      <span className={`text-xs font-semibold ${passed ? "text-gray-500" : "text-green-600 dark:text-green-400"
                        }`}>
                        {getInitials(appt?.patient?.firstName, appt?.patient?.lastName)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-semibold truncate pr-2 ${passed ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"
                          }`}>
                          {appt?.patient?.firstName || "?"} {appt?.patient?.lastName?.[0] || ""}.
                        </h4>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {appt?.appointmentType === "online" ? <Video className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className={passed ? "text-gray-400" : "text-green-600 dark:text-green-400 font-medium"}>
                          {passed ? "Ended" : fmtRemaining(appt?.appointmentTime)}
                        </span>
                        <span className="text-gray-400">• {fmtTime(appt?.appointmentTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {totalCount > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-3 text-center text-xs text-green-600 dark:text-green-400 hover:underline"
            >
              {showAll ? "Show less" : `View all ${totalCount}`}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No appointments today</p>
        </div>
      )}
    </div>
  );
}

UpcomingSidebar.propTypes = {
  appointments: PropTypes.array,
  loading: PropTypes.bool,
};

UpcomingSidebar.defaultProps = {
  appointments: [],
  loading: false,
};

export default UpcomingSidebar;