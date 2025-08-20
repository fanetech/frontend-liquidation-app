import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import LiquidationModal from './LiquidationModals';
import { getLiquidations, addLiquidation, updateLiquidation, deleteLiquidation } from '../../services/liquidationService';

const columnsDef = (onEdit, onDelete) => [
  { name: 'Client', selector: row => row.customer, sortable: true },
  { name: 'Montant', selector: row => row.amount, sortable: true },
  { name: 'Statut', selector: row => row.status, sortable: true },
  {
    name: 'Actions',
    cell: row => (
      <div className="d-flex gap-2">
        <Button size="sm" variant="primary" onClick={() => onEdit(row)}>Modifier</Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(row)}>Supprimer</Button>
      </div>
    ),
    ignoreRowClick: true,
    button: true,
  },
];

const customStyles = { headCells: { style: { fontWeight: 600 } } };

const LiquidationsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await getLiquidations();
    setData(res);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => { setEditing(null); setShowModal(true); };
  const handleEdit = (row) => { setEditing(row); setShowModal(true); };
  const handleDeleteAsk = (row) => setToDelete(row);
  const closeDelete = () => setToDelete(null);
  const confirmDelete = async () => {
    await deleteLiquidation(toDelete.id);
    fetchData();
    setToDelete(null);
  };

  const onSubmit = async (form) => {
    if (editing) await updateLiquidation(editing.id, form);
    else await addLiquidation(form);
    fetchData();
    setShowModal(false);
    setEditing(null);
  };

  const columns = useMemo(() => columnsDef(handleEdit, handleDeleteAsk), []);

  return (
    <Container fluid className="page-fluid page-flex">
      <Row className="mb-3 align-items-center mx-0">
        <Col><h2 className="section-title">Liquidations</h2></Col>
        <Col md="auto"><Button variant="success" onClick={handleAdd}><FaPlus className="me-2" />Ajouter</Button></Col>
      </Row>

      <div className="surface dt-wrapper full-bleed">
        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
          customStyles={customStyles}
          noDataComponent={<div className="text-muted p-3">Aucune liquidation</div>}
        />
      </div>

      {/* Modal d'ajout / modification */}
      <LiquidationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        initialValues={editing}
        onSubmit={onSubmit}
      />

      {/* Modal de confirmation suppression */}
      <Modal show={!!toDelete} onHide={closeDelete} centered>
        <Modal.Header closeButton><Modal.Title>Supprimer</Modal.Title></Modal.Header>
        <Modal.Body>Supprimer la liquidation de « {toDelete?.customer} » ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDelete}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LiquidationsPage;
