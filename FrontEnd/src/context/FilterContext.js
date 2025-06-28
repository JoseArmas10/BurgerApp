import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    priceRange: [0, 100],
    sortBy: 'name', // name, price-asc, price-desc, rating, popularity
    minRating: 0
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update search term
  const updateSearchTerm = (term) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: term
    }));
  };

  // Update category
  const updateCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      category
    }));
  };

  // Update price range
  const updatePriceRange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: range
    }));
  };

  // Update sort option
  const updateSortBy = (sortOption) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortOption
    }));
  };

  // Update minimum rating
  const updateMinRating = (rating) => {
    setFilters(prev => ({
      ...prev,
      minRating: rating
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      priceRange: [0, 100],
      sortBy: 'name',
      minRating: 0
    });
  };

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Filter function for products
  const filterProducts = (products) => {
    let filtered = [...products];

    // Filter by search term
    if (filters.searchTerm) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.paragraph?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(product =>
        product.category === filters.category
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(product =>
        product.rating >= filters.minRating
      );
    }

    // Sort products
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        // Simulate popularity based on rating and random factor
        filtered.sort((a, b) => (b.rating * Math.random()) - (a.rating * Math.random()));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Get available categories from products
  const getCategories = (products) => {
    const categories = new Set();
    products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories);
  };

  // Get price range from products
  const getPriceRange = (products) => {
    if (products.length === 0) return [0, 100];
    const prices = products.map(product => product.price);
    return [Math.min(...prices), Math.max(...prices)];
  };

  const value = {
    filters,
    isFilterOpen,
    updateSearchTerm,
    updateCategory,
    updatePriceRange,
    updateSortBy,
    updateMinRating,
    clearFilters,
    toggleFilterPanel,
    filterProducts,
    getCategories,
    getPriceRange
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
