import { getToken } from '../utils/utilFunctions';

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export const apiGetDeliveriesByAdminId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/delivery/getDeliveriesByAdminId`, {
            method: 'GET', // Your backend expects POST
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to fetch deliveries");
    }
};

export const apiGetDeliveriesByCourierId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/delivery/getDeliveriesByCourierId`, {
            method: 'GET', // Your backend expects POST
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to fetch deliveries");
    }
};

export const apiAddDelivery = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/delivery/addDelivery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to add delivery");
    }
};

export const apiAddOrdersToDelivery = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    deliveryId: string | number,
    orderIds: string[] | number[]
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/delivery/addOrdersToDelivery/${deliveryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ order_ids: orderIds })
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to add order to delivery");
    }
};

export const apiAssignCourierToDelivery = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    deliveryId: string | number,
    courierId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/delivery/assignCourierToDelivery/${deliveryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ courier_id: courierId })
        });
        const data: ApiResponse = await response.json();
        if (!data.success) {
            // errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to assign courier to delivery");
    }
};

export const apiSearchDeliveryByCourierId = async (
    successCallback: (data: any[]) => void,
    errorCallback: (message: string) => void,
    searchField: string
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/delivery/searchDeliveryByCourierId?searchField=${searchField}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 204) {
            successCallback([])
        } else {
            const data: ApiResponse = await response.json();
            if (!data.success) {
                errorCallback(data.message || 'Unknown error');
            } else {
                successCallback(data.data || []);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to fetch users");
    }
};

export const apiDeleteDelivery = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    deliveryId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/delivery/deleteDelivery/${deliveryId}`, {
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
        errorCallback("Failed to delete delivery");
    }
}; 