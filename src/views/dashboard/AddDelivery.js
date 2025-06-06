import { Box, Button, TextField, Typography, List, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { apiAddOrder, apiGetOrderById, apiUpdateOrder } from "../../api/orders";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { apiGetUsers } from "../../api/user";

const AddEditOrder = ({
}) => {
    const navigate = useNavigate(); // Initialize navigate function
    const { orderId } = useParams();


    const [formData, setFormData] = useState({
        user_id: '',
    });



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        apiAddOrder((response) => { navigate(-1); showSuccessToast(response.message) }, showErrorToast, formData)

    };

    const [searchTermForCouriers, setSearchTermForCouriers] = useState('');
    const [searchResultsForCouriers, setSearchResultsForCouriers] = useState([]);
    const [couriers, setCouriers] = useState([]);

    const [loadingForCouriers, setLoadingForCouriers] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(null);

    useEffect(() => {
        apiGetUsers(setCouriers, showErrorToast);
    }, [])
    const handleCouriersSearchChange = (event) => {
        const value = event.target.value;
        setSearchTermForCouriers(value); // Setează valoarea pentru a o afișa în TextField
        // setLoadingForEmployees(true); // Poți păstra asta dacă vrei un indicator vizual,
        // dar pentru filtrare locală rapidă, s-ar putea să nu fie necesar
        // sau să clipească prea repede.

        if (value.trim()) {
            const searchTermLower = value.trim().toLowerCase(); // Convertește termenul de căutare la litere mici o singură dată
            const filtered = couriers.filter(courier => {
                // Verifică dacă 'employee.name' există și nu e null/undefined înainte de a aplica toLowerCase()
                if (courier && courier.name) {
                    return courier.name.toLowerCase().includes(searchTermLower);
                }
                return false; // Dacă nu are nume, nu îl include în rezultate
            });
            setSearchResultsForCouriers(filtered);
        } else {
            setSearchResultsForCouriers([]); // Golește rezultatele dacă nu există text în căutare
        }
        setLoadingForCouriers(false); // Setează loading la false după filtrare
    };

    const handleAddCourier = (courier) => {
        setSelectedCourier(courier);
        setSearchTermForCouriers(courier.name);
        setSearchResultsForCouriers([]);

        formData.courier_id = courier.id;
        console.log('formData ', formData);
        console.log('courier ', courier);

    };

    return (
        <>
            <Box sx={{ marginLeft: '10px', marginRight: '10px' }}  >
                <Typography variant="h4">
                    <span className="font-bold text-black">{orderId === "0" ? "Adauga comanda" : "Editeaza comanda"}</span>
                </Typography>

                <form onSubmit={handleSubmit}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}  >
                        <Box sx={{ position: 'relative', width: '100%', mb: 3 }}>
                            <TextField
                                label="Cauta curier"
                                variant="outlined"
                                fullWidth
                                value={searchTermForCouriers}
                                onChange={handleCouriersSearchChange}
                                sx={{
                                    mb: -4,
                                    '& .MuiInputBase-root': {
                                        borderRadius: '20px',
                                        height: '50px',
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: 14,
                                        '&.Mui-focused': {
                                            color: '#AA3BE9'
                                        }
                                    },
                                    '& .MuiInputBase-input': {
                                        fontSize: 14,
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: ' #AA3BE9',
                                        },
                                    },
                                }}

                            />


                            {searchResultsForCouriers.length > 0 && (
                                <List sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    borderRadius: '8px',
                                    zIndex: 1,
                                    mt: 3
                                }}>
                                    {searchResultsForCouriers.map((courier) => (
                                        <ListItemButton
                                            key={courier.id}
                                            onClick={() => handleAddCourier(courier)}
                                        >
                                            <ListItemText
                                                primary={courier.name}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            )}
                        </Box>

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