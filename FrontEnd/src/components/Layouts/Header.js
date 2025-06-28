import React, { useState } from "react";
import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
// import Logo from "../../assets/logo/logo.png"; // IMAGE MISSING
import "../../styles/HeaderStyle.css";

const Header = () => {
  const [nav, setNav] = useState(false);
  const { getCartItemsCount, toggleCart } = useCart();
  const { currentUser, logout } = useAuth();

  // Scroll Navbar
  const changeValueOnScroll = () => {
    const scrollValue = document?.documentElement?.scrollTop;
    scrollValue > 100 ? setNav(true) : setNav(false);
  };

  window.addEventListener("scroll", changeValueOnScroll);

  return (
    <header>
      <Navbar
        collapseOnSelect
        expand="lg"
        className={`${nav === true ? "sticky" : ""}`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo">
            {/* <img src={Logo} alt="Logo" className="img-fluid" /> */}
            <div style={{width: '120px', height: '40px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #dee2e6', fontSize: '14px', color: '#6c757d'}}>
              LOGO
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/menu">
                Our Menu
              </Nav.Link>
              <Nav.Link as={Link} to="/shop">
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/locations">
                <i className="bi bi-geo-alt me-1"></i>
                Locations
              </Nav.Link>
              <Nav.Link as={Link} to="/contact">
                Contact
              </Nav.Link>
              
              {/* Authentication Section */}
              {currentUser ? (
                <Dropdown as={Nav.Item} className="user-dropdown">
                  <Dropdown.Toggle as={Nav.Link} className="user-info">
                    <div className="user-avatar">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </div>
                    <span>{currentUser.firstName}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/orders">
                      <i className="bi bi-bag-check me-2"></i>
                      Mis Pedidos
                    </Dropdown.Item>
                    {currentUser.role === 'admin' && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/admin" className="text-primary">
                          <i className="bi bi-gear me-2"></i>
                          Admin Panel
                        </Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  <i className="bi bi-person-circle me-1"></i>
                  Iniciar Sesión
                </Nav.Link>
              )}
              
              <Nav.Link 
                className="cart-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  toggleCart();
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="cart">
                  <i className="bi bi-bag fs-5"></i>
                  <em className="roundpoint">{getCartItemsCount()}</em>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
