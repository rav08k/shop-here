export const getFilteredData = function(data, filters) {
    if (!filters || !filters.length || !data) return data;
    return data.filter((item) => filters.includes(item.slug));
  };