import React from 'react'
import _ from 'lodash'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { inject, observer } from 'mobx-react'

const LossChart = ({ bostonStore }) => {
  const linearRegressionData = bostonStore.trainingLogsLinear
  if (_.isEmpty(linearRegressionData)) {
    return <p>empty data</p>
  }
  return (
    <ResponsiveContainer height={400}>
      <LineChart
        key={Math.random()} // Force rerendering every time the data changes
        data={linearRegressionData}
        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
        <XAxis dataKey='epoch' />
        <YAxis />
        <CartesianGrid strokeDasharray='3 3' />
        <Tooltip />
        <Legend />
        <Line
          type='monotone'
          dataKey='loss'
          dot={false}
          stroke='#8884d8'
          activeDot={{ r: 8 }}
          isAnimationActive={false}
        />
        <Line
          type='monotone'
          dataKey='val_loss'
          dot={false}
          stroke='#82ca9d'
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default inject('bostonStore')(observer(LossChart))
