import { useParams } from "react-router";
import CategoryCardWrap from "../../components/categoryCardWrap/CategoryCardWrap";
import { useGetProductsByCategory } from "../../services/apiServices/productApiServices";
export default function CategoryPage() {
	const { categoryId } = useParams();

	const { data, isLoading, error } = useGetProductsByCategory(categoryId+"?limit=5");

	console.log(error);

	return (
		<>
			<div className="banner_wrap">{/* <img src="" alt="" /> */}</div>
			{isLoading ? (
				<CategoryCardWrap categories={[]} title={""} />
			) : (
				// data.length === 0 ? null :
				data.map((categoriesdata) => {
					return (
						<CategoryCardWrap
							key={categoriesdata.id}
							categories={data}
							isLoading={isLoading}
							title={categoriesdata.brand || categoriesdata.category}
						/>
					);
				})
			)}
		</>
	);
}
