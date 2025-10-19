import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DailySummary = () => {
    const [date, setDate] = useState<string>("");
    const [summary, setSummary] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchSummary = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!date) return setError("Please select a date.");

        setError(null);
        setSummary(null);

        try {
        const res = await axios.get(`http://127.0.0.1:8000/api/admin/summary/${date}/`);

        setSummary(res.data);
        } catch (err) {
        if (axios.isAxiosError(err)) {
            setError(
            err.response?.data?.message ??
                err.message ??
                "Error fetching daily summary."
            );
        } else {
            setError("Unexpected error.");
            }
        }
  };

  return (
    <div className='home-page'>
        <h1 className= 'title'>Daily Summary</h1>
        <form onSubmit={fetchSummary} className='home-links'>
            <label htmlFor="date">Select a date:</label>
            <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <button type="submit">Confirm</button>
        </form>

        {error && <p>{error}</p>}

        {summary && (
            <div>
                <h3>Summary for {summary.date}</h3>
                <p>Total Guests:{summary.total_guests}</p>
                <p>Total Reservations:{summary.total_reservations}</p>
                <p>Occupied Tables:{" "} 
                    {summary.occupied_tables.length > 0
                    ? summary.occupied_tables.join(", ")
                    : "None"}
                </p>
                <p>Unoccupied Tables:{" "} 
                    {summary.unoccupied_tables.length > 0
                    ? summary.unoccupied_tables.join(", ")
                    : "None"}
                </p>
            </div>
        )}
        <button type="button" onClick={() => navigate(-1)}>Return </button>
    </div>
  );
};

export default DailySummary;
