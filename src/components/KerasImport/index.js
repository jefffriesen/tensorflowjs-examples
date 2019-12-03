import React, { Component } from 'react'
// import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import { Grid, Segment } from 'semantic-ui-react'
// import ActualVsPredicted from '../charts/ActualVsPredicted'
import { PrimaryHeader } from '../Elements/Header'
import { Helmet } from 'react-helmet'

class KerasImport extends Component {
  render() {
    // const {} = this.props.KerasImportStore
    return (
      <div>
        <Helmet>
          <title>Import Trained Keras Model</title>
        </Helmet>
        <Grid columns="equal" padded divided>
          <Grid.Row>
            <Grid.Column>
              <Segment basic>
                <h1>Import Trained Keras Model</h1>
                <h1>TODO</h1>
              </Segment>
              <PrimaryHeader>Description</PrimaryHeader>
              <Segment basic>
                <p>TODO</p>
              </Segment>
              <PrimaryHeader>Status</PrimaryHeader>

              <PrimaryHeader>Training Progress</PrimaryHeader>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column></Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default inject('bostonStore')(observer(KerasImport))
