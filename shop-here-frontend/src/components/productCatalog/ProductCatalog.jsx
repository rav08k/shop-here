import "./productCatalog.css";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

function ProductCatalog({ images, isLoading }) {
	const [mainImg, setMainImg] = useState(null);
	function productThumnailsClickHandler(e) {
		let imgIndex = e.target.id;
		e.target.style["border"] = "solid 2px #57b7ff";
		setMainImg(images[imgIndex]);
	}
	useEffect(() => {
		if (images.length) {
			setMainImg(images[0]);
		}
	}, [images]);
	return (
		// <div className="product-catalog">
		<>
			<div className="catalog-thumbsnail">
						{isLoading || !images.length ? (
					<Skeleton count={4} width={100} height={100} />
				) : (
					<>
						{images.length &&
							images.map((image, i) => {
								return (
									<img
										src={image}
										key={uuid()}
										alt=""
										id={i}
										onMouseOver={productThumnailsClickHandler}
									/>
								);
							})}
					</>
				)}
			</div>
			<div className="product-main-img">
				{mainImg === null ? (
					<Skeleton count={1} width={600} height={550} />
				) : (
					<img src={mainImg} alt="" />
				)}
			</div>
		</>
		// </div> 
	);
}

export default ProductCatalog;
