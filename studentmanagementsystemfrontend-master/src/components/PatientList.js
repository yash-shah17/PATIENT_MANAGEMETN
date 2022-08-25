import React, { useEffect, useState } from "react";
import { Card, Container, Table, ButtonGroup, Button } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PatientList(props) {
  const [patients, setPatients] = useState([]);

  const notify = (message, hasError = false) => {
    if (hasError) {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients = async () => {
    axios
      .get("http://localhost:8080/patients")
      .then((response) => setPatients(response.data))
      .catch((error) => alert(error));
  };

  let deletePatient = (patientId) => {
    axios
      .delete(`http://localhost:8080/patients/${patientId}`)
      .then((response) => {
        if (response.data !== null) {
          props.showAlert("success", "Record deleted successfully");
          notify("student record deleted successfully");
          setPatients(patients.filter((patient) => patient.id !== patientId));
        }
      });
  };

  return (
    <div className="my-3">
      <Container>
        <Card.Header>
          <h3>Patients List</h3>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Patient Id</th>
                <th>Patient Name</th>
                <th>Patient age</th>
                <th>Patient Address</th>
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={3}>{patients.length} Patients Available!!!</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.address}</td>
                    <td>
                      <ButtonGroup>
                        <Link to={"/patient/" + patient.id}>
                          <Button size="sm" variant="outline-primary">
                            <FontAwesomeIcon icon={faEdit}>
                              Edit
                            </FontAwesomeIcon>
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={deletePatient.bind(this, patient.id)}
                        >
                          <FontAwesomeIcon icon={faTrash}>
                            Delete
                          </FontAwesomeIcon>
                        </Button>

                        {/* <Button size="sm" variant="outline-danger" onClick={()=>deleteStudent(student.id)}><FontAwesomeIcon icon={faTrash}> Delete </FontAwesomeIcon></Button> */}
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Container>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
