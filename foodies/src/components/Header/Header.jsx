import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import headerVideo from "../../assets/header08.mp4";

const Header = () => {
  const headerRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e) => {
    if (!headerRef.current) return;
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    headerRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  return (
    <div className="header-container" onMouseMove={handleMouseMove}>
      {/* Background Video */}
      <video className="header-video" autoPlay loop muted playsInline>
        <source src={headerVideo} type="video/mp4" />
      </video>

      {/* Premium Glass Overlay */}
      <div className="header-overlay"></div>

      {/* Content */}
      <div 
        ref={headerRef} 
        className={`header-content ${isVisible ? 'fade-in-up' : ''}`}
      >
        <div className="hero-text-box">
          <h1 className="hero-title">
            Elevate Your <br/><span className="text-gradient">Dining Experience</span>
          </h1>
          <p className="hero-subtitle">
            Discover the finest cuisines and premium drinks delivered straight to your door with exceptional speed and care.
          </p>
          
          <div className="hero-actions">
            <Link to="/explore" className="btn-premium">
              Explore Menu <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;