import React from 'react';
import { formatDateTimestamp } from '../services/utils';

function CustProdDetail({ totalReportData, FDATE, FNUMBER }) {
  const overallTotals = totalReportData.reduce(
    (totals, reportData) => {
      reportData.productsData.forEach((product) => {
        totals.totalProduct += product?.RATE * product?.QUANTITY;
        totals.totalDiscount += (product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100;
        totals.totalAmount += product?.AMOUNT;
        totals.totalIGST += (product?.RATE * product?.QUANTITY - (product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100) / 100 * product?.IGSTPER;
        totals.totalGrandTotal +=
          ((product?.RATE * product?.QUANTITY - (product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100) / 100 * product?.IGSTPER) +
          (product?.RATE * product?.QUANTITY - (product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100);
      });
      return totals;
    },
    {
      totalProduct: 0,
      totalDiscount: 0,
      totalAmount: 0,
      totalIGST: 0,
      totalGrandTotal: 0,
    }
  );
  return (
    <>
      <table>
        <thead className="bg-sky-300 border-b border-slate-400">
          <tr>
            <th className="py-2 px-3 sm:px-2">Date</th>
            <th className="py-2 px-3 sm:px-2">Bill No</th>
            <th className="py-2 px-3 sm:px-2">Customer Name</th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2"></th>
          </tr>
          <tr>
            <th className="py-2 px-3 sm:px-2"></th>
            <th className="py-2 px-3 sm:px-2">Code</th>
            <th className="py-2 px-3 sm:px-2">Product Name</th>
            <th className="py-2 px-3 sm:px-2 text-right">QTY</th>
            <th className="py-2 px-3 sm:px-2 text-left">UOM</th>
            <th className="py-2 px-3 sm:px-2 text-left">Rate</th>
            <th className="py-2 px-3 sm:px-2 text-left">Product Total</th>
            <th className="py-2 px-3 sm:px-2 text-left">Dis%age</th>
            <th className="py-2 px-3 sm:px-2 text-left">Dis Amt</th>
            <th className="py-2 px-3 sm:px-2 text-left">Taxable Amt</th>
            <th className="py-2 px-3 sm:px-2 text-left">GST%</th>
            <th className="py-2 px-3 sm:px-2 text-left">GST Amt</th>
            <th className="py-2 px-3 sm:px-2 text-left">Total Amt</th>
          </tr>
        </thead>
        {totalReportData && totalReportData.map((reportData, i) => (
          <tbody key={i} className='bg-white font-semibold text-xs'>
            {reportData &&
              <tr className='text-slate-500'>
                <td className="py-2 px-2">{formatDateTimestamp(reportData.customerDetails[FDATE])}</td>
                <td className="py-2 px-2">{reportData.customerDetails[FNUMBER]}</td>
                <td className="py-2 px-2 max-w-[50px]">{reportData.customerDetails.CUSTNAME}</td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
              </tr>}
            {reportData && reportData.productsData.map((product, i) => (
              <tr key={i} className='align-top text-xs'>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2">{product?.PRODCODE}</td>
                <td className="py-2 px-2">{product?.PRODNAME}</td>
                <td className="py-2 px-2 text-right">{product?.QUANTITY}</td>
                <td className="py-2 px-2 text-left">{product?.UOM}</td>
                <td className="py-2 px-2 text-right">{product?.RATE}</td>
                <td className="py-2 px-2 text-right">{product?.PRODTOTAL}</td>
                <td className="py-2 px-2 text-right">{product?.DISCOUNTPER}%</td>
                <td className="py-2 px-2 text-right">{product?.DISCOUNTAMT}</td>
                <td className="py-2 px-2 text-right">{product?.AMOUNT}</td>
                <td className="py-2 px-2 text-right">{product?.IGSTPER}%</td>
                <td className="py-2 px-2 text-right">{product?.GSTAMT}</td>
                <td className="py-2 px-2 text-right">{(product?.GSTAMT + product?.AMOUNT)}</td>
              </tr>
            ))}
            <tr className='text-black drop-shadow border-y border-slate-400 text-right font-bold bg-sky-300 text-md'>
              <td className="py-2 px-2">Total :</td>
              <td className="py-2 px-2"></td>
              <td className="py-2 px-2"></td>
              <td className="py-2 px-2"></td>
              <td className="py-2 px-2"></td>
              <td className="py-2 px-2"></td>
              <td className="py-2 px-2">{(reportData.productsData.reduce(
                (total, product) => total + ((product?.RATE * product?.QUANTITY)),
                0
              ))}</td>
              <td className="py-2 px-2"></td>
              <td className="py-2 px-2">{(reportData.productsData.reduce(
                (total, product) => total + ((product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100),
                0
              ))}</td>
              <td className="py-2 px-2">{((reportData.productsData.reduce(
                (total, product) => total + ((product?.RATE * product?.QUANTITY)),
                0
              )) - (reportData.productsData.reduce(
                (total, product) => total + ((product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100),
                0
              )))}</td>
              <td className="py-2 px-2"></td>
              <td className="py-2 px-2">{(reportData.productsData.reduce(
                (total, product) => total + ((product?.RATE * product?.QUANTITY - (product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100) / 100 * product?.IGSTPER),
                0
              ))}</td>
              <td className="py-2 px-2">{(reportData.productsData.reduce(
                (total, product) =>
                  total + (
                    ((product?.RATE * product?.QUANTITY - (product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100) / 100 * product?.IGSTPER) +
                    (product?.RATE * product?.QUANTITY - (product?.RATE * product?.QUANTITY * product?.DISCOUNTPER) / 100)
                  )
                ,
                0
              ))}</td>
            </tr>
          </tbody>
        ))}
        <tfoot>
          <tr className='text-black border-t border-slate-400 text-right font-bold bg-slate-400 text-md'>
            <td className="py-2 px-2">Overall Total :</td>
            <td className="py-2 px-2"></td>
            <td className="py-2 px-2"></td>
            <td className="py-2 px-2"></td>
            <td className="py-2 px-2"></td>
            <td className="py-2 px-2"></td>
            <td className="py-2 px-2">{overallTotals.totalProduct}</td>
            <td className="py-2 px-2"></td>
            <td className="py-2 px-2">{overallTotals.totalDiscount}</td>
            <td className="py-2 px-2">{overallTotals.totalAmount}</td>
            <td className="py-2 px-2"></td>
            <td className="py-2 px-2">{overallTotals.totalIGST}</td>
            <td className="py-2 px-2">{overallTotals.totalGrandTotal}</td>
          </tr>
        </tfoot>
      </table>

    </>

  );
}

export default CustProdDetail;
