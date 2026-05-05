export const validateDoctorSignup = (req, res, next) => {
  const errors = [];
  const {
    email,
    password,
    firstName,
    lastName,
    specialty,
    licenseNumber,
    yearsOfExperience,
    medicalDegree,
    consultationFee,
    phone,
  } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!firstName || firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters");
  }

  if (!lastName || lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters");
  }

  if (phone && !/^\+?[\d\s-]{10,15}$/.test(phone)) {
    errors.push("Invalid phone number format");
  }

  if (!specialty) {
    errors.push("Specialty is required");
  }

  if (!licenseNumber || licenseNumber.trim().length < 5) {
    errors.push("Valid license number is required");
  }

  if (
    yearsOfExperience === undefined ||
    yearsOfExperience === "" ||
    Number(yearsOfExperience) < 0 ||
    Number(yearsOfExperience) > 50
  ) {
    errors.push("Years of experience must be between 0 and 50");
  }

  if (!medicalDegree) {
    errors.push("Medical degree is required");
  }

  if (!consultationFee || Number(consultationFee) < 0) {
    errors.push("Valid consultation fee is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};
