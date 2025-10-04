"use client";

import Navbar from "@/Components/navbar";
import "../css/about.css";
import { FaRobot, FaSearch, FaNewspaper, FaShieldAlt, FaUsers } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function About() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "auto";
    window.scrollTo(0,0);
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
    <div className="about-page">
      <Navbar user={user} setUser={setUser} />

      <section className="hero">
        <div className="hero-content">
          <h1>About NeuroFeed</h1>
          <p>Your intelligent news platform powered by AI — tailored to keep you updated with the latest trends worldwide.</p>
          <div className="hero-buttons">
            <Link href="/" className="btn">Home</Link>
            <Link href="/login" className="btn">Login</Link>
            <Link href="/signup" className="btn">Signup</Link>
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="mission-section">
          <div className="text-block">
            <h2 className="display-5 fw-bold">Our Mission</h2>
            <p className="fs-5">
              At NeuroFeed, we believe in delivering news with precision. Our platform combines AI-powered search,
              live updates, and personalized recommendations to bring you the stories that matter most.
            </p>
            <Link href="/login" className="btn">Get Started</Link>
          </div>

          <div className="image-block">
            <img src="/about.jpg" alt="About NeuroFeed" />
          </div>
        </div>

        <div className="features">
          <div className="feature-card"><FaRobot className="feature-icon" /><h3>AI-Powered Search</h3><p>Find exactly what you want using advanced AI-driven keyword extraction and filtering.</p></div>
          <div className="feature-card"><FaSearch className="feature-icon" /><h3>Smart Search Results</h3><p>Receive precise news content with minimal noise, tailored to your search intent.</p></div>
          <div className="feature-card"><FaNewspaper className="feature-icon" /><h3>Latest News</h3><p>Stay updated with real-time news updates across multiple countries and languages.</p></div>
          <div className="feature-card"><FaShieldAlt className="feature-icon" /><h3>Privacy & Security</h3><p>Your data is secure with us. We don&apos;t share personal information without consent.</p></div>
          <div className="feature-card"><FaUsers className="feature-icon" /><h3>Community Driven</h3><p>Interact with news content and become part of a growing community of informed readers.</p></div>
        </div>

        <div className="why-choose-us">
          <h2>Why Choose Us</h2>
          <ul>
            <li>AI-driven news search for precision and relevance.</li>
            <li>Real-time updates from multiple trusted sources.</li>
            <li>Customizable categories & languages for personal preferences.</li>
            <li>Secure platform respecting your privacy.</li>
            <li>Easy-to-use interface with responsive design.</li>
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
