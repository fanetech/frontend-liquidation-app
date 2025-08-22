import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Navigation = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();

  const safeUsername = currentUser?.username || 'Utilisateur';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="app-navbar mb-4" style={{ width: '100%' }}>
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/">Gestion</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/customers">Clients</Nav.Link>
                <Nav.Link as={Link} to="/liquidations">Liquidations</Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin">Administration</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  👤 {safeUsername} {isAdmin && '(Admin)'}
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
                <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
