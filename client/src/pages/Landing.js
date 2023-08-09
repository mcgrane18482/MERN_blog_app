import { useEffect, useState } from 'react';
import axios from 'axios'
import profileImg from "../assets/images/profile_img.png";

// We get the notes from the props object
function Landing(props) {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        axios.get('/api/notes')
            .then(res => {
                setNotes([...res.data.notes])
            });
    }, []);

    return (
        <main className="landing">
            <div className="row">
                <img src={profileImg} alt="profile picture" />
                <h1 className="greeting-text">Welcome back, {props.state.user.username}</h1>
            </div>
            <div className="row">
                <h3 >This is what's happening lately</h3>
            </div>

            <div className="notes-feed">
                {!notes.length && <p>No notes have been added</p>}

                {notes.map(note => (
                    <div key={note._id} >
                        <div className="note-body">
                            <div className="note-header">
                                <img src={profileImg} alt="profile picture" />
                                <p>{note.author.username}</p>
                            </div>
                            <div className="note-content">
                                <h3>{note.text}</h3>

                                <p>On: {note.createdAt}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Landing;