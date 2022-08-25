import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Form, Card, Button } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Student(props) {
  const [state, setState] = useState({
    id: "",
    name: "",
    age: "",
    address: "",
  });

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

  const { patientId } = useParams(); // Get the Path Parameter from the URL
  const navigate = useNavigate();

  useEffect(() => {
    if (patientId) {
      axios
        .get(`http://localhost:8080/patients/${patientId}`)
        .then((response) => {
          if (response.data != null) {
            setState({
              name: response.data.name,
              address: response.data.address,
              age: response.data.age,
              id: response.data.id,
            });
          }
        })
        .catch((error) => props.showAlert("danger", "Error"));
    }
  }, []);

  const textChanged = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setState({
      ...state,
      [name]: value,
    });
  };

  let patient = {
    id: state.id,
    name: state.name,
    age: state.age,
    address: state.address,
  };

  const savePatient = (event) => {
    event.preventDefault();
    // console.log(student);

    axios
      .post("http://localhost:8080/patients", patient)
      .then((response) => {
        // console.log(response.data);
        if (response.data != null) {
          // props.showAlert("success", "Record added successfully");
          notify("record added successfully", false);
          setState({ id: "", name: "", address: "", age: "" });
        }
      })
      .catch((error) => props.showAlert("danger", "Error"));
  };

  const updatePatient = (event) => {
    event.preventDefault();
    // console.log(studentId);
    axios
      .put(`http://localhost:8080/patients/${patientId}`, patient)
      .then((response) => {
        if (response.data != null) {
          props.showAlert("success", "Record updated successfully");
          notify("record updated successfully", false);
          navigate("/listPatients"); // Navigate to Students List Components
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="my-3">
      <Container>
        <Card>
          <Form onSubmit={patientId != null ? updatePatient : savePatient}>
            <Card.Header>
              <strong>
                {patientId != null
                  ? "Update Patient Information"
                  : "Add Patient Information"}
              </strong>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Id</Form.Label>
                <Form.Control
                  name="id"
                  value={state.id}
                  type="text"
                  placeholder="Enter id"
                  onChange={textChanged}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={state.name}
                  type="text"
                  placeholder="Enter first name"
                  onChange={textChanged}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  name="age"
                  value={state.age}
                  type="text"
                  placeholder="Enter age"
                  onChange={textChanged}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  value={state.address}
                  type="text"
                  placeholder="Enter address"
                  onChange={textChanged}
                />
              </Form.Group>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" type="submit" onClick={notify}>
                {patientId != null ? "Update" : "Submit"}
              </Button>
            </Card.Footer>
          </Form>
        </Card>
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
