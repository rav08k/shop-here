import { MdOutlineStarPurple500 } from "react-icons/md";
import "./productReview.css";
import { FaStar } from "react-icons/fa6";
function ProductReviewBox({ reviews }) {
	reviews.ratingData = [
		{ star: "5", value: 6689 },
		{ star: "4", value: 1890 },
		{ star: "3", value: 733 },
		{ star: "2", value: 311 },
		{ star: "1", value: 534 },
	];
	const colors = ["#ff6161", "#ff9f00", "#388e3c", "#388e3c", "#388e3c"];
	const getMaxValue = () => {
		let maxVal = 0;
		reviews.ratingData.forEach((data) => {
			if (data.value > maxVal) {
				maxVal = data.value;
			}
		});
		return maxVal;
	};
	function getRatingPercentage(val) {
		let maxVal = getMaxValue();
		return ((val / maxVal) * 100).toFixed(0) + "%";
	}
	return (
		<div className="product-review-wrapper">
			<h3>Customer Reviews</h3>
			<div className="review-top-box">
				<div className="rating-top-left">
					<div className="rating">
						<h1>{reviews.rating}</h1>
						<MdOutlineStarPurple500 />
					</div>
					<p>{reviews.ratingCount} Ratings &</p>
					<p>{reviews.reviews.length} Reviews</p>
				</div>
				<div className="rating-top-right">
					{reviews.ratingData.map((rating, i) => {
						return (
							<span key={"rating" + i}>
								{rating.star}
								<MdOutlineStarPurple500 />
								<span className="review-chart-bar">
									<span
										className="review-chart-fill"
										style={{
											width: getRatingPercentage(rating.value),
											background: colors[rating.star - 1],
										}}
									></span>
								</span>
								{rating.value}
							</span>
						);
					})}
				</div>
			</div>
			<div className="review-bottom-box">
				{reviews.reviews.map((review) => (
					<div className="review-card" key={review.id}>
						<p>
							<span
								className="review_rating_box"
								style={{ background: colors[review.rating - 1] }}
							>
								{review.rating}
								<FaStar /> 
							</span>
							<span> {review.title || review.comment}</span>
						</p>
						<p>{review.description || review.comment}</p>
						<p className="review-detail">
							<span>{review.reviewerName}, </span>
							<span>{new Date(review.date).toDateString()}</span>
						</p>
					</div>
				))}
			</div>
			.
		</div>
	);
}

export default ProductReviewBox;
