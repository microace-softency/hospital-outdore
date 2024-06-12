import { Timestamp, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

export const fetchAndMapWithQueries = async (
    collection1,
    collection2,
    startDate,
    endDate,
    selectedPaymentType,
    selectedSubGroup,
    setSubgroupsArray,
    FDATE,
    FNUMBER
    ) => {
      if (!startDate || !endDate) {
        toast.error('Date not Selected', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
    try {
      const startDateTimestamp = new Date(startDate).getTime();
      const endDateTimestamp = new Date(endDate).setHours(23, 59, 59, 999);
      const snapshotCash = query(
        collection1,
        where(FDATE, '>=', Timestamp.fromMillis(startDateTimestamp)),
        where(FDATE, '<=', Timestamp.fromMillis(endDateTimestamp)),
        where('PAY_MODE', '==', selectedPaymentType)
      );
      const snapshot = query(
        collection1,
        where(FDATE, '>=', Timestamp.fromMillis(startDateTimestamp)),
        where(FDATE, '<=', Timestamp.fromMillis(endDateTimestamp)),
      );

      const fetchBillData = await getDocs(selectedPaymentType !== 'All' ? snapshotCash : snapshot);

      const billData = fetchBillData.docs.map((doc) => doc.data());

      const snapshot2SubGroup = query(
        collection2,
        where(FDATE, '>=', Timestamp.fromMillis(startDateTimestamp)),
        where(FDATE, '<=', Timestamp.fromMillis(endDateTimestamp)),
        where('SGroupDesc', '==', selectedSubGroup)
      );
      const snapshot2 = query(
        collection2,
        where(FDATE, '>=', Timestamp.fromMillis(startDateTimestamp)),
        where(FDATE, '<=', Timestamp.fromMillis(endDateTimestamp)),
      );
      const fetchDetlData = await getDocs((selectedSubGroup !== 'ALL' && selectedSubGroup) ? snapshot2SubGroup : snapshot2);

      const billDetData = fetchDetlData.docs.map((doc) => doc.data());
      {selectedSubGroup === 'ALL' && setSubgroupsArray(Array.from(new Set(billDetData.map((product) => product.SGroupDesc)))) };
      const combinedData = billData.map((bill) => {
        const matchingBillDet = billDetData.filter((billDet) => billDet[FNUMBER] === bill[FNUMBER]);
      
        // Include the item in combinedData only if there is at least one matching billDet
        if (matchingBillDet.length > 0) {
          return {
            BillNumber: bill[FNUMBER],
            customerDetails: bill,
            productsData: matchingBillDet,
          };
        }
      
        return null;
      }).filter(Boolean);
      
      return combinedData;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //   try {
  //     const startDateTimestamp = new Date(startDate).getTime();
  //     const endDateTimestamp = new Date(endDate).setHours(23, 59, 59, 999);
  
  //     // Fetch data for closing_before_start
  //     const closingBeforeStartSnapshot = query(
  //       collection1,
  //       where(FDATE, '<', Timestamp.fromMillis(startDateTimestamp))
  //     );
  //     const closingBeforeStartData = await getDocs(closingBeforeStartSnapshot);
  
  //     // Fetch data for material_summary
  //     const materialSummarySnapshot = query(
  //       collection1,
  //       where(FDATE, '>=', Timestamp.fromMillis(startDateTimestamp)),
  //       where(FDATE, '<=', Timestamp.fromMillis(endDateTimestamp))
  //     );
  //     const materialSummaryData = await getDocs(materialSummarySnapshot);
  
  //     // Process closing_before_start data
  //     const closingBeforeStartMap = new Map();
  //     closingBeforeStartData.docs.forEach((doc) => {
  //       const productCode = doc.data().PRODCODE;
  //       const quantity = parseInt(doc.data().QUANTITY, 10);
  //       const existingQty = closingBeforeStartMap.get(productCode) || 0;
  //       closingBeforeStartMap.set(productCode, existingQty + quantity);
  //     });
  
  //     // Process material_summary data
  //     const materialSummaryMap = new Map();
  //     materialSummaryData.docs.forEach((doc) => {
  //       const productCode = doc.data().PRODCODE;
  //       const productName = doc.data().PRODNAME;
  //       const quantity = parseInt(doc.data().QUANTITY, 10);
  
  //       if (!materialSummaryMap.has(productCode)) {
  //         materialSummaryMap.set(productCode, {
  //           product_name: productName,
  //           total_quantity_purchased: 0,
  //         });
  //       }
  
  //       const productData = materialSummaryMap.get(productCode);
  //       productData.total_quantity_purchased += quantity;
  //     });
  
  //     // Combine data and calculate totals
  //     const result = [];
  //     materialSummaryMap.forEach((materialData, productCode) => {
  //       const openingQty = closingBeforeStartMap.get(productCode) || 0;
  //       const totalQtyPurchased = materialData.total_quantity_purchased;
  //       const totalQtySold = 0; // Assuming total_quantity_sold is not available in the provided data
  //       const totalQtyReturned = 0; // Assuming total_quantity_returned is not available in the provided data
  //       const closingQty =
  //         openingQty + totalQtyPurchased - totalQtySold + totalQtyReturned;
  
  //       result.push({
  //         product_code: productCode,
  //         product_name: materialData.product_name,
  //         opening_qty: openingQty,
  //         total_quantity_purchased: totalQtyPurchased,
  //         total_quantity_sold: totalQtySold,
  //         total_quantity_returned: totalQtyReturned,
  //         closing_quantity: closingQty,
  //       });
  //     });
  
  //     return result;
  //   } catch (error) {
  //     console.error('Error generating material report:', error);
  //   }
  // };