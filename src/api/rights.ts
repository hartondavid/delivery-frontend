import { getToken, getApiHeaders } from "../utils/utilFunctions";

interface UserRight {
    right_code: string;
    [key: string]: any;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: UserRight[];
}

export const apiGetUserRights = async (
    setUserRights: (rights: UserRight[]) => void
): Promise<void> => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();

    console.log('🔍 Getting user rights...');
    console.log('🔑 Token exists:', !!token);
    console.log('🔑 Token preview:', token ? token.substring(0, 50) + '...' : 'None');
    console.log('🔑 Token length:', token ? token.length : 0);

    try {
        const headers = getApiHeaders(true);
        console.log('📤 Request headers:', headers);

        const response = await fetch(`${apiUrl}/api/rights/getUserRights`, {
            method: 'GET',
            headers
        });

        console.log('📡 Response status:', response.status);
        const data: ApiResponse = await response.json();
        console.log('📦 Response data:', data);

        if (!data.success) {
            console.log('❌ User rights failed:', data);
        } else {
            console.log('✅ User rights successful');
            setUserRights(data.data || []);
        }
    } catch (error) {
        console.error('❌ User rights error:', error);
    }
} 