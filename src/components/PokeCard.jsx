import React from 'react'

const PokeCard = ({info, cardType}) => {
    return (
        <div className="PokeCard">
            <h1>{info}</h1>
            <h2><strong>{cardType}</strong></h2>
        </div>
    );
};

export default PokeCard;