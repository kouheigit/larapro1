import React from 'react'
import ReactDOM from "react-dom";
import Bloghero from "../components/bloghero";

/*Blogabout*/
function Blogabout(){
    return (
        <div id="blogabout">
            <Bloghero title="About"subtitle="About develop activities" />
        </div>


    )

}


if (document.getElementById('blogabout')) {
    ReactDOM.render(<Blogabout />, document.getElementById('blogabout'));
}

