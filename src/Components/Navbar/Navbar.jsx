// import React, { useState,useContext ,useRef} from 'react'
// import { Link } from "react-router-dom";

// import './Navbar.css'
// import logo from '../Asset/logo.png'
// import cart_icon from '../Asset/cart_icon.png'
// import { ShopContext } from '../../Context/ShopContext'
// import nav_dropdown from '../Asset/dropdown_icon.png'


// const Navbar = () => {
   
//   const [menu, setmenu] = useState("shop")
//   const{getTotalCartItems, cartItem}= useContext(ShopContext);
//   const menuRef = useRef();

//   const dropdown_toggle = (e) =>{
//     menuRef.current.classList.toggle("nav-menu-visible");
//     e.target.classList.toggle('open');
//   }





//   return (
//     <div className='navbar'>
//       <div className='nav-logo'>
//         <img src={logo} alt='logo'/>
//         <p>SHOPPER</p>
//       </div>
//       <img src={nav_dropdown} alt='dropdown' className='nav-dropdown' onClick={dropdown_toggle}/>
//       <ul ref={menuRef} className="nav-menu">
//         <li onClick={() => setmenu("Shop")} className={menu === "shop" ? "active" : ""}>
//           <Link to="/" style={{ textDecoration: 'none' }}>Shop</Link>
//         </li>
//         <li onClick={() => setmenu("mens")} className={menu === "mens" ? "active" : ""}>
//           <Link to="/mens" style={{ textDecoration: 'none' }}>Men</Link>
//         </li>
//         <li onClick={() => setmenu("womens")} className={menu === "womens" ? "active" : ""}>
//           <Link to="/womens" style={{ textDecoration: 'none' }}>Women</Link>
//         </li>
//         <li onClick={() => setmenu("kids")} className={menu === "kids" ? "active" : ""}>
//           <Link to="/kids" style={{ textDecoration: 'none' }}>Kids</Link>
//         </li>
//       </ul>

//       <div className="nav-login-cart">
//         <Link to="/login" style={{ textDecoration: 'none' }}>
//           <button>Login</button>
//         </Link>
//         <Link to="/cart" style={{ textDecoration: 'none' }}>
//           <img src={cart_icon} alt='cart'/>
//         </Link>
//         <div className="nav-cart-count">{getTotalCartItems()}</div>
//       </div>
//     </div>
//   )
// }

// export default Navbar

import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';
import logo from '../Asset/logo.png';
import cart_icon from '../Asset/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Asset/dropdown_icon.png';
import { AuthContext } from '../../Context/AuthApiContext';

const Navbar = () => {
  const location = useLocation();
  const [menu, setMenu] = useState("shop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext);
  const { currentUser, logout } = useContext(AuthContext);

  useEffect(() => {
    const currentMenu = {
      '/': 'shop',
      '/mens': 'mens',
      '/womens': 'womens',
      '/kids': 'kids',
    }[location.pathname];

    if (currentMenu) {
      setMenu(currentMenu);
    }

    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleMenuClick = (value) => {
    setMenu(value);
    setIsMenuOpen(false);
  };

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo} alt='logo' />
        <p>SHOPPER</p>
      </div>

      <img
        src={nav_dropdown}
        alt='dropdown'
        className='nav-dropdown'
        onClick={() => setIsMenuOpen((value) => !value)}
        aria-label='Toggle navigation menu'
        aria-expanded={isMenuOpen}
      />

      <ul className={isMenuOpen ? "nav-menu nav-menu-visible" : "nav-menu"}>
        <li onClick={() => handleMenuClick("shop")} className={menu === "shop" ? "active" : ""}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Shop</Link>
        </li>
        <li onClick={() => handleMenuClick("mens")} className={menu === "mens" ? "active" : ""}>
          <Link to="/mens" style={{ textDecoration: 'none', color: 'inherit' }}>Men</Link>
        </li>
        <li onClick={() => handleMenuClick("womens")} className={menu === "womens" ? "active" : ""}>
          <Link to="/womens" style={{ textDecoration: 'none', color: 'inherit' }}>Women</Link>
        </li>
        <li onClick={() => handleMenuClick("kids")} className={menu === "kids" ? "active" : ""}>
          <Link to="/kids" style={{ textDecoration: 'none', color: 'inherit' }}>Kids</Link>
        </li>
      </ul>

      <div className="nav-login-cart">
        {currentUser ? (
          <div className="nav-auth-area">
            <span className="nav-user-pill">Hi, {currentUser.name}</span>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <button type="button" className="nav-profile-button">Profile</button>
            </Link>
            <button type="button" className="nav-logout-button" onClick={logout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button>Login</button>
          </Link>
        )}
        <Link to="/cart" style={{ textDecoration: 'none' }}>
          <img src={cart_icon} alt='cart' />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
