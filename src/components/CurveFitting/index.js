import _ from 'lodash'
import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid, Loader, Header, Table } from 'semantic-ui-react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot
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
              <h1>TensorFlow.js: Fitting a curve to synthetic data</h1>
              <p>
                Given some data generated using a polynomial function with some
                noise added, we'll train a model to discover the coefficients
                used to generate the data.{' '}
                <a href='https://storage.googleapis.com/tfjs-examples/polynomial-regression-core/dist/index.html'>
                  Demo
                </a>
                {', '}
                <a href='https://js.tensorflow.org/tutorials/fit-curve.html'>
                  Tutorial
                </a>
                {', '}
                <a href='https://github.com/tensorflow/tfjs-examples/tree/master/polynomial-regression-core'>
                  Repo
                </a>
              </p>
              <h4>Polynomial:</h4>
              <p>
                ax<sup>3</sup> + bx<sup>2</sup> + cx + d
              </p>
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
      <Header as='h4'>{title}</Header>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>{coeffTitle}: </Grid.Column>
          <Grid.Column width={10}>
            {_.isEmpty(coeff) ? (
              <Loader active inline size='mini' style={{ height: 73 }} />
            ) : (
              <CoefficientsTable coeff={coeff} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

const CoefficientsTable = ({ coeff }) => {
  const { a, b, c, d } = coeff
  return (
    <Table compact='very' celled size='small' basic='very'>
      <Table.Body>
        <Table.Row>
          <Table.Cell>a</Table.Cell>
          <Table.Cell>b</Table.Cell>
          <Table.Cell>c</Table.Cell>
          <Table.Cell>d</Table.Cell>
          <Table.Cell>polynomial</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>{a}</Table.Cell>
          <Table.Cell>{b}</Table.Cell>
          <Table.Cell>{c}</Table.Cell>
          <Table.Cell>{d}</Table.Cell>
          <Table.Cell>
            {a}x<sup>3</sup> + {b}x<sup>2</sup> + {c}x + {d}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
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
            shape={<Dot r={2} />}
          />
          {plottablePredictions && (
            <Scatter
              name={predictionLegend}
              data={plottablePredictions}
              fill='#FF6346'
              line
              shape={<Dot r={2} />}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
