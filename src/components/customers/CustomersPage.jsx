import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CustomerModals from './CustomerModals';
import { customerService } from '../../services/customerService';
import { authService } from '../../services/api';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [error, setError] = useState(null);

  const isAdmin = authService.isAdmin();

  // Colonnes pour le DataTable
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom',
      selector: row => row.lastName,
      sortable: true,
    },
    {
      name: 'Prénom',
      selector: row => row.firstName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Téléphone',
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: 'IFU',
      selector: row => row.ifu,
      sortable: true,
    },
    {
      name: 'Adresse',
      selector: row => row.address,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-1">
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => handleView(row)}
            title="Voir"
          >
            <FaEye />
          </Button>
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => handleEdit(row)}
            title="Modifier"
          >
            <FaEdit />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(row)}
            title="Supprimer"
          >
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
        response = await customerService.searchCustomers(search, page, pageSize);
      } else {
        response = await customerService.getCustomers(page, pageSize);
      }
      
      setCustomers(response.content || response);
      setTotalRows(response.totalElements || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      setError('Erreur lors du chargement des clients');
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les clients au montage et lors des changements
  useEffect(() => {
    loadCustomers(currentPage, searchTerm);
  }, [currentPage, pageSize]);

  // Recherche en temps réel avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0); // Reset à la première page lors de la recherche
      loadCustomers(0, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Gestionnaires d'événements
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPageSize(newPerPage);
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setModalType('add');
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setModalType('edit');
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleView = (customer) => {
    setModalType('view');
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await customerService.deleteCustomer(customerToDelete.id);
      toast.success('Client supprimé avec succès');
      loadCustomers(currentPage, searchTerm);
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du client');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleModalSuccess = () => {
    loadCustomers(currentPage, searchTerm);
    handleModalClose();
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Gestion des Clients</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAdd}>
            <FaPlus className="me-2" />
            Ajouter un client
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Modal pour ajouter/modifier/voir un client */}
      <CustomerModals
        show={showModal}
        type={modalType}
        customer={selectedCustomer}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Êtes-vous sûr de vouloir supprimer le client{' '}
                  <strong>{customerToDelete?.firstName} {customerToDelete?.lastName}</strong> ?
                </p>
                <p className="text-danger">Cette action est irréversible.</p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Annuler
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Supprimer
                </Button>
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
