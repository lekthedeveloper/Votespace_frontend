import React from "react";
import { Vote, Users, ArrowRight, Shield, BarChart3 } from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Header from "../components/Layout/Header";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Vote,
      title: "Smart Voting System",
      description:
        "Advanced algorithms ensure fair, secure, and anonymous voting for all participants with real-time results.",
      color: "#ffc232",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Bring your team together to make important decisions with confidence, transparency, and seamless communication.",
      color: "#ff7220",
    },
  ];

  return (
    <div className="homepage">
      <Header />

      {/* Desktop Hero Section */}
      <section className="hero-modern hidden lg:block">
        <div className="hero-container-modern">
          {/* LEFT SIDE - Abstract Compositions */}
          <div className="hero-left">
            {/* Top Left - Complex Abstract Composition */}
            <div className="geometric-zone top-left">
              <svg viewBox="0 0 200 200" fill="none">
                <defs>
                  <pattern
                    id="stripes1"
                    patternUnits="userSpaceOnUse"
                    width="8"
                    height="8"
                    patternTransform="rotate(45)"
                  >
                    <rect width="4" height="8" fill="#ff7220" />
                    <rect x="4" width="4" height="8" fill="transparent" />
                  </pattern>
                </defs>
                {/* Large beige background shape */}
                <path
                  d="M40 60C40 40, 60 20, 80 20L160 20C180 20, 200 40, 200 60L200 140C200 160, 180 180, 160 180L80 180C60 180, 40 160, 40 140Z"
                  fill="#f5dcc4"
                />
                {/* Large dark brown circle */}
                <circle cx="120" cy="120" r="60" fill="#4a2c17" />
                {/* Orange geometric shapes */}
                <rect x="60" y="40" width="40" height="40" fill="#ff7220" />
                <path
                  d="M160 80C180 80, 200 100, 200 120C200 140, 180 160, 160 160L140 160C120 160, 100 140, 100 120C100 100, 120 80, 140 80Z"
                  fill="#ff7220"
                />
                {/* Striped pattern overlay */}
                <circle cx="160" cy="60" r="25" fill="url(#stripes1)" opacity="0.8" />
                {/* Small accent circles */}
                <circle cx="180" cy="140" r="8" fill="#ff7220" />
                <circle cx="60" cy="160" r="12" fill="#f5dcc4" />
              </svg>
            </div>

            {/* Top Right - Organic Striped Composition */}
            <div className="geometric-zone top-right">
              <svg viewBox="0 0 200 150" fill="none">
                <defs>
                  <pattern
                    id="stripes2"
                    patternUnits="userSpaceOnUse"
                    width="10"
                    height="10"
                    patternTransform="rotate(45)"
                  >
                    <rect width="5" height="10" fill="#4a2c17" />
                    <rect x="5" width="5" height="10" fill="transparent" />
                  </pattern>
                </defs>
                {/* Large organic orange shape */}
                <ellipse cx="100" cy="75" rx="80" ry="50" fill="#ff7220" />
                {/* Striped overlay */}
                <ellipse cx="100" cy="75" rx="60" ry="35" fill="url(#stripes2)" opacity="0.7" />
                {/* Additional organic elements */}
                <path
                  d="M20 100C40 80, 80 85, 100 105C120 125, 110 145, 90 150C70 155, 50 145, 40 125C30 105, 30 100, 20 100Z"
                  fill="#f5dcc4"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Bottom Left - Clean Geometric Composition */}
            <div className="geometric-zone bottom-left">
              <svg viewBox="0 0 200 200" fill="none">
                {/* Large orange square */}
                <rect x="20" y="80" width="100" height="100" fill="#ff7220" />
                {/* Dark brown square overlapping */}
                <rect x="80" y="60" width="60" height="60" fill="#4a2c17" />
                {/* Large beige rectangle background */}
                <rect x="100" y="20" width="80" height="100" fill="#f5dcc4" />
                {/* Dark brown circle */}
                <circle cx="150" cy="150" r="30" fill="#4a2c17" />
                {/* Small striped accent */}
                <rect x="10" y="60" width="20" height="40" fill="url(#stripes1)" opacity="0.6" />
              </svg>
            </div>

            {/* Bottom Right - Complex Layered Composition */}
            <div className="geometric-zone bottom-right">
              <svg viewBox="0 0 200 200" fill="none">
                <defs>
                  <pattern
                    id="stripes3"
                    patternUnits="userSpaceOnUse"
                    width="12"
                    height="12"
                    patternTransform="rotate(45)"
                  >
                    <rect width="6" height="12" fill="#ff7220" />
                    <rect x="6" width="6" height="12" fill="transparent" />
                  </pattern>
                </defs>
                {/* Large beige background */}
                <rect x="20" y="20" width="120" height="80" fill="#f5dcc4" />
                {/* Large dark brown circle */}
                <circle cx="100" cy="120" r="50" fill="#4a2c17" />
                {/* Orange squares */}
                <rect x="40" y="40" width="25" height="25" fill="#ff7220" />
                <rect x="140" y="30" width="30" height="30" fill="#ff7220" />
                {/* Striped circular element */}
                <circle cx="160" cy="160" r="25" fill="url(#stripes3)" opacity="0.8" />
                {/* Small accent elements */}
                <circle cx="170" cy="80" r="8" fill="#f5dcc4" />
                <circle cx="50" cy="160" r="10" fill="#ff7220" />
              </svg>
            </div>
          </div>

          {/* RIGHT SIDE - Text Content */}
          <div className="hero-right">
            <h1 className="hero-title-modern">
              <span className="title-line-1">MAKE EASIER</span>
              <span className="title-line-2">
                YOUR <span className="highlight-text">DECISIONS</span>
              </span>
              <span className="title-line-3">WITH VOTESPACE</span>
              <div className="title-icon">
                <Vote className="vote-icon" />
              </div>
            </h1>

            <p className="hero-subtitle-modern">
              Make your team decisions easy and convenient with our innovative solutions. Manage your voting processes
              with ease - choose VoteSpace for fast and secure decision making!
            </p>

            <div className="hero-actions-modern">
              <Button className="learn-more-btn">
                Learn More
                <ArrowRight className="btn-arrow" />
              </Button>
              <Button variant="outline" className="subscribe-btn">Subscribe</Button>
            </div>

            <div className="hero-stats">
              <div className="stat-group">
                <div className="stat-item">
                  <div className="stat-number" data-number="1.25M+">
                    1.25M+
                  </div>
                  <div className="stat-label">People joined</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-number="390K+">
                    390K+
                  </div>
                  <div className="stat-label">Registered business</div>
                </div>
              </div>

              <div className="feature-card-right">
                <div className="card-icon">
                  <div className="icon-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
                <div className="card-text">
                  <strong>ANONYMOUS AND SECURE VOTING</strong>
                  <br />
                  ACCEPTED BY 50+ MILLION TEAMS
                  <br />
                  AND ORGANIZATIONS ALL OVER THE WORLD
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Hero Section */}
      <section className="lg:hidden px-4 sm:px-6 py-12 pt-24 min-h-screen bg-gradient-to-br from-[#f1efdf] to-[#f8f6f0]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-2xl mb-6 shadow-lg">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#232013] mb-4 leading-tight">
            Make Easier Your{" "}
            <span className="bg-gradient-to-r from-[#ffc232] to-[#ff7220] bg-clip-text text-transparent">
              Decisions
            </span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl">with VoteSpace</span>
          </h1>
          <p className="text-[#6b7280] text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-8">
            Make your team decisions easy and convenient with our innovative solutions. Choose VoteSpace for fast and
            secure decision making!
          </p>

        

          {/* Mobile Stats */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#232013] mb-1">1.25M+</div>
              <div className="text-xs text-[#6b7280] font-medium">People joined</div>
            </div>
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#232013] mb-1">3300+</div>
              <div className="text-xs text-[#6b7280] font-medium">Rooms</div>
            </div>
          </div>

          {/* Mobile Trust Badge */}
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[#232013] mb-1">ANONYMOUS AND SECURE VOTING</div>
                <div className="text-xs text-[#6b7280]">Trusted by 50+ million teams worldwide</div>
              </div>
              <Shield className="w-6 h-6 text-[#ffc232]" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Everything you need to make great decisions</h2>
            <p className="section-subtitle">Powerful features designed to streamline your decision-making process</p>
          </div>

          {/* Desktop Features */}
          <div className="features-grid hidden lg:grid">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card">
                <div className="feature-icon-3d">
                  <div className="icon-wrapper" style={{ backgroundColor: feature.color }}>
                    <feature.icon className="icon" />
                  </div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#232013] mb-2">Smart Voting System</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Advanced algorithms ensure fair, secure, and anonymous voting for all participants with real-time
                results.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ff7220] to-[#e55a00] rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#232013] mb-2">Team Collaboration</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Bring your team together to make important decisions with confidence, transparency, and seamless
                communication.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-r from-[#805117] to-[#a66b1f] rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#232013] mb-2">Enterprise Security</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Bank-level encryption and security protocols protect your sensitive decision-making processes.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-r from-[#b2d57a] to-[#9cb86f] rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#232013] mb-2">Real-time Analytics</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Comprehensive insights and analytics help you understand voting patterns and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Simple process, powerful results</h2>
            <p className="section-subtitle">Get started in minutes with our intuitive workflow</p>
          </div>

          {/* Desktop Steps */}
          <div className="steps-content hidden lg:grid">
            <div className="step">
              <div className="step-number-3d">
                <span>1</span>
                <Vote className="step-icon" />
              </div>
              <div className="step-info">
                <h3 className="step-title">Create Your Decision Room</h3>
                <p className="step-description">
                  Set up your question, add options, and configure voting settings in seconds
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number-3d">
                <span>2</span>
                <Users className="step-icon" />
              </div>
              <div className="step-info">
                <h3 className="step-title">Invite Your Team</h3>
                <p className="step-description">Share a secure link with your team members or stakeholders</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number-3d">
                <span>3</span>
                <Shield className="step-icon" />
              </div>
              <div className="step-info">
                <h3 className="step-title">Collect Anonymous Votes</h3>
                <p className="step-description">Team members vote privately, ensuring honest and unbiased feedback</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number-3d">
                <span>4</span>
                <BarChart3 className="step-icon" />
              </div>
              <div className="step-info">
                <h3 className="step-title">View Real-time Results</h3>
                <p className="step-description">
                  Watch results update live and make informed decisions with confidence
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Steps */}
          <div className="lg:hidden px-4 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-[#232013] mb-2">Create Your Decision Room</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Set up your question, add options, and configure voting settings in seconds
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-[#232013] mb-2">Invite Your Team</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Share a secure link with your team members or stakeholders
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-[#232013] mb-2">Collect Anonymous Votes</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Team members vote privately, ensuring honest and unbiased feedback
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-[#232013] mb-2">View Real-time Results</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Watch results update live and make informed decisions with confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to transform your decision-making?</h2>
            <p className="cta-subtitle">
              Join thousands of teams who trust VoteSpace for their most important decisions
            </p>
            <div className="cta-actions">
              <Button className="cta-primary-3d">
                <span>Get Started</span>
              </Button>
              <a href="/contact" className="cta-secondary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <section className="lg:hidden px-4 sm:px-6 py-8">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold text-[#232013] mb-3">Ready to get started?</h2>
          <p className="text-[#6b7280] text-sm mb-6 max-w-sm mx-auto">
            Join thousands of teams who trust VoteSpace for their most important decisions
          </p>
          <Button className="w-full h-12 bg-gradient-to-r from-[#232013] to-[#3a3426] hover:from-[#3a3426] hover:to-[#232013] text-white font-semibold rounded-xl">
            Get Started Free
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 bg-[#292618] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ffc232] to-[#ff7220] rounded-lg flex items-center justify-center">
                <Vote className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">VoteSpace</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 text-center">
            <p className="text-white/80 text-sm font-medium">VoteSpace 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
