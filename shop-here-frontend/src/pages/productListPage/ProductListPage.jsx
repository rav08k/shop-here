// import { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./productListPage.css";
import ProductCardWrap from "../../components/productCardWrap/ProductCardWrap";
import SideBarFilter from "../../components/sideBarFilter/SideBarFilter";
import { useGetProductsByCategory } from "../../services/apiServices/productApiServices";
export default function ProfuctListPage() {
	const { categoryId } = useParams();
	const { data, isLoading, error } = useGetProductsByCategory(categoryId+"?limit=5"); 
	console.log(error);
	return (
		<>
			<section className="product_listing_page">
				<div className="container">
					<SideBarFilter />
					<div className="listing_products_wrap">
						<div className="banner_wrap">{/* <img src="" alt="" /> */}</div>
						{isLoading || !data ? (
							<ProductCardWrap products={{ length: 0 }} />
						) : data?.length === 0 ? null : (
							<>
								<ProductCardWrap products={data} />
								<ProductCardWrap products={data} />
								<ProductCardWrap products={data} />
								<ProductCardWrap products={data} />
								<ProductCardWrap products={data} />
								<ProductCardWrap products={data} />
							</>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
