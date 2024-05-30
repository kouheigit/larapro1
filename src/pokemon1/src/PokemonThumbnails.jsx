import React from "react";

const PokemonThumbnails = ({id,name,image,type}) => {
    return (
    <div>
        <div className="number">
            <small>#{id}</small>
        </div>
    </div>
    );
};

export default PokemonThumbnails;

