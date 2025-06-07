import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetIssuesByAdminId, apiGetIssuesByCourierId, apiDeleteIssue } from "../../api/issues";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import GenericTable from "../../components/GenericTable";
import dayjs from "dayjs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const columns = [
    { field: 'id', headerName: 'Nr.', type: 'string' },
    { field: 'description', headerName: 'Descriere', type: 'string' },
    { field: 'delivery_id', headerName: 'Nr. livrare', type: 'string' },
    { field: 'courier_name', headerName: 'Nume curier', type: 'string' },
    { field: 'courier_phone', headerName: 'Telefon', type: 'string' },
    {
        field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },

];

const Issues = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const rightCode = userRights[0]?.right_code;


    const [actions, setActions] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [issueToDelete, setIssueToDelete] = useState(null);

    useEffect(() => {
        if (rightCode === RIGHTS_MAPPING.ADMIN) {
            apiGetIssuesByAdminId(
                (response) => {
                    if (response.data) {

                        setData(response.data);
                    }
                },
                showErrorToast
            );
        } else if (rightCode === RIGHTS_MAPPING.COURIER) {
            apiGetIssuesByCourierId(
                (response) => {
                    setData(response.data);

                },
                showErrorToast
            );
            let actionsTmp = [];

            actionsTmp = [
                { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },

            ];

            setActions(actionsTmp);
        }
    }, [data.length, rightCode]);



    // Function to open the delete confirmation dialog
    const handleOpenDialog = (issueId) => {
        setIssueToDelete(issueId); // Store the seminar ID to be deleted
        setOpenDialog(true); // Open the dialog
    };


    const handleDeleteIssueRequest = () => {
        apiDeleteIssue((response) => {
            showSuccessToast(response.message);
            const updatedData = data.filter((issue) => issue.id !== issueToDelete);
            setData(updatedData);
            setOpenDialog(false);

        }, showErrorToast, issueToDelete);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };



    return (
        <>
            <GenericTable
                title={"Probleme"}
                columns={columns}
                data={data}
                buttonText={rightCode === RIGHTS_MAPPING.COURIER && "Adauga problema"}
                buttonAction={() => {
                    if (rightCode === RIGHTS_MAPPING.COURIER) {
                        navigate('/dashboard/addEditIssue/0');
                    }
                }}
                edit={rightCode === RIGHTS_MAPPING.COURIER}
                onEdit={(id) => {
                    if (rightCode === RIGHTS_MAPPING.COURIER) {
                        navigate(`/dashboard/addEditIssue/${id}`);
                    }
                }}
                actions={actions}

            >

            </GenericTable>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    Esti sigur ca vrei sa stergi problema?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#009688', color: 'white' }}>
                        Anuleaza
                    </Button>
                    <Button onClick={handleDeleteIssueRequest} sx={{ backgroundColor: 'red', color: 'white' }}>
                        Sterge
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
};

export default Issues;