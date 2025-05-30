import "./nav.css";
import { useState } from "react";
import { Link, NavLink , useNavigate } from "react-router";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { GrCart } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import logo from "../../../public/assets/logo1.png";
import { useUserStore } from "../../stores/userStore";
import { logout } from "../../services/apiServices/userApiServices";
import useDeliveryPin from "../../stores/deliveryPinStore";

function Nav() {
	const [isHovered, setIsHovered] = useState(false);
	const {isAuthenticated , user} = useUserStore();
	const { deliveryPin, setIsPopupOpen, deliveryAddress } = useDeliveryPin();
	function handleClick() {
		setIsPopupOpen(true);
	}

	return (
		<nav className="nav">
			<div className="container justify-between flex-center">
				<Link className={"nav_logo"} to="/">
					<img src={logo} alt="" />
				</Link>
				<div className="nav_location_wrap">
					<IoLocationOutline className="location_icon" />
					<div className="location_text" onClick={handleClick}>
						<p className="deliver_to">
							{deliveryPin ? "Deliver to" : "Location not set"}
						</p>
						<p className="delivery_location">
							{deliveryPin || "Select delivery location"}
						</p>
					</div>
				</div>
				<input
					type="search"
					name=""
					id=""
					className="nav_search"
					placeholder="Search for products and brands"
				/>
				<div className="nav_icons_wrap">
					<div
						className="user"
						onMouseOver={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						<FaRegUser size={20} />
						<p>Profile</p>
						{isHovered && <ProfilePopup setIsHovered={setIsHovered} isLoggedIn={isAuthenticated} user = {user && user.fullName}/>}
					</div>
					<NavLink to={"/wishlist"} className="wishlist">
						<FaRegHeart size={20} />
						<p>Wishlist</p>
					</NavLink>
					<NavLink to={"/cart"} className="cart">
						<GrCart size={21} />
						<p>Cart</p>
					</NavLink>
				</div>
			</div>
		</nav>
	);
}

function ProfilePopup({
	setIsHovered,
	isLoggedIn = false,
	user = "Ravi",
	userContact = "1234567890",
}) {
	const navigate = useNavigate();
	function logoutUser() {
		logout();
		navigate("/")
	};
	return (
		<div
			className="login-popup"
			onMouseOver={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{isLoggedIn ? (
				<Link
					to={"/profile"}
					className="login-profile-link"
					onClick={() => setIsHovered(false)}
				>
					<h1 className="login-title">Hello {user}</h1>
					<p className="login-stitle">{userContact}</p>
				</Link>
			) : (
				<>
					<h1 className="login-title">Welcome</h1>
					<p className="login-stitle">To access account and manage orders</p>
					<Link to={"/login"} className="login-btn-link">
						<button className="login-btn" onClick={() => setIsHovered(false)}>
							Login/Signup
						</button>
					</Link>
				</>
			)}
			<hr />
			<ul onClick={() => setIsHovered(false)}>
				<li><Link to={"/orders"}>My Orders</Link ></li>
				<li><Link to={"/wishlist"}>My Wishlsit</Link ></li>
				<li><Link to={"/coupons"}>Coupons</Link ></li>
				<li><Link to={"/addresses"}>Saved Addresses</Link ></li>
				{isLoggedIn && (
					<>
						<hr />
						<li><Link to={"/editprofile"}>Edit Profile</Link ></li>
						<li onClick={logoutUser}>Logout</li>
					</>
				)}
			</ul>
		</div>
	);
}


export default Nav;
