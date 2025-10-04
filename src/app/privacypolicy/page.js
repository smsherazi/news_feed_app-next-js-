"use client";

import Navbar from "@/Components/navbar";
import "../css/privacy.css";
import { FaLock, FaUserShield, FaInfoCircle, FaShieldAlt, FaGlobe } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PrivacyPolicy() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="privacy-page">
      <Navbar user={user} setUser={setUser} />

      <section className="hero">
        <div className="hero-content">
          <h1>Privacy Policy</h1>
          <p>Your privacy is our priority — learn how we protect your data at NeuroFeed.</p>
          <div className="hero-buttons">
            <Link href="/" className="btn">Home</Link>
            <Link href="/login" className="btn">Login</Link>
            <Link href="/signup" className="btn">Signup</Link>
          </div>
        </div>
      </section>

      <section className="privacy-content">
        <div className="mission-section">
          <div className="text-block">
            <h2 className="display-5 fw-bold">Our Commitment to Privacy</h2>
            <p className="fs-5">
              At NeuroFeed, we respect your privacy and are committed to protecting your personal information.
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </p>
            <Link href="/signup" className="btn">Join Now</Link>
          </div>

          <div className="image-block">
            <img src="/privacy-policy.webp" alt="Privacy Protection" />
          </div>
        </div>

        <div className="features">
          <div className="feature-card"><FaLock className="feature-icon" /><h3>Data Encryption</h3><p>We use state-of-the-art encryption protocols to protect your personal information.</p></div>
          <div className="feature-card"><FaUserShield className="feature-icon" /><h3>User Control</h3><p>You have control over your data and can request deletion or modification anytime.</p></div>
          <div className="feature-card"><FaInfoCircle className="feature-icon" /><h3>Transparency</h3><p>We are transparent about the data we collect and how it is used to improve your experience.</p></div>
          <div className="feature-card"><FaShieldAlt className="feature-icon" /><h3>Secure Storage</h3><p>Your data is stored securely and only accessible to authorized personnel.</p></div>
          <div className="feature-card"><FaGlobe className="feature-icon" /><h3>Compliance</h3><p>We comply with data protection laws and regulations to ensure your rights are safeguarded.</p></div>
        </div>

        <div className="why-choose-us">
          <h2>Key Privacy Points</h2>
          <ul>
            <li>We collect minimal data necessary for service delivery.</li>
            <li>Your search data is anonymized for analytical purposes.</li>
            <li>We do not share your personal information without your consent.</li>
            <li>Your data is protected through secure systems and encryption.</li>
            <li>You can access and manage your data through your account settings.</li>
          </ul>
          <div className="btn-group">
            <Link href="/login" className="btn">Login</Link>
            <Link href="/signup" className="btn">Signup</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
