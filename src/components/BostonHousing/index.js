import React, { Component } from 'react'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import { Grid, Button, Header, Segment } from 'semantic-ui-react'
import LossChart from './LossChart'
import { PrimaryHeader } from '../Elements/Header'
import { WeightsMagnitudeTable, ModelParametersTable } from './tables'

class BostonHousing extends Component {
  trainLinearRegressor = () => {
    console.log('training linear regressor')
    this.props.bostonStore.trainLinearRegressor()
  }

  trainLinearNN1 = () => {
    console.log('training Neural Network Regressor (1 hidden layer)')
  }

  trainLinearNN2 = () => {
    console.log('training Neural Network Regressor (2 hidden layers)')
  }

  render() {
    const {
      bostonDataIsLoading,
      currentEpoch,
      baseline,
      NUM_EPOCHS,
      BATCH_SIZE,
      LEARNING_RATE,
      numFeatures,
      baselineLoss,
      weightsListLinearSorted
    } = this.props.bostonStore
    return (
      <div>
        <Grid columns='equal' padded divided>
          <Grid.Row>
            <Grid.Column>
              <Segment basic>
                <Header as='h1'>Multivariate Regression</Header>
                <Header as='h3'>
                  Compare different models for housing price prediction.
                </Header>
                <p>
                  Recreation of the{' '}
                  <a href='https://github.com/tensorflow/tfjs-examples/tree/master/boston-housing'>
                    Boston Housing data example
                  </a>{' '}
                  using React and Recharts (instead of tfjs-vis).
                </p>
              </Segment>
              <PrimaryHeader>Description</PrimaryHeader>
              <Segment basic>
                <p>
                  This example shows you how to perform regression with more
                  than one input feature using the Boston Housing Dataset, which
                  is a famous dataset derived from information collected by the
                  U.S. Census Service concerning housing in the area of Boston
                  Massachusetts.
                </p>
                <p>
                  It allows you to compare the perfomance of 3 different models
                  for predicting the house prices. When training the linear
                  model, it will also display the weights (by absolute value) of
                  the model and the feature associated with each of those
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
                  baselineLoss={baselineLoss}
                />
              </Segment>
              <PrimaryHeader>Training Progress</PrimaryHeader>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {/* Linear Regression */}
            <Grid.Column>
              {!_.isEmpty(weightsListLinearSorted) && (
                <div>
                  <LossChart modelName='linear' />
                  <h4>
                    Epoch {currentEpoch.linear + 1} of {NUM_EPOCHS} completed
                  </h4>
                  <h4>Weights by absolute magnitude</h4>
                  <WeightsMagnitudeTable weights={weightsListLinearSorted} />
                </div>
              )}
              <Button
                fluid
                color='orange'
                disabled={bostonDataIsLoading}
                onClick={this.trainLinearRegressor}>
                Train Linear Regressor
              </Button>
            </Grid.Column>

            {/* Neural Network 1 */}
            <Grid.Column>
              <Button fluid color='orange' onClick={this.trainLinearNN1}>
                Train Neural Network Regressor (1 hidden layer)
              </Button>
            </Grid.Column>

            {/* Neural Network 2 */}
            <Grid.Column>
              <Button fluid color='orange' onClick={this.trainLinearNN2}>
                Train Neural Network Regressor (2 hidden layers)
              </Button>
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
