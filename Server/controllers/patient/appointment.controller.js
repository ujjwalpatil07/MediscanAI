import httpStatus from "http-status";
import mongoose from "mongoose";

import Appointment from "../../models/Appointment.js";
import Doctor from "../../models/Doctor.js";
import Patient from "../../models/Patient.js";

export const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const patientId = req.user.id;

  const {
    doctorId,
    appointmentDate,
    startTime,
    endTime,
    appointmentType,
    symptoms,
    patientDetails,
  } = req.body;

  if (!doctorId || !startTime || !endTime || !appointmentDate) {
    const error = new Error("Missing required fields");
    error.status = httpStatus.BAD_REQUEST;
    throw error;
  }

  const doctor = await Doctor.findById(doctorId).session(session);
  if (!doctor) {
    const error = new Error("Doctor not found");
    error.status = httpStatus.NOT_FOUND;
    throw error;
  }

  const patient = await Patient.findById(patientId).session(session);
  if (!patient) {
    const error = new Error("Patient not found");
    error.status = httpStatus.NOT_FOUND;
    throw error;
  }

  const existing = await Appointment.findOne({
    doctorId,
    startTime: new Date(startTime),
  }).session(session);

  if (existing) {
    const error = new Error("Slot already booked");
    error.status = httpStatus.BAD_REQUEST;
    throw error;
  }

  // ✅ Create Appointment
  const appointment = await Appointment.create(
    [
      {
        patientId,
        doctorId,
        appointmentDate,
        startTime,
        endTime,
        appointmentType,
        symptoms,
        patientDetails,

        consultationFee: doctor.consultationFee,

        doctorSnapshot: {
          name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
          specialty: doctor.specialty,
          image: doctor.profilePhoto,
          rating: doctor.rating,
        },
      },
    ],
    { session },
  );

  const createdAppointment = appointment[0];

  // ✅ Push into Patient
  patient.appointments.push(createdAppointment._id);

  // ✅ Push into Doctor
  doctor.appointments.push(createdAppointment._id);
  doctor.patients.addToSet(patientId); // avoid duplicates

  await patient.save({ session });
  await doctor.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(httpStatus.CREATED).json({
    success: true,
    message: "Appointment booked successfully",
    data: createdAppointment,
  });
};

export const getAvailableSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Doctor not found",
    });
  }

  const selectedDate = new Date(date);
  const day = selectedDate
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();

  if (!doctor.availableDays.includes(day)) {
    return res.status(httpStatus.OK).json({
      success: true,
      slots: [],
    });
  }

  const start = doctor.availableTimeSlots.start; // "09:00"
  const end = doctor.availableTimeSlots.end; // "17:00"

  const slotDuration = 30; // minutes

  const slots = [];
  let current = new Date(`${date}T${start}`);
  const endTime = new Date(`${date}T${end}`);

  while (current < endTime) {
    const next = new Date(current.getTime() + slotDuration * 60000);

    slots.push({
      startTime: new Date(current),
      endTime: new Date(next),
    });

    current = next;
  }

  // remove booked slots
  const booked = await Appointment.find({
    doctorId,
    appointmentDate: selectedDate,
  });

  const bookedTimes = new Set(
    booked.map((b) => new Date(b.startTime).getTime()),
  );

  const availableSlots = slots.filter(
    (slot) => !bookedTimes.has(new Date(slot.startTime).getTime()),
  );

  return res.status(httpStatus.OK).json({
    success: true,
    slots: availableSlots,
  });
};

export const getMyAppointments = async (req, res) => {
  const patientId = req.user.id;

  const appointments = await Appointment.find({ patientId })
    .populate("doctorId", "firstName lastName specialty profilePhoto")
    .sort({ appointmentDate: -1 });

  return res.status(httpStatus.OK).json({
    success: true,
    data: appointments,
  });
};

export const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id).populate(
    "doctorId",
    "firstName lastName specialty profilePhoto",
  );

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  return res.status(httpStatus.OK).json({
    success: true,
    data: appointment,
  });
};

export const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const patientId = req.user.id;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Appointment not found",
    });
  }

  if (appointment.patientId.toString() !== patientId) {
    return res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (appointment.status !== "upcoming") {
    return res.status(400).json({
      success: false,
      message: "Only upcoming appointments can be cancelled",
    });
  }

  appointment.status = "cancelled";
  appointment.cancelledBy = "patient";

  await appointment.save();

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Appointment cancelled",
  });
};

export const markAsPaid = async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "Appointment not found",
    });
  }

  appointment.payment.status = "paid";
  appointment.paymentStatus = "paid";
  appointment.payment.paidAt = new Date();

  await appointment.save();

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Payment successful",
  });
};
