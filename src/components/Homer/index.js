import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid } from 'semantic-ui-react'

class CurveFitting extends Component {
  render() {
    return (
      <div>
        <Grid columns='equal' padded>
          <Grid.Row>
            <Grid.Column>
              <h3>HOMER</h3>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default inject('homerStore')(observer(CurveFitting))
