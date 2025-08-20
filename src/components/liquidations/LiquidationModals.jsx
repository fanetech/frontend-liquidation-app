import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation avec Yup
const schema = yup.object({
  customer: yup.string().trim().required('Nom du client requis'),
  amount: yup.number().typeError('Montant invalide').positive('Doit être positif').required('Montant requis'),
  status: yup.string().required('Statut requis'),
});

const LiquidationModal = ({ show, onHide, initialValues, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customer: '', amount: '', status: 'En cours' },
  });

  useEffect(() => {
    if (show) {
      reset(initialValues || { customer: '', amount: '', status: 'En cours' });
    }
  }, [show, initialValues, reset]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>{initialValues ? 'Modifier une liquidation' : 'Ajouter une liquidation'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Control {...register('customer')} placeholder="Nom du client" isInvalid={!!errors.customer} />
              <Form.Control.Feedback type="invalid">{errors.customer?.message}</Form.Control.Feedback>
            </Col>

            <Col md={12} className="mb-3">
              <Form.Label>Montant</Form.Label>
              <Form.Control type="number" {...register('amount')} placeholder="Montant" isInvalid={!!errors.amount} />
              <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
            </Col>

            <Col md={12}>
              <Form.Label>Statut</Form.Label>
              <Form.Select {...register('status')}>
                <option value="En cours">En cours</option>
                <option value="Payée">Payée</option>
                <option value="Annulée">Annulée</option>
              </Form.Select>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Annuler</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {initialValues ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LiquidationModal;
