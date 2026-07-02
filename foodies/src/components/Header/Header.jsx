// import React from 'react';
// import { Link } from 'react-router-dom';  
// import './Header.css';

// const Header = () => {
//   return (
//     <div className="p-5 mb-4 bg-light rounded-3 mt-1 header">
//       <div className='container-fluid py-5'>
//         <h1 className='display-5 fw-bold'>Order your favorite food here</h1>
//         <p className='col-md-8 fs-4'>Discover the best food and drinks in India</p>
//         <Link to="/explore" className='btn btn-primary'>Explore</Link>  
//       </div>
//     </div>
//   )
// }

// export default Header;




import { useRef } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

import headerVideo from "../../assets/header08.mp4";

const Header = () => {

  const headerRef = useRef();

  const handleMouseMove = (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 40;
    const y = (window.innerHeight / 2 - e.clientY) / 40;

    if (headerRef.current) {
      headerRef.current.style.transform =
        `translate(${x}px, ${y}px)`;
    }
  };

  return (
    <div
      className="header"
      onMouseMove={handleMouseMove}
    >

      {/* Background Video */}
      <video
        className="header-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={headerVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div
        ref={headerRef}
        className="container-fluid py-5 content"
      >
        <h1 className="display-5 fw-bold">
          Order your favorite food here
        </h1>

        <p className="col-md-8 fs-4">
          Discover the best food and drinks in India
        </p>

        <Link
          to="/explore"
          className="btn btn-primary btn-lg"
        >
          Explore Food
        </Link>
      </div>

    </div>
  );
};

export default Header;


// import { useRef } from "react";
// import { Link } from "react-router-dom";
// import "./Header.css";

// const Header = () => {

//   const headerRef = useRef();

//   const handleMouseMove = (e) => {

//     const x = (window.innerWidth / 2 - e.clientX) / 40;
//     const y = (window.innerHeight / 2 - e.clientY) / 40;

//     headerRef.current.style.backgroundPosition =
//       `${50 + x}% ${50 + y}%`;

//   };

//   return (
//     <div
//       ref={headerRef}
//       className="header p-5 mb-4 mt-1 rounded-4"
//       onMouseMove={handleMouseMove}
//     >
//       <div className="container-fluid py-5 content">

//         <h1 className="display-5 fw-bold">
//           Order your favorite food here
//         </h1>

//         <p className="col-md-8 fs-4">
//           Discover the best food and drinks in India
//         </p>

//         <Link
//           to="/explore"
//           className="btn btn-primary btn-lg"
//         >
//           Explore Food
//         </Link>

//       </div>
//     </div>
//   );
// };

// export default Header;