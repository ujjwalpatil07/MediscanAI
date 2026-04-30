import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing">
      <h1>Welcome to My App 🚀</h1>
      <p>This is the landing page.</p>
      <Link to="/home">
        <button>Go to Home</button>
      </Link>
    </div>
  );
}
