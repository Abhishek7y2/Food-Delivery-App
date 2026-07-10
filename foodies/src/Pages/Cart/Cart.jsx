import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { calculateCartTotals } from '../../util/cartUtils';

const Cart = () => {
  const navigate = useNavigate();
  const { foodList, increaseQty, decreaseQty, quantities, removeFromCart } = useContext(StoreContext);
  
  // Cart Items
  const cartItems = foodList.filter(food => quantities[food.id] > 0);

  // Calculations
  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);
  
  return (
    <div className="cart-page-wrapper">
      <div className="container">
        
        <h2 className="cart-header">Your Cart</h2>

        <div className="row">
          
          {/* Cart Items List */}
          <div className="col-lg-8">
            {cartItems.length === 0 ? (
              <div className="empty-cart-container">
                <i className="bi bi-cart-x empty-cart-icon"></i>
                <h3 className="empty-cart-text">Your Cart is Empty</h3>
                <p className="empty-cart-subtext">Looks like you haven't added anything delicious yet.</p>
                <Link to="/explore" className="btn-continue-shopping">
                  <i className="bi bi-search"></i> Explore Menu
                </Link>
              </div>
            ) : (
              <>
                {cartItems.map((food) => (
                  <div className="cart-item-card" key={food.id}>
                    
                    <div className="cart-item-img-wrapper">
                      <img src={food.imageUrl} alt={food.name} className="cart-item-img" />
                    </div>

                    <div className="cart-item-details">
                      <h5 className="cart-item-title">{food.name}</h5>
                      <p className="cart-item-desc">{food.description}</p>
                      
                      <div className="premium-qty-pill">
                        <button className="qty-btn" onClick={() => decreaseQty(food.id)}>
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="text"
                          className="qty-input"
                          value={quantities[food.id]}
                          readOnly
                        />
                        <button className="qty-btn" onClick={() => increaseQty(food.id)}>
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <p className="cart-item-price">&#8377;{(food.price * quantities[food.id]).toFixed(2)}</p>
                      <button className="btn-remove-item" onClick={() => removeFromCart(food.id)}>
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </div>

                  </div>
                ))}
                
                <div className="text-start mt-4 mb-5">
                  <Link to="/explore" className="btn-continue-shopping">
                    <i className="bi bi-arrow-left"></i> Add More Items
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Cart Summary */}
          <div className="col-lg-4">
            <div className="order-summary-card">
              <h5 className="summary-title">Order Summary</h5>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>&#8377;{subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>&#8377;{subtotal === 0 ? "0.00" : shipping.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>&#8377;{tax.toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>&#8377;{subtotal === 0 ? "0.00" : total.toFixed(2)}</span>
              </div>

              <button 
                className="btn-checkout" 
                disabled={cartItems.length === 0} 
                onClick={() => navigate('/Order')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;