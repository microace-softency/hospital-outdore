import { useAuth } from "../context/AuthContext";

export const collections = {
    ADMIN: "Tnb",
    DOCTOR: 'Doctor',
    SPLORDLIVE: "SplLive",
    // TENANTS: "Tenants",
    // TENANTSDB: "TenantsDb",
    // FRANCHISE: "Franchise",
    PATIENT: "Patient",
    CUSTOMERS: "Customers",
    PRODUCTS: "Products",
    // USERS: "Users",
    // BILL : "BILL",
    // BILLDET : "BILLDET",
    // BILLTERM : "BILLTERM",
    // ORDER : "ORDER",
    // ORDERDET : "ORDERDET",
    // ORDERTERM : "ORDERTERM",
    // PORDER : "PORDER",
    // PORDERDET : "PORDERDET",
    // PORDERTERM : "PORDERTERM",
    // BILLIN : "BILLIN",
    // BLLINDET : "BLLINDET",
    // BLINTERM : "BLINTERM",
    // DBNOTE:"DBNOTE",
    // PRETDET:"PRETDET",
    // PRETTERM:"PRETTERM",
    // CRNOTE:"CRNOTE",
    // SRETDET:"SRETDET",
    // SRETTERM:"SRETTERM",
    // SPLORDER: "SPLORDER"
}
export const tableFields = {
    PATIENT:
        [{
            heading: 'ID',
            item: 'PATIENT_ID'
        }, {
            heading: 'Name',
            item: 'FULL_NAME'
        }, {
            heading: 'Gender',
            item: 'GENDER'
        }, {
            heading: 'Contact No',
            item: 'PHONE_NUMBER'
        }],
    PRODUCTS:
        [{
            heading: 'Code',
            item: 'PRODCODE'
        }, {
            heading: 'Description',
            item: 'DESCRIPT'
        }, {
            heading: 'Group',
            item: 'SGroupDesc'
        }, {
            heading: 'UOM',
            item: 'UOM_SALE'
        }, {
            heading: 'MRP',
            item: 'MRP_RATE'
        }],
    BILLINS:
        [{
            heading: 'Bill No',
            item: 'BILL_NO',
            isVisible: true

        }, {
            heading: 'Customer Name',
            item: 'CUSTNAME',
            isVisible: true

        }, {
            heading: 'Contact',
            item: 'MOBPHONE',
            isVisible: true

        }, {
            heading: 'Bill Amt',
            item: 'NET_AMT',
            isVisible: true

        }],
    SALEBILL:
        [{
            heading: 'Bill No',
            item: 'BILL_NO',
            isVisible: true

        }, {
            heading: 'Customer Name',
            item: 'CUSTNAME',
            isVisible: true

        }, {
            heading: 'Contact',
            item: 'MOBPHONE',
            isVisible: true

        },{
            heading: 'Pay Mode',
            item: 'PAY_MODE',
            isVisible: true

        }, {
            heading: 'Bill Amt',
            item: 'NET_AMT',
            isVisible: true

        }],
    ORDERS:
        [{
            heading: 'Order No',
            item: 'OA_NO',
            isVisible: true

        }, {
            heading: 'Customer Name',
            item: 'CUSTNAME',
            isVisible: true

        }, {
            heading: 'Contact',
            item: 'MOBPHONE',
            isVisible: true

        }, {
            heading: 'Advance',
            item: 'ADV_AMT',
            isVisible: true

        }, {
            heading: 'Order Amt',
            item: 'NET_AMT',
            isVisible: true

        }],
    DBNOTE:
        [{
            heading: 'Company',
            item: 'COMPANY',
            isVisible: true
        }, {
            heading: 'CR. No',
            item: 'RBILL_NO',
            isVisible: true
        }, {
            heading: 'Bill No',
            item: 'BILL_NO',
            isVisible: true
        },  {
            heading: 'Request',
            item: 'TYPE',
            isVisible: true
        },{
            heading: 'Type',
            item: 'SretType',
            isVisible: true
        },{
            heading: 'Bought',
            item: 'TOT_MAX_QTY',
            isVisible: true
        },{
            heading: 'Return',
            item: 'TOT_RET_QTY',
            isVisible: true
        },],
    SPLORDERS:
        [{
            heading: 'Status',
            item: 'STATUS',
            isVisible: true

        }],
}

export const ViewFormat = {
    PRODUCT : [
        { name: 'PRODCODE', label: 'Product Code', type: 'text' },
        { name: 'DESCRIPT', label: 'Description', type: 'text' },
        { name: 'SERVICE', label: 'Is a Service', type: 'dropdown' },
        { name: 'AVAILABLE', label: 'Is available', type: 'dropdown' },
        { name: 'UOM_PURCH', label: 'Purchasing UOM', type: 'text' },
        { name: 'UOM_STK', label: 'Stock UOM', type: 'text' },
        { name: 'UOM_SALE', label: 'Sales UOM', type: 'text' },
        { name: 'HSNCODE', label: 'HSN Code', type: 'number' },
        { name: 'IGST', label: 'GST Rate', type: 'number' },
        { name: 'RATE', label: 'Rate', type: 'number' },
        { name: 'BUY_RATE', label: 'Buy Rate', type: 'number' },
        { name: 'MRP_RATE', label: 'MRP Rate', type: 'number' },
        { name: 'DISCPER', label: 'Discount Percentage', type: 'number' },
        { name: 'GroupDesc', label: 'Group Description', type: 'text' },
        { name: 'SGroupDesc', label: 'Subgroup Description', type: 'text' },
        { name: 'OPENING_Q', label: 'Opening Quantity', type: 'text' },
        { name: 'OPENING_V', label: 'Opening Value', type: 'text' },
      ],
    CUSTOMERS : [
        { name: 'PRODCODE', label: 'Product Code', type: 'text' },
        { name: 'DESCRIPT', label: 'Description', type: 'text' },
        { name: 'SERVICE', label: 'Is a Service', type: 'dropdown', options: ['Yes', 'No'] },
        { name: 'UOM_PURCH', label: 'Purchasing UOM', type: 'text' },
        { name: 'UOM_STK', label: 'Stock UOM', type: 'text' },
        { name: 'UOM_SALE', label: 'Sales UOM', type: 'text' },
        { name: 'HSNCODE', label: 'HSN Code', type: 'number' },
        { name: 'IGST', label: 'GST Rate', type: 'number' },
        { name: 'RATE', label: 'Rate', type: 'number' },
        { name: 'BUY_RATE', label: 'Buy Rate', type: 'number' },
        { name: 'MRP_RATE', label: 'MRP Rate', type: 'number' },
        { name: 'DISCPER', label: 'Discount Percentage', type: 'number' },
        { name: 'GroupDesc', label: 'Group Description', type: 'text' },
        { name: 'SGroupDesc', label: 'Subgroup Description', type: 'text' },
        { name: 'OPENING_Q', label: 'Opening Quantity', type: 'text' },
        { name: 'OPENING_V', label: 'Opening Value', type: 'text' },
      ],
}

export const Permissions = {
    UserRights : [
        'SALE', 'PURCHASE', 'REPORT', 'DASHBOARD', 'SECURITY', 'DELETE', 'EDIT'
    ]
}