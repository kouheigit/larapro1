import React from 'react'
import ReactDOM from 'react-dom';
return(
    <div className="hero">
        <h1>積極的内田</h1>
        <p>アクトレにアドバイスをした</p>
    </div>
)



export default Test4;

if (document.getElementById('test4')) {
    ReactDOM.render(<Test4 />, document.getElementById('test4'));
}



/*import React from 'react';
import ReactDOM from 'react-dom';

function Test2() {
    const test = (
        <div>
            <h1>Const test</h1>
            <p>Const test success</p>
        </div>
    );
    //returnが必須
    return test;
}


export default Test2;

if (document.getElementById('test2')) {
    ReactDOM.render(<Test2 />, document.getElementById('test2'));
}
*/
