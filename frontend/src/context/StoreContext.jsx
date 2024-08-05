import { createContext, useEffect, useState } from "react";
import axios from 'axios'



export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems,setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token,setToken] = useState('')
    const [food_list,setFoodList] = useState([])
    
    

    const addToCart = async (itemId) => {
        if(!cartItems[itemId]) {
            setCartItems((prev) => ({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev) => ({...prev,[itemId]:prev[itemId] +1}))
        }
        if(token) {
            await axios.post(url + '/api/cart/add', {itemId},{headers:{token}})
        }
    }

    const removeFromCart =  async(itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId] -1}))
        if (token) {
            await axios.post(url + '/api/cart/remove',{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems) {
            if(cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                totalAmount += itemInfo.price * cartItems[item]
            }
        }
        return totalAmount;
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error('Failed to load cart data:', error);
        }
    };

    useEffect(() => {
        // Retrieve token from localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }

        // Fetch food list data from the API
        const fetchFoodList = async () => {
            try {
                const response = await fetch(`${url}/api/foods/`);
                const data = await response.json();
                setFoodList(data);
            } catch (error) {
                console.error('Failed to fetch food list:', error);
            }
        };

        // Load food list and cart data if token exists
        if (storedToken) {
            fetchFoodList();
            loadCartData(storedToken);
        }
    }, [url]);


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children} 
        </StoreContext.Provider>
    )
}


export default StoreContextProvider;