import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Button, Tabs, Tab, Alert, Spinner, Form, InputGroup, Container } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from '../../context/authContext';
import '../admin/AdminStyles.css';
import { useNavigate } from 'react-router-dom';

const NGORequests = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const navigate = useNavigate(); 
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/requests/user/ngo');
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setAlert({
        show: true,
        message: 'Failed to load requests. Please try again.',
        type: 'danger'
      });
      setLoading(false);
    }
  };

  const cancelRequest = async (id) => {
    try {
      const res = await axios.put(`/api/requests/cancel/${id}`);
      
      setAlert({
        show: true,
        message: res.data.msg || 'Request cancelled successfully',
        type: 'success'
      });
      
      fetchRequests();
    } catch (err) {
      console.error('Error cancelling request:', err);
      
      setAlert({
        show: true,
        message: err.response?.data?.msg || 'Failed to cancel request',
        type: 'danger'
      });
    }
  };

  const filteredRequests = requests.filter(request => 
    request.foodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.quantity?.toString().includes(searchTerm) ||
    request.urgency?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allRequests = filteredRequests;
  const pendingRequests = filteredRequests.filter(request => request.status.toLowerCase() === 'pending');
  const acceptedRequests = filteredRequests.filter(request => request.status.toLowerCase() === 'accepted');
  const rejectedRequests = filteredRequests.filter(request => request.status.toLowerCase() === 'rejected');
  const canceledRequests = filteredRequests.filter(request => request.status.toLowerCase() === 'canceled');
  
  const getFilteredRequests = () => {
    switch(activeTab) {
      case 'pending':
        return pendingRequests;
      case 'accepted':
        return acceptedRequests;
      case 'rejected':
        return rejectedRequests;
      case 'canceled':
        return canceledRequests;
      default:
        return allRequests;
    }
  };

  const displayRequests = getFilteredRequests();

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Badge bg="warning">PENDING</Badge>;
      case 'accepted':
        return <Badge bg="success">ACCEPTED</Badge>;
      case 'rejected':
        return <Badge bg="danger">REJECTED</Badge>;
      case 'completed':
        return <Badge bg="info">COMPLETED</Badge>;
      case 'canceled':
        return <Badge bg="secondary">CANCELED</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const RequestTable = ({ requests, onCancelClick }) => {
    if (loading) {
      return (
        <div className="text-center py-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    if (requests.length === 0) {
      return <p className="text-center py-3">No requests found.</p>;
    }
    
    return (
      <Table responsive hover className="donation-table">
        <thead className="table-header">
          <tr>
            <th>FOOD TYPE</th>
            <th>FOOD CATEGORY</th>
            <th>QUANTITY</th>
            <th>NOTES</th>
            <th>DATE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request._id} className="donation-row">
              <td>{request.foodType}</td>
              <td>{request.foodCategory || 'N/A'}</td>
              <td>{request.quantity}</td>
              <td>{request.notes || 'N/A'}</td>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>{getStatusBadge(request.status)}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button 
                    variant="info" 
                    size="sm" 
                    onClick={() => navigate(`/ngo/requests/${request._id}`)}
                  >
                    View Details
                  </Button>
                  {request.status.toLowerCase() === 'pending' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => {
                        if(window.confirm('Are you sure you want to cancel this request?')) {
                          onCancelClick(request._id);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4" style={{ color: '#4dd0e1' }}>My Food Requests</h2>
      
      {alert.show && (
        <Alert 
          variant={alert.type} 
          dismissible 
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}
      
      <Card className="mb-4 donation-management-card">
        <Card.Header className="donation-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Requests Management</h4>
            <Form.Group>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by food type, quantity, or urgency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                  Clear
                </Button>
              </InputGroup>
            </Form.Group>
          </div>
        </Card.Header>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="all" title={`All (${allRequests.length})`}>
              <RequestTable 
                requests={displayRequests} 
                onCancelClick={cancelRequest}
              />
            </Tab>
            <Tab eventKey="pending" title={`Pending (${pendingRequests.length})`}>
              <RequestTable 
                requests={displayRequests}
                onCancelClick={cancelRequest}
              />
            </Tab>
            <Tab eventKey="accepted" title={`Accepted (${acceptedRequests.length})`}>
              <RequestTable 
                requests={displayRequests}
                onCancelClick={cancelRequest}
              />
            </Tab>
            <Tab eventKey="rejected" title={`Rejected (${rejectedRequests.length})`}>
              <RequestTable 
                requests={displayRequests}
                onCancelClick={cancelRequest}
              />
            </Tab>
            <Tab eventKey="canceled" title={`Canceled (${canceledRequests.length})`}>
              <RequestTable 
                requests={displayRequests}
                onCancelClick={cancelRequest}
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NGORequests;
