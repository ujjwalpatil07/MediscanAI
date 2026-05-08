import dotenv from "dotenv";

dotenv.config();

import Patient from "../../models/Patient.js";

import cloudinary from "../../config/cloudinary.js";

import { uploadBufferToCloudinary } from "../../utils/uploadToCloudinary.js";
import { sendEmailService } from "../../services/email.service.js";

const otpStore = new Map();

const allowedFields = new Set([
  "firstName",
  "lastName",
  "dob",
  "gender",
  "mobile",
  "address",
  "bloodGroup",
  "height",
  "weight",
  "allergies",
  "currentMedications",
  "emergencyContact",
]);

export const getProfile = async (req, res) => {
  const userId = req.user.id;

  const patient = await Patient.findById(userId)
    .select("-password")
    .populate("appointments", "appointmentDate status appointmentType")
    .populate("prescriptions", "date notes");

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: patient,
  });
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;

  const patient = await Patient.findById(userId);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  const updates = {};

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.has(key)) {
      try {
        if (
          key === "currentMedications" ||
          key === "emergencyContact" ||
          key === "allergies"
        ) {
          updates[key] = JSON.parse(req.body[key]);
        } else {
          updates[key] = req.body[key];
        }
      } catch {
        updates[key] = req.body[key];
      }
    }
  });

  // Trim strings
  Object.keys(updates).forEach((key) => {
    if (typeof updates[key] === "string") {
      updates[key] = updates[key].trim();
    }
  });

  // Handle DOB
  if (updates.dob) {
    updates.dob = new Date(updates.dob);

    if (isNaN(updates.dob.getTime())) {
      delete updates.dob;
    }
  }

  if (req.file) {
    // delete old image
    if (patient.profilePhotoPublicId) {
      await cloudinary.uploader.destroy(patient.profilePhotoPublicId);
    }

    const uploadedImage = await uploadBufferToCloudinary(
      req.file.buffer,
      "patients/profile-photos",
    );

    updates.profilePhoto = uploadedImage.secure_url;

    updates.profilePhotoPublicId = uploadedImage.public_id;
  }

  const updatedPatient = await Patient.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedPatient,
  });
};

export const updatePassword = async (req, res) => {
  const userId = req.user.id;

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  const patient = await Patient.findById(userId).select("+password");

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  const isMatch = await patient.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  const isSamePassword = await patient.matchPassword(newPassword);

  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: "New password cannot be same as current password",
    });
  }

  patient.password = newPassword;

  await patient.save();

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

export const sendVerificationOtp = async (req, res) => {
  const userId = req.user.id;

  const patient = await Patient.findById(userId);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  if (patient.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: "Email already verified",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(userId, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  const result = await sendEmailService(process.env.EMAILJS_OTP_TEMPLATE_ID, {
    email: patient.email,
    name: `${patient.firstName} ${patient.lastName}`,
    otp,
  });

  if (!result.success) {
    console.error("EMAIL FAILED:", result);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP email",
    });
  }

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
};

export const verifyEmail = async (req, res) => {
  const userId = req.user.id;

  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  const storedOtp = otpStore.get(userId);

  if (!storedOtp) {
    return res.status(400).json({
      success: false,
      message: "Please request OTP first",
    });
  }

  if (storedOtp.expiresAt < Date.now()) {
    otpStore.delete(userId);

    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  otpStore.delete(userId);

  const patient = await Patient.findByIdAndUpdate(
    userId,
    {
      isEmailVerified: true,
    },
    {
      new: true,
    },
  ).select("-password");

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: patient,
  });
};
