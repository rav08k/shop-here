import React, { useState } from 'react';
import './myOrders.css';
import { useGetProductsByCategory } from '../../services/apiServices/productApiServices';

const MyOrders = ({ OrdersProducts }) => {
    // Sample data to use with the OrderHistory component
    const { data, isLoading, error } = useGetProductsByCategory("mens-shirts")
let ordersProducts = [
  {
    id: 1,
    name: "SAMSUNG Galaxy Fit3 | AMOLED Display & Activity Tracking",
    color: "Gray",
    size: "40.64",
    price: "3,358",
    image: "/images/samsung-galaxy-fit3.jpg", // Replace with actual image path
    status: "Delivered",
    deliveryDate: "Fri Mar 07"
  },
  {
    id: 2,
    name: "SAMSUNG Galaxy Fit3 | AMOLED Display & Activity Tracking",
    color: "Gray",
    size: "40.64",
    price: "3,508",
    image: "/images/samsung-galaxy-fit3.jpg", // Replace with actual image path
    status: "Refund Completed",
    refundInfo: {
      id: "CR250307065907147390801",
      message: "The money will reflect in your FLIPKARTAXISBANK MASTERCARD Credit Card **********0259 by Mar 10 06:59 AM."
    }
  },
  {
    id: 3,
    name: "ARMOXA Satin Pillows Cover",
    color: "Cream",
    price: "135",
    image: "/images/armoxa-pillows.jpg", // Replace with actual image path
    status: "Delivered",
    deliveryDate: "Feb 07"
  },
  {
    id: 4,
    name: "JEEBU Satin Bonnet & Silk Bonnet Hair Bonnet",
    color: "Gold",
    price: "90",
    image: "/images/jeebu-bonnet.jpg", // Replace with actual image path
    status: "Delivered",
    deliveryDate: "Feb 08"
  },
  {
    id: 5,
    name: "JEEBU Satin Bonnet & Silk Bonnet Hair Bonnet",
    color: "Gold",
    price: "90",
    image: "/images/jeebu-bonnet.jpg", // Replace with actual image path
    status: "Delivered",
    deliveryDate: "Feb 08"
  }
];
 ordersProducts = data;
 console.log(data);
 
 
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: {
      onTheWay: false,
      delivered: false,
      cancelled: false,
      returned: false
    },
    time: {
      last30Days: false,
      year2024: false,
      year2023: false,
      year2022: false,
      year2021: false,
      older: false
    }
  });

  const handleFilterChange = (category, filterName) => {
    setFilters({
      ...filters,
      [category]: {
        ...filters[category],
        [filterName]: !filters[category][filterName]
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality would be implemented here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="order-history-container">
      <div className="filters-sidebar">
        <h2>Filters</h2>
        
        <div className="filter-section">
          <h3>ORDER STATUS</h3>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="onTheWay" 
              checked={filters.status.onTheWay} 
              onChange={() => handleFilterChange('status', 'onTheWay')} 
            />
            <label htmlFor="onTheWay">On the way</label>
          </div>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="delivered" 
              checked={filters.status.delivered} 
              onChange={() => handleFilterChange('status', 'delivered')} 
            />
            <label htmlFor="delivered">Delivered</label>
          </div>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="cancelled" 
              checked={filters.status.cancelled} 
              onChange={() => handleFilterChange('status', 'cancelled')} 
            />
            <label htmlFor="cancelled">Cancelled</label>
          </div>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="returned" 
              checked={filters.status.returned} 
              onChange={() => handleFilterChange('status', 'returned')} 
            />
            <label htmlFor="returned">Returned</label>
          </div>
        </div>
        
        <div className="filter-section">
          <h3>ORDER TIME</h3>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="last30Days" 
              checked={filters.time.last30Days} 
              onChange={() => handleFilterChange('time', 'last30Days')} 
            />
            <label htmlFor="last30Days">Last 30 days</label>
          </div>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="year2024" 
              checked={filters.time.year2024} 
              onChange={() => handleFilterChange('time', 'year2024')} 
            />
            <label htmlFor="year2024">2024</label>
          </div>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="year2023" 
              checked={filters.time.year2023} 
              onChange={() => handleFilterChange('time', 'year2023')} 
            />
            <label htmlFor="year2023">2023</label>
          </div>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="year2022" 
              checked={filters.time.year2022} 
              onChange={() => handleFilterChange('time', 'year2022')} 
            />
            <label htmlFor="year2022">2022</label>
          </div>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="year2021" 
              checked={filters.time.year2021} 
              onChange={() => handleFilterChange('time', 'year2021')} 
            />
            <label htmlFor="year2021">2021</label>
          </div>
          <div className="filter-option">
            <input 
              type="checkbox" 
              id="older" 
              checked={filters.time.older} 
              onChange={() => handleFilterChange('time', 'older')} 
            />
            <label htmlFor="older">Older</label>
          </div>
        </div>
      </div>
      
      <div className="orders-content">
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search your orders here" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
               Search Orders
            </button>
          </form>
        </div>
        
        <div className="orders-list">
          {isLoading?null:ordersProducts.map((order, index) => (
            <div key={index} className="order-card">
              <div className="product-image">
                <img src={order.thumbnail} alt={order.title} />
              </div>
              
              <div className="product-details">
                <h3>{order.title}</h3>
                <p>{order.color && `Color: ${order.color}`} {order.size && `Size: ${order.size}`}</p>
              </div>
              
              <div className="price-info">
                <p>₹{order.price}</p>
              </div>
              
              <div className="delivery-info">
                <p className={`status-indicator ${order.status? order.status.toLowerCase():"delivered"}`}>
                  {order.status || "delivered"}
                </p>
                {order.deliveryDate && (
                  <>
                    <p>Your item has been delivered</p>
                    <button className="review-button">
                      <span className="star-icon">★</span> Rate & Review Product
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;