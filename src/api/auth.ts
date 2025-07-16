import { getToken, getApiHeaders } from "../utils/utilFunctions";

interface User {
    success: boolean;
    data?: any;
    [key: string]: any;
}

export const apiCheckLogin = async (
    errorCallBack: () => void,
    setUser: (user: User) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();

    console.log('API URL:', apiUrl);
    console.log('Token exists:', !!token);

    try {
        const headers = getApiHeaders(true);
        console.log('📤 Auth headers:', headers);

        const response = await fetch(`${apiUrl}/api/users/checkLogin`, {
            method: 'GET',
            headers
        });

        console.log('Response status:', response.status);
        const data: User = await response.json();
        console.log('Response data:', data);

        if (!data.success) {
            console.log('Login check failed');
            errorCallBack();
        } else {
            console.log('Login check successful');
            setUser(data);
        }
    } catch (error) {
        console.error('Error:', error);
        errorCallBack();
    }
} 