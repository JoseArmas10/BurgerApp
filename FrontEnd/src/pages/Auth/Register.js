import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layouts/Layout";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "../../styles/AuthStyle.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Phone is optional, but if provided, should be valid
    if (formData.phone.trim() && !/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "El número de teléfono no es válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      showSuccess('¡Registro exitoso! Bienvenido a nuestra plataforma.');
      navigate("/");
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle validation errors from backend
      if (error.errors && Array.isArray(error.errors)) {
        const newErrors = {};
        error.errors.forEach(err => {
          // Map backend field names to frontend field names
          const fieldMap = {
            'firstName': 'firstName',
            'lastName': 'lastName',
            'email': 'email',
            'password': 'password',
            'phone': 'phone'
          };
          
          const field = fieldMap[err.path] || err.param;
          if (field) {
            newErrors[field] = err.msg;
          }
        });
        setErrors(newErrors);
        
        // Show general error message
        const errorMessage = 'Por favor, corrige los errores en el formulario';
        showError(errorMessage);
      } else {
        // Handle general errors
        const errorMessage = error.message || 'Error al registrar usuario';
        setErrors({ submit: errorMessage });
        showError(errorMessage);
      }
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="auth-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="auth-card">
                <Card.Header className="text-center">
                  <h2>Registrarse</h2>
                  <p className="text-muted">Crea tu cuenta nueva</p>
                </Card.Header>
                <Card.Body>
                  {errors.submit && (
                    <Alert variant="danger">{errors.submit}</Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre *</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            isInvalid={!!errors.firstName}
                            placeholder="Tu nombre"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Apellido *</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            isInvalid={!!errors.lastName}
                            placeholder="Tu apellido"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        placeholder="tu@email.com"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono (opcional)</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone}
                        placeholder="123-456-7890"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contraseña *</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            isInvalid={!!errors.password}
                            placeholder="Mínimo 6 caracteres"
                          />
                          <Form.Text className="text-muted">
                            Debe contener al menos una mayúscula, una minúscula y un número
                          </Form.Text>
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label>Confirmar Contraseña *</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            isInvalid={!!errors.confirmPassword}
                            placeholder="Repite tu contraseña"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      className="btn btn_red w-100 mb-3"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Registrarse
                        </>
                      )}
                    </Button>
                  </Form>

                  <div className="auth-links text-center">
                    <p className="mb-0">
                      ¿Ya tienes una cuenta?{" "}
                      <Link to="/login" className="auth-link">
                        Inicia sesión aquí
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};

export default Register;
