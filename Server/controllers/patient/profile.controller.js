import Patient from "../../models/Patient.js";

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

export const updateProfile = async (req, res) => {
  const userId = req.user.id;

  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.has(key)) {
      updates[key] = req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid fields provided for update",
    });
  }

  for (let key in updates) {
    if (typeof updates[key] === "string") {
      updates[key] = updates[key].trim();
    }
  }

  const updatedPatient = await Patient.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedPatient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

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
      message: "Both current and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  const patient = await Patient.findById(userId);

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
