import React, { Component } from 'react';
import './App.css';

import { getCappedStrategyVsSPYPercentChange } from "./performanceCalculator"
import Knobs from "./Knobs"
import Chart from "./Chart"
import PerformanceSummary from "./PerformanceSummary"

class App extends Component {
  constructor(props) {
    super(props)
    this.handleCapPercentChange = this.handleCapPercentChange.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
    this.state = {
      capPercent: 3,
      timePeriod: [2004, 2016],
    }
  }
  handleCapPercentChange(value) {
    this.setState({
      capPercent: value
    })
  }
  handleRangeChange(value) {
    this.setState({
      timePeriod: value
    })
  }
  componentDidMount() {
    fetch("data/spy.csv")
		  .then(response => response.text())
		  .then(text => {
        // eslint-disable-next-line no-unused-vars
        const [head, ...rows] = text.split("\n")
        const data = rows.reverse()
          .filter(each => each.length > 0)
          .map(each => each.split(","))
          .filter(cols => cols[0].indexOf("-01-") > -1) // remove every month which is not Jan
          .map(cols => {
            return {
              date: new Date(cols[0]),
              close: Number(cols[6])
            }
          })
        return data
      })
      .then(data => {
        this.setState({
          data
        })
      })
  }
  render() {
    const { capPercent, timePeriod, data } = this.state
    if (!data) {
      return <div>Loading...</div>
    }
    const firstYear = data[0].date.getUTCFullYear()
    const lastYear = data[data.length - 1].date.getUTCFullYear()

    const dataToPlot = getCappedStrategyVsSPYPercentChange(
      data,
      timePeriod,
      capPercent
    )

    const allTimePeriods = getAllContinuousTimePeriodsBetween(timePeriod)
    const allDataToPlot = getDataToPlotForAllPeriods(allTimePeriods, data, capPercent)

    const spyWinCount = allDataToPlot
      .filter(each => {
        const last = each[each.length - 1]
        return last.spyPerformance > last.cappedPerformance
      }).length
    return (
      <div className="App">
        <div className="App-header">
          <h2>Capped strategy vs SPY performance comparison</h2>
        </div>
        <Knobs
          capPercent={capPercent}
          timePeriod={timePeriod}
          dateRange={[firstYear, lastYear]}
          onTimePeriodChange={this.handleRangeChange}
          onCapPercentChange={this.handleCapPercentChange}
          />
        <Chart dataToPlot={dataToPlot} />
        <PerformanceSummary
          list={[dataToPlot]} />
        <hr />
        <h3>{`${allTimePeriods.length} time segments in ${timePeriod[0]} - ${timePeriod[1]}`}</h3>
        <span>{`S&P Wins ${spyWinCount} / ${allTimePeriods.length}`}</span>
        <span>{`, Cap Wins ${allTimePeriods.length - spyWinCount} / ${allTimePeriods.length}`}</span>
        <PerformanceSummary
            list={allDataToPlot} />
      </div>
    );
  }
}

export default App;

function getDataToPlotForAllPeriods(allTimePeriods, data, capPercent) {
  return allTimePeriods.map((each, idx) => {
    const dataToPlot = getCappedStrategyVsSPYPercentChange(
      data,
      each,
      capPercent
    )
    return dataToPlot
  })
}

function getAllContinuousTimePeriodsBetween([start, end]) {
  let periods = []
  for (let i = start; i <= end; i++) {
    const maxLength = end - i
    for (let j = 1; j <= maxLength; j++) {
      periods.push([i, i + j])
    }
  }
  return periods
}