import React, { useState } from "react";
import "./sellerDashboard.css";
import RenderSellerDetails from "../../components/sellerAbout/SellerDetailsSection";
const SellerDashboard = () => {
	const [activeTab, setActiveTab] = useState("products");

	function renderActiveComponent() {
		switch (activeTab) {
			case "dashboard":
				return <Dashboard />;
			case "products":
				return <Products />;
			case "orders":
				return <Orders />;
			case "settings":
				return <Settings />;
			default:
				return <Dashboard />;
		}
	}

	return (
		<section>
			<div className="container">
				<div className="dashboard-content">
					<div className="sidebar">
						<div className="sidebar-header">
							<h3>Seller Dashboard</h3>
						</div>
						<ul className="sidebar-menu">
							<li
								className={activeTab === "dashboard" ? "active" : ""}
								onClick={() => setActiveTab("dashboard")}
							>
								{/*<i className="menu-icon">📊</i>*/} Dashboard
							</li>
							<li
								className={activeTab === "products" ? "active" : ""}
								onClick={() => setActiveTab("products")}
							>
								{/*<i className="menu-icon">📦</i>*/} Products
							</li>
							<li
								className={activeTab === "orders" ? "active" : ""}
								onClick={() => setActiveTab("orders")}
							>
								{/*<i className="menu-icon">🛒</i>*/} Orders
							</li>
							{/* <li
								className={activeTab === "analytics" ? "active" : ""}
								onClick={() => setActiveTab("analytics")}
							>
                                {/*<i className="menu-icon">📈</i> Analytics
							</li> */}
							<li
								className={activeTab === "settings" ? "active" : ""}
								onClick={() => setActiveTab("settings")}
							>
								{/*<i className="menu-icon">⚙️</i>*/} Settings
							</li>
						</ul>
					</div>

					{/* Main Area */}
					<div className="main-area">{renderActiveComponent()}</div>
				</div>
			</div>
		</section>
	);
};

function Dashboard() {
	const [sellerInfo, setSellerInfo] = useState({
		name: "Sample Seller",
		email: "seller@shophere.com",
		phone: "+91 9876543210",
		address: "123 Commerce Street, E-commerce City",
		pincode: "400001",
		storeTitle: "Premium Electronics Store",
		description:
			"Specializing in high-quality electronics and gadgets for tech enthusiasts.",
		joinDate: "15 Jan 2023",
		totalProducts: 24,
		totalSales: "₹459,325",
		bankDetails: {
			accountName: "Sample Seller",
			accountNumber: "XXXX-XXXX-3456",
			bankName: "State Bank",
			ifscCode: "SBIN0001234",
		},
		taxInfo: {
			gstNumber: "GST1234567890",
			panNumber: "ABCDE1234F",
		},
		profileImage: "https://via.placeholder.com/150",
	});
	return (
		<RenderSellerDetails
			sellerInfo={sellerInfo}
			setSellerInfo={setSellerInfo}
		/>
	);
}
function Products() {
	const [products, setProducts] = useState([
		{
			id: 1,
			name: "MacBook Pro 14 inch",
			category: "Electronics",
			price: "₹169999",
			stock: 15,
			image: "https://via.placeholder.com/50",
		},
		{
			id: 2,
			name: "DELL XPS 13 9300",
			category: "Electronics",
			price: "₹127499",
			stock: 8,
			image: "https://via.placeholder.com/50",
		},
		{
			id: 3,
			name: "Blue Floral Kurta",
			category: "Men Fashion",
			price: "₹2499",
			stock: 25,
			image: "https://via.placeholder.com/50",
		},
		{
			id: 4,
			name: "Wireless Headphones",
			category: "Electronics",
			price: "₹8999",
			stock: 12,
			image: "https://via.placeholder.com/50",
		},
		{
			id: 5,
			name: "Cotton Bedsheet Set",
			category: "Home & Furniture",
			price: "₹1299",
			stock: 30,
			image: "https://via.placeholder.com/50",
		},
	]);

	// New product form state
	const [newProduct, setNewProduct] = useState({
		name: "",
		category: "Electronics",
		price: "",
		stock: "",
		image: "https://via.placeholder.com/50",
	});

	const [isAddProductOpen, setIsAddProductOpen] = useState(false);

	// Edit mode state
	const [editingId, setEditingId] = useState(null);

	// Handle product form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewProduct({
			...newProduct,
			[name]:
				name === "price"
					? value.startsWith("₹")
						? value
						: `₹${value}`
					: value,
		});
	};

	// Add new product
	const handleAddProduct = (e) => {
		e.preventDefault();
		const id =
			products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
		setProducts([...products, { id, ...newProduct }]);
		setNewProduct({
			name: "",
			category: "Electronics",
			price: "",
			stock: "",
			image: "https://via.placeholder.com/50",
		});
		setIsAddProductOpen(false);
	};

	// Start editing a product
	const handleEdit = (product) => {
		setIsAddProductOpen(true);
		setEditingId(product.id);
		setNewProduct({
			name: product.name,
			category: product.category,
			price: product.price,
			stock: product.stock,
			image: product.image,
		});
	};

	// Update an existing product
	const handleUpdateProduct = (e) => {
		e.preventDefault();
		setProducts(
			products.map((p) =>
				p.id === editingId ? { id: editingId, ...newProduct } : p
			)
		);
		setEditingId(null);
		setNewProduct({
			name: "",
			category: "Electronics",
			price: "",
			stock: "",
			image: "https://via.placeholder.com/50",
		});
		setIsAddProductOpen(false);
	};

	// Delete a product
	const handleDelete = (id) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			setProducts(products.filter((p) => p.id !== id));
		}
	};

	// Cancel editing
	const handleCancel = () => {
		setEditingId(null);
		setNewProduct({
			name: "",
			category: "Electronics",
			price: "",
			stock: "",
			image: "https://via.placeholder.com/50",
		});
		setIsAddProductOpen(false);
	};
	return (
		<div className="products-section">
			<div className="section-header">
				<h2>Your Products</h2>
				<button
					className="add-button"
					onClick={() => setIsAddProductOpen(true)}
				>
					+ Add New Product
				</button>
			</div>

			{/* Product Form */}
			{isAddProductOpen && (
				<div className="product-form-container">
					<form
						className="product-form"
						onSubmit={editingId ? handleUpdateProduct : handleAddProduct}
					>
						<h3>{editingId ? "Update Product" : "Add New Product"}</h3>
						<div className="form-group">
							<label>Product Name</label>
							<input
								type="text"
								name="name"
								value={newProduct.name}
								onChange={handleInputChange}
								required
								placeholder="Enter product name"
							/>
						</div>
						<div className="form-group">
							<label>Category</label>
							<select
								name="category"
								value={newProduct.category}
								onChange={handleInputChange}
								required
							>
								<option value="Electronics">Electronics</option>
								<option value="Men Fashion">Men Fashion</option>
								<option value="Women Fashion">Women Fashion</option>
								<option value="Kids Fashion">Kids Fashion</option>
								<option value="Home & Furniture">Home & Furniture</option>
								<option value="Appliances">Appliances</option>
								<option value="Beauty, Toys & More">Beauty, Toys & More</option>
							</select>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label>Price (₹)</label>
								<input
									type="text"
									name="price"
									value={newProduct.price}
									onChange={handleInputChange}
									required
									placeholder="₹0"
								/>
							</div>
							<div className="form-group">
								<label>Stock</label>
								<input
									type="number"
									name="stock"
									value={newProduct.stock}
									onChange={handleInputChange}
									required
									placeholder="0"
								/>
							</div>
						</div>
						<div className="form-group">
							<label>Image URL</label>
							<input
								type="text"
								name="image"
								value={newProduct.image}
								onChange={handleInputChange}
								placeholder="Enter image URL"
							/>
						</div>
						<div className="form-buttons">
							{editingId ? (
								<>
									<button type="submit" className="update-button">
										Update Product
									</button>
								</>
							) : (
								<button type="submit" className="add-button">
									Add Product
								</button>
							)}
							<button
								type="button"
								className="cancel-button"
								onClick={handleCancel}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Products Table */}
			<div className="products-table-container">
				<table className="products-table">
					<thead>
						<tr>
							<th>Image</th>
							<th>Name</th>
							<th>Category</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product.id}>
								<td>
									<img
										src={product.image}
										alt={product.name}
										className="product-thumbnail"
									/>
								</td>
								<td>{product.name}</td>
								<td>{product.category}</td>
								<td>{product.price}</td>
								<td>{product.stock}</td>
								<td className="action-buttons">
									<button
										className="edit-button"
										onClick={() => handleEdit(product)}
									>
										Edit
									</button>
									<button
										className="delete-button"
										onClick={() => handleDelete(product.id)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default SellerDashboard;
