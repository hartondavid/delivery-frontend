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
import { apiGetCouriersByAdminId, apiGetCouriersByRouteId, apiGetRoutesByCourierId } from "../../api/routes";
import { apiAddCourierToRoute } from "../../api/user";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';


const columns = [
    { field: 'id', headerName: 'Nr.', type: 'string' },
    { field: 'area', headerName: 'Zona', type: 'string' },
    { field: 'created_at', headerName: 'Data', type: 'date' },

];
const Routes = ({ user, userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [actions, setActions] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const [routeId, setRouteId] = useState(null);

    const [openAddCourierDialog, setOpenAddCourierDialog] = useState(false);
    console.log("user", user);
    const userId = user?.data?.id
    const rightCode = userRights[0]?.right_code;

    useEffect(() => {
        if (rightCode === RIGHTS_MAPPING.ADMIN) {
            apiGetCouriersByAdminId((response) => {
                setData(response.data)
            }, showErrorToast);
        } else if (rightCode === RIGHTS_MAPPING.COURIER) {
            apiGetRoutesByCourierId((response) => {
                setData(response.data)
            }, showErrorToast);
        }


    }, [data.length, rightCode]);


    useEffect(() => {
        let actionsTmp = [];

        actionsTmp = [
            { icon: (<GroupAddIcon />), color: 'black', onClick: (id) => handleFetchCouriers(id) },


        ];

        setActions(actionsTmp);
    }, []);

    const [selectedCouriers, setSelectedCouriers] = useState([]);

    const handleFetchCouriers = (id) => {
        setRouteId(id);
        setSelectedCouriers([]);

        apiGetCouriersByRouteId((response) => {
            setSelectedCouriers(response.data);
            console.log("selectedCouriers", selectedCouriers);
        }, showErrorToast, id);

        setOpenAddCourierDialog(true)
    };

    //Function to fetch employees based on search term
    const fetchCourierSearchResults = async (search) => {
        setLoading(true);
        try {
            await apiSearchCourier((couriers) => {
                setSearchResults(couriers);
            }, showErrorToast, search);

        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };
    // Function to handle search input change with debounce
    const handleSearchChange = (event) => {
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


    const handleAddCourier = (courier) => {
        setSelectedCouriers((prevCouriers) => {
            // Check if the order is already in the list
            if (prevCouriers.some((o) => o.id === courier.id)) {
                showErrorToast("Curierul este deja selectat!");
                return prevCouriers;
            }
            return [...prevCouriers, courier];
        });
        setData((prevData) =>
            prevData.map((route) => {
                // Use the deliveryId from state if order.delivery_id is not set
                const targetRouteId = courier.route_id || routeId;
                if (route.id === targetRouteId) {
                    // Avoid duplicate orders
                    if (route.couriers && route.couriers.some((o) => o.id === courier.id)) {
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
        apiAddCourierToRoute((response) => {
            showSuccessToast(response.message);
        }, showErrorToast, routeId, courier.id);



        setSearchResults([]);
        setSearchTerm('');
    };
    // Function to handle successful deletion
    const handleDeleteSuccess = (deletedCourierId, response) => {
        // Remove the employee from the selectedEmployees list
        setSelectedCouriers((prevCouriers) =>
            prevCouriers.filter((courier) => courier.id !== deletedCourierId)
        );

        setData((prevData) =>
            prevData.map((route) => ({
                ...route,
                couriers: route.couriers
                    ? route.couriers.filter((courier) => courier.id !== deletedCourierId)
                    : []
            }))
        );
        showSuccessToast(response.message);
    };
    // Close the add employee dialog
    const handleCloseAddCourierDialog = () => {
        setOpenAddCourierDialog(false);
        setSearchTerm('');
        setSearchResults([]);
    };


    const childrenData = data.reduce((acc, route) => {
        const routeId = route.id;

        if (!acc[routeId]) {
            acc[routeId] = [];
        }
        if (route.couriers && Array.isArray(route.couriers)) {
            acc[routeId].push(
                ...route.couriers.map((courier, idx) => ({
                    id: courier.id || `${routeId}-${idx}`,
                    name: courier.name,
                    email: courier.email,
                    phone: courier.phone,

                }))
            );

        }
        return acc;
    }, {});



    const childrenColumns = [
        { field: 'name', headerName: <><PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Nume</> },
        { field: 'email', headerName: <><EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Email</> },
        { field: 'phone', headerName: <><LocalPhoneIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Telefon</> },

    ];



    const handleAssignCourierToRoute = () => {
        console.log("selectedCouriers", selectedCouriers);
        setOpenAddCourierDialog(false);
        apiGetCouriersByAdminId((response) => {
            setData(response.data)
        }, showErrorToast);

    }


    return (
        <>
            <GenericTable
                actions={rightCode === RIGHTS_MAPPING.ADMIN && actions}
                title={"Rute"}
                buttonText={rightCode === RIGHTS_MAPPING.ADMIN && "Adauga Ruta"}
                buttonAction={() => {
                    if (rightCode === RIGHTS_MAPPING.ADMIN) {
                        navigate('/dashboard/AddRoute')
                    }
                }}
                columns={columns}
                data={data}
                childrenColumns={rightCode === RIGHTS_MAPPING.ADMIN && childrenColumns}
                childrenData={rightCode === RIGHTS_MAPPING.ADMIN && childrenData}
                isExtendedTable={rightCode === RIGHTS_MAPPING.ADMIN}
            />

            {/* Add Employee Dialog */}
            <Dialog open={openAddCourierDialog} onClose={handleCloseAddCourierDialog} fullWidth maxWidth="sm">
                <DialogTitle>Adauga curieri la ruta</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Cauta curieri"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mt: 2 }}
                    />

                    {loading ? <CircularProgress /> : (
                        <List>
                            {searchResults.map((courier) => (
                                <ListItem
                                    button
                                    key={courier.id}
                                    onClick={() => handleAddCourier(courier)}
                                >
                                    <PersonIcon sx={{ mr: 1 }} />
                                    {courier.name}
                                    <EmailIcon sx={{ mr: 1, ml: 1 }} />
                                    {courier.email}
                                    <LocalPhoneIcon sx={{ mr: 1, ml: 1 }} />
                                    {courier.phone}
                                    <PersonAddIcon sx={{ color: 'green', ml: 1 }} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <Typography variant="h6" sx={{ marginTop: 2 }}>Curieri selectati:</Typography>
                    <List>
                        {selectedCouriers.map((courier) => (
                            <ListItem
                                key={courier.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => apiDeleteCourier(
                                        (response) => handleDeleteSuccess(courier.id, response),
                                        showErrorToast,
                                        courier.id,
                                    )} style={{ color: 'red' }}>
                                        <PersonRemoveIcon />
                                    </IconButton>
                                }
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    <ListItemText primary={courier.name} />
                                    <EmailIcon sx={{ mr: 1, ml: 1 }} />
                                    <ListItemText primary={courier.email} />
                                    <LocalPhoneIcon sx={{ mr: 1, ml: 1 }} />
                                    <ListItemText primary={courier.phone} />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained"
                        onClick={handleAssignCourierToRoute}
                        color="success"
                    >
                        Finalizeaza
                    </Button>

                </DialogActions>
            </Dialog>

        </>
    );
};
export default Routes;