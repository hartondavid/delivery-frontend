import { toast } from "react-toastify";
import { menus } from "./menus";

export const NEEDS_UPDATE_STRING = 'needs_update';

export const storeToken = (token: string): void => {
    localStorage.setItem('token', token);
}

export const removeToken = (): void => {
    localStorage.removeItem('token');
}

export const getToken = (): string | null => {
    return localStorage.getItem('token');
}

export const showErrorToast = (message: string): void => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

export const showSuccessToast = (message: string): void => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

interface UserRight {
    right_code: string;
}

interface Menu {
    rights?: string[];
}

export const shouldShowMenu = (userRights: UserRight[], menu: Menu): boolean => {
    let shouldShow = true;

    //    console.log('userRights', userRights);
    if (userRights.length > 0) {
        const right_code = userRights[0].right_code

        if (menu.rights && menu.rights.length !== 0 && !menu.rights.includes(right_code)) {
            shouldShow = false;
        }
    }

    return shouldShow;
}

export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export const addStyleToTextField = (hasValue: string | boolean): Record<string, any> => {
    return {
        '& .MuiInputLabel-root': {

            '&.Mui-focused': {
                color: '#009688'
            },
            '&.MuiInputLabel-shrink': {
                color: '#009688'
            },

        },
        '& .MuiInputBase-input': {
            color: 'black'
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: ' #009688',
            },
            '&:hover fieldset': {
                borderColor: '#009688'
            }

        },
        ...(hasValue && {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#009688',
            },
            '& .MuiInputLabel-root': {
                color: '#009688',
            },
        }),
    }
} 