// ViewModal.js
import React from 'react';
import Modal from 'react-bootstrap/Modal';

function ViewModal({ showModal, handleCloseModal, selectedItem, headers }) {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>View Item Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedItem && (
          <div>
            {/* Display item details here */}
            {headers.map((header, index) => (
              <div key={index}>
                <strong>{header}: </strong>
                {selectedItem[header.toLowerCase()]}
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleCloseModal}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewModal;
