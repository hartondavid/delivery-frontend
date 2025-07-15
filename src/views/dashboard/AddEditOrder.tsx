import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { apiAddOrder, apiGetOrderById, apiUpdateOrder } from "../../api/orders";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";
import { addStyleToTextField } from "../../utils/utilFunctions";

interface UserRight {
    right_code: string;
    [key: string]: any;
}

interface AddEditOrderProps {
    userRights: UserRight[];
}

interface FormData {
    recipient: string;
    phone: string;
    address: string;
    status: string;
}

const AddEditOrder: React.FC<AddEditOrderProps> = ({ userRights }) => {
    const navigate = useNavigate(); // Initialize navigate function
    const { orderId } = useParams<{ orderId: string }>();

    const rightCode = userRights[0].right_code;

    const [formData, setFormData] = useState<FormData>({
        recipient: '',
        phone: '',
        address: '',
        status: 'pending',
    });

    useEffect(() => {
        if (orderId && orderId !== "0") {
            apiGetOrderById((response: any) => {
                parseOrderResponse(response.data);
            }, showErrorToast, orderId)
        }
    }, [orderId])

    const parseOrderResponse = (data: any) => {
        setFormData({
            recipient: data.recipient,
            phone: data.phone,
            address: data.address,
            status: data.status,
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown; type?: string; checked?: boolean }>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name as string]: type === 'checkbox' ? checked : value
        });
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (orderId === '0') {
            apiAddOrder((response: any) => { navigate(-1); showSuccessToast(response.message) }, showErrorToast, formData)
        } else if (orderId) {
            apiUpdateOrder((response: any) => { navigate(-1) }, showErrorToast, Number(orderId), formData)
        }
    };
    return (
        <>
            <Box sx={{ m: 2 }}  >
                <Typography variant="h4">
                    <span className="font-bold text-black">{orderId === "0" ? "Adauga comanda" : "Editeaza comanda"}</span>
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}  >
                        <TextField
                            label="Nume destinatar"
                            name="recipient"
                            type='string'
                            value={formData.recipient || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            disabled={Number(rightCode) === RIGHTS_MAPPING.COURIER}
                            sx={addStyleToTextField(formData.recipient)}
                        />
                        <TextField
                            label='Telefon'
                            name="phone"
                            type="number"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            disabled={Number(rightCode) === RIGHTS_MAPPING.COURIER}
                            sx={addStyleToTextField(formData.phone)}
                        />
                        <TextField
                            label='Adresa'
                            name="address"
                            type="string"
                            value={formData.address || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            disabled={Number(rightCode) === RIGHTS_MAPPING.COURIER}
                            sx={addStyleToTextField(formData.address)}
                        />
                        <FormControl fullWidth sx={addStyleToTextField(formData.status)}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                label="Status"
                                labelId="status-label"
                                name="status"
                                value={formData.status}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value={'pending'}>In asteptare</MenuItem>
                                <MenuItem value={'delivered'}>Livrata</MenuItem>
                                <MenuItem value={'cancelled'}>Anulata</MenuItem>
                                <MenuItem value={'issue'}>Problema</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                            <Button type="submit" variant="contained" sx={{ mr: 1, mb: 1, backgroundColor: ' #009688', color: 'white' }}>
                                {orderId === "0" ? 'Adauga comanda' : 'Actualizeaza comanda'}
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

export default AddEditOrder; 