import React from 'react';
import ReactDOM from 'react-dom'

export default function Test(){
    return <h1>CUBE</h1>
}
export default Test;

if(document.getElementById('test')){
    ReactDOM.render(<Test />, document.getElementById('test'));
}
/*
import React from 'react';
import ReactDOM from 'react-dom';

function Example() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component</div>

                        <div className="card-body">I'm an example component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}*/
