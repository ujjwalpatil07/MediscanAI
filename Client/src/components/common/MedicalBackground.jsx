import {
    Stethoscope,
    Brain,
    Heart,
    Eye,
    Sparkles,
    Shield,
    Activity,
    Cross,
    Microscope,
    Syringe,
    Thermometer,
    HeartPulse,
    ScanEye,
    Plus,
} from "lucide-react";

export default function MedicalBackground() {
    return (
        <>
            {/* ===================== */}
            {/* Custom Animations */}
            {/* ===================== */}

            <style>
                {`
                    @keyframes floatSlow {
                        0% {
                            transform: translateY(0px) rotate(0deg);
                        }
                        50% {
                            transform: translateY(-18px) rotate(4deg);
                        }
                        100% {
                            transform: translateY(0px) rotate(0deg);
                        }
                    }

                    @keyframes floatMedium {
                        0% {
                            transform: translateY(0px) translateX(0px);
                        }
                        50% {
                            transform: translateY(-25px) translateX(8px);
                        }
                        100% {
                            transform: translateY(0px) translateX(0px);
                        }
                    }

                    @keyframes pulseGlow {
                        0%, 100% {
                            opacity: 0.4;
                            transform: scale(1);
                        }
                        50% {
                            opacity: 0.8;
                            transform: scale(1.12);
                        }
                    }

                    @keyframes rotateSlow {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes heartbeat {
                        0%, 100% {
                            transform: scale(1);
                        }
                        25% {
                            transform: scale(1.08);
                        }
                        40% {
                            transform: scale(0.96);
                        }
                        60% {
                            transform: scale(1.12);
                        }
                    }

                    @keyframes waveMove {
                        0% {
                            transform: translateX(0px);
                        }
                        50% {
                            transform: translateX(10px);
                        }
                        100% {
                            transform: translateX(0px);
                        }
                    }

                    .animate-float-slow {
                        animation: floatSlow 7s ease-in-out infinite;
                    }

                    .animate-float-medium {
                        animation: floatMedium 6s ease-in-out infinite;
                    }

                    .animate-pulse-glow {
                        animation: pulseGlow 5s ease-in-out infinite;
                    }

                    .animate-rotate-slow {
                        animation: rotateSlow 20s linear infinite;
                    }

                    .animate-heartbeat {
                        animation: heartbeat 2.2s ease-in-out infinite;
                    }

                    .animate-wave {
                        animation: waveMove 4s ease-in-out infinite;
                    }
                `}
            </style>

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

                {/* ===================== */}
                {/* Gradient Glow Blobs */}
                {/* ===================== */}

                <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-green-400/10 blur-3xl rounded-full animate-pulse-glow"></div>

                <div className="absolute top-[30%] right-[-100px] w-[280px] h-[280px] bg-emerald-400/10 blur-3xl rounded-full animate-pulse-glow"></div>

                <div className="absolute bottom-[-100px] left-[20%] w-[260px] h-[260px] bg-teal-400/10 blur-3xl rounded-full animate-pulse-glow"></div>

                <div className="absolute bottom-[10%] right-[10%] w-[240px] h-[240px] bg-lime-400/10 blur-3xl rounded-full animate-pulse-glow"></div>

                {/* ===================== */}
                {/* Floating Medical Icons */}
                {/* ===================== */}

                <div className="absolute top-20 left-10 text-green-200/20 dark:text-green-500/10 animate-heartbeat">
                    <Heart className="w-16 h-16" />
                </div>

                <div className="absolute top-[12%] left-[42%] text-emerald-200/20 dark:text-emerald-500/10 animate-float-medium">
                    <Brain className="w-20 h-20" />
                </div>

                <div className="absolute top-[40%] right-20 text-green-200/20 dark:text-green-500/10 animate-float-slow">
                    <Stethoscope className="w-20 h-20 rotate-12" />
                </div>

                <div className="absolute bottom-32 left-20 text-green-200/20 dark:text-green-500/10 animate-float-medium">
                    <Shield className="w-14 h-14" />
                </div>

                <div className="absolute bottom-10 right-[15%] text-green-200/20 dark:text-green-500/10 animate-pulse-glow">
                    <Sparkles className="w-12 h-12" />
                </div>

                <div className="absolute top-[60%] left-[8%] text-cyan-200/20 dark:text-cyan-500/10 animate-wave">
                    <Eye className="w-16 h-16" />
                </div>

                <div className="absolute top-[70%] right-[8%] text-rose-200/20 dark:text-rose-500/10 animate-heartbeat">
                    <HeartPulse className="w-16 h-16" />
                </div>

                <div className="absolute top-[25%] right-[35%] text-blue-200/20 dark:text-blue-500/10 animate-rotate-slow">
                    <Microscope className="w-16 h-16" />
                </div>

                <div className="absolute bottom-[20%] left-[38%] text-yellow-200/20 dark:text-yellow-500/10 animate-float-medium">
                    <Syringe className="w-14 h-14 -rotate-12" />
                </div>

                <div className="absolute top-[48%] left-[48%] text-purple-200/20 dark:text-purple-500/10 animate-wave">
                    <Thermometer className="w-12 h-12" />
                </div>

                <div className="absolute top-[18%] right-[12%] text-pink-200/20 dark:text-pink-500/10 animate-float-slow">
                    <ScanEye className="w-14 h-14" />
                </div>

                <div className="absolute bottom-[12%] right-[42%] text-emerald-200/20 dark:text-emerald-500/10 animate-wave">
                    <Activity className="w-16 h-16" />
                </div>

                {/* ===================== */}
                {/* Floating Pills */}
                {/* ===================== */}

                <div className="absolute top-[22%] left-[45%] w-10 h-5 rounded-full bg-gradient-to-r from-pink-300/20 to-white/10 rotate-45 animate-float-slow"></div>

                <div className="absolute bottom-[25%] right-[35%] w-12 h-6 rounded-full bg-gradient-to-r from-blue-300/20 to-white/10 -rotate-12 animate-float-medium"></div>

                <div className="absolute top-[65%] left-[12%] w-8 h-4 rounded-full bg-gradient-to-r from-green-300/20 to-white/10 rotate-[30deg] animate-wave"></div>

                <div className="absolute top-[35%] left-[25%] w-14 h-7 rounded-full bg-gradient-to-r from-emerald-300/20 to-white/10 rotate-[50deg] animate-float-slow"></div>

                <div className="absolute bottom-[15%] left-[60%] w-10 h-5 rounded-full bg-gradient-to-r from-cyan-300/20 to-white/10 rotate-[20deg] animate-wave"></div>

                <div className="absolute top-[80%] right-[20%] w-12 h-6 rounded-full bg-gradient-to-r from-lime-300/20 to-white/10 rotate-[75deg] animate-float-medium"></div>

                {/* ===================== */}
                {/* Medical Cross */}
                {/* ===================== */}

                <div className="absolute top-[32%] left-[75%] text-green-200/20 dark:text-green-500/10 animate-rotate-slow">
                    <Plus className="w-14 h-14" />
                </div>

                <div className="absolute bottom-[28%] left-[30%] text-emerald-200/20 dark:text-emerald-500/10 animate-heartbeat">
                    <Cross className="w-12 h-12" />
                </div>

                {/* ===================== */}
                {/* Animated Grid Overlay */}
                {/* ===================== */}

                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:60px_60px] animate-wave"></div>
            </div>
        </>
    );
}