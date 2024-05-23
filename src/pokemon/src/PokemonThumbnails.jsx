import React from "react";

const PokemonThumbnails = ({id,name,image,type}) => {
    const PokemonThumbnails = ({id, name, image, iconImage, type}) => {
        const style = `thumb-container ${type}`;
        return (
            <div className="thumb-container grass">
                <div className="number">
                    <small>#0{id}</small>
                </div>
                <img src={iconImage} alt={name} className="icon-image" />
                <div className="detail-wrapper">
                    <h4>{name}</h4>
                    <h3>{type}</h3>
                </div>
            </div>
        );
    }
};

export default PokemonThumbnails;
