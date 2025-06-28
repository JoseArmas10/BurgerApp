import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layouts/Layout";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "../../styles/AuthStyle.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

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

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      showSuccess('¡Bienvenido de vuelta!');
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      setErrors({ submit: errorMessage });
      showError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="auth-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <Card className="auth-card">
                <Card.Header className="text-center">
                  <h2>Iniciar Sesión</h2>
                  <p className="text-muted">Accede a tu cuenta</p>
                </Card.Header>
                <Card.Body>
                  {errors.submit && (
                    <Alert variant="danger">{errors.submit}</Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        placeholder="Ingresa tu email"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Contraseña *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password}
                        placeholder="Ingresa tu contraseña"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="btn btn_red w-100 mb-3"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Iniciando sesión...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Iniciar Sesión
                        </>
                      )}
                    </Button>
                  </Form>

                  <div className="auth-links text-center">
                    <p className="mb-0">
                      ¿No tienes una cuenta?{" "}
                      <Link to="/register" className="auth-link">
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>

                  <div className="demo-info mt-4">
                    <Alert variant="info">
                      <strong>Demo:</strong> Puedes usar estas credenciales para probar:
                      <br />
                      <strong>Email:</strong> admin@burgerapp.com
                      <br />
                      <strong>Contraseña:</strong> admin123
                    </Alert>
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

export default Login;
