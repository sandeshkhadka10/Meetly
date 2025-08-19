import React from "react";
import "../App.css";
import { useNavigate, Link } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landingPageContainer">
      {/* Navbar */}
      <nav>
        <div className="navHeader">
          <h2>Meetly</h2>
        </div>
        <div className="navlist">
          <p onClick={() => {
            navigate("/joiningasguest");
          }}>Join as Guest</p>
          <p onClick={() => {
            navigate("/auth");
          }}>Register</p>
          <div role="button">
            <p onClick={() => {
              navigate("/auth");
            }}>Login</p>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "orange" }}>Connect</span> with your loved
            ones
          </h1>
          <p>Cover a distance by Meetly</p>
          <div role="button">
            <Link to="/auth">Get started</Link>
          </div>
        </div>
        <div>
          <img src="/doubleMobile.png" alt="Double Mobile Photo"></img>
        </div>
      </div>
    </div>
  );
}
