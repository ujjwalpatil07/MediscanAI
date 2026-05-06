import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import { generateToken } from "../utils/token.js";

export const patientSignup = async (req, res) => {
  const { email } = req.body;

  const existingPatient = await Patient.findOne({ email });
  if (existingPatient) {
    return res.status(409).json({
      success: false,
      message: "Patient with this email already exists",
    });
  }

  const patient = await Patient.create(req.body);

  const token = generateToken({
    id: patient._id,
    email: patient.email,
    role: "patient",
  });

  res.status(201).json({
    success: true,
    message: "Patient registered successfully",
    token,
    user: {
      id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      role: "patient",
    },
  });
};

export const patientLogin = async (req, res) => {
  const { email, password } = req.body;

  const patient = await Patient.findOne({ email });
  if (!patient) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordMatch = await patient.matchPassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken({
    id: patient._id,
    email: patient.email,
    role: "patient",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      role: "patient",
    },
  });
};

export const doctorSignup = async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    gender,
    dob,
    specialty,
    licenseNumber,
    yearsOfExperience,
    medicalDegree,
    consultationFee,
  } = req.body;


  // Check existing doctor
  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    return res.status(409).json({
      success: false,
      message: "A doctor with this email already exists",
    });
  }

  // Create doctor with required fields only
  const doctor = await Doctor.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    gender,
    dob: dob || undefined,
    specialty,
    licenseNumber,
    yearsOfExperience,
    medicalDegree,
    consultationFee,
    joinedDate: new Date(),
    lastActive: new Date(),
    profileCompletion: 40, // Basic profile completion
  });

  const token = generateToken({
    id: doctor._id,
    email: doctor.email,
    role: "doctor",
  });

  res.status(201).json({
    success: true,
    message: "Doctor registered successfully. Please complete your profile.",
    token,
    user: {
      id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      specialty: doctor.specialty,
      role: "doctor",
      profileCompletion: doctor.profileCompletion,
    },
  });
};

export const doctorLogin = async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordMatch = await doctor.matchPassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken({
    id: doctor._id,
    email: doctor.email,
    role: "doctor",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      role: "doctor",
    },
  });
};

export const getCurrentUser = async (req, res) => {
  const { id, role } = req.user;

  let user;
  if (role === "patient") {
    user = await Patient.findById(id).select("-password");
  } else if (role === "doctor") {
    user = await Doctor.findById(id).select("-password");
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user: {
      ...user.toObject(),
      role,
    },
  });
};

export const updateDoctorProfile = async (req, res) => {
  const doctorId = req.user.id;
  const updateData = req.body;

  // Fields that shouldn't be updated directly
  delete updateData._id;
  delete updateData.password;
  delete updateData.role;
  delete updateData.email;
  delete updateData.createdAt;
  delete updateData.updatedAt;
  delete updateData.__v;
  delete updateData.rating;
  delete updateData.totalReviews;
  delete updateData.totalPatients;
  delete updateData.totalAppointments;
  delete updateData.isVerified;
  delete updateData.joinedDate;
  delete updateData.appointments;
  delete updateData.patients;
  delete updateData.blogs;
  delete updateData.prescriptions;
  delete updateData.messages;
  delete updateData.notifications;
  delete updateData.transactions;
  delete updateData.withdrawals;
  delete updateData.reviews;
  delete updateData.recentActivity;
  delete updateData.paymentDetails;

  // Calculate profile completion
  let completed = 0;
  const total = 15;
  if (updateData.firstName && updateData.lastName) completed++;
  if (updateData.email || req.user.email) completed++;
  if (updateData.phone) completed++;
  if (updateData.specialty) completed++;
  if (updateData.licenseNumber) completed++;
  if (updateData.medicalDegree) completed++;
  if (updateData.yearsOfExperience) completed++;
  if (updateData.consultationFee) completed++;
  if (updateData.bio) completed++;
  if (updateData.clinicName) completed++;
  if (updateData.clinicAddress) completed++;
  if (updateData.availableDays?.length > 0) completed++;
  if (updateData.profilePhoto) completed++;
  if (updateData.degreeCertificate) completed++;
  if (updateData.idProof) completed++;

  updateData.profileCompletion = Math.round((completed / total) * 100);

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-password");

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: doctor,
  });
};