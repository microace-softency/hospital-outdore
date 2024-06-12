import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const checkupSchema = yup.object({
    id: yup.string().required('ID is required'),
    date: yup.date().required('Date is required'),
    mobileNo: yup.string().required('Mobile Number is required'),
    name: yup.string().required('Name is required'),
    photo: yup.string().url('Photo must be a valid URL'),
    testsAssigned: yup.array().of(
        yup.object().shape({
            testName: yup.string().required('Test Name is required'),
            remarks: yup.string().required('Result is required'),
        })
    ), basicTests: yup.string().required('Basic Tests are required'),
    prescribedMedicine: yup.string().required('Prescribed Medicine is required'),
    note: yup.string().required('note is required'),
});

function CheckupForm({ onCreate, onCancel }) {
    const [tests, setTests] = useState([{ testName: '', result: '' }]);
    const [medicines, setMedicines] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, isDirty, isValid, errors },
    } = useForm({
        resolver: yupResolver(checkupSchema),
    });

    const onSubmit = (data) => {
        onCreate(data);
    };
    const addTestField = () => {
        setTests([...tests, { testName: '', result: '' }]);
    };

    const handleTestChange = (index, event) => {
        const { name, value } = event.target;
        const newTests = [...tests];
        newTests[index][name] = value;
        setTests(newTests);
    };
    const handleDeleteTest = (index) => {
        setTests((prevTests) => {
            const updatedTests = [...prevTests];
            updatedTests.splice(index, 1);
            return updatedTests;
        });
    };
    const handleAddMedicine = () => {
        setMedicines((prevMedicines) => [...prevMedicines, { name: '', instruction: '', dosage: '' }]);
    };

    const handleDeleteMedicine = (index) => {
        setMedicines((prevMedicines) => {
            const updatedMedicines = [...prevMedicines];
            updatedMedicines.splice(index, 1);
            return updatedMedicines;
        });
    };
    return (
        <div>
            <h2 className='text-xl font-semibold'>Checkup Form</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className='p-2'>
                    <Col lg={6} md={6} sm={12}>
                        <Form.Group controlId='id'>
                            <Form.Label className='block text-gray-700 font-medium'>Id</Form.Label>
                            <Form.Control type='text' {...register('id')} />
                            {errors.id && (
                                <span className='text-danger'>{errors.id.message}</span>
                            )}
                        </Form.Group>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                        <Form.Group controlId='mobileNo'>
                            <Form.Label className='block text-gray-700 font-medium'>Mobile Number</Form.Label>
                            <Form.Control type='text' {...register('mobileNo')} />
                            {errors.mobileNo && (
                                <span className='text-danger'>{errors.mobileNo.message}</span>
                            )}
                        </Form.Group>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                        <Form.Group controlId='name'>
                            <Form.Label className='block text-gray-700 font-medium'>Name</Form.Label>
                            <Form.Control type='text' {...register('name')} />
                            {errors.name && (
                                <span className='text-danger'>{errors.name.message}</span>
                            )}
                        </Form.Group>
                    </Col>
                    <Col lg={3} md={4} sm={6} xs={6}>
                        <Form.Group controlId='age'>
                            <Form.Label className='block text-gray-700 font-medium'>Age</Form.Label>
                            <Form.Control type='text' {...register('age')} />
                            {errors.age && (
                                <span className='text-danger'>{errors.age.message}</span>
                            )}
                        </Form.Group>
                    </Col>
                    <Row>
                        <Col lg={6}>
                            {/* Other form fields */}
                            <Form.Group controlId='testsAssigned'>
                                <Form.Label className='font-semibold'>Assign Tests</Form.Label>
                                {tests.map((test, index) => (
                                    <div key={index}>
                                        <Row className='my-1'>
                                            <Col>
                                                <Form.Control
                                                    as='select'
                                                    name='testName'
                                                    value={test.testName}
                                                    onChange={(e) => handleTestChange(index, e)}
                                                >
                                                    <option value=''>Select Test</option>
                                                    {/* Options for selecting test names */}
                                                    <option value=''>Select Test</option>
                                                    <option value='Blood Pressure'>Blood Pressure</option>
                                                    <option value='Blood Sugar'>Blood Sugar</option>
                                                    <option value='Cholesterol'>Cholesterol</option>
                                                    <option value='Complete Blood Count'>Complete Blood Count</option>
                                                    <option value='Liver Function Tests'>Liver Function Tests</option>
                                                    <option value='Kidney Function Tests'>Kidney Function Tests</option>
                                                    <option value='Electrocardiogram (ECG)'>Electrocardiogram (ECG)</option>
                                                    <option value='X-Ray'>X-Ray</option>
                                                    <option value='Ultrasound'>Ultrasound</option>
                                                    <option value='MRI Scan'>MRI Scan</option>
                                                    {/* Add more options as needed */}
                                                </Form.Control>
                                                {errors.testsAssigned && <span className='text-danger'>{errors.testsAssigned[index]?.testName?.message}</span>}
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type='text'
                                                    name='remarks'
                                                    placeholder='remarks'
                                                    value={test.remarks}
                                                    onChange={(e) => handleTestChange(index, e)}
                                                />
                                                {errors.testsAssigned && <span className='text-danger'>{errors.testsAssigned[index]?.remarks?.message}</span>}
                                            </Col>
                                            {index !== 0 ?
                                                <Col lg={2}>
                                                    <Button variant='danger' onClick={() => handleDeleteTest(index)}>Delete</Button>
                                                </Col> :
                                                <Col lg={2}>
                                                </Col>}
                                        </Row>
                                    </div>
                                ))}
                            </Form.Group>
                            <Button className='w-full my-2' variant='outline-primary' onClick={addTestField}>Add Test</Button>
                        </Col>
                        <Col lg={6}>
                            <Form.Group>
                                <Form.Label className='font-semibold'>Prescribed Medicines</Form.Label>
                                {medicines.map((medicine, index) => (
                                    <div key={index} className='border p-1 rounded flex flex-row gap-1 mb-1'>
                                        <Form.Control
                                            type="text"
                                            placeholder="Medicine name"
                                            value={medicine.name}
                                            onChange={(e) => {
                                                const updatedMedicines = [...medicines];
                                                updatedMedicines[index].name = e.target.value;
                                                setMedicines(updatedMedicines);
                                            }}
                                        />
                                        <Form.Control
                                            type="text"
                                            placeholder="Instruction"
                                            value={medicine.instruction}
                                            onChange={(e) => {
                                                const updatedMedicines = [...medicines];
                                                updatedMedicines[index].instruction = e.target.value;
                                                setMedicines(updatedMedicines);
                                            }}
                                        />
                                        <Form.Control
                                            type="text"
                                            placeholder="Dosage"
                                            value={medicine.dosage}
                                            onChange={(e) => {
                                                const updatedMedicines = [...medicines];
                                                updatedMedicines[index].dosage = e.target.value;
                                                setMedicines(updatedMedicines);
                                            }}
                                        />
                                        <Button
                                            disabled={index === 0}
                                            variant="danger" onClick={() => handleDeleteMedicine(index)}>Delete</Button>
                                    </div>
                                ))}
                                <Button className='w-full' variant='outline-primary' onClick={handleAddMedicine}>Add Medicine</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Col lg={6}>
                        <Form.Group controlId='note'>
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6} {...register('note')} />
                            {errors.note && <span className='text-danger'>{errors.note.message}</span>}
                        </Form.Group>
                    </Col>
                </Row>
                <div className='flex justify-content-between my-4'>
                    <Button variant='danger' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type='submit' disabled={isSubmitting || !isDirty}>
                        {isSubmitting ? 'Creating' : 'Create'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default CheckupForm;
