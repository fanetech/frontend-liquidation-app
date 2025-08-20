import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Card, Container, Row, Col, Button, InputGroup, Form, Modal } from 'react-bootstrap';
import { customerService } from '../../services/customerService';
import CustomerModal from './CustomerModals';
import { FaPlus, FaSearch } from 'react-icons/fa';

const splitName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

const formatPhone226 = (phone = '') => {
  const digits = phone.replace(/[^0-9]/g, '');
  const local = digits.slice(-8);
  if (!local) return '+226';
  return '+226 ' + local.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};

const columnsDef = (onEdit, onDelete) => [
  { name: 'Prénom', selector: row => splitName(row.fullName).firstName, sortable: true },
  { name: 'Nom', selector: row => splitName(row.fullName).lastName, sortable: true, wrap: true },
  { name: 'Email', selector: row => row.email, sortable: true },
  { name: 'Téléphone', selector: row => formatPhone226(row.phone), cell: row => formatPhone226(row.phone) },
  {
    name: 'Actions',
    cell: row => (
      <div className="d-flex gap-2">
        <Button size="sm" className="btn btn-primary" variant="primary" onClick={() => onEdit(row)}>Modifier</Button>
        <Button size="sm" className="btn btn-danger" variant="danger" onClick={() => onDelete(row)}>Supprimer</Button>
      </div>
    ),
    ignoreRowClick: true,
    button: true,
  },
];

const customStyles = { headCells: { style: { fontWeight: 600 } } };

const CustomersPage = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { setLoading(true); setData(customerService.getAll()); setLoading(false); }, []);

  const filtered = useMemo(() => customerService.search(query), [query, data]);

  const handleAdd = () => { setEditing(null); setShowModal(true); };
  const handleEdit = (row) => { setEditing(row); setShowModal(true); };
  const handleDeleteAsk = (row) => setToDelete(row);
  const closeDelete = () => setToDelete(null);
  const confirmDelete = () => { customerService.remove(toDelete.id); setData(customerService.getAll()); setToDelete(null); };

  const onSubmit = (form) => { if (editing) customerService.update(editing.id, form); else customerService.create(form); setData(customerService.getAll()); setShowModal(false); setEditing(null); };

  const columns = useMemo(() => columnsDef(handleEdit, handleDeleteAsk), []);

  return (
    <Container fluid className="page-fluid">
      <Row className="mb-3 align-items-center">
        <Col><h2 className="section-title">Clients</h2></Col>
        <Col md="auto"><Button variant="success" onClick={handleAdd}><FaPlus className="me-2"/>Ajouter</Button></Col>
      </Row>

      <Card className="mb-3 p-3 toolbar">
        <Row className="g-2 align-items-center">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control className="pill-input" placeholder="Rechercher des clients…" value={query} onChange={(e)=>setQuery(e.target.value)} />
            </InputGroup>
          </Col>
          <Col md="auto" className="ms-auto">
            <div className="text-muted small">{filtered.length} résultat(s)</div>
          </Col>
        </Row>
      </Card>

      <div className="surface dt-wrapper">
        <DataTable
          columns={columns}
          data={filtered}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
          customStyles={customStyles}
          noDataComponent={<div className="text-muted p-3">Aucun client</div>}
        />
      </div>

      <CustomerModal show={showModal} onHide={()=>setShowModal(false)} initialValues={editing} onSubmit={onSubmit} />

      <Modal show={!!toDelete} onHide={closeDelete} centered>
        <Modal.Header closeButton><Modal.Title>Supprimer</Modal.Title></Modal.Header>
        <Modal.Body>Supprimer « {toDelete?.fullName} » ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDelete}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomersPage;
