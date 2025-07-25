import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import { Modal, Button } from 'react-bootstrap';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, logout } = authContext;
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDonateClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
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
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">Dashboard</Link>
      </li>
      {user && user.role === 'donor' && (
        <li className="nav-item">
          <Link className="nav-link" to="/donate">Donate</Link>
        </li>
      )}
      {user && user.role !== 'ngo' && (
        <li className="nav-item">
          <Link className="nav-link" to="/request-food">Request Food</Link>
        </li>
      )}
      <li className="nav-item">
        <a onClick={onLogout} href="#!" className="nav-link">
          Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/register">Register</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">Login</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="#" onClick={handleDonateClick}>Donate</Link>
      </li>
    </>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">AnnaSetu</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </nav>

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

export default Navbar;
