export const generateMessageStats = () => ({
  totalMessages: 156,
  unread: 12,
  todayMessages: 8,
  activeChats: 5,
});

export const generatePatients = () => [
  {
    _id: "pat001",
    firstName: "Bogdan",
    lastName: "Krivenchenko",
    avatar: null,
    isOnline: true,
    lastSeen: "Now",
    unreadCount: 3,
    appointmentDate: "2025-01-15",
    status: "In-Treatment",
  },
  {
    _id: "pat002",
    firstName: "Jenny",
    lastName: "Wilson",
    avatar: null,
    isOnline: false,
    lastSeen: "2 hours ago",
    unreadCount: 0,
    appointmentDate: "2025-01-20",
    status: "Out-Patient",
  },
  {
    _id: "pat003",
    firstName: "David",
    lastName: "Miller",
    avatar: null,
    isOnline: true,
    lastSeen: "Now",
    unreadCount: 5,
    appointmentDate: "2025-01-10",
    status: "In-Treatment",
  },
  {
    _id: "pat004",
    firstName: "Sarah",
    lastName: "Johnson",
    avatar: null,
    isOnline: false,
    lastSeen: "5 hours ago",
    unreadCount: 0,
    appointmentDate: "2025-01-25",
    status: "Out-Patient",
  },
  {
    _id: "pat005",
    firstName: "Michael",
    lastName: "Brown",
    avatar: null,
    isOnline: true,
    lastSeen: "Now",
    unreadCount: 1,
    appointmentDate: "2025-01-12",
    status: "In-Treatment",
  },
  {
    _id: "pat006",
    firstName: "Emily",
    lastName: "Davis",
    avatar: null,
    isOnline: false,
    lastSeen: "1 day ago",
    unreadCount: 0,
    appointmentDate: "2025-02-01",
    status: "Out-Patient",
  },
  {
    _id: "pat007",
    firstName: "Robert",
    lastName: "Fox",
    avatar: null,
    isOnline: false,
    lastSeen: "3 hours ago",
    unreadCount: 2,
    appointmentDate: "2025-01-18",
    status: "In-Treatment",
  },
  {
    _id: "pat008",
    firstName: "John",
    lastName: "Smith",
    avatar: null,
    isOnline: true,
    lastSeen: "Now",
    unreadCount: 0,
    appointmentDate: "2025-02-05",
    status: "Out-Patient",
  },
];

export const generateConversations = () => ({
  pat001: [
    {
      _id: "msg_001",
      sender: "patient",
      message:
        "Good Morning Doctor, I've been experiencing some chest discomfort since yesterday.",
      timestamp: "2025-01-15T07:30:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_002",
      sender: "doctor",
      message:
        "Good Morning. Can you describe the discomfort? Is it sharp or more like pressure?",
      timestamp: "2025-01-15T07:45:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_003",
      sender: "patient",
      message:
        "It's more like a pressure, especially when I walk or climb stairs. It goes away when I rest.",
      timestamp: "2025-01-15T07:50:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_004",
      sender: "doctor",
      message:
        "I understand. This sounds like it could be stable angina. I'd like you to come in for a checkup. Can you come tomorrow at 10 AM?",
      timestamp: "2025-01-15T08:00:00",
      read: false,
      type: "text",
    },
    {
      _id: "msg_005",
      sender: "patient",
      message:
        "Yes, I can come tomorrow at 10 AM. Should I bring my current medications?",
      timestamp: "2025-01-15T08:05:00",
      read: false,
      type: "text",
    },
  ],
  pat002: [
    {
      _id: "msg_006",
      sender: "patient",
      message:
        "Hi Doctor, just wanted to let you know that my palpitations have reduced significantly since starting the medication.",
      timestamp: "2025-01-14T14:00:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_007",
      sender: "doctor",
      message:
        "That's great to hear! Keep taking the medication as prescribed and let me know if you experience any side effects.",
      timestamp: "2025-01-14T14:30:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_008",
      sender: "patient",
      message: "Will do. I have a question - can I resume my morning walks?",
      timestamp: "2025-01-14T14:35:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_009",
      sender: "doctor",
      message:
        "Yes, light exercise like walking is fine. Just don't overexert yourself. Start with 15-20 minutes and gradually increase.",
      timestamp: "2025-01-14T15:00:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_010",
      sender: "patient",
      message: "Thank you Doctor! I'll follow your advice.",
      timestamp: "2025-01-14T15:05:00",
      read: true,
      type: "text",
    },
  ],
  pat003: [
    {
      _id: "msg_011",
      sender: "patient",
      message:
        "Doctor, I've gained 3kg in the last 3 days as you mentioned to watch for. Should I be concerned?",
      timestamp: "2025-01-13T09:15:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_012",
      sender: "doctor",
      message:
        "Yes, this could be fluid retention. Please increase your Furosemide to 60mg for the next 2 days and monitor your weight daily.",
      timestamp: "2025-01-13T09:30:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_013",
      sender: "patient",
      message:
        "Okay, I'll do that. Also, I've been feeling more tired than usual. Is that normal?",
      timestamp: "2025-01-13T09:35:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_014",
      sender: "doctor",
      message:
        "Fatigue can be related to fluid retention. Let's see how you respond to the increased diuretic. If the fatigue persists or you feel short of breath, come to the clinic immediately.",
      timestamp: "2025-01-13T09:45:00",
      read: false,
      type: "text",
    },
    {
      _id: "msg_015",
      sender: "patient",
      message:
        "I've sent you my blood pressure readings from this morning. They're a bit higher than usual.",
      timestamp: "2025-01-13T10:00:00",
      read: false,
      type: "text",
    },
    {
      _id: "msg_016",
      sender: "patient",
      message: "Here's the image of my readings",
      timestamp: "2025-01-13T10:02:00",
      read: false,
      type: "image",
      imageUrl: null,
    },
  ],
  pat005: [
    {
      _id: "msg_017",
      sender: "patient",
      message:
        "Doctor, my INR result today is 2.8. Should I continue the same Warfarin dose?",
      timestamp: "2025-01-12T11:00:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_018",
      sender: "doctor",
      message:
        "2.8 is within the target range of 2.0-3.0. Continue the same dose and recheck next week.",
      timestamp: "2025-01-12T11:15:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_019",
      sender: "patient",
      message:
        "Thank you. I also wanted to ask - I have a dental procedure next week. Should I stop the Warfarin?",
      timestamp: "2025-01-12T11:20:00",
      read: false,
      type: "text",
    },
  ],
  pat007: [
    {
      _id: "msg_020",
      sender: "patient",
      message:
        "Hi Doctor, my blood pressure has been running around 138/88 since our last visit. I've been taking my medications regularly.",
      timestamp: "2025-01-11T16:00:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_021",
      sender: "doctor",
      message:
        "That's still slightly elevated. Let's increase your Losartan to 100mg as we discussed. Continue Amlodipine at the same dose.",
      timestamp: "2025-01-11T16:30:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_022",
      sender: "patient",
      message:
        "I've started the new dose. Can I schedule a follow-up appointment for next month?",
      timestamp: "2025-01-12T09:00:00",
      read: false,
      type: "text",
    },
  ],
  pat004: [
    {
      _id: "msg_023",
      sender: "patient",
      message:
        "Doctor, just wanted to update you that my latest lipid panel results are in. Should I share them?",
      timestamp: "2025-01-10T10:00:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_024",
      sender: "doctor",
      message:
        "Yes, please share the results. I'll review them and we can discuss during your next appointment.",
      timestamp: "2025-01-10T10:30:00",
      read: true,
      type: "text",
    },
  ],
  pat006: [
    {
      _id: "msg_025",
      sender: "patient",
      message:
        "Doctor, the tips you gave me have helped a lot! No fainting episodes since our last consultation. Thank you!",
      timestamp: "2025-01-08T13:00:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_026",
      sender: "doctor",
      message:
        "That's wonderful to hear! Keep following the hydration and trigger avoidance advice. Let me know if anything changes.",
      timestamp: "2025-01-08T13:15:00",
      read: true,
      type: "text",
    },
  ],
  pat008: [
    {
      _id: "msg_027",
      sender: "patient",
      message:
        "Hi Doctor, I completed my marathon last weekend! Thank you for clearing me for participation.",
      timestamp: "2025-01-05T18:00:00",
      read: true,
      type: "text",
    },
    {
      _id: "msg_028",
      sender: "doctor",
      message:
        "Congratulations! How did you feel during the run? Any cardiac symptoms?",
      timestamp: "2025-01-05T18:30:00",
      read: true,
      type: "text",
    },
  ],
});
