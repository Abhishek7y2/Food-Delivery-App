import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

export const addToCart = async (foodId, token) => {
    try {
        await axios.post(
            API_URL,
            { foodId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error(
            "Error while adding cart:",
            error.response?.data || error.message 
        );
    }
};

export const removeQtyFromCart = async (foodId, token) => {
    try {
        await axios.post(
            `${API_URL}/remove`,
            { foodId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error(
            "Error while removing cart:",
            error.response?.data || error.message
        );
    }
};

// export const getCartData = async (token) => {
//     try {
//         const response = await axios.get(API_URL, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         return response.data; // or response.data.items depending on backend
//     } catch (error) {
//         console.error(
//             "Error while fetching cart:",
//             error.response?.data || error.message
//         );
//         return {};
//     }
// };

export const getCartData = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.items || {};  // ✅ FIX: .items add karo + fallback {}

    } catch (error) {
        console.error(
            "Error while fetching cart:",
            error.response?.data || error.message
        );
        return {};
    }
};













// import axios from 'axios';

// const API_URL = 'http://localhost:8080/api/cart';

// export const addToCart = async (foodId, token) => {
//   try {
//     await axios.post(API_URL, 
//       {foodId},{headers: {Authorization: `Bearer ${token}`}  
//     });

//   }catch (error) {
//     console.error("Error while adding cart data:", error);


//   }
  
// };
// export const getCartData = async (token) => {
//   try {
//     const response = await axios.get('http://localhost:8080/api/cart', {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error while fetching cart data:", error);
//     return {}; // <-- fallback so quantities never becomes undefined
//   }
// };

// const decreaseQty = async (foodId, token) => {
//   setQuantities((prev) => ({...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0}));
//   await removeQtyFromCart(foodId, token);
// };

// export const removeQtyFromCart = async (foodId, token) => {
//   try {
//     await axios.post('API_URL/remove', 
//     // await axios.post('API_URL/remove',
//       {foodId},{headers: {Authorization: `Bearer ${token}`}  });

//   }catch (error) {
//     console.error("Error while removing quantity from cart:", error);
    
//   }
  
// }

// export const getCartData = async (token) => {
//   try {
//     const response = await axios.get(API_URL,
//       {headers: {Authorization: `Bearer ${token}`}  
//     });
//     return response.data.items;
//   }catch (error) {
//     console.error("Error while fetching cart data:", error);
//   }
  
// }



