import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Layout from '../../components/Layouts/Layout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'burgers',
    isActive: true,
    ingredients: '',
    allergens: '',
    sizes: []
  });

  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [promotionForm, setPromotionForm] = useState({
    title: '',
    description: '',
    discountPercentage: '',
    validUntil: '',
    applicableProducts: []
  });

  // Verificar si el usuario es admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      // Redirigir o mostrar mensaje de acceso denegado
      return;
    }
    fetchProducts();
    fetchStats();
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        showError('Error fetching products');
      }
    } catch (error) {
      showError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Validar que tenemos token
      if (!token) {
        showError('No authentication token found. Please login again.');
        return;
      }
      
      // Usar FormData para enviar archivos
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('isActive', productForm.isActive);
      formData.append('ingredients', productForm.ingredients);
      formData.append('allergens', productForm.allergens);
      
      // Agregar imagen si existe
      if (productImage) {
        formData.append('image', productImage);
      }

      const url = editingProduct 
        ? `http://localhost:5000/api/admin/products/${editingProduct._id}`
        : 'http://localhost:5000/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
          // No agregar Content-Type para FormData, el browser lo hace automáticamente
        },
        body: formData
      });

      const responseData = await response.json();

      if (response.ok) {
        showSuccess(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setShowProductModal(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: 'burgers',
          isActive: true,
          ingredients: '',
          allergens: '',
          sizes: []
        });
        clearImage(); // Clear image as well
        fetchProducts();
      } else {
        showError(responseData.message || 'Error saving product');
      }
    } catch (error) {
      showError('Error connecting to server: ' + error.message);
    }
  };

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (file.type.startsWith('image/')) {
        setProductImage(file);
        
        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        showError('Por favor selecciona un archivo de imagen válido');
        e.target.value = '';
      }
    }
  };

  // Limpiar imagen
  const clearImage = () => {
    setProductImage(null);
    setImagePreview(null);
    // Limpiar el input file
    const fileInput = document.getElementById('productImage');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleToggleProductStatus = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showSuccess('Product status updated');
        fetchProducts();
      } else {
        showError('Error updating product status');
      }
    } catch (error) {
      showError('Error connecting to server');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      isActive: product.isActive,
      ingredients: product.ingredients?.join(', ') || '',
      allergens: product.allergens?.join(', ') || '',
      sizes: product.sizes || []
    });
    setShowProductModal(true);
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/promotions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(promotionForm)
      });

      if (response.ok) {
        showSuccess('Promotion created successfully');
        setShowPromotionModal(false);
        setPromotionForm({
          title: '',
          description: '',
          discountPercentage: '',
          validUntil: '',
          applicableProducts: []
        });
        fetchProducts();
      } else {
        showError('Error creating promotion');
      }
    } catch (error) {
      showError('Error connecting to server');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Layout>
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <h4>Access Denied</h4>
            <p>You need administrator privileges to access this page.</p>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container fluid className="admin-dashboard py-4">
        <Row>
          <Col>
            <h1 className="mb-4">Admin Dashboard</h1>
            
            {/* Statistics Cards */}
            <Row className="mb-4">
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <h5>Total Products</h5>
                    <h2>{stats.totalProducts || 0}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <h5>Active Products</h5>
                    <h2 className="text-success">{stats.activeProducts || 0}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <h5>Inactive Products</h5>
                    <h2 className="text-danger">{stats.inactiveProducts || 0}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <h5>Categories</h5>
                    <h2>{stats.productsByCategory?.length || 0}</h2>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Management Tabs */}
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
              <Tab eventKey="products" title="Products">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>Product Management</h3>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowProductModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Product
                  </Button>
                </div>

                <Card>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Rating</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id}>
                            <td>
                              <strong>{product.name}</strong>
                              <br />
                              <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                            </td>
                            <td>
                              <Badge bg="secondary">{product.category}</Badge>
                            </td>
                            <td>${product.price}</td>
                            <td>
                              <Badge bg={product.isActive ? 'success' : 'danger'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              {product.rating?.average || 0} ({product.rating?.count || 0})
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleEditProduct(product)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button 
                                variant={product.isActive ? 'outline-danger' : 'outline-success'}
                                size="sm"
                                onClick={() => handleToggleProductStatus(product._id)}
                              >
                                <i className={`bi ${product.isActive ? 'bi-toggle-on' : 'bi-toggle-off'}`}></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="promotions" title="Promotions">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>Promotion Management</h3>
                  <Button 
                    variant="warning" 
                    onClick={() => setShowPromotionModal(true)}
                  >
                    <i className="bi bi-percent me-2"></i>
                    Create Promotion
                  </Button>
                </div>

                <Card>
                  <Card.Body>
                    <p>Promotion management features coming soon...</p>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Product Modal */}
        <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateProduct}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      required
                    >
                      <option value="burgers">Burgers</option>
                      <option value="sides">Sides</option>
                      <option value="drinks">Drinks</option>
                      <option value="desserts">Desserts</option>
                      <option value="treats">Pet Treats</option>
                      <option value="toys">Pet Toys</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Check
                      type="switch"
                      label="Active"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({...productForm, isActive: e.target.checked})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Ingredients (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={productForm.ingredients}
                  onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                  placeholder="Beef patty, lettuce, tomato, onion..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Allergens (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={productForm.allergens}
                  onChange={(e) => setProductForm({...productForm, allergens: e.target.value})}
                  placeholder="gluten, dairy, nuts..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product Image</Form.Label>
                <Form.Control
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  Selecciona una imagen para el producto (máximo 5MB)
                </Form.Text>
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                      className="img-thumbnail"
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="ms-2"
                      onClick={clearImage}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </Button>
                  </div>
                )}
              </Form.Group>

              <Row>
                <Col className="text-end">
                  <Button variant="secondary" onClick={() => setShowProductModal(false)} className="me-2">
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Form>
        </Modal>

        {/* Promotion Modal */}
        <Modal show={showPromotionModal} onHide={() => setShowPromotionModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Create New Promotion</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreatePromotion}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Promotion Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={promotionForm.title}
                  onChange={(e) => setPromotionForm({...promotionForm, title: e.target.value})}
                  placeholder="e.g., Summer Special - 20% Off!"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={promotionForm.description}
                  onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                  placeholder="Describe the promotion..."
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Discount Percentage *</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="100"
                      value={promotionForm.discountPercentage}
                      onChange={(e) => setPromotionForm({...promotionForm, discountPercentage: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Valid Until *</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={promotionForm.validUntil}
                      onChange={(e) => setPromotionForm({...promotionForm, validUntil: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Applicable Products</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={promotionForm.applicableProducts}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setPromotionForm({...promotionForm, applicableProducts: values});
                  }}
                >
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </Form.Control>
                <Form.Text className="text-muted">
                  Hold Ctrl/Cmd to select multiple products
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPromotionModal(false)}>
                Cancel
              </Button>
              <Button variant="warning" type="submit">
                Create Promotion
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;
