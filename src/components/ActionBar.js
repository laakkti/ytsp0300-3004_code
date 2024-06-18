import React, { useState,useEffect,useRef } from 'react';
import { Button, Nav, Navbar } from 'react-bootstrap';
import {
  List
} from "react-bootstrap-icons";

/**
 * ActionBar provides a navigation bar with selectable options to control the displayed page content.
 * 
 * @param {string} page - The current active page.
 * @param {Function} setPage - The function to update the current page.
 * @returns {React.ReactElement} - A React Bootstrap Navbar element with navigation links.
 */

function ActionBar({ page, setPage}) {
  const [expanded, setExpanded] = useState(false);
  const [normalState, setNormalState] = useState(document.querySelector('.navbar-collapse'));
  const buttonRef = useRef(null);

  return (
    
    <Navbar collapseOnSelect expand="md" bg="transparent" expanded={expanded} data-bs-theme="dark" className='py-0'>
      
      <Button variant='outline-primary' ref={buttonRef} size="sm" className="menu-toggle me-0 mt-1 mb-0 ms-auto d-block d-md-none" aria-controls="responsive-navbar-nav" onClick={() => {setExpanded(expanded ? false : "expanded")}}><List/></Button>
        
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav
          variant="pills"
          defaultActiveKey="/"          
          className="nav nav-sm mx-auto"          
          onSelect={(selectedKey) => {setPage(selectedKey);setExpanded(false);}}
        >
          <Nav.Link eventKey="Chart" active={page === "Chart"}>
            Chart
          </Nav.Link>
          <Nav.Link eventKey="Statistics" active={page === "Statistics"}>
            Statistics
          </Nav.Link>
          <Nav.Link eventKey="CompareYears" active={page === "CompareYears"}>
            Compare years
          </Nav.Link>
          <Nav.Link eventKey="AreaOnMap" active={page === "AreaOnMap"}>
            On Map
          </Nav.Link>
          <Nav.Link eventKey="Location" active={page === "Location"}>
            Location
          </Nav.Link>
          <Nav.Link eventKey="Weather" active={page === "Weather"}>
            Weather
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>    
  );
}

export default ActionBar;
