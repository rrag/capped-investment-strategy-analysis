import React from 'react';
import { range } from 'd3-array'


function Chart(props) {
  const { dataToPlot, height, width, margin } = props
  const { stroke, fontFamily, fontSize } = props
  const maxLength = dataToPlot.length - 1

  /*
  const [first, ...rest] = dataToPlot
  rest.map(each => {
    const percentIncrease = (each.close - first.close) / first.close
  }
  */

  const yDomain = dataToPlot.reduce((a, b) => {
    // return [Math.min(a[0], b.close), Math.max(a[1], b.close)]
    return [
      Math.min(a[0], b.cappedPerformance, b.spyPerformance),
      Math.max(a[1], b.cappedPerformance, b.spyPerformance)
    ]
  }, [Infinity, -Infinity])

  const yMin = Math.min(yDomain[0], yDomain[1])
  const yMax = Math.max(yDomain[0], yDomain[1])

  const xScale = idx => idx / maxLength * width
  const yScale = yValue => height - (yValue - yMin) / (yMax - yMin) * height

  const [first, ...rest] = dataToPlot.map((d, idx) => {
    const x = xScale(idx)
    // const y = yScale(d.close)
    const y1 = yScale(d.cappedPerformance)
    const y2 = yScale(d.spyPerformance)
    return { x, y1, y2 }
  })
  const numberOfYTicks = 5
  const tickIncrement = (yMax - yMin) / numberOfYTicks
  const yTicks = [...range(yMin, yMax, tickIncrement), yMax]

  const d1 = rest.reduce((a, b) => {
      return a + ` L${b.x}, ${b.y1}`
    }, `M${first.x}, ${first.y1}`)
  const d2 = rest.reduce((a, b) => {
      return a + ` L${b.x}, ${b.y2}`
    }, `M${first.x}, ${first.y2}`)

  return (
    <svg height={height + margin.top + margin.bottom}
        width={width + margin.left + margin.right}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <path d={d1} fill="none" stroke={stroke.capped} />
      </g>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <path d={d2} fill="none" stroke={stroke.spy} />
      </g>
      <g transform={`translate(${margin.left}, ${margin.top + height})`}>
        <line x1={0} y1={0} x2={width} y2={0} stroke="black" />
        {dataToPlot.map((each, idx) => {
          const x = xScale(idx)
          return <g key={idx}>
            <line x1={x} y1={0}
              x2={x} y2={5} stroke="black" />
            <text
              x={x}
              y={20}
              fontFamily={fontFamily}
              fontSize={fontSize}
              textAnchor="middle">{each.date.getUTCFullYear()}</text>
          </g>
        })}
      </g>
      <g transform={`translate(${margin.left + width}, ${margin.top})`}>
        <line x1={0} y1={0} x2={0} y2={height} stroke="black" />
        {yTicks.map((each, idx) => {
          const value = Math.round(each)
          const y = yScale(value)
          return <g key={idx}>
            <line x1={0} y1={y}
              x2={5} y2={y} stroke="black" />
            <text
              x={10}
              y={y}
              fontFamily={fontFamily}
              fontSize={fontSize}
              alignmentBaseline="middle">{`${value} %`}</text>
          </g>
        })}
      </g>
      <g transform={`translate(${margin.left}, ${margin.top + height + 30})`}>
        <g transform={`translate(${width / 3 - 30}, 0)`}>
          <rect x={0} y={0} height={20} width={30} fill={stroke.spy} />
          <text x={35} y={14}
            fontFamily={fontFamily}
            fontSize={fontSize + 2}>S&P</text>
        </g>
        <g transform={`translate(${width / 3 * 2 - 30}, 0)`}>
          <rect x={0} y={0} height={20} width={30} fill={stroke.capped} />
          <text x={35} y={14}
            fontFamily={fontFamily}
            fontSize={fontSize + 2}>Capped</text>
        </g>
      </g>
    </svg>
  );
}

export default Chart;

Chart.defaultProps = {
  height: 300,
  width: 600,
    margin: {
    top: 20,
    right: 70,
    left: 20,
    bottom: 50,
  },
  stroke: {
    spy: "steelblue",
    capped: "crimson"
  },
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
}
