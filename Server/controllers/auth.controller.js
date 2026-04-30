import Patient from "../models/Patient.js";
import { generateToken } from "../utils/token.js";

export const patientSignup = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      const error = new Error("Patient with this email already exists");
      error.status = 409;
      throw error;
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
  } catch (error) {
    next(error);
  }
};

export const patientLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const isPasswordMatch = await patient.matchPassword(password);
    if (!isPasswordMatch) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const token = generateToken({
      id: patient._id,
      email: patient.email,
      role: "patient",
    });

    res.json({
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
  } catch (error) {
    next(error);
  }
};

export const getCurrentPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user.id).select("-password");

    if (!patient) {
      const error = new Error("Patient not found");
      error.status = 404;
      throw error;
    }

    res.json({
      success: true,
      user: patient,
    });
  } catch (error) {
    next(error);
  }
};
