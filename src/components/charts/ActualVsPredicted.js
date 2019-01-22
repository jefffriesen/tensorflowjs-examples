import * as React from 'react'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  ScatterChart,
  Legend,
  ResponsiveContainer,
  Dot,
} from 'recharts'

const ActualVsPredicted = ({
  data,
  referenceLineData,
  xAccessor = 'actual',
  yAccessor = 'predicted',
  isTraining,
  predictionLegend,
}) => {
  if (isTraining) {
    return null
  }
  return (
    <ResponsiveContainer height={700}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis
          type="number"
          dataKey={xAccessor}
          domain={['dataMin', 'dataMax']}
          label={{
            value: xAccessor,
            offset: -10,
            position: 'insideBottom',
          }}
        />
        <YAxis
          type="number"
          dataKey={yAccessor}
          domain={['dataMin', 'dataMax']}
          label={{ value: yAccessor, angle: -90 }}
        />
        <CartesianGrid />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend verticalAlign="top" align="right" />
        <Scatter name="Training data" data={data} fill="#83A1C3" shape={<Dot r={1} />} />
        {referenceLineData &&
          <Scatter
            name="Reference Line"
            data={referenceLineData}
            fill="#000"
            line={{ strokeDasharray: '5 5' }}
            legendType="line"
            shape={<Dot r={0} />}
          />}
      </ScatterChart>
    </ResponsiveContainer>
  )
}

export default ActualVsPredicted
