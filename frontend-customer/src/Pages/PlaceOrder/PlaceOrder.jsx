import React, { useState, useContext, useEffect } from 'react'
import './PlaceOrder.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { calculateCartTotals } from '../../util/cartUtils';
import { RAZORPAY_KEY } from '../../util/constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../../service/apiClient';
import { toast } from 'react-toastify';
import { State, City } from 'country-state-city';
import Select from 'react-select';
import _PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
const PhoneInput = _PhoneInput.default || _PhoneInput;

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    state: '',
    stateIsoCode: '',
    city: '',
    zip: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const onStateSelect = (selectedOption) => {
    setData((prev) => ({
      ...prev,
      state: selectedOption ? selectedOption.label : '',
      stateIsoCode: selectedOption ? selectedOption.value : '',
      city: '', 
    }));
  };

  const onCitySelect = (selectedOption) => {
    setData((prev) => ({
      ...prev,
      city: selectedOption ? selectedOption.value : ''
    }));
  };

  const cartItems = foodList.filter(food => quantities[food.id] > 0);
  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state} - ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map(item => ({
        foodId: item.id,
        quantity: quantities[item.id],
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };

    try {
      const response = await apiClient.post('/orders/create', orderData);
      if (response.status === 201 && response.data.razorpayOrderId) {
        if (response.data.razorpayOrderId.startsWith("MOCK_")) {
          toast.success("Order placed! (Razorpay keys invalid - Payment Mocked)");
          await clearCart();
          navigate("/myorders");
        } else {
          initiateRazorpayPayment(response.data);
        }
      } else {
        toast.error("Unable to place Order. Please try again.");
      }
    } catch (error) {
      console.error("Order Creation Error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Unable to place Order: ${errorMsg}`);
    }
  };

  const initiateRazorpayPayment = (order) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(order.amount * 100), // Amount in paise
      name: "Food Land",
      description: "Food Order Payment",
      order_id: order.razorpayOrderId,
      handler: async function (razorpayResponse) {
        await verifyPayment(razorpayResponse);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: {
        color: "#FF6B35", // Changed to primary color
        modal: {
          ondismiss: async function () {
            toast.error("Payment cancelled. Order not placed.");
            await deleteOrder(order.id);
          }
        }
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };
    try {
      const response = await apiClient.post('/orders/verify', paymentData);
      if (response.status === 200) {
        toast.success("Payment successful! Order placed.");
        await clearCart();
        navigate("/myorders");
      } else {
        toast.error("Payment failed. Please try again.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      navigate("/");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await apiClient.delete('/orders/' + orderId);
    } catch (error) {
      toast.error("Something went wrong. contact supporrt team.");
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete('/cart');
      setQuantities({});
    } catch (error) {
      toast.error("Error clearing cart. Please refresh the page.");
    }
  };

  const indianStates = State.getStatesOfCountry('IN');
  const cities = data.stateIsoCode ? City.getCitiesOfState('IN', data.stateIsoCode) : [];

  const stateOptions = indianStates.map(state => ({ value: state.isoCode, label: state.name }));
  const cityOptions = cities.map(city => ({ value: city.name, label: city.name }));

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: '0.2rem',
      borderRadius: '8px',
      border: state.isFocused ? '1px solid #ff6b35' : '1px solid #dee2e6',
      boxShadow: state.isFocused ? '0 0 0 1px #ff6b35' : 'none',
      '&:hover': {
        border: '1px solid #ff6b35'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#ff6b35' : state.isFocused ? '#fff0ea' : null,
      color: state.isSelected ? 'white' : '#333',
      cursor: 'pointer'
    }),
  };

  return (
    <div className="place-order-wrapper">
      <div className="container">

        <div className="text-center mb-5">
          <img src={assets.logo} alt="Logo" width="80" />
        </div>

        <div className="row g-5">

          {/* Order Summary Sidebar */}
          <div className="col-md-5 col-lg-4 order-md-last">
            <div className="checkout-summary-card">

              <div className="checkout-summary-title">
                Your Order
                <span className="item-count-badge">{cartItems.length} items</span>
              </div>

              <div className="checkout-item-list">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-qty">Qty: {quantities[item.id]}</span>
                    </div>
                    <span className="checkout-item-price">&#8377;{(item.price * quantities[item.id]).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Subtotal</span>
                  <span>&#8377;{subtotal.toFixed(2)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Shipping</span>
                  <span>&#8377;{subtotal === 0 ? "0.00" : shipping.toFixed(2)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Tax (10%)</span>
                  <span>&#8377;{tax.toFixed(2)}</span>
                </div>
                <div className="checkout-total-row final">
                  <span>Total</span>
                  <span>&#8377;{total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Billing Form */}
          <div className="col-md-7 col-lg-8">
            <div className="billing-card">
              <h4 className="billing-title">Billing Address</h4>

              <form onSubmit={onSubmitHandler}>
                <div className="row g-4">

                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="premium-form-label">First Name</label>
                    <input
                      type="text"
                      className="premium-input"
                      id="firstName"
                      placeholder="John"
                      required
                      name="firstName"
                      onChange={onChangeHandler}
                      value={data.firstName}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="premium-form-label">Last Name</label>
                    <input
                      type="text"
                      className="premium-input"
                      id="lastName"
                      placeholder="Doe"
                      required
                      name="lastName"
                      onChange={onChangeHandler}
                      value={data.lastName}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="premium-form-label">Email Address</label>
                    <div className="premium-input-group">
                      <span className="premium-input-group-text"><i className="bi bi-envelope"></i></span>
                      <input
                        type="email"
                        className="premium-input"
                        id="email"
                        placeholder="you@example.com"
                        required
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="phone" className="premium-form-label">Phone Number</label>
                    <PhoneInput
                      country={'in'}
                      value={data.phoneNumber}
                      onChange={phone => setData(prev => ({ ...prev, phoneNumber: phone }))}
                      inputStyle={{ width: '100%', height: '48px', borderRadius: '8px', border: '1px solid #dee2e6', fontSize: '15px', paddingLeft: '48px' }}
                      buttonStyle={{ borderRadius: '8px 0 0 8px', border: '1px solid #dee2e6', backgroundColor: '#f8f9fa', padding: '0 5px' }}
                      dropdownStyle={{ borderRadius: '8px' }}
                      enableSearch={true}
                      searchPlaceholder="Search country..."
                      containerClass="premium-phone-container"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="premium-form-label">Delivery Address</label>
                    <input
                      type="text"
                      className="premium-input"
                      id="address"
                      placeholder="1234 Main St, Apartment, Studio, or floor"
                      required
                      name="address"
                      onChange={onChangeHandler}
                      value={data.address}
                    />
                  </div>

                  <div className="col-md-5">
                    <label htmlFor="state" className="premium-form-label">State</label>
                    <Select
                      id="state"
                      options={stateOptions}
                      onChange={onStateSelect}
                      placeholder="Search state..."
                      isClearable
                      styles={customSelectStyles}
                      value={stateOptions.find(opt => opt.value === data.stateIsoCode) || null}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="city" className="premium-form-label">City</label>
                    <Select
                      id="city"
                      options={cityOptions}
                      onChange={onCitySelect}
                      placeholder={data.stateIsoCode ? "Search city..." : "Select state first"}
                      isDisabled={!data.stateIsoCode}
                      isClearable
                      styles={customSelectStyles}
                      value={cityOptions.find(opt => opt.value === data.city) || null}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="zip" className="premium-form-label">Zip Code</label>
                    <input
                      type="number"
                      className="premium-input"
                      id="zip"
                      placeholder="e.g. 110001"
                      required
                      name="zip"
                      value={data.zip}
                      onChange={onChangeHandler}
                    />
                  </div>

                </div>

                <hr className="my-5 border-light" />

                <button
                  className="btn-pay-now"
                  type="submit"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Payment <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
