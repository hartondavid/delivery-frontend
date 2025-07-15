import { Typography } from "@mui/material";
import { Navigate } from "react-router-dom";

interface DashboardProps {
    userRights: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ userRights }) => {
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