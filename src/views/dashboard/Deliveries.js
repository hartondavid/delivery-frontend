import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    apiGetDeliveriesByAdminId, apiAddOrdersToDelivery,
    apiAssignCourierToDelivery, apiAddDelivery, apiGetDeliveriesByCourierId, apiDeleteDelivery
} from "../../api/deliveries"
import GenericTable from "../../components/GenericTable";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, List,
    CircularProgress, Typography, ListItem, IconButton, ListItemText, Box
} from '@mui/material';
import { apiDeleteOrder, apiSearchOrder, } from "../../api/orders";
import TocIcon from '@mui/icons-material/Toc';
import { apiGetCouriers } from "../../api/user";
import { apiGetOrdersByDeliveryId } from "../../api/orders";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import dayjs from "dayjs";
import { Chip } from "@mui/material";
import { addStyleToTextField } from "../../utils/utilFunctions";
const colorMap = {
    pending: 'orange',
    delivered: 'green',
    cancelled: 'red',
    issue: 'red'
};


const Deliveries = ({ user, userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [actions, setActions] = useState([]);
    const [openAddEmployeeDialog, setOpenAddEmployeeDialog] = useState(false); // New state for employee dialog
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [loading, setLoading] = useState(false);
    const [deliveryId, setDeliveryId] = useState(null);

    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const [openAssignCourierDialog, setOpenAssignCourierDialog] = useState(false);
    const [courierSearchTerm, setCourierSearchTerm] = useState('');
    const [courierSearchResults, setCourierSearchResults] = useState([]);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [courierLoading, setCourierLoading] = useState(false);
    const [courierDebounceTimeout, setCourierDebounceTimeout] = useState(null);
 
    const userId = user?.data?.id

    const rightCode = userRights[0]?.right_code;

    const [openDialog, setOpenDialog] = useState(false);
    const [deliveryToDelete, setDeliveryToDelete] = useState(null);

    const [columns, setColumns] = useState([]);

    useEffect(() => {
        setColumns([
            { field: 'id', headerName: 'Nr.', type: 'string' },
            {
                field: 'courier_name', headerName: 'Nume curier', type: 'string',

                renderCell: (params) => (

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {params.row.courier_name}
                        <HowToRegIcon sx={{ mr: 1, ml: 1, color: 'green' }} />

                    </Box>

                )
            },

            {
                field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
                    return dayjs(value).format('DD.MM.YYYY');
                }
            },

        ]);


    }, [selectedCourier])

    useEffect(() => {
        if (rightCode === RIGHTS_MAPPING.ADMIN) {

            apiGetDeliveriesByAdminId((response) => {

                setData(response.data)

            }, showErrorToast);


            let actionsTmp = [];

            actionsTmp = [
                { icon: (<TocIcon />), color: 'black', onClick: (id) => handleFetchOrders(id) },
                { icon: (<AccountCircleIcon />), color: 'black', onClick: (id) => openAssignCourierToOrdersDialog(id) },
                { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },
            ];

            setActions(actionsTmp);
        } else if (rightCode === RIGHTS_MAPPING.COURIER) {
            apiGetDeliveriesByCourierId((response) => {
                setData(response.data)
            }, showErrorToast);
        }


    }, [data.length, rightCode]);


    const [selectedOrders, setSelectedOrders] = useState([]);

    const handleFetchOrders = (id) => {
        setDeliveryId(id);
        setSelectedOrders([]);

        apiGetOrdersByDeliveryId((response) => {
            setSelectedOrders(response.data);
        }, showErrorToast, id);

        setOpenAddEmployeeDialog(true)
    };

    //Function to fetch employees based on search term
    const fetchOrderSearchResults = async (search) => {
        setLoading(true);
        try {
            await apiSearchOrder((orders) => {
                setSearchResults(orders);
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
                fetchOrderSearchResults(value);
            } else {
                setSearchResults([]);
            }
        }, 500));
    }


    const handleAddOrder = (order) => {
        setSelectedOrders((prevOrders) => {
            // Check if the order is already in the list
            if (prevOrders.some((o) => o.id === order.id)) {
                showErrorToast("Comanda este deja selectată!");
                return prevOrders;
            }
            return [...prevOrders, order];
        });
        setData((prevData) =>
            prevData.map((delivery) => {
                // Use the deliveryId from state if order.delivery_id is not set
                const targetDeliveryId = order.delivery_id || deliveryId;
                if (delivery.id === targetDeliveryId) {
                    // Avoid duplicate orders
                    if (delivery.orders && delivery.orders.some((o) => o.id === order.id)) {
                        return delivery;
                    }
                    return {
                        ...delivery,
                        orders: [...(delivery.orders || []), { ...order, delivery_id: targetDeliveryId }]
                    };
                }
                return delivery;
            })
        );



        setSearchResults([]);
        setSearchTerm('');
    };
    // Function to handle successful deletion
    const handleDeleteSuccess = (deletedOrderId, response) => {
        // Remove the employee from the selectedEmployees list
        setSelectedOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== deletedOrderId)
        );

        setData((prevData) =>
            prevData.map((delivery) => ({
                ...delivery,
                orders: delivery.orders
                    ? delivery.orders.filter((order) => order.id !== deletedOrderId)
                    : []
            }))
        );
        showSuccessToast(response.message);
    };
    // Close the add employee dialog
    const handleCloseAddEmployeeDialog = () => {
        setOpenAddEmployeeDialog(false);
        setSearchTerm('');
        setSearchResults([]);
    };


    const childrenData = data.reduce((acc, delivery) => {
        const deliveryId = delivery.id;

        if (!acc[deliveryId]) {
            acc[deliveryId] = [];
        }
        if (delivery.orders && Array.isArray(delivery.orders)) {
            acc[deliveryId].push(
                ...delivery.orders.map((order, idx) => ({
                    id: order.id || `${deliveryId}-${idx}`,
                    recipient: order.recipient,
                    phone: order.phone,
                    address: order.address,
                    status: order.status,


                }))
            );

        }
        return acc;
    }, {});



    const childrenColumns = [
        {
            field: 'recipient',
            headerName: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Destinatar
                </Box>
            )
        },
        {
            field: 'phone',
            headerName: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalPhoneIcon sx={{ mr: 1 }} />
                    Telefon
                </Box>
            )
        },
        {
            field: 'address',
            headerName: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon sx={{ mr: 1 }} />
                    Adresa
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: ({ value }) => {
                const statusMap = {
                    pending: 'In asteptare',
                    delivered: 'Livrata',
                    cancelled: 'Anulata',
                    issue: 'Problema'
                };



                const statusLabel = statusMap[value] || value;
                const color = colorMap[value] || 'default';

                return (
                    <Chip
                        label={statusLabel}
                        variant="outlined"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: color,
                            borderColor: color,
                            "& .MuiChip-deleteIcon": {
                                color: "transparent",
                                transition: "color 0.2s ease-in-out",
                            },
                            "& .MuiChip-deleteIcon:hover": {
                                color: color,
                            },

                        }}
                        onClick={() => {

                        }}
                    />
                );
            }
        },



    ];


    const openAssignCourierToOrdersDialog = (id) => {
        setOpenAssignCourierDialog(true);
        setCourierSearchTerm('');
        setCourierSearchResults([]);
        setSelectedCourier(null);
        setDeliveryId(id);

    };


    const closeAssignCourierDialog = () => {
        setOpenAssignCourierDialog(false);


        apiAssignCourierToDelivery((response) => {
            showSuccessToast(response.message)
        }, showErrorToast, deliveryId, selectedCourier?.id)


        apiGetDeliveriesByAdminId((response) => {

            setData(response.data)

        }, showErrorToast);

    };

    const handleCourierSearchChange = (event) => {
        const value = event.target.value;
        setCourierSearchTerm(value);
        if (courierDebounceTimeout) {
            clearTimeout(courierDebounceTimeout);
        }
        setCourierDebounceTimeout(setTimeout(() => {
            if (value.trim()) {
                setCourierLoading(true);
                apiGetCouriers(
                    (data) => {
                        setCourierSearchResults(data.data.filter(courier =>
                            courier.name.toLowerCase().includes(value.toLowerCase())
                        ));
                        setCourierLoading(false);
                    },
                    showErrorToast
                );
            } else {
                setCourierSearchResults([]);
            }
        }, 400));
    };

    const handleSelectCourier = (courier) => {
        setSelectedCourier(courier);
        setCourierSearchResults([]);
        setCourierSearchTerm('');

    };

    const handleAssignOrdersToDelivery = () => {


        const orderIds = selectedOrders.map(order => order.id);


        apiAddOrdersToDelivery(
            (response) => {
                showSuccessToast(response.message)
                const newOrders = selectedOrders.filter(order =>
                    !data.find(delivery =>
                        delivery.id === deliveryId &&
                        delivery.orders &&
                        delivery.orders.some(o => o.id === order.id)
                    )
                );
                setData(prevData =>
                    prevData.map(delivery => {
                        if (delivery.id === deliveryId) {
                            return {
                                ...delivery,
                                orders: [...(delivery.orders || []), ...newOrders]
                            };
                        }
                        return delivery;
                    })
                );

            },

            showErrorToast,
            deliveryId,
            orderIds
        );
        setOpenAddEmployeeDialog(false);


    };

    // Function to open the delete confirmation dialog
    const handleOpenDialog = (deliveryId) => {
        setDeliveryToDelete(deliveryId); // Store the seminar ID to be deleted
        setOpenDialog(true); // Open the dialog
    };


    const handleDeleteDeliveryRequest = () => {
        apiDeleteDelivery((response) => {
            showSuccessToast(response.message);
            const updatedData = data.filter((delivery) => delivery.id !== deliveryToDelete);
            setData(updatedData);
            setOpenDialog(false);

        }, showErrorToast, deliveryToDelete);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <GenericTable
                actions={rightCode === RIGHTS_MAPPING.ADMIN && actions}
                title={"Livrari"}
                buttonText={rightCode === RIGHTS_MAPPING.ADMIN && "Adauga Livrare"}
                buttonAction={() => {
                    apiAddDelivery(
                        (response) => {
                            if (rightCode === RIGHTS_MAPPING.ADMIN) {
                                showSuccessToast(response.message)
                                apiGetDeliveriesByAdminId((response) => {

                                    setData(response.data)


                                }, showErrorToast);
                            }
                        }, showErrorToast)


                }}

                columns={columns}
                data={data}
                childrenColumns={childrenColumns}
                childrenData={childrenData}
                isExtendedTable={true}

            />

            {/* Add Employee Dialog */}
            <Dialog open={openAddEmployeeDialog} onClose={handleCloseAddEmployeeDialog} fullWidth maxWidth="md">
                <DialogTitle>Adauga comenzi la livrare</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Cauta comenzi"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ ...addStyleToTextField(searchTerm), mt: 1 }}

                    />

                    {loading ? <CircularProgress /> : (
                        <List>
                            {searchResults.map((order) => (
                                <ListItem
                                    button
                                    key={order.id}
                                    onClick={() => handleAddOrder(order)}

                                >
                                    <PersonIcon sx={{ mr: 1 }} />
                                    {order.recipient} {/* Assuming employee has a `name` property */}
                                    <LocalPhoneIcon sx={{ mr: 1, ml: 1 }} />
                                    {order.phone}
                                    <HomeIcon sx={{ mr: 1, ml: 1 }} />
                                    {order.address}
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <Typography variant="h6" sx={{ marginTop: 2 }}>Comenzi selectate:</Typography>
                    <List>
                        {selectedOrders.map((order) => (
                            <ListItem
                                key={order.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => apiDeleteOrder(
                                        (response) => handleDeleteSuccess(order.id, response),
                                        showErrorToast,
                                        order.id,
                                    )} style={{ color: 'red' }}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon sx={{ mr: 2 }} />
                                    <ListItemText primary={order.recipient} />
                                    <LocalPhoneIcon sx={{ mr: 2, ml: 2 }} />
                                    <ListItemText primary={order.phone} />
                                    <HomeIcon sx={{ mr: 2, ml: 2 }} />
                                    <ListItemText primary={order.address} />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained"
                        onClick={handleAssignOrdersToDelivery}
                        sx={{
                            backgroundColor: ' #009688', color: 'white'
                        }}
                    >
                        Finalizeaza
                    </Button>

                </DialogActions>
            </Dialog>
            <Dialog open={openAssignCourierDialog} onClose={closeAssignCourierDialog} fullWidth maxWidth="sm">
                <DialogTitle>Asigneaza curier la livrare</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Cauta curier"
                        variant="outlined"
                        fullWidth
                        value={courierSearchTerm}
                        onChange={handleCourierSearchChange}
                        sx={{ ...addStyleToTextField(courierSearchTerm), mt: 1 }}
                    />
                    {courierLoading ? <CircularProgress /> : (
                        <List>
                            {courierSearchResults.map((courier) => (
                                <ListItem
                                    button
                                    key={courier.id}
                                    onClick={() => handleSelectCourier(courier)}
                                    selected={selectedCourier && selectedCourier.id === courier.id}
                                >
                                    <PersonIcon sx={{ mr: 1 }} />
                                    {courier.name}
                                    <EmailIcon sx={{ mr: 1, ml: 1 }} />
                                    {courier.email}
                                    <LocalPhoneIcon sx={{ mr: 1, ml: 1 }} />
                                    {courier.phone}

                                </ListItem>
                            ))}
                        </List>
                    )}
                    {selectedCourier && (
                        <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                            <Typography variant="subtitle1">Curier selectat:</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">{selectedCourier.name}</Typography>
                                <EmailIcon sx={{ mr: 1, ml: 1 }} />
                                <Typography variant="body1">{selectedCourier.email}</Typography>
                                <LocalPhoneIcon sx={{ mr: 1, ml: 1 }} />
                                <Typography variant="body1">{selectedCourier.phone}</Typography>
                                <HowToRegIcon sx={{ mr: 1, ml: 1, color: 'green' }} />

                            </Box>

                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAssignCourierDialog} variant="contained" sx={{ backgroundColor: ' #009688', color: 'white' }}>Asigneaza</Button>

                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi livrarea?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#009688', color: 'white' }}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeleteDeliveryRequest} sx={{ backgroundColor: 'red', color: 'white' }}>
                        Sterge
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default Deliveries;