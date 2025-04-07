import React, { useState,useContext } from 'react'
import { Link } from "react-router-dom";

import './Navbar.css'
import logo from '../Asset/logo.png'
import cart_icon from '../Asset/cart_icon.png'
import { ShopContext } from '../../Context/ShopContext'
const Navbar = () => {
   
  const [menu, setmenu] = useState("shop")
  const{getTotalCartItems, cartItem}= useContext(ShopContext);



  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt='logo'/>
        <p>SHOPPER</p>
      </div>
      <ul className="nav-menu">
        <li onClick={() => setmenu("Shop")} className={menu === "shop" ? "active" : ""}>
          <Link to="/" style={{ textDecoration: 'none' }}>Shop</Link>
        </li>
        <li onClick={() => setmenu("mens")} className={menu === "mens" ? "active" : ""}>
          <Link to="/mens" style={{ textDecoration: 'none' }}>Men</Link>
        </li>
        <li onClick={() => setmenu("womens")} className={menu === "womens" ? "active" : ""}>
          <Link to="/womens" style={{ textDecoration: 'none' }}>Women</Link>
        </li>
        <li onClick={() => setmenu("kids")} className={menu === "kids" ? "active" : ""}>
          <Link to="/kids" style={{ textDecoration: 'none' }}>Kids</Link>
        </li>
      </ul>

      <div className="nav-login-cart">
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button>Login</button>
        </Link>
        <Link to="/cart" style={{ textDecoration: 'none' }}>
          <img src={cart_icon} alt='cart'/>
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar