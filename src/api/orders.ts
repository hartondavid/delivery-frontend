import { getToken } from '../utils/utilFunctions';

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

interface OrderData {
    [key: string]: any;
}

export const apiAddOrder = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    orderData: OrderData
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/orders/addOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to add order");
    }
};

export const apiUpdateOrder = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    orderId: string | number,
    updateData: OrderData
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/orders/updateOrder/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });
        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to update order");
    }
};

export const apiDeleteOrder = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    orderId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/orders/deleteOrder/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to delete order");
    }
};

export const apiGetOrderById = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    orderId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/orders/getOrder/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to fetch order");
    }
};

export const apiGetOrdersByAdminId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/orders/getOrdersByAdminId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to fetch orders");
    }
};

export const apiGetOrdersByCourierId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/orders/getOrdersByCourierId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to fetch orders");
    }
};

export const apiSearchOrder = async (
    successCallback: (data: any[]) => void,
    errorCallback: (message: string) => void,
    searchField: string
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/orders/searchOrder?searchField=${searchField}`, {
            method: 'GET', // or 'GET' depending on your APIS
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.status === 204) {
            successCallback([])
        } else {
            const data: ApiResponse = await response.json();
            if (!data.success) {
                errorCallback(data.message || 'Unknown error')
            } else {
                successCallback(data.data || [])
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Ceva nu a mers bine")
    }
}

export const apiGetOrdersByDeliveryId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    deliveryId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/orders/getOrdersByDeliveryId/${deliveryId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to fetch orders");
    }
}; 