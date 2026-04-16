// API Configuration Management
// Switch between local development and production URLs here

const IS_PRODUCTION = false; // Set to true when deploying to monsterasp.net

export const API_BASE_URL = IS_PRODUCTION 
    ? "https://goldenes.runasp.net" 
    : "http://localhost:7080";

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/api/Login/Login`,
    SIGNUP: `${API_BASE_URL}/api/Registration/InsertRegisters`,
    GET_REGISTERS: `${API_BASE_URL}/api/Registration/GetRegisters`,
    DELETE_REGISTER: (id) => `${API_BASE_URL}/api/Registration/DeleteRegister/${id}`,
    
    MENU: `${API_BASE_URL}/api/Menu`,
    ADD_MENU_ITEM: `${API_BASE_URL}/api/Menu/AddMenuItem`,
    DELETE_MENU_ITEM: (id) => `${API_BASE_URL}/api/Menu/DeleteMenuItem/${id}`,
    
    PAYMENT: `${API_BASE_URL}/api/Payment`,
    
    ORDERS: `${API_BASE_URL}/api/Orders/GetOrders`,
    CREATE_ORDER: `${API_BASE_URL}/api/Orders/CreateOrder`,
    GET_ORDERS: (email) => `${API_BASE_URL}/api/Orders/GetOrders/${email}`,
    GET_ALL_ORDERS: `${API_BASE_URL}/api/Orders/GetAllOrders`,
    UPDATE_ORDER_STATUS: `${API_BASE_URL}/api/Orders/UpdateStatus`,
    GET_TOTAL_EXPENSE: (email) => `${API_BASE_URL}/api/Orders/GetTotalExpense/${email}`,
    
    BOOK_TABLE: `${API_BASE_URL}/api/TableReservation/BookTable`,
    GET_ALL_RESERVATIONS: `${API_BASE_URL}/api/TableReservation/GetAllReservations`,
    
    FORGOT_PASSWORD: {
        SEND_OTP: `${API_BASE_URL}/api/ForgotPassword/send-otp`,
        VERIFY_OTP: `${API_BASE_URL}/api/ForgotPassword/verify-otp`,
        RESET_PASSWORD: `${API_BASE_URL}/api/ForgotPassword/reset-password`,
    }
};
