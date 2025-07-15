import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { apiAddOrder, apiGetOrderById, apiUpdateOrder } from "../../api/orders";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { apiAddRoute } from "../../api/routes";
import { addStyleToTextField } from "../../utils/utilFunctions";

interface User {
    data: {
        id: string | number;
    };
    [key: string]: any;
}

interface AddRouteProps {
    user: User;
}

interface FormData {
    area: string;
}

const AddRoute: React.FC<AddRouteProps> = ({ user }) => {
    const navigate = useNavigate(); // Initialize navigate function
    const { orderId } = useParams();

    const [formData, setFormData] = useState<FormData>({
        area: '',
    });
    const userId = user.data.id;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        apiAddRoute((response: any) => {
            navigate(-1);
            showSuccessToast(response.message)
        }, showErrorToast, formData.area)
    };

    return (
        <>
            <Box sx={{ m: 2 }}  >
                <Typography variant="h4">
                    <span className="font-bold text-black">{"Adauga ruta"}</span>
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}  >
                        <TextField
                            label="Zona"
                            name="area"
                            type='string'
                            value={formData.area || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            sx={addStyleToTextField(formData.area)}
                        >
                        </TextField>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                            <Button type="submit" variant="contained" sx={{ mr: 1, mb: 1, backgroundColor: ' #009688', color: 'white' }}>
                                Adauga ruta
                            </Button>
                            <Button variant="contained" color="error" sx={{ mb: 1 }} onClick={() => navigate(-1)}>
                                Renunta
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default AddRoute; 