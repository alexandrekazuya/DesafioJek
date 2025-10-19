import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateReservation = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phoneNr: "",
        date: "",
        guestsNr: 1,
        notes: "",
        restaurant: 1,
    });

    const [_, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const payload = {
        name: form.name.trim(),
        phoneNr: form.phoneNr.trim(),
        date: form.date,
        guestsNr: Number(form.guestsNr),
        notes: form.notes,
        restaurant: Number(form.restaurant)
        };

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/reservations/",payload,
                        { headers: { "Content-Type": "application/json" } }
        );
        setMessage(res.data?.message);
        setForm({
            name: "",
            phoneNr: "",
            date: "",
            guestsNr: 1,
            notes: "",
            restaurant: 1,
        });
        } catch (err) {
        const apiMsg =
            axios.isAxiosError(err) ?
            err.response?.data?.message ??
            err.message :
            "Unexpected error";
        setMessage(apiMsg);
        } finally {
        setSubmitting(false);
        }
    }

    return (
        <div className='home-page'>
        <h1 className='title'>Create your reservation!</h1>
        <form onSubmit={handleSubmit} className='home-links'>
            <label htmlFor="name">Name:</label>
            <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            />
            <br /><br />

            <label htmlFor="phoneNr">Phone:</label>
            <input
            type="tel"
            name="phoneNr"
            pattern="9[0-9]{8}"
            required
            value={form.phoneNr}
            onChange={handleChange}
            />        
            <br /><br />

            <label htmlFor="date">Date:</label>
            <input
            type="datetime-local"
            name="date"
            required
            value={form.date}
            onChange={handleChange}
            />
            <br /><br />

            <label htmlFor="guestsNr">Number of Guests:</label>
            <input
            type="number"
            name="guestsNr"
            min={1}
            required
            value={form.guestsNr}
            onChange={handleChange}
            />
            <br /><br />

            <label htmlFor="comment">Additional Notes:</label>
            <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            />
            <br /><br />

            <button type="submit">Submit</button>

            <button type="button" onClick={() => navigate(-1)}> Return </button>

            {message && (
            <p>
            {message}
            </p>
            )}
        </form>
        </div>
        );
}

export default CreateReservation;
