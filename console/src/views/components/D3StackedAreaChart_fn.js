import React, { useState, useEffect, useRef } from 'react';

import * as d3 from 'd3';

const D3StackedAreaChart = props => {
  const stackedAreaChartRef = useRef();

  useEffect(() => {
    console.log(props);
    if (!props.init) {
      handleCreateStackedAreaChart();
    }
  }, []);

  const handleConverToEasyFormat = objectArray => {
    return objectArray.reduce((map, obj) => {
      const converted = obj.values.reduce((ret, origin) => {
        ret[origin[0]] = origin[1];
        return ret;
      }, {});
      map[obj['metric'][props.metric]] = converted;
      return map;
    }, {});
  };

  const handleFilterTimeSeries = objectArray => {
    return objectArray
      .map(dat => dat.values) // select 'values'
      .reduce((a, b) => (a.length > b.length ? a : b)) // compares 'values' length
      .map(t => t[0]); // extract epoch time data from 'values'
  };

  const handleMergeMap = (ts, map) => {
    let arr = [];
    for (let t = ts[0]; t < ts[ts.length - 1]; t += 30) {
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
    const metricName = props.data.map(ns => ns['metric'][props.metric]);
    const data = props.data;
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
      ])
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const color = d3.scaleOrdinal().domain(metricName).range(d3.schemeSet2);

    const x = d3
      .scaleTime()
      .domain(d3.extent(mergeData, d => d.time))
      .range([0, width]);

    const xAxis = svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M')));

    svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', width + 40)
      .attr('y', height + 10)
      .text('Time');

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(totalSum)])
      .range([height, 0]);

    svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', -40)
      .attr('y', -10)
      .text(props.unit)
      .attr('text-anchor', 'start');

    svg.append('g').call(d3.axisLeft(y).ticks(5));

    svg
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
      .on('end', updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the scatter variable: where both the circles and the brush take place
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/clip-path
    const areaChart = svg.append('g').attr('clip-path', 'url(#clip)');

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
      .attr('class', d => `myArea ${d.key} ${props.id}`)
      .style('fill', d => color(d.key))
      .attr('d', areaGenerator);

    // Add the brushing
    areaChart.append('g').attr('class', 'brush').call(brush);

    var idleTimeout;
    function idled() {
      idleTimeout = null;
    }

    function updateChart(e) {
      let extent = e.selection;

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
        x.domain(d3.extent(mergeData, d => d.time));
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])]);
        areaChart.select('.brush').call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5));
      areaChart
        .selectAll('path')
        .transition()
        .duration(1000)
        .attr('d', areaGenerator);
    }

    //////////
    // HIGHLIGHT GROUP //
    //////////

    // What to do when one group is hovered
    const highlight = d => {
      // reduce opacity of all groups
      d3.selectAll(`.myArea.${props.id}`).style('opacity', 0.1);
      // expect the one that is hovered
      d3.select(`.${d.target.__data__}.${props.id}`).style('opacity', 1);
    };

    // And when it is not hovered anymore
    const noHighlight = () =>
      d3.selectAll(`.myArea.${props.id}`).style('opacity', 1);

    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    const size = 20;
    svg
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
      .on('mouseover', highlight)
      .on('mouseleave', noHighlight);

    // Add one dot in the legend for each name.
    svg
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
      .on('mouseover', highlight)
      .on('mouseleave', noHighlight);
  };

  return (
    <>
      {/* <div className="col-md-3 my-3"> */}
      <div className="col-md-12">
        <svg className="chart-container" ref={stackedAreaChartRef.current} />
      </div>
    </>
  );
};

export default D3StackedAreaChart;