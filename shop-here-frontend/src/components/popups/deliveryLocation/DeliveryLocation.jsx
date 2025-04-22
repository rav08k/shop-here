import "./deliveryLocation.css";
import useDeliveryPin from "../../../stores/deliveryPinStore";
import { useState } from "react";
import { Link } from "react-router";
function DeliveryLocation() {
	const { setDeliveryPin, isPopupOpen, setIsPopupOpen } = useDeliveryPin();
	const [pin, setPin] = useState("");

	function handlePinChange(e) {
		e.preventDefault();
		setDeliveryPin(pin);
		closePopup();
	}
	function closePopup() {
		setPin("");
		setIsPopupOpen(false);
	}

	function onInputChangeHanlder(e) {
		setPin(e.target.value);
	}
	return (
		<>
			{isPopupOpen ? (
				<div className="location-popup">
					<div className="top-title">
						<h1>Choose your location</h1>
						<button type="button" onClick={closePopup}>
							X
						</button>
					</div>
					<div className="location-bottom">
						<p>
							Select a delivery location to see product availability and
							delivery options
						</p>
						
						<Link to="/login" className="loc-btn" onClick={closePopup}>sign in to see your address</Link>
					</div>
					<div className="loc-bot-middle">
						<hr />
						<span>or enter an Indian pincode</span>
						<hr />
					</div>
					<div>
						<form onSubmit={handlePinChange}>
							<input
								type="text"
								minLength="6"
								maxLength="6"
								className="delivery-pin-inp"
								pattern="^\d{6}$"
								placeholder="Enter 6 digits pincode"
								value={pin}
								required={true}
								onChange={onInputChangeHanlder}
							/>
							<button className="apply">Apply</button>
						</form>
					</div>
				</div>
			) : null}
		</>
	);
}

export default DeliveryLocation;
