import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { productService, authService } from '../services/api';

const Admin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const product = await productService.getById(id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString()
      });
    } catch (err) {
      setError('Erreur lors du chargement du produit');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Le nom du produit est obligatoire');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La description est obligatoire');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Le prix doit être supérieur à 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price)
      };

      if (isEditMode) {
        await productService.update(id, productData);
        setSuccess('Produit modifié avec succès !');
      } else {
        await productService.create(productData);
        setSuccess('Produit créé avec succès !');
        setFormData({ name: '', description: '', price: '' });
      }

      // Rediriger vers la liste des produits après 2 secondes
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur est admin
  if (!authService.isAdmin()) {
    return (
      <Container>
        <Alert variant="danger">
          Accès refusé. Vous devez être administrateur pour accéder à cette page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="text-center">
              <h3>{isEditMode ? '✏️ Modifier le produit' : '➕ Ajouter un nouveau produit'}</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom du produit *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Entrez le nom du produit"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez le produit"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Prix (€) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                    pattern="[0-9]*[.]?[0-9]+"
                  />
                  <Form.Text className="text-muted">
                    Format: 19.99
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant={isEditMode ? "primary" : "success"}
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Traitement...' : (isEditMode ? 'Modifier' : 'Créer')}
                  </Button>
                  
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/products')}
                    size="lg"
                  >
                    Annuler
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
