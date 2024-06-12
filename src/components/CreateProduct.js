import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Input } from "@mui/joy";

const initialState = {
  productcode: "",
  Description: "",
  purchesunit: "",
  Stock: "",
  sale: "",
  hsnsaccode: "",
  productgroup: "",
  productsubgroup: "",
  taxcategory: "",
  buyrate: "",
  salerate: "",
  opening: "",
  expdate: "",
  purchesdate: "",
  batchnumber: "",
};

function CreateProduct({ onCreate, onCancel, model }) {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [productCode, setProductCode] = useState('');

  console.log("productCode", productCode);

  const {
    productcode,
    Description,
    purchesunit,
    Stock,
    sale,
    hsnsaccode,
    productgroup,
    productsubgroup,
    taxcategory,
    buyrate,
    salerate,
    opening,
    expdate,
    purchesdate,
    batchnumber,
  } = state;

useEffect(() => {
  const fetchNextProductCode = async () => {
    try {
      const response = await axios.get('http://localhost:8005/api/product/nextproductcode');
      setProductCode(response.data.productCode);
    } catch (error) {
      console.error('Error fetching next product code:', error);
      toast.error('Error fetching next product code');
    }
  };

  fetchNextProductCode();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Description) {
      toast.error("Please provide a value for each input field");
    } else {
      const data = {
        Description,
        purchesunit,
        Stock,
        sale,
        hsnsaccode,
        productgroup,
        productsubgroup,
        taxcategory,
        buyrate,
        salerate,
        opening,
        expdate,
        purchesdate,
        batchnumber,
      };
      try {
        const response = await axios.post("http://localhost:8005/api/product/createproduct", data);
        setState(initialState);
        toast.success("Medicine created successfully with Product Code: " + productCode );
      } catch (err) {
        toast.error(err.response.data);
      }
      setTimeout(() => {
        onCancel();
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl">
      <h2 className="text-xl font-semibold ">Create {model}</h2>
      <Form onSubmit={handleSubmit}>
        <div className="py-2">
          <Row>
            <Col lg={4} md={6} sm={12}>
              <Form.Group controlId="PRODUCT_CODE">
                <Form.Label className="block text-gray-700 font-medium">
                  Product Code
                </Form.Label>
                <Input  
                  className=""
                  type="text"
                  name="productcode"
                  disabled
                  value={productCode}
                   readOnly 
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Description
                </Form.Label>
                <Input
                  required
                  type="text"
                  placeholder="Description"
                  name="Description"
                  value={Description || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Purches Unit
                </Form.Label>
                <Input
                  required
                  type="text"
                  placeholder="Purchesunit"
                  name="purchesunit"
                  value={purchesunit || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Stock
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Stock"
                  name="Stock"
                  value={Stock || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Sale
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Sale"
                  name="sale"
                  value={sale || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  HSN/SAC code
                </Form.Label>
                <Input
                  required
                  type="text"
                  placeholder="Hsn/Sac Code"
                  name="hsnsaccode"
                  value={hsnsaccode || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={4} sm={6} xs={6}>
              <Form.Group>
                <Form.Label className="block text-gray-700 font-medium">
                  VAT / GST Rate
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Select Block"
                  name="taxcategory"
                  value={taxcategory || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Group
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Product Group"
                  name="productgroup"
                  value={productgroup || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Sub-Group
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Product sub-group"
                  name="productsubgroup"
                  value={productsubgroup || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Buy Rate
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Buy Rate"
                  name="buyrate"
                  value={buyrate || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Sale Rate
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Sale Rate"
                  name="salerate"
                  value={salerate || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Opening
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Opening"
                  name="opening"
                  value={opening || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Expiry Date
                </Form.Label>
                <Input
                  required
                  type="date"
                  placeholder="Expiry Date"
                  name="expdate"
                  value={expdate || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className="text-gray-700 font-medium">
                  Batch Number
                </Form.Label>
                <Input
                  required
                  type="text"
                  placeholder="Batch Number"
                  name="batchnumber"
                  value={batchnumber || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2"
            onClick={() => console.log("click")}
          >
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateProduct;
