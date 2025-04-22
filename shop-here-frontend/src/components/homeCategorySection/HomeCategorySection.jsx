import { useGetProductsByCategory } from "../../services/apiServices/productApiServices";
import CategoryCardWrap from "../categoryCardWrap/CategoryCardWrap";

function HomeCategorySection({ categoryId, categoryName }) {
	let { data, isLoading, error } = useGetProductsByCategory(categoryId);
	console.log(error);

	return (
		<section className="homeCatSec">
			<div className="container">
				{isLoading ||  data.length == 0? (
					<CategoryCardWrap categories={[]} title={categoryName} />
				) : (
					<CategoryCardWrap
						categories={data}
						isLoading={isLoading}
						title={categoryName}
					/>
				)}
			</div>
		</section>
	);
}

export default HomeCategorySection;
