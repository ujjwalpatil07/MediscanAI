import MedicalRecord from "../../models/MedicalRecord.js";
import cloudinary from "../../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../../utils/uploadToCloudinary.js";

// Upload medical record
export const uploadMedicalRecord = async (req, res) => {
  const patientId = req.user.id;

  const { title, category, date, description, doctorName, hospitalName } =
    req.body;

  // Validation
  if (!title || !category || !date || !req.file) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: title, category, date, and file are required",
    });
  }

  // File validation
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type. Only PDF, JPEG, PNG are allowed.",
    });
  }

  // Upload file
  const folder =
    req.file.mimetype === "application/pdf"
      ? "medical-records/pdfs"
      : "medical-records/images";

  const uploadedFile = await uploadBufferToCloudinary(req.file.buffer, folder);

  const fileExtension =
    req.file.mimetype === "application/pdf" ? "pdf" : "image";

  // Create record
  const medicalRecord = await MedicalRecord.create({
    patientId,
    title,
    category,
    date: new Date(date),
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileType: fileExtension,
    fileMimeType: req.file.mimetype,
    fileUrl: uploadedFile.secure_url,
    filePublicId: uploadedFile.public_id,
    description: description || "",
    doctorName: doctorName || "",
    hospitalName: hospitalName || "",
  });

  return res.status(201).json({
    success: true,
    message: "Medical record uploaded successfully",
    data: medicalRecord,
  });
};

// Get all medical records
export const getMyMedicalRecords = async (req, res) => {
  const patientId = req.user.id;

  const { category, search, page = 1, limit = 12 } = req.query;

  const query = { patientId };

  // Category filter
  if (category && category !== "all") {
    query.category = category;
  }

  // Search
  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        fileName: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [records, total] = await Promise.all([
    MedicalRecord.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),

    MedicalRecord.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    data: records,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
};

// Delete medical record
export const deleteMedicalRecord = async (req, res) => {
  const patientId = req.user.id;

  const { id } = req.params;

  const record = await MedicalRecord.findOne({
    _id: id,
    patientId,
  });

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Medical record not found",
    });
  }

  // Delete from cloudinary
  if (record.filePublicId) {
    await cloudinary.uploader.destroy(record.filePublicId);
  }

  // Delete from DB
  await MedicalRecord.deleteOne({
    _id: id,
    patientId,
  });

  return res.status(200).json({
    success: true,
    message: "Medical record deleted successfully",
  });
};

// Get single medical record
export const getMedicalRecordById = async (req, res) => {
  const patientId = req.user.id;

  const { id } = req.params;

  const record = await MedicalRecord.findOne({
    _id: id,
    patientId,
  });

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Medical record not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: record,
  });
};

// Update medical record
export const updateMedicalRecord = async (req, res) => {
  const patientId = req.user.id;

  const { id } = req.params;

  const { title, category, date, description, doctorName, hospitalName } =
    req.body;

  const record = await MedicalRecord.findOne({
    _id: id,
    patientId,
  });

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Medical record not found",
    });
  }

  // Update fields
  if (title) record.title = title;
  if (category) record.category = category;
  if (date) record.date = new Date(date);

  if (description !== undefined) {
    record.description = description;
  }

  if (doctorName !== undefined) {
    record.doctorName = doctorName;
  }

  if (hospitalName !== undefined) {
    record.hospitalName = hospitalName;
  }

  await record.save();

  return res.status(200).json({
    success: true,
    message: "Medical record updated successfully",
    data: record,
  });
};
