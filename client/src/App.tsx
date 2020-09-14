import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './App.css'
import Fib from './Fib'
import OtherPage from './OtherPage'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title"> Fib Calculator </h1>
          <p>
            <Link to="/"> Home </Link>
            <Link to="/otherpage"> Other page </Link>{' '}
          </p>
        </header>
        <br />
        <br />
        <div>
          <Route path="/" exact component={Fib} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </div>
    </Router>
  )
}

export default App
