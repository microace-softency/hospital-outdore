import React, { useState } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';

const AdmittingForm = ({ onCreate, onCancel }) => {
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        gender: '',
        reasonForAdmission: '',
        admittingDoctor: '',
        admittedBy: '',
        roomNumber: '',
        admissionDate: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="patientName">
                    <Form.Label>Patient Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        placeholder="Enter patient name"
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter patient's age"
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </Form.Select>
                </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="reasonForAdmission">
                <Form.Label>Reason for Admission</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="reasonForAdmission"
                    value={formData.reasonForAdmission}
                    onChange={handleChange}
                    placeholder="Enter reason for admission"
                />
            </Form.Group>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="admittingDoctor">
                    <Form.Label>Admitting Doctor</Form.Label>
                    <Form.Control
                        type="text"
                        name="admittingDoctor"
                        value={formData.admittingDoctor}
                        onChange={handleChange}
                        placeholder="Enter admitting doctor's name"
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="admittedBy">
                    <Form.Label>Admitted By</Form.Label>
                    <Form.Control
                        type="text"
                        name="admittedBy"
                        value={formData.admittedBy}
                        onChange={handleChange}
                        placeholder="Enter name of the person admitting"
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="roomNumber">
                    <Form.Label>Room Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        placeholder="Enter room number"
                    />
                </Form.Group>

                <Form.Group as={Col} controlId="admissionDate">
                    <Form.Label>Admission Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="admissionDate"
                        value={formData.admissionDate}
                        onChange={handleChange}
                    />
                </Form.Group>
            </Row>
            <div className='flex justify-content-between my-4'>
                <Button
                    variant='danger'
                    onClick={onCancel}
                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600'
                >
                    Cancel
                </Button>
            <Button variant="primary" type="submit">
                Admit
            </Button>
            </div>
        </Form>
    );
};

export default AdmittingForm;
