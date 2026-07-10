import React, { useState } from "react";
import "./Contact.css";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    user_email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.user_email ||
      !formData.message
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success("Message sent successfully!");

      setFormData({
        first_name: "",
        last_name: "",
        user_email: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      const errorText = error?.text || error?.message || "Unknown error";
      toast.error(`Failed to send message: ${errorText}`);
    }

    setLoading(false);
  };

  return (
    <section className="contact-page-wrapper">
      <div className="container">
        
        <div className="contact-hero fade-in-up">
          <h1 className="contact-hero-title">Get In <span className="text-gradient">Touch</span></h1>
          <p className="contact-hero-subtitle">
            Have a question, feedback, or need help with your order? We'd love to hear from you. Reach out to our team below.
          </p>
        </div>

        <div className="row g-5">
          {/* Contact Information Side */}
          <div className="col-lg-5">
            <div className="contact-info-card fade-in-up" style={{animationDelay: '0.1s'}}>
              
              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="info-content">
                  <h4>Head Office</h4>
                  <p>123 Foodie Lane, Flavor Town<br />Mumbai, MH 400001, India</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div className="info-content">
                  <h4>Phone Support</h4>
                  <p>+91 9415129167<br />Mon-Fri, 9am - 8pm</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div className="info-content">
                  <h4>Email Us</h4>
                  <p>support@foodiesapp.com<br />contact@foodiesapp.com</p>
                </div>
              </div>

              <div className="social-links">
                <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
                <a href="#" className="social-link"><i className="bi bi-twitter-x"></i></a>
                <a href="https://www.instagram.com/abhishek_yadav7y" target="_blank" rel="noopener noreferrer" className="social-link"><i className="bi bi-instagram"></i></a>
                <a href="https://www.linkedin.com/in/abhishek-yadav8/" target="_blank" rel="noopener noreferrer" className="social-link"><i className="bi bi-linkedin"></i></a>
              </div>

            </div>
          </div>

          {/* Contact Form Side */}
          <div className="col-lg-7">
            <div className="contact-form-card fade-in-up" style={{animationDelay: '0.2s'}}>
              <form onSubmit={sendEmail}>
                <div className="row g-4">
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        className="premium-input"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        className="premium-input"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="user_email"
                        className="premium-input"
                        placeholder="john@example.com"
                        value={formData.user_email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Your Message</label>
                      <textarea
                        name="message"
                        className="premium-input"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12 pt-2">
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...</>
                      ) : (
                        <>Send Message <i className="bi bi-send"></i></>
                      )}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;