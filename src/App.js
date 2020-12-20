import React, {useState, useEffect} from 'react'
import {Router, Switch, Route} from 'react-router-dom'
import log from 'loglevel'
import history from './helpers/navigation'
import {auth} from './services/firebase'
import './index.css'
import Home from './pages/Home'
import PeerChat from './pages/PeerChat'
import GeneralChat from './pages/GeneralChat'
import NotFound from './components/NotFound'
import PrivateRoute from './components/hoc/PrivateRoute'
import PublicRoute from './components/hoc/PublicRoute'

function App() {
  const [appState, setAppState] = useState({
    authenticated: false,
    loading: true,
  })
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        log.warn(user)
        setAppState({authenticated: true, loading: false})
        const userName = localStorage.getItem('chatUserName')
        history.push(`/${userName}/chat`)
      } else {
        setAppState({authenticated: false, loading: false})
        localStorage.removeItem('chatUserName')
      }
    })
  }, [])
  return (
    <Router history={history}>
      <Switch>
        <PublicRoute
          exact
          path="/"
          authenticated={appState.authenticated}
          component={Home}
        />
        <PrivateRoute
          exact
          path="/:userId/chat"
          authenticated={appState.authenticated}
          component={PeerChat}
        />
        <PrivateRoute
          path="/chat"
          authenticated={appState.authenticated}
          component={GeneralChat}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default App
