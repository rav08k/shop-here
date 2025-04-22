import "./productCard.css";
import { v4 as uuidv4 } from "uuid";
import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
function ProductCard({ product }) {
	return (
			<div className="product_card">
				<div className="product_card_img">
					<img src={product.thumbnail} alt="product" />
				</div>
				<div className="product_card_content">
					<div className="product_info">
						<p className="product_card_brand">{product.brand || product.title}</p>
						<p className="product_card_desc">{product.brand ? product.title : product.description}</p>
						<div className="product_rating_container">
							<span className="product_rating_box">
								{product.rating}
								<FaStar />
							</span>
							<span className="product_rating_count">{`(${product.ratingCount || 100})`}</span>
						</div>
					</div>
					<div className="product_info_overlay">
						<div className="product_btns">
							<button className="product_card_btn wishlist">
								<FaHeart />
								Wishlist
							</button>
							<button className="product_card_btn cart">
								<FaCartShopping />
								Cart
							</button>
						</div>
						<p className="product_color_box">
                            Colors :
							{(product.colors || ["#000", "#0f0", "#00f", "#f00"]).map((c) => (
								<span
									key={uuidv4()}
									className="product_colors"
									style={{ background: c }}
								></span>
							))}
						</p>
						<p className="product_size_box">
							Sizes:
							{(product.sizes||["S", "M", "L", "XL"]).map((s) => (
								<span key={uuidv4()} className="product_sizes">
									{s}
								</span>
							))}
						</p>
					</div>
					<h4 className="product_card_price">{"₹"+product.price}</h4>
				</div>
			</div>
	);
}

export default ProductCard;
