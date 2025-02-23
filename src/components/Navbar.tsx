import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './Navbar.css';

const NavbarComponent = () => {
  return (
    <Navbar expand="lg" className="custom-navbar" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand href="/" className="brand">
          <span className="brand-text">Library Management</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" className="nav-link">Book</Nav.Link>
            <Nav.Link href="/books" className="nav-link">Staff</Nav.Link>
            <Nav.Link href="/about" className="nav-link">Members</Nav.Link>
            <Nav.Link href="/contact" className="nav-link">Lending</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent; 