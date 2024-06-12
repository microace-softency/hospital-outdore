import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner, Form, Button, Dropdown } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firebase configuration
import { ViewFormat, collections } from '../../config';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from '../../context/AuthContext';
import { productSchema } from '../../config/validaionSchema';
import { adminCollection } from '../../services';
import { modifyProductInAllTenants } from '../../services/specialFunctions';
import { toast } from 'react-toastify';

function ViewProduct() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting, isDirty, isValid, errors }
  } = useForm({ resolver: yupResolver(productSchema) });
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("products/");
  const productId = parts[1];
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const products = adminCollection('ProductsAdmin')
  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const ref = doc(await products, productId);
        const productData = await getDoc(ref);
        if (productData.exists()) {
          setInitialData(productData.data());
          // Populate form fields from initialData
          ViewFormat.PRODUCT.forEach((field) => {
            if (field.type === 'dropdown') {
              // Set the selected option based on the boolean value
              setValue(field.name, String(productData.data()[field.name])); // Convert boolean to string
            } else {
              setValue(field.name, productData.data()[field.name]);
            }
          });
        } else {
          console.log('No product data found');
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchProductData();
  }, [productId]);

  const handleUpdateData = async () => {
    setIsLoading(true);
    const updatedData = getValues();
    updatedData.SERVICE = updatedData.SERVICE === 'true';
    updatedData.AVAILABLE = updatedData.AVAILABLE === 'true';
    const productRef = doc(await products, productId);
    setIsSaveButtonDisabled(true);
    try {
      console.log(updatedData);
      await modifyProductInAllTenants(productId, updatedData).then(()=> {
        setIsEditing(false);
        toast.success('Product Successfully Updated to all', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      })
    } catch (error) {
      console.log('Error updating product data: ', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold">
        {isEditing ? 'Edit Product Details' : 'Product Details'}
      </h2>
      <div className='flex justify-between items-center'>
        <Button
          onClick={() => navigate('/products')}
          className='my-2 px-4'>Back
        </Button>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className='my-2 px-4'>{isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      {getValues().PRODCODE ? (
        <div className="bg-white shadow-md rounded px-8 py-6">
          <Form onSubmit={handleSubmit(handleUpdateData)}>
            <Row>
              {ViewFormat.PRODUCT.map((field) => (
                <Col lg={6} md={6} sm={12} key={field.name}>
                  {field.type === 'dropdown' ? (
                    <Col className="">
                      <Form.Group controlId={field.name}>
                        <Form.Label className="block text-gray-700 font-medium">{field.label}</Form.Label>
                        <Form.Select
                        disabled={!isEditing}
                        aria-label="Default select example"
                        onChange={(e)=>setValue(field.name, e.target.value)}
                        defaultValue={String(initialData[field.name])}
                        >
                          <option value={'true'}>Yes</option>
                          <option value={'false'}>No</option>
                        </Form.Select>
                        {errors.SERVICE && <span className="text-danger h-0">{errors.SERVICE.message}</span>}
                      </Form.Group>
                    </Col>
                  ) : (
                    <Col className="">
                      <Form.Group controlId={field.name}>
                        <Form.Label className="block text-gray-700 font-medium">
                          {field.label}
                        </Form.Label>
                        <Form.Control
                          disabled={!isEditing}
                          type={field.type}
                          name={field.name}
                          {...register(field.name)}
                          placeholder={`Enter ${field.label}`}
                        />
                        {errors[field.name] && (
                          <span className="text-danger h-0">
                            {errors[field.name].message}
                          </span>
                        )}
                      </Form.Group>
                    </Col>
                  )}
                </Col>
              ))}
            </Row>
            {isEditing && (
            <div className='flex justify-end my-2'>
              <Button
                type='submit'
                disabled={isSubmitting || !isDirty}
                className=''>
                Update Product Details
              </Button>
            </div>
          )}
          </Form>
          
        </div>
      ) : (
        isLoading ? (
          <div className='w-full h-60 flex justify-center items-center'>
            <Spinner animation="border" variant="secondary" />
          </div>
        ) : (
          <p className='text-red-400 font-semibold w-max mx-auto my-20'>
            No product data found
          </p>
        )
      )}
    </div>
  );
}

export default ViewProduct;
