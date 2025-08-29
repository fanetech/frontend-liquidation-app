import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { authService } from '../services/api.js';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('user');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est obligatoire');
      return false;
    }
    if (!formData.password) {
      setError('Le mot de passe est obligatoire');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'user') {
        await authService.registerUser(formData.username, formData.password);
        toast.success('Compte utilisateur créé avec succès !');
      } else {
        await authService.registerAdmin(formData.username, formData.password);
        toast.success('Compte administrateur créé avec succès !');
      }
      
      navigate('/login');
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
                <h2 className="login-title text-primary">Inscription</h2>
                <p className="login-subtitle">Créez votre compte</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="user" title="Utilisateur">
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

                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-4">
                      <Form.Label>Confirmer le mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirmez votre mot de passe"
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
                      {loading ? 'Création...' : 'Créer un compte utilisateur'}
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="admin" title="Administrateur">
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

                    <Form.Group className="mb-3">
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

                    <Form.Group className="mb-4">
                      <Form.Label>Confirmer le mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirmez votre mot de passe"
                        className="pill-input"
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="danger"
                      size="lg"
                      className="w-100 gradient-btn"
                      disabled={loading}
                    >
                      {loading ? 'Création...' : 'Créer un compte administrateur'}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Déjà un compte ?{' '}
                  <Button variant="link" onClick={() => navigate('/login')} className="p-0">
                    Se connecter
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

export default Register;
