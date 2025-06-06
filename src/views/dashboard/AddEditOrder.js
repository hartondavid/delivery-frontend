import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { apiAddOrder, apiGetOrderById, apiUpdateOrder } from "../../api/orders";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { RIGHTS_MAPPING } from "../../utils/utilConstants";

const AddEditOrder = ({ userRights }) => {
    const navigate = useNavigate(); // Initialize navigate function
    const { orderId } = useParams();

    const rightCode = userRights[0].right_code;

    const [formData, setFormData] = useState({
        recipient: '',
        phone: '',
        address: '',
        status: 'pending',
    });


    useEffect(() => {
        if (orderId && orderId !== "0") {
            apiGetOrderById((response) => {
                parseOrderResponse(response.data);
            }, showErrorToast, orderId)

            console.log('parseProductResponse', formData);
        }
    }, [orderId])

    const parseOrderResponse = (data) => {
        console.log('DATA FROM API', data);
        setFormData({
            recipient: data.recipient,
            phone: data.phone,
            address: data.address,
            status: data.status,

        });
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (orderId === '0') {
            apiAddOrder((response) => { navigate(-1); showSuccessToast(response.message) }, showErrorToast, formData)
        } else {
            apiUpdateOrder((response) => { navigate(-1) }, showErrorToast, orderId, formData)
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
                            disabled={rightCode === RIGHTS_MAPPING.COURIER}
                        >
                        </TextField>
                        <TextField
                            label='Telefon'
                            name="phone"
                            type="number"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            disabled={rightCode === RIGHTS_MAPPING.COURIER}
                        />
                        <TextField
                            label='Adresa'
                            name="address"
                            type="string"
                            value={formData.address || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            disabled={rightCode === RIGHTS_MAPPING.COURIER}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                label="Status"
                                labelId="status-label"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}

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