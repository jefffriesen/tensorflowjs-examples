import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import HomerStore from './components/Homer/HomerStore'
import CurveStore from './components/CurveFitting/CurveStore'
import BostonStore from './components/BostonHousing/BostonStore'
import { Menu } from 'semantic-ui-react'
import { NavItem } from './components/Elements/NavItem'
import BostonHousing from './components/BostonHousing'
import CurveFitting from './components/CurveFitting'
import Homer from './components/Homer'
import 'semantic-ui-css/semantic.min.css'
import './App.css'

let curveStore = new CurveStore()
let bostonStore = new BostonStore()
let homerStore = new HomerStore()

// This is to be able to inspect the store from the inspector at any time for debugging
window.curveStore = curveStore
window.bostonStore = bostonStore
window.homerStore = homerStore

const App = () => (
  <Provider
    curveStore={curveStore}
    bostonStore={bostonStore}
    homerStore={homerStore}>
    <Router>
      <div>
        <Menu secondary={true} pointing={true}>
          <Menu.Item as={NavItem} to='/' name='curve-fitting' />
          <Menu.Item as={NavItem} to='/boston-housing' name='boston-housing' />
          <Menu.Item as={NavItem} to='/homer' name='homer' />
        </Menu>
        <div className='mainContent'>
          <Route exact={true} path='/' component={CurveFitting} />
          <Route
            exact={true}
            path='/boston-housing'
            component={BostonHousing}
          />
          <Route exact={true} path='/homer' component={Homer} />
        </div>
      </div>
    </Router>
  </Provider>
)

export default App
