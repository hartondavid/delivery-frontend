import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetOrdersByAdminId, apiGetOrdersByCourierId } from "../../api/orders";
import { showErrorToast } from "../../utils/utilFunctions";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import GenericTable from "../../components/GenericTable";

const columns = [
    { field: 'id', headerName: 'Nr.', type: 'string' },
    { field: 'recipient', headerName: 'Destinatar', type: 'string' },
    { field: 'phone', headerName: 'Telefon', type: 'string' },
    { field: 'address', headerName: 'Adresa', type: 'string' },
    { field: 'status', headerName: 'Status', type: 'string' },
    { field: 'created_at', headerName: 'Data', type: 'date' },

];

const Orders = ({ userRights }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const rightCode = userRights[0]?.right_code;

    console.log("rightCode", rightCode);

    useEffect(() => {
        if (rightCode === RIGHTS_MAPPING.ADMIN) {
            apiGetOrdersByAdminId(
                (response) => {
                    if (response.data) {
                        console.log('response', response);
                        setData(response.data);
                    }
                },
                showErrorToast
            );
        } else if (rightCode === RIGHTS_MAPPING.COURIER) {
            apiGetOrdersByCourierId(
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
                title={"Comenzi"}
                columns={columns}
                data={data}
                buttonText={rightCode === RIGHTS_MAPPING.ADMIN && "Adauga comanda"}
                buttonAction={() => {
                    if (rightCode === RIGHTS_MAPPING.ADMIN) {
                        navigate('/dashboard/addEditOrder/0');
                    }
                }}
                edit={true}
                onEdit={(id) => {
                    navigate(`/dashboard/addEditOrder/${id}`);
                }}

            >

            </GenericTable>


        </>
    );
};

export default Orders;