import React, { useEffect, useMemo } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { customerService } from '../../services/customerService';

const schema = yup.object({
  customerId: yup.number().typeError('Client requis').required('Client requis'),
  amount: yup.number().typeError('Montant invalide').positive('Doit être > 0').required('Montant requis'),
  status: yup.string().oneOf(['PENDING', 'PAID', 'CANCELLED']).required(),
  date: yup.date().typeError('Date invalide').required('Date requise'),
});

export const LiquidationModal = ({ show, onHide, initialValues, onSubmit }) => {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customerId: '', amount: '', status: 'PENDING', date: new Date().toISOString().slice(0,10) },
  });

  const customerOptions = useMemo(() =>
    customerService.getAll().map(c => ({ value: c.id, label: `${c.fullName} (${c.city})` })),
    []
  );

  useEffect(() => {
    if (show) {
      const defaults = initialValues ? {
        customerId: initialValues.customerId,
        amount: initialValues.amount,
        status: initialValues.status,
        date: new Date(initialValues.date).toISOString().slice(0,10),
      } : undefined;
      reset(defaults);
    }
  }, [show, initialValues, reset]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>{initialValues ? 'Modifier une liquidation' : 'Nouvelle liquidation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <Form.Label>Client</Form.Label>
              <Controller
                control={control}
                name="customerId"
                render={({ field }) => (
                  <div className="rs-dark">
                    <Select
                      classNamePrefix="react-select"
                      {...field}
                      options={customerOptions}
                      value={customerOptions.find(o => o.value === field.value) || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      placeholder="Sélectionner un client..."
                    />
                  </div>
                )}
              />
              {errors.customerId && <div className="text-danger small mt-1">{errors.customerId.message}</div>}
            </Col>
            <Col md={6}>
              <Form.Label>Montant</Form.Label>
              <Form.Control className="pill-input" type="number" step="0.01" placeholder="0.00" {...register('amount')} isInvalid={!!errors.amount} />
              <Form.Control.Feedback type="invalid">{errors.amount?.message}</Form.Control.Feedback>
            </Col>
            <Col md={6}>
              <Form.Label>Date</Form.Label>
              <Form.Control className="pill-input" type="date" {...register('date')} isInvalid={!!errors.date} />
              <Form.Control.Feedback type="invalid">{errors.date?.message}</Form.Control.Feedback>
            </Col>
            <Col md={12}>
              <Form.Label>Statut</Form.Label>
              <Form.Select className="pill-input" {...register('status')}>
                <option value="PENDING">En attente</option>
                <option value="PAID">Payée</option>
                <option value="CANCELLED">Annulée</option>
              </Form.Select>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Annuler</Button>
          <Button type="submit" className="gradient-btn" disabled={isSubmitting}>{initialValues ? 'Enregistrer' : 'Créer'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LiquidationModal;
