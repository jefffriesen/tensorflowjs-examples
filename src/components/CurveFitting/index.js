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
              <h3>TensorFlow.js: Fitting a curve to synthetic data</h3>
              <a href='https://storage.googleapis.com/tfjs-examples/polynomial-regression-core/dist/index.html'>
                Demo
              </a>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <h5>Original Data (Synthetic)</h5>
              True coefficients: a=-0.800, b=-0.200, c=0.900, d=0.500
            </Grid.Column>
            <Grid.Column>
              <h5>Fit curve with random coefficients (before training)</h5>
              Random coefficients:
            </Grid.Column>
            <Grid.Column>
              <h5>Fit curve with learned coefficients (after training)</h5>
              Learned coefficients:
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default inject('curveStore')(observer(CurveFitting))
