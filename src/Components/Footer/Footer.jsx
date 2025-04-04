import React from 'react'
import './Footer.css'
import footer_logo from '../Asset/logo_big.png'
import instgram_icon from '../Asset/instagram_icon.png'
import pintester_icon from '../Asset/pintester_icon.png'
import whatsapp_icon from '../Asset/whatsapp_icon.png'    


const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer-logo'>
            <img src={footer_logo} alt="footer_logo" />
            <p>SHOPPER</p>
            </div>
        <ul className='footer-links'>
            <li>Company</li>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
            </ul> 
            <div className="footer-social-icon">
                <div className="footer-icon-container">
                    <img src={instgram_icon} alt="instgram_icon" />
                    </div>
                    <div className="footer-icon-container">
                    <img src={pintester_icon} alt="instgram_icon" />
                    </div>
                    <div className="footer-icon-container">
                    <img src={whatsapp_icon} alt="instgram_icon" />
                    </div>

            </div>
            <div className="footer-copyright">
               <hr/>
               <p>Copyright @2025  - All Right Reserved</p>
         </div>
        </div>
      
    
  )
}

export default Footer
