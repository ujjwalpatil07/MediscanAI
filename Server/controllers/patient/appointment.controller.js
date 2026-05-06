import httpStatus from "http-status";
import mongoose from "mongoose";

import Appointment from "../../models/Appointment.js";
import Doctor from "../../models/Doctor.js";
import Patient from "../../models/Patient.js";

export const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
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
      throw new Error("Missing required fields");
    }

    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) throw new Error("Doctor not found");

    const patient = await Patient.findById(patientId).session(session);
    if (!patient) throw new Error("Patient not found");

    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      startTime: new Date(startTime),
    }).session(session);

    if (existing) throw new Error("Slot already booked");

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

    patient.appointments.push(createdAppointment._id);
    doctor.appointments.push(createdAppointment._id);
    doctor.patients.addToSet(patientId);

    await patient.save({ session });
    await doctor.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: createdAppointment,
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
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
      displayTime: current.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      isBooked: false, // Default to false
    });

    current = next;
  }

  // Get all booked appointments (not just upcoming, but all for that date)
  const bookedAppointments = await Appointment.find({
    doctorId,
    appointmentDate: {
      $gte: new Date(`${date}T00:00:00`),
      $lte: new Date(`${date}T23:59:59`),
    },
    status: { $ne: "cancelled" }, // Only consider non-cancelled appointments
  });

  // Create a Set of booked start times for quick lookup
  const bookedTimes = new Set(
    bookedAppointments.map((b) => new Date(b.startTime).getTime()),
  );

  // Mark slots as booked
  const allSlotsWithStatus = slots.map((slot) => ({
    ...slot,
    isBooked: bookedTimes.has(new Date(slot.startTime).getTime()),
  }));

  return res.status(httpStatus.OK).json({
    success: true,
    slots: allSlotsWithStatus,
    summary: {
      totalSlots: allSlotsWithStatus.length,
      availableSlots: allSlotsWithStatus.filter((s) => !s.isBooked).length,
      bookedSlots: allSlotsWithStatus.filter((s) => s.isBooked).length,
    },
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
