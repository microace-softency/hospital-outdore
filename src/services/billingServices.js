import { createData } from ".";

  export const multiEntry = async (entries) => {
    for (const entry of entries) {
      const { collectionName, data } = entry;
  
      createData(collectionName, data);
    }
  };