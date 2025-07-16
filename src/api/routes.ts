import { getToken, getApiHeaders } from '../utils/utilFunctions';

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

interface RouteData {
    area?: string;
    [key: string]: any;
}

export const apiAddRoute = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    area: string
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/routes/addRoute`, {
            method: 'POST',
            headers: getApiHeaders(true),
            body: JSON.stringify({ area: area })
        });
        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to add route");
    }
};

export const apiUpdateRoute = async (
    routeId: string | number,
    updateData: RouteData,
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/delivery/updateRoute/${routeId}`, {
            method: 'PUT',
            headers: getApiHeaders(true),
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
        errorCallback("Failed to update route");
    }
};

export const apiDeleteRoute = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    routeId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/routes/deleteRoute/${routeId}`, {
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
        errorCallback("Failed to delete route");
    }
};

export const apiGetCouriersByAdminId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/routes/getCouriersByAdminId`, {
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
        errorCallback("Failed to fetch users for route");
    }
};

export const apiGetCouriersByRouteId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    routeId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/routes/getCouriersByRouteId/${routeId}`, {
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

export const apiGetRoutesByCourierId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/routes/getRoutesByCourierId`, {
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