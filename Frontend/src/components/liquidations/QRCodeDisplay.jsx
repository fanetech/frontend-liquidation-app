import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button, Modal, Card, Row, Col, Form } from 'react-bootstrap';
import { FaQrcode, FaPrint, FaDownload, FaCopy, FaSync } from 'react-icons/fa';

const QRCodeDisplay = ({ 
  data, 
  title = "QR Code", 
  size = 256, 
  level = "M",
  includeLogo = false,
  logoUrl = null,
  logoWidth = 40,
  logoHeight = 40,
  className = ""
}) => {
  const [showModal, setShowModal] = useState(false);
  const [qrSize, setQrSize] = useState(size);
  const [qrLevel, setQrLevel] = useState(level);
  const [qrData, setQrData] = useState(typeof data === 'string' ? data : JSON.stringify(data));
  const qrRef = useRef(null);

  // 🔄 Régénérer QR (ajout timestamp unique)
  const handleRegenerate = () => {
    setQrData(prev => prev + `_${Date.now()}`);
  };

  // 📋 Copier les données
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      alert("Données copiées dans le presse-papier ✅");
    } catch (err) {
      console.error("Erreur copie", err);
    }
  };

  // ⬇️ Télécharger le QR en PNG
  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = qrSize;
        canvas.height = qrSize;
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `${title.replace(/\s+/g, '_')}_QR.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <>
      {/* Bouton principal */}
      <Button 
        variant="outline-primary" 
        size="sm" 
        onClick={() => setShowModal(true)}
        className={className}
      >
        <FaQrcode className="me-2" />
        QR Code
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaQrcode className="me-2" />
            {title}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Row>
            <Col md={8}>
              <Card className="text-center p-3">
                <div ref={qrRef}>
                  <QRCodeSVG
                    value={qrData}
                    size={qrSize}
                    level={qrLevel}
                    includeMargin={true}
                    imageSettings={includeLogo && logoUrl ? {
                      src: logoUrl,
                      height: logoHeight,
                      width: logoWidth,
                      excavate: true,
                    } : undefined}
                  />
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    Données: {qrData.length > 50 ? `${qrData.substring(0, 50)}...` : qrData}
                  </small>
                </div>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>Paramètres</Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Taille</Form.Label>
                      <Form.Select value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))}>
                        <option value={128}>128px</option>
                        <option value={256}>256px</option>
                        <option value={512}>512px</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Niveau</Form.Label>
                      <Form.Select value={qrLevel} onChange={(e) => setQrLevel(e.target.value)}>
                        <option value="L">Faible (7%)</option>
                        <option value="M">Moyen (15%)</option>
                        <option value="Q">Élevé (25%)</option>
                        <option value="H">Très élevé (30%)</option>
                      </Form.Select>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleRegenerate}>
            <FaSync className="me-2" /> Régénérer
          </Button>
          <Button variant="outline-dark" onClick={handleCopy}>
            <FaCopy className="me-2" /> Copier
          </Button>
          <Button variant="outline-success" onClick={handleDownload}>
            <FaDownload className="me-2" /> Télécharger
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QRCodeDisplay;
