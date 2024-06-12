import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner, Form, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { collection, doc, getDoc, limit, query, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firebase configuration
import { collections } from '../../config';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '../../context/AuthContext';
import { adminCollection } from '../../services';

const schema = yup
  .object({
    CUSTCODE: yup.string(),
    NAME: yup.string().required('Name Must be between 3 to 50 charcters'),
    CPERSON: yup.string(),
    MOBPHONE: yup
    .string()
    .test('is-ten-digit-number', 'Mobile number must be a 10-digit number', (value) => {
      if (/^\d{10}$/.test(value) || /^\d{0}$/.test(value)) {
        return true;
      }
      return false;
    }),
    AGENTCODE: yup.string(),
    AGENTNAME: yup.string(),
    GSTIn: yup.string().test('is-fifteen-digit-number', 'GST must be 15 in characters', (value) => {
        if (/^\d{15}$/.test(value) || /^\d{0}$/.test(value)) {
          return true;
        }
        return false;
    }),
    ADDRESS: yup.string(),
    CITY: yup.string(),
    PINCODE: yup.number().nullable().moreThan(0, "Pincode can't be negative").transform((_, val) => (val !== "" ? Number(val) : null)),
    STATE: yup.string(),
    COUNTRY: yup.string(),
    BankName: yup.string(),
    AccountNo: yup
    .string()
    .test('is-ten-digit-number', 'acc no number must be a 10-digit number', (value) => {
      if (value > 10000000 || !value) {
        return true;
      }
      return false;
    }),
    BBranch: yup.string(),
    IFSC: yup.string(),
    Opening: yup.string(),
    CLimite: yup.number(),
  })
  .required();

function ViewCustomer() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting, isDirty, isValid, errors }
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate()
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const cId = parts[parts.length -1];
  const p = url.split("/");
  const model = p[p.length -2];
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const { myCollection } = useAuth();
  const customer = adminCollection(collections.ADMINCUSTOMERS)

  useEffect(() => {
    const fetchCustomersData = async () => {
      setIsLoading(true)
      try {
        const ref = doc(await customer, cId)
        const customerData = await getDoc(ref)
        if (customerData.exists()) {
          setValue('CUSTCODE', customerData.data().CUSTCODE);
          setValue('NAME', customerData.data().NAME);
          setValue('CPERSON', customerData.data().CPERSON || '');
          setValue('MOBPHONE', customerData.data().MOBPHONE || '');
          setValue('AGENTCODE', customerData.data().AGENTCODE || '');
          setValue('AGENTNAME', customerData.data().AGENTNAME || '');
          setValue('GSTIn', customerData.data().GSTIn || '');
          setValue('ADDRESS', customerData.data().ADDRESS || '');
          setValue('CITY', customerData.data().CITY || '');
          setValue('PINCODE', customerData.data().PINCODE || '');
          setValue('STATE', customerData.data().STATE || '');
          setValue('COUNTRY', customerData.data().COUNTRY || '');
          setValue('BankName', customerData.data().BankName || '');
          setValue('AccountNo', customerData.data().AccountNo || '');
          setValue('BBranch', customerData.data().BBranch || '');
          setValue('IFSC', customerData.data().IFSC || '');
          setValue('Opening', customerData.data().Opening || 0);
          setValue('CLimite', customerData.data().CLimite || 0);
          // setValue('CUST_VEND', customerData.data().CUST_VEND);
          setInitialData(customerData.data())
        } else {
          console.log('no data found');
        }
        // console.log(doc.data());
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false)
    }
    fetchCustomersData()
  }, [cId]);

  const handleUpdateData = async () => {
    setIsLoading(true);
    const updatedData = getValues();
    // console.log('editing', updatedData);
    const customerRef = doc(await customer, cId);
    try {
      await updateDoc(customerRef, updatedData);
      setIsEditing(false);
      setIsSaveButtonDisabled(true);
    } catch (error) {
      console.log('Error updating customer data s: ', error);
    }
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold ">{isEditing ? `Edit ${model} Details` : `${model} Details`}</h2>
      <div className='flex justify-between items-center'>
        <Button
          onClick={() => navigate(`/${model}`)}
          className='my-2 px-4'> back
        </Button>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className='my-2 px-4'>{isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      {getValues().CUSTCODE ? (
        <div className="bg-white shadow-md rounded px-8 py-6">
          <Form onSubmit={handleSubmit(handleUpdateData)}>
            <div className=' py-2'>
              <Row >
                <Col lg={3} md={6} sm={12} className="">
                  <Form.Group controlId="CUSTCODE">
                    <Form.Label className="block text-gray-700 font-medium">CUSTCODE</Form.Label>
                    <Form.Control
                      type="text"
                      name="CUSTCODE"
                      disabled
                      {...register('CUSTCODE')}
                    />
                  </Form.Group>
                </Col>
                <Col lg={9} md={6} sm={12} className="">
                  <Form.Group controlId="name">
                    <Form.Label className="block text-gray-700 font-medium">Name</Form.Label>
                    <Form.Control
                    disabled={!isEditing}
                      type="name"
                      name="NAME"
                      {...register('NAME')}
                      placeholder="Enter Customer/vendor Name"
                    />
                    {errors.NAME && <span className="text-danger h-0">{errors.NAME.message}</span>}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="CPERSON">
                    <Form.Label className="block text-gray-700 font-medium">Con Person</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="text"
                      name="CPERSON"
                      {...register('CPERSON')}
                      placeholder="Enter Contact Person Name"
                    />
                    {errors.CPERSON && <span className="text-danger h-0">{errors.CPERSON.message}</span>}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="MOBPHONE">
                    <Form.Label className="block text-gray-700 font-medium">Mobile Number</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="text"
                      name="MOBPHONE"
                      {...register('MOBPHONE')}
                      placeholder="Enter Mobile Number"
                    />
                    {errors.MOBPHONE && <span className="text-danger h-0">{errors.MOBPHONE.message}</span>}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="AGENTCODE">
                    <Form.Label className="block text-gray-700 font-medium">Agent Code</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="text"
                      name="AGENTCODE"
                      {...register('AGENTCODE')}
                      placeholder="Enter Agent Code"
                    />
                    {errors.AGENTCODE && <span className="text-danger h-0">{errors.AGENTCODE.message}</span>}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="AGENTNAME">
                    <Form.Label className="block text-gray-700 font-medium">Agent Name</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="string"
                      name="AGENTNAME"
                      {...register('AGENTNAME')}
                      placeholder="Enter Agent Name"
                    />
                    {errors.AGENTNAME && <span className="text-danger h-0">{errors.AGENTNAME.message}</span>}
                  </Form.Group>
                </Col>
                <Col lg={8} md={8} sm={12} className="">
                  <Form.Group controlId="GSTIn">
                    <Form.Label className="block text-gray-700 font-medium">Gst Number</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="text"
                      name="GSTIn"
                      {...register('GSTIn')}
                      placeholder="Enter Gst number"
                    />
                    {errors.GSTIn && <span className="text-danger h-0">{errors.GSTIn.message}</span>}
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className=' py-2'>
              <h2 className="text-lg font-semibold ">Address Details:</h2>
              <Row >
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="ADDRESS">
                    <Form.Label className="block text-gray-700 font-medium">address</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      as="textarea" rows={4}
                      className='my-1'
                      type="text"
                      name="ADDRESS"
                      placeholder="Enter ADDRESS"
                      {...register('ADDRESS')}
                    />
                    {errors.ADDRESS && <span className="text-danger h-0">{errors.ADDRESS.message}</span>}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} sm={12} className="">
                  <Row>
                    <Col sm={12}>
                      <Form.Group controlId="CITY">
                        <Form.Label className="block text-gray-700 font-medium">City</Form.Label>
                        <Form.Control
                          disabled={!isEditing}
                          type="text"
                          name="CITY"
                          {...register('CITY')}
                          placeholder="Enter City name"
                        />
                        {errors.CITY && <span className="text-danger h-0">{errors.CITY.message}</span>}
                      </Form.Group>
                    </Col>
                    <Col sm={12}>
                      <Form.Group controlId="STATE">
                        <Form.Label className="block text-gray-700 font-medium">State</Form.Label>
                        <Form.Control
                          disabled={!isEditing}
                          type="text"
                          name="STATE"
                          {...register('STATE')}
                          placeholder="Enter State name"
                        />
                        {errors.STATE && <span className="text-danger h-0">{errors.STATE.message}</span>}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="PINCODE">
                    <Form.Label className="block text-gray-700 font-medium">Pin</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="number"
                      name="PINCODE"
                      {...register('PINCODE')}
                      placeholder="Enter Pincode"
                    />
                    {errors.PINCODE && <span className="text-danger h-0">{errors.PINCODE.message}</span>}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="COUNTRY">
                    <Form.Label className="block text-gray-700 font-medium">Country</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="text"
                      name="COUNTRY"
                      {...register('COUNTRY')}
                      placeholder="Enter Country name"
                    />
                    {errors.COUNTRY && <span className="text-danger h-0">{errors.COUNTRY.message}</span>}
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className=' py-2'>
              <h2 className="text-lg font-semibold ">Bank Details:</h2>
              <Row >
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="BankName">
                    <Form.Label className="block text-gray-700 font-medium">Bank Name</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      className='my-1'
                      type="text"
                      name="BankName"
                      {...register('BankName')}
                      placeholder="Enter Bank Name"
                    />
                    {errors.BankName && <span className="text-danger h-0">{errors.BankName.message}</span>}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="AccountNo">
                    <Form.Label className="block text-gray-700 font-medium">Account number</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="number"
                      name="AccountNo"
                      {...register('AccountNo')}
                      placeholder="Enter Account Number"
                    />
                     {errors.AccountNo && <span className="text-danger h-0">{errors.AccountNo.message}</span>}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="BBranch">
                    <Form.Label className="block text-gray-700 font-medium">Branch</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="text"
                      name="BBranch"
                      {...register('BBranch')}
                      placeholder="Enter Branch name"
                    />
                    {errors.BBranch && <span className="text-danger h-0">{errors.BBranch.message}</span>}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="IFSC">
                    <Form.Label className="block text-gray-700 font-medium">IFSC Code</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="text"
                      name="IFSC"
                      {...register('IFSC')}
                      placeholder="Enter IFSC code"
                    />
                    {errors.IFSC && <span className="text-danger h-0">{errors.IFSC.message}</span>}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="Opening">
                    <Form.Label className="block text-gray-700 font-medium">Opening Balance</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="number"
                      name="Opening"
                      {...register('Opening')}
                      placeholder="Enter Opening Balance"
                    />
                    {errors.Opening && <span className="text-danger h-0">{errors.Opening.message}</span>}
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} sm={12} className="">
                  <Form.Group controlId="CLimite">
                    <Form.Label className="block text-gray-700 font-medium">Credit Limit</Form.Label>
                    <Form.Control
                      disabled={!isEditing}
                      type="number"
                      name="CLimite"
                      {...register('CLimite')}
                      placeholder="Set Credit Limit"
                    />
                    {errors.CLimite && <span className="text-danger h-0">{errors.CLimite.message}</span>}
                  </Form.Group>
                </Col>
              </Row>
            </div>
          {isEditing &&
            <div className='flex justify-end my-2'>
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className=''>
                Update Customer Details
              </Button>
            </div>
          }
          </Form>
        </div>
      ) : (
        isLoading ?
          <div className='w-full h-60 flex justify-center items-center'>
            <Spinner animation="border" variant="secondary" />
          </div> :
          <p className='text-red-400 font-semibold w-max mx-auto my-20'>no data</p>
      )}
    </div>
  );
}

export default ViewCustomer;
