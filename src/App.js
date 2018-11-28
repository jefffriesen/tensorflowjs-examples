import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import MobxStore from './MobxStore'
import { Menu } from 'semantic-ui-react'
import { NavItem } from './components/Elements/NavItem'
// import About from './components/About'
import Home from './components/Home'
import 'semantic-ui-css/semantic.min.css'
import './App.css'

// This is to be able to inspect the store from the inspector at any time.
let mobxStore = new MobxStore()
window.mobxStore = mobxStore

const App = () => (
  <Provider store={mobxStore}>
    <Router>
      <div>
        <Menu secondary={true} pointing={true}>
          <Menu.Item as={NavItem} to='/' name='home' />
          {/* <Menu.Item as={NavItem} to='/about' name='about' /> */}
        </Menu>
        <div className='mainContent'>
          <Route exact={true} path='/' component={Home} />
          {/* <Route path='/about' component={About} /> */}
        </div>
      </div>
    </Router>
  </Provider>
)

export default App
