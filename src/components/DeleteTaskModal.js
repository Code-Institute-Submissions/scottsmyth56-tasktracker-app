import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosRequest } from "../api/axiosDefaults";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

function DeleteTaskModal({ taskId }) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteTask = async () => {
    try {
      await axiosRequest.delete(`/tasks/${taskId}/`);
      navigate("/");
      toast.success(`Task deleted successfully`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  DeleteTaskModal.propTypes = {
    taskId: PropTypes.number.isRequired,
  };
  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Delete Task +
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
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

export default DeleteTaskModal;
