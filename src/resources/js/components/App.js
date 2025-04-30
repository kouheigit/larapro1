import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

export default function App(){
    return (
        <Router>
            <nav>

            </nav>
        </Router>
    );
}


if (document.getElementById('App')) {
    ReactDOM.render(<App />, document.getElementById('App'));
}
