import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";

export const getLandingStats = async (req, res) => {
  const totalDoctors = await Doctor.countDocuments({
    isVerified: true,
  });

  const totalPatients = await Patient.countDocuments();

  const totalAppointments = await Appointment.countDocuments();

  return res.status(200).json({
    success: true,
    data: {
      totalDoctors,
      totalPatients,
      totalAppointments,
      satisfaction: 99,
    },
  });
};