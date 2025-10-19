import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './manage_tables.css';

const ManageTables = () => {
    const navigate = useNavigate();
    const [tables, setTables] = useState<any[]>([]);
    const [deleteId, setDeleteId] = useState<string>("");

    // get all tables
    const fetchTables = async () => {
    try {
        const res = await axios.get(`http://127.0.0.1:8000/api/tables/`);
        setTables(res.data);
    } catch (err) {
        console.error(err);
    }
    };

    useEffect(() => {
    fetchTables();
    }, []);

    // create table
    const createTable = async () => {
    try {
        await axios.post(`http://127.0.0.1:8000/api/tables/`);
        fetchTables();
    } catch (err) {
        console.error(err);
    }
    };

    // delete table
    const deleteTable = async () => {
    try {
        await axios.delete(`http://127.0.0.1:8000/api/tables/` + deleteId + "/");
        fetchTables();
        setDeleteId("");
    } catch (err) {
        console.error(err);
    }
    };

    return (
    <div className='home-page'>
        <div className='title'>
            <div className='tables'>
                <h1>Manage Tables</h1>
                <hr />
                <div>
                <h3>Create Table</h3>
                <button onClick={createTable}>Create</button>
                </div>
                <hr />
                <div>
                <h3>All Tables</h3>
                <ul>
                    {tables.map((table) => (
                    <li key={table.id}>
                        ID: {table.id}, Max Seats: {table.maxSeats}, Occupied:{" "}
                        {table.occupied ? "Yes" : "No"}
                    </li>
                    ))}
                </ul>
                </div>
                <hr />

                <div>
                <h3>Delete Table</h3>
                <label>
                    Table ID:
                    <input className="delete-input"
                    type="text"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                    />
                </label>
                <button className='delete-button' onClick={deleteTable}>Delete</button>
                </div>
                <hr/>
                <button type="button" onClick={() => navigate(-1)}> Return </button>
            </div>
        </div>
    </div>
    );
    };

export default ManageTables;
