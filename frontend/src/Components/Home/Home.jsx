import React from 'react';
import "./Home.css";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Renders a modern landing page with clear actions and complaint guidance.
const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-modern">
      <section className="hero-section">
        <div className="hero-glow hero-glow-left"></div>
        <div className="hero-glow hero-glow-right"></div>
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="hero-kicker">RailSeva</span>
            <h1 className="hero-title">{t('Welcome to RailSeva')}</h1>
            <p className="hero-subtitle">
              {t('Your voice matters. Our AI-powered complaint management system ensures your concerns are heard and addressed efficiently.')}
            </p>
            <div className="hero-actions">
              <Link to='/complain' className="cta-primary">
                {t('File a Complaint')}
              </Link>
              <Link to='/complainstatus' className="cta-secondary">
                {t('Track Complaint')}
              </Link>
            </div>
            <div className="hero-metrics">
              <div className="metric-pill">
                <span className="metric-value">24/7</span>
                <span className="metric-label">Support</span>
              </div>
              <div className="metric-pill">
                <span className="metric-value">AI</span>
                <span className="metric-label">Auto Routing</span>
              </div>
              <div className="metric-pill">
                <span className="metric-value">Multi</span>
                <span className="metric-label">Language</span>
              </div>
            </div>
          </div>

          <div className="hero-panel hero-panel-image">
            <img
              src="/workflow-hero.png"
              alt="Workflow illustration"
              className="hero-workflow-image"
            />
          </div>
        </div>
      </section>

      <section className="features-section container">
        <h2 className="section-title">{t('Key Features')}</h2>
        <div className="feature-grid">
          <article className="feature-card">
            <i className="bi bi-lightning-charge"></i>
            <h3>{t('AI-Powered Categorization')}</h3>
            <p>{t('Our system automatically categorizes your complaints using advanced AI, ensuring faster routing and resolution.')}</p>
          </article>
          <article className="feature-card">
            <i className="bi bi-phone"></i>
            <h3>{t('Real-time Updates')}</h3>
            <p>{t('Receive instant updates on your complaint status via SMS and our mobile app, keeping you informed at every step.')}</p>
          </article>
          <article className="feature-card">
            <i className="bi bi-chat-right"></i>
            <h3>{t('Multilingual Support')}</h3>
            <p>{t('File complaints and receive support in multiple Indian languages, making the process accessible to all.')}</p>
          </article>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <h2 className="section-title">{t('How It Works')}</h2>
          <div className="process-grid">
            <article className="process-card">
              <span>1</span>
              <h3>{t('File Complaint')}</h3>
              <p>{t('Submit your complaint through our user-friendly interface or mobile app.')}</p>
            </article>
            <article className="process-card">
              <span>2</span>
              <h3>{t('AI Processing')}</h3>
              <p>{t('Our AI system categorizes and prioritizes your complaint for efficient handling.')}</p>
            </article>
            <article className="process-card">
              <span>3</span>
              <h3>{t('Staff Assignment')}</h3>
              <p>{t('The complaint is automatically assigned to the relevant department or staff member.')}</p>
            </article>
            <article className="process-card">
              <span>4</span>
              <h3>{t('Resolution & Feedback')}</h3>
              <p>{t('Receive updates on resolution progress and provide feedback on the service.')}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-section container">
        <h2 className="section-title">{t('Contact Us')}</h2>
        <div className="contact-grid">
          <article className="contact-card emergency">
            <h3>{t('Emergency Helpline')}</h3>
            <p className="contact-main">1800-111-139</p>
            <p>{t('Available 24/7 for urgent assistance')}</p>
          </article>
          <article className="contact-card general">
            <h3>{t('General Enquiries')}</h3>
            <p className="contact-main">support@railseva.in</p>
            <p>{t('For non-urgent queries and feedback')}</p>
          </article>
        </div>
      </section>

      <footer className="home-footer container">
        <a href="#terms">{t('Terms of Service')}</a>
        <a href="#privacy">{t('Privacy Policy')}</a>
        <a href="#accessibility">{t('Accessibility')}</a>
      </footer>
    </div>
  );
};

export default Home;
