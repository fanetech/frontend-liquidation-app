import React, { useEffect, useMemo, useState } from 'react';
import { Card, Container, Row, Col, Button, InputGroup, Form, Modal, Pagination } from 'react-bootstrap';
import { liquidationService } from '../../services/liquidationService';
import { customerService } from '../../services/customerService';
import LiquidationModal from './LiquidationModals';
import { toast } from 'react-toastify';

const statusFr = (s) => s === 'PAID' ? 'Payée' : s === 'PENDING' ? 'En attente' : 'Annulée';
const statusClass = (s) => s === 'PAID' ? 'badge-paid' : s === 'PENDING' ? 'badge-pending' : 'badge-cancelled';

const LiquidationsPage = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [customerId, setCustomerId] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [data, setData] = useState(liquidationService.getAll());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const customers = customerService.getAll();

  const filtered = useMemo(() => {
    const items = liquidationService.search({ text: query, status, fromDate, toDate });
    if (customerId !== 'ALL') return items.filter(l => l.customerId === Number(customerId));
    return items;
  }, [query, status, fromDate, toDate, customerId, data]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const start = (page - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const paidCount = useMemo(() => filtered.filter(x => x.status === 'PAID').length, [filtered]);

  const handleAdd = () => { setEditing(null); setShowModal(true); };
  const handleEdit = (row) => { setEditing(row); setShowModal(true); };
  const handleView = (row) => setViewing(row);

  const onSubmit = (form) => {
    if (editing) {
      liquidationService.update(editing.id, { ...form, date: new Date(form.date).getTime() });
      toast.success('Liquidation mise à jour');
    } else {
      liquidationService.create({ ...form, date: new Date(form.date).getTime() });
      toast.success('Liquidation créée');
    }
    setData(liquidationService.getAll());
    setShowModal(false);
    setEditing(null);
  };

  const markPaid = (row) => {
    liquidationService.markPaid(row.id);
    setData(liquidationService.getAll());
    toast.success('Marquée comme payée');
  };

  return (
    <Container fluid className="page-fluid page-flex">
      <Row className="mb-3 align-items-center">
        <Col><h2 className="section-title">Liquidation Interface</h2></Col>
        <Col md="auto">
          <Button className="gradient-btn" onClick={handleAdd}>+ Nouvelle liquidation</Button>
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={3}>
          <Form.Label>Statut</Form.Label>
          <Form.Select value={status} onChange={(e)=>{ setStatus(e.target.value); setPage(1); }}>
            <option value="ALL">Tous</option>
            <option value="PENDING">En attente</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label>Du</Form.Label>
          <Form.Control type="date" value={fromDate} onChange={(e)=>{ setFromDate(e.target.value); setPage(1); }} />
        </Col>
        <Col md={3}>
          <Form.Label>Au</Form.Label>
          <Form.Control type="date" value={toDate} onChange={(e)=>{ setToDate(e.target.value); setPage(1); }} />
        </Col>
        <Col md={3}>
          <Form.Label>Client</Form.Label>
          <Form.Select value={customerId} onChange={(e)=>{ setCustomerId(e.target.value); setPage(1); }}>
            <option value="ALL">Nom, email ou +226…</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Label>Recherche</Form.Label>
          <Form.Control placeholder="Réf, client…" value={query} onChange={(e)=>{ setQuery(e.target.value); setPage(1); }} />
        </Col>
        <Col md={2} className="ms-auto">
          <Form.Label>Par page</Form.Label>
          <Form.Select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="flex-fill-scroll">
        <table className="table table-hover surface mb-0">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Date</th>
              <th>Client</th>
              <th className="text-end">Montant (FCFA)</th>
              <th>Statut</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>{row.code}</td>
                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td>{row.customerName}</td>
                <td className="text-end">{row.amount.toLocaleString()}</td>
                <td>
                  <span className={`badge badge-pill ${statusClass(row.status)}`}>{statusFr(row.status)}</span>
                </td>
                <td className="text-end">
                  <div className="action-group justify-content-end">
                    <Button size="sm" variant="outline-primary" onClick={()=>setEditing(row)}>Modifier</Button>
                    {row.status !== 'PAID' && (
                      <Button size="sm" variant="success" onClick={()=>markPaid(row)}>Marquer payé</Button>
                    )}
                    <Button size="sm" variant="outline-secondary" onClick={()=>setViewing(row)}>Détails</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Row className="mt-2">
        <Col className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">{filtered.length} enregistrement(s) • Page {page}/{totalPages}</div>
          <Pagination className="mb-0">
            <Pagination.First onClick={()=>setPage(1)} disabled={page===1} />
            <Pagination.Prev onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} />
            {Array.from({length: totalPages}, (_,i)=>i+1).map(p => (
              <Pagination.Item key={p} active={p===page} onClick={()=>setPage(p)}>{p}</Pagination.Item>
            ))}
            <Pagination.Next onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} />
            <Pagination.Last onClick={()=>setPage(totalPages)} disabled={page===totalPages} />
          </Pagination>
        </Col>
      </Row>

      <LiquidationModal
        show={showModal}
        onHide={()=>setShowModal(false)}
        initialValues={editing}
        onSubmit={onSubmit}
      />

      <Modal show={!!viewing} onHide={()=>setViewing(null)} centered>
        <Modal.Header closeButton><Modal.Title className="fw-bold">Détails liquidation</Modal.Title></Modal.Header>
        <Modal.Body>
          {viewing && (
            <div>
              <p className="mb-1"><strong>Référence:</strong> {viewing.code}</p>
              <p className="mb-1"><strong>Client:</strong> {viewing.customerName}</p>
              <p className="mb-1"><strong>Montant:</strong> {viewing.amount.toLocaleString()} FCFA</p>
              <p className="mb-1"><strong>Date:</strong> {new Date(viewing.date).toLocaleString()}</p>
              <p className="mb-0"><strong>Statut:</strong> {statusFr(viewing.status)}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default LiquidationsPage;
