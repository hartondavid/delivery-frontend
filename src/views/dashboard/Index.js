import { Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
const Dashboard = ({ userRights }) => {


    return (
        <>
            <Typography variant="h4">
                {/* <span className="font-bold text-black">{'dashboard'}</span> */}


                <Navigate to="/dashboard/orders" />


            </Typography>
        </>
    )
}
export default Dashboard;