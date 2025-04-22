import "./home.css";
import OffersCarousel from "../../components/bannerCarousel/OffersCarousel";
import CategoryCardWrap from "../../components/categoryCardWrap/CategoryCardWrap";
import { useGetProductsByFilteredCategories } from "../../services/apiServices/productApiServices";
import HomeCategorySection from "../../components/homeCategorySection/HomeCategorySection";
function Home() {
	const homeCategories = [
		"laptops",
		"mens-shoes",
		"womens-dresses",
		"mens-shirts",
		"womens-shoes",
	];
	const { data, isLoading, error } =
		useGetProductsByFilteredCategories(homeCategories);
	console.log(error);

	return (
		<>
			<OffersCarousel
				categories={data?.filter(
					(category) =>
						category.slug === "womens-dresses" ||
						category.slug === "mens-dresses"
				)}
			/>
			{isLoading ? (
				<HomeCategorySection/>
			) : (
				data.map((cat, i) => {
					return (
						<HomeCategorySection
							key={cat.slug + "homeCat" + i}
							categoryId={cat.slug}
							title={cat.name}
						/>
					);
				})
			)}
		</>
	);
}

export default Home;
