import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import { useGlobalState } from '../context/GlobalStateContext';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

function EditSpecialMenu(props) {
  const { state, dispatch } = useGlobalState();
  const [ newDate, setNewDate] = useState(false);
  const [splOrdInfo, setSplOrdInfo] = useState(state.bill);
  const [imageChange, setImageChange] = useState(false);

  const navigate = useNavigate();
  useEffect(()=> {
    setSplOrdInfo(state.bill)
    // console.log(state.bill);
  },[state.bill])

  useEffect(() => {
    if (state.sync === true) {
      handleUploadClick();
      dispatch({ type: 'SYNC', payload: false })
    }
  }, [state.sync]);


  const uploadImage = async () => {
    const { image } = splOrdInfo;
  
    if (image) {
      const storageRef = ref(storage, 'images');
      const fileName = `${Date.now()}_${'specialOrder'}`;
      const imageRef = ref(storageRef, fileName);
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);
  
      setSplOrdInfo(prevState => ({
        ...prevState,
        CIMAGEURL: downloadURL,
      }));
      return downloadURL;
    }
  };

  const handleInputChange = (field, value) => {
    setSplOrdInfo((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    if (field === 'DLVDATE') {
      setNewDate(value)
    }
   if (field === 'image') {
      setImageChange(true);
      const file = value.target.files[0];

      setSplOrdInfo((prevState) => ({
        ...prevState,
        [field]: file,
      }));
      
      // Set the image in state
      setSplOrdInfo(prevState => ({
        ...prevState,
        image: file,
        CIMAGEURL: URL.createObjectURL(file), // Use URL.createObjectURL to display a preview
      }));
    }
    // ... rest of your code
  };

  const handleUploadClick = async () => {
    try {
      let imageUrl = splOrdInfo.CIMAGEURL;
  
      if (imageChange) {
        imageUrl = await uploadImage();
      }
  
      dispatch({
        type: 'SET_SPLORD',
        payload: { ...splOrdInfo, CIMAGEURL: imageUrl, DLVDATE: new Date(newDate)},
      });
  
      // console.log('---------6', { ...splOrdInfo, CIMAGEURL: imageUrl });
      navigate(props.modelFor);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };
  const getRequestStatusColor = () => {
    switch (splOrdInfo?.STATUS) {
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      case 'ACCEPTED':
        return 'success';
      default:
        return 'light'; // default color
    }
  };
  return (
    <div className="container p-4">
      <Row>
        <Col>
          <div className='flex'>
              <p className='font-semibold'>Order Status : </p>
              <Badge bg={getRequestStatusColor()} className="mb-2 py-2 mx-4 ">
                {splOrdInfo?.STATUS}
              </Badge>
          </div>
        </Col>
      </Row>
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
                value={splOrdInfo.CAKETYPE}
                onChange={(e) => handleInputChange('CAKETYPE', e.target.value)}
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
                value={splOrdInfo.CATEGORY}
                onChange={(e) => handleInputChange('CATEGORY', e.target.value)}
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
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="weight" className="text-gray-600 font-semibold my-1 me-4 ">
                Select Weight:
              </label>
              <input
                type="text"
                id="weight"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.WEIGHT}
                onChange={(e) => handleInputChange('WEIGHT', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="weight" className="text-gray-600 font-semibold my-1 me-4 ">
                PCS :
              </label>
              <input
                type="number"
                id="peices"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.PCS}
                onChange={(e) => handleInputChange('PCS', e.target.value)}
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
                value={splOrdInfo.RATE}
                onChange={(e) => handleInputChange('RATE', e.target.value)}
              />
            </div>
          </Col>
          
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="weight" className="text-gray-600 font-semibold my-1 me-4 ">
                Amount :
              </label>
              <input
                type="text"
                id="amount"
                className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
                value={splOrdInfo.AMOUNT}
                onChange={(e) => handleInputChange('AMOUNT', e.target.value)}
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
                value={!newDate ? splOrdInfo.DLVDATE.toDate().toISOString().split('T')[0] : splOrdInfo.DLVDATE}
                onChange={(e) => handleInputChange('DLVDATE', e.target.value)}
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
                value={splOrdInfo.CFLAVOUR}
                onChange={(e) => handleInputChange('CFLAVOUR', e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="flex flex-col">
              <label htmlFor="messageOnCake" className='text-gray-600 font-semibold my-1 me-4 '>Message on cake :</label>
              <input
                type="text"
                id="messageOnCake"
                className='px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4  drop-shadow'
                value={splOrdInfo.CMESSAGE}
                onChange={(e) => handleInputChange('CMESSAGE', e.target.value)}
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
                value={splOrdInfo.CREMARKS
                }
                onChange={(e) => handleInputChange('remarks', e.target.value)}
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
          {splOrdInfo.CIMAGEURL && (
            <img src={splOrdInfo.CIMAGEURL} alt="Preview" style={{ width: '100%', height: 'auto' }} />
          )}
        </div>
      </Col>
    </Row>
  </div>
  );
}

export default EditSpecialMenu;
