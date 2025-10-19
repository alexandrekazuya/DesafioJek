import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GetAllorDeleteReservations = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [message, setMessage] = useState<string | null>(null);

    const fetchReservations = async () => {
    try {
        const res = await axios.get(`http://127.0.0.1:8000/api/reservations/`);
        setData(res.data);
    } catch (err) {
        console.error(err);
    }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const deleteReservation = async (id: number) => {
    try {
        const res = await axios.delete(`http://127.0.0.1:8000/api/reservations/${id}/`);
        setMessage(res.data?.message);
        setData((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
        if (axios.isAxiosError(err)) {
            setMessage(err.response?.data?.message ?? err.message ?? "Error deleting reservation.");
        }
        else {
        setMessage("Unexpected error.");
        }
    }
    };

    return (
    <div className='home-page'>
        <h1 className='title'>All Reservations</h1>
        {message && <p>{message}</p>}
        {data.length === 0 ? (<p>No reservations found.</p>) : (
        <ul className='home-links'>
            {data.map((res) => (
                <li key={res.id}>
                    ID: {res.id} | Name: {res.name} | Phone: {res.phoneNr} | Date:{" "}
                    {new Date(res.date).toLocaleString()} | Guests: {res.guestsNr} |{" "}
                    Notes: {res.notes || "—"} | Table:{" "}
                    {Array.isArray(res.table) ? res.table.join(", ") : res.table} | Restaurant:{" "}
                    {res.restaurant}{" "}
                    
                    <button onClick={() => deleteReservation(res.id)}>Cancel</button>
                
                </li>
                ))}
            </ul>
            )
        }
        <button type="button" onClick={() => navigate(-1)}>Return</button>
    </div>
    );
};

export default GetAllorDeleteReservations;
