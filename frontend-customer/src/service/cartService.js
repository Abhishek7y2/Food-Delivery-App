import apiClient from './apiClient';

export const addToCart = async (foodId) => {
    try {
        await apiClient.post('/cart', { foodId });
    } catch (error) {
        console.error(
            "Error while adding cart:",
            error.response?.data || error.message 
        );
        throw error;
    }
};

export const removeQtyFromCart = async (foodId) => {
    try {
        await apiClient.post('/cart/remove', { foodId });
    } catch (error) {
        console.error(
            "Error while removing cart:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const getCartData = async () => {
    try {
        const response = await apiClient.get('/cart');
        return response.data.items || {};  
    } catch (error) {
        console.error(
            "Error while fetching cart:",
            error.response?.data || error.message
        );
        return {};
    }
};
