export const doctorsData = [
    {
        id: 1,
        firstName: "Aarti",
        lastName: "Sharma",
        specialty: "Cardiologist",
        yearsOfExperience: 12,
        consultationFee: 1500,
        rating: 4.9,
        isVerified: true,
        medicalDegree: "MD in Cardiology, DM in Cardiovascular Medicine",
        licenseNumber: "MCI-12345-67890",
        totalConsultations: 8450,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTimeSlots: {
            start: "10:00",
            end: "18:00"
        },
        clinicAddress: {
            street: "123, Health Care Complex",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001"
        },
        bio: "Dr. Aarti Sharma is a renowned cardiologist with over 12 years of experience in treating complex heart conditions. She specializes in interventional cardiology and has performed over 5000 successful procedures.",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        hospital: "Apollo Hospitals",
        languages: ["English", "Hindi", "Marathi"]
    },
    {
        id: 2,
        firstName: "Kiran",
        lastName: "G",
        specialty: "Endodontist",
        yearsOfExperience: 8,
        consultationFee: 1200,
        rating: 4.8,
        isVerified: true,
        medicalDegree: "BDS, MDS in Endodontics",
        licenseNumber: "DCI-23456-78901",
        totalConsultations: 5200,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: {
            start: "09:30",
            end: "17:30"
        },
        clinicAddress: {
            street: "45, Dental Excellence Clinic",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560001"
        },
        bio: "Dr. Kiran G is a specialist in root canal treatments and dental surgery. She is known for her gentle approach and pain-free procedures.",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        hospital: "Smile Care Dental Clinic",
        languages: ["English", "Kannada", "Tamil"]
    },
    {
        id: 3,
        firstName: "Priya",
        lastName: "Singh",
        specialty: "Periodontist",
        yearsOfExperience: 10,
        consultationFee: 1800,
        rating: 4.9,
        isVerified: true,
        medicalDegree: "BDS, MDS in Periodontology",
        licenseNumber: "DCI-34567-89012",
        totalConsultations: 6700,
        availableDays: ["Tuesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: {
            start: "11:00",
            end: "19:00"
        },
        clinicAddress: {
            street: "78, Dental Specialists Hub",
            city: "Delhi",
            state: "Delhi",
            pincode: "110001"
        },
        bio: "Dr. Priya Singh specializes in gum diseases and dental implants. She has successfully treated thousands of patients with advanced periodontal conditions.",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
        hospital: "Advanced Dental Care",
        languages: ["English", "Hindi", "Punjabi"]
    },
    {
        id: 4,
        firstName: "Rajesh",
        lastName: "Kumar",
        specialty: "Pediatric Dentist",
        yearsOfExperience: 15,
        consultationFee: 2000,
        rating: 4.7,
        isVerified: true,
        medicalDegree: "BDS, MDS in Pediatric Dentistry",
        licenseNumber: "DCI-45678-90123",
        totalConsultations: 9800,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: {
            start: "09:00",
            end: "17:00"
        },
        clinicAddress: {
            street: "12, Kids Dental World",
            city: "Chennai",
            state: "Tamil Nadu",
            pincode: "600001"
        },
        bio: "Dr. Rajesh Kumar is a child-friendly dentist who makes dental visits fun and comfortable for kids. He specializes in treating children with special needs.",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
        hospital: "Little Smiles Dental Clinic",
        languages: ["English", "Tamil", "Telugu"]
    },
    {
        id: 5,
        firstName: "Sarah",
        lastName: "Johnson",
        specialty: "Neurologist",
        yearsOfExperience: 14,
        consultationFee: 2200,
        rating: 4.9,
        isVerified: true,
        medicalDegree: "MD in Neurology, DM in Neuromedicine",
        licenseNumber: "MCI-56789-01234",
        totalConsultations: 7200,
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
        availableTimeSlots: {
            start: "09:00",
            end: "20:00"
        },
        clinicAddress: {
            street: "34, Brain Health Center",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001"
        },
        bio: "Dr. Sarah Johnson is an expert neurologist specializing in stroke management, epilepsy, and movement disorders.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        hospital: "Neuroscience Institute",
        languages: ["English", "Hindi"]
    },
    {
        id: 6,
        firstName: "Michael",
        lastName: "Chen",
        specialty: "Orthopedist",
        yearsOfExperience: 9,
        consultationFee: 1600,
        rating: 4.6,
        isVerified: false,
        medicalDegree: "MBBS, MS in Orthopedics",
        licenseNumber: "MCI-67890-12345",
        totalConsultations: 4100,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: {
            start: "09:00",
            end: "16:00"
        },
        clinicAddress: {
            street: "56, Bone & Joint Clinic",
            city: "Bangalore",
            state: "Karnataka",
            pincode: "560001"
        },
        bio: "Dr. Michael Chen provides comprehensive orthopedic care including joint replacements and sports injury management.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        hospital: "OrthoCare Hospital",
        languages: ["English", "Kannada"]
    }
];

// Updated dummy appointments data with family member booking support
export const dummyAppointments = [
    {
        id: 1,
        userId: 101,
        doctorId: 1,
        doctorName: "Dr. Aarti Sharma",
        specialty: "Cardiologist",
        rating: 4.9,
        doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
        appointmentType: "video",
        date: "2026-05-15",
        time: "10:30 AM",
        status: "upcoming",
        consultationFee: 1500,
        symptoms: "Chest pain and fatigue",
        location: "Mumbai, Maharashtra",
        meetingLink: "https://meet.example.com/abc123",
        patientName: "Ramesh Sharma",  // Family member name
        patientAge: 65,
        patientGender: "male"
    },
    {
        id: 2,
        userId: 101,
        doctorId: 2,
        doctorName: "Dr. Kiran G",
        specialty: "Endodontist",
        rating: 4.8,
        doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
        appointmentType: "clinic",
        date: "2026-05-18",
        time: "02:00 PM",
        status: "upcoming",
        consultationFee: 1200,
        symptoms: "Tooth pain",
        location: "Bangalore, Karnataka",
        patientName: "Aryan G",  // Family member (son)
        patientAge: 12,
        patientGender: "male"
    },
    {
        id: 3,
        userId: 101,
        doctorId: 3,
        doctorName: "Dr. Priya Singh",
        specialty: "Periodontist",
        rating: 4.9,
        doctorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop",
        appointmentType: "video",
        date: "2026-05-20",
        time: "11:00 AM",
        status: "upcoming",
        consultationFee: 1800,
        symptoms: "Gum bleeding",
        location: "Delhi, Delhi",
        meetingLink: "https://meet.example.com/def456",
        patientName: "John Doe",  // Friend/Family
        patientAge: 45,
        patientGender: "male"
    },
    {
        id: 4,
        userId: 101,
        doctorId: 4,
        doctorName: "Dr. Rajesh Kumar",
        specialty: "Pediatric Dentist",
        rating: 4.7,
        doctorImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop",
        appointmentType: "clinic",
        date: "2026-05-05",
        time: "09:30 AM",
        status: "completed",
        consultationFee: 2000,
        symptoms: "Child tooth decay",
        location: "Chennai, Tamil Nadu",
        patientName: "Little Kiara",  // Child
        patientAge: 5,
        patientGender: "female"
    },
    {
        id: 5,
        userId: 101,
        doctorId: 5,
        doctorName: "Dr. Sarah Johnson",
        specialty: "Neurologist",
        rating: 4.9,
        doctorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        appointmentType: "video",
        date: "2026-04-28",
        time: "03:00 PM",
        status: "completed",
        consultationFee: 2200,
        symptoms: "Migraine",
        location: "Mumbai, Maharashtra",
        meetingLink: "https://meet.example.com/ghi789",
        patientName: "John Smith",
        patientAge: 38,
        patientGender: "male"
    },
    {
        id: 6,
        userId: 101,
        doctorId: 6,
        doctorName: "Dr. Michael Chen",
        specialty: "Orthopedist",
        rating: 4.6,
        doctorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        appointmentType: "clinic",
        date: "2026-04-20",
        time: "04:30 PM",
        status: "cancelled",
        consultationFee: 1600,
        symptoms: "Knee pain",
        location: "Bangalore, Karnataka",
        patientName: "Robert Chen",  // Father
        patientAge: 68,
        patientGender: "male"
    },
    {
        id: 7,
        userId: 101,
        doctorId: 1,
        doctorName: "Dr. Aarti Sharma",
        specialty: "Cardiologist",
        rating: 4.9,
        doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
        appointmentType: "clinic",
        date: "2026-04-15",
        time: "10:00 AM",
        status: "completed",
        consultationFee: 1500,
        symptoms: "High blood pressure",
        location: "Mumbai, Maharashtra"
        // No patientName means booked for self
    },
    {
        id: 8,
        userId: 101,
        doctorId: 2,
        doctorName: "Dr. Kiran G",
        specialty: "Endodontist",
        rating: 4.8,
        doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
        appointmentType: "video",
        date: "2026-05-25",
        time: "11:30 AM",
        status: "upcoming",
        consultationFee: 1200,
        symptoms: "Root canal follow-up",
        location: "Bangalore, Karnataka",
        meetingLink: "https://meet.example.com/jkl012",
        patientName: "Sneha",  // Wife
        patientAge: 35,
        patientGender: "female"
    },
    {
        id: 9,
        userId: 101,
        doctorId: 3,
        doctorName: "Dr. Priya Singh",
        specialty: "Periodontist",
        rating: 4.9,
        doctorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop",
        appointmentType: "clinic",
        date: "2026-04-10",
        time: "02:30 PM",
        status: "cancelled",
        consultationFee: 1800,
        symptoms: "Gum surgery consultation",
        location: "Delhi, Delhi"
        // No patientName means booked for self
    },
    {
        id: 10,
        userId: 101,
        doctorId: 5,
        doctorName: "Dr. Sarah Johnson",
        specialty: "Neurologist",
        rating: 4.9,
        doctorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        appointmentType: "video",
        date: "2026-05-22",
        time: "09:00 AM",
        status: "upcoming",
        consultationFee: 2200,
        symptoms: "Headache follow-up",
        location: "Mumbai, Maharashtra",
        meetingLink: "https://meet.example.com/mno345",
        patientName: "Maria",  // Mother
        patientAge: 62,
        patientGender: "female"
    }
];