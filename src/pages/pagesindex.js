import React from 'react';
import ReactDOM from 'react-dom';

function comp1() {
    return(
        <div id="comp1">
            <h1>This is a Test1 Value</h1>
        </div>
    );
}

if (document.getElementById('comp1')) {
    ReactDOM.render(<comp1 />, document.getElementById('comp1'));
}
