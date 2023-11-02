import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../api/axiosDefaults";

function DeleteEventModal({ eventId }) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteTask = async () => {
    try {
      await axiosRequest.delete(`/events/${eventId}/`);
      navigate("/events");
    } catch (error) {
      console.error("Error deleting Event:", error);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Delete Event +
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Event?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteTask();
              handleClose();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteEventModal;