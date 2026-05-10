import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import Blog from "../models/Blog.js";
import Transaction from "../models/Transaction.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import httpStatus from "http-status";


// ✅ GET ALL DOCTORS (WITH FILTER SUPPORT)
export const getAllDoctors = async (req, res) => {
  const { specialty, city, sortBy } = req.query;

  const filter = { isActive: true, isVerified: true };

  if (specialty) filter.specialty = specialty;
  if (city) filter.clinicCity = city;

  let query = Doctor.find(filter).select(
    "firstName lastName specialty yearsOfExperience consultationFee rating profilePhoto clinicCity clinicState",
  );

  // 🔥 Sorting
  if (sortBy === "rating") query = query.sort({ rating: -1 });
  else if (sortBy === "experience")
    query = query.sort({ yearsOfExperience: -1 });
  else if (sortBy === "fees") query = query.sort({ consultationFee: 1 });

  const doctors = await query;

  if(!doctors) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false, 
      message: "Doctors not found"
    })
  }

  return res.status(httpStatus.OK).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
};

export const getDoctorById = async (req, res) => {
  const { id } = req.params;

  const doctor = await Doctor.findById(id).select(
    "firstName lastName specialty yearsOfExperience consultationFee rating profilePhoto bio clinicCity clinicState availableDays availableTimeSlots",
  );

  if (!doctor) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "Doctor not found",
    });
  }

  return res.status(httpStatus.OK).json({
    success: true,
    doctor,
  });
};


// ==================== DASHBOARD ====================

// Get doctor dashboard data
export const getDashboardData = async (req, res) => {
  const doctorId = req.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [
    totalPatients,
    todayAppointments,
    pendingRequests,
    monthlyRevenue,
    recentPatients,
    upcomingAppointments,
    unreadMessages,
  ] = await Promise.all([
    // Total unique patients
    Appointment.distinct("patientId", { doctorId }).then(
      (patients) => patients.length,
    ),

    // Today's appointments
    Appointment.countDocuments({
      doctorId,
      appointmentDate: { $gte: today, $lt: tomorrow },
    }),

    // Pending appointment requests
    Appointment.countDocuments({
      doctorId,
      status: "upcoming",
      appointmentDate: { $gte: today },
    }),

    // This month's revenue
    Appointment.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(doctorId),
          status: "completed",
          paymentStatus: "paid",
          updatedAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$consultationFee" },
        },
      },
    ]),

    // Recent patients (last 10)
    Appointment.find({ doctorId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("patientId", "firstName lastName gender email phone")
      .lean(),

    // Upcoming appointments (next 7 days)
    Appointment.find({
      doctorId,
      status: "upcoming",
      appointmentDate: {
        $gte: today,
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .populate("patientId", "firstName lastName gender")
      .lean(),

    // Unread messages count
    Message.countDocuments({
      receiverId: doctorId,
      receiverModel: "Doctor",
      read: false,
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalPatients,
        todayAppointments,
        pendingRequests,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        unreadMessages,
      },
      todayAppointments: todayAppointments,
      pendingRequests: pendingRequests,
      recentPatients: recentPatients.map((apt) => ({
        _id: apt.patientId?._id,
        name: `${apt.patientId?.firstName || ""} ${apt.patientId?.lastName || ""}`,
        gender: apt.patientId?.gender,
        lastVisit: apt.appointmentDate,
        status: apt.status,
      })),
      upcomingAppointments: upcomingAppointments.map((apt) => ({
        _id: apt._id,
        patientName: `${apt.patientId?.firstName || ""} ${apt.patientId?.lastName || ""}`,
        appointmentDate: apt.appointmentDate,
        appointmentTime: apt.appointmentTime,
        appointmentType: apt.appointmentType,
        status: apt.status,
      })),
    },
  });
};

// ==================== APPOINTMENTS ====================

// Get all appointments for doctor with filters
export const getAppointments = async (req, res) => {
  const doctorId = req.user.id;
  const {
    status,
    type,
    dateRange,
    search,
    sort = "newest",
    page = 1,
    limit = 10,
  } = req.query;

  const query = { doctorId };

  // Filter by status
  if (status && status !== "all") {
    query.status = status;
  }

  // Filter by appointment type
  if (type && type !== "all") {
    query.appointmentType = type;
  }

  // Filter by date range
  if (dateRange && dateRange !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRange) {
      case "today":
        query.appointmentDate = {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        };
        break;
      case "week":
        query.appointmentDate = {
          $gte: today,
          $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        };
        break;
      case "month":
        query.appointmentDate = {
          $gte: today,
          $lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        };
        break;
      case "past":
        query.appointmentDate = { $lt: today };
        break;
    }
  }

  // Search by patient name
  let patientIds = [];
  if (search) {
    const patients = await Patient.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ],
    }).select("_id");
    patientIds = patients.map((p) => p._id);
    query.patientId = { $in: patientIds };
  }

  // Sort options
  let sortOption = {};
  switch (sort) {
    case "oldest":
      sortOption = { appointmentDate: 1, appointmentTime: 1 };
      break;
    case "date-asc":
      sortOption = { appointmentDate: 1 };
      break;
    case "date-desc":
      sortOption = { appointmentDate: -1 };
      break;
    case "fee-high":
      sortOption = { consultationFee: -1 };
      break;
    case "fee-low":
      sortOption = { consultationFee: 1 };
      break;
    case "newest":
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [appointments, total, stats] = await Promise.all([
    Appointment.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("patientId")
      .lean(),

    Appointment.countDocuments(query),

    Appointment.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const statsObj = {
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  };
  stats.forEach((s) => {
    statsObj[s._id] = s.count;
    statsObj.total += s.count;
  });

  res.status(200).json({
    success: true,
    data: {
      appointments: appointments.map((apt) => ({
        _id: apt._id,
        patient: apt.patientId,
        appointmentDate: apt.appointmentDate,
        appointmentTime: apt.startTime,
        appointmentType: apt.appointmentType,
        status: apt.status,
        paymentStatus: apt.paymentStatus,
        consultationFee: apt.consultationFee,
        symptoms: apt.symptoms,
        diagnosis: apt.diagnosis,
        notes: apt.notes,
        createdAt: apt.createdAt,
      })),
      stats: statsObj,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
};

// Get single appointment details
export const getAppointmentById = async (req, res) => {
  const doctorId = req.user.id;
  const { appointmentId } = req.params;

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctorId,
  })
    .populate("patientId", "-password")
    .populate("prescription")
    .lean();

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
};

// Update appointment status (accept/reject/complete/cancel)
export const updateAppointmentStatus = async (req, res) => {
  const doctorId = req.user.id;
  const { appointmentId } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ["upcoming", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be upcoming, completed, or cancelled",
    });
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctorId,
  });

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  if (appointment.status === "cancelled") {
    return res.status(400).json({
      success: false,
      message: "Cannot update a cancelled appointment",
    });
  }

  appointment.status = status;
  if (notes) appointment.notes = notes;
  await appointment.save();

  res.status(200).json({
    success: true,
    message: `Appointment ${status} successfully`,
    data: appointment,
  });
};

// ==================== PATIENTS ====================

// Get all patients for doctor
export const getPatients = async (req, res) => {
  const doctorId = req.user.id;
  // const { search, sort = "newest", page = 1, limit = 10 } = req.query;

  // Get unique patient IDs from appointments
  const patientIds = await Appointment.distinct("patientId", { doctorId });

  const query = { _id: { $in: patientIds } };

  // Search by name, email, phone
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
    ];
  }

  let sortOption = {};
  switch (sort) {
    case "name-asc":
      sortOption = { firstName: 1 };
      break;
    case "name-desc":
      sortOption = { firstName: -1 };
      break;
    case "newest":
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [patients, total] = await Promise.all([
    Patient.find(query)
      .select("-password")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Patient.countDocuments(query),
  ]);

  // Get last visit and status for each patient
  const patientsWithDetails = await Promise.all(
    patients.map(async (patient) => {
      const lastAppointment = await Appointment.findOne({
        doctorId,
        patientId: patient._id,
      })
        .sort({ appointmentDate: -1 })
        .select("appointmentDate status")
        .lean();

      const totalAppointments = await Appointment.countDocuments({
        doctorId,
        patientId: patient._id,
      });

      return {
        ...patient,
        lastVisit: lastAppointment?.appointmentDate || null,
        lastStatus: lastAppointment?.status || null,
        totalAppointments,
      };
    }),
  );

  // Stats
  const inTreatment = patientsWithDetails.filter(
    (p) => p.lastStatus === "upcoming",
  ).length;
  const outPatient = patientsWithDetails.filter(
    (p) => p.lastStatus === "completed",
  ).length;

  res.status(200).json({
    success: true,
    data: {
      patients: patientsWithDetails,
      stats: {
        total,
        inTreatment,
        outPatient,
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
};

export const getDoctorPatients = async (req, res) => {
  const doctorId = req.user.id;

  // Find all unique patient IDs from this doctor's appointments
  const patientIds = await Appointment.distinct("patientId", {
    doctorId,
  }); 

  // Fetch patient details (without passwords)
  const patients = await Patient.find({
    _id: { $in: patientIds },
  })
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  // Get last appointment and total appointments for each patient
  const patientsWithDetails = await Promise.all(
    patients.map(async (patient) => {
      const lastAppointment = await Appointment.findOne({
        doctorId,
        patientId: patient._id,
      })
        .sort({ appointmentDate: -1 })
        .select("appointmentDate appointmentTime status appointmentType")
        .lean();

      const totalAppointments = await Appointment.countDocuments({
        doctorId,
        patientId: patient._id,
      });

      return {
        ...patient,
        lastVisit: lastAppointment?.appointmentDate || null,
        lastAppointmentTime: lastAppointment?.appointmentTime || null,
        lastStatus: lastAppointment?.status || null,
        lastAppointmentType: lastAppointment?.appointmentType || null,
        totalAppointments,
      };
    }),
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "Patients fetched successfully",
    data: {
      patients: patientsWithDetails,
      total: patientsWithDetails.length,
    },
  });
};

// Get single patient details with full history
export const getPatientById = async (req, res) => {
  const doctorId = req.user.id;
  const { patientId } = req.params;

  // Find the patient
  const patient = await Patient.findById(patientId).select("-password").lean();

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  // Check if this patient has any appointments with this doctor
  const hasAccess = await Appointment.exists({
    doctorId,
    patientId,
  });

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      message: "You don't have access to this patient's records",
    });
  }

  // Get all appointments with this doctor
  const appointments = await Appointment.find({
    doctorId,
    patientId,
  })
    .sort({ appointmentDate: -1 })
    .select(
      "appointmentDate appointmentTime appointmentType status paymentStatus symptoms consultationFee",
    )
    .lean();

  // Get prescriptions
  const prescriptions = await Prescription.find({
    doctorId,
    patientId,
  })
    .sort({ createdAt: -1 })
    .select("date medicines notes doctorSnapshot appointmentType")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      patient,
      appointments,
      prescriptions,
      stats: {
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(
          (a) => a.status === "completed",
        ).length,
        lastVisit: appointments[0]?.appointmentDate || null,
      },
    },
  });
};

// ==================== PRESCRIPTIONS ====================

// Get all prescriptions
export const getPrescriptions = async (req, res) => {
  const doctorId = req.user.id;
  const { patientId, page = 1, limit = 10 } = req.query;

  const query = { doctorId };
  if (patientId) {
    query.patientId = patientId;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [prescriptions, total] = await Promise.all([
    Prescription.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("patientId", "firstName lastName")
      .populate("appointmentId", "appointmentDate appointmentType")
      .lean(),
    Prescription.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      prescriptions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
};

// Create prescription
export const createPrescription = async (req, res) => {
  const doctorId = req.user.id;
  const {
    patientId,
    appointmentId,
    medications,
    diagnosis,
    notes,
    followUpDate,
  } = req.body;

  // Validate required fields
  if (!patientId || !medications || medications.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Patient ID and at least one medication are required",
    });
  }

  // Validate patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  // Validate medications array
  for (const med of medications) {
    if (!med.name || !med.dosage || !med.frequency || !med.duration) {
      return res.status(400).json({
        success: false,
        message:
          "Each medication must have name, dosage, frequency, and duration",
      });
    }
  }

  const prescription = await Prescription.create({
    doctorId,
    patientId,
    appointmentId: appointmentId || undefined,
    medications,
    diagnosis,
    notes,
    followUpDate: followUpDate || undefined,
  });

  // Update appointment with prescription reference
  if (appointmentId) {
    await Appointment.findByIdAndUpdate(appointmentId, {
      prescription: prescription._id,
    });
  }

  // Add prescription to patient's records
  await Patient.findByIdAndUpdate(patientId, {
    $push: { prescriptions: prescription._id },
  });

  res.status(201).json({
    success: true,
    message: "Prescription created successfully",
    data: prescription,
  });
};

// ==================== BLOGS ====================

// Get all blogs
export const getBlogs = async (req, res) => {
  const doctorId = req.user.id;
  const {
    status,
    category,
    search,
    sort = "newest",
    page = 1,
    limit = 10,
  } = req.query;

  const query = { authorId: doctorId };

  if (status && status !== "all") {
    query.status = status;
  }

  if (category && category !== "all") {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  let sortOption = {};
  switch (sort) {
    case "oldest":
      sortOption = { createdAt: 1 };
      break;
    case "popular":
      sortOption = { likes: -1 };
      break;
    case "views":
      sortOption = { views: -1 };
      break;
    case "newest":
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [blogs, total, categories, stats] = await Promise.all([
    Blog.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)).lean(),
    Blog.countDocuments(query),
    Blog.distinct("category", { authorId: doctorId }),
    Blog.aggregate([
      { $match: { authorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
          totalComments: { $sum: "$comments" },
        },
      },
    ]),
  ]);

  const blogStats = {
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  };

  stats.forEach((s) => {
    blogStats[s._id] = s.count;
    blogStats.total += s.count;
    blogStats.totalViews += s.totalViews;
    blogStats.totalLikes += s.totalLikes;
    blogStats.totalComments += s.totalComments;
  });

  res.status(200).json({
    success: true,
    data: {
      blogs,
      stats: blogStats,
      categories,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
};

// Create blog post
export const createBlog = async (req, res) => {
  const doctorId = req.user.id;
  const { title, content, excerpt, category, tags, status, coverImage } =
    req.body;

  if (!title || !content || !category) {
    return res.status(400).json({
      success: false,
      message: "Title, content, and category are required",
    });
  }

  const blog = await Blog.create({
    authorId: doctorId,
    authorName: `Dr. ${req.user.firstName} ${req.user.lastName}`,
    title,
    content,
    excerpt: excerpt || content.substring(0, 200),
    category,
    tags: tags || [],
    status: status || "draft",
    coverImage: coverImage || null,
  });

  // Add blog to doctor's records
  await Doctor.findByIdAndUpdate(doctorId, {
    $push: { blogs: blog._id },
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
};

// Update blog post
export const updateBlog = async (req, res) => {
  const doctorId = req.user.id;
  const { blogId } = req.params;
  const updates = req.body;

  const blog = await Blog.findOne({ _id: blogId, authorId: doctorId });

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found or unauthorized",
    });
  }

  // Don't allow changing author
  delete updates.authorId;
  delete updates.authorName;

  Object.assign(blog, updates);
  await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: blog,
  });
};

// Delete blog post
export const deleteBlog = async (req, res) => {
  const doctorId = req.user.id;
  const { blogId } = req.params;

  const blog = await Blog.findOneAndDelete({ _id: blogId, authorId: doctorId });

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found or unauthorized",
    });
  }

  // Remove blog from doctor's records
  await Doctor.findByIdAndUpdate(doctorId, {
    $pull: { blogs: blogId },
  });

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
};

// ==================== SETTINGS ====================

// Get doctor settings
export const getSettings = async (req, res) => {
  const doctorId = req.user.id;

  const doctor = await Doctor.findById(doctorId).select("settings").lean();

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  res.status(200).json({
    success: true,
    data: doctor.settings,
  });
};

// Update doctor settings
export const updateSettings = async (req, res) => {
  const doctorId = req.user.id;
  const { notifications, appointments, privacy, messages, patientManagement } =
    req.body;

  const updateData = {};

  if (notifications) updateData["settings.notifications"] = notifications;
  if (appointments) updateData["settings.appointments"] = appointments;
  if (privacy) updateData["settings.privacy"] = privacy;
  if (messages) updateData["settings.messages"] = messages;
  if (patientManagement)
    updateData["settings.patientManagement"] = patientManagement;

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $set: updateData },
    { new: true },
  ).select("settings");

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: doctor.settings,
  });
};

// ==================== PAYMENTS ====================

// Get payment dashboard
export const getPaymentDashboard = async (req, res) => {
  const doctorId = req.user.id;

  const doctor = await Doctor.findById(doctorId)
    .select("paymentDetails")
    .lean();

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [monthlyEarnings, pendingPayments] = await Promise.all([
    Appointment.aggregate([
      {
        $match: {
          doctorId: new mongoose.Types.ObjectId(doctorId),
          status: "completed",
          paymentStatus: "paid",
          updatedAt: { $gte: firstDayOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$consultationFee" },
        },
      },
    ]),
    Appointment.countDocuments({
      doctorId,
      status: "completed",
      paymentStatus: "pending",
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalEarnings: doctor.paymentDetails?.totalEarnings || 0,
      totalWithdrawn: doctor.paymentDetails?.totalWithdrawn || 0,
      pendingPayments,
      monthlyEarnings: monthlyEarnings[0]?.total || 0,
      bankAccounts: doctor.paymentDetails?.bankAccounts || [],
      upiId: doctor.paymentDetails?.upiId || null,
    },
  });
};

// Get transactions list
export const getTransactions = async (req, res) => {
  const doctorId = req.user.id;
  const { status, sort = "newest", page = 1, limit = 20 } = req.query;

  const query = { doctorId };

  if (status && status !== "all") {
    query.status = status;
  }

  let sortOption = {};
  switch (sort) {
    case "oldest":
      sortOption = { createdAt: 1 };
      break;
    case "amount-high":
      sortOption = { amount: -1 };
      break;
    case "amount-low":
      sortOption = { amount: 1 };
      break;
    case "newest":
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("appointmentId", "appointmentDate appointmentType")
      .lean(),
    Transaction.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
};

// Add bank account
export const addBankAccount = async (req, res) => {
  const doctorId = req.user.id;
  const { bankName, accountHolder, accountNumber, ifscCode } = req.body;

  if (!bankName || !accountHolder || !accountNumber || !ifscCode) {
    return res.status(400).json({
      success: false,
      message: "All bank details are required",
    });
  }

  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
    });
  }

  // If this is the first bank account, make it default
  const isDefault = !doctor.paymentDetails?.bankAccounts?.length;

  doctor.paymentDetails.bankAccounts.push({
    bankName,
    accountHolder,
    accountNumber: "****" + accountNumber.slice(-4),
    ifscCode,
    isDefault,
  });

  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Bank account added successfully",
    data: doctor.paymentDetails,
  });
};

// Request withdrawal
export const requestWithdrawal = async (req, res) => {
  const doctorId = req.user.id;
  const { amount, method } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Valid withdrawal amount is required",
    });
  }

  if (!["bank", "upi"].includes(method)) {
    return res.status(400).json({
      success: false,
      message: "Withdrawal method must be bank or upi",
    });
  }

  const doctor = await Doctor.findById(doctorId);

  const availableBalance =
    (doctor.paymentDetails?.totalEarnings || 0) -
    (doctor.paymentDetails?.totalWithdrawn || 0);

  if (amount > availableBalance) {
    return res.status(400).json({
      success: false,
      message: `Insufficient balance. Available: ₹${availableBalance}`,
    });
  }

  // Create withdrawal record
  const withdrawal = {
    amount,
    method,
    status: "processing",
    requestDate: new Date(),
    reference: `WDR${Date.now()}`,
  };

  doctor.withdrawals.push(withdrawal);
  doctor.paymentDetails.totalWithdrawn += amount;
  await doctor.save();

  res.status(200).json({
    success: true,
    message: "Withdrawal request submitted",
    data: withdrawal,
  });
};

// ==================== NOTIFICATIONS ====================

// Get notifications
export const getNotifications = async (req, res) => {
  const doctorId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ recipientId: doctorId, recipientModel: "Doctor" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Notification.countDocuments({
      recipientId: doctorId,
      recipientModel: "Doctor",
    }),
    Notification.countDocuments({
      recipientId: doctorId,
      recipientModel: "Doctor",
      read: false,
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    },
  });
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  const doctorId = req.user.id;
  const { notificationId } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipientId: doctorId },
    { $set: { read: true } },
    { new: true },
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req, res) => {
  const doctorId = req.user.id;

  await Notification.updateMany(
    { recipientId: doctorId, recipientModel: "Doctor", read: false },
    { $set: { read: true } },
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
};
