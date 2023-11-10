import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../api/axiosDefaults";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

function DeleteEventModal({ eventId }) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteTask = async () => {
    try {
      await axiosRequest.delete(`/events/${eventId}/`);
      navigate("/events");
      toast.success(`Event deleted successfully`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting Event:", error);
    }
  };
  DeleteEventModal.propTypes = {
    eventId: PropTypes.number.isRequired,
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
