const PanCardInfo = () => {
    return (
      <div className="page-container">
        <h2 className="section-title">PAN Card Information</h2>
        <div className="form-field">
          <label>PAN Number</label>
          <input type="text" className="form-input" placeholder="Enter PAN number" />
        </div>
        <div className="form-field">
          <label>Full Name (as on PAN)</label>
          <input type="text" className="form-input" placeholder="Enter full name as on PAN" />
        </div>
        <button className="submit-button">Save PAN Information</button>
      </div>
    );
  };
  
  export default PanCardInfo;