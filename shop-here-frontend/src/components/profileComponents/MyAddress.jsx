import React from 'react';
import { AiOutlinePlus, AiOutlineMore } from 'react-icons/ai';

const MyAddresses = () => {
  return (
    <div className="manage-addresses">
      <h2 className="section-title">Manage Addresses</h2>
      
      <div className="add-address-btn">
        <AiOutlinePlus />
        <span>ADD A NEW ADDRESS</span>
      </div>
      
      <div className="address-list">
        <div className="address-card">
          <div className="address-type">HOME</div>
          <div className="address-name">
            <span>Ravi Kumar</span>
          </div>
          <div className="address-phone">8797067089</div>
          <div className="address-details">
            4th floor, RA 647, Nabapally, Sector IV, Bidhannagar, Kolkata, West Bengal - 700105
          </div>
          <div className="address-options">
            <AiOutlineMore />
          </div>
        </div>
        <div className="address-card">
          <div className="address-type">HOME</div>
          <div className="address-name">
            <span>Ravi Kumar</span>
          </div>
          <div className="address-phone">8797067089</div>
          <div className="address-details">
            4th floor, RA 647, Nabapally, Sector IV, Bidhannagar, Kolkata, West Bengal - 700105
          </div>
          <div className="address-options">
            <AiOutlineMore />
          </div>
        </div>
        <div className="address-card">
          <div className="address-type">HOME</div>
          <div className="address-name">
            <span>Ravi Kumar</span>
          </div>
          <div className="address-phone">8797067089</div>
          <div className="address-details">
            4th floor, RA 647, Nabapally, Sector IV, Bidhannagar, Kolkata, West Bengal - 700105
          </div>
          <div className="address-options">
            <AiOutlineMore />
          </div>
        </div>
        <div className="address-card">
          <div className="address-type">HOME</div>
          <div className="address-name">
            <span>Ravi Kumar</span>
          </div>
          <div className="address-phone">8797067089</div>
          <div className="address-details">
            4th floor, RA 647, Nabapally, Sector IV, Bidhannagar, Kolkata, West Bengal - 700105
          </div>
          <div className="address-options">
            <AiOutlineMore />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAddresses;
