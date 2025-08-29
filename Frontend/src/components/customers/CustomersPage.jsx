import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CustomerModals from './CustomerModals';
import LiquidationModal from '../liquidations/LiquidationModals.jsx';
import customerService from '../../services/customerService.js';
import liquidationService from '../../services/liquidationService.js';
import { authService } from '../../services/api';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerModalType, setCustomerModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showLiquidationModal, setShowLiquidationModal] = useState(false);
  const [selectedLiquidation, setSelectedLiquidation] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [error, setError] = useState(null);

  const isAdmin = authService.isAdmin();

  // Colonnes pour le DataTable
  const columns = useMemo(() => [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px' },
    { name: 'Nom', selector: row => row.lastName, sortable: true },
    { name: 'Prénom', selector: row => row.firstName, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Téléphone', selector: row => row.phone, sortable: true },
    { name: 'IFU', selector: row => row.ifu, sortable: true },
    { name: 'Adresse', selector: row => row.address, sortable: true, wrap: true },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-1">
          <Button variant="outline-info" size="sm" onClick={() => handleView(row)} title="Voir">
            <FaEye />
          </Button>
          <Button variant="outline-warning" size="sm" onClick={() => handleEdit(row)} title="Modifier">
            <FaEdit />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row)} title="Supprimer">
            <FaTrash />
          </Button>
        </div>
      ),
      width: '150px',
    },
  ], []);

  // Charger les clients
  const loadCustomers = async (page = 0, search = '') => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (search.trim()) {
        response = await customerService.search(search, page, pageSize);
      } else {
        response = await customerService.list(page, pageSize);
      }
      setCustomers(response.content || response);
      setTotalRows(response.totalElements || 0);
    } catch (err) {
      console.error('Erreur lors du chargement des clients:', err);
      setError('Erreur lors du chargement des clients');
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(currentPage, searchTerm);
  }, [currentPage, pageSize]);

  // Recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      loadCustomers(0, searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerRowsChange = (newPerPage, page) => {
    setPageSize(newPerPage);
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setCustomerModalType('add');
    setSelectedCustomer(null);
    setShowCustomerModal(true);
  };

  const handleEdit = (customer) => {
    setCustomerModalType('edit');
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleView = async (customer) => {
    setCustomerModalType('view');
    try {
      const liquidations = await liquidationService.getByCustomer(customer.id);
      setSelectedCustomer({ ...customer, liquidations });
    } catch (err) {
      console.error('Erreur lors du chargement des liquidations:', err);
      toast.error('Impossible de charger les liquidations du client');
      setSelectedCustomer(customer);
    } finally {
      setShowCustomerModal(true);
    }
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await customerService.delete(customerToDelete.id);
      toast.success('Client supprimé avec succès');
      loadCustomers(currentPage, searchTerm);
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression du client');
    }
  };

  const handleCustomerModalClose = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  const handleCustomerModalSuccess = () => {
    loadCustomers(currentPage, searchTerm);
    handleCustomerModalClose();
  };

  // Gestion LiquidationModal
  const handleAddLiquidation = (customer) => {
    setSelectedLiquidation({ customer });
    setShowLiquidationModal(true);
  };

  const handleLiquidationModalClose = () => {
    setShowLiquidationModal(false);
    setSelectedLiquidation(null);
  };

  const handleLiquidationSuccess = () => {
    // Recharger les liquidations du client si modal view est ouvert
    if (selectedCustomer) handleView(selectedCustomer);
    handleLiquidationModalClose();
  };

  return (
    <Container fluid className="page-fluid page-flex">
      <Row className="mb-4">
        <Col><h2>Gestion des Clients</h2></Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Ajouter un client
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          <DataTable
            title="Liste des Clients"
            columns={columns}
            data={customers}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            responsive
            highlightOnHover
            pointerOnHover
            noDataComponent="Aucun client trouvé"
            progressComponent={<div>Chargement...</div>}
          />
        </Card.Body>
      </Card>

      {/* Modal client */}
      <CustomerModals
        show={showCustomerModal}
        type={customerModalType}
        customer={selectedCustomer}
        onClose={handleCustomerModalClose}
        onSuccess={handleCustomerModalSuccess}
      />

      {/* Modal liquidation */}
      {showLiquidationModal && (
        <LiquidationModal
          show={showLiquidationModal}
          onHide={handleLiquidationModalClose}
          initialValues={selectedLiquidation}
          onSubmit={async (data) => {
            try {
              if (data.id) {
                await liquidationService.update(data.id, data);
                toast.success('Liquidation modifiée avec succès');
              } else {
                await liquidationService.create(data);
                toast.success('Liquidation ajoutée avec succès');
              }
              handleLiquidationSuccess();
            } catch (err) {
              console.error(err);
              toast.error('Erreur lors de l\'opération sur la liquidation');
            }
          }}
        />
      )}

      {/* Modal confirmation suppression client */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir supprimer le client <strong>{customerToDelete?.firstName} {customerToDelete?.lastName}</strong> ?</p>
                <p className="text-danger">Cette action est irréversible.</p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </Container>
  );
};

export default CustomersPage;
