import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="Navbar">
            <h1>Pokedex</h1>
            <nav>
                <ul>
                    <h2>
                        <Link to="/">Home</Link>
                    </h2>
                    <h2>
                        <Link to="/insight">Dashboard</Link>
                    </h2>
                    <h2>
                        <Link to="/about">About</Link>
                    </h2>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;