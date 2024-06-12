import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Input, MenuItem, Select } from "@mui/joy";
import { MdDeleteForever } from "react-icons/md";

const initialState = {
  testName: "",
  subGroups: [{ name: "", amount: "" }],
};

function CreteGroupTest({ onCreate, onCancel, customers, model }) {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const { testName, subGroups } = state;
  const [totalAmount, setTotalAmount] = useState(0);
  const { id } = useParams();
  const [testData, setTestData] = useState([]);
  const [error, setError] = useState(null);

  const loadTestData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/test");
      setTestData(response.data[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadTestData();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSubGroups = [...subGroups];
    updatedSubGroups[index][name] = value;
    setState({ ...state, subGroups: updatedSubGroups });
  };

  const handleSelectChange = (e, index) => {
    const selectedTestName = e?.target?.value;
    console.log("selectedTestName", e);
    const selectedSubGroup = testData.find(
      (option) => option.testname === selectedTestName
    );

    if (selectedSubGroup) {
      const updatedSubGroups = [...subGroups];
      updatedSubGroups[index] = {
        name: selectedSubGroup.testname,
        amount: selectedSubGroup.amount,
      };
      setState({ ...state, subGroups: updatedSubGroups });
    }
  };

  const handleAddSubGroup = () => {
    setState({
      ...state,
      subGroups: [...subGroups, { name: "", amount: "" }],
    });
  };

  useEffect(() => {
    // Calculate total amount whenever subGroups change
    const total = subGroups.reduce(
      (acc, group) => acc + parseFloat(group.amount || 0),
      0
    );
    setTotalAmount(total);
  }, [subGroups]);

  const handleRemoveSubGroup = (index) => {
    const updatedSubGroups = [...subGroups];
    updatedSubGroups.splice(index, 1);
    setState({ ...state, subGroups: updatedSubGroups });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testName || !subGroups.every((group) => group.name && group.amount)) {
      toast.error("Please provide a value for each input field");
    } else {
      const testData = {
        testName,
        totalAmount,
        subGroups,
      };

      axios
        .post("http://localhost:8005/api/test/creategrouptest", testData)
        .then(() => {
          toast.success("Test created successfully");
          setState(initialState);
          setTotalAmount(0);
          onCancel();
        })
        .catch((err) => toast.error(err.response.data));
    }
  };

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl">
      <h2 className="text-xl font-semibold ">Create {model}</h2>
      <Form onSubmit={handleSubmit}>
        <div className="py-2">
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Form.Group controlId="testName">
                <Form.Label className="block text-gray-700 font-medium">
                  Test Name
                </Form.Label>
                <Input
                  required
                  className=""
                  placeholder="Test Name"
                  type="text"
                  name="testName"
                  value={testName || ""}
                  onChange={(e) =>
                    setState({ ...state, testName: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col lg={12} md={12} sm={12}>
              <Form.Label className="text-gray-700 font-medium">
                Sub Group Name
              </Form.Label>
              {subGroups.map((subGroup, index) => (
                <Row key={index}>
                  <Col lg={4} md={6} sm={12}>
                    <Form.Group>
                      {/* <Form.Label className="text-gray-700 font-medium">
                        Sub Group Name
                      </Form.Label> */}
                      <Form.Select
                        required
                        name="name"
                        value={subGroup.name || ""}
                        onChange={(e) => handleSelectChange(e, index)}
                        // displayEmpty
                      >
                        <option value="" disabled>
                          Select Sub Group
                        </option>
                        {testData.map((option) => (
                          <option key={option.id} value={option.testname}>
                            {option.testname}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={6} sm={12}>
                    <Form.Group>
                      {/* <Form.Label className="text-gray-700 font-medium">
                        Amount
                      </Form.Label> */}
                      <Input
                        required
                        type="text"
                        placeholder="Amount"
                        name="amount"
                        value={subGroup.amount || ""}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={6} sm={12}>
                    <Form.Group>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveSubGroup(index)}
                      >
                        <MdDeleteForever />
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
              ))}
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleAddSubGroup}
              >
                +
              </Button>
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
          <Button type="submit" className="px-4 py-2">
            Create
          </Button>
        </div>
        <div>Total Amount: {totalAmount}</div> {/* Display the total amount */}
      </Form>
    </div>
  );
}

export default CreteGroupTest;
