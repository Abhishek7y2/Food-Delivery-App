import './Menubar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from '../../context/StoreContext';
import React, { useContext, useState, useEffect, useRef } from 'react';

const Menubar = () => {
  const [active, SetActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const { quantities, token, setToken, setQuantities } = useContext(StoreContext);
  
  const uniqueItemsInCart = Object.values(quantities || {}).filter(qty => qty > 0).length;
  const navigate = useNavigate();

  // Add scroll listener for floating effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken("");
    setQuantities({});
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg premium-nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src={assets.logo} alt="Foodies Logo" />
          <span className="logo-text">Foodies</span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#premiumNavContent" aria-controls="premiumNavContent" aria-expanded="false" aria-label="Toggle navigation">
          <i className="bi bi-list"></i>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse justify-content-center" id="premiumNavContent">
          <ul className="nav-links">
            <li>
              <Link className={active === 'home' ? "active" : ""} to="/" onClick={() => SetActive('home')}>Home</Link>
            </li>
            <li>
              <Link className={active === 'explore' ? "active" : ""} to="/explore" onClick={() => SetActive('explore')}>Explore Food</Link>
            </li>
            <li>
              <Link className={active === 'contact-us' ? "active" : ""} to="/contact" onClick={() => SetActive('contact-us')}>Contact us</Link>
            </li>
          </ul>
          
          {/* Actions (Cart & Auth) */}
          <div className="nav-actions d-lg-none mt-4">
            <NavActions uniqueItemsInCart={uniqueItemsInCart} token={token} navigate={navigate} logout={logout} />
          </div>
        </div>
        
        {/* Desktop Actions */}
        <div className="nav-actions d-none d-lg-flex">
           <NavActions uniqueItemsInCart={uniqueItemsInCart} token={token} navigate={navigate} logout={logout} />
        </div>

      </div>
    </nav>
  );
};

const NavActions = ({ uniqueItemsInCart, token, navigate, logout }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(localStorage.getItem('profileName') || 'John Doe');
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || assets.profile);
  const fileInputRef = useRef(null);

  const handleNameChange = (e) => {
    setProfileName(e.target.value);
    localStorage.setItem('profileName', e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    setShowProfileModal(false);
    logout();
  };

  return (
    <>
      <Link to={"/cart"} className="cart-icon-wrapper">
        <i className="bi bi-bag"></i>
        {uniqueItemsInCart > 0 && <span className="cart-badge">{uniqueItemsInCart}</span>}
      </Link>

      {!token ? (
        <div className="auth-buttons">
          <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-register" onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      ) : (
        <>
          {/* Profile Trigger */}
          <button className="profile-toggle-btn" onClick={() => setShowProfileModal(true)}>
            <img src={profileImage} alt="Profile" className="profile-img" />
          </button>

          {/* Profile Modal */}
          {showProfileModal && (
            <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
              <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
                
                <button className="close-modal-btn" onClick={() => setShowProfileModal(false)}>
                  <i className="bi bi-x"></i>
                </button>

                <div className="modal-header-center">
                  <h3>Your Profile</h3>
                  <p className="text-muted small">Manage your account details</p>
                </div>

                <div className="profile-pic-edit-container">
                  <div className="profile-pic-wrapper">
                    <img src={profileImage} alt="Profile" className="modal-profile-img" />
                    <button className="pic-edit-btn" onClick={() => fileInputRef.current.click()}>
                      <i className="bi bi-camera-fill"></i>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="file-input-hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <input 
                  type="text" 
                  className="profile-name-input" 
                  value={profileName} 
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                />

                <div className="d-flex flex-column gap-2 mt-3 w-100">
                  <button 
                    onClick={() => {
                      setShowProfileModal(false);
                      navigate('/myorders');
                    }}
                    className="btn btn-light d-flex align-items-center justify-content-center gap-2 py-2" 
                    style={{borderRadius: '12px', fontWeight: '600'}}
                  >
                    <i className="bi bi-box-seam"></i> My Orders
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileModal(false);
                      logout();
                    }} 
                    className="btn btn-danger-soft d-flex align-items-center justify-content-center gap-2 py-2" 
                    style={{borderRadius: '12px', fontWeight: '600', background: 'rgba(220,38,38,0.05)', color: '#dc2626', border: 'none'}}
                  >
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </div>

              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Menubar;