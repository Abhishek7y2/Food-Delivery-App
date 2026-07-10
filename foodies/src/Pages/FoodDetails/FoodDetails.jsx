import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchFoodDetails } from "../../service/foodService";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import './FoodDetails.css';

export const FoodDetails = () => {
  const { id } = useParams();
  const { increaseQty } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFoodDetails = async () => {
      try {
        setLoading(true);
        const foodData = await fetchFoodDetails(id);
        setData(foodData);
      } catch (error) {
        toast.error('Error displaying the food details.');
      } finally {
        setLoading(false);
      }
    }

    loadFoodDetails();
  }, [id]);

  const addToCart = () => {
    if(data) {
      increaseQty(data.id);
      navigate('/cart');
    }
  };

  if (loading || !data) {
    return (
      <div className="food-details-wrapper d-flex align-items-center justify-content-center">
        <div className="food-details-loading">
          <div className="spinner-border" role="status"></div>
          <span>Loading delicious details...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="food-details-wrapper">
      <div className="container">
        <div className="food-details-card">
          
          <div className="food-details-image-section">
            <img
              className="food-details-image"
              src={data.imageUrl}
              alt={data.name}
            />
          </div>

          <div className="food-details-info-section">
            <Link to="/explore" className="btn-back-explore">
              <i className="bi bi-arrow-left"></i> Back to Menu
            </Link>

            <span className="food-category-badge">
              {data.category}
            </span>

            <h1 className="food-title">
              {data.name}
            </h1>

            <div className="food-price">
              <span>&#8377;{data.price.toFixed(2)}</span>
            </div>

            <p className="food-description">
              {data.description || "A delicious meal prepared with the finest ingredients."}
            </p>

            <div className="food-action-container">
              <button
                className="btn-add-to-cart-large"
                type="button" 
                onClick={addToCart}
              >
                <i className="bi bi-cart-plus"></i>
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
