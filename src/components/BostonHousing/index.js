import React, { Component } from 'react'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import { Grid, Button, Segment } from 'semantic-ui-react'
import LossChart from './LossChart'
import ActualVsPredicted from '../charts/ActualVsPredicted'
import { PrimaryHeader } from '../Elements/Header'
import { Helmet } from 'react-helmet'
import { WeightsMagnitudeTable, ModelParametersTable, FinalLossTable } from './tables'

class BostonHousing extends Component {
  trainLinearRegressor = () => {
    console.log('training linear regressor')
    this.props.bostonStore.trainLinearRegressor()
  }

  trainLinearNN1 = () => {
    console.log('training Neural Network Regressor (1 hidden layer)')
    this.props.bostonStore.trainNeuralNetworkLinearRegression1Hidden()
  }

  trainLinearNN2 = () => {
    console.log('training Neural Network Regressor (2 hidden layers)')
    this.props.bostonStore.trainNeuralNetworkLinearRegression2Hidden()
  }

  render() {
    const {
      bostonDataIsLoading,
      trainingState,
      currentEpoch,
      NUM_EPOCHS,
      BATCH_SIZE,
      LEARNING_RATE,
      numFeatures,
      averagePrice,
      baselineLoss,
      weightsListLinearSorted,
      readyToModel,
      plottablePredictionDataLinear,
      plottablePredictionData1Hidden,
      plottablePredictionData2Hidden,
      plottableReferenceLine,
    } = this.props.bostonStore
    return (
      <div>
        <Helmet>
          <title>Multivariate Regression in Tensorflow.js (Boston Housing)</title>
        </Helmet>
        <Grid columns="equal" padded divided>
          <Grid.Row>
            <Grid.Column>
              <Segment basic>
                <h1>Multivariate Regression</h1>
                <h2>Compare different models for housing price prediction.</h2>
                <h4>
                  A recreation of the{' '}
                  <a href="https://github.com/tensorflow/tfjs-examples/tree/master/boston-housing">
                    Boston Housing data example
                  </a>{' '}
                  using a slightly more functional approach to Tensorflow.js training and inference.
                  Views in React and Recharts (instead of tfjs-vis).
                </h4>
              </Segment>
              <PrimaryHeader>Description</PrimaryHeader>
              <Segment basic>
                <p>
                  This example shows you how to perform regression with more than one input feature
                  using the Boston Housing Dataset, which is a famous dataset derived from
                  information collected by the U.S. Census Service concerning housing in the area of
                  Boston Massachusetts.
                </p>
                <p>
                  It allows you to compare the perfomance of 3 different models for predicting the
                  house prices. When training the linear model, it will also display the weights (by
                  absolute value) of the model and the feature associated with each of those
                  weights.
                </p>
              </Segment>
              <PrimaryHeader>Status</PrimaryHeader>
              <Segment basic>
                {bostonDataIsLoading ? (
                  <p>Data is loading...</p>
                ) : (
                  <p>
                    Data is now available as tensors.{' '}
                    <strong>Click a train button to begin.</strong>
                  </p>
                )}
                <ModelParametersTable
                  NUM_EPOCHS={NUM_EPOCHS}
                  BATCH_SIZE={BATCH_SIZE}
                  LEARNING_RATE={LEARNING_RATE}
                  numFeatures={numFeatures}
                  averagePrice={averagePrice}
                  baselineLoss={baselineLoss}
                />
              </Segment>
              <PrimaryHeader>Training Progress</PrimaryHeader>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {/**
             * Linear Regression
             */}
            <Grid.Column>
              <LossChartWrapper
                modelName={'linear'}
                trainingState={trainingState}
                NUM_EPOCHS={NUM_EPOCHS}
                currentEpoch={currentEpoch}
              />
              {!_.isEmpty(weightsListLinearSorted) && (
                <div>
                  <h4>Weights by absolute magnitude</h4>
                  <WeightsMagnitudeTable weights={weightsListLinearSorted} />
                </div>
              )}
              <Button
                fluid
                color="orange"
                disabled={!readyToModel}
                onClick={this.trainLinearRegressor}>
                Train Linear Regressor
              </Button>
              <ActualVsPredicted
                data={plottablePredictionDataLinear}
                referenceLineData={plottableReferenceLine}
                isTraining={_.isEmpty(plottablePredictionDataLinear)}
              />
            </Grid.Column>

            {/**
             * Neural Network 1
             */}
            <Grid.Column>
              {trainingState['oneHidden'] !== 'None' && (
                <div>
                  <LossChart modelName="oneHidden" />
                  <h4>
                    Epoch {currentEpoch['oneHidden'] + 1} of {NUM_EPOCHS} completed
                  </h4>
                </div>
              )}
              <Button fluid color="orange" disabled={!readyToModel} onClick={this.trainLinearNN1}>
                Train Neural Network Regressor (1 hidden layer)
              </Button>
              <ActualVsPredicted
                data={plottablePredictionData1Hidden}
                referenceLineData={plottableReferenceLine}
                isTraining={_.isEmpty(plottablePredictionData1Hidden)}
              />
            </Grid.Column>

            {/**
             *Neural Network 2
             */}
            <Grid.Column>
              {trainingState['twoHidden'] !== 'None' && (
                <div>
                  <LossChart modelName="twoHidden" />
                  <h4>
                    Epoch {currentEpoch['twoHidden'] + 1} of {NUM_EPOCHS} completed
                  </h4>
                </div>
              )}
              <Button fluid color="orange" disabled={!readyToModel} onClick={this.trainLinearNN2}>
                Train Neural Network Regressor (2 hidden layers)
              </Button>
              <ActualVsPredicted
                data={plottablePredictionData2Hidden}
                referenceLineData={plottableReferenceLine}
                isTraining={_.isEmpty(plottablePredictionData2Hidden)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>{/* <ResultsSection /> */}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default inject('bostonStore')(observer(BostonHousing))

const LossChartWrapper = inject('bostonStore')(
  observer(props => {
    const { bostonStore, modelName } = props
    const { NUM_EPOCHS } = bostonStore
    const trainingState = bostonStore.trainingState[modelName]
    const currentEpoch = bostonStore.currentEpoch[modelName]
    if (trainingState === 'None') {
      return null
    }
    return (
      <div style={{ marginBottom: 20 }}>
        <LossChart modelName="linear" />
        <h4>
          Epoch {currentEpoch + 1} of {NUM_EPOCHS} completed
        </h4>
        <FinalLossTable
          isTrained={trainingState === 'Trained'}
          finalTrainSetLoss={bostonStore.finalTrainSetLoss[modelName]}
          finalValidationSetLoss={bostonStore.finalValidationSetLoss[modelName]}
          testSetLoss={bostonStore.testSetLoss[modelName]}
        />
      </div>
    )
  })
)
