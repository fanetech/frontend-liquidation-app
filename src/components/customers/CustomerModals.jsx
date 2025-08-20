import React, { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  fullName: yup.string().trim().min(3, 'Nom trop court').required('Nom requis'),
  email: yup.string().trim().email('Email invalide').required('Email requis'),
  phone: yup.string().trim().min(6, 'Téléphone invalide').required('Téléphone requis'),
  city: yup.string().trim().required('Ville requise'),
});

export const CustomerModal = ({ show, onHide, initialValues, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { fullName: '', email: '', phone: '', city: '' },
  });

  useEffect(() => {
    if (show) {
      reset(initialValues || { fullName: '', email: '', phone: '', city: '' });
    }
  }, [show, initialValues, reset]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>{initialValues ? 'Modifier un client' : 'Ajouter un client'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label>Nom complet</Form.Label>
              <Form.Control {...register('fullName')} placeholder="Ex: Jean Dupont" isInvalid={!!errors.fullName} />
              <Form.Control.Feedback type="invalid">{errors.fullName?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12} className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control {...register('email')} placeholder="exemple@email.com" isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12} className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control {...register('phone')} placeholder="+226 .." isInvalid={!!errors.phone} />
              <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12}>
              <Form.Label>Ville</Form.Label>
              <Form.Control {...register('city')} placeholder="Ville" isInvalid={!!errors.city} />
              <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
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

export default CustomerModal;
