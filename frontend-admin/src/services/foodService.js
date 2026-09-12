import axios from "axios";

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api') + '/foods';

export const addFood = async (foodData, image) => {
    const formData = new FormData();
    formData.append('food', JSON.stringify(foodData));
    formData.append('file', image);
    try{
       await axios.post(API_URL, formData, {headers: {'Content-Type': 'multipart/form-data'}});

    } catch(error){
      console.log('Error ,', error);
      alert('Error adding food');
    }
};

export const getFoodList = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data;

  } catch (error) {
    console.log('Error fetching food list:', error);
    throw error;

  }
}

export const deleteFood = async (foodId) => {
  try {
    const response = await axios.delete(API_URL + "/" + foodId);
    return response.status === 204 || response.status === 200; 
  } catch (error) {
    console.log('Error while deleting food:', error);
    throw error;
  }
}

export const updateFood = async (foodId, foodData) => {
  try {
    const response = await axios.put(API_URL + "/" + foodId, foodData);
    return response.data;
  } catch (error) {
    console.log('Error while updating food:', error);
    throw error;
  }
}