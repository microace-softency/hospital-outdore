import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useGlobalState } from '../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddProductReturn(modelFor) {
  // const productGroups = [
  //   {
  //     id: 1,
  //     name: 'Electronics',
  //     items: [
  //       {
  //         id: 1,
  //         name: 'Laptop',
  //         uom: 'PCS',
  //         rate: 43650,
  //       },
  //       {
  //         id: 2,
  //         name: 'Fridge',
  //         uom: 'PCS',
  //         rate: 35540,
  //       },
  //       {
  //         id: 3,
  //         name: 'Smart Phone',
  //         uom: 'PCS',
  //         rate: 25400,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: 'Clothing',
  //     items: [
  //       {
  //         id: 1,
  //         name: 'T-Shirt',
  //         uom: 'PCS',
  //         rate: 20,
  //       },
  //       {
  //         id: 2,
  //         name: 'Jeans',
  //         uom: 'PCS',
  //         rate: 50,
  //       },
  //       {
  //         id: 3,
  //         name: 'Dress',
  //         uom: 'PCS',
  //         rate: 70,
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: 'Groceries',
  //     items: [
  //       {
  //         id: 1,
  //         name: 'Rice',
  //         uom: 'Kg',
  //         rate: 50,
  //       },
  //       {
  //         id: 2,
  //         name: 'Milk',
  //         uom: 'Litre',
  //         rate: 25,
  //       },
  //       {
  //         id: 3,
  //         name: 'Bread',
  //         uom: 'Loaf',
  //         rate: 10,
  //       },
  //     ],
  //   },
  // ];

  const { state, dispatch } = useGlobalState();
  const navigate = useNavigate()
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const productsData = state.products || [];
  const [productsGroup, setProductsGroup] = useState([])
  const [isMobileView, setIsMobileView] = useState(false);
  const [groupTab, setGroupTab] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (productsData) {
      setLoading(false)
    }
    dispatch({ type: 'REMOVE_CUSTOMER' });
    dispatch({ type: 'REMOVE_PRODUCTS' });
  }, [])

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
      groupsMap[SGroupDesc].items.push(productDetails);
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
    return productGroups;
  }

  const productGroups = convertProductDataToGroups(productsData)

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };
  const handleAddByInput = (item, e) => {
    const QUANTITY = parseInt(e.target.value, 10);
    const existingItem = addedItems.find((addedItem) => addedItem.DESCRIPT === item.DESCRIPT);
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
  const handleAddItem = (item) => {
    const existingItem = addedItems.find((addedItem) => addedItem.DESCRIPT === item.DESCRIPT);
    if (existingItem) {
      const updatedItems = addedItems.map((addedItem) =>
        addedItem.DESCRIPT === item.DESCRIPT ? { ...addedItem, QUANTITY: addedItem.QUANTITY >= 0 ? addedItem.QUANTITY + 1 : 0 } : addedItem
      );
      setAddedItems(updatedItems);
    } else {
      setAddedItems([...addedItems, { ...item, QUANTITY: 1 }]);
    }
  };
  const handleRemoveItem = (item) => {
    const existingItem = addedItems.find((addedItem) => addedItem.DESCRIPT === item.DESCRIPT);
    if (existingItem && existingItem.QUANTITY > 1) {
      // If the item exists and its QUANTITY is greater than 1, decrement its QUANTITY
      const updatedItems = addedItems.map((addedItem) =>
        addedItem.DESCRIPT === item.DESCRIPT ? { ...addedItem, QUANTITY: addedItem.QUANTITY - 1 } : addedItem
      );
      setAddedItems(updatedItems);
    } else if (existingItem && existingItem.QUANTITY === 1) {
      // If the item exists and its QUANTITY is 1, remove it
      const updatedItems = addedItems.filter((addedItem) => addedItem.DESCRIPT !== item.DESCRIPT);
      setAddedItems(updatedItems);
    }
  };
  const handleRemoveAll = (item) => {
      const updatedItems = addedItems.filter((addedItem) => addedItem.DESCRIPT !== item.DESCRIPT);
      setAddedItems(updatedItems);
  };
  const totalBill = addedItems.reduce((total, item) => total + item.MRP_RATE * item.QUANTITY, 0);
  const totalQty = addedItems.reduce((total, item) => total + item.QUANTITY, 0);
  const handleSaveProducts = () => {
    if (state.customerDetails.NAME && addedItems[0]) {
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


  return (
    <div>
      <p className='font-bold m-2'>Product Details</p>
      {/* for bigger devices  */}
      {isMobileView ?
        (
          <div>
            <div className='bg-sky-300 rounded-xl p-2 shadow-lg '>
              <div className='border-b-[1px] border-slate-400 flex w-full pb-3 overflow-x-scroll'>
                {productGroups.map((group, index) => (
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
              <div className='mb-12 max-h-[70vh] min-h-[50vh] overflow-y-scroll'>
                {productGroups[groupTab]?.items?.map((item) => (
                  <div key={item.id} className='cursor-pointer px-2 py-1  border-b-[1px] border-slate-400 w-full flex items-center justify-between bg-sky-300 hover:bg-slate-300'>
                    <p className='m-0 font-semibold text-lg'>
                      {item.DESCRIPT}
                      <span className='text-sm font-bold ml-2 text-slate-500'>(₹{item.MRP_RATE}.00)</span>
                      <span className='text-sm font-bold ml-2 text-slate-500 ml-12'>₹{item.MRP_RATE * (addedItems.find(obj => obj.DESCRIPT === item.DESCRIPT)?.QUANTITY || 0)}.00</span>
                    </p>
                    <div className='flex items-center'>
                      <Button variant="outline-primary" onClick={() => handleRemoveItem(item)}>
                        -
                      </Button>
                      <div className='w-20 px-2'>
                        <Form.Control
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
        <div className='max-w-full overflow-x-scroll'>
          <div className='flex h-[550px] min-w-max rounded-xl overflow-hidden bg-sky-300 drop-shadow py-2'>
            <div className='min-w-[210px] max-w-max overflow-y-scroll'>
              <p className='font-bold p-2 m-0 border-b-[1px] border-slate-400'>Product Groups</p>
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
                      className='cursor-pointer px-2 flex items-center justify-between  border-b-[1px] border-slate-400 w-full bg-sky-300 hover:bg-slate-300'>
                      <p className='font-semibold pe-1'>{item.DESCRIPT}</p>
                      <div className='flex items-center'>
                        <Button variant="outline-primary"   onClick={() => handleRemoveItem(item)}>
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
                        <Button variant="outline-primary"  onClick={() => handleAddItem(item)}>
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 p-2'>Select a product group to see items.</p>
              )}
            </main>
            <div className='bg-sky-300 px-2 min-w-[450px]' >
              <div className='h-full'>
                <p className='font-bold m-2'>Added Items</p>
                <div className='h-[78%] overflow-y-scroll w-full'>
                  <table className='w-full bg-white border-collapse'>
                    <thead className='bg-gray-200'>
                      <tr>
                        <th className='py-2 px-4 text-left'>Name</th>
                        <th className='py-2 px-4 text-left'>Quantity</th>
                        <th className='py-2 px-4 text-right'>Price</th>
                        <th className='py-2 px-4 text-right'>Amount</th>
                        <th className='py-2 px-4 text-left'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addedItems.map((item, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                          <td className='py-2 px-4'>{item.DESCRIPT}</td>
                          <td className='py-2 px-4'>{item.QUANTITY ? item.QUANTITY : 0}</td>
                          <td className='py-2 px-4 text-right'>{item.MRP_RATE}</td>
                          <td className='py-2 px-4 text-right'>{item.MRP_RATE * (item.QUANTITY ? item.QUANTITY : 0)}</td>
                          <td className='py-2 px-4'>
                            <Button variant="danger" size="sm" onClick={() => handleRemoveAll(item)}>
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className='border-t border-gray-300 flex align-items-center justify-content-between px-4 h-12 pt-4 bg-slate-100'>
                  <p className='font-bold p-2'>Total Qty : {totalQty}</p>
                  <p className='font-bold p-2'>Total Amount : {totalBill.toFixed(2)}</p>
                  
                </div>
                <div className='flex justify-end px-4'>
                  <Button variant="primary" className=''
                    onClick={handleSaveProducts}
                  >
                    Procced
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default AddProductReturn;
