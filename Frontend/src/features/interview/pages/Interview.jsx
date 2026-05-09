import React, { useState, useEffect } from "react";
import Loader from "../../auth/components/Loader";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.js"; // ✅ ADDED
import toast from "react-hot-toast";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="q-card">
      <div className="q-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item.question}</p>
      </div>

      {open && (
        <div className="q-card__body">
          <p>
            <strong>Intention:</strong> {item.intention}
          </p>
          <p>
            <strong>Answer:</strong> {item.answer}
          </p>
        </div>
      )}
    </div>
  );
};

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  const { handleLogout } = useAuth(); // ✅ ADDED
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  if (loading || !report) {
    return <Loader />;
  }

  const scoreColor =
    report.matchScore >= 80
      ? "score--high"
      : report.matchScore >= 60
        ? "score--mid"
        : "score--low";

  return (
    <div className="interview-page">
      <div className="interview-layout">
        {/* LEFT NAV */}
        <nav className="interview-nav">
          <div className="nav-content">
            <p className="interview-nav__label">Sections</p>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${activeNav === item.id ? "interview-nav__item--active" : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* DOWNLOAD */}
          <button
            onClick={() => getResumePdf(interviewId)}
            className="button primary-button"
          >
            Download Resume
          </button>

          {/* ✅ LOGOUT BUTTON */}
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </nav>

        <div className="interview-divider" />

        {/* CENTER */}
        <main className="interview-content">
          {activeNav === "technical" && (
            <div className="q-list">
              {report.technicalQuestions.map((q, i) => (
                <QuestionCard key={i} item={q} index={i} />
              ))}
            </div>
          )}

          {activeNav === "behavioral" && (
            <div className="q-list">
              {report.behavioralQuestions.map((q, i) => (
                <QuestionCard key={i} item={q} index={i} />
              ))}
            </div>
          )}

          {activeNav === "roadmap" && (
            <div className="roadmap-list">
              {report.preparationPlan.map((day) => (
                <div key={day.day} className="roadmap-day">
                  <h3>Day {day.day}</h3>
                  <p>{day.focus}</p>
                </div>
              ))}
            </div>
          )}
        </main>

        <div className="interview-divider" />

        {/* RIGHT SIDEBAR */}
        <aside className="interview-sidebar">
          <div className="match-score">
            <h3>{report.matchScore}%</h3>
          </div>

          <div className="skill-gaps__list">
            {report.skillGaps.map((gap, i) => (
              <span key={i} className="skill-tag">
                {gap.skill}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
