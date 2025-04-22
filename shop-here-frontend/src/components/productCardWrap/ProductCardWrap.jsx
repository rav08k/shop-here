import "./productCardWrap.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductCard from "../productCard/ProductCard";
import { NavLink } from "react-router";
function ProductCardWrap({ products }) {
	return (
				<div className="product_card_container">
					{products.length ? (
						products.map((product) => {
							return (
								<NavLink
									to={"/product/" + product.id}
									key={product.id}
								>
									<ProductCard product={product} />
								</NavLink>
							);
						})
					) : (
						<Skeleton count={5} width={220} height={280} />
					)}
				</div>
	);
}

export default ProductCardWrap;
