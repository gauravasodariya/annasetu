import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Modal, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios'; 
import AuthContext from '../context/authContext';
import './Header.css';

const Header = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user, loading } = authContext;
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [savedFoods, setSavedFoods] = useState([]);
  
  useEffect(() => {
    const loadSavedFoods = () => {
      const foods = localStorage.getItem('selectedFoods');
      if (foods) {
        setSavedFoods(JSON.parse(foods));
      }
    };
    
    loadSavedFoods();
    
    window.addEventListener('storage', loadSavedFoods);
    
    const interval = setInterval(loadSavedFoods, 2000);
    
    return () => {
      window.removeEventListener('storage', loadSavedFoods);
      clearInterval(interval);
    };
  }, []);
  
  const handleBulkRequest = async () => {
    try {
      const foods = JSON.parse(localStorage.getItem('selectedFoods') || '[]');
      
      if (foods.length === 0) {
        setAlert({
          show: true,
          message: 'No items in cart to request',
          type: 'warning'
        });
        return;
      }
      
      const response = await axios.post('/api/requests/bulk', { 
        items: foods.map(food => food._id),
        notes: `Bulk request for ${foods.length} items`
      });
      
      if (response.status === 200) {
        localStorage.removeItem('selectedFoods');
        setSavedFoods([]);
        
        setAlert({
          show: true,
          message: 'Bulk request submitted successfully!',
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Error submitting bulk request:', err);
      setAlert({
        show: true,
        message: 'Failed to submit request. Please try again.',
        type: 'danger'
      });
    }
    
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  const onLogout = () => {
    localStorage.removeItem('token');
    logout();
    window.location.replace('/login');
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (user && user.role === 'admin') {
      navigate('/admin');
    } else if (user && user.role === 'donor') {
      navigate('/donor');
    } else if (user && user.role === 'volunteer') {
      navigate('/volunteer'); 
    } else {
      navigate('/dashboard');
    }
  };
  
  const handleDonateClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    } else if (user && user.role !== 'donor') {
      e.preventDefault();
      setAlert({
        show: true,
        message: 'Only donors can access the donation page',
        type: 'warning'
      });
      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
    } else {
      navigate('/donate');
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login');
  };
  
  const authLinks = (
    <Fragment>
      {user && user.role === 'ngo' && (
        <NavDropdown 
          title={
            <span className="d-flex align-items-center">
              <i className="fas fa-shopping-basket me-1"></i> Selected Foods
              {savedFoods.length > 0 && (
                <Badge 
                  bg="danger" 
                  pill 
                  className="ms-1"
                  style={{ fontSize: '0.7rem' }}
                >
                  {savedFoods.length}
                </Badge>
              )}
            </span>
          } 
          id="selected-foods-dropdown"
          className="me-2 nav-dropdown-custom"
        >
          <NavDropdown.Header>Selected Food Items</NavDropdown.Header>
          {savedFoods.length > 0 ? (
            <>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {savedFoods.map(food => (
                  <NavDropdown.Item key={food._id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{food.foodType} - {food.foodCategory}</span>
                    </div>
                  </NavDropdown.Item>
                ))}
              </div>
              <NavDropdown.Divider />
              <NavDropdown.Item 
                as={Button}
                onClick={() => {
                  navigate('/request-food');
                }}
                className="text-success"
              >
                <i className="fas fa-check-circle me-1"></i> Request All Items
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Button}
                onClick={() => {
                  localStorage.removeItem('selectedFoods');
                  setSavedFoods([]);
                }}
                className="text-danger"
              >
                <i className="fas fa-trash-alt me-1"></i> Clear All Items
              </NavDropdown.Item>
            </>
          ) : (
            <NavDropdown.Item disabled>No items selected</NavDropdown.Item>
          )}
        </NavDropdown>
      )}
      
      <NavDropdown 
        title={
          <span>
            <i className="fas fa-user"></i> {user && user.name}
          </span>
        } 
        id="basic-nav-dropdown"
      >
        {user && user.role === 'volunteer' && (
          <NavDropdown.Item as={Link} to="/volunteer">
            <i className="fas fa-tachometer-alt me-2"></i> Dashboard
          </NavDropdown.Item>
        )}
        <NavDropdown.Item as={Link} to="/profile">
          <i className="fas fa-id-card me-2"></i> My Profile
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={onLogout}>
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </NavDropdown.Item>
      </NavDropdown>
    </Fragment>
  );
  return (
    <>
      {alert.show && (
        <Alert 
          variant={alert.type} 
          className="m-2" 
          onClose={() => setAlert({...alert, show: false})} 
          dismissible
        >
          {alert.message}
        </Alert>
      )}
      
      <Navbar className="navbar-white navbar-fixed" expand="lg">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/" className="fw-bold me-5">
            <img 
              src="/images/logo.png" 
              alt="AnnaSetu" 
              className="annasetu-logo" 
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-5 me-auto">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`nav-link-custom mx-2 nav-link-larger ${location.pathname === '/' ? 'active-link' : ''}`}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/about" 
                className={`nav-link-custom mx-2 nav-link-larger ${location.pathname === '/about' ? 'active-link' : ''}`}
              >
                About
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/contact" 
                className={`nav-link-custom mx-2 nav-link-larger ${location.pathname === '/contact' ? 'active-link' : ''}`}
              >
                Contact
              </Nav.Link>
              
              {isAuthenticated && user && (user.role === 'ngo' || user.role === 'admin') && (
                <Nav.Link 
                  as={Link} 
                  to="/request-food" 
                  className={`nav-link-custom mx-2 nav-link-larger ${location.pathname === '/request-food' ? 'active-link' : ''}`}
                >
                  Request Food
                </Nav.Link>
              )}
              
              
              {(!isAuthenticated || (user && user.role === 'donor')) && (
                isAuthenticated && user && user.role === 'donor' ? (
                  <Nav.Link 
                    as={Link} 
                    to="/donate" 
                    className={`nav-link-custom nav-link-larger ${location.pathname === '/donate' ? 'active-link' : ''}`}
                  >
                    Donate
                  </Nav.Link>
                ) : (
                  <Nav.Link 
                    as={Link} 
                    to="#" 
                    className="nav-link-custom nav-link-larger"
                    onClick={handleDonateClick}
                  >
                    Donate
                  </Nav.Link>
                )
              )}
            </Nav>
            
            <Nav>
              {isAuthenticated ? (
                <>
                  <NavDropdown 
                    title={
                      <span className="nav-link-custom">
                        {user && user.name ? user.name : 'Profile'}
                      </span>
                    } 
                    id="basic-nav-dropdown"
                    className="nav-dropdown-custom nav-link-larger"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                    {user && user.role === 'admin' && (
                      <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
                    )}
                    {user && user.role === 'ngo' && (
                      <NavDropdown.Item as={Link} to="/ngo/dashboard">Dashboard</NavDropdown.Item>
                    )}
                    {user && user.role === 'donor' && (
                      <NavDropdown.Item as={Link} to="/dashboard">Donation History</NavDropdown.Item>
                    )}
                    {user && user.role === 'volunteer' && (
                      <NavDropdown.Item as={Link} to="/volunteer">Dashboard</NavDropdown.Item>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                  
                  {user && user.role === 'ngo' && (
                    <Nav.Link 
                      as={Link} 
                      to="/food-cart" 
                      className={`nav-link-custom ms-2 nav-link-larger${location.pathname === '/food-cart' ? 'active-link' : ''}`}
                    >
                      <span className="d-flex align-items-center">
                        <i className="fas fa-shopping-cart me-1"></i> Food Cart
                        {savedFoods.length > 0 && (
                          <Badge 
                            bg="danger" 
                            pill 
                            className="ms-1"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {savedFoods.length}
                          </Badge>
                        )}
                      </span>
                    </Nav.Link>
                  )}
                </>
              ) : (
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className={`nav-link-custom nav-link-larger${location.pathname === '/login' ? 'active-link' : ''}`}
                >
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLoginModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please login to access the donation feature. Only registered donors can make donations.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLoginRedirect}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
