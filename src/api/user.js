import { getToken } from "../utils/utilFunctions";

export const apiRegister = async (successCallback, errorCallback, userData) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Registration failed" });
    }
};

export const apiLogin = async (successCallback, errorCallback, credentials) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
        const response = await fetch(`${apiUrl}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            // Get the token from the custom header
            const token = response.headers.get('X-Auth-Token');
            successCallback({ ...data, token });
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Login failed" });
    }
};

export const apiGetCouriers = async (successCallback, errorCallback) => {
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
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch users" });
    }
};

export const apiSearchCourier = async (successCallback, errorCallback, searchField) => {
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
            const data = await response.json();
            if (!data.success) {
                errorCallback(data.message);
            } else {
                successCallback(data.data);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch users" });
    }
};


export const apiDeleteCourier = async (successCallback, errorCallback, courierId) => {
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
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to delete courier" });
    }
};

export const apiAddCourierToRoute = async (successCallback, errorCallback, routeId, courierId) => {
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

        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to add order to delivery" });
    }
};

export const apiGetAllCouriersByAdminId = async (successCallback, errorCallback) => {
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
        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to fetch users for route" });
    }
};

export const apiAddCourier = async (successCallback, errorCallback, userData) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/users/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (!data.success) {
            errorCallback(data.message);
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback({ success: false, message: "Failed to add user" });
    }
};