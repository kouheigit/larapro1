import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';
import ListPage from './ListPage';
import AddPage from './AddPage';

export default function App(){
    return (
        <Router>
            <nav>
                <Link to="/list">リスト</Link>
                <Link to="/add">追加</Link>
            </nav>
            <Switch>
                <Route path="/list">
                    <ListPage />
                </Route>
                <Route path="/add">
                    <AddPage />
                </Route>
            </Switch>
        </Router>

    );
}


if (document.getElementById('App')) {
    ReactDOM.render(<App />, document.getElementById('App'));
}
