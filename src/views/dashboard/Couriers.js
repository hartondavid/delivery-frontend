import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import GenericTable from "../../components/GenericTable";
import { apiGetAllCouriersByAdminId, apiDeleteCourier } from "../../api/user";
import dayjs from "dayjs";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const columns = [
    { field: 'id', headerName: 'ID', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'email', headerName: 'Email', type: 'string' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    {
        field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },

];

const Couriers = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const rightCode = userRights[0]?.right_code;


    const [actions, setActions] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {

        if (rightCode === RIGHTS_MAPPING.ADMIN) {
            apiGetAllCouriersByAdminId(
                (response) => {
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
    const handleOpenDialog = (userId) => {
        setUserToDelete(userId); // Store the seminar ID to be deleted
        setOpenDialog(true); // Open the dialog
    };


    const handleDeleteUserRequest = () => {
        apiDeleteCourier((response) => {
            showSuccessToast(response.message);
            const updatedData = data.filter((user) => user.id !== userToDelete);
            setData(updatedData);
            setOpenDialog(false);

        }, showErrorToast, userToDelete);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    return (
        <>
            <GenericTable
                title={"Curieri"}
                columns={columns}
                data={data}
                buttonText={rightCode === RIGHTS_MAPPING.ADMIN && "Adauga curier"}
                buttonAction={() => navigate("/dashboard/addCourier")}
                actions={actions}
            >

            </GenericTable>

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