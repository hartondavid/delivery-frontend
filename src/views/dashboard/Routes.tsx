import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, List,
    CircularProgress, Typography, ListItem, IconButton, ListItemText, Box
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { apiSearchCourier, apiDeleteCourier } from "../../api/user";
import { apiGetCouriersByAdminId, apiGetCouriersByRouteId, apiGetRoutesByCourierId, apiDeleteRoute } from "../../api/routes";
import { apiAddCourierToRoute } from "../../api/user";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import { addStyleToTextField } from "../../utils/utilFunctions";

interface UserRight {
    right_code: string;
    [key: string]: any;
}

interface RoutesProps {
    userRights: UserRight[];
}

const columns = [
    { field: 'id', headerName: 'Nr.', type: 'string' },
    { field: 'area', headerName: 'Zona', type: 'string' },
    {
        field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }: { value: string }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },
];

const Routes: React.FC<RoutesProps> = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [actions, setActions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [routeId, setRouteId] = useState<string | number | null>(null);
    const [openAddCourierDialog, setOpenAddCourierDialog] = useState<boolean>(false);
    const rightCode = userRights[0]?.right_code;
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [routeToDelete, setRouteToDelete] = useState<string | number | null>(null);
    useEffect(() => {
        if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
            apiGetCouriersByAdminId((response: any) => {
                setData(response.data)
            }, showErrorToast);
        } else if (Number(rightCode) === RIGHTS_MAPPING.COURIER) {
            apiGetRoutesByCourierId((response: any) => {
                setData(response.data)
            }, showErrorToast);
        }
    }, [data.length, rightCode]);
    useEffect(() => {
        let actionsTmp: any[] = [];
        actionsTmp = [
            { icon: (<GroupAddIcon />), color: 'black', onClick: (id: string | number) => handleFetchCouriers(id) },
            { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },
        ];
        setActions(actionsTmp);
    }, []);
    const [selectedCouriers, setSelectedCouriers] = useState<any[]>([]);
    const handleFetchCouriers = (id: string | number) => {
        setRouteId(id);
        setSelectedCouriers([]);
        apiGetCouriersByRouteId((response: any) => {
            setSelectedCouriers(response.data);
        }, showErrorToast, id);
        setOpenAddCourierDialog(true)
    };
    //Function to fetch employees based on search term
    const fetchCourierSearchResults = async (search: string) => {
        setLoading(true);
        try {
            await apiSearchCourier((couriers: any[]) => {
                setSearchResults(couriers);
            }, showErrorToast, search);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };
    // Function to handle search input change with debounce
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        // Clear previous timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        // Set a new timeout to wait before making the API request
        setDebounceTimeout(setTimeout(() => {
            if (value.trim()) {
                fetchCourierSearchResults(value);
            } else {
                setSearchResults([]);
            }
        }, 500));
    }
    const handleAddCourier = (courier: any) => {
        setSelectedCouriers((prevCouriers) => {
            if (prevCouriers.some((o: any) => o.id === courier.id)) {
                showErrorToast("Curierul este deja selectat!");
                return prevCouriers;
            }
            return [...prevCouriers, courier];
        });
        setData((prevData) =>
            prevData.map((route) => {
                const targetRouteId = courier.route_id || routeId;
                if (route.id === targetRouteId) {
                    if (route.couriers && route.couriers.some((o: any) => o.id === courier.id)) {
                        return route;
                    }
                    return {
                        ...route,
                        couriers: [...(route.couriers || []), { ...courier, route_id: targetRouteId }]
                    };
                }
                return route;
            })
        );
        if (routeId !== null) {
            apiAddCourierToRoute((response: any) => {
                showSuccessToast(response.message);
            }, showErrorToast, routeId, courier.id);
        }
        setSearchResults([]);
        setSearchTerm('');
    };
    const handleDeleteSuccess = (deletedCourierId: string | number, response: any) => {
        setSelectedCouriers((prevCouriers) =>
            prevCouriers.filter((courier) => courier.id !== deletedCourierId)
        );
        setData((prevData) =>
            prevData.map((route) => ({
                ...route,
                couriers: route.couriers
                    ? route.couriers.filter((courier: any) => courier.id !== deletedCourierId)
                    : []
            }))
        );
        showSuccessToast(response.message);
    };
    const handleCloseAddCourierDialog = () => {
        setOpenAddCourierDialog(false);
        setSearchTerm('');
        setSearchResults([]);
    };
    const childrenData = data.reduce((acc: Record<string | number, any[]>, route) => {
        const routeId = route.id;
        if (!acc[routeId]) {
            acc[routeId] = [];
        }
        if (route.couriers && Array.isArray(route.couriers)) {
            acc[routeId].push(
                ...route.couriers.map((courier: any, idx: number) => ({
                    id: courier.id || `${routeId}-${idx}`,
                    name: courier.name,
                    email: courier.email,
                    phone: courier.phone,
                }))
            );
        }
        return acc;
    }, {});
    const handleOpenDialog = (routeId: string | number) => {
        setRouteToDelete(routeId);
        setOpenDialog(true);
    };
    const handleDeleteOrderRequest = () => {
        if (routeToDelete !== null) {
            apiDeleteRoute((response: any) => {
                showSuccessToast(response.message);
                const updatedData = data.filter((route) => String(route.id) !== String(routeToDelete));
                setData(updatedData);
                setOpenDialog(false);
            }, showErrorToast, routeToDelete);
        }
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    return (
        <>
            <GenericTable
                title={"Rute"}
                columns={columns}
                data={data}
                buttonText={Number(rightCode) === RIGHTS_MAPPING.ADMIN ? "Adauga ruta" : undefined}
                buttonAction={() => {
                    if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
                        navigate('/dashboard/addRoute');
                    }
                }}
                edit={true}
                onEdit={(id: string | number) => {
                    // Handle edit route
                }}
                actions={actions}
                childrenColumns={[
                    { field: 'id', headerName: 'ID', type: 'string' },
                    { field: 'name', headerName: 'Nume', type: 'string' },
                    { field: 'email', headerName: 'Email', type: 'string' },
                    { field: 'phone', headerName: 'Telefon', type: 'string' },
                ]}
                childrenData={childrenData}
            />
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi ruta?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#009688', color: 'white' }}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeleteOrderRequest} sx={{ backgroundColor: 'red', color: 'white' }}>
                        Sterge
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Routes; 