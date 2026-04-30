// import Patient from "../models/Patient.js";
// import { generateToken } from "../utils/token.js";

// export const patientSignup = async (req, res, next) => {
//
//     const { email } = req.body;

//     const existingPatient = await Patient.findOne({ email });
//     if (existingPatient) {
//       const error = new Error("Patient with this email already exists");
//       error.status = 409;
//       throw error;
//     }

//     const patient = await Patient.create(req.body);

//     const token = generateToken({
//       id: patient._id,
//       email: patient.email,
//       role: "patient",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Patient registered successfully",
//       token,
//       user: {
//         id: patient._id,
//         firstName: patient.firstName,
//         lastName: patient.lastName,
//         email: patient.email,
//         role: "patient",
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const patientLogin = async (req, res, next) => {
//
//     const { email, password } = req.body;

//     const patient = await Patient.findOne({ email });
//     if (!patient) {
//       const error = new Error("Invalid email or password");
//       error.status = 401;
//       throw error;
//     }

//     const isPasswordMatch = await patient.matchPassword(password);
//     if (!isPasswordMatch) {
//       const error = new Error("Invalid email or password");
//       error.status = 401;
//       throw error;
//     }

//     const token = generateToken({
//       id: patient._id,
//       email: patient.email,
//       role: "patient",
//     });

//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: patient._id,
//         firstName: patient.firstName,
//         lastName: patient.lastName,
//         email: patient.email,
//         role: "patient",
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getCurrentPatient = async (req, res, next) => {
//
//     const patient = await Patient.findById(req.user.id).select("-password");

//     if (!patient) {
//       const error = new Error("Patient not found");
//       error.status = 404;
//       throw error;
//     }

//     res.json({
//       success: true,
//       user: patient,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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

export const getCurrentPatient = async (req, res) => {
  const patient = await Patient.findById(req.user.id).select("-password");

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  res.status(200).json({
    success: true,
    user: patient,
  });
};

export const doctorSignup = async (req, res) => {
  const { email, username } = req.body;

  const existingDoctor = await Doctor.findOne({
    $or: [{ email }, { username }],
  });

  if (existingDoctor) {
    const message =
      existingDoctor.email === email
        ? "Doctor with this email already exists"
        : "Username already taken";

    return res.status(409).json({
      success: false,
      message,
    });
  }

  const doctor = await Doctor.create(req.body);

  const token = generateToken({
    id: doctor._id,
    email: doctor.email,
    role: "doctor",
  });

  res.status(201).json({
    success: true,
    message: "Doctor registered successfully",
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

export const getCurrentDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.user.id).select("-password");

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  res.status(200).json({
    success: true,
    user: doctor,
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