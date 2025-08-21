import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { Container, Row, Col, Button, Modal, Form, Card } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import LiquidationModal from './LiquidationModals';
import { listLiquidations, createLiquidation, updateLiquidation, getLiquidation, payLiquidation } from '../../services/liquidationService';

const columnsDef = (onEdit, onPay) => [
  { name: 'Client', selector: row => `${row.customer?.lastName} ${row.customer?.firstName}`, sortable: true },
  { name: 'Taxe', selector: row => row.taxType, sortable: true },
  { name: 'Montant', selector: row => row.amount, sortable: true },
  { name: 'Emission', selector: row => row.issueDate, sortable: true },
  { name: 'Echéance', selector: row => row.dueDate, sortable: true },
  { name: 'Statut', selector: row => row.status, sortable: true },
  {
    name: 'Actions',
    cell: row => (
      <div className="d-flex gap-2">
        <Button size="sm" variant="primary" onClick={() => onEdit(row)}>Modifier</Button>
        {row.status !== 'PAID' && (
          <Button size="sm" variant="success" onClick={() => onPay(row)}>Marquer payé</Button>
        )}
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
  const [filters, setFilters] = useState({ customerId: '', status: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    const res = await listLiquidations({
      customerId: filters.customerId || undefined,
      status: filters.status || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      page,
      size,
    });
    setData(res.content || []);
    setTotalRows(res.totalElements || 0);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => { setEditing(null); setShowModal(true); };
  const handleEdit = (row) => { setEditing(row); setShowModal(true); };
  const handlePay = async (row) => {
    await payLiquidation(row.id);
    fetchData();
  };

  const onSubmit = async (form) => {
    if (editing) await updateLiquidation(editing.id, form);
    else await createLiquidation(form);
    fetchData();
    setShowModal(false);
    setEditing(null);
  };

  const columns = useMemo(() => columnsDef(handleEdit, handlePay), []);

  return (
    <Container fluid className="page-fluid page-flex">
      <Row className="mb-3 align-items-center mx-0">
        <Col><h2 className="section-title">Liquidations</h2></Col>
        <Col md="auto"><Button variant="success" onClick={handleAdd}><FaPlus className="me-2" />Ajouter</Button></Col>
      </Row>

      <Card className="mb-3 p-3">
        <Form className="row g-2">
          <div className="col-md-3">
            <Form.Label>Client ID</Form.Label>
            <Form.Control value={filters.customerId} onChange={e => setFilters({ ...filters, customerId: e.target.value })} placeholder="ID client" />
          </div>
          <div className="col-md-3">
            <Form.Label>Statut</Form.Label>
            <Form.Select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
              <option value="">Tous</option>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="OVERDUE">OVERDUE</option>
            </Form.Select>
          </div>
          <div className="col-md-3">
            <Form.Label>Début</Form.Label>
            <Form.Control type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
          </div>
          <div className="col-md-3">
            <Form.Label>Fin</Form.Label>
            <Form.Control type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
          </div>
          <div className="col-12 text-end">
            <Button variant="primary" onClick={() => { setPage(0); fetchData(); }}>Filtrer</Button>
          </div>
        </Form>
      </Card>

      <div className="surface dt-wrapper full-bleed">
        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={(newPerPage) => { setSize(newPerPage); setPage(0); fetchData(); }}
          onChangePage={(p) => { setPage(p - 1); fetchData(); }}
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

      {/* plus de suppression locale: actions via API */}
    </Container>
  );
};

export default LiquidationsPage;
