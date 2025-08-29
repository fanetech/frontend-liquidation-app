import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { productService, authService } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = authService.isAdmin();
  const currentUser = authService.getCurrentUser();

  // Debug: afficher les informations utilisateur
  console.log('🔍 DEBUG ProductList:');
  console.log('Current User:', currentUser);
  console.log('Is Admin:', isAdmin);
  console.log('User Roles:', currentUser?.roles);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-3">Chargement des produits...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛍️ Nos Produits</h2>
        {isAdmin && (
          <Button variant="success" href="/admin">
            + Ajouter un produit
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <Alert variant="info">
          Aucun produit disponible pour le moment.
        </Alert>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-primary">
                    {product.name}
                  </Card.Title>
                  <Card.Text className="flex-grow-1">
                    {product.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h5 text-success mb-0">
                        {product.price.toFixed(2)} €
                      </span>
                      <span className="badge bg-primary">
                        ID: {product.id}
                      </span>
                    </div>
                    
                    {isAdmin && (
                      <div className="d-grid gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          href={`/admin/edit/${product.id}`}
                        >
                          ✏️ Modifier
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          🗑️ Supprimer
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ProductList;
