// ==============================
// BUSINESS SETTINGS
// ==============================
export const businessSettings = {
    business_name: "Capara Smart POS Store",
    logo: "https://via.placeholder.com/100x100.png?text=LOGO",
    address: "Balagtas, Bulacan",
    contact_number: "09123456789",
};

// ==============================
// STATS
// ==============================
export const statsData = [
    { title: "Customers", value: 3782, growth: 11.01, up: true },
    { title: "Products", value: 5359, growth: 9.05, up: false },
    { title: "Total Sales", value: 125000, growth: 7.8, up: true },
    { title: "Pending Utang", value: 15000, growth: 2.5, up: false },
];

// ==============================
// MONTHLY SALES
// ==============================
export const monthlySalesData = [
    { month: "Jan", value: 15000 },
    { month: "Feb", value: 37000 },
    { month: "Mar", value: 19000 },
    { month: "Apr", value: 29000 },
    { month: "May", value: 17500 },
    { month: "Jun", value: 18500 },
    { month: "Jul", value: 28000 },
    { month: "Aug", value: 10000 },
    { month: "Sep", value: 20500 },
    { month: "Oct", value: 37500 },
    { month: "Nov", value: 27000 },
    { month: "Dec", value: 10500 },
];

// ==============================
// PRODUCTS
// ==============================
export const products = [
    {
        id: 1,
        name: "Coca Cola 1.5L",
        category: "Beverages",
        price: 75,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        name: "Lucky Me Pancit Canton",
        category: "Instant Food",
        price: 15,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 3,
        name: "Bear Brand Milk",
        category: "Dairy",
        price: 35,
        image: "https://via.placeholder.com/150",
    },
];

export const productsData = [
    {
        id: 1,
        name: "Coca Cola 1.5L",
        category: "Beverages",
        price: 75,
        image: "https://via.placeholder.com/120?text=Coke",
        stock: 50,
        reorder_level: 10,
    },
    {
        id: 2,
        name: "Lucky Me Pancit Canton",
        category: "Instant Food",
        price: 15,
        image: "https://via.placeholder.com/120?text=Pancit",
        stock: 100,
        reorder_level: 20,
    },
    {
        id: 3,
        name: "Bear Brand Milk",
        category: "Dairy",
        price: 35,
        image: "https://via.placeholder.com/120?text=Milk",
        stock: 20,
        reorder_level: 5,
    },
];

export const customersData = [
    {
        id: 1,
        name: "Juan Dela Cruz",
        phone: "09123456789",
        total_transactions: 12,
        total_utang: 1500,
    },
    {
        id: 2,
        name: "Maria Santos",
        phone: "09987654321",
        total_transactions: 5,
        total_utang: 0,
    },
];

export const salesData = [
    {
        id: 1,
        customer_name: "Juan Dela Cruz",
        total_amount: 540,
        payment_method: "GCash",
        status: "Completed",
        created_at: "2026-04-25",
        items: [
            { name: "Coke", qty: 2, price: 75 },
            { name: "Milk", qty: 3, price: 35 },
        ],
    },
    {
        id: 2,
        customer_name: "Maria Santos",
        total_amount: 1200,
        payment_method: "Utang",
        status: "Pending",
        created_at: "2026-04-24",
        items: [
            { name: "Pancit Canton", qty: 10, price: 15 },
        ],
    },
];

export const paymentsData = [
    {
        id: 1,
        customer_name: "Juan Dela Cruz",
        amount: 500,
        payment_method: "Cash",
        created_at: "2026-04-25",
        status: "Paid",
    },
    {
        id: 2,
        customer_name: "Maria Santos",
        amount: 1200,
        payment_method: "GCash",
        created_at: "2026-04-24",
        status: "Pending",
    },
];

export const reportSales = [
    { month: "Jan", sales: 12000 },
    { month: "Feb", sales: 18000 },
    { month: "Mar", sales: 15000 },
    { month: "Apr", sales: 22000 },
];

export const paymentMethods = [
    { name: "Cash", value: 4000 },
    { name: "GCash", value: 3000 },
    { name: "Utang", value: 2000 },
];

// ==============================
// INVENTORY
// ==============================
export const inventory = [
    { product_id: 1, stock: 50, reorder_level: 10 },
    { product_id: 2, stock: 100, reorder_level: 20 },
    { product_id: 3, stock: 20, reorder_level: 5 },
];

// ==============================
// CUSTOMERS
// ==============================
export const customers = [
    {
        id: 1,
        name: "Juan Dela Cruz",
        phone: "09123456789",
        total_transactions: 10,
        total_utang: 1200,
    },
    {
        id: 2,
        name: "Maria Santos",
        phone: "09987654321",
        total_transactions: 5,
        total_utang: 0,
    },
];

// ==============================
// UTANG
// ==============================
export const utangRecords = [
    {
        id: 1,
        customer_id: 1,
        customer_name: "Juan Dela Cruz",
        sale_id: 2,
        amount: 1200,
        is_paid: false,
        due_label: "Due in 7 days",
    },
];

// ==============================
// PAYMENTS
// ==============================
export const payments = [
    {
        id: 1,
        utang_id: 1,
        amount: 500,
        payment_method: "Cash",
        created_at: "2026-04-24",
    },
];

// ==============================
// TRANSACTIONS
// ==============================
export const recentTransactionsData = [
    {
        id: 1,
        customer: "Maria Santos",
        payment: "GCash",
        amount: 540,
        status: "Completed",
        date: "2026-04-24",
    },
    {
        id: 2,
        customer: "Juan Dela Cruz",
        payment: "Utang",
        amount: 1200,
        status: "Pending",
        date: "2026-04-24",
    },
    {
        id: 3,
        customer: "Ana Cruz",
        payment: "Cash",
        amount: 400,
        status: "Cancelled",
        date: "2026-04-23",
    },
];

// ==============================
// QUICK ACTIONS
// ==============================
export const quickActions = [
    { label: "Products" },
    { label: "Sales" },
    { label: "Utang" },
    { label: "Cashiers" },
];