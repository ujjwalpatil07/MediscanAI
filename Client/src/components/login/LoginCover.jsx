import React from "react";
import { useNavigate } from "react-router-dom";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import photo from "../../../../Assets/coverImg.png";

export default function LoginCover() {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex flex-col items-center relative bg-primary w-full md:w-1/2 p-6 md:p-8 min-h-screen overflow-hidden">

      <div className="absolute -top-32 -right-32 bg-gradient-to-r from-[#EDF2F730] to-[#EDF2F70] rounded-full w-64 h-64 md:w-80 md:h-80"></div>
      <div className="absolute bottom-20 -left-20 bg-gradient-to-r from-[#EDF2F710] to-[#EDF2F705] rounded-full w-48 h-48"></div>
      <div className="absolute top-1/3 -left-10 border-2 border-white/10 rounded-full w-24 h-24"></div>
      <div className="absolute bottom-1/4 -right-10 border-2 border-white/10 rounded-full w-32 h-32"></div>

      <div className="w-full flex justify-center md:justify-start z-10 mb-8">
        <button
          onClick={() => navigate("/support")}
          className="text-white text-sm md:text-base flex items-center hover:underline"
        >
          <SupportAgentIcon className="mr-2" />
          <span className="font-medium">Support Center</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-lg z-10">

        <div className="relative w-full bg-white rounded-2xl p-8 space-y-4 shadow-lg mb-10">
          <img
            src={photo}
            alt="coverimage"
            className="hidden lg:block absolute top-6 right-0 w-32 md:w-40"
          />
          <h1 className="text-primary font-bold text-2xl md:text-3xl w-3/4 mb-2">
            Welcome back <br />to HealthAI
          </h1>
          <p className="text-[#718096] text-sm md:text-base w-full lg:w-80 mb-0">
            Sign in to access AI-powered
            symptom checks, real-time doctor
            consults, and your complete health history.
          </p>
          <button
            onClick={() => navigate("/learn-more")}
            className="bg-primary h-10 px-6 rounded-3xl text-white text-sm md:text-base hover:bg-[#156f43] transition-colors mt-4"
          >
            Learn more
          </button>
        </div>

        <div className="text-center w-full space-y-4">
          <h1 className="text-white text-2xl md:text-3xl font-semibold">
            Create your HealthAI Account
          </h1>
          <p className="text-[#CFD9E0] text-sm md:text-base px-4">
            Join our intelligent care platform. Whether you're a patient or a
            doctor, HealthAI simplifies your healthcare experience.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => navigate("/about")}
              className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition"
            />
            <button
              onClick={() => navigate("/contact")}
              className="w-3 h-3 rounded-full bg-white/60 hover:bg-white/80 transition"
            />
            <button
              onClick={() => navigate("/features")}
              className="w-3 h-3 rounded-full bg-white hover:bg-white/90 transition"
            />
          </div>
        </div>
      </div>

      <div className="w-full text-center text-white/80 text-xs mt-8 z-10">
        <div className="flex justify-center gap-6 flex-wrap">
          <div>
            <p className="text-lg font-medium">500+</p>
            <p className="text-xs">Healthcare Providers</p>
          </div>
          <div>
            <p className="text-lg font-medium">24/7</p>
            <p className="text-xs">Support Available</p>
          </div>
          <div>
            <p className="text-lg font-medium">99.9%</p>
            <p className="text-xs">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
