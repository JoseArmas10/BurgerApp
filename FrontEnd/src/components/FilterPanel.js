import React from 'react';
import { Row, Col, Form, Button, Card, Badge, Offcanvas } from 'react-bootstrap';
import { useFilters } from '../context/FilterContext';
import '../styles/FilterPanel.css';

const FilterPanel = ({ products, productType = 'food' }) => {
  const {
    filters,
    isFilterOpen,
    updateSearchTerm,
    updateCategory,
    updatePriceRange,
    updateSortBy,
    updateMinRating,
    clearFilters,
    toggleFilterPanel,
    getCategories,
    getPriceRange
  } = useFilters();

  const categories = getCategories(products);
  const [minPrice, maxPrice] = getPriceRange(products);

  const categoryLabels = {
    // Food categories
    burgers: '🍔 Burgers',
    chicken: '🍗 Chicken',
    beef: '🥩 Beef',
    vegetarian: '🥬 Vegetarian',
    sides: '🍟 Sides',
    drinks: '🥤 Drinks',
    desserts: '🍰 Desserts',
    
    // Pet categories
    treats: '🦴 Treats',
    dental: '🦷 Dental Care',
    cat: '🐱 Cat Products',
    puppy: '🐶 Puppy',
    supplements: '💊 Supplements',
    interactive: '🧩 Interactive',
    premium: '⭐ Premium',
    toys: '🎾 Toys'
  };

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  const handlePriceChange = (e, type) => {
    const value = parseFloat(e.target.value);
    const newRange = [...filters.priceRange];
    if (type === 'min') {
      newRange[0] = value;
    } else {
      newRange[1] = value;
    }
    updatePriceRange(newRange);
  };

  const FilterContent = () => (
    <>
      {/* Search */}
      <Card className="filter-card mb-3">
        <Card.Header>
          <h6 className="mb-0">
            <i className="bi bi-search me-2"></i>
            Search
          </h6>
        </Card.Header>
        <Card.Body>
          <Form.Control
            type="text"
            placeholder={`Search ${productType}...`}
            value={filters.searchTerm}
            onChange={(e) => updateSearchTerm(e.target.value)}
            className="search-input"
          />
        </Card.Body>
      </Card>

      {/* Categories */}
      {categories.length > 0 && (
        <Card className="filter-card mb-3">
          <Card.Header>
            <h6 className="mb-0">
              <i className="bi bi-grid me-2"></i>
              Categories
            </h6>
          </Card.Header>
          <Card.Body>
            <Form.Check
              type="radio"
              id="category-all"
              name="category"
              label="All Categories"
              checked={filters.category === 'all'}
              onChange={() => updateCategory('all')}
              className="mb-2"
            />
            {categories.map((category) => (
              <Form.Check
                key={category}
                type="radio"
                id={`category-${category}`}
                name="category"
                label={categoryLabels[category] || category}
                checked={filters.category === category}
                onChange={() => updateCategory(category)}
                className="mb-2"
              />
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Price Range */}
      <Card className="filter-card mb-3">
        <Card.Header>
          <h6 className="mb-0">
            <i className="bi bi-currency-dollar me-2"></i>
            Price Range
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Form.Label>Min: ${filters.priceRange[0]}</Form.Label>
              <Form.Range
                min={minPrice}
                max={maxPrice}
                step="0.01"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(e, 'min')}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Max: ${filters.priceRange[1]}</Form.Label>
              <Form.Range
                min={minPrice}
                max={maxPrice}
                step="0.01"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(e, 'max')}
              />
            </Col>
          </Row>
          <div className="price-display mt-2">
            <Badge bg="primary">${filters.priceRange[0]} - ${filters.priceRange[1]}</Badge>
          </div>
        </Card.Body>
      </Card>

      {/* Rating Filter */}
      <Card className="filter-card mb-3">
        <Card.Header>
          <h6 className="mb-0">
            <i className="bi bi-star me-2"></i>
            Minimum Rating
          </h6>
        </Card.Header>
        <Card.Body>
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <Form.Check
              key={rating}
              type="radio"
              id={`rating-${rating}`}
              name="rating"
              label={
                rating === 0 ? 'Any Rating' : 
                <span>
                  {Array.from({ length: rating }, (_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning"></i>
                  ))}
                  {Array.from({ length: 5 - rating }, (_, i) => (
                    <i key={i} className="bi bi-star text-muted"></i>
                  ))}
                  <span className="ms-2">& up</span>
                </span>
              }
              checked={filters.minRating === rating}
              onChange={() => updateMinRating(rating)}
              className="mb-2"
            />
          ))}
        </Card.Body>
      </Card>

      {/* Sort Options */}
      <Card className="filter-card mb-3">
        <Card.Header>
          <h6 className="mb-0">
            <i className="bi bi-sort-down me-2"></i>
            Sort By
          </h6>
        </Card.Header>
        <Card.Body>
          <Form.Select
            value={filters.sortBy}
            onChange={(e) => updateSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Card.Body>
      </Card>

      {/* Clear Filters */}
      <div className="d-grid">
        <Button
          variant="outline-danger"
          onClick={clearFilters}
          className="clear-filters-btn"
        >
          <i className="bi bi-x-circle me-2"></i>
          Clear All Filters
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <div className="d-none d-lg-block">
        <div className="filter-panel">
          <div className="filter-header mb-3">
            <h5>
              <i className="bi bi-funnel me-2"></i>
              Filters
            </h5>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="d-lg-none mb-3">
        <Button
          variant="outline-primary"
          onClick={toggleFilterPanel}
          className="w-100"
        >
          <i className="bi bi-funnel me-2"></i>
          Filters & Sort
        </Button>
      </div>

      {/* Mobile Filter Offcanvas */}
      <Offcanvas 
        show={isFilterOpen} 
        onHide={toggleFilterPanel} 
        placement="end"
        className="d-lg-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="bi bi-funnel me-2"></i>
            Filters & Sort
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FilterPanel;
