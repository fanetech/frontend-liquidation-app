import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation avec Yup pour le backend
const schema = yup.object({
  customerId: yup.number().typeError('ID client invalide').required('ID client requis').positive('ID invalide'),
  taxType: yup.string().trim().required('Type de taxe requis'),
  amount: yup.number().typeError('Montant invalide').positive('Doit être positif').required('Montant requis'),
  issueDate: yup.string().required("Date d'émission requise"),
  dueDate: yup.string().required("Date d'échéance requise"),
  status: yup.mixed().oneOf(['PENDING', 'PAID', 'OVERDUE']).required('Statut requis'),
});

const LiquidationModal = ({ show, onHide, initialValues, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customerId: '', taxType: '', amount: '', issueDate: '', dueDate: '', status: 'PENDING' },
  });

  useEffect(() => {
    if (show) {
      if (initialValues) {
        reset({
          customerId: initialValues.customer?.id || '',
          taxType: initialValues.taxType || '',
          amount: initialValues.amount || '',
          issueDate: initialValues.issueDate || '',
          dueDate: initialValues.dueDate || '',
          status: initialValues.status || 'PENDING',
        });
      } else {
        reset({ customerId: '', taxType: '', amount: '', issueDate: '', dueDate: '', status: 'PENDING' });
      }
    }
  }, [show, initialValues, reset]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit((form) => onSubmit({
        customer: { id: Number(form.customerId) },
        taxType: form.taxType,
        amount: form.amount,
        issueDate: form.issueDate,
        dueDate: form.dueDate,
        status: form.status,
      }))}>
        <Modal.Header closeButton>
          <Modal.Title>{initialValues ? 'Modifier une liquidation' : 'Ajouter une liquidation'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>ID Client</Form.Label>
              <Form.Control {...register('customerId')} placeholder="ID du client" isInvalid={!!errors.customerId} />
              <Form.Control.Feedback type="invalid">{errors.customerId?.message}</Form.Control.Feedback>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Type de taxe</Form.Label>
              <Form.Control {...register('taxType')} placeholder="Ex: TVA" isInvalid={!!errors.taxType} />
              <Form.Control.Feedback type="invalid">{errors.taxType?.message}</Form.Control.Feedback>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Montant</Form.Label>
              <Form.Control type="number" {...register('amount')} placeholder="Montant" isInvalid={!!errors.amount} />
              <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select {...register('status')} isInvalid={!!errors.status}>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="OVERDUE">OVERDUE</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.status?.message}</Form.Control.Feedback>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Date d'émission</Form.Label>
              <Form.Control type="date" {...register('issueDate')} isInvalid={!!errors.issueDate} />
              <Form.Control.Feedback type="invalid">{errors.issueDate?.message}</Form.Control.Feedback>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Date d'échéance</Form.Label>
              <Form.Control type="date" {...register('dueDate')} isInvalid={!!errors.dueDate} />
              <Form.Control.Feedback type="invalid">{errors.dueDate?.message}</Form.Control.Feedback>
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
