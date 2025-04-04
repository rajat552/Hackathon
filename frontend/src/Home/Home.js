import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import ProfileCardHome from "./ProfileCardHome";

import mockTrendingProjects from "../mockdata/trending_projects.json";
import mockUpcomingEvents from "../mockdata/upcoming_events.json";

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileSuggestions, setProfileSuggestions] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "home";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [hasConnections, setHasConnections] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(Boolean(token));
  }, []);

  useEffect(() => {
    fetchProfileSuggestions();
    fetchTrendingProjects();
    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  const fetchProfileSuggestions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/profiles/");
      const data = await response.json();
      setProfileSuggestions(data);
      setHasConnections(data.length > 0);
    } catch (error) {
      console.error("Error fetching profile suggestions:", error);
    }
  };

  const fetchTrendingProjects = async () => {
    try {
      const response = await fetch("/api/projects/trending");
      const data = await response.json();
      setTrendingProjects(data);
    } catch (error) {
      console.error("Error fetching trending projects:", error);
      setTrendingProjects(mockTrendingProjects);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch("/api/events/upcoming");
      const data = await response.json();
      setUpcomingEvents(data);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      setUpcomingEvents(mockUpcomingEvents);
    }
  };

  const handleFollow = (userId) => {
    console.log(`Follow user with ID: ${userId}`);
  };

  const renderContent = () => {
    if (activeSection === "home") {
      return (
        <div className="content-section welcome-message animate-slide">
          <div className="hero-section">
            <h2>Welcome to SkillPilot!</h2>
            <p className="hero-subtitle">
              Your gateway to collaborative learning and professional
              development.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Active Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Expert Mentors</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Weekly Events</span>
              </div>
            </div>
          </div>

          <div className="features-section">
            <h3>Why Choose SkillPilot?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h4>Project-Based Learning</h4>
                <p>Learn by doing real-world projects with industry experts</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h4>Expert Mentorship</h4>
                <p>Connect with experienced professionals in your field</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h4>Skill Development</h4>
                <p>Track your progress and earn certifications</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌐</div>
                <h4>Global Community</h4>
                <p>Join a network of learners and professionals worldwide</p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h3>Ready to Start Your Learning Journey?</h3>
            <p>
              Join thousands of learners who are already growing their skills on
              SkillPilot
            </p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "trending":
        return (
          <div className="content-section trending-projects animate-slide">
            <h2>Trending Projects</h2>
            <div className="projects-grid">
              {mockTrendingProjects.map((project) => (
                <div key={project.id} className="project-card hover-effect">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <span className="project-category">{project.category}</span>
                  </div>
                  <p className="project-description">
                    {project.description.substring(0, 100)}...
                  </p>
                  <div className="project-meta">
                    <div className="project-stats">
                      <span className="stat">👥 {project.teamSize}</span>
                      <span className="stat">⭐ {project.popularity}</span>
                    </div>
                    <button className="join-project-btn">Join Project</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "connections":
        return (
          <div className="content-section connections animate-slide">
            <h2>Connections</h2>
            <div className="search-container">
              <input
                type="search"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="connection-search"
              />
              <button className="filter-btn">Filter</button>
            </div>
            <div className="connections-grid">
              {profileSuggestions.map((profile) => (
                <ProfileCardHome
                  key={profile.id}
                  profile={profile}
                  onFollow={handleFollow}
                  className="profile-card hover-effect"
                />
              ))}
            </div>
          </div>
        );

      case "events":
        return (
          <div className="content-section events animate-slide">
            <h2>Upcoming Events</h2>
            <div className="events-list">
              {mockUpcomingEvents.map((event) => (
                <div key={event.id} className="event-item hover-effect">
                  <div className="event-header">
                    <h3 className="event-name">{event.eventName}</h3>
                    <span className="event-date">{event.date}</span>
                  </div>
                  <div className="event-datetime">
                    <span className="event-time">🕒 {event.time}</span>
                    <span className="event-location">📍 {event.location}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-tags">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="event-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={event.registrationLink}
                    className="event-registration"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      {!isAuthenticated ? (
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-title">
              <h3>Welcome to</h3>
              <h1>SkillPilot</h1>
            </div>
            <p className="welcome-subtitle">
              Your premium platform for collaborative learning and professional
              growth
            </p>
          </div>
          <div className="welcome-features">
            <div className="feature">
              <span className="feature-icon">🚀</span>
              <span className="feature-text">Learn from Experts</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💡</span>
              <span className="feature-text">Work on Real Projects</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌐</span>
              <span className="feature-text">Join Global Community</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="main-content">
          <nav className="side-nav">
            <button
              className={`nav-link ${activeSection === "home" ? "active" : ""}`}
              onClick={() => setActiveSection("home")}
            >
              <span className="nav-icon">🏠</span>
              Home
            </button>
            <button
              className={`nav-link ${
                activeSection === "trending" ? "active" : ""
              }`}
              onClick={() => setActiveSection("trending")}
            >
              <span className="nav-icon">🔥</span>
              Trending Projects
            </button>
            <button
              className={`nav-link ${
                activeSection === "connections" ? "active" : ""
              }`}
              onClick={() => setActiveSection("connections")}
            >
              <span className="nav-icon">👥</span>
              Connections
            </button>
            <button
              className={`nav-link ${
                activeSection === "events" ? "active" : ""
              }`}
              onClick={() => setActiveSection("events")}
            >
              <span className="nav-icon">📅</span>
              Upcoming Events
            </button>
          </nav>

          <div className="content-container">{renderContent()}</div>
        </div>
      )}

      <footer className="footer-container">
        <div className="footer-links">
          <a href="/about">About</a>
          <div className="divider-vertical"></div>
          <a href="/privacy">Privacy</a>
          <div className="divider-vertical"></div>
          <a href="/terms">Terms</a>
          <div className="divider-vertical"></div>
          <a href="/contact">Contact</a>
        </div>
        <p className="copyright">© 2024 SkillPilot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
