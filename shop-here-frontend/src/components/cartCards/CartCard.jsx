import { useState } from "react";
import "./cartCard.css";
function CartCard({product}) {
    console.log(product);
    const [quantity, setQuantity] = useState(product.quantity || 1);
    const decreaseQuantity = () => {
        if (quantity > 1) {
          setQuantity(quantity - 1);
        }
      };
    
      const increaseQuantity = () => {
        setQuantity(quantity + 1);
      };
    
  return (
    <div className="cart-card">
        <div className="cart-card-description">
            <img src={product.thumbnail} alt="" className="cart-card-img" />
            <div className="cart-card-desc-middle">
                <h3 className="cart-card-title">{product.title}</h3>
                <p className="cart-card-size">{product.selectedSize}</p>
                <p className="cart-card-brand">Brand: {product.brand}</p>
                <div className="cart-card-price">
                    <p className="cost-price">₹{((product.price + (product.price * product.discountPercentage / 100)) * quantity).toFixed(2)}</p>
                    <p className="selling-price">₹{product.price * quantity}</p>
                    <p className="discount">{product.discountPercentage}% Off</p>
                </div>
            </div>
            <div className="cart-card-desc-end">
            <p className="delivery-date">Delivery by {product.deliveryDate || "25 feb Tue"}</p>
            <p className="delivery-charge">{product.deliveryCharge}</p>
            </div>
        </div>
        <div className="cart-card-actions">
            <div className="product-quantity">
                <button className="decrease-value" onClick={decreaseQuantity}>-</button>
                <span>{quantity}</span>
                <button className="increase-value" onClick={increaseQuantity}>+</button>
            </div>
            <button>Save for Later</button>
            <button>Remove</button>
        </div>
    </div>
  )
}

export default CartCard