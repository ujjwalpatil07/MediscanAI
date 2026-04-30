import { Link } from "react-router-dom";
import { Hospital, User, Shield, HeartPulse, Stethoscope, ClipboardList, Thermometer, Pill, Syringe, Plus, Phone } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";

const roles = [
  {
    title: "Patient",
    path: "/patient/login",
    icon: <User size={40} className="text-blue-500" />,
    description: "Access your medical records and appointments",
    bgClass: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
    highlight: "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10",
    decorator: <HeartPulse className="absolute -bottom-2 -right-2 text-blue-300 dark:text-blue-700 w-16 h-16" />
  },
  {
    title: "Doctor",
    path: "/doctor/login",
    icon: <Hospital size={40} className="text-green-500" />,
    description: "Manage patient care and medical services",
    bgClass: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700",
    highlight: "from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10",
    decorator: <Stethoscope className="absolute -bottom-2 -right-2 text-green-300 dark:text-green-700 w-16 h-16" />
  },
  {
    title: "Admin",
    path: "/admin/login",
    icon: <Shield size={40} className="text-purple-500" />,
    description: "Manage hospital systems and staff",
    bgClass: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700",
    highlight: "from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10",
    decorator: <ClipboardList className="absolute -bottom-2 -right-2 text-purple-300 dark:text-purple-700 w-16 h-16" />
  },
];

const generateMedicalDecorations = (isDark) => {
  const elements = [];
  const medicalIcons = ['plus', 'heart-pulse', 'stethoscope', 'syringe', 'pill', 'thermometer'];
  const colors = isDark 
    ? ['text-blue-800/20', 'text-green-800/20', 'text-purple-800/20'] 
    : ['text-blue-200/50', 'text-green-200/50', 'text-purple-200/50'];

  for (let i = 0; i < 12; i++) {
    const IconComponent = medicalIcons[Math.floor(Math.random() * medicalIcons.length)];
    elements.push({
      id: i,
      icon: IconComponent,
      size: Math.random() * 40 + 20,
      left: Math.random() * 100,
      top: Math.random() * 100,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    });
  }
  return elements;
};

export default function RoleSelector() {
  const { theme } = useThemeContext();
  const decorations = generateMedicalDecorations(theme === 'dark');

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1A8151] dark:bg-gray-900 transition-colors duration-300 p-6 overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorations.map((dec) => (
          <motion.div
            key={dec.id}
            className={`absolute ${dec.color}`}
            style={{
              left: `${dec.left}%`,
              top: `${dec.top}%`,
              fontSize: `${dec.size}px`,
              transform: `rotate(${dec.rotate}deg)`
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: dec.duration,
              delay: dec.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            {dec.icon === 'plus' && <Plus size="1em" />}
            {dec.icon === 'heart-pulse' && <HeartPulse size="1em" />}
            {dec.icon === 'stethoscope' && <Stethoscope size="1em" />}
            {dec.icon === 'syringe' && <Syringe size="1em" />}
            {dec.icon === 'pill' && <Pill size="1em" />}
            {dec.icon === 'thermometer' && <Thermometer size="1em" />}
          </motion.div>
        ))}

        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-green-100/10 dark:bg-green-800/10"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
         
          <h1 className="text-4xl font-bold mb-3 text-white dark:text-white">
            Welcome to <span className="text-white dark:text-green-500">MediCare</span>
          </h1>
          <p className="text-lg text-white/80 dark:text-gray-300 max-w-lg mx-auto">
            Your trusted healthcare partner. Select your role to continue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="h-full relative"
            >
              <Link
                to={role.path}
                className={`group relative h-full flex flex-col items-center p-8 rounded-xl border-2 ${role.bgClass} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}
              >

                <div className={`absolute inset-0 bg-gradient-to-br ${role.highlight} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 0.3, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {role.decorator}
                </motion.div>

                <div className="relative z-10 mb-6 p-4 rounded-full bg-white dark:bg-gray-800 shadow-md">
                  {role.icon}
                </div>
                <h3 className="relative z-10 text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                  {role.title}
                </h3>
                <p className="relative z-10 text-gray-600 dark:text-gray-400">
                  {role.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-gray-800/50 rounded-full">
            <Phone className="w-5 h-5 text-white" />
            <span className="text-white text-sm">Emergency? Call <strong>108</strong></span>
          </div>
          <p className="mt-4 text-sm text-white/70 dark:text-gray-400">
            Need help? <Link to="/support" className="text-white dark:text-green-500 hover:underline">Contact support</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}