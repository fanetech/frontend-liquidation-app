import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import QRCodeDisplay from './liquidations/QRCodeDisplay';

const QRCodeDemo = () => {
  // Sample data for different types of QR codes
  const sampleData = {
    liquidation: {
      id: "LIQ-2024-001",
      customerName: "John Doe",
      amount: 150000,
      taxType: "TVA",
      status: "PENDING",
      dueDate: "2024-12-31"
    },
    payment: {
      reference: "PAY-2024-001",
      amount: 75000,
      currency: "XOF",
      description: "Paiement liquidation"
    },
    url: "https://example.com/payment/LIQ-2024-001",
    text: "Liquidation LIQ-2024-001 - Montant: 150,000 XOF"
  };

  return (
    <Container fluid className="page-fluid">
      <Row className="mb-4">
        <Col>
          <h2 className="section-title">Démonstration QR Code</h2>
          <p className="text-muted">
            Testez les différentes fonctionnalités du QR Code sur différents appareils
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>QR Code - Données de Liquidation</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <p className="text-muted mb-3">
                QR code contenant les informations complètes d'une liquidation
              </p>
              <QRCodeDisplay 
                data={sampleData.liquidation}
                title="Liquidation LIQ-2024-001"
                size={200}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>QR Code - Informations de Paiement</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <p className="text-muted mb-3">
                QR code pour les informations de paiement
              </p>
              <QRCodeDisplay 
                data={sampleData.payment}
                title="Paiement PAY-2024-001"
                size={200}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>QR Code - URL</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <p className="text-muted mb-3">
                QR code contenant une URL de paiement
              </p>
              <QRCodeDisplay 
                data={sampleData.url}
                title="URL de Paiement"
                size={200}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>QR Code - Texte Simple</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <p className="text-muted mb-3">
                QR code avec texte simple
              </p>
              <QRCodeDisplay 
                data={sampleData.text}
                title="Texte Simple"
                size={200}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      
    </Container>
  );
};

export default QRCodeDemo;
