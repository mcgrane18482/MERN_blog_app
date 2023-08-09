import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Header(props) {
    const logout = async e => {
        e.preventDefault();

        await axios.get('/api/logout');

        props.setState((oldState) => {
            return {
                ...oldState,
                user: null
            }
        })
    }

    return (
        <header className="row justify-between align-center">
            <h3>Note App</h3>

            <nav className="row">
                {props.state.user && <p className="welcome-message">Welcome,<span style={{ color: '#ff51dc' }}> {props.state.user.username}</span> </p>}
                <NavLink to="/">Home</NavLink>
                {props.state.user ? (
                    <>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink onClick={logout} to="/logout">Log Out</NavLink>
                    </>
                ) : (
                    <NavLink to="/auth">Login/Register</NavLink>
                )}
            </nav>
        </header>
    )
}

export default Header;