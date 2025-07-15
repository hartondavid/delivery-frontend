import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetOrdersByAdminId, apiGetOrdersByCourierId, apiDeleteOrder } from "../../api/orders";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import GenericTable from "../../components/GenericTable";
import dayjs from "dayjs";
import { Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface Order {
    id: string | number;
    recipient: string;
    phone: string;
    address: string;
    status: string;
    created_at: string;
    [key: string]: any;
}

interface UserRight {
    right_code: string;
    [key: string]: any;
}

interface OrdersProps {
    userRights: UserRight[];
}

const colorMap: Record<string, string> = {
    pending: 'orange',
    delivered: 'green',
    cancelled: 'red',
    issue: 'red'
};

const columns = [
    { field: 'id', headerName: 'Nr.', type: 'string' },
    { field: 'recipient', headerName: 'Destinatar', type: 'string' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    { field: 'address', headerName: 'Adresa', type: 'string' },
    {
        field: 'status',
        headerName: 'Status',
        type: 'string',
        renderCell: ({ value }: { value: string }) => {
            const statusMap: Record<string, string> = {
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
                        // Handle click if needed
                    }}
                />
            );
        }
    },
    {
        field: 'created_at',
        headerName: 'Data',
        type: 'date',
        renderCell: ({ value }: { value: string }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },
];

const Orders: React.FC<OrdersProps> = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<Order[]>([]);

    const rightCode = userRights[0]?.right_code;
    const [actions, setActions] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [orderToDelete, setOrderToDelete] = useState<string | number | null>(null);

    useEffect(() => {
        if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
            apiGetOrdersByAdminId(
                (response: any) => {
                    if (response.data) {
                        setData(response.data);
                    }
                },
                showErrorToast
            );

            let actionsTmp: any[] = [];
            if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
                actionsTmp = [
                    { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },
                ];
            }
            setActions(actionsTmp);
        } else if (Number(rightCode) === RIGHTS_MAPPING.COURIER) {
            apiGetOrdersByCourierId(
                (response: any) => {
                    setData(response.data);
                },
                showErrorToast
            );
        }
    }, [data.length, rightCode]);

    // Function to open the delete confirmation dialog
    const handleOpenDialog = (orderId: string | number): void => {
        setOrderToDelete(orderId); // Store the seminar ID to be deleted
        setOpenDialog(true); // Open the dialog
    };

    const handleDeleteOrderRequest = (): void => {
        if (orderToDelete) {
            apiDeleteOrder((response: any) => {
                showSuccessToast(response.message);
                const updatedData = data.filter((order) => order.id !== orderToDelete);
                setData(updatedData);
                setOpenDialog(false);
            }, showErrorToast, orderToDelete);
        }
    };

    const handleCloseDialog = (): void => {
        setOpenDialog(false);
    };

    return (
        <>
            <GenericTable
                title={"Comenzi"}
                columns={columns}
                data={data}
                buttonText={Number(rightCode) === RIGHTS_MAPPING.ADMIN ? "Adauga comanda" : undefined}
                buttonAction={() => {
                    if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
                        navigate('/dashboard/addEditOrder/0');
                    }
                }}
                edit={true}
                onEdit={(id: string | number) => {
                    navigate(`/dashboard/addEditOrder/${id}`);
                }}
                actions={actions}
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi comanda?
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

export default Orders; 