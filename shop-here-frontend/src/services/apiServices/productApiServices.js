// api/endpoints/productServices.js
import { useFetch } from "./clientApiServices";
import { getFilteredData } from "../../utils/dataUtils";

/**
 * Hook to fetch a specific product by ID
 * @param {string} productId - The ID of the product to fetch
 * @returns {Object} Product data with loading and error states
 */
export const useGetProductById = (productId) => {
	const { data, isLoading, error } = useFetch(`products/${productId}`);
	return { data, isLoading, error };
};

/**
 * Hook to fetch products filtered by category
 * @param {string} categoryId - The category ID to filter by
 * @returns {Object} Filtered products with loading and error states
 */
export const useGetProductsByCategory = (categoryId) => {
	const { data, isLoading, error } = useFetch(
		`products/category/${categoryId}`
	);

	return { data:data?.products, isLoading, error };
};

/**
 * Hook to fetch products by search query
 * @param {string} query - The search term
 * @returns {Object} Search results with loading and error states
 */
export const useGetProductsBySearchQuery = (query) => {
	const { data, isLoading, error } = useFetch(
		`products/search?q=${encodeURIComponent(query)}`
	);

	return { data, isLoading, error };
};

/**
 * Hook to fetch products with category filters
 * @param {Array} filters - Array of category slugs to filter by
 * @returns {Object} Filtered products with loading and error states
 */
export const useGetProductsByFilteredCategories = (filters) => {
	const { data, isLoading, error } = useFetch("products/categories");

	if (filters && filters.length > 0) {
		const filteredData = getFilteredData(data, filters);
		return { data: filteredData, isLoading, error };
	}

	return { data, isLoading, error };
};
