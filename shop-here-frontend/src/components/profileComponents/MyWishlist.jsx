import React, { useState, useEffect } from 'react';
import './myWishlist.css';
import { useGetProductsByCategory } from '../../services/apiServices/productApiServices';

const WishlistPage = () => {
  const { data, isLoading, error } = useGetProductsByCategory("womens-dresses");
  let wishlistItems = data;
console.log(data);

  const calculateFinalPrice = (price, discountPercentage) => {
    return price - (price * (discountPercentage / 100));
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-card">
        <div className="wishlist-header">
          <h1>My Wishlist ({wishlistItems && wishlistItems.length})</h1>
        </div>
        
        <div className="wishlist-items">
          {isLoading ? <p>Loading...</p> : wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <div className="item-image">
                <img src={item.thumbnail} alt={item.title} />
              </div>
              
              <div className="item-details">
                <div className="item-header">
                  <div className="item-info">
                    <h2>{item.title}</h2>
                    
                    {item.brand && (
                      <div className="item-brand">
                        {item.brand}
                      </div>
                    )}
                    
                    {/* {item.assured && (
                      <div className="item-assured">
                        <span>Assured</span>
                      </div>
                    )} */}
                    
                    <div className="item-price">
                      <span className="current-price">₹{item.price.toLocaleString()}</span>
                      {/* <span className="original-price">₹{item.originalPrice.toLocaleString()}</span> */}
                      <span className="discount">{item.discountPercentage}% off</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="remove-button"
                    aria-label="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;