import ProductCatalog from "../../components/productCatalog/ProductCatalog";
import "./productDetailsPage.css";
import { useParams } from "react-router";
import ProductDesc from "../../components/productDesc/ProductDesc";
import { useGetProductById } from "../../services/apiServices/productApiServices";

export default function ProductDetailsPage() {
	const { productId } = useParams();
	const {data:product,isLoading, error} = useGetProductById(productId)
console.log(error);
console.log(product);


	return (
		<section className="product-details-page">
			<div className="container">
				{!isLoading && product ? (
					<>
						<ProductCatalog isLoading={isLoading} images={product?.images} />
						<ProductDesc isLoading={isLoading} product={product} />
					</>
				) : (
					<>
						<ProductCatalog isLoading={isLoading} images={[]} />
						<ProductDesc isLoading={isLoading} />
					</>
				)}
			</div>
		</section>
	);
}
