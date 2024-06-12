
import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useGlobalState } from '../context/GlobalStateContext';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

function AddSpecialMenu(props) {
  const { state, dispatch } = useGlobalState();
  const [splOrdInfo, setSplOrdInfo] = useState({
    cakeType: 'Catalog',
    category: '3dCake',
    weight: '1', 
    pcs: '',
    rate: '',
    amount: '',
    advance: '',
    message: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    remarks: '',
    image: '',
    previewImage: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (splOrdInfo.cakeType && state.sync === true) {
      handleUploadClick();
    }
  }, [state.sync, splOrdInfo.cakeType]);

  const uploadImage = async () => {
    const { image } = splOrdInfo;
  
    if (image) {
      console.log('imageimageimage', image);
      const storageRef = ref(storage, 'images');
      const fileName = `${Date.now()}_${'specialOrder'}`;
      const imageRef = ref(storageRef, fileName);
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);
      
      setSplOrdInfo(prevState => ({
        ...prevState,
        image: downloadURL,
        previewImage: downloadURL,
      }));
  
      return downloadURL;
    }
  };
  

  const handleInputChange = (field, value) => {
    setSplOrdInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  
    if (field === 'image') {
      
      const file = value.target.files[0];

      setSplOrdInfo((prevState) => ({
        ...prevState,
        [field]: file,
      }));
      if (file) {
        // Check if the file type is supported (you can customize this check)
        const supportedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (supportedTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSplOrdInfo((prevState) => ({
              ...prevState,
              previewImage: reader.result,
            }));
          };
          reader.readAsDataURL(file);
        } else {
          // Handle unsupported file type
          console.error('Unsupported file type');
          setSplOrdInfo((prevState) => ({
            ...prevState,
            previewImage: null,
          }));
        }
      } else {
        // User canceled file selection, reset previewImage
        setSplOrdInfo((prevState) => ({
          ...prevState,
          previewImage: null,
        }));
      }
    }
  };
  
  

  const handleUploadClick = async () => {
    try {
      const imageUrl = await uploadImage();
      dispatch({
        type: 'SET_SPLORD',
        payload: { ...splOrdInfo, imageUrl },
      });
      navigate('/purchase/special/order/confirm');
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  return (
    <div className="container p-4">
    <Row id='specialItem' className='bg-sky-300 rounded-xl'>
      <Col lg={8}>
        <Row>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="cakeType" className="text-gray-600 font-semibold my-1 me-4 ">
                Cake Type:
              </label>
              <select
                id="cakeType"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.cakeType}
                onChange={(e) => handleInputChange('cakeType', e.target.value)}
              >
                <option value="Catalog">Catalog</option>
                <option value="Customize">Customize</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="category" className="text-gray-600 font-semibold my-1 me-4 ">
                Category:
              </label>
              <select
                id="category"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="3dCake">3D Cake</option>
                <option value="AlphaNumeric">Alphabet & Numeric</option>
                <option value="Designer">Designer Cake</option>
                <option value="Inspiration">Inspirational Cake</option>
                <option value="Normal">Normal Cake</option>
                <option value="Photo">Photo Cake</option>
                <option value="Special">Special Order</option>
                <option value="Heading">Heading Spl Comb</option>
              </select>
            </div>
          </Col>
          {/* ... (rest of your JSX) */}
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="weight" className="text-gray-600 font-semibold my-1 me-4 ">
                Weight:
              </label>
              <input
                type="text"
                id="weight"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="weight" className="text-gray-600 font-semibold my-1 me-4 ">
                PCS :
              </label>
              <input
                type="text"
                id="pcs"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.pcs}
                onChange={(e) => handleInputChange('pcs', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="weight" className="text-gray-600 font-semibold my-1 me-4 ">
                Rate :
              </label>
              <input
                type="text"
                id="rate"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.rate}
                onChange={(e) => handleInputChange('rate', e.target.value)}
              />
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="amount" className="text-gray-600 font-semibold my-1 me-4 ">
                Amount :
              </label>
              <input
                type="text"
                id="amount"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="deliveryDate" className='text-gray-600 font-semibold my-1 me-4 '>Delivery Date :</label>
              <input
                type="date"
                id="deliveryDate"
                className='px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 drop-shadow'
                value={splOrdInfo.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="flavour" className='text-gray-600 font-semibold my-1 me-4 '>Flavour :</label>
              <input
                type="text"
                id="flavour"
                className='px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4  drop-shadow'
                value={splOrdInfo.flavour}
                onChange={(e) => handleInputChange('flavour', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="message" className='text-gray-600 font-semibold my-1 me-4 '>Message on cake :</label>
              <input
                type="text"
                id="message"
                className='px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4  drop-shadow'
                value={splOrdInfo.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="remarks" className='text-gray-600 font-semibold my-1 me-4 '>Remarks :</label>
              <input
                type="text"
                id="remarks"
                className='px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 mb-4 drop-shadow'
                value={splOrdInfo.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="advance" className='text-gray-600 font-semibold my-1 me-4 '>Advance :</label>
              <input
                type="text"
                id="advance"
                className='px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 mb-4 drop-shadow'
                value={splOrdInfo.advance}
                onChange={(e) => handleInputChange('advance', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="image" className='text-gray-600 font-semibold my-1 me-4 '>Add Image :</label>
              <input
                type="file"
                id="image"
                className='w-full h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 mb-4 drop-shadow'
                onChange={(e) => handleInputChange('image', e)}
              />
            </div>
          </Col>
        </Row>
      </Col>
      <Col lg={4} className='flex items-center content-center'>
        <div>
          {splOrdInfo.previewImage && (
            <img src={splOrdInfo.previewImage} alt="Preview" style={{ width: '100%', height: 'auto' }} />
          )}
        </div>
      </Col>
    </Row>
  </div>
  );
}

export default AddSpecialMenu;
