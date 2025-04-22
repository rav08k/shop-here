import React from 'react';

const PersonalInfo = () => {
  return (
    <div className="personal-info">
      <div className="section-header">
        <h2 className="section-title">Personal Information</h2>
        <span className="edit-link">Edit</span>
      </div>
      
      <div className="form-row">
        <div className="form-field">
          <input type="text" className="form-input" defaultValue="Ravi" />
        </div>
        <div className="form-field">
          <input type="text" className="form-input" defaultValue="Kumar" />
        </div>
      </div>
      
      <div className="form-field">
        <label>Your Gender</label>
        <div className="gender-options">
          <div className="gender-option">
            <input type="radio" id="male" name="gender" defaultChecked />
            <label htmlFor="male">Male</label>
          </div>
          <div className="gender-option">
            <input type="radio" id="female" name="gender" />
            <label htmlFor="female">Female</label>
          </div>
        </div>
      </div>
      
      <div className="section-header" style={{ marginTop: '30px' }}>
        <h2 className="section-title">Email Address</h2>
        <span className="edit-link">Edit</span>
      </div>
      
      <div className="form-field">
        <input type="email" className="form-input" defaultValue="kumar08ravi99@gmail.com" />
      </div>
      
      <div className="section-header" style={{ marginTop: '30px' }}>
        <h2 className="section-title">Mobile Number</h2>
        <span className="edit-link">Edit</span>
      </div>
      
      <div className="form-field">
        <input type="tel" className="form-input" defaultValue="+918797067089" />
      </div>
      
      <div className="faq-section">
        <h3 className="section-title">FAQs</h3>
        
        <div className="faq-item">
          <p className="faq-question">What happens when I update my email address (or mobile number)?</p>
          <p className="faq-answer">Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
        </div>
        
        <div className="faq-item">
          <p className="faq-question">When will my Flipkart account be updated with the new email address (or mobile number)?</p>
          <p className="faq-answer">It happens as soon as you confirm the verification code sent to your email address (or mobile) and save the changes.</p>
        </div>
        
        <div className="faq-item">
          <p className="faq-question">What happens to my existing Flipkart account when I update my email address (or mobile number)?</p>
          <p className="faq-answer">Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.</p>
        </div>
        
        <div className="faq-item">
          <p className="faq-question">Does my Seller account get affected when I update my email address?</p>
          <p className="faq-answer">Updating your email address (or mobile number) doesn't affect your Seller account.</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
