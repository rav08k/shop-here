import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./index.css";
import App from "./components/App.jsx";
import Home from "./pages/homePage/Home";
import CategoryPage from "./pages/categoryPage/CategoryPage";
import ProductListPage from "./pages/productListPage/ProductListPage";
import ProductDetailsPage from "./pages/productDetailsPage/ProductDetailsPage";
import CartPage from "./pages/cart/CartPage";
import Profile from "./pages/profilePage/ProfilePage";
import WishlistPage from "./components/profileComponents/MyWishlist";
import SellerDashboard from "./pages/sellerDashboard/SellerDashboard";
import Loginpage from "./pages/loginPage/LoginPage";

const PrivateRoute = ({ children }) => {
	// const { isAuthenticated } = useAuth();
	const [isAuthenticated , setIsAuthenticated] = useState(true);

	return isAuthenticated ? children : <Navigate to="/login" replace />;
};

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					<Route index element={<Home />} />
					<Route path="categories/:categoryId" element={<CategoryPage />} />
					<Route path="products/:categoryId" element={<ProductListPage />} />
					<Route path="product/:productId" element={<ProductDetailsPage />} />
					<Route path="/cart" element={<CartPage />} />
					<Route
						path="/profile"
						element={
							<PrivateRoute>
								{/* <SellerDashboard /> */}
								<Profile activeCompoment="PersonalInfo" />
							</PrivateRoute>
						}
					/>
					<Route
						path="/wishlist"
						element={
							<PrivateRoute>
								<Profile activeCompoment="myWishlist" />
							</PrivateRoute>
						}
					/>
					<Route
						path="/orders"
						element={
							<PrivateRoute>
								<Profile activeCompoment="myOrders" />
							</PrivateRoute>
						}
					/>
					<Route
						path="/coupons"
						element={
							<PrivateRoute>
								<Profile activeCompoment="myCoupons" />
							</PrivateRoute>
						}
					/>
					<Route
						path="/addresses"
						element={
							<PrivateRoute>
								<Profile activeCompoment="manageAddresses" />
							</PrivateRoute>
						}
					/>
					<Route path="/login" element={<Loginpage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
