import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { calculateCartTotals } from '../../util/cartUtils';

const Cart = () => {
  const navigate = useNavigate();
  const {foodList, increaseQty, decreaseQty, quantities , removeFromCart} = useContext(StoreContext);
  //cart Items
  const cartItems = foodList.filter(food => quantities[food.id] > 0);

  //Calculations
   const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);
  
  return (
    <div className="container my-5">

      <h2 className="mb-4">Your Shopping Cart</h2>

      <div className="row">

        {/* Cart Items */}
        <div className="col-lg-8">


          {
          cartItems.length === 0 ? (
            <p>Your Cart is Empty</p>
          ) : (
            cartItems.map((food) => (
              <div className="card mb-3" key={food.id}>
                <div className="card-body">
                  <div className="row align-items-center">

                    <div className="col-md-3">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="img-fluid rounded"
                        width={100}
                      />
                    </div>

                    <div className="col-md-5">
                      <h5 className="card-title">{food.name}</h5>
                      <p className="text-muted">{food.description}</p>
                    </div>

                    <div className="col-md-2">
                      <div className="input-group">

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => decreaseQty(food.id)}
                        >
                          -
                        </button>

                        <input
                          style={{ maxWidth: "100px" }}
                          type="text"
                          className="form-control form-control-sm text-center quantity-input"
                          value={quantities[food.id]}
                          readOnly
                        />

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => increaseQty(food.id)}
                        >
                          +
                        </button>

                      </div>
                    </div>

                    <div className="col-md-2 text-end">
                      <p className="fw-bold">&#8377;{food.price * quantities[food.id]}</p>
                        
                      

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(food.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    
                  </div>
                  <hr />
                </div>
              </div>
            ))
          )
          }

          
          <div className="text-start mb-4">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          </div>

        </div>

        {/* Cart Summary */}
        <div className="col-lg-4">

          <div className="card cart-summary">
            <div className="card-body">

              <h5 className="card-title mb-4">Order Summary</h5>

              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>&#8377;{subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span>&#8377;{subtotal === 0 ? 0.0 : shipping.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Tax</span>
                <span>&#8377;{tax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>&#8377;{subtotal === 0 ? 0.0 : total.toFixed(2)}</strong>
              </div>

              <button className="btn btn-primary w-100" disabled={cartItems.length === 0} 
              onClick={() => navigate('/Order')}>
                Proceed to Checkout
              </button>

            </div>
          </div>


        </div>

      </div>
    </div>
  )
}

export default Cart;