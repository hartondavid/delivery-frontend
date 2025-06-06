import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../utils/utilFunctions";
import GenericTable from "../../components/GenericTable";
import { apiGetAllCouriersByAdminId } from "../../api/user";
const columns = [
    { field: 'id', headerName: 'ID', type: 'string' },
    { field: 'name', headerName: 'Nume', type: 'string' },
    { field: 'email', headerName: 'Email', type: 'string' },
    { field: 'created_at', headerName: 'Data', type: 'date' },

];

const Couriers = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {

        apiGetAllCouriersByAdminId(
            (response) => {
                if (response.data) {
                    setData(response.data);
                }
            },
            showErrorToast
        );

    }, [data.length]);


    return (
        <>
            <GenericTable
                title={"Curieri"}
                columns={columns}
                data={data}
            >

            </GenericTable>


        </>
    );
};

export default Couriers;