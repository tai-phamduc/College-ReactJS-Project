import { useEffect } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';
import React from 'react';
import "./Navbar.css"

const Toggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="nav-link d-flex align-items-center"
    style={{ color: 'white' }}
  >
    <span>{children}</span>
    <FaChevronDown style={{ marginLeft: '8px', marginTop: '2px', fontSize: '0.75rem' }} />
  </a>
));

const CustomNavbar = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('bg-dark', 'navbar-sticky');
        } else {
          navbar.classList.remove('bg-dark', 'navbar-sticky');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const fontStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: '400',
  };

  return (
    <Navbar className="navbar-section navbar navbar-expand-lg fixed-top navbar-dark" style={fontStyle}>
      <div className='container-xxl'>
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <img
            src="https://demo.ovatheme.com/aovis/wp-content/uploads/2023/02/logo-white.png"
            alt="Aovis Logo"
            style={{ width: '108px', height: 'auto' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-3">
            {/* Home Dropdown */}
            <Nav.Link href="/home" className="mx-2">Home</Nav.Link>

            {/* Movies Dropdown */}
            <Dropdown className="mx-2">
              <Dropdown.Toggle as={Toggle}>Movies</Dropdown.Toggle>
              <Dropdown.Menu>

                <Dropdown drop="end">
                  <Dropdown.Item as="a" className="dropdown-item" href="/movies-now-playing">Movies Now Playing</Dropdown.Item>
                </Dropdown>

                <Dropdown drop="end">
                  <Dropdown.Item as="a" className="dropdown-item" href="/movies-coming-soon">Movies Coming Soon</Dropdown.Item>
                </Dropdown>

              </Dropdown.Menu>
            </Dropdown>

            {/* Other Nav Items */}
            <Dropdown className="mx-2">
              <Nav.Link href="#Events" className="mx-2">Events</Nav.Link>

              {/* <Dropdown.Toggle as={Toggle}>Events</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Event 1</Dropdown.Item>
                <Dropdown.Item href="#">Event 2</Dropdown.Item>
              </Dropdown.Menu> */}
            </Dropdown>

              {/* <Dropdown className="mx-2">
                <Dropdown.Toggle as={Toggle}>Pages</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Page 1</Dropdown.Item>
                  <Dropdown.Item href="#">Page 2</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}

            <Dropdown className="mx-2">
              <Nav.Link href="#new" className="mx-2">News</Nav.Link>

              {/* <Dropdown.Toggle as={Toggle}>News</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">News 1</Dropdown.Item>
                <Dropdown.Item href="#">News 2</Dropdown.Item>
              </Dropdown.Menu> */}
            </Dropdown>

            <Nav.Link href="#contact" className="mx-2">Contact</Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link href="#search" className="text-white mx-2">
              <i className="fas fa-search" style={{ fontSize: '1.5rem', opacity: 0.8 }} />
            </Nav.Link>
            <Nav.Link href="/my-account" className="text-white mx-2">
              <i className="far fa-user" style={{ fontSize: '1.5rem', fontWeight: '300', opacity: 0.8 }} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
