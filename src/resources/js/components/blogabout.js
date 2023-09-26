import React from 'react'
import ReactDOM from "react-dom";
import Bloghero from "../components/bloghero";

function Blogabout(){
    return(
        <div id="blogabout">

        </div>
    )
}

if (document.getElementById('blogabout')) {
    ReactDOM.render(<Blogabout />, document.getElementById('blogabout'));
}
