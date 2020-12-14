import React, { useState, useEffect, useRef } from 'react';

import * as d3 from 'd3';

const D3StackedAreaChart = ({
  id,
  unit,
  metric,
  data,
  init,
  range,
  extent,
  setExtent,
}) => {
  const [isBrush, setIsBrush] = useState(false);
  const stackedAreaChartRef = useRef();
  let dataUnit = unit;

  useEffect(() => {
    if (!isBrush) {
      d3.select(stackedAreaChartRef.current.firstElementChild).remove();
      if (!init && data.length > 0) {
        handleCreateStackedAreaChart();
      } else {
        d3.select(stackedAreaChartRef.current)
          .append('text')
          .attr('text-anchor', 'end')
          .attr('x', 100)
          .attr('y', 10)
          .text('No Data');
      }
    }
  }, [data, init, range, extent]);

  const handleUnderTen = num => (num < 10 ? '0' + num : num);

  const dateFormat = date => {
    const year = date.getFullYear();
    const month = handleUnderTen(date.getMonth() + 1);
    const day = handleUnderTen(date.getDate());
    const hour = handleUnderTen(date.getHours());
    const minutes = handleUnderTen(date.getMinutes());
    const second = handleUnderTen(date.getSeconds());
    return `${year}-${month}-${day} ${hour}:${minutes}:${second}`;
  };

  const handleConverToEasyFormat = objectArray => {
    let form = 0;
    switch (dataUnit) {
      case 'Rate':
        form = 1;
        break;
      case 'Byte':
        form = 1 / (1000 * 1000 * 1000);
        dataUnit = 'GB';
        break;
      default:
        return false;
    }
    return objectArray.reduce((map, obj) => {
      const converted = obj.values.reduce((ret, origin) => {
        ret[origin[0]] = origin[1] * form;
        return ret;
      }, {});
      map[obj['metric'][metric]] = converted;
      return map;
    }, {});
  };

  const handleFilterTimeSeries = objectArray => {
    return objectArray
      .map(data => data.values) // select 'values'
      .reduce((a, b) => (a.length > b.length ? a : b)) // compares 'values' length
      .map(t => t[0]); // extract epoch time data from 'values'
  };

  const handleMergeMap = (ts, map) => {
    let arr = [];
    const end = ts[ts.length - 1];
    const start = end - range;
    for (let t = start; t < end; t += 30) {
      let obj = { time: t * 1000 };
      for (const key in map) {
        if (map[key][t]) {
          Object.assign(obj, { [key]: parseFloat(map[key][t]) });
        } else {
          Object.assign(obj, { [key]: 0 });
        }
      }
      arr.push(obj);
    }
    return arr;
  };

  const handleAggregateData = data => {
    return data.map(d => {
      let sum = 0;
      for (const key in d) {
        if (d.hasOwnProperty(key) && key !== 'time') {
          sum += d[key];
        }
      }
      return sum;
    });
  };

  const handleCreateStackedAreaChart = () => {
    const metricName = data.map(ns => ns['metric'][metric]);
    const customData = handleConverToEasyFormat(data);
    const timeSeries = handleFilterTimeSeries(data);
    const mergeData = handleMergeMap(timeSeries, customData);
    const totalSum = handleAggregateData(mergeData);
    const stackedData = d3.stack().keys(metricName)(mergeData);
    console.log('stackedData :', stackedData);

    const margin = { top: 30, right: 230, bottom: 30, left: 80 };
    const width = 1500 - margin.left - margin.right;
    const height = 260 - margin.top - margin.bottom;

    const svg = d3
      .select(stackedAreaChartRef.current)
      .attr('viewBox', [
        0,
        0,
        width + margin.left + margin.right,
        height + margin.top + margin.bottom,
      ]);

    const con = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const color = d3.scaleOrdinal().domain(metricName).range(d3.schemeSet2);

    const x = d3.scaleTime().range([0, width]);

    let timeFormat = '%H:%M';
    if (extent.length > 0) {
      const start = extent[0];
      const end = extent[1];
      x.domain([start, end]).range([0, width]);
      if (end - start < 7 * 60 * 1000) {
        timeFormat = '%H:%M:%S';
      }
    } else {
      x.domain(d3.extent(mergeData, d => d.time));
    }

    const xAxis = con
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'grid');

    if (extent.length > 0) {
      xAxis.call(
        d3
          .axisBottom(x)
          .tickFormat(d3.timeFormat(timeFormat))
          .ticks(10)
          .tickSize(-height),
      );
    } else {
      xAxis.call(
        d3
          .axisBottom(x)
          .tickFormat(d3.timeFormat(timeFormat))
          .tickSize(-height),
      );
    }

    con
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', width / 2)
      .attr('y', height + 30)
      .text('Time');

    const yMax = d3.max(totalSum);
    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0]);

    con
      .append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y).ticks(5).tickSize(-width));

    con
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', -40)
      .attr('y', -10)
      .text(dataUnit)
      .attr('text-anchor', 'start');

    con
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0);

    // Add brushing
    const brush = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on('start', () => setIsBrush(true))
      .on('end', updateChart); // Each time the brush selection changes, trigger the 'updateChart' function
    // Create the scatter variable: where both the circles and the brush take place
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/clip-path
    const areaChart = con.append('g').attr('clip-path', 'url(#clip)');

    const areaGenerator = d3
      .area()
      .x(d => x(d.data.time))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    // Show the areas
    areaChart
      .selectAll('mylayers')
      .data(stackedData)
      .enter()
      .append('path')
      .attr('class', d => `myArea ${d.key} ${id}`)
      .style('fill', d => color(d.key))
      .attr('d', areaGenerator);

    areaChart.select('.focus-line').remove();
    const focusLine = areaChart
      .append('rect')
      .attr('class', 'focus-line')
      .style('fill', 'red')
      .style('width', 1)
      .style('height', height)
      .style('opacity', 0);

    d3.select(stackedAreaChartRef.current.parentElement)
      .select('.tooltip')
      .remove();
    const tooltip = d3
      .select(stackedAreaChartRef.current.parentElement)
      .append('div')
      .attr('class', 'area-tooltip tooltip');

    tooltip.append('div').attr('class', 'time');
    tooltip.append('div').attr('class', 'label');

    const handleMousemoveGrid = e => {
      focusLine.style('opacity', 1);
      tooltip.style('opacity', 1);
      const range = x.domain();
      const rangeValue = 1190;
      const start = range[0];
      const end = range[1];
      const step = (end - start) / rangeValue;
      const pointer = d3.pointer(e);
      const selectedX = step * pointer[0];
      const timeX = start.getTime() + selectedX;
      let time;
      let tooltipData = {};
      stackedData.forEach(data => {
        const key = data.key;
        data.some(v => {
          tooltipData = {
            ...tooltipData,
            [key]: v.data[key],
          };
          time = v.data.time;
          return v.data.time >= timeX - 30 * 1000;
        });
      });
      focusLine.attr('x', pointer[0]);
      const keys = Object.keys(tooltipData);
      tooltip.select('div.time').html(dateFormat(new Date(time)));
      tooltip.select('div.label').html(
        keys
          .map(
            v => `
              <div>
                <div class='key'>
                  <div class='rect' style='background: ${color(v)}'></div>
                  <span class='name'>
                    ${v.substr(0, 20)}${v.length > 20 ? '... :' : ':'}
                 </span>
                </div>
                <span class='value'>
                  ${tooltipData[v].toFixed(4)}
                </span>
              </div>
            `,
          )
          .join(''),
      );
      const svgWidth = parseFloat(svg.style('width').replace('px', ''));
      const tooltipWidth = parseFloat(tooltip.style('width').replace('px', ''));

      tooltip
        .style('top', `${e.layerY + 10}px`)
        .style(
          'left',
          `${
            svgWidth - e.offsetX < tooltipWidth
              ? e.layerX - tooltipWidth + 6
              : e.layerX + 25
          }px`,
        );
    };

    const handleMouseleaveGrid = () => {
      focusLine.style('opacity', 0);
      tooltip.style('opacity', 0);
    };

    const handleDblClickGrid = () => {
      setExtent(d3.extent(mergeData, d => d.time));
    };

    // Add the brushing
    areaChart
      .append('g')
      .attr('class', 'brush')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mousemove', handleMousemoveGrid)
      .on('mouseleave', handleMouseleaveGrid)
      .on('dblclick', handleDblClickGrid)
      .call(brush);

    var idleTimeout;
    function idled() {
      idleTimeout = null;
    }
    //extent [0~1190];
    function updateChart({ selection }) {
      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!selection) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
        x.domain(d3.extent(mergeData, d => d.time));
      } else {
        const start = x.invert(selection[0]).getTime();
        const end = x.invert(selection[1]).getTime();
        setExtent([start, end]);
        x.domain([start, end]);
        if (end - start < 7 * 60 * 1000) {
          timeFormat = '%H:%M:%S';
        } else {
          timeFormat = '%H:%M';
        }
        areaChart.select('.brush').call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.call(
        d3
          .axisBottom(x)
          .tickFormat(d3.timeFormat(timeFormat))
          .ticks(10)
          .tickSize(-height),
      );
      areaChart.selectAll('path').attr('d', areaGenerator);
      setIsBrush(false);
    }

    //////////
    // HIGHLIGHT GROUP //
    //////////

    // What to do when one group is hovered
    const highlight = e => {
      // reduce opacity of all groups
      d3.selectAll(`.myArea.${id}`).style('opacity', 0.1);
      // expect the one that is hovered
      d3.select(`.${e.target.__data__}.${id}`).style('opacity', 1);
    };

    // And when it is not hovered anymore
    const noHighlight = () => d3.selectAll(`.myArea.${id}`).style('opacity', 1);

    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    const size = 20;

    con
      .selectAll('myrect')
      .data(metricName)
      .enter()
      .append('rect')
      .attr('x', width + size)
      .attr('y', function (d, i) {
        return 10 + i * (size + 5);
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('width', size)
      .attr('height', size)
      .style('fill', function (d) {
        return color(d);
      })
      .style('rx', size / 2)
      .style('cursor', 'pointer')
      .on('mouseover', highlight)
      .on('mouseleave', noHighlight);

    // Add one dot in the legend for each name.
    con
      .selectAll('mylabels')
      .data(metricName)
      .enter()
      .append('text')
      .attr('x', width + size * 2.2)
      // .attr('x', 400 + size * 1.2)
      .attr('y', function (d, i) {
        return 10 + i * (size + 5) + size / 2;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style('fill', function (d) {
        return color(d);
      })
      .text(function (d) {
        return d;
      })
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .style('cursor', 'pointer')
      .on('mouseover', highlight)
      .on('mouseleave', noHighlight);
  };

  return (
    <>
      {/* <div className="col-md-3 my-3"> */}
      <div className="col-md-12">
        <svg className="chart-container" ref={stackedAreaChartRef} />
      </div>
    </>
  );
};

export default D3StackedAreaChart;
