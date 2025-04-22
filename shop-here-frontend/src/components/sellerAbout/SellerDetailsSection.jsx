import React, { useState } from "react";
import "./sellerDetailsSection.css";


// Add this function to render seller details
const renderSellerDetails = ({sellerInfo, setSellerInfo}) => {
  
	// Add this edit state
	const [editingProfile, setEditingProfile] = useState(false);

	// Add this function to handle profile edit
	const handleProfileEdit = () => {
		setEditingProfile(!editingProfile);
	};

	// Add this function to handle profile input changes
	const handleProfileChange = (e) => {
		const { name, value } = e.target;

		// Handle nested objects
		if (name.includes(".")) {
			const [parent, child] = name.split(".");
			setSellerInfo({
				...sellerInfo,
				[parent]: {
					...sellerInfo[parent],
					[child]: value,
				},
			});
		} else {
			setSellerInfo({
				...sellerInfo,
				[name]: value,
			});
		}
	};

	// Add this function to save profile changes
	const handleProfileSave = () => {
		setEditingProfile(false);
		// Here you would typically send the updated profile to your backend
		alert("Profile updated successfully!");
	};
	return (
		<div className="seller-details-section">
			<div className="section-header">
				<h2>Seller Profile</h2>
				<button
					className={editingProfile ? "cancel-button" : "edit-button"}
					onClick={handleProfileEdit}
				>
					{editingProfile ? "Cancel" : "Edit Profile"}
				</button>
			</div>

			<div className="seller-profile-content">
				<div className="seller-profile-header">
					<div className="seller-avatar">
						<img src={sellerInfo.profileImage} alt="Seller Profile" />
						{editingProfile && (
							<div className="avatar-overlay">
								<span>Change Photo</span>
							</div>
						)}
					</div>
					<div className="seller-header-info">
						{editingProfile ? (
							<input
								type="text"
								name="storeTitle"
								value={sellerInfo.storeTitle}
								onChange={handleProfileChange}
								className="edit-input store-title-input"
							/>
						) : (
							<h3>{sellerInfo.storeTitle}</h3>
						)}
						{/* <div className="seller-stats">
							<div className="stat">
								<span className="stat-value">{sellerInfo.totalProducts}</span>
								<span className="stat-label">Products</span>
							</div>
							<div className="stat">
								<span className="stat-value">{sellerInfo.totalSales}</span>
								<span className="stat-label">Sales</span>
							</div>
							<div className="stat">
								<span className="stat-value">{sellerInfo.joinDate}</span>
								<span className="stat-label">Join Date</span>
							</div> */}
              <div className="info-cards">
            <div className="info-card">
              <div className="info-card-icon">📦</div>
              <div className="info-card-content">
                <h4>Total Products</h4>
                <p>{sellerInfo.totalProducts}</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">💰</div>
              <div className="info-card-content">
                <h4>Total Sales</h4>
                <p>{sellerInfo.totalSales}</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">📅</div>
              <div className="info-card-content">
                <h4>Selling Since</h4>
                <p>{sellerInfo.joinDate}</p>
              </div>
            </div>
						</div>
					</div>
				</div>

				<div className="seller-details-grid">
					<div className="seller-details-card">
						<h4>Personal Information</h4>
						<div className="details-group">
							<label>Name</label>
							{editingProfile ? (
								<input
									type="text"
									name="name"
									value={sellerInfo.name}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.name}</p>
							)}
						</div>
						<div className="details-group">
							<label>Email</label>
							{editingProfile ? (
								<input
									type="email"
									name="email"
									value={sellerInfo.email}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.email}</p>
							)}
						</div>
						<div className="details-group">
							<label>Phone</label>
							{editingProfile ? (
								<input
									type="text"
									name="phone"
									value={sellerInfo.phone}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.phone}</p>
							)}
						</div>
					</div>

					<div className="seller-details-card">
						<h4>Store Information</h4>
						<div className="details-group">
							<label>Description</label>
							{editingProfile ? (
								<textarea
									name="description"
									value={sellerInfo.description}
									onChange={handleProfileChange}
									className="edit-input description-input"
								/>
							) : (
								<p>{sellerInfo.description}</p>
							)}
						</div>
						<div className="details-group">
							<label>Address</label>
							{editingProfile ? (
								<input
									type="text"
									name="address"
									value={sellerInfo.address}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.address}</p>
							)}
						</div>
						<div className="details-group">
							<label>Pincode</label>
							{editingProfile ? (
								<input
									type="text"
									name="pincode"
									value={sellerInfo.pincode}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.pincode}</p>
							)}
						</div>
					</div>

					<div className="seller-details-card">
						<h4>Bank Details</h4>
						<div className="details-group">
							<label>Account Name</label>
							{editingProfile ? (
								<input
									type="text"
									name="bankDetails.accountName"
									value={sellerInfo.bankDetails.accountName}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.bankDetails.accountName}</p>
							)}
						</div>
						<div className="details-group">
							<label>Account Number</label>
							{editingProfile ? (
								<input
									type="text"
									name="bankDetails.accountNumber"
									value={sellerInfo.bankDetails.accountNumber}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.bankDetails.accountNumber}</p>
							)}
						</div>
						<div className="details-group">
							<label>Bank Name</label>
							{editingProfile ? (
								<input
									type="text"
									name="bankDetails.bankName"
									value={sellerInfo.bankDetails.bankName}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.bankDetails.bankName}</p>
							)}
						</div>
						<div className="details-group">
							<label>IFSC Code</label>
							{editingProfile ? (
								<input
									type="text"
									name="bankDetails.ifscCode"
									value={sellerInfo.bankDetails.ifscCode}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.bankDetails.ifscCode}</p>
							)}
						</div>
					</div>

					<div className="seller-details-card">
						<h4>Tax Information</h4>
						<div className="details-group">
							<label>GST Number</label>
							{editingProfile ? (
								<input
									type="text"
									name="taxInfo.gstNumber"
									value={sellerInfo.taxInfo.gstNumber}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.taxInfo.gstNumber}</p>
							)}
						</div>
						<div className="details-group">
							<label>PAN Number</label>
							{editingProfile ? (
								<input
									type="text"
									name="taxInfo.panNumber"
									value={sellerInfo.taxInfo.panNumber}
									onChange={handleProfileChange}
									className="edit-input"
								/>
							) : (
								<p>{sellerInfo.taxInfo.panNumber}</p>
							)}
						</div>
					</div>
				</div>

				{editingProfile && (
					<div className="profile-actions">
						<button className="update-button" onClick={handleProfileSave}>
							Save Changes
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default renderSellerDetails;