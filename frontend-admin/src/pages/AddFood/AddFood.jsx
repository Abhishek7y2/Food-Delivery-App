import axios from 'axios'
import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { addFood } from "../../services/foodService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './AddFood.css';

const AddFood = () => {
  const [image, setImage] = useState(false);
  const[data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Biryani',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({...data, [name]: value});
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if(!image){
      toast.error('Please select an image');
      return;
    }
    try{
      await addFood(data, image);
      toast.success('Food added successfully');
      setData({name: '', description: '', category: 'Biryani', price: ''});
      setImage(null);
    } catch(error){
     toast.error('Error adding food.');
    }
  }

  return (
    <div className="add-food-container">
      <div className="modern-card">
        <div className="modern-card-body">
          <h2 className="modern-title">Add New Food</h2>
          <form onSubmit={onSubmitHandler}>
            
            <div className="modern-form-group">
              <label htmlFor="image" className="modern-label">Product Image</label>
              <label htmlFor="image" className="upload-area">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="Preview" className="upload-preview"/>
                ) : (
                  <div className="upload-placeholder">
                    <i className="bi bi-cloud-arrow-up-fill upload-icon"></i>
                    <span className="upload-text">Click to upload image</span>
                  </div>
                )}
              </label>
              <input type="file" id="image" hidden onChange={(e)=> setImage(e.target.files[0])} accept="image/*"/>
            </div>

            <div className="modern-form-group">
              <label htmlFor="name" className="modern-label">Product Name</label>
              <input type="text" placeholder="E.g. Chicken Biryani" className="modern-input" id="name" required name="name" onChange={onChangeHandler} value={data.name}/>
            </div> 

            <div className="modern-form-group">
              <label htmlFor="description" className="modern-label">Description</label>
              <textarea className="modern-textarea" placeholder="Describe the food item..." id="description" required name="description" onChange={onChangeHandler} value={data.description}></textarea>
            </div>

            <div className="row">
              <div className="col-md-6 modern-form-group">
                <label htmlFor="category" className="modern-label">Category</label>
                <select name="category" id="category" className="modern-select" onChange={onChangeHandler} value={data.category}>
                  <option value="Biryani">Biryani</option>
                  <option value="Cake">Cake</option>
                  <option value="Burger">Burger</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Salad">Salad</option>
                  <option value="Ice Cream">Ice Cream</option>
                  <option value="Pizza">Pizza</option>
                </select> 
              </div>
              
              <div className="col-md-6 modern-form-group">
                <label htmlFor="price" className="modern-label">Price (&#8377;)</label>
                <input type="number" name="price" id="price" placeholder="E.g. 250" className="modern-input" onChange={onChangeHandler} value={data.price} required/>
              </div>
            </div>

            <button type="submit" className="modern-btn">Add Food Item</button>
          </form>
        </div>
      </div>
    </div>
  )
};
export default AddFood;
