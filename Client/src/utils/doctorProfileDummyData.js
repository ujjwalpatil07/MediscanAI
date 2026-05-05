export const generateDoctorProfile = () => ({
  personalInfo: {
    firstName: "Stephen",
    lastName: "Conley",
    email: "dr.stephen@mediscanai.com",
    phone: "(704) 555-0127",
    dob: "1975-08-22",
    gender: "Male",
    bloodGroup: "A+",
    address: "742 Evergreen Terrace, Medical District, Mumbai - 400053",
    bio: "Experienced cardiologist with over 15 years of practice in interventional cardiology and heart disease management. Dedicated to providing comprehensive cardiac care using the latest medical technologies and evidence-based treatments.",
  },
  professionalInfo: {
    specialty: "Cardiology",
    subSpecialty: "Interventional Cardiology",
    licenseNumber: "SSBB454D4HDER787",
    medicalDegree: "MD - Cardiology",
    university: "Harvard Medical School",
    graduationYear: "2005",
    experience: 15,
    consultationFee: 500,
    languages: ["English", "Hindi", "Marathi"],
    certifications: [
      "American Board of Cardiology",
      "Fellow of the American College of Cardiology (FACC)",
      "Advanced Cardiac Life Support (ACLS)",
    ],
    membership: [
      "Indian Medical Association (IMA)",
      "Cardiological Society of India (CSI)",
      "American Heart Association (AHA)",
    ],
  },
  clinicInfo: {
    name: "Conley Heart Care Center",
    address:
      "1st Floor, Lotus Medical Complex, Near City Care Hospital, MG Road, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    phone: "(704) 555-0128",
    email: "clinic@conleyheartcare.com",
    website: "www.conleyheartcare.com",
    timings: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: { start: "10:00", end: "14:00" },
      sunday: null,
    },
  },
  stats: {
    rating: 4.8,
    totalReviews: 146,
    totalPatients: 24500,
    totalAppointments: 53500,
    yearsOfExperience: 15,
    successRate: 98,
    publications: 24,
    awards: 8,
  },
  activity: {
    lastActive: "2025-01-15T10:30:00",
    joinedDate: "2023-06-15",
    verified: true,
    profileCompletion: 95,
  },
});

export const generateProfileReviews = () => [
  {
    _id: "rev001",
    patientName: "Ronald Richards",
    patientPhoto: null,
    rating: 5,
    date: "2025-01-08",
    review:
      "Thank you to Dr. Stephen Conley and staff for a great experience right from the start. Everyone made me feel comfortable and the outcome was great. If you need heart surgery check out Dr. Stephen. His expertise in interventional cardiology is remarkable.",
    appointmentType: "clinic-visit",
  },
  {
    _id: "rev002",
    patientName: "Annette Black",
    patientPhoto: null,
    rating: 5,
    date: "2025-01-05",
    review:
      "Dr. Stephen Conley did a great job on my procedure! After my treatment I was able to walk again without pain. Before his intervention I had 24 hour round the clock pain. Now, I can walk without any discomfort. Thank You Dr. Stephen Conley for giving me my life back.",
    appointmentType: "clinic-visit",
  },
  {
    _id: "rev003",
    patientName: "Angelina Jully",
    patientPhoto: null,
    rating: 4,
    date: "2024-12-28",
    review:
      "Excellent cardiologist, my husband and I have both had surgery and ongoing care from him over the years, the medical technology used is state of the art as well, continue to highly recommend. Very professional and caring approach.",
    appointmentType: "online",
  },
  {
    _id: "rev004",
    patientName: "Jane Cooper",
    patientPhoto: null,
    rating: 5,
    date: "2024-12-20",
    review:
      "Excellent cardiologist, my husband and I have both had surgery and ongoing care from him over the years, the medical technology used is state of the art as well. He explains everything clearly and makes you feel at ease.",
    appointmentType: "clinic-visit",
  },
  {
    _id: "rev005",
    patientName: "Robert Martinez",
    patientPhoto: null,
    rating: 5,
    date: "2024-12-15",
    review:
      "Dr. Conley is the best cardiologist I've ever visited. He took the time to understand my condition and explained all treatment options thoroughly. The staff is also very friendly and professional.",
    appointmentType: "online",
  },
  {
    _id: "rev006",
    patientName: "Sarah Williams",
    patientPhoto: null,
    rating: 4,
    date: "2024-12-10",
    review:
      "Very knowledgeable doctor who stays updated with the latest medical advancements. The clinic is well-equipped and the waiting time is minimal. Would recommend for any cardiac concerns.",
    appointmentType: "clinic-visit",
  },
];

export const generateRecentActivity = () => [
  {
    _id: "act001",
    action: "Appointment Completed",
    description: "Completed consultation with David Miller",
    timestamp: "2025-01-15T14:30:00",
    icon: "calendar",
  },
  {
    _id: "act002",
    action: "Prescription Created",
    description: "Issued new prescription for Bogdan Krivenchenko",
    timestamp: "2025-01-15T11:00:00",
    icon: "file-text",
  },
  {
    _id: "act003",
    action: "New Patient",
    description: "Sarah Johnson registered as new patient",
    timestamp: "2025-01-14T16:45:00",
    icon: "user-plus",
  },
  {
    _id: "act004",
    action: "Blog Published",
    description: 'Published "Understanding Heart Disease: Early Warning Signs"',
    timestamp: "2025-01-10T09:00:00",
    icon: "book-open",
  },
  {
    _id: "act005",
    action: "Profile Updated",
    description: "Updated clinic timings and consultation fees",
    timestamp: "2025-01-08T15:20:00",
    icon: "settings",
  },
];
