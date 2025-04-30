import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

function App(){
    return (
        <div>
            <h1>表示テスト</h1>
            <h1>小林内田</h1>
        </div>
    );
}

export default App;

if (document.getElementById('App')) {
    ReactDOM.render(<App />, document.getElementById('App'));
}
