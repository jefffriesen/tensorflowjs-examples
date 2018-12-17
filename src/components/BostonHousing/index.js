import React, { Component } from 'react'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import { Grid, Button, Table, Header } from 'semantic-ui-react'
import LossChart from './LossChart'

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
      currentEpoch,
      NUM_EPOCHS,
      weightsListLinearSorted
    } = this.props.bostonStore
    return (
      <div>
        <Grid columns='equal' padded>
          <Grid.Row>
            <Grid.Column>
              Recreation of the{' '}
              <a href='https://github.com/tensorflow/tfjs-examples/tree/master/boston-housing'>
                Boston Housing data example
              </a>{' '}
              for tensorflow.js
              <h3>Description</h3>
              <p>
                This example shows you how to perform regression with more than
                one input feature using the Boston Housing Dataset, which is a
                famous dataset derived from information collected by the U.S.
                Census Service concerning housing in the area of Boston
                Massachusetts.
              </p>
              <p>
                It allows you to compare the perfomance of 3 different models
                for predicting the house prices. When training the linear model,
                it will also display the largest 5 weights (by absolute value)
                of the model and the feature associated with each of those
                weights.
              </p>
              <h3>Status</h3>
              <p>Data is now available as tensors. TODO</p>
              <p>Click a train button to begin.</p>
              <p>Baseline loss (meanSquaredError) is TODO</p>
              <h3>Training Progress</h3>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {/* Linear Regression */}
            <Grid.Column>
              <Button fluid color='orange' onClick={this.trainLinearRegressor}>
                Train Linear Regressor
              </Button>
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
            </Grid.Column>

            {/* Neural Network 1 */}
            <Grid.Column>
              <Button fluid color='orange' onClick={this.trainLinearNN1}>
                Train Neural Network Regressor (1 hidden layer)
              </Button>
              <h4>Training Progress</h4>
            </Grid.Column>

            {/* Neural Network 2 */}
            <Grid.Column>
              <Button fluid color='orange' onClick={this.trainLinearNN2}>
                Train Neural Network Regressor (2 hidden layers)
              </Button>
              <h4>Training Progress</h4>
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

const WeightsMagnitudeTable = ({ weights }) => {
  return (
    <Table basic='very' compact='very'>
      <Table.Body>
        {_.map(weights, ({ description, value }) => {
          return (
            <Table.Row key={description}>
              <Table.Cell>{description}</Table.Cell>
              <Table.Cell textAlign='right'>
                <Header as='h5' color={value > 0 ? 'green' : 'red'}>
                  {value}
                </Header>
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}
