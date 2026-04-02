import React from 'react';
import Navbar from './Components/Navbar/Navbar';
import{BrowserRouter ,Routes, Route} from 'react-router-dom';
import LoginSignup from './Pages/LoginSignup';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Asset/banner_mens.png';
import women_banner from './Components/Asset/banner_women.png';
import kid_banner from './Components/Asset/banner_kids.png';
import NotFound from './Pages/NotFound';
import Checkout from './Pages/Checkout';
import OrderSuccess from './Pages/OrderSuccess';
import Profile from './Pages/Profile';
import ProtectedRoute from './Components/Auth/ProtectedRoute';

function App ()  {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/mens' element={<ShopCategory banner = {men_banner} category="men"/>}/>
        <Route path='/womens' element={<ShopCategory banner = {women_banner} category="women"/>}/>
        <Route path='/kids' element={<ShopCategory banner = {kid_banner} category="kid"/>}/>
        <Route path="/product/:productId" element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
        <Route path='/order-success' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='*' element={<NotFound/>}/>
       
      </Routes>
      <Footer/>
      </BrowserRouter>
     
    </div>
  )
}

export default App
