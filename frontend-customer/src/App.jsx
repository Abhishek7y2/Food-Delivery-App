// import React from 'react';
import React, { useContext } from 'react';
import Menubar from './components/Menubar/Menubar'; 
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Contact from './Pages/Contact/Contact';
import ExploreFood from './Pages/ExploreFood/ExploreFood';
import { StoreContext, StoreContextProvider } from './context/StoreContext';
import { FoodDetails } from './Pages/FoodDetails/FoodDetails';
import Cart from './Pages/Cart/Cart';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyOrders from './Pages/MyOrders/MyOrders';
import ChatBot from "./components/ChatBot/ChatBot";




const AppContent = () => {
  const {token} = useContext(StoreContext);
  return (
    <div>
      <Menubar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/explore' element={<ExploreFood />} />
        <Route path='/food/:id' element={<FoodDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/Order' element={token ? <PlaceOrder /> : <Login />} />
        {/* <Route path='/myorders' element={token ? <MyOrders /> : <Login />} /> */}
        <Route path='/login' element={token ? <Home /> : <Login />} />
        <Route path='/register' element={token ? <Home /> : <Register />} />
        <Route path='/myorders' element={token ? <MyOrders /> : <Login />} />
      </Routes>
      <ChatBot />
    </div>
  )
}

const App = () => {
  return (
    <StoreContextProvider>
      <AppContent />
    </StoreContextProvider>
  )
}

export default App;
