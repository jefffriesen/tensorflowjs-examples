import _ from 'lodash'
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid, Loader, Header } from 'semantic-ui-react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

class CurveFitting extends Component {
  render() {
    const {
      plottableTrainingData,
      plottablePredictionsBeforeTraining,
      plottablePredictionsAfterTraining,
      isTraining,
      trainedCoefficientVals,
      seedCoefficientVals,
      trueCoefficientVals
    } = this.props.curveStore

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
              <ChartTitle
                title='Original Data (Synthetic)'
                coeffTitle='True coefficients'
                coeff={trueCoefficientVals}
              />
              <PredictionChart
                plottableTrainingData={plottableTrainingData}
                isTraining={false}
              />
            </Grid.Column>
            <Grid.Column>
              <ChartTitle
                title='Fit curve with random coefficients (before training)'
                coeffTitle='Seed coefficients'
                coeff={seedCoefficientVals}
              />
              <PredictionChart
                plottableTrainingData={plottableTrainingData}
                plottablePredictions={plottablePredictionsBeforeTraining}
                predictionLegend='Prediction Before Training'
                isTraining={false}
              />
            </Grid.Column>
            <Grid.Column>
              <ChartTitle
                title='Fit curve with learned coefficients (after training)'
                coeffTitle='Learned coefficients'
                coeff={trainedCoefficientVals}
              />
              <PredictionChart
                plottableTrainingData={plottableTrainingData}
                plottablePredictions={plottablePredictionsAfterTraining}
                predictionLegend='Prediction After Training'
                isTraining={isTraining}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default inject('curveStore')(observer(CurveFitting))

const ChartTitle = ({ title, coeffTitle, coeff }) => {
  return (
    <div>
      <Header as='h3'>{title}</Header>
      <div>
        {coeffTitle}:{' '}
        {_.isEmpty(coeff) ? (
          <Loader active inline size='mini' />
        ) : (
          <CoefficientTable coeff={coeff} />
        )}
      </div>
    </div>
  )
}

const CoefficientTable = ({ coeff }) => {
  return (
    <span>
      a: {coeff.a}, b: {coeff.b}, c: {coeff.c}, d: {coeff.d}
    </span>
  )
}

const PredictionChart = ({
  plottableTrainingData,
  plottablePredictions,
  predictionLegend,
  isTraining
}) => {
  return (
    <div>
      <Loader
        active={isTraining}
        inline='centered'
        style={{ position: 'absolute', top: '40%', left: '50%' }}
      />
      <ResponsiveContainer height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
          {plottablePredictions && (
            <Scatter
              name={predictionLegend}
              data={plottablePredictions}
              fill='#FF6346'
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
