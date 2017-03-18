import React from 'react';

function PerformanceSummary(props) {
  const { list } = props


  return (
    <table className="performance-comparison">
        <tbody>
        <tr>
            <th>Time period</th>
            <th>S&P</th> 
            <th>Capped</th>
        </tr>
        {list.map((each, idx) => {
            const head = each[0]
            const last = each[each.length - 1]
            const spyWins = last.spyPerformance > last.cappedPerformance
            const capWins = last.spyPerformance < last.cappedPerformance

            return <tr key={idx}>
                <td>{`${head.date.getUTCFullYear()} - ${last.date.getUTCFullYear()}`}</td>
                <td className={spyWins ? "win" : ""}>{`${last.spyPerformance} %`}</td> 
                <td className={capWins ? "win" : ""}>{`${last.cappedPerformance} %`}</td> 
            </tr>
        })}
        </tbody>
    </table>
  );
}

export default PerformanceSummary;