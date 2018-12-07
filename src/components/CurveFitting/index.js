import * as _ from 'lodash'
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid } from 'semantic-ui-react'
import {
  ComposedChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

class CurveFitting extends Component {
  render() {
    const {
      plottableTrainingData,
      plottablePredictionsBeforeTraining
    } = this.props.curveStore

    // Composite scatter charts need both an x and y, instead of a 'pred' key
    // TODO: Do I want to move this step to the store?
    const predictionsBeforeTraining = _.map(
      plottablePredictionsBeforeTraining,
      row => {
        const picked = _.pick(row, ['x', 'pred'])
        return _.mapKeys(picked, (val, key) => (key === 'pred' ? 'y' : key))
      }
    )

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
              <ScatterChart
                width={400}
                height={400}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis dataKey={'x'} type='number' />
                <YAxis dataKey={'y'} type='number' />
                <Scatter data={plottableTrainingData} fill='#83A1C3' />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
              </ScatterChart>
            </Grid.Column>
            <Grid.Column>
              <h5>Fit curve with random coefficients (before training)</h5>
              Random coefficients:
              <ScatterChart
                width={400}
                height={400}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type='number' dataKey={'x'} />
                <YAxis type='number' dataKey={'y'} />
                <CartesianGrid />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter
                  name='Training data'
                  data={plottableTrainingData}
                  fill='#83A1C3'
                />
                <Scatter
                  name='Prediction Before Training'
                  data={predictionsBeforeTraining}
                  fill='#FF6346'
                />
              </ScatterChart>
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
