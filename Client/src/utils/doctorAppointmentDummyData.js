export const generateAppointmentStats = () => ({
  total: 156,
  upcoming: 48,
  completed: 89,
  cancelled: 19,
  todayAppointments: 8,
  pendingRequests: 12,
});

export const generateDoctorAppointments = () => {
  const patients = [
    {
      id: "pat1",
      firstName: "Bogdan",
      lastName: "Krivenchenko",
      age: 45,
      gender: "Male",
      photo: null,
      email: "bogdan@example.com",
      phone: "+1 234 567 890",
    },
    {
      id: "pat2",
      firstName: "Jenny",
      lastName: "Wilson",
      age: 32,
      gender: "Female",
      photo: null,
      email: "jenny@example.com",
      phone: "+1 234 567 891",
    },
    {
      id: "pat3",
      firstName: "Dianne",
      lastName: "Russel",
      age: 28,
      gender: "Female",
      photo: null,
      email: "dianne@example.com",
      phone: "+1 234 567 892",
    },
    {
      id: "pat4",
      firstName: "Annette",
      lastName: "Black",
      age: 55,
      gender: "Female",
      photo: null,
      email: "annette@example.com",
      phone: "+1 234 567 893",
    },
    {
      id: "pat5",
      firstName: "Angelina",
      lastName: "Jully",
      age: 38,
      gender: "Female",
      photo: null,
      email: "angelina@example.com",
      phone: "+1 234 567 894",
    },
    {
      id: "pat6",
      firstName: "Esther",
      lastName: "Howard",
      age: 42,
      gender: "Male",
      photo: null,
      email: "esther@example.com",
      phone: "+1 234 567 895",
    },
    {
      id: "pat7",
      firstName: "Robert",
      lastName: "Fox",
      age: 50,
      gender: "Male",
      photo: null,
      email: "robert@example.com",
      phone: "+1 234 567 896",
    },
    {
      id: "pat8",
      firstName: "John",
      lastName: "Smith",
      age: 35,
      gender: "Male",
      photo: null,
      email: "john@example.com",
      phone: "+1 234 567 897",
    },
    {
      id: "pat9",
      firstName: "Sarah",
      lastName: "Johnson",
      age: 29,
      gender: "Female",
      photo: null,
      email: "sarah@example.com",
      phone: "+1 234 567 898",
    },
    {
      id: "pat10",
      firstName: "Michael",
      lastName: "Brown",
      age: 60,
      gender: "Male",
      photo: null,
      email: "michael@example.com",
      phone: "+1 234 567 899",
    },
    {
      id: "pat11",
      firstName: "Emily",
      lastName: "Davis",
      age: 41,
      gender: "Female",
      photo: null,
      email: "emily@example.com",
      phone: "+1 234 567 900",
    },
    {
      id: "pat12",
      firstName: "David",
      lastName: "Miller",
      age: 48,
      gender: "Male",
      photo: null,
      email: "david@example.com",
      phone: "+1 234 567 901",
    },
  ];

  const symptoms = [
    "Chest pain and shortness of breath during physical activity",
    "Irregular heartbeat and palpitations",
    "High blood pressure and dizziness",
    "Swelling in legs and ankles",
    "Fatigue and weakness",
    "Rapid weight gain due to fluid retention",
    "Persistent cough with pink mucus",
    "Difficulty breathing when lying down",
    "Numbness in arms and legs",
    "Frequent headaches and blurred vision",
    "Heart murmur detected during routine checkup",
    "Family history of heart disease - preventive checkup",
  ];

  const today = new Date();
  const appointments = [];

  for (let i = 0; i < 20; i++) {
    const patient = patients[i % patients.length];
    const daysOffset = Math.floor(Math.random() * 40) - 10;
    const appointmentDate = new Date(today);
    appointmentDate.setDate(appointmentDate.getDate() + daysOffset);

    const hours = Math.floor(Math.random() * 10) + 9;
    const minutes = Math.random() > 0.5 ? "00" : "30";
    const appointmentTime = `${hours.toString().padStart(2, "0")}:${minutes}`;

    let status;
    if (daysOffset < 0) {
      status = Math.random() > 0.15 ? "completed" : "cancelled";
    } else if (daysOffset === 0) {
      status = Math.random() > 0.3 ? "upcoming" : "completed";
    } else {
      status = Math.random() > 0.2 ? "upcoming" : "cancelled";
    }

    const appointmentType = Math.random() > 0.4 ? "online" : "clinic-visit";

    const paymentStatuses = ["paid", "pending", "failed"];
    const paymentStatus =
      status === "cancelled"
        ? "failed"
        : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

    appointments.push({
      _id: `appt_${(i + 1).toString().padStart(3, "0")}`,
      patientId: patient.id,
      patient,
      appointmentDate: appointmentDate.toISOString(),
      appointmentTime,
      appointmentType,
      status,
      paymentStatus,
      consultationFee: Math.floor(Math.random() * 500) + 500,
      symptoms: symptoms[i % symptoms.length],
      diagnosis:
        status === "completed" ? "Mild cardiac arrhythmia detected" : null,
      notes:
        status === "completed"
          ? "Patient advised to reduce sodium intake and exercise regularly"
          : null,
      createdAt: new Date(
        today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });
  }

  return appointments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
};
