import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function ReportPage() {
  const [field, setField] = useState("products");
  const [operator, setOperator] = useState("==");
  const [value, setValue] = useState("");
  const [conditions, setConditions] = useState([]);
  const [queryResults, setQueryResults] = useState([]);

  const addCondition = () => {
    const newCondition = { field, operator, value };
    setConditions([...conditions, newCondition]);
    setField("productName");
    setOperator("==");
    setValue("");
  };

  const removeCondition = (index) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    setConditions(updatedConditions);
  };

  const runQuery = async () => {
    const condition = conditions[0]
    const citiesRef = collection(db, 'Products');
    
    const snapshot = query(citiesRef, where(condition.field, condition.operator, condition.value));
    const fetchData = await getDocs(snapshot);
    const results = [];
    fetchData.forEach((doc) => {
      const abc = { id: doc.id, ...doc.data() };
      results.push(abc);
    });
    if (results[0]) {
      // console.log(results);
      setQueryResults(results);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Query Builder</h1>

      {conditions.map((condition, index) => (
        <div key={index} className="flex space-x-4 mb-4">
          <select
            onChange={(e) => {
              const updatedConditions = [...conditions];
              updatedConditions[index].field = e.target.value;
              setConditions(updatedConditions);
            }}
            value={condition.field}
            className="px-4 py-2 border rounded"
          >
            <option value="MRP_RATE">MRP_RATE</option>
            <option value="GroupDesc">GroupDesc</option>
            <option value="UOM_SALE">UOM_SALE</option>
          </select>
          <select
            onChange={(e) => {
              const updatedConditions = [...conditions];
              updatedConditions[index].operator = e.target.value;
              setConditions(updatedConditions);
            }}
            value={condition.operator}
            className="px-4 py-2 border rounded"
          >
            <option value="==">Equals</option>
            <option value=">">Greater Than</option>
            <option value="<">Less Than</option>
          </select>
          <input
            type="text"
            value={condition.value}
            onChange={(e) => {
              const updatedConditions = [...conditions];
              updatedConditions[index].value = e.target.value;
              setConditions(updatedConditions);
            }}
            className="px-4 py-2 border rounded"
          />
          <button onClick={() => removeCondition(index)} className="px-4 py-2 bg-red-500 text-white rounded">
            Remove
          </button>
        </div>
      ))}

      <div className="flex space-x-4 mb-4">
        <select
          onChange={(e) => setField(e.target.value)}
          value={field}
          className="px-4 py-2 border rounded"
        >
          <option value="MRP_RATE">MRP_RATE</option>
          <option value="GroupDesc">GroupDesc</option>
          <option value="UOM_SALE">UOM_SALE</option>
        </select>
        <select
          onChange={(e) => setOperator(e.target.value)}
          value={operator}
          className="px-4 py-2 border rounded"
        >
          <option value="==">Equals</option>
          <option value=">">Greater Than</option>
          <option value="<">Less Than</option>
        </select>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button onClick={addCondition} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Condition
        </button>
      </div>

      <div>
        <button onClick={runQuery} className="px-4 py-2 bg-green-500 text-white rounded">
          Run Query
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Query Results</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              {Object.keys(queryResults[0] || {}).map((header) => (
                <th key={header} className="px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queryResults.map((result, index) => (
              <tr key={index}>
                {Object.keys(result).map((key) => (
                  <td key={key} className="px-4 py-2">{result[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportPage;
