import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetIssuesByAdminId, apiGetIssuesByCourierId, apiDeleteIssue } from "../../api/issues";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import GenericTable from "../../components/GenericTable";
import dayjs from "dayjs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Issue {
    id: string | number;
    description: string;
    delivery_id: string | number;
    courier_name: string;
    courier_phone: string;
    created_at: string;
    [key: string]: any;
}

interface UserRight {
    right_code: string;
    [key: string]: any;
}

interface IssuesProps {
    userRights: UserRight[];
}

const columns = [
    { field: 'id', headerName: 'Nr.', type: 'string' },
    { field: 'description', headerName: 'Descriere', type: 'string' },
    { field: 'delivery_id', headerName: 'Nr. livrare', type: 'string' },
    { field: 'courier_name', headerName: 'Nume curier', type: 'string' },
    { field: 'courier_phone', headerName: 'Telefon', type: 'string' },
    {
        field: 'created_at', headerName: 'Data', type: 'date', renderCell: ({ value }: { value: string }) => {
            return dayjs(value).format('DD.MM.YYYY');
        }
    },
];

const Issues: React.FC<IssuesProps> = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<Issue[]>([]);
    const rightCode = userRights[0]?.right_code;
    const [actions, setActions] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [issueToDelete, setIssueToDelete] = useState<string | number | null>(null);

    useEffect(() => {
        if (Number(rightCode) === RIGHTS_MAPPING.ADMIN) {
            apiGetIssuesByAdminId(
                (response: any) => {
                    if (response.data) {
                        setData(response.data);
                    }
                },
                showErrorToast
            );
        } else if (Number(rightCode) === RIGHTS_MAPPING.COURIER) {
            apiGetIssuesByCourierId(
                (response: any) => {
                    setData(response.data);
                },
                showErrorToast
            );
            let actionsTmp: any[] = [];
            actionsTmp = [
                { icon: <DeleteIcon />, color: 'red', onClick: handleOpenDialog },
            ];
            setActions(actionsTmp);
        }
    }, [data.length, rightCode]);

    // Function to open the delete confirmation dialog
    const handleOpenDialog = (issueId: string | number): void => {
        setIssueToDelete(issueId);
        setOpenDialog(true);
    };

    const handleDeleteIssueRequest = (): void => {
        if (issueToDelete !== null) {
            apiDeleteIssue((response: any) => {
                showSuccessToast(response.message);
                const updatedData = data.filter((issue) => String(issue.id) !== String(issueToDelete));
                setData(updatedData);
                setOpenDialog(false);
            }, showErrorToast, issueToDelete);
        }
    };

    const handleCloseDialog = (): void => {
        setOpenDialog(false);
    };

    return (
        <>
            <GenericTable
                title={"Probleme"}
                columns={columns}
                data={data}
                buttonText={Number(rightCode) === RIGHTS_MAPPING.COURIER ? "Adauga problema" : undefined}
                buttonAction={() => {
                    if (Number(rightCode) === RIGHTS_MAPPING.COURIER) {
                        navigate('/dashboard/addEditIssue/0');
                    }
                }}
                edit={Number(rightCode) === RIGHTS_MAPPING.COURIER}
                onEdit={(id: string | number) => {
                    if (Number(rightCode) === RIGHTS_MAPPING.COURIER) {
                        navigate(`/dashboard/addEditIssue/${id}`);
                    }
                }}
                actions={actions}
            />
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