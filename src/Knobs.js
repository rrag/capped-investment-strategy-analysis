import React from 'react';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider, { Range } from 'rc-slider';

const wrapperStyle = { width: 400, margin: 50 };

function Knobs(props) {
  const { capPercent, timePeriod, dateRange } = props
  const { onTimePeriodChange, onCapPercentChange } = props
  const [start, end] = timePeriod
  const [min, max] = dateRange

  return (
    <div>
        <div style={wrapperStyle}>
        <p>Cap = {capPercent}%</p>
        <Slider min={0} max={20}
            defaultValue={capPercent}
            step={0.5}
            onChange={onCapPercentChange} />
        </div>
        <div style={wrapperStyle}>
        <p>For time period {start} - {end}</p>
        <Range min={min} max={max} defaultValue={timePeriod} allowCross={false} pushable
            onChange={onTimePeriodChange} />
        </div>
    </div>
  );
}

export default Knobs;
