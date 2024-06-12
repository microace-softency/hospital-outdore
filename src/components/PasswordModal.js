import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // Use your modal and form components

function PasswordModal({ show, onHide, onVerify, onChange }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Verify Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              onChange={onChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onVerify}>
          Verify
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PasswordModal;
