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
      console.error(error);
      toast.error("Failed to send message.");
    }

    setLoading(false);
  };

  return (
    <section className="py-5">
      <div className="container">

        <div className="row justify-content-center">

          <div className="col-lg-8">

            <div className="contact-form p-5 shadow bg-white rounded">

              <h2 className="text-center mb-4">
                Get in Touch
              </h2>

              <form onSubmit={sendEmail}>

                <div className="row g-3">

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="first_name"
                      className="form-control custom-input"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="last_name"
                      className="form-control custom-input"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <input
                      type="email"
                      name="user_email"
                      className="form-control custom-input"
                      placeholder="Email Address"
                      value={formData.user_email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <textarea
                      rows="5"
                      name="message"
                      className="form-control custom-input"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-12">

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
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








// import React from 'react';
// import './Contact.css'; 
// import emailjs from "@emailjs/browser";

// const Contact = () => {
//   return (
//   <section className="py-5">
//     <div className="container">
//         <div className="row justify-content-center">
//             <div className="col-lg-8">
//                 <div className="contact-form p-5 shadow-sm bg-white">
//                     <h2 className="text-center mb-4">Get in Touch</h2>
//                     <form>
//                         <div className="row g-3">
//                             <div className="col-md-6">
//                                 <input type="text" className="form-control custom-input" placeholder="First Name"/>
//                             </div>
//                             <div className="col-md-6">
//                                 <input type="text" className="form-control custom-input" placeholder="Last Name"/>
//                             </div>
//                             <div className="col-12">
//                                 <input type="email" className="form-control custom-input" placeholder="Email Address"/>
//                             </div>
//                             <div className="col-12">
//                                 <textarea className="form-control custom-input" rows="5" placeholder="Your Message"></textarea>
//                             </div>
//                             <div className="col-12">
//                                 <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     </div>
// </section>
//   )
// }

// export default Contact;