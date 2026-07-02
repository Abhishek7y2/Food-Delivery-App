import { createContext, useState, useEffect } from "react";
import { fetchFoodList } from "../service/foodService";
import { addToCart, removeQtyFromCart, getCartData } from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [foodList, setFoodList]     = useState([]);
    const [quantities, setQuantities] = useState({});
    const [token, setToken]           = useState("");

    const increaseQty = async (foodId) => {
        setQuantities((prev) => ({
            ...prev,
            [foodId]: (prev[foodId] || 0) + 1
        }));
        if (token) await addToCart(foodId, token);
    };

    const decreaseQty = async (foodId) => {
        setQuantities((prev) => ({
            ...prev,
            [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0
        }));
        if (token) await removeQtyFromCart(foodId, token);
    };

    const removeFromCart = (foodId) => {
        setQuantities((prev) => {
            const updated = { ...prev };
            delete updated[foodId];
            return updated;
        });
    };

    const loadCartData = async (token) => {
        if (!token) return;
        const items = await getCartData(token);
        setQuantities(items || {});
    };

    const contextValue = {
        foodList,
        increaseQty,
        decreaseQty,
        quantities,
        removeFromCart,
        token,
        setToken,
        setQuantities,
        loadCartData,
    };

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchFoodList();
                setFoodList(data);

                const savedToken = localStorage.getItem("token");
                if (savedToken) {
                    setToken(savedToken);
                    await loadCartData(savedToken);
                }
            } catch (error) {
                console.error("StoreContext Load Error:", error);
            }
        }
        loadData();
    }, []);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};



















// import { createContext, useState, useEffect } from "react";
// import { fetchFoodList } from "../service/foodService";
// import axios from "axios";
// import { addToCart, removeQtyFromCart, getCartData } from "../service/cartService";

// export const StoreContext = createContext(null);


// export const StoreContextProvider = (props) => {

//     const [foodList, setFoodList] = useState([]);
//     const [quantities, setQuantities] = useState({});
//     const [token, setToken] = useState("");

//     const increaseQty = async (foodId) => {
//         setQuantities((prev) => ({...prev, [foodId]: (prev[foodId] || 0) + 1}));
//         await addToCart(foodId, token);

//         // await axios.post('http://localhost:8080/api/cart', {foodId},{headers: {Authorization: `Bearer ${token}`}  });

//     }

//     const decreaseQty = async (foodId) => {
//         setQuantities((prev) => ({...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0}));
//         await removeQtyFromCart(foodId, token);

//         // await axios.post('http://localhost:8080/api/cart/remove', {foodId},{headers: {Authorization: `Bearer ${token}`}  });
//     };

//     const removeFromCart = (foodId) => {
//         setQuantities((prevQuantities) => {
//             const updatedQuantities = { ...prevQuantities };
//             delete updatedQuantities[foodId];
//             return updatedQuantities;
//         });
//     };

//     const loadCartData = async (token) => {
//     const items = await getCartData(token);
//     setQuantities(items || {});
//     }
 
    
//     const contextValue = {
//     foodList,
//     increaseQty,
//     decreaseQty,
//     quantities,
//     removeFromCart,
//     token,
//     setToken,
//     setQuantities,
//     loadCartData,
//     };


//     useEffect(() => {
//         async function loadData() 
//         {
//          try {
//              const data = await fetchFoodList();
//              setFoodList(data);

//              if(localStorage.getItem("token")) 
//                 {
//                  const savedToken = localStorage.getItem("token");

//                  setToken(savedToken);
//                  await loadCartData(savedToken);
//                 }
//             } 
//             catch(error) 
//             {
//               console.error("StoreContext Load Error:", error);
//             }
//         }
//         loadData();
//         }, []);
//     //     async function loadData() {
//     //         const data = await fetchFoodList();
//     //         setFoodList(data);
//     //         if(localStorage.getItem("token")) {
//     //             setToken(localStorage.getItem("token"));
//     //             await loadCartData(localStorage.getItem("token"));
//     //         }
//     //     }
//     //     loadData();
//     // }, []);

//     return (
//         <StoreContext.Provider value={contextValue}>
//             {props.children}
//         </StoreContext.Provider>
//     );
// }
