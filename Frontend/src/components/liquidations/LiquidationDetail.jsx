import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaQrcode, FaPrint, FaDownload, FaEye } from 'react-icons/fa';
import liquidationService from '../../services/liquidationService.js';
import QRCodeDisplay from './QRCodeDisplay.jsx';

const LiquidationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liquidation, setLiquidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiquidation = async () => {
      try {
        setLoading(true);
        const data = await liquidationService.get(id);
        setLiquidation(data);
      } catch (err) {
        setError('Erreur lors du chargement de la liquidation');
        console.error('Error fetching liquidation:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLiquidation();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const variants = {
      'PENDING': 'warning',
      'PAID': 'success',
      'OVERDUE': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/liquidations')}>
            Retour aux liquidations
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!liquidation) {
    return (
      <Container>
        <Alert variant="warning">
          <Alert.Heading>Liquidation non trouvée</Alert.Heading>
          <p>La liquidation demandée n'existe pas.</p>
          <Button variant="outline-warning" onClick={() => navigate('/liquidations')}>
            Retour aux liquidations
          </Button>
        </Alert>
      </Container>
    );
  }

  // Prepare QR code data
  const qrData = {
    id: liquidation.id,
    customerId: liquidation.customer?.id,
    customerName: `${liquidation.customer?.lastName} ${liquidation.customer?.firstName}`,
    taxType: liquidation.taxType,
    amount: liquidation.amount,
    issueDate: liquidation.issueDate,
    dueDate: liquidation.dueDate,
    status: liquidation.status,
    reference: liquidation.reference || `LIQ-${liquidation.id}`
  };

  return (
    <Container fluid className="page-fluid">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/liquidations')}
            className="mb-2"
          >
            <FaArrowLeft className="me-2" />
            Retour
          </Button>
          <h2 className="section-title mb-0">Détails de la Liquidation</h2>
        </Col>
        <Col md="auto">
          <QRCodeDisplay 
            data={qrData}
            title={`Liquidation ${liquidation.reference || liquidation.id}`}
            className="me-2"
          />
        </Col>
      </Row>

      <Row>
        {/* Main Information */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informations Générales</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Référence:</strong>
                    <div className="text-muted">{liquidation.reference || `LIQ-${liquidation.id}`}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Type de Taxe:</strong>
                    <div className="text-muted">{liquidation.taxType}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Montant:</strong>
                    <div className="text-primary fw-bold fs-5">{formatCurrency(liquidation.amount)}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Statut:</strong>
                    <div>{getStatusBadge(liquidation.status)}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Date d'émission:</strong>
                    <div className="text-muted">{formatDate(liquidation.issueDate)}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Date d'échéance:</strong>
                    <div className="text-muted">{formatDate(liquidation.dueDate)}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Customer Information */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Informations Client</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Nom complet:</strong>
                    <div className="text-muted">
                      {liquidation.customer?.lastName} {liquidation.customer?.firstName}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>ID Client:</strong>
                    <div className="text-muted">{liquidation.customer?.id}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Email:</strong>
                    <div className="text-muted">{liquidation.customer?.email || 'N/A'}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Téléphone:</strong>
                    <div className="text-muted">{liquidation.customer?.phone || 'N/A'}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* QR Code Sidebar */}
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaQrcode className="me-2" />
                QR Code de Paiement
              </h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="mb-3">
                <small className="text-muted">
                  Scannez ce QR code pour accéder aux informations de paiement
                </small>
              </div>
              
              <QRCodeDisplay 
                data={qrData}
                title={`Paiement ${liquidation.reference || liquidation.id}`}
                size={200}
                className="w-100 mb-3"
              />
              
              <div className="mt-3">
                <small className="text-muted d-block">
                  <strong>Montant:</strong> {formatCurrency(liquidation.amount)}
                </small>
                <small className="text-muted d-block">
                  <strong>Référence:</strong> {liquidation.reference || liquidation.id}
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Actions Rapides</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  <FaEye className="me-2" />
                  Voir l'historique
                </Button>
                <Button variant="outline-success" size="sm">
                  <FaPrint className="me-2" />
                  Imprimer le reçu
                </Button>
                <Button variant="outline-info" size="sm">
                  <FaDownload className="me-2" />
                  Télécharger PDF
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LiquidationDetail;
