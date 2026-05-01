export const generateDummyDoctors = () => [
  {
    id: "doc1",
    firstName: "Raj",
    lastName: "Sharma",
    specialty: "Cardiology",
    avatar: null,
    rating: 4.8,
    consultationFee: 500,
  },
  {
    id: "doc2",
    firstName: "Priya",
    lastName: "Patel",
    specialty: "Dermatology",
    avatar: null,
    rating: 4.6,
    consultationFee: 600,
  },
  {
    id: "doc3",
    firstName: "Amit",
    lastName: "Kumar",
    specialty: "Neurology",
    avatar: null,
    rating: 4.9,
    consultationFee: 800,
  },
  {
    id: "doc4",
    firstName: "Sneha",
    lastName: "Reddy",
    specialty: "Pediatrics",
    avatar: null,
    rating: 4.7,
    consultationFee: 400,
  },
  {
    id: "doc5",
    firstName: "Vikram",
    lastName: "Singh",
    specialty: "Orthopedics",
    avatar: null,
    rating: 4.5,
    consultationFee: 700,
  },
  {
    id: "doc6",
    firstName: "Ananya",
    lastName: "Gupta",
    specialty: "Gynecology",
    avatar: null,
    rating: 4.8,
    consultationFee: 550,
  },
  {
    id: "doc7",
    firstName: "Rahul",
    lastName: "Joshi",
    specialty: "ENT",
    avatar: null,
    rating: 4.4,
    consultationFee: 450,
  },
  {
    id: "doc8",
    firstName: "Meera",
    lastName: "Nair",
    specialty: "General Medicine",
    avatar: null,
    rating: 4.6,
    consultationFee: 350,
  },
];

export const generateDummyAppointments = () => {
  const doctors = generateDummyDoctors();
  const appointmentTypes = ["video", "in-person", "phone"];
  const statuses = ["upcoming", "completed", "cancelled", "rescheduled"];
  const paymentStatuses = ["paid", "pending", "refunded", "failed"];

  const symptoms = [
    "Chest pain and shortness of breath",
    "Skin rash and itching",
    "Severe headache and dizziness",
    "Fever and cough",
    "Joint pain and swelling",
    "Abdominal pain",
    "Ear pain and hearing issues",
    "General weakness and fatigue",
    "Back pain",
    "Allergic reaction",
  ];

  const appointments = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const doctor = doctors[i % doctors.length];
    const daysOffset = Math.floor(Math.random() * 60) - 30;
    const appointmentDate = new Date(now);
    appointmentDate.setDate(appointmentDate.getDate() + daysOffset);

    const hours = Math.floor(Math.random() * 12) + 9;
    const minutes = Math.random() > 0.5 ? "00" : "30";
    const appointmentTime = `${hours.toString().padStart(2, "0")}:${minutes}`;

    let status;
    if (daysOffset < 0) {
      status = Math.random() > 0.2 ? "completed" : "cancelled";
    } else if (daysOffset === 0) {
      status =
        Math.random() > 0.3
          ? "upcoming"
          : Math.random() > 0.5
            ? "completed"
            : "cancelled";
    } else {
      status = Math.random() > 0.15 ? "upcoming" : "cancelled";
    }

    appointments.push({
      id: `appt_${i + 1}`,
      doctorId: doctor.id,
      doctor,
      appointmentDate: appointmentDate.toISOString(),
      appointmentTime,
      appointmentType:
        appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
      status,
      paymentStatus:
        paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      consultationFee: doctor.consultationFee,
      symptoms: symptoms[i % symptoms.length],
      notes: status === "completed" ? "Follow-up in 2 weeks" : "",
      cancellationReason:
        status === "cancelled" ? "Patient requested cancellation" : "",
    });
  }

  return appointments;
};
