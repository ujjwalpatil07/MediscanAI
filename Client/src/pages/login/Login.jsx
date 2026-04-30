import React from "react";
import LoginForm from "../../components/login/LoginForm";
import LoginCover from "../../components/login/LoginCover";

export default function Login() {
  return <div className="w-full h-screen overflow-hidden md:flex">
    <LoginForm />
    <LoginCover />
  </div>;
}
