import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  getDocs,
  where,
  orderBy,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { collections } from "../config";

export const fetchDataFromDb = async (sort, whereQuery, ref, fieldNamesToMap) => {
  const first = query(
    ref,
    whereQuery || [],
    ...(sort?.map((el) => orderBy(el[0], el[1])) || []),
  );

  const fetchData = await getDocs(first);

  // function mapDocumentToCustomObject(doc, fieldNames, refId) {
  //   const data = doc.data();
  //   const customObject = {};
  //   fieldNames.forEach((fieldName) => {
  //     console.log(data);
  //     customObject[fieldName?.item] = data[fieldName?.item];
  //   });
  //   customObject.id = doc.id;
  //   customObject.refId = refId; // Add the reference ID to the result
  //   return customObject;
  // }

  // if (fieldNamesToMap) {
  //   const refId = ref.id; // Get the ID of the collection (ref)
  //   return fetchData.docs.map((doc) => mapDocumentToCustomObject(doc, fieldNamesToMap, refId));
  // } else {
    const results = [];
    fetchData.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      data.refId = doc._key.path.segments[6]; // Add the reference ID to the result
      results.push(data);
    });
    return results;
  // }
};

const x = async (tenantId) => {
  console.log(tenantId);

  const tenantDocumentRef = doc(db, collections.TENANTSDB, tenantId);
  
  try {
    const tenantDocumentSnapshot = await getDoc(tenantDocumentRef);
  
    if (tenantDocumentSnapshot.exists()) {
      const companyData = tenantDocumentSnapshot.data();
      console.log(companyData);
      return companyData.CName;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error.message);
    throw error;
  }
};

export const fetchDBNOTE = async (sort, whereQuery, ref) => {
  const first = query(
    ref,
    whereQuery || [],
    ...(sort?.map((el) => orderBy(el[0], el[1])) || []),
  );

  const fetchData = await getDocs(first);

  const results = [];
  fetchData.forEach(async (doc) => {
    const data = doc.data();
    data.id = doc.id;
    data.refId = doc._key.path.segments[6];
    data.company = await x(doc._key.path.segments[6]);
    results.push(data);
  });
  
  return results;
  
};

export const fetchDataWithMultipleWheree = async (ref, field1, data1, field2, data2) => {
  const snapshot = query(ref, where(field1, '==', data1), where(field2, '==', data2));
  const fetchData = await getDocs(snapshot);
  const results = [];
  
  fetchData.forEach((doc) => {
    const abc = { id: doc.id, ...doc.data() };
    results.push(abc);
  });

  if (results.length > 0) {
    return results;
  } else {
    return null; // or you can return an empty array or handle it based on your requirement
  }
};

export const fetchDataWithQuery = async (first) => {
  const fetchData = await getDocs(first);
    const results = [];
    fetchData && fetchData.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      results.push(data);
    });
    if (results[0]) {
      return results;
    }
}

export const createData = async (ref, data) => {
  console.log(data);
  // const value = collection(db, dbCollection);
  try {
    await addDoc(ref, {...data
    });
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

export const deleteData = async (ref, id) => {
  const qyr = doc(ref, id)
  try {
    await deleteDoc(qyr);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteMultipleDocs = async (ref, field, value) => {
  try {
    const ref1 = query(ref, where(field, '==', value));
    const querySnapshot = await getDocs(ref1);

    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      const deletePromise = deleteDoc(doc.ref);
      deletePromises.push(deletePromise);
    });

    // Log document IDs before deletion
    const deletedDocumentIds = querySnapshot.docs.map(async (doc) => doc.id);
    console.log('Documents to be deleted:', deletedDocumentIds);

    await Promise.all(deletePromises);
    console.log('Multiple documents deleted successfully');
  } catch (error) {
    console.error('Error deleting documents:', error);
    throw error;
  }
};

export const fetchDataWithWhere = async (ref, field, data) => {
    const snapshot = query(ref, where(field, '==', data));
    const fetchData = await getDocs(snapshot);
    const results = [];
    fetchData.forEach((doc) => {
      const abc = { id: doc.id, ...doc.data() };
      results.push(abc);
    });
    if (results[0]) {
      return results;
    }
};

export const getCount = async (ref) => {
    const fetchData = await getDocs(ref)
    return fetchData.count()
}
export const formatFirestoreTimestamp = (timestamp) => {
  if (timestamp) {
    // Convert Firestore Timestamp to JavaScript Date
    const jsDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    // Format the date as "dd/mm/yyyy"
    const formattedDate = jsDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return formattedDate;
  }
};

// export const fetchRefWithMultipleWhere = async (ref, field1, data1, field2, data2) => {
//   const snapshot = query(ref, where(field1, '==', data1), where(field2, '==', data2));
//   const fetchData = await getDocs(snapshot);

//   if (!fetchData.empty) {
//     // Return the first DocumentReference
//     return fetchData.docs[0].ref;
//   } else {
//     return null; // or you can return an empty array or handle it based on your requirement
//   }
// };

// export const updateData = async (ref, data) => {
//   try {
//     await update(ref, data);
//     console.log('data updated successfully');
//   } catch (error) {
//     console.log('Error:', error);
//     throw error;
//   }
// }
export const updateDocWithWhere = async (ref, field1, data1, field2, data2, newData) => {
  try {
    // Fetch documents that match the specified conditions
    const prevData = await fetchDataWithMultipleWheree(ref, field1, data1, field2, data2);
    if (prevData && prevData.length > 0) {
      const docIdToUpdate = prevData[0].id;

      // Spread the new data over the existing data
      const updatedData = { ...prevData[0], ...newData };

      await deleteData(ref, docIdToUpdate)
      await createData(ref, updatedData);

      console.log('Document updated successfully:', docIdToUpdate);
      
      return updatedData; // Return the updated data
    } else {
      console.log('No matching document found for update.');
      return null; // Or handle accordingly based on your use case
    }
  } catch (error) {
    console.error('updateDocWithWhere error ->', error);
    throw error; // Rethrow the error to propagate it further if needed
  }
};
export const getLastCustCode = async (ref, type) => {
  // Return the promise from fetchDataWithWhere
  return fetchDataWithWhere(ref, 'CUST_VEND', type).then((customers) => {
    const existingCustomerCodes = customers.map((customer) => customer.CUSTCODE);
    const maxCustomerCode = Math.max(...existingCustomerCodes, 0);
    const nextCode = Number(1 + maxCustomerCode);
    console.log(nextCode);
    return nextCode;
  })
};

export const collectionByTenant = async (cname, tenantId) => {
  const tenantsCollection = collection(db, 'TenantsDb');

  // Check if tenantId and cname are provided
  if (tenantId && cname) {
    const tenantDocRef = doc(tenantsCollection, tenantId);
    const ref = collection(tenantDocRef, cname);
    // console.log('-------', ref);
    return ref;
  } else {
    console.error('Invalid tenant ID or collection name');
    return null;
  }
};

export const adminCollection = async (cname) => {
  const tenantsCollection = collection(db, 'Tnb');

  // Check if tenantId and cname are provided
  if (cname) {
    const tenantDocRef = doc(tenantsCollection, 'collections');
    const ref = collection(tenantDocRef, cname);
    // console.log('-------', ref);
    return ref;
  } else {
    console.error('Invalid tenant ID or collection name');
    return null;
  }
};
