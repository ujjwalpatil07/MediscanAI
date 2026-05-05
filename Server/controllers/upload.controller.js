import Doctor from "../models/Doctor.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const doctor = await Doctor.findById(req.user.id);

    // Delete old profile photo from Cloudinary if exists
    if (doctor.profilePhotoPublicId) {
      try {
        await cloudinary.uploader.destroy(doctor.profilePhotoPublicId);
      } catch (deleteError) {
        console.log("Failed to delete old profile photo:", deleteError.message);
      }
    }

    // Upload new photo to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "mediscanai/profile-photos",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
      ],
      public_id: `doctor-${req.user.id}-${Date.now()}`,
    });

    // Update doctor with new photo
    doctor.profilePhoto = result.secure_url;
    doctor.profilePhotoPublicId = result.public_id;
    await doctor.save();

    const updatedDoctor = await Doctor.findById(req.user.id).select(
      "-password",
    );

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      user: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload profile photo",
    });
  }
};

// Delete profile photo
export const deleteProfilePhoto = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);

    if (!doctor.profilePhoto) {
      return res.status(400).json({
        success: false,
        message: "No profile photo to delete",
      });
    }

    // Delete from Cloudinary
    if (doctor.profilePhotoPublicId) {
      try {
        await cloudinary.uploader.destroy(doctor.profilePhotoPublicId);
      } catch (deleteError) {
        console.log("Failed to delete from Cloudinary:", deleteError.message);
      }
    }

    // Remove from database
    doctor.profilePhoto = null;
    doctor.profilePhotoPublicId = null;
    await doctor.save();

    const updatedDoctor = await Doctor.findById(req.user.id).select(
      "-password",
    );

    res.status(200).json({
      success: true,
      message: "Profile photo removed successfully",
      user: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete profile photo",
    });
  }
};
