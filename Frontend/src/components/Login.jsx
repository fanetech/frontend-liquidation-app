import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { authService } from '../services/api.js';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { role, redirect } = await authService.login(formData.username, formData.password);
      
      toast.success(`Connexion réussie ! Bienvenue ${formData.username}`);
      
      // Redirection basée sur le rôle
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/liquidations');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="login-hero">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="login-card surface">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="login-title text-primary">Connexion</h2>
                <p className="login-subtitle">Accédez à votre espace de gestion</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom d'utilisateur</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Entrez votre nom d'utilisateur"
                    className="pill-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Entrez votre mot de passe"
                    className="pill-input"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 gradient-btn"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Pas encore de compte ?{' '}
                  <Button variant="link" onClick={() => navigate('/register')} className="p-0">
                    S'inscrire
                  </Button>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
