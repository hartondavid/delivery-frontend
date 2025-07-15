import { getToken } from "../utils/utilFunctions";

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    token?: string;
}

interface UserData {
    [key: string]: any;
}

interface Credentials {
    email: string;
    password: string;
}

export const apiRegister = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    userData: UserData
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Registration failed");
    }
};

export const apiLogin = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    credentials: Credentials
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            // Get the token from the custom header
            const token = response.headers.get('X-Auth-Token') || undefined;
            successCallback({ ...data, token });
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Login failed");
    }
};

export const apiGetCouriers = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/users/getCouriers`, {
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
        errorCallback("Failed to fetch users");
    }
};

export const apiSearchCourier = async (
    successCallback: (data: any[]) => void,
    errorCallback: (message: string) => void,
    searchField: string
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/users/searchCourier?searchField=${searchField}`, {
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

export const apiDeleteCourier = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    courierId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/users/deleteCourier/${courierId}`, {
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
        errorCallback("Failed to delete courier");
    }
};

export const apiAddCourierToRoute = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    routeId: string | number,
    courierId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/users/addCourierToRoute/${routeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ courier_id: courierId })
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

export const apiGetAllCouriersByAdminId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/users/getAllCouriersByAdminId`, {
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

export const apiAddCourier = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    userData: UserData
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/users/addCourier`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to add user");
    }
}; 