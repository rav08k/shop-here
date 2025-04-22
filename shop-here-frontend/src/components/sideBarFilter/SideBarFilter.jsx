import Filters from "./Filters";
import "./sideBarFilters.css"

function SideBarFilter({ filters = filter }) {
	return (
		<div className="side_bar_filters_wrap">
			<h1 className="filter_title">Filters</h1>
			{filters.map((filter) => (
				<Filters key={filter.name + "filter"} filter={filter} />
			))}
		</div>
	);
}

const filter = [
	{
		name: "Size",
		type: "checkbox",
		options: ["S", "M", "L", "XL"],
	},
	{
		name: "Color",
		type: "checkbox",
		options: ["Red", "Blue", "Green"],
	},
	{
		name: "Brand",
		type: "checkbox",
		options: ["Nike", "Adidas", "Puma"],
	},
	{ name: "Price Range", type: "range", min: 0, max: 200 },
];

export default SideBarFilter;
