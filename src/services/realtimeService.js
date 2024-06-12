import { get, set } from "firebase/database";

export const writeToDatabase = async (ref, field, data) => {
    // console.log(myLiveCollection(collections.SPLORDLIVE));
    try {
      const snapshot = await get(ref);
      const responseData = snapshot.val();

      await set(ref, { [field]: data });
      // console.log('Data successfully written to the database');
    } catch (error) {
      console.error('Error writing data to the database:', error);
    }
  };