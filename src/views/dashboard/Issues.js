import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetIssuesByAdminId, apiGetIssuesByCourierId } from "../../api/issues";
import { showErrorToast } from "../../utils/utilFunctions";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import GenericTable from "../../components/GenericTable";

const columns = [
    { field: 'id', headerName: 'Nr.', type: 'string' },
    { field: 'description', headerName: 'Descriere', type: 'string' },
    { field: 'delivery_id', headerName: 'Nr. livrare', type: 'string' },
    { field: 'courier_name', headerName: 'Nume curier', type: 'string' },
    { field: 'courier_phone', headerName: 'Telefon', type: 'string' },
    { field: 'created_at', headerName: 'Data', type: 'date' },

];

const Issues = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const rightCode = userRights[0]?.right_code;

    console.log("rightCode", rightCode);

    useEffect(() => {
        if (rightCode === RIGHTS_MAPPING.ADMIN) {
            apiGetIssuesByAdminId(
                (response) => {
                    if (response.data) {
                        console.log('response', response);
                        setData(response.data);
                    }
                },
                showErrorToast
            );
        } else if (rightCode === RIGHTS_MAPPING.COURIER) {
            apiGetIssuesByCourierId(
                (response) => {
                    setData(response.data);
                    console.log("orders-----", response.data);
                },
                showErrorToast
            );
        }
    }, [data.length, rightCode]);


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

            >

            </GenericTable>


        </>
    );
};

export default Issues;