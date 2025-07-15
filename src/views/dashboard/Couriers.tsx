import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import GenericTable from "../../components/GenericTable";
import { apiGetAllCouriersByAdminId, apiDeleteCourier } from "../../api/user";
import dayjs from "dayjs";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface Courier {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    [key: string]: any;
}

interface UserRight {
    right_code: string;
    [key: string]: any;
}

interface CouriersProps {
    userRights: UserRight[];
}

const columns = [
    { field: 'id', headerName: 'ID', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'email', headerName: 'Email', type: 'string' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    {
        field: 'created_at',
        headerName: 'Data',
        type: 'date',
        renderCell: ({ value }: { value: string }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },
];

const Couriers: React.FC<CouriersProps> = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<Courier[]>([]);
    const rightCode = userRights[0]?.right_code;

    const [actions, setActions] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<string | number | null>(null);

    useEffect(() => {
        if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
            apiGetAllCouriersByAdminId(
                (response: any) => {
                    if (response.data) {
                        setData(response.data);
                    }
                },
                showErrorToast
            );

            const actionsTmp = [
                { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },
            ];

            setActions(actionsTmp);
        }
    }, [data.length, rightCode]);

    // Function to open the delete confirmation dialog
    const handleOpenDialog = (userId: string | number): void => {
        setUserToDelete(userId); // Store the seminar ID to be deleted
        setOpenDialog(true); // Open the dialog
    };

    const handleDeleteUserRequest = (): void => {
        if (userToDelete) {
            apiDeleteCourier((response: any) => {
                showSuccessToast(response.message);
                const updatedData = data.filter((user) => user.id !== userToDelete);
                setData(updatedData);
                setOpenDialog(false);
            }, showErrorToast, userToDelete);
        }
    };

    const handleCloseDialog = (): void => {
        setOpenDialog(false);
    };

    return (
        <>
            <GenericTable
                title={"Curieri"}
                columns={columns}
                data={data}
                buttonText={Number(rightCode) === RIGHTS_MAPPING.ADMIN ? "Adauga curier" : undefined}
                buttonAction={() => navigate("/dashboard/addCourier")}
                actions={actions}
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    {`Esti sigur ca vrei sa stergi curierul ${data.find((user) => user.id === userToDelete)?.name}?`}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#009688', color: 'white' }}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeleteUserRequest} sx={{ backgroundColor: 'red', color: 'white' }}>
                        Sterge
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Couriers; 