import React from 'react'
import ReactDOM from "react-dom";
import Bloghero from "../components/bloghero";

function Blogblog(){
    return(
        <div id="blogblog">
            <Bloghero title="Blog"subtitle="Recent Posts"/>
        </div>
    )
}
if (document.getElementById('blogblog')) {
    ReactDOM.render(<Blogblog />, document.getElementById('blogblog'));
}


/*
function Blogabout(){
    return (
        <div id="blogabout">
            <Bloghero title="About"subtitle="About develop activities" />
        </div>


    )

}


if (document.getElementById('blogabout')) {
    ReactDOM.render(<Blogabout />, document.getElementById('blogabout'));
}*/
