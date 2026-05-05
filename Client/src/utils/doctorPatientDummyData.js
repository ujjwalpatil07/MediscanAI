export const generateDetailedPatients = () => {
  const patients = [
    {
      _id: "pat001",
      firstName: "Bogdan",
      lastName: "Krivenchenko",
      email: "bogdan.k@email.com",
      mobile: "+1 (555) 234-5678",
      dob: "1979-03-15",
      gender: "male",
      bloodGroup: "A+",
      height: 178,
      weight: 82,
      address: "742 Evergreen Terrace, Springfield, IL 62701",
      allergies: ["Penicillin", "Peanuts"],
      currentMedications: [
        { name: "Lisinopril", dosage: "10mg once daily" },
        { name: "Atorvastatin", dosage: "20mg at bedtime" },
      ],
      medicalHistory: [
        {
          condition: "Hypertension",
          diagnosedDate: "2018-05-12",
          notes: "Stage 2 hypertension, managed with medication",
        },
        {
          condition: "Type 2 Diabetes",
          diagnosedDate: "2020-09-23",
          notes: "Controlled with diet and Metformin",
        },
        {
          condition: "Coronary Artery Disease",
          diagnosedDate: "2022-01-15",
          notes: "Mild blockage in LAD, managed medically",
        },
      ],
      emergencyContact: {
        name: "Maria Krivenchenko",
        relation: "Wife",
        phone: "+1 (555) 234-5679",
      },
      appointments: [
        {
          _id: "appt_b1",
          appointmentDate: "2024-01-15",
          appointmentTime: "10:00",
          appointmentType: "clinic-visit",
          status: "completed",
          symptoms: "Chest pain during exercise, shortness of breath",
          diagnosis: "Stable angina",
          notes:
            "Advised to continue current medication, stress test scheduled",
        },
        {
          _id: "appt_b2",
          appointmentDate: "2024-03-20",
          appointmentTime: "14:30",
          appointmentType: "online",
          status: "completed",
          symptoms: "Follow-up consultation, blood pressure monitoring",
          diagnosis: "Blood pressure well controlled",
          notes: "Continue current medication regimen",
        },
        {
          _id: "appt_b3",
          appointmentDate: "2025-01-10",
          appointmentTime: "09:15",
          appointmentType: "clinic-visit",
          status: "upcoming",
          symptoms: "Annual cardiac checkup",
        },
      ],
      prescriptions: [
        {
          _id: "pres_b1",
          date: "2024-01-15",
          medications: [
            {
              name: "Lisinopril",
              dosage: "10mg",
              frequency: "Once daily",
              duration: "30 days",
            },
            {
              name: "Atorvastatin",
              dosage: "20mg",
              frequency: "At bedtime",
              duration: "30 days",
            },
          ],
          notes: "Continue current medications, follow up in 2 months",
        },
      ],
      messages: [
        {
          _id: "msg_b1",
          date: "2024-02-10",
          message:
            "Doctor, I've been experiencing some dizziness in the mornings. Should I continue the medications?",
          type: "received",
        },
        {
          _id: "msg_b2",
          date: "2024-02-11",
          message:
            "Yes, continue the medications. The dizziness might be due to low blood pressure. Monitor your BP and record readings for our next appointment.",
          type: "sent",
        },
      ],
      notes:
        "Patient is compliant with medication but needs regular monitoring for blood pressure fluctuations.",
      status: "In-Treatment",
      lastVisit: "2024-03-20",
      nextAppointment: "2025-01-10",
    },
    {
      _id: "pat002",
      firstName: "Jenny",
      lastName: "Wilson",
      email: "jenny.w@email.com",
      mobile: "+1 (555) 345-6789",
      dob: "1992-07-22",
      gender: "female",
      bloodGroup: "O-",
      height: 165,
      weight: 58,
      address: "123 Oak Street, Riverside, CA 92501",
      allergies: ["Sulfa drugs"],
      currentMedications: [{ name: "Metoprolol", dosage: "25mg twice daily" }],
      medicalHistory: [
        {
          condition: "Mitral Valve Prolapse",
          diagnosedDate: "2015-08-10",
          notes: "Mild, asymptomatic, monitoring annually",
        },
        {
          condition: "Arrhythmia",
          diagnosedDate: "2023-06-05",
          notes: "Occasional palpitations, managed with beta-blockers",
        },
      ],
      emergencyContact: {
        name: "Robert Wilson",
        relation: "Husband",
        phone: "+1 (555) 345-6790",
      },
      appointments: [
        {
          _id: "appt_j1",
          appointmentDate: "2024-02-10",
          appointmentTime: "11:30",
          appointmentType: "online",
          status: "completed",
          symptoms: "Irregular heartbeat, occasional chest fluttering",
          diagnosis: "Benign arrhythmia, stress-related",
          notes: "Advised stress management techniques, continue Metoprolol",
        },
        {
          _id: "appt_j2",
          appointmentDate: "2024-12-28",
          appointmentTime: "15:00",
          appointmentType: "clinic-visit",
          status: "upcoming",
          symptoms: "Annual follow-up for mitral valve monitoring",
        },
      ],
      prescriptions: [
        {
          _id: "pres_j1",
          date: "2024-02-10",
          medications: [
            {
              name: "Metoprolol",
              dosage: "25mg",
              frequency: "Twice daily",
              duration: "60 days",
            },
          ],
          notes: "Continue medication, reduce caffeine intake",
        },
      ],
      messages: [],
      notes:
        "Patient is anxious about heart condition. Needs reassurance and clear explanations during consultations.",
      status: "In-Treatment",
      lastVisit: "2024-02-10",
      nextAppointment: "2024-12-28",
    },
    {
      _id: "pat003",
      firstName: "David",
      lastName: "Miller",
      email: "david.m@email.com",
      mobile: "+1 (555) 456-7890",
      dob: "1965-11-30",
      gender: "male",
      bloodGroup: "B+",
      height: 182,
      weight: 95,
      address: "456 Pine Avenue, Boston, MA 02108",
      allergies: ["Aspirin", "Ibuprofen"],
      currentMedications: [
        { name: "Clopidogrel", dosage: "75mg once daily" },
        { name: "Carvedilol", dosage: "12.5mg twice daily" },
        { name: "Furosemide", dosage: "40mg once daily" },
      ],
      medicalHistory: [
        {
          condition: "Congestive Heart Failure",
          diagnosedDate: "2022-03-18",
          notes: "Moderate LV dysfunction, EF 35-40%",
        },
        {
          condition: "Myocardial Infarction",
          diagnosedDate: "2022-02-28",
          notes: "Anterior wall MI, treated with PCI and stent placement",
        },
        {
          condition: "Hyperlipidemia",
          diagnosedDate: "2019-08-15",
          notes: "Managed with medication and diet",
        },
      ],
      emergencyContact: {
        name: "Sarah Miller",
        relation: "Daughter",
        phone: "+1 (555) 456-7891",
      },
      appointments: [
        {
          _id: "appt_d1",
          appointmentDate: "2024-01-05",
          appointmentTime: "08:30",
          appointmentType: "clinic-visit",
          status: "completed",
          symptoms: "Shortness of breath on minimal exertion, ankle swelling",
          diagnosis: "CHF exacerbation",
          notes: "Increased diuretic dose, advised fluid restriction",
        },
        {
          _id: "appt_d2",
          appointmentDate: "2024-04-15",
          appointmentTime: "10:00",
          appointmentType: "clinic-visit",
          status: "completed",
          symptoms: "Follow-up after medication adjustment",
          diagnosis: "Improved symptoms, stable vitals",
          notes: "Continue current treatment, scheduled echocardiogram",
        },
        {
          _id: "appt_d3",
          appointmentDate: "2024-06-20",
          appointmentTime: "09:45",
          appointmentType: "online",
          status: "completed",
          symptoms: "Medication review, mild fatigue",
          diagnosis: "Stable CHF, medication tolerating well",
          notes: "Continue same medications, follow up in 3 months",
        },
      ],
      prescriptions: [
        {
          _id: "pres_d1",
          date: "2024-01-05",
          medications: [
            {
              name: "Clopidogrel",
              dosage: "75mg",
              frequency: "Once daily",
              duration: "30 days",
            },
            {
              name: "Carvedilol",
              dosage: "12.5mg",
              frequency: "Twice daily",
              duration: "30 days",
            },
            {
              name: "Furosemide",
              dosage: "40mg",
              frequency: "Once daily",
              duration: "30 days",
            },
          ],
          notes: "Monitor weight daily, report weight gain >2kg in 24 hours",
        },
      ],
      messages: [
        {
          _id: "msg_d1",
          date: "2024-02-15",
          message:
            "Doctor, I've gained 3kg in the last 3 days. Should I be concerned?",
          type: "received",
        },
        {
          _id: "msg_d2",
          date: "2024-02-15",
          message:
            "Yes, please increase your Furosemide to 60mg for the next 2 days and monitor your weight. If no improvement, come to the clinic.",
          type: "sent",
        },
      ],
      notes:
        "High-risk cardiac patient. Requires close monitoring for fluid retention and CHF symptoms.",
      status: "In-Treatment",
      lastVisit: "2024-06-20",
      nextAppointment: "2024-09-15",
    },
    {
      _id: "pat004",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@email.com",
      mobile: "+1 (555) 567-8901",
      dob: "1988-04-08",
      gender: "female",
      bloodGroup: "AB+",
      height: 170,
      weight: 65,
      address: "789 Maple Drive, Portland, OR 97201",
      allergies: [],
      currentMedications: [{ name: "Rosuvastatin", dosage: "10mg at bedtime" }],
      medicalHistory: [
        {
          condition: "Hyperlipidemia",
          diagnosedDate: "2023-01-20",
          notes: "Familial hypercholesterolemia, managed with statins",
        },
      ],
      emergencyContact: {
        name: "Michael Johnson",
        relation: "Husband",
        phone: "+1 (555) 567-8902",
      },
      appointments: [
        {
          _id: "appt_s1",
          appointmentDate: "2024-03-01",
          appointmentTime: "14:00",
          appointmentType: "online",
          status: "completed",
          symptoms: "Routine lipid panel check",
          diagnosis: "LDL improved, continue current treatment",
          notes: "Good response to medication, maintain diet and exercise",
        },
        {
          _id: "appt_s2",
          appointmentDate: "2024-12-05",
          appointmentTime: "11:00",
          appointmentType: "clinic-visit",
          status: "upcoming",
          symptoms: "Annual wellness checkup",
        },
      ],
      prescriptions: [
        {
          _id: "pres_s1",
          date: "2024-03-01",
          medications: [
            {
              name: "Rosuvastatin",
              dosage: "10mg",
              frequency: "At bedtime",
              duration: "90 days",
            },
          ],
          notes: "Continue medication, repeat lipid panel in 3 months",
        },
      ],
      messages: [],
      notes:
        "Healthy patient with well-controlled cholesterol. Compliant with medication and lifestyle modifications.",
      status: "Out-Patient",
      lastVisit: "2024-03-01",
      nextAppointment: "2024-12-05",
    },
    {
      _id: "pat005",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.b@email.com",
      mobile: "+1 (555) 678-9012",
      dob: "1958-09-12",
      gender: "male",
      bloodGroup: "A-",
      height: 175,
      weight: 88,
      address: "321 Cedar Lane, Denver, CO 80201",
      allergies: ["Codeine"],
      currentMedications: [
        { name: "Warfarin", dosage: "5mg once daily" },
        { name: "Digoxin", dosage: "0.125mg once daily" },
        { name: "Metoprolol", dosage: "50mg twice daily" },
      ],
      medicalHistory: [
        {
          condition: "Atrial Fibrillation",
          diagnosedDate: "2020-11-10",
          notes:
            "Persistent AFib, managed with rate control and anticoagulation",
        },
        {
          condition: "Hypertension",
          diagnosedDate: "2015-04-22",
          notes: "Stage 1 hypertension, controlled with medication",
        },
        {
          condition: "Stroke",
          diagnosedDate: "2020-10-05",
          notes: "Ischemic stroke, mild residual weakness in left arm",
        },
      ],
      emergencyContact: {
        name: "Patricia Brown",
        relation: "Wife",
        phone: "+1 (555) 678-9013",
      },
      appointments: [
        {
          _id: "appt_m1",
          appointmentDate: "2024-02-20",
          appointmentTime: "09:00",
          appointmentType: "clinic-visit",
          status: "completed",
          symptoms: "INR check, occasional palpitations",
          diagnosis: "INR therapeutic, AFib rate controlled",
          notes: "Continue current medications, maintain INR between 2.0-3.0",
        },
        {
          _id: "appt_m2",
          appointmentDate: "2024-05-15",
          appointmentTime: "10:30",
          appointmentType: "clinic-visit",
          status: "completed",
          symptoms: "Routine follow-up",
          diagnosis: "Stable condition",
          notes: "Continue monitoring, adjust Warfarin based on INR results",
        },
      ],
      prescriptions: [
        {
          _id: "pres_m1",
          date: "2024-02-20",
          medications: [
            {
              name: "Warfarin",
              dosage: "5mg",
              frequency: "Once daily",
              duration: "30 days",
            },
            {
              name: "Digoxin",
              dosage: "0.125mg",
              frequency: "Once daily",
              duration: "30 days",
            },
            {
              name: "Metoprolol",
              dosage: "50mg",
              frequency: "Twice daily",
              duration: "30 days",
            },
          ],
          notes: "Check INR weekly, adjust Warfarin dose based on results",
        },
      ],
      messages: [
        {
          _id: "msg_m1",
          date: "2024-03-10",
          message:
            "My INR result today is 2.8. Should I continue the same dose?",
          type: "received",
        },
        {
          _id: "msg_m2",
          date: "2024-03-10",
          message:
            "Yes, 2.8 is within the target range. Continue the same dose and recheck next week.",
          type: "sent",
        },
      ],
      notes:
        "Elderly patient with multiple comorbidities. Requires careful anticoagulation management and regular INR monitoring.",
      status: "In-Treatment",
      lastVisit: "2024-05-15",
      nextAppointment: "2024-08-15",
    },
    {
      _id: "pat006",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.d@email.com",
      mobile: "+1 (555) 789-0123",
      dob: "1995-12-25",
      gender: "female",
      bloodGroup: "O+",
      height: 163,
      weight: 55,
      address: "654 Birch Street, Austin, TX 73301",
      allergies: ["Latex"],
      currentMedications: [],
      medicalHistory: [
        {
          condition: "Vasovagal Syncope",
          diagnosedDate: "2023-09-15",
          notes:
            "Occasional fainting episodes, triggered by stress and dehydration",
        },
      ],
      emergencyContact: {
        name: "James Davis",
        relation: "Father",
        phone: "+1 (555) 789-0124",
      },
      appointments: [
        {
          _id: "appt_e1",
          appointmentDate: "2024-04-10",
          appointmentTime: "13:00",
          appointmentType: "online",
          status: "completed",
          symptoms: "Two fainting episodes in the last month",
          diagnosis: "Recurrent vasovagal syncope",
          notes:
            "Advised increased fluid intake, salt supplementation, and trigger avoidance",
        },
        {
          _id: "appt_e2",
          appointmentDate: "2024-12-20",
          appointmentTime: "10:00",
          appointmentType: "online",
          status: "upcoming",
          symptoms: "Follow-up consultation",
        },
      ],
      prescriptions: [],
      messages: [
        {
          _id: "msg_e1",
          date: "2024-05-10",
          message:
            "Doctor, The tips you gave me have helped a lot! No fainting episodes since our last consultation. Thank you!",
          type: "received",
        },
      ],
      notes:
        "Young patient, otherwise healthy. Symptoms well controlled with conservative management.",
      status: "Out-Patient",
      lastVisit: "2024-04-10",
      nextAppointment: "2024-12-20",
    },
    {
      _id: "pat007",
      firstName: "Robert",
      lastName: "Fox",
      email: "robert.f@email.com",
      mobile: "+1 (555) 890-1234",
      dob: "1972-06-18",
      gender: "male",
      bloodGroup: "B-",
      height: 180,
      weight: 90,
      address: "987 Walnut Avenue, Seattle, WA 98101",
      allergies: [],
      currentMedications: [
        { name: "Amlodipine", dosage: "5mg once daily" },
        { name: "Losartan", dosage: "50mg once daily" },
      ],
      medicalHistory: [
        {
          condition: "Hypertension",
          diagnosedDate: "2017-03-08",
          notes: "Resistant hypertension, requiring dual therapy",
        },
      ],
      emergencyContact: {
        name: "Linda Fox",
        relation: "Wife",
        phone: "+1 (555) 890-1235",
      },
      appointments: [
        {
          _id: "appt_r1",
          appointmentDate: "2024-03-15",
          appointmentTime: "11:00",
          appointmentType: "clinic-visit",
          status: "completed",
          symptoms: "Blood pressure check",
          diagnosis: "BP 138/88, slightly elevated",
          notes: "Increase Losartan to 100mg, continue Amlodipine",
        },
      ],
      prescriptions: [
        {
          _id: "pres_r1",
          date: "2024-03-15",
          medications: [
            {
              name: "Amlodipine",
              dosage: "5mg",
              frequency: "Once daily",
              duration: "30 days",
            },
            {
              name: "Losartan",
              dosage: "100mg",
              frequency: "Once daily",
              duration: "30 days",
            },
          ],
          notes: "Monitor blood pressure at home twice daily",
        },
      ],
      messages: [],
      notes:
        "Moderate hypertension, partially controlled. Needs lifestyle modifications and medication compliance.",
      status: "In-Treatment",
      lastVisit: "2024-03-15",
      nextAppointment: "2024-06-15",
    },
    {
      _id: "pat008",
      firstName: "John",
      lastName: "Smith",
      email: "john.s@email.com",
      mobile: "+1 (555) 901-2345",
      dob: "1985-02-14",
      gender: "male",
      bloodGroup: "A+",
      height: 185,
      weight: 78,
      address: "246 Elm Road, Chicago, IL 60601",
      allergies: ["Shellfish"],
      currentMedications: [],
      medicalHistory: [
        {
          condition: "Athletic Heart Syndrome",
          diagnosedDate: "2022-07-20",
          notes: "Physiological cardiac adaptation, no treatment needed",
        },
      ],
      emergencyContact: {
        name: "Emma Smith",
        relation: "Wife",
        phone: "+1 (555) 901-2346",
      },
      appointments: [
        {
          _id: "appt_js1",
          appointmentDate: "2024-01-25",
          appointmentTime: "15:30",
          appointmentType: "online",
          status: "completed",
          symptoms: "Routine checkup for sports participation",
          diagnosis: "Normal cardiac function",
          notes: "Cleared for marathon participation, advised regular checkups",
        },
      ],
      prescriptions: [],
      messages: [],
      notes: "Healthy athletic patient, annual checkups recommended.",
      status: "Out-Patient",
      lastVisit: "2024-01-25",
      nextAppointment: null,
    },
  ];

  return patients;
};

export const generatePatientStats = () => {
  const patients = generateDetailedPatients();
  return {
    total: patients.length,
    inTreatment: patients.filter((p) => p.status === "In-Treatment").length,
    outPatient: patients.filter((p) => p.status === "Out-Patient").length,
    newThisMonth: 3,
    criticalCases: 2,
    upcomingAppointments: patients.filter((p) => p.nextAppointment).length,
  };
};
