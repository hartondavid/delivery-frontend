import { getToken } from '../utils/utilFunctions';

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export const apiAddIssue = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    deliveryId: string | number,
    description: string
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/issues/addIssue/${deliveryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description })
        });
        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to add issue");
    }
};

export const apiUpdateIssue = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    issueId: string | number,
    deliveryId: string | number,
    description: string
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/issues/updateIssue/${issueId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ delivery_id: deliveryId, description })
        });
        const data: ApiResponse = await response.json();
        if (!data.success) {
            errorCallback(data.message || 'Unknown error');
        } else {
            successCallback(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallback("Failed to update issue");
    }
};

export const apiDeleteIssue = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    issueId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/issues/deleteIssue/${issueId}`, {
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
        errorCallback("Failed to delete issue");
    }
};

export const apiGetIssuesByAdminId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/issues/getIssuesByAdminId`, {
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
        errorCallback("Failed to fetch issues");
    }
};

export const apiGetIssueById = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void,
    issueId: string | number
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/issues/getIssue/${issueId}`, {
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
        errorCallback("Failed to fetch issue");
    }
};

export const apiGetIssuesByCourierId = async (
    successCallback: (data: ApiResponse) => void,
    errorCallback: (message: string) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    try {
        const response = await fetch(`${apiUrl}/api/issues/getIssuesByCourierId`, {
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
        errorCallback("Failed to fetch issues");
    }
}; 