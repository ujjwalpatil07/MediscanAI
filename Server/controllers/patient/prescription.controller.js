import httpStatus from "http-status";
import mongoose from "mongoose";
import Prescription from "../../models/Prescription.js";
import Appointment from "../../models/Appointment.js";
import Patient from "../../models/Patient.js";
import Doctor from "../../models/Doctor.js";

export const getMyPrescriptions = async (req, res) => {
  const patientId = req.user.id;

  const prescriptions = await Prescription.find({ patientId }).sort({
    createdAt: -1,
  });

  return res.status(httpStatus.OK).json({
    success: true,
    data: prescriptions,
  });
};

export const getPrescriptionByAppointment = async (req, res) => {
  const patientId = req.user.id;
  const { appointmentId } = req.params;

  const prescription = await Prescription.findOne({
    appointmentId,
    patientId,
  });

  if (!prescription) {
    return res.status(404).json({
      success: false,
      message: "Prescription not found",
    });
  }

  return res.status(httpStatus.OK).json({
    success: true,
    data: prescription,
  });
};

export const createPrescription = async (req, res) => {
  const { id: doctorId, role } = req.user;

  if (role !== "doctor") {
    return res.status(403).json({
      success: false,
      message: "Only doctors can create prescriptions",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { appointmentId, medicines, notes } = req.body;

    // ✅ Basic validation
    if (!appointmentId || !Array.isArray(medicines) || medicines.length === 0) {
      throw { status: 400, message: "Appointment and medicines are required" };
    }

    const appointment =
      await Appointment.findById(appointmentId).session(session);
    if (!appointment) {
      throw { status: 404, message: "Appointment not found" };
    }

    // ✅ Ownership check
    if (appointment.doctorId.toString() !== doctorId) {
      throw { status: 403, message: "Unauthorized" };
    }

    // ✅ Prevent duplicate (better approach)
    const existingPrescription = await Prescription.findOne({
      appointmentId,
    }).session(session);
    if (existingPrescription) {
      throw { status: 400, message: "Prescription already exists" };
    }

    const patient = await Patient.findById(appointment.patientId).session(
      session,
    );
    if (!patient) {
      throw { status: 404, message: "Patient not found" };
    }

    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) {
      throw { status: 404, message: "Doctor not found" };
    }

    // ✅ Optional: validate medicines structure
    for (const med of medicines) {
      if (!med.name || !med.dosage) {
        throw { status: 400, message: "Invalid medicine format" };
      }
    }

    // ✅ Create prescription
    const prescription = await Prescription.create(
      [
        {
          appointmentId,
          doctorId,
          patientId: appointment.patientId,

          patientSnapshot: {
            name: `${patient.firstName} ${patient.lastName}`,
            relation: appointment.patientDetails?.relation || "self",
            age: appointment.patientDetails?.age,
          },

          doctorSnapshot: {
            name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            specialty: doctor.specialty,
          },

          appointmentType: appointment.appointmentType,
          notes,
          medicines,
        },
      ],
      { session },
    );

    const createdPrescription = prescription[0];

    // ✅ Update related docs
    patient.prescriptions.push(createdPrescription._id);
    doctor.prescriptions.push(createdPrescription._id);
    appointment.prescriptionId = createdPrescription._id;

    await patient.save({ session });
    await doctor.save({ session });
    await appointment.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: createdPrescription,
    });
  } catch (err) {
    await session.abortTransaction();

    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  } finally {
    session.endSession();
  }
};

export const getPrescriptionById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const prescription = await Prescription.findById(id);

  if (!prescription) {
    return res.status(404).json({
      success: false,
      message: "Prescription not found",
    });
  }

  // ✅ Only owner can view
  if (prescription.patientId.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    data: prescription,
  });
};

export const deletePrescription = async (req, res) => {
  const { id: prescriptionId } = req.params;
  const { id: doctorId, role } = req.user;

  if (role !== "doctor") {
    return res.status(403).json({
      success: false,
      message: "Only doctors can delete prescription",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const prescription =
      await Prescription.findById(prescriptionId).session(session);

    if (!prescription) {
      const error = new Error("Prescription not found");
      error.status = 404;
      throw error;
    }

    if (prescription.doctorId.toString() !== doctorId) {
      const error = new Error("Unauthorized");
      error.status = 403;
      throw error;
    }

    const { patientId, appointmentId } = prescription;

    await Patient.findByIdAndUpdate(
      patientId,
      { $pull: { prescriptions: prescriptionId } },
      { session },
    );

    await Doctor.findByIdAndUpdate(
      doctorId,
      { $pull: { prescriptions: prescriptionId } },
      { session },
    );

    await Appointment.findByIdAndUpdate(
      appointmentId,
      { $unset: { prescriptionId: "" } },
      { session },
    );

    await Prescription.findByIdAndDelete(prescriptionId, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Prescription deleted successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};
