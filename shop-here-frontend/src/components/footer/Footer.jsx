import "./footer.css";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa"; 
import { FaXTwitter,FaFacebookF } from "react-icons/fa6";

function Footer() {
	return (
		<footer className="footer">
			<div className="container">
				<div className="footer_top">
					<div className="footer_link_wrap">
						<h5>ABOUT</h5>
						<ul>
							<li>About Us</li>
							<li>Contact Us</li>
							<li>Blog</li>
						</ul>
					</div>
					<div className="footer_link_wrap">
						<h5>HELP</h5>
						<ul>
							<li>Payments</li>
							<li>Shipping</li>
							<li>FAQ</li>
						</ul>
					</div>
					<div className="footer_link_wrap">
						<h5>POPULAR LINKS</h5>
						<ul>
							<li>Men</li>
							<li>Women</li>
							<li>Kids</li>
						</ul>
					</div>
					<div className="footer_link_wrap">
						<h5>CONSUMER POLICY</h5>
						<ul>
							<li>Cancellation & Returns</li>
							<li>Terms Of Use</li>
							<li>Privacy Policy</li>
						</ul>
					</div>
				</div>
        <div className="footer_bottom">
          <p>Copyright © 2025 Shop Here. All Rights Reserved</p>
          <ul className="social_icons">
            <li><FaFacebookF size={20}/></li>
            <li><FaXTwitter size={20}/></li>
            <li><FaInstagram size={20}/></li>
            <li><FaLinkedinIn size={20}/></li>
          </ul>
        </div>
			</div>
		</footer>
	);
}

export default Footer;
