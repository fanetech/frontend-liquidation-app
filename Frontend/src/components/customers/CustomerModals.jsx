import React from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import customerService from '../../services/customerService.js';
import liquidationService from '../../services/liquidationService.js';

// Schéma de validation
const customerSchema = yup.object({
  firstName: yup.string().required('Le prénom est obligatoire').min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: yup.string().required('Le nom est obligatoire').min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: yup.string().email('Email invalide').required('L\'email est obligatoire'),
  phone: yup.string().required('Le téléphone est obligatoire').matches(/^[0-9+\s\-()]+$/, 'Format de téléphone invalide'),
  ifu: yup.string().required('L\'IFU est obligatoire').min(5, 'L\'IFU doit contenir au moins 5 caractères'),
  address: yup.string().required('L\'adresse est obligatoire').min(10, 'L\'adresse doit contenir au moins 10 caractères'),
});

const CustomerModals = ({ show, type, customer, onClose, onSuccess }) => {
  const isView = type === 'view';
  const isEdit = type === 'edit';
  const isAdd = type === 'add';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ifu: '',
      address: '',
    },
  });

  // Réinitialiser le formulaire quand le modal s'ouvre
  React.useEffect(() => {
    if (show) {
      if (customer) {
        setValue('firstName', customer.firstName || '');
        setValue('lastName', customer.lastName || '');
        setValue('email', customer.email || '');
        setValue('phone', customer.phone || '');
        setValue('ifu', customer.ifu || '');
        setValue('address', customer.address || '');
      } else {
        reset();
      }
    }
  }, [show, customer, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (isAdd) {
        await customerService.create(data);
        toast.success('Client ajouté avec succès');
      } else if (isEdit) {
        await customerService.update(customer.id, data);
        toast.success('Client modifié avec succès');
      }
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'opération:', error);
      const errorMessage = error.response?.data || 'Une erreur est survenue';
      toast.error(errorMessage);
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'add': return 'Ajouter un client';
      case 'edit': return 'Modifier le client';
      case 'view': return 'Détails du client';
      default: return 'Client';
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  type="text"
                  {...register('firstName')}
                  isInvalid={!!errors.firstName}
                  disabled={isView}
                />
                <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  type="text"
                  {...register('lastName')}
                  isInvalid={!!errors.lastName}
                  disabled={isView}
                />
                <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  {...register('email')}
                  isInvalid={!!errors.email}
                  disabled={isView}
                />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Téléphone *</Form.Label>
                <Form.Control
                  type="tel"
                  {...register('phone')}
                  isInvalid={!!errors.phone}
                  disabled={isView}
                  placeholder="+226 XX XX XX XX"
                />
                <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>IFU *</Form.Label>
                <Form.Control
                  type="text"
                  {...register('ifu')}
                  isInvalid={!!errors.ifu}
                  disabled={isView}
                  placeholder="Numéro IFU"
                />
                <Form.Control.Feedback type="invalid">{errors.ifu?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Adresse *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('address')}
              isInvalid={!!errors.address}
              disabled={isView}
              placeholder="Adresse complète"
            />
            <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
          </Form.Group>

          {customer && (
            <Alert variant="info"><strong>ID:</strong> {customer.id}</Alert>
          )}

          {/* ✅ Liste des liquidations du client */}
          {isView && customer?.liquidations?.length > 0 && (
            <div className="mt-3">
              <h5>Liquidations du client</h5>
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type de taxe</th>
                    <th>Montant</th>
                    <th>Status</th>
                    <th>Date émission</th>
                    <th>Date échéance</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.liquidations.map((liq) => (
                    <tr key={liq.id}>
                      <td>{liq.id}</td>
                      <td>{liq.taxType}</td>
                      <td>{liq.amount}</td>
                      <td>{liq.status}</td>
                      <td>{liq.issueDate}</td>
                      <td>{liq.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {isView ? 'Fermer' : 'Annuler'}
          </Button>
          {!isView && (
            <Button variant={isAdd ? 'primary' : 'warning'} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : (isAdd ? 'Ajouter' : 'Modifier')}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CustomerModals;
