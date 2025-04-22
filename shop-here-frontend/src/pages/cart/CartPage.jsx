import { useGetProductById } from "../../services/apiServices/productApiServices";
import CartCard from "../../components/cartCards/CartCard";
import "./cartPage.css";

function CartPage() {
	const { data, isLoading, error } = useGetProductById(1);
	return (
		<section className="cart">
			<div className="container">
				{isLoading ? null : (
					<>
						<div className="products-list">
							<CartCard product={data} />
							<CartCard product={data} />
						</div>

						<div className="price-details-container">
							<div className="price-details-header">PRICE DETAILS</div>

							<div className="price-details-content">
								<div className="price-row">
									<div className="price-label">
										Price ({data.length || 1} item)
									</div>
									<div className="price-value">₹{data.price}</div>
								</div>

								<div className="price-row">
									<div className="price-label">Discount</div>
									<div className="price-value discount">
										− ₹
										{((data.discountPercentage * data.price) / 100).toFixed(2)}
									</div>
								</div>

								<div className="price-row">
									<div className="price-label">Coupons for you</div>
									<div className="price-value discount">− ₹15</div>
								</div>

								<div className="price-row">
									<div className="price-label">Platform Fee</div>
									<div className="price-value">₹3</div>
								</div>

								<div className="price-row">
									<div className="price-label">Delivery Charges</div>
									<div className="price-value">
										<span className="strikethrough">₹40</span>
										<span className="free">Free</span>
									</div>
								</div>
							</div>

							<div className="price-details-divider"></div>

							<div className="price-details-footer">
								<div className="price-row total">
									<div className="price-label">Total Amount</div>
									<div className="price-value">₹{data.price}</div>
								</div>

								<div className="savings-message">
									You will save ₹
									{((data.discountPercentage * data.price) / 100).toFixed(2)} on
									this order
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</section>
	);
}

export default CartPage;
