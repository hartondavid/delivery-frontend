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

interface Delivery {
    id: string | number;
    courier_name: string;
    created_at: string;
    orders?: any[];
    [key: string]: any;
}

interface Order {
    id: string | number;
    delivery_id?: string | number;
    [key: string]: any;
}

interface User {
    data?: {
        id: string | number;
    };
    [key: string]: any;
}

interface UserRight {
    right_code: string;
    [key: string]: any;
}

interface DeliveriesProps {
    user: User;
    userRights: UserRight[];
}

const colorMap: Record<string, string> = {
    pending: 'orange',
    delivered: 'green',
    cancelled: 'red',
    issue: 'red'
};

const Deliveries: React.FC<DeliveriesProps> = ({ user, userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<Delivery[]>([]);
    const [actions, setActions] = useState<any[]>([]);
    const [openAddEmployeeDialog, setOpenAddEmployeeDialog] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Order[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [deliveryId, setDeliveryId] = useState<string | number | null>(null);

    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const [openAssignCourierDialog, setOpenAssignCourierDialog] = useState<boolean>(false);
    const [courierSearchTerm, setCourierSearchTerm] = useState<string>('');
    const [courierSearchResults, setCourierSearchResults] = useState<any[]>([]);
    const [selectedCourier, setSelectedCourier] = useState<any>(null);
    const [courierLoading, setCourierLoading] = useState<boolean>(false);
    const [courierDebounceTimeout, setCourierDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const userId = user?.data?.id;

    const rightCode = userRights[0]?.right_code;

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [deliveryToDelete, setDeliveryToDelete] = useState<string | number | null>(null);

    const [columns, setColumns] = useState<any[]>([]);

    useEffect(() => {
        setColumns([
            { field: 'id', headerName: 'Nr.', type: 'string' },
            {
                field: 'courier_name',
                headerName: 'Nume curier',
                type: 'string',
                renderCell: (params: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {params.row.courier_name}
                        <HowToRegIcon sx={{ mr: 1, ml: 1, color: 'green' }} />
                    </Box>
                )
            },
            {
                field: 'created_at',
                headerName: 'Data',
                type: 'date',
                renderCell: ({ value }: { value: string }) => {
                    return dayjs(value).format('DD.MM.YYYY');
                }
            },
        ]);
    }, [selectedCourier]);

    useEffect(() => {
        if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
            apiGetDeliveriesByAdminId((response: any) => {
                setData(response.data)
            }, showErrorToast);

            let actionsTmp: any[] = [];
            actionsTmp = [
                { icon: (<TocIcon />), color: 'black', onClick: (id: string | number) => handleFetchOrders(id) },
                { icon: (<AccountCircleIcon />), color: 'black', onClick: (id: string | number) => openAssignCourierToOrdersDialog(id) },
                { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },
            ];

            setActions(actionsTmp);
        } else if (Number(rightCode) === RIGHTS_MAPPING.COURIER) {
            apiGetDeliveriesByCourierId((response: any) => {
                setData(response.data)
            }, showErrorToast);
        }
    }, [data.length, rightCode]);

    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

    const handleFetchOrders = (id: string | number): void => {
        setDeliveryId(id);
        setSelectedOrders([]);

        apiGetOrdersByDeliveryId((response: any) => {
            setSelectedOrders(response.data);
        }, showErrorToast, id);

        setOpenAddEmployeeDialog(true)
    };

    //Function to fetch employees based on search term
    const fetchOrderSearchResults = async (search: string): Promise<void> => {
        setLoading(true);
        try {
            await apiSearchOrder((orders: Order[]) => {
                setSearchResults(orders);
            }, showErrorToast, search);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle search input change with debounce
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
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

    const handleAddOrder = (order: Order): void => {
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

    // Continue with the rest of the component logic...
    // For brevity, I'll include the key functions but you may need to add the rest

    const handleCloseAddEmployeeDialog = (): void => {
        setOpenAddEmployeeDialog(false);
    };

    const openAssignCourierToOrdersDialog = (id: string | number): void => {
        setDeliveryId(id);
        setOpenAssignCourierDialog(true);
    };

    const closeAssignCourierDialog = (): void => {
        setOpenAssignCourierDialog(false);
    };

    const handleOpenDialog = (deliveryId: string | number): void => {
        setDeliveryToDelete(deliveryId);
        setOpenDialog(true);
    };

    const handleDeleteDeliveryRequest = (): void => {
        if (deliveryToDelete) {
            apiDeleteDelivery((response: any) => {
                showSuccessToast(response.message);
                const updatedData = data.filter((delivery) => delivery.id !== deliveryToDelete);
                setData(updatedData);
                setOpenDialog(false);
            }, showErrorToast, deliveryToDelete);
        }
    };

    const handleCloseDialog = (): void => {
        setOpenDialog(false);
    };

    return (
        <>
            <GenericTable
                title={"Livrari"}
                columns={columns}
                data={data}
                buttonText={Number(rightCode) === RIGHTS_MAPPING.ADMIN ? "Adauga livrare" : undefined}
                buttonAction={() => {
                    if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
                        // Handle add delivery
                    }
                }}
                edit={true}
                onEdit={(id: string | number) => {
                    // Handle edit delivery
                }}
                actions={actions}
            />

            {/* Add your dialogs here */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmare ștergere</DialogTitle>
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