import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Box, Button, Card, CssBaseline } from '@mui/material';
import { ToastContainer } from "react-toastify";
import routes from "./../routes";
import { apiCheckLogin } from "../api/auth";
import { NEEDS_UPDATE_STRING, showErrorToast } from "../utils/utilFunctions";
import { apiGetUserRights } from "../api/rights";
import LoadingBar from "react-top-loading-bar";

interface User {
    data?: {
        name: string;
    };
    [key: string]: any;
}

interface UserRight {
    right_code: string;
    [key: string]: any;
}

interface RouteItem {
    id?: string;
    layout: string;
    path: string;
    component: any;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const [rights, setRights] = useState<any[]>([])
    const [userRights, setUserRights] = useState<UserRight[]>([])

    const [progress, setProgress] = useState<number>(0)

    useEffect(() => {
        apiGetUserRights((userRights: UserRight[]) => {
            if (userRights) {
                setUserRights(userRights)
            }
        })
    }, [])

    useEffect(() => {
        document.body.classList.add("bg-gray-300");
        updateData();
        if (window.innerWidth >= 900) {
            setSidebarOpen(true);
        }

        // Add an event listener for the custom event
        const handleLoadingProgress = (event: CustomEvent) => {
            setProgress(event.detail.progress)
        };

        window.addEventListener('loadingProgress', handleLoadingProgress as EventListener);

        return () => {
            document.body.classList.remove("bg-gray-300");
            window.removeEventListener('loadingProgress', handleLoadingProgress as EventListener);
        };
    }, [])

    const updateData = async (needsUpdate?: string): Promise<void> => {
        if (needsUpdate) {
            if (needsUpdate === NEEDS_UPDATE_STRING) {
                checkLogin()
                apiGetUserRights(setUserRights)
            }
        } else {
            await checkLogin()
            apiGetUserRights(setUserRights)
        }
    }

    const handleMenuClick = (): void => {
        setSidebarOpen(!sidebarOpen);
    };

    const checkLogin = async (): Promise<void> => {
        await apiCheckLogin(navigateToAuth, setUser)
    }

    const navigateToAuth = (): void => {
        navigate('/auth')
    }

    const getRoutes = (routes: RouteItem[]): React.ReactNode[] => {
        return routes.map((prop) => {
            if (prop.layout === "/dashboard") {
                const Component = prop.component;
                return (
                    <Route key={`route_${prop.id}`} path={prop.path} element={
                        <Component
                            user={user}
                            updateData={updateData}
                            rights={rights}
                            userRights={userRights}
                        />
                    } />
                );
            } else {
                return null;
            }
        });
    };

    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <CssBaseline />

                {/* Sidebar */}
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}
                    userRights={userRights}
                />

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.grey',
                        p: 3,
                        ml: 0, // Offset for the sidebar on desktop
                        mt: 8 // Offset for the navbar
                    }}
                >
                    <Navbar user={user || { data: { name: '' } }} onMenuClick={handleMenuClick} />
                    <Box className="pb-6">
                        <Card className="p-3">
                            <Routes>
                                {getRoutes(routes)}
                                <Route path="*" element={<Navigate to="/dashboard/index" replace />} />
                            </Routes>
                        </Card>
                    </Box>
                </Box>
            </Box>

            <ToastContainer
                position="top-right"
                autoClose={5000} // Adjust the duration for which the toast should be visible
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default Dashboard; 