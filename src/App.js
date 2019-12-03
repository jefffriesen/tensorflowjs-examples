import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { Menu } from 'semantic-ui-react'
import { NavItem } from './components/Elements/NavItem'

import CurveFitting from './components/CurveFitting'
import CurveStore from './components/CurveFitting/CurveStore'
import BostonHousing from './components/BostonHousing'
import BostonStore from './components/BostonHousing/BostonStore'
import KerasImport from './components/KerasImport'
import KerasImportStore from './components/KerasImport/KerasImportStore'
import 'semantic-ui-css/semantic.min.css'
import './App.css'

let curveStore = new CurveStore()
let bostonStore = new BostonStore()
let kerasImportStore = new KerasImportStore()

// This is to be able to inspect the store from the inspector at any time for debugging,
// not for production use
window.curveStore = curveStore
window.bostonStore = bostonStore
window.kerasImportStore = kerasImportStore

const App = () => (
  <Provider curveStore={curveStore} bostonStore={bostonStore} kerasImportStore={kerasImportStore}>
    <Router>
      <div>
        <Menu secondary={true} pointing={true}>
          <Menu.Item as={NavItem} to="/" name="curve-fitting" />
          <Menu.Item as={NavItem} to="/boston-housing" name="boston-housing" />
          <Menu.Item as={NavItem} to="/keras-import-demo" name="keras-import-demo" />
        </Menu>
        <div className="mainContent">
          <Route exact={true} path="/" component={CurveFitting} />
          <Route exact={true} path="/boston-housing" component={BostonHousing} />
          <Route exact={true} path="/keras-import-demo" component={KerasImport} />
        </div>
      </div>
    </Router>
  </Provider>
)

export default App
