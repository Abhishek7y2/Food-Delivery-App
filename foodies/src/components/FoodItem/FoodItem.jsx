import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './FoodItem.css';

export const FoodItem = ({ name, description, id, imageUrl, price, category }) => {
  const {increaseQty, decreaseQty, quantities} = useContext(StoreContext);
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center food-item-wrapper">
      <div className="food-card">
        
        <div className="food-img-container">
          {category && <span className="food-badge">{category}</span>}
          <Link to={`/food/${id}`}>
            <img src={imageUrl} className="food-img" alt={name} />
          </Link>
        </div>

        <div className="food-info">
          <Link to={`/food/${id}`} style={{ textDecoration: 'none' }}>
            <h5 className="food-title" title={name}>{name}</h5>
          </Link>
          <p className="food-desc" title={description}>
            {description}
          </p>
          
          <div className="food-meta">
            <span className="food-price">&#8377;{price}</span>
            <div className="food-rating">
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-half text-warning"></i>
            </div>
          </div>
        </div>

        <div className="food-actions">
          <Link className="btn-view" to={`/food/${id}`}>View</Link>

          {quantities[id] > 0 ? (
            <div className="qty-control">
              <button className="qty-btn minus" onClick={() => decreaseQty(id)}>
                <i className="bi bi-dash"></i>
              </button>
              <span className="qty-value">{quantities[id]}</span>
              <button className="qty-btn plus" onClick={() => increaseQty(id)}>
                <i className="bi bi-plus"></i>
              </button>
            </div>
          ) : (
            <button className="btn-add-cart" onClick={() => increaseQty(id)}>
              <i className="bi bi-plus-lg"></i>
            </button>
          )}      
        </div>
      </div>
    </div>
  )
}