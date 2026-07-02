import axios from 'axios';

const API_URL = 'http://localhost:8080/api/foods';

export const fetchFoodList = async () => {
    try {
        const response = await axios.get(API_URL);
        // const response = await axios.get('/api/foods');
        return response.data;
    }catch (error) {
        console.log('Error', error);
        throw error;

    }
}