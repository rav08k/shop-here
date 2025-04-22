import React, { useState } from "react";
import "./loginPage.css";

function LoginPage() {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [showLogin, setShowLogin] = useState(true);
	const [showOtpLogin, setShowOtpLogin] = useState(false);
	const [showOtpInput, setShowOtpInput] = useState(false);

	const handleContinue = () => {
		if (showLogin && !showOtpLogin) {
			console.log("Logging in with:", phoneNumber, password);
		} else if (showOtpLogin && !showOtpInput) {
			// Phone number submitted, show OTP input
			console.log("Phone number submitted for OTP:", phoneNumber);
			setShowOtpInput(true);
		} else if (showOtpLogin && showOtpInput) {
			// OTP verification
			console.log("Verifying OTP:", otp, "for phone:", phoneNumber);
		} else {
			console.log("Registering with:", name, email, password);
		}
	};

	const toggleForm = () => {
		setShowLogin(!showLogin);
		setShowOtpLogin(false);
		setShowOtpInput(false);
		// Reset form fields when switching forms
		setPhoneNumber("");
		setPassword("");
		setName("");
		setEmail("");
		setOtp("");
	};

	const switchToOtpLogin = () => {
		setShowOtpLogin(true);
		setShowOtpInput(false);
		setPassword("");
		setOtp("");
	};

	const switchToPasswordLogin = () => {
		setShowOtpLogin(false);
		setShowOtpInput(false);
		setOtp("");
	};

	const getFormTitle = () => {
		if (!showLogin) return "Create Account";
		if (showOtpLogin) {
			return showOtpInput ? "Enter OTP" : "Login with OTP";
		}
		return "Login";
	};

	const renderForm = () => {
		if (!showLogin) {
			// Register Form
			return (
				<div className="input-container">
					<input
						type="text"
						className="form-input"
						placeholder="Full Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="email"
						className="form-input"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="text"
						className="form-input"
						placeholder="Phone Number"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
					/>
					<input
						type="password"
						className="form-input"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			);
		} else if (showOtpLogin) {
			if (showOtpInput) {
				// OTP Input Screen
				return (
					<div className="input-container">
						<p className="otp-message">
							We've sent a verification code to {phoneNumber}
						</p>
						<input
							type="text"
							className="form-input otp-input"
							placeholder="Enter 6-digit OTP"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							maxLength="6"
						/>
						<p className="resend-text">
							Didn't receive OTP?{" "}
							<a href="#" className="help-link">
								Resend
							</a>
						</p>
					</div>
				);
			} else {
				// Phone Input for OTP
				return (
					<div className="input-container">
						<input
							type="text"
							className="form-input"
							placeholder="Phone Number"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
					</div>
				);
			}
		} else {
			// Regular Login Form
			return (
				<div className="input-container">
					<input
						type="text"
						className="form-input"
						placeholder="Phone or email"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
					/>
					<input
						type="password"
						className="form-input"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			);
		}
	};

	const getButtonText = () => {
		if (!showLogin) return "Register";
		if (showOtpLogin) {
			return showOtpInput ? "Verify OTP" : "Get OTP";
		}
		return "Login";
	};

	const renderBottomLinks = () => {
		if (!showLogin) {
			return (
				<p className="help-text">
					Already have an account?{" "}
					<a href="#" className="help-link" onClick={toggleForm}>
						Login
					</a>
				</p>
			);
		}

		if (showOtpLogin) {
			return (
				<>
					{showOtpInput ? null : (
						<p className="help-text">
							Login with{" "}
							<a href="#" className="help-link" onClick={switchToPasswordLogin}>
								Password
							</a>
						</p>
					)}
					<p className="help-text">
						Don't have an account?{" "}
						<a href="#" className="help-link" onClick={toggleForm}>
							Register
						</a>
					</p>
				</>
			);
		}

		return (
			<>
				<p className="help-text">
					Login using{" "}
					<a href="#" className="help-link" onClick={switchToOtpLogin}>
						OTP
					</a>
				</p>
				<p className="help-text">
					Don't have an account?{" "}
					<a href="#" className="help-link" onClick={toggleForm}>
						Register
					</a>
				</p>
			</>
		);
	};

	return (
		<section className="login-page">
			<div className="form-container">
				<h1 className="form-header">{getFormTitle()}</h1>

				{renderForm()}

				{!showOtpInput && (
					<p className="terms-text">
						By continuing, I agree to the{" "}
						<a href="#" className="terms-link">
							Terms of Use
						</a>{" "}
						&{" "}
						<a href="#" className="terms-link">
							Privacy Policy
						</a>
					</p>
				)}

				<button className="continue-button" onClick={handleContinue}>
					{getButtonText()}
				</button>

				{renderBottomLinks()}
			</div>
		</section>
	);
}

export default LoginPage;