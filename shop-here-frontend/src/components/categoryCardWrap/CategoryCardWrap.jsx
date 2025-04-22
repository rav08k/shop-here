import "./categoryCardWrap.css";
// import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CategoryCard from "../categoryCard/CategoryCard";
import { NavLink } from "react-router";
function CategoryCardWrap({ categories, title }) {
	return (
		<section className="category_card_wrap">
			<div className="container">
				<h2 className="category_wrap_title">Best of {title}</h2>
				<div className="category_card_container">
					{categories.length === 0 ? (
						<Skeleton count={5} width={220} height={280} />
					) : (
						categories.map((category) => {
							return (
								<NavLink
									to={"/products/" + category.category}
									key={category.id}
								>
									<CategoryCard category={category} />
								</NavLink>
							);
						})
					)}
				</div>
			</div>
		</section>
	);
}

export default CategoryCardWrap;
