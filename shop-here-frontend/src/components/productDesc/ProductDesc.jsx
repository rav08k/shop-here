import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import "./productDesc.css";
import { useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ProductDetailsTable from "./ProductDetailsTable";
import ProductDeliveryBox from "./ProductDeliveryBox";
import ProductReviewBox from "../productReviews/ProductReviewBox";
function ProductDesc({ product, isLoading }) {
	useEffect(() => {
		console.log(isLoading);
	}, [isLoading]);
	return (
		<div className="product-desc">
			{isLoading ? (
				<div className="sket">
					
				<SkeletonTheme >
				<Skeleton width={150} height={28} />
				<Skeleton width={400} height={28} />
				<Skeleton width={80} height={28} />
				<hr />
				<Skeleton width={100} height={28} />
				<Skeleton width={180} height={18} />
				<Skeleton width={150} height={22} />
				<div className="prod-size-sket">
				<Skeleton count={4} width={50} height={50} circle={true} inline={true}/>

				</div>

				</SkeletonTheme>
				</div>
			) : (
				<>
					<h1 className="brand-name">{product.brand}</h1>
					<p className="product-title">{product.title}</p>
					<div className="product-rating-cont">
						<span className="product_rating_box">
							{product.rating}
							<FaStar color={"green"} />
						</span>
						<span className="product_rating_count">{`(${
							product.ratingCount || 100
						})`}</span>
					</div>
					<hr />
					<div className="product-price-wrap">
						<p className="product-price">{"₹" + product.price}</p>
						<p>inclusive all taxes</p>
					</div>
					<div className="product-size-cont">
						<h5>SELECT SIZE</h5>
						{(product.sizes || ["S", "M", "L", "XL"]).map((s) => (
							<span key={s} className="product_sizes">
								{s}
							</span>
						))}
					</div>
					<div className="product_btns">
						<button className="product_btn wishlist">
							<FaHeart />
							Wishlist
						</button>
						<button className="product_btn cart">
							<FaCartShopping />
							Cart
						</button>
					</div>
					<ProductDeliveryBox returnPol={product.returnPolicy}/>
					<hr />
					<div className="prod-desc">
						<h3>Product Description</h3>
						<p>{product.description}</p>
					</div>
					<ProductDetailsTable productDetails={product.meta}/>
					<hr />
					<ProductReviewBox reviews={{reviews:product.reviews,rating:product.rating,ratingCount:product.ratingCount|| 100}}/>
				</>
			)}
		</div>
	);
}

export default ProductDesc;
