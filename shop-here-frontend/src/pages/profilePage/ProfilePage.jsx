import React, { useEffect, useState } from 'react';
import { FaUser, FaShoppingBag, FaCog, FaMoneyBill, FaGift, FaMobile, FaList, FaHeart, FaBell, FaPowerOff } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineRight, AiOutlineMore } from 'react-icons/ai';
import './profilePage.css';

// Import page components
import PersonalInfo from '../../components/profileComponents/PersonalInfo';
import ManageAddresses from '../../components/profileComponents/MyAddress';
import MyCoupons from '../../components/profileComponents/MyCoupons';
import MyOrders from '../../components/profileComponents/MyOrders';
import AllNotifications from '../../components/profileComponents/AllNotifications'; 
import MyWishlist from '../../components/profileComponents/MyWishlist';

const Profile = ({ activeCompoment}) => {
  const [activeTab, setActiveTab] = useState(activeCompoment);
console.log(activeTab);

  // Function to render the active component based on selected tab
  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'personalInfo':
        return <PersonalInfo />;
      case 'manageAddresses':
        return <ManageAddresses />;
      case 'myCoupons':
        return <MyCoupons />;
      case 'myOrders':
        return <MyOrders/>;
    //   case 'savedCards':
    //     return <SavedCards />;
    //   case 'savedUPI':
    //     return <SavedUPI />;
      case 'allNotifications':
        return <AllNotifications />;
      case 'myWishlist':
        return <MyWishlist />;
      default:
        return <PersonalInfo />;
    }
  };

  useEffect(() => {
    setActiveTab(activeCompoment);
  }, [activeCompoment]);

  return (
    <section className='profile-page'>
    <div className="container">
      <div className="sidebar">
        <div className="user-info">
          <div className="avatar">
            <img src="/avatar-placeholder.png" alt="User avatar" />
          </div>
          <div className="user-name">
            <p>Hello,</p>
            <h3>Ravi Kumar</h3>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-section">
            <div 
              className={`menu-item ${activeTab === 'myOrders' ? 'active' : ''}`}
              onClick={() => setActiveTab('myOrders')}
              >
              <div className="menu-icon">
                <FaShoppingBag />
              </div>
              <span>MY ORDERS</span>
              <div className="arrow-icon">
                <AiOutlineRight />
              </div>
            </div>

            <div className="menu-section-title">
              <div className="menu-icon">
                <FaCog />
              </div>
              <span>ACCOUNT SETTINGS</span>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'personalInfo' ? 'active' : ''}`}
              onClick={() => setActiveTab('personalInfo')}
              >
              <span>Profile Information</span>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'manageAddresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('manageAddresses')}
              >
              <span>Manage Addresses</span>
            </div>

            {/* <div 
              className={`submenu-item ${activeTab === 'panCardInfo' ? 'active' : ''}`}
              onClick={() => setActiveTab('panCardInfo')}
              >
              <span>PAN Card Information</span>
              </div> */}
          </div>

          <div className="menu-section">
            <div className="menu-section-title">
              <div className="menu-icon">
                <FaMoneyBill />
              </div>
              <span>PAYMENTS</span>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'giftCards' ? 'active' : ''}`}
              onClick={() => setActiveTab('giftCards')}
              >
              <span>Gift Cards</span>
              <div className="price">₹0</div>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'savedUPI' ? 'active' : ''}`}
              onClick={() => setActiveTab('savedUPI')}
              >
              <span>Saved UPI</span>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'savedCards' ? 'active' : ''}`}
              onClick={() => setActiveTab('savedCards')}
            >
              <span>Saved Cards</span>
            </div>
          </div>

          <div className="menu-section">
            <div className="menu-section-title">
              <div className="menu-icon">
                <FaList />
              </div>
              <span>MY STUFF</span>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'myCoupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('myCoupons')}
              >
              <span>My Coupons</span>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'myReviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('myReviews')}
              >
              <span>My Reviews & Ratings</span>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'allNotifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('allNotifications')}
              >
              <span>All Notifications</span>
            </div>

            <div 
              className={`submenu-item ${activeTab === 'myWishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('myWishlist')}
              >
              <span>My Wishlist</span>
            </div>
          </div>
        </div>

        <div 
          className="logout-btn"
          onClick={() => console.log('Logout clicked')}
          >
          <div className="menu-icon">
            <FaPowerOff />
          </div>
          <span>Logout</span>
        </div>

        <div className="frequently-visited">
          <p>Frequently Visited:</p>
        </div>
      </div>

      <div className="content-area">
        {renderActiveComponent()}
      </div>
    </div>
            </section>
  );
};

export default Profile;