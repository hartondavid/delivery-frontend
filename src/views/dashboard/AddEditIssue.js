import { Box, Button, TextField, Typography, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { apiAddIssue, apiGetIssueById, apiUpdateIssue } from "../../api/issues";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/utilFunctions";
import { apiSearchDeliveryByCourierId } from "../../api/deliveries";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { addStyleToTextField } from "../../utils/utilFunctions";

const AddEditIssue = ({ userRights }) => {
    const navigate = useNavigate(); // Initialize navigate function
    const { issueId } = useParams();

    const rightCode = userRights[0].right_code;

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);


    const [formData, setFormData] = useState({
        description: '',
        delivery_id: '',
    });


    useEffect(() => {
        if (issueId && issueId !== "0") {
            apiGetIssueById((response) => {
                parseIssueResponse(response.data);

            }, showErrorToast, issueId)

        }

    }, [issueId])

    const parseIssueResponse = (data) => {

        setFormData({
            description: data.description,
            delivery_id: data.delivery_id,

        });
        // Try to find the delivery in searchResults
        const foundDelivery = searchResults.find(delivery => delivery.id === data.delivery_id);
        if (foundDelivery) {
            setSelectedDelivery(foundDelivery);
        } else {
            setSelectedDelivery({ id: data.delivery_id });
        }

    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };


    //Function to fetch employees based on search term
    const fetchDeliverySearchResults = async (search) => {
        setLoading(true);
        try {
            await apiSearchDeliveryByCourierId((deliveries) => {
                setSearchResults(deliveries);
            }, showErrorToast, search);

        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };
    // Function to handle search input change with debounce
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        // Clear previous timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        // Set a new timeout to wait before making the API request
        setDebounceTimeout(setTimeout(() => {
            if (value.trim()) {
                fetchDeliverySearchResults(value);
            } else {
                setSearchResults([]);
            }
        }, 500));
    }

    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const handleAddDelivery = (delivery) => {

        setSelectedDelivery(delivery);

        setFormData({ ...formData, delivery_id: delivery.id });

        setSearchResults([]);
        setSearchTerm('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (issueId === '0') {
            apiAddIssue((response) => { navigate(-1); showSuccessToast(response.message) }, showErrorToast, formData.delivery_id, formData.description)
        } else {
            apiUpdateIssue((response) => { navigate(-1) }, showErrorToast, issueId, formData.delivery_id, formData.description)
        }
    };
    return (
        <>
            <Box sx={{ m: 2 }}  >
                <Typography variant="h4" sx={{ mb: 2 }}>
                    <span className="font-bold text-black">{issueId === "0" ? "Adauga problema" : "Editeaza problema"}</span>
                </Typography>

                <form onSubmit={handleSubmit}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}  >
                        <TextField
                            label="Cauta livrari"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{ ...addStyleToTextField(searchTerm), mb: -2 }}
                        />

                        {loading ? <CircularProgress /> : (
                            <List>
                                {searchResults.map((delivery) => (
                                    <ListItem
                                        button
                                        key={delivery.id}
                                        onClick={() => handleAddDelivery(delivery)}
                                    >
                                        {delivery.id} {/* Assuming employee has a `name` property */}

                                        <DeliveryDiningIcon sx={{ color: 'green', ml: 2 }} />
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        {selectedDelivery && (
                            <>
                                <Typography variant="h6" sx={{ marginTop: 2 }}>Livrare selectata:</Typography>
                                <List>
                                    <ListItem>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ListItemText primary={selectedDelivery.id} />
                                            <DeliveryDiningIcon sx={{ color: 'green', ml: 2 }} />
                                        </Box>


                                    </ListItem>
                                </List>
                            </>
                        )}


                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}  >
                            <TextField
                                label="Descriere"
                                name="description"
                                type='string'
                                value={formData.description || ''}
                                fullWidth
                                onChange={handleChange}
                                sx={addStyleToTextField(formData.description)}
                            >
                            </TextField>


                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                                <Button type="submit" variant="contained" sx={{ mr: 1, mb: 1, backgroundColor: ' #009688', color: 'white' }}>
                                    {issueId === "0" ? 'Adauga problema' : 'Actualizeaza problema'}
                                </Button>
                                <Button variant="contained" color="error" sx={{ mb: 1 }} onClick={() => navigate(-1)}>
                                    Renunta
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default AddEditIssue;