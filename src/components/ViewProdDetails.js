import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useGlobalState } from '../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ImBin } from "react-icons/im";

import { FaCartShopping } from "react-icons/fa6";

function ViewProdDetails(modelFor) {

  const { state, dispatch } = useGlobalState();
  const navigate = useNavigate()
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isEditing, setIsEditing] = useState(null)
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState([...state.products]);
  const [showCart, setShowCart] = useState(true)
  const [productGroups, setProductsGroups] = useState(null)

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  // const [productsGroup, setProductsGroup] = useState([])
  const [isMobileView, setIsMobileView] = useState(false);
  const [groupTab, setGroupTab] = useState(null);

  useEffect(() => {
    handleEditChange(state.modify)
  }, [state.modify])
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {

    if (productsData) {
      setLoading(false)
      convertProductDataToGroups(productsData)
    }
  }, [addedItems])

  const initiateState = () => {
    const addItems = state.addedProducts.map((product) => {
      const addedProduct = productsData.find(
        (addedItem) => addedItem.PRODCODE === product.PRODCODE
      );

      if (addedProduct) {
        return {
          ...addedProduct,
          QUANTITY: product.QUANTITY,
        };
      } else {
        return product;
      }
    });
    setAddedItems(addItems);
  }

  useEffect(() => {
    initiateState()
  }, [productsData, state.addedProducts]);


  useEffect(() => {
    // Filter products based on the search term
    if (!showCart) {
      const filtered = productsData.filter(
        (product) =>
          product.DESCRIPT.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      if (searchTerm) {
        const filtered = filteredProducts.filter(
          (product) =>
            product.DESCRIPT.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        handleShowCart()
      }
    }
  }, [searchTerm, productsData]);

  const handleShowCart = () => {
    const filtered = productsData.filter((product) =>
      addedItems.some((addedItem) => addedItem.DESCRIPT.toLowerCase() === product.DESCRIPT.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    if (showCart) {
      handleShowCart()
    } else {
      const filtered = productsData.filter(
        (product) =>
          product.DESCRIPT.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [showCart, addedItems])

  const handleTabChange = (index) => {
    setGroupTab(index);
  };

  function convertProductDataToGroups(productData) {
    // Create an empty object to store product groups
    const groupsMap = {};

    // Iterate over the product data and organize it into groups
    productData.forEach((product) => {
      const { SGroupDesc, ...productDetails } = product;

      if (!groupsMap[SGroupDesc]) {
        // If the group doesn't exist in the map, create it
        groupsMap[SGroupDesc] = {
          SGroupDesc: SGroupDesc,
          items: [],
        };
      }

      // Add the product details to the group's items
      groupsMap[SGroupDesc].items.push({
        SGroupDesc: SGroupDesc,
        ...productDetails,
      });
    });

    // Convert the groups map into an array
    const productGroups = Object.values(groupsMap);



    // Assign unique IDs to groups and items
    let groupId = 1;
    let itemId = 1;

    productGroups.forEach((group) => {
      group.id = groupId++;
      group.items.forEach((item) => {
        item.id = itemId++;
      });
    });
    setProductsGroups(productGroups);
  }

  const handleEditChange = (state) => {
    if (state) {
      
      setIsEditing(state)
    } else {
      setIsEditing(state)
      handleTabChange(null)
      initiateState()
      setShowCart(true)
    }
  }

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };
  const handleAddByInput = (item, e) => {
    const QUANTITY = parseInt(e.target.value, 10);
    const existingItem = addedItems.find((addedItem) => addedItem.PRODCODE === item.PRODCODE);
    if (existingItem) {
      if (QUANTITY > 0) {
        const updatedItems = addedItems.map((addedItem) =>
          addedItem.DESCRIPT === item.DESCRIPT ? { ...addedItem, QUANTITY: QUANTITY } : addedItem
        )
        setAddedItems(updatedItems);
      } else {
        const updatedItems = addedItems.filter((addedItem) => addedItem.DESCRIPT !== item.DESCRIPT);
        setAddedItems(updatedItems);
      }
    } else {
      if (QUANTITY > 0) {
        setAddedItems([...addedItems, { ...item, QUANTITY: QUANTITY }]);
      }
    }
  };
  const allProductsGroup = {
    SGroupDesc: 'All Products',
    items: productsData, // Assuming productsData contains all products
  };
  const handleAddItem = (item) => {
    const existingItem = addedItems.find((addedItem) => addedItem.PRODCODE === item.PRODCODE);
    if (existingItem) {
      const updatedItems = addedItems.map((addedItem) =>
        addedItem.PRODCODE === item.PRODCODE ? { ...addedItem, QUANTITY: addedItem.QUANTITY >= 0 ? addedItem.QUANTITY + 1 : 0 } : addedItem
      );
      setAddedItems(updatedItems);
    } else {
      setAddedItems([...addedItems, { ...item, QUANTITY: 1, }]);
    }
  };

  const handleRemoveItem = (item) => {
    const existingItem = addedItems.find((addedItem) => addedItem.PRODCODE === item.PRODCODE);
    if (existingItem && existingItem.QUANTITY > 1) {
      // If the item exists and its QUANTITY is greater than 1, decrement its QUANTITY
      const updatedItems = addedItems.map((addedItem) =>
        addedItem.PRODCODE === item.PRODCODE ? { ...addedItem, QUANTITY: addedItem.QUANTITY - 1 } : addedItem
      );
      setAddedItems(updatedItems);
    } else if (existingItem && existingItem.QUANTITY === 1) {
      // If the item exists and its QUANTITY is 1, remove it
      const updatedItems = addedItems.filter((addedItem) => addedItem.PRODCODE !== item.PRODCODE);
      setAddedItems(updatedItems);
    }
  };
  const handleRemoveAll = (item) => {
    const updatedItems = addedItems.filter((addedItem) => addedItem.PRODCODE !== item.PRODCODE);
    setAddedItems(updatedItems);
  };
  const totalBill = addedItems.reduce((total, item) => total + item.MRP_RATE * item.QUANTITY, 0);
  const totalQty = addedItems.reduce((total, item) => total + item.QUANTITY, 0);
  const handleSaveProducts = () => {
    if (state.customerDetails.NAME && addedItems[0]) {
      dispatch({ type: 'SYNC', payload: true })
      dispatch({ type: 'SAVE_PRODUCTS', payload: addedItems });
      navigate(modelFor.modelFor)
    } else {
      toast.warning(`please ${!state.customerDetails.NAME && !addedItems[0] ? 'add customer & profile Details' : !addedItems[0] ? 'product details' : 'add customer details'}`, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  useEffect(()=> {
    if (state.sync) {
      dispatch({ type: 'SYNC', payload: false })
      dispatch({type: 'SAVE_PRODUCTS', payload: addedItems})
      navigate(modelFor.modelFor);
    }
  }, [state.sync])
  return (
    <div className='w-max max-w-full mx-auto'>
      <div className='flex justify-between m-2'>
        <p className='text-xl font-bold m-2 text-slate-600'>Product Details</p>
      </div>
      {/* for bigger devices  */}
      {isMobileView ?
        (
          <div>
            <div className=' rounded-xl p-2 shadow-lg '>
              <div className='border-b-[1px] border-slate-400 flex w-full overflow-x-scroll'>
                <div
                  className={`cursor-pointer min-w-max px-2 py-1 max-w-60 text-center font-bold text-slate-500 text-lg
                    ${groupTab === null ? 'border-b-4 border-teal-800 text-slate-800' : ''}`}
                  onClick={() => handleTabChange(null)}
                >
                  ALL Products
                </div>
                {isEditing && productGroups.map((group, index) => (
                  <div
                    key={group.id}
                    className={`cursor-pointer min-w-max px-2 py-1 max-w-60 text-center font-bold text-slate-500 text-lg ${groupTab === index ? 'border-b-4 border-teal-800 text-slate-800' : ''
                      }`}
                    onClick={() => handleTabChange(index)}
                  >
                    {group.SGroupDesc}
                  </div>
                ))}
              </div>
              <div className='max-h-[70vh] min-h-[50vh] overflow-y-scroll'>
                {groupTab !== null ? productGroups[groupTab]?.items?.map((item) => (
                  <div className=' bg-sky-300 hover:bg-slate-300 cursor-pointer border-b-[1px] border-slate-400 w-full '>
                    <div key={item.id} className='flex items-center justify-between p-1'>
                      <div className='w-3/5 -my-6'>
                        <p className='m-0 font-semibold text-md'>
                          {item.DESCRIPT}
                        </p>
                      </div>
                      <div className='w-2/5'>
                        {isEditing &&
                          <div className='flex items-center'>
                            <Button variant="outline-primary" onClick={() => handleRemoveItem(item)}>
                              -
                            </Button>
                            <div className='min-w-20'>
                              <Form.Control
                                type="number"
                                min="0"
                                step="1"
                                className='px-1 text-center'
                                value={addedItems.find(obj => obj.DESCRIPT === item.DESCRIPT)?.QUANTITY || ''}
                                onChange={(e) => { handleAddByInput(item, e) }}
                              />
                            </div>
                            <Button variant="outline-primary" onClick={() => handleAddItem(item)}>
                              +
                            </Button>
                          </div>}

                      </div>

                    </div>
                    <div className='w-max ms-auto'>
                      <span className='text-sm font-semibold ml-2 text-slate-500 ml-12'>{item.RATE * (addedItems.find(obj => obj.DESCRIPT === item.DESCRIPT)?.QUANTITY || 0)}.00</span>
                      <span className='text-sm font-semibold ml-2 text-slate-500'>({item.RATE}.00)</span>
                    </div>
                  </div>
                )) :
                  <div className='w-full '>
                    <div className='p-2 top-20 border-b-[1px] border-slate-400 flex'>
                      <Form.Control
                        type='text'
                        placeholder='Search products...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div
                        onClick={() => {isEditing && setShowCart(!showCart) }}
                        className={`p-2 rounded border-teal-700 border-2 text-lg ms-2 ${showCart ? 'bg-teal-700  drop-shadow' : ''}`}>
                        <FaCartShopping className={`w-8 ${showCart ? 'text-white' : 'text-teal-800'}`} />
                      </div>
                    </div>
                    {filteredProducts.map((item) => (
                      <div className=' bg-sky-300 hover:bg-slate-300 cursor-pointer border-b-[1px] border-slate-400 w-full '>
                        <div key={item.id} className='flex items-center justify-between p-1'>
                          <div className='w-3/5 -my-6'>
                            <p className='m-0 font-semibold text-md'>
                              {item.DESCRIPT}
                            </p>
                          </div>
                          <div className='w-2/5'>
                            {!isEditing ?
                              <div className='flex items-center'>
                                <div className='min-w-20'>
                                  <Form.Control
                                    type="number"
                                    min="0"
                                    step="1"
                                    disabled
                                    className='px-1 text-center'
                                    value={addedItems.find(obj => obj.DESCRIPT === item.DESCRIPT)?.QUANTITY || ''}
                                  />
                                </div>
                              </div> :
                              <div className='flex items-center'>
                                <Button variant="outline-primary" onClick={() => handleRemoveItem(item)}>
                                  -
                                </Button>
                                <div className='min-w-20'>
                                  <Form.Control
                                    type="number"
                                    min="0"
                                    step="1"
                                    className='px-1 text-center'
                                    value={addedItems.find(obj => obj.DESCRIPT === item.DESCRIPT)?.QUANTITY || ''}
                                    onChange={(e) => { handleAddByInput(item, e) }}
                                  />
                                </div>
                                <Button variant="outline-primary" onClick={() => handleAddItem(item)}>
                                  +
                                </Button>
                              </div>}

                          </div>

                        </div>
                        <div className='w-max ms-auto'>
                          <span className='text-sm font-semibold ml-2 text-slate-500 ml-12'>{item.RATE * (addedItems.find(obj => obj.DESCRIPT === item.DESCRIPT)?.QUANTITY || 0)}.00</span>
                          <span className='text-sm font-semibold ml-2 text-slate-500'>({item.RATE}.00)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
              <div>
                <div className='h-10 flex items-center  justify-between px-2 border-t-[1px] border-slate-400'>
                  <p className='text-lg font-bold m-0'>Total Amount:</p>
                  <p className='text-lg font-bold m-0'>₹{totalBill.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className='flex p-2 justify-end'>
              <Button variant="primary" className='px-4 flex'
                onClick={handleSaveProducts}
              >
                <span>Procced</span>
              </Button>
            </div>
          </div>
        ) :
        <div className='max-w-max bg-sky-300 overflow-x-scroll'>
          <div className='flex h-[550px] min-w-max rounded-xl overflow-hidden drop-shadow py-2'>
            {isEditing &&
              <div className='flex'>
                <div className='min-w-[210px] max-w-max overflow-y-scroll'>
                  <p className='font-bold p-2 m-0 border-b-[1px] border-slate-400'>Product Groups</p>
                  {!loading &&
                    <div
                      className={`cursor-pointer hover:bg-slate-300 border-b-[1px] border-slate-400  p-2 w-full ${!selectedGroup ? 'bg-slate-300' : ''}`}
                      onClick={() => handleGroupClick(null)}
                    >
                      ALL PRODUCTS
                    </div>}
                  {!loading ? productGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`cursor-pointer hover:bg-slate-300 border-b-[1px] border-slate-400  p-2 w-full bg-sky-300 ${selectedGroup?.id === group.id ? 'bg-slate-300' : ''
                        }`}
                      onClick={() => handleGroupClick(group)}
                    >
                      {group.SGroupDesc}
                    </div>
                  )) :
                    <div className='w-full h-60 flex justify-center items-center'>
                      <Spinner animation="border" variant="secondary" />
                    </div>
                  }
                </div>
                <main className='w-[370px] bg-sky-300 border-x-[1px] border-slate-300 overflow-y-scroll'>
                  {selectedGroup ? (
                    <div>
                      <p className='font-bold p-2 m-0 border-b-[1px] border-slate-400'>Items in {selectedGroup.DESCRIPT}</p>
                      {selectedGroup.items.map((item) => (
                        <div
                          key={item.id}
                          className='cursor-pointer p-2 flex items-center justify-between  border-b-[1px] border-slate-400 w-full bg-sky-300 hover:bg-slate-300'>
                          <p className='font-semibold pe-1 my-0'>{item.DESCRIPT}</p>
                          <div className='flex items-center'>
                            <Button variant="outline-primary" onClick={() => handleRemoveItem(item)}>
                              -
                            </Button>
                            <div className='w-20 px-2'>
                              <Form.Control
                                className='px-1'
                                type="number"
                                min="0"
                                step="1"
                                value={addedItems.find(obj => obj.DESCRIPT === item.DESCRIPT)?.QUANTITY || ''}
                                onChange={(e) => { handleAddByInput(item, e) }}
                              />
                            </div>
                            <Button variant="outline-primary" onClick={() => handleAddItem(item)}>
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className='p-2 top-20 border-b-[1px] border-slate-400 flex'>
                        <Form.Control
                          type='text'
                          placeholder='Search products...'
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div
                          onClick={() => { setShowCart(!showCart) }}
                          className={`p-2 rounded border-teal-700 border-2 text-lg ms-2 ${showCart ? 'bg-teal-700 drop-shadow' : ''}`}>
                          <FaCartShopping className={`w-8 ${showCart ? 'text-white' : 'text-teal-800'}`} />
                        </div>
                      </div>
                      {filteredProducts.map((item) => (
                        <div
                          key={item.id}
                          className='cursor-pointer p-2 flex items-center justify-between  border-b-[1px] border-slate-400 w-full bg-sky-300 hover:bg-slate-300'>
                          <p className='font-semibold pe-1 my-0'>{item.DESCRIPT}</p>
                          <div className='flex items-center'>
                            <Button variant="outline-primary" onClick={() => handleRemoveItem(item)}>
                              -
                            </Button>
                            <div className='w-20 px-2'>
                              <Form.Control
                                className='px-1'
                                type="number"
                                min="0"
                                step="1"
                                value={addedItems.find(obj => obj.PRODCODE === item.PRODCODE)?.QUANTITY || ''}
                                onChange={(e) => { handleAddByInput(item, e) }}
                              />
                            </div>
                            <Button variant="outline-primary" onClick={() => handleAddItem(item)}>
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </main>
              </div>}
            <div className='px-2 max-w-[500px]' >
              <div className='h-full'>
                <p className='font-bold m-2'>Added Items</p>
                <div className='h-[78%] overflow-y-scroll w-full'>
                  <table className='w-full bg-white border-collapse'>
                    <thead className='bg-sky-300'>
                      <tr>
                        <th className='py-2 px-4 text-left'>Name</th>
                        <th className='py-2 px-4 text-left'>Qty</th>
                        <th className='py-2 px-4 text-right'>Rate</th>
                        <th className='py-2 px-4 text-right'>Amt</th>
                        {isEditing && <th className='py-2 px-4 text-left'></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {addedItems.map((item, i) => (
                        <tr key={i}
                          className={` ${i % 2 === 0 ? 'bg-sky-300' : 'bg-slate-100'}`}>
                          <td className='py-2 px-4'>{item.DESCRIPT}</td>
                          <td className='py-2 px-4'>{item.QUANTITY ? item.QUANTITY : 0}</td>
                          <td className='py-2 px-4 text-right'>{item.MRP_RATE}</td>
                          <td className='py-2 px-4 text-right'>{item.MRP_RATE * (item.QUANTITY ? item.QUANTITY : 0)}</td>
                          {isEditing && <td className='py-2 px-4'>
                            <ImBin
                              className='text-red-700 text-xl cursor-pointer hover:text-red-600'
                              onClick={() => handleRemoveAll(item)}
                            />
                          </td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className='border-t border-gray-300 flex align-items-center justify-content-between px-4 h-12 pt-4 bg-slate-100'>
                  <p className='font-bold p-2'>Total Qty : {totalQty}</p>
                  <p className='font-bold p-2'>Total Amount : {totalBill.toFixed(2)}</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default ViewProdDetails;
