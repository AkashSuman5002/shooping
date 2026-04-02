import React ,{useContext} from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Asset/cart_cross_icon.png'
import { Link, useNavigate } from 'react-router-dom'

const CartItems = () => {
    const navigate = useNavigate();
    const { getTotalCartAmount, getCartLineItems, removeFromCart, getTotalCartItems } = useContext(ShopContext);
    const totalAmount = getTotalCartAmount();
    const cartLineItems = getCartLineItems();
    const totalItems = getTotalCartItems();

    if (totalItems === 0) {
        return (
            <div className="cartitems cartitems-empty">
                <h1>Your cart is empty</h1>
                <p>Browse the store and add items before starting checkout.</p>
                <Link to="/" className="cartitems-empty-link">Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Size</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {cartLineItems.map((item) => (
                <div key={`${item.id}_${item.size}`}>
                    <div className="cartitems-format cartitems-format-main">
                        <img src={item.image} alt='' className='carticon-product-icon' />
                        <p>{item.name}</p>
                        <p><span className="cartitems-size-pill">{item.size}</span></p>
                        <p>${item.new_price}</p>
                        <button className='cartitems-quantity'>{item.quantity}</button>
                        <p>${item.new_price * item.quantity}</p>
                        <img className='cartitems-remove-icon'src={remove_icon} alt='' onClick={() => { removeFromCart(item.id, item.size) }} />
                    </div>
                    <hr />
                </div>
            ))}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${totalAmount}</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                            </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${totalAmount}</h3>
                        </div>

                    </div>
                   <button onClick={() => navigate('/checkout')}>PROCEED TO CHECKOUT</button>   
                </div>
                <div className="cartitems-promocode">
                    <p>If you have a promo code ,Enter it here</p>
                    <div className="cartitem-promobox">
                        <input type="text" placeholder='Promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
             
        </div>
    );
}

export default CartItems
