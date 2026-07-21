import React, { useRef } from 'react';
import { categories } from '../../assets/assets';
import './ExploreMenu.css';

const ExploreMenu = ({category, setCategory}) => {
  
  const menuRef = useRef(null);

  const scrollRight = () => {
    if(menuRef.current) {
      menuRef.current.scrollBy({left: 200, behavior: 'smooth'});
    }
  };

  const scrollLeft = () => {
    if(menuRef.current) {
      menuRef.current.scrollBy({left: -200, behavior: 'smooth'});
    }
  };

  return (
    <div className="explore-menu position-relative">

        <div className="d-flex align-items-center justify-content-between">
            <h1 className="mb-0 fw-bold">Explore Our Menu</h1>
            <div className="d-flex gap-2">
                
                <i className='bi bi-arrow-left-circle scroll-icon fs-3' onClick={scrollLeft}></i>
                <i  className='bi bi-arrow-right-circle scroll-icon fs-3' onClick={scrollRight}></i>
            </div>
        </div>

        <p>Explore curated lists of dishes from top categories</p>

        
        <div className="d-flex justify-content-between gap-4 overflow-auto explore-menu-list" ref={menuRef}>
          {
            categories.map((item, index) => {
              return (
                <div key={index} className="text-center explore-menu-list-item" onClick={() => setCategory(prev => prev === item.category ? 'All': item.category )}  >
                  <img 
                      src={item.icon} 
                      alt="" 
                      className={item.category === category ? "rounded-circle active" : "rounded-circle"} 
                      height={100} 
                      width={100} 
                  />
                  <p className='mt-2 fw-bold'>{item.category}</p>
                </div>
              )
            })
          }
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu;