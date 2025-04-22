import { Outlet, useLocation } from "react-router";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import TopCategories from "../components/topCategories/TopCategoriesNav"
import DeliveryLocation from "./popups/deliveryLocation/DeliveryLocation";
import Overlay from "./popups/Overlay";

export default function App() {
	const location = useLocation();
	const isTopCategoryRequired = ()=>{
		return !(location.pathname.includes("login") || location.pathname.includes("profile"));
	} 
	return (
		<>
			<Header />
			<main className="main">
				{isTopCategoryRequired() && <TopCategories homePage={location.pathname === "/"} />}
				<Outlet />
			</main>
			<Overlay/>
			<DeliveryLocation/>
			<Footer />
		</>
	);
}
