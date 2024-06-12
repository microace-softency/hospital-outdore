import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { query } from "firebase/database";

const sourceCollection = 'Tnb/collections/ProductsAdmin';

// Function to get all tenant IDs
const getAllTenantIds = async () => {
  const tenantsRef = collection(db, 'TenantsDb');
  const tenantsSnapshot = await getDocs(tenantsRef);
  return tenantsSnapshot.docs.map((doc) => doc.id);
};

export const copyData = async () => {
  try {
    const sourceRef = collection(db, sourceCollection);

    const allTenantIds = await getAllTenantIds();

    // Iterate over all tenants and copy data for each one
    await Promise.all(allTenantIds.map(async (tenantId) => {
      const destinationPath = `TenantsDb/${tenantId}/Products`;
      const destinationRef = collection(db, destinationPath);

      const fetchData = await getDocs(sourceRef);

      const promises = fetchData.docs.map(async (document) => {
        const data = document.data();

        // Set the same id; to generate a new id, remove this line
        const id = document.id;

        const destinationDocRef = doc(destinationRef, id);

        return setDoc(destinationDocRef, data);
      });

      await Promise.all(promises);

      console.log(`Data copied successfully for tenant ${tenantId}`);
    }));

    console.log('Data copied for all tenants successfully!');
  } catch (error) {
    console.error('Error copying data:', error);
  }
};

export const copyDataWithProgressBar = async (scrCollection, desCollection, handleProgress) => {
  try {
    const sourceRef = collection(db, `Tnb/collections/${scrCollection}`);

    const allTenantIds = await getAllTenantIds();

    const totalTenants = allTenantIds.length;

    // Initialize variables to track progress
    let completedTenants = 0;

    // Iterate over all tenants and copy data for each one
    await Promise.all(allTenantIds.map(async (tenantId, index) => {
      const destinationPath = `TenantsDb/${tenantId}/${desCollection}`;
      console.log(`TenantsDb/${tenantId}/${desCollection}`  );
      const destinationRef = collection(db, destinationPath);

      const fetchData = await getDocs(sourceRef);
      console.log('?????', sourceRef);

      const promises = fetchData.docs.map(async (document) => {
        const data = document.data();
        // Set the same id; to generate a new id, remove this line
        const id = document.id;

        const destinationDocRef = doc(destinationRef, id);
        console.log('?????', data);
        return setDoc(destinationDocRef, data);
      });

      await Promise.all(promises);

      completedTenants += 1;

      // Calculate progress percentage and call the handleProgress function
      const progressPercent = (completedTenants / totalTenants) * 100;
      handleProgress(progressPercent, `${completedTenants}/${totalTenants} tenants completed`);

      // console.log(`Data copied successfully for tenant ${tenantId}`);
    }));

    // console.log('Data copied for all tenants successfully!');
  } catch (error) {
    console.error('Error copying data:', error);
  }
};

export const copyDataToSpecificTenant = async (tenantId, handleProgress) => {
  try {
    const sourceRef = collection(db, sourceCollection);
    const destinationPath = `TenantsDb/${tenantId}/Products`;
    const destinationRef = collection(db, destinationPath);

    const fetchData = await getDocs(sourceRef);

    const totalDocuments = fetchData.docs.length;
    let completedDocuments = 0;

    const promises = fetchData.docs.map(async (document) => {
      const data = document.data();

      // Set the same id; to generate a new id, remove this line
      const id = document.id;

      const destinationDocRef = doc(destinationRef, id);

      await setDoc(destinationDocRef, data);

      completedDocuments += 1;

      // Calculate progress percentage and call the handleProgress function
      const progressPercent = (completedDocuments / totalDocuments) * 100;
      handleProgress(progressPercent, `${completedDocuments}/${totalDocuments} documents completed`);

      // console.log(`Data copied successfully for tenant ${tenantId}`);
    });

    await Promise.all(promises);

    // console.log(`Data copied to tenant ${tenantId} successfully!`);
  } catch (error) {
    console.error('Error copying data:', error);
  }
};

export const isProductCodeUnique = async (PRODCODE) => {
  try {
    const querySnapshot = await getDocs(query(collection(db, sourceCollection), where('PRODCODE', '==', PRODCODE)));
    
    // If the querySnapshot is empty, the code is unique
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking product code uniqueness:', error);
    // Handle the error or return false, indicating non-uniqueness
    return false;
  }
};

export const deleteDataFromAllTenants = async (cName, docId) => {
  try {
    const allTenantIds = await getAllTenantIds();

    // Iterate over all tenants and delete the document for each one
    await Promise.all(allTenantIds.map(async (tenantId) => {
      const destinationPath = `TenantsDb/${tenantId}/${cName}`;
      const destinationRef = collection(db, destinationPath);

      const destinationDocRef = doc(destinationRef, docId);

      await deleteDoc(destinationDocRef);

      // console.log(`Document deleted successfully for tenant ${tenantId}`);
    }));
    const sourceCollection = collection(db, sourceCollection);
    const destinationAdminDocRef = doc(sourceCollection, docId);
    await deleteDoc(destinationAdminDocRef)
    // console.log('Document deleted for all tenants successfully!');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export const deleteDataFromAdminWithCondition = async (cName, conditionField, conditionValue) => {
  try {
    const adminCollectionRef = collection(db, sourceCollection);
    const adminQuery = query(adminCollectionRef, where(conditionField, '==', conditionValue));
    const adminQuerySnapshot = await getDocs(adminQuery);

    const adminDeletePromises = adminQuerySnapshot.docs.map(async (adminDocument) => {
      const adminDocRef = doc(adminCollectionRef, adminDocument.id);
      await deleteDoc(adminDocRef);
      // console.log('Document deleted from admin collection successfully!');
    });

    await Promise.all(adminDeletePromises);

    // console.log('Documents deleted from admin collection successfully!');
  } catch (error) {
    console.error('Error deleting documents from admin collection:', error);
  }
};

export const deleteDataFromAllTenantsWithCondition = async (cName, conditionField, conditionValue) => {
  try {
    const allTenantIds = await getAllTenantIds();

    // Iterate over all tenants and delete the documents based on the condition for each one
    await Promise.all(allTenantIds.map(async (tenantId) => {
      const destinationPath = `TenantsDb/${tenantId}/${cName}`;
      const destinationRef = collection(db, destinationPath);

      const q = query(destinationRef, where(conditionField, '==', conditionValue));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map(async (document) => {
        const destinationDocRef = doc(destinationRef, document.id);
        await deleteDoc(destinationDocRef);
        // console.log(`Document deleted successfully for tenant ${tenantId}`);
      });

      await Promise.all(deletePromises);
    }));

    // Call the separate function to delete the document from the admin collection
    await deleteDataFromAdminWithCondition(cName, conditionField, conditionValue);

    // console.log('Documents deleted for all tenants and from admin collection successfully!');
  } catch (error) {
    console.error('Error deleting documents:', error);
  }
};

export const addProductsToProductsAdmin = async (product) => {
  try {
    const sourceRef = collection(db, sourceCollection);

      // Remove the id to let Firestore generate a new id for the new document
      delete product.id;

      const sourceDocRef = await addDoc(sourceRef, product);

      // console.log(`Product added successfully with ID: ${sourceDocRef.id}`);
      return sourceDocRef.id;

  } catch (error) {
    console.error('Error adding products to ProductsAdmin:', error);
  }
};

export const copyProductToAllTenants = async (productId) => {
  try {
    const allTenantIds = await getAllTenantIds();
    const productRef = doc(db, sourceCollection, productId);
    const productData = (await getDoc(productRef)).data();

    // Iterate over all tenants and add the product for each one
    await Promise.all(allTenantIds.map(async (tenantId) => {
      const destinationPath = collection(db, `TenantsDb/${tenantId}/Products`);
      const destinationRef = doc(destinationPath, productId);

      await setDoc(destinationRef, productData);

    }));
  } catch (error) {
    console.error('Error copying product to all tenants:', error);
  }
};

export const modifyProductInAllTenants = async (productId, updatedProduct) => {
  try {
    const allTenantIds = await getAllTenantIds();

    // Modify the product in the admin collection
    const adminProductRef = doc(db, sourceCollection, productId);
    await updateDoc(adminProductRef, updatedProduct);

    // Modify the product in all tenants' collections
    await Promise.all(allTenantIds.map(async (tenantId) => {
      const tenantProductRef = doc(db, `TenantsDb/${tenantId}/Products`, productId);

      // Get the existing data to merge it with the updated product
      const existingData = (await getDoc(tenantProductRef)).data();

      // Merge the existing data with the updated product
      const mergedData = { ...existingData, ...updatedProduct };

      // Set the merged data back to the tenant's collection
      await setDoc(tenantProductRef, mergedData);

      // console.log(`Product modified successfully for tenant ${tenantId} with ID: ${productId}`);
    }));

    // console.log('Product modified in all tenants successfully!');
  } catch (error) {
    console.error('Error modifying product:', error);
  }
};

// import { collection, doc, getDocs, setDoc } from "firebase/firestore";
// import { db } from "../firebase";


// const sourceCollection = sourceCollection;
// const destinationPath = 'TenantsDb/DG06/Products';
// // Function to copy data from source collection to destination collection
// export const copyData = async () => {
//   try {
//     const sourceRef = collection(db, sourceCollection);
//     const destinationRef = collection(db, destinationPath);

//     const fetchData = await getDocs(sourceRef);

//     const promises = fetchData.docs.map(async (document) => {
//       const data = document.data();
      
//       // to set the same id, to genenrate new id remove it
//       const id = document.id;
      
//       const destinationDocRef = doc(destinationRef, id);

//       return setDoc(destinationDocRef, data);
//     });

//     await Promise.all(promises);

//     console.log('Data copied successfully!');
//   } catch (error) {
//     console.error('Error copying data:', error);
//   }
// };
// getAuth()
//   .updateUser(uid, {
//     email: 'modifiedUser@example.com',
//     phoneNumber: '+11234567890',
//     emailVerified: true,
//     password: 'newPassword',
//     displayName: 'Jane Doe',
//     photoURL: 'http://www.example.com/12345678/photo.png',
//     disabled: true,
//   })
//   .then((userRecord) => {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log('Successfully updated user', userRecord.toJSON());
//   })
//   .catch((error) => {
//     console.log('Error updating user:', error);
//   });