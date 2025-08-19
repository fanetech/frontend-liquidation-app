import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const Home = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Container>
      {/* Hero Section */}
      <Row className="py-5">
        <Col md={7} className="d-flex flex-column justify-content-center">
          <h1 className="display-5 mb-3">Bienvenue sur DemoQrcode</h1>
          <p className="lead mb-4 text-muted">
            Tableau de bord de gestion avec authentification sécurisée, gestion des clients et des liquidations,
            interface moderne et filtres rapides.
          </p>
          {!isAuthenticated ? (
            <div className="d-flex gap-3">
              <Button as={Link} to="/login" className="gradient-btn">Se connecter</Button>
              <Button as={Link} to="/register" variant="outline-primary">Créer un compte</Button>
            </div>
          ) : (
            <div className="d-flex gap-3">
              <Button as={Link} to="/customers" variant="primary">Clients</Button>
              <Button as={Link} to="/liquidations" variant="success">Liquidations</Button>
            </div>
          )}
        </Col>
        <Col md={5}>
          <Card className="surface p-4 text-center">
            <div className="display-6">🔐</div>
            <h5 className="mt-2">Sécurité & Simplicité</h5>
            <p className="text-muted mb-0">Connectez-vous et gérez vos opérations en toute sérénité.</p>
          </Card>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="surface p-3 h-100 text-center">
            <div className="display-6 mb-2">👥</div>
            <h6>Gestion des Clients</h6>
            <p className="text-muted mb-0">Créer, modifier et rechercher vos clients rapidement.</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="surface p-3 h-100 text-center">
            <div className="display-6 mb-2">📄</div>
            <h6>Suivi des Liquidations</h6>
            <p className="text-muted mb-0">Filtrez par statut, date, clients et marquez comme payée.</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="surface p-3 h-100 text-center">
            <div className="display-6 mb-2">⚙️</div>
            <h6>Interface Moderne</h6>
            <p className="text-muted mb-0">Design clair, responsive et agréable à utiliser.</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
