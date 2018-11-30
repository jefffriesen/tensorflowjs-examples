import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Grid, Button } from 'semantic-ui-react'

class BostonHousing extends Component {
  trainLinearRegressor = () => {
    console.log('training linear regressor')
  }

  trainLinearNN1 = () => {
    console.log('training Neural Network Regressor (1 hidden layer)')
  }

  trainLinearNN2 = () => {
    console.log('training Neural Network Regressor (2 hidden layers)')
  }

  render() {
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
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button fluid color='orange' onClick={this.trainLinearRegressor}>
                Train Linear Regressor
              </Button>
              <h4>Training Progress</h4>
              <h4>Weights by magnitude</h4>
            </Grid.Column>
            <Grid.Column>
              <Button fluid color='orange' onClick={this.trainLinearNN1}>
                Train Neural Network Regressor (1 hidden layer)
              </Button>
              <h4>Training Progress</h4>
            </Grid.Column>
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

export default inject('store')(observer(BostonHousing))
