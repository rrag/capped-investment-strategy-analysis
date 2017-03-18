import { pairs, zip } from 'd3-array'

export function getCappedStrategyVsSPYPercentChange(
  data,
  timePeriod,
  capPercent
) {
  const spyDataToPlot = data
    .filter(each => each.date.getUTCFullYear() >= timePeriod[0]
      && each.date.getUTCFullYear() <= timePeriod[1])

  const cappedPercentIncreases = pairs(spyDataToPlot)
    .map(([prev, now]) => {
      return ((now.close - prev.close) / prev.close) * 100
    })
    .map(percent => Math.max(0, Math.min(percent, capPercent)))
  // const cappedData = spyDataToPlot

  let prev = 1
  let cumulativeBalance = [0]
  for (let i = 0; i < cappedPercentIncreases.length; i++) {
    prev *= (cappedPercentIncreases[i] / 100 + 1)
    // fix ieee error
    const increase = Math.round((prev - 1) * 10000) / 100
    cumulativeBalance.push(increase)
  }

  const [first, ...rest] = spyDataToPlot
  const spyPercentIncrease = [0, ...rest.map(each => {
    const percentIncrease = (each.close - first.close) / first.close
    const increase = Math.round(percentIncrease * 10000) / 100
    return increase
  })]

  const dataToPlot = zip(spyDataToPlot, cumulativeBalance, spyPercentIncrease)
    .map(([d, cappedIncrease, spyIncrease]) => {
      return {
        ...d,
        cappedPerformance: cappedIncrease,
        spyPerformance: spyIncrease
      }
    })
  return dataToPlot
}