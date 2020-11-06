import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class D3StackedAreaChart extends React.Component {
  constructor(props) {
    super(props);
    this.refStackedAreaChart = React.createRef(); // this.refs.current
    this.handleMergeArrayObjects = this.handleMergeArrayObjects.bind(this);
    this.handleCreateStackedAreaChart = this.handleCreateStackedAreaChart.bind(
      this,
    );
  }

  // https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
  static propTypes = {
    url: PropTypes.string,
    data: PropTypes.array,
    init: PropTypes.bool,
  };

  static defaultProps = {
    url: '',
    data: [{ name: '', value: '' }],
    init: true,
  };

  componentDidMount() {
    // console.log(this.props.data);
    // console.log(this.refStackedAreaChart.current);
    // console.log('init stacked area charts: ' + this.props.init);
    if (!this.props.init) {
      this.handleCreateStackedAreaChart();
    }
  }

  handleMergeArrayObjects(arr1, arr2, key) {
    return arr1.map((item, i) => {
      return Object.assign({}, item, arr2[i]);
      // TODO:
      // if (!item || !arr2[i]) {
      //   return Object.assign({}, item, arr2[i]);
      // }

      // try {
      //   if (item.time === arr2[i].time) {
      //     return Object.assign({}, item, arr2[i]);
      //   }
      // } catch(e) {
      //   return Object.assign({}, item, {[key]: 0});
      // }
    });
  }

  handleCreateStackedAreaChart() {
    // https://www.d3-graph-gallery.com/graph/stackedarea_template.html
    //////////
    // GENERAL
    //////////
    const namespaces = this.props.data.map(ns => ns.metric.namespace);
    // const data = this.props.data.map(dat => dat.values);
    const data = this.props.data;
    console.log(data);

    // https://github.com/prometheus/prometheus/blob/master/web/ui/react-app/src/pages/graph/GraphHelpers.ts
    // https://github.com/grafana/grafana/blob/71fffcb17c/packages/grafana-ui/src/components/Graph/Graph.tsx
    let customData = data.map(dat => {
      let ns = dat.metric.namespace;
      let mapData = dat.values.map(t => {
        return {
          time: t[0] * 1000,
          [ns]: parseFloat(t[1]) * 100,
        };
      });
      return mapData;
    });
    const timeSeries = customData
      .reduce((a, b) => (a.length > b.length ? a : b))
      .map(t => t.time);
    // console.log(timeSeries);

    const len = customData.length;
    let mergeData = customData[0];
    for (let index = 1; index < len; index++) {
      const key = Object.keys(customData[index][0]);
      if (customData[index].length < timeSeries.length) {
        console.log('find');
        // console.log(customData[index]);
        // for (let index = 0; index < timeSeries.length; index++) {
        //   if (timeSeries[index])
        // }
        // TODO:
        // customData[index].map(v => {
        //   console.log(v)
        // })

        // customData[index].forEach(c => {
        //   // console.log(c)
        //   // console.log(key)
        //   console.log(c[key[0]]);
        //   console.log(c[key[1]]);
        // });
      }
      // console.log(mergeData);
      mergeData = this.mergeArrayObjects(mergeData, customData[index], key[1]);
    }
    console.log(mergeData);
    //
    // const oneData = this.props.data
    //   .map(dat => dat.values)
    //   .reduce((acc, cur) => [...acc, ...cur], []);
    // console.log(oneData);
    const margin = { top: 60, right: 230, bottom: 50, left: 50 };
    const width = 750 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(this.refStackedAreaChart.current)
      // .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // const color = d3.scaleOrdinal(d3.schemePaired);
    const color = d3.scaleOrdinal().domain(namespaces).range(d3.schemeSet2);

    const stackedData = d3.stack().keys(namespaces)(mergeData);
    // console.log(data);
    // console.log(oneData[0][0]);
    // console.log(oneData[oneData.length - 1][0]);
    // console.log(stackedData);

    //////////
    // AXIS //
    //////////

    // Add X axis
    // https://observablehq.com/@d3/d3-scaletime
    const x = d3
      .scaleTime()
      // .domain(d3.extent(oneData, d => d[0] * 1000))
      .domain(d3.extent(mergeData, d => d.time))
      .range([0, width]);
    // .nice()

    const xAxis = svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M')));

    // Add X axis label:
    svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', width)
      .attr('y', height + 40)
      .text('Time');

    // Add Y axis label:
    svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', 0)
      .attr('y', -20)
      .text('# of Usage')
      .attr('text-anchor', 'start');

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    // const yAxis = svg
    svg.append('g').call(d3.axisLeft(y).ticks(5));

    //////////
    // BRUSHING AND CHART
    //////////

    // Add a clipPath: everything out of this area won't be drawn.
    // const clip = svg
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
    const areaChart = svg.append('g').attr('clip-path', 'url(#clip)');

    // Area generator
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
      .attr('class', d => {
        console.log(d.key);
        return 'myArea ' + d.key;
      })
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
        x.domain(
          d3.extent(mergeData, d => {
            // console.log(d);
            return d.time;
          }),
        );
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])]);
        // console.log('extent :', extent);
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
    const highlight = function (d) {
      // console.log(d.target.__data__);
      // reduce opacity of all groups
      d3.selectAll('.myArea').style('opacity', 0.1);
      // expect the one that is hovered
      d3.select('.' + d.target.__data__).style('opacity', 1);
    };

    // And when it is not hovered anymore
    const noHighlight = function (d) {
      d3.selectAll('.myArea').style('opacity', 1);
    };

    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    var size = 20;
    svg
      .selectAll('myrect')
      .data(namespaces)
      .enter()
      .append('rect')
      .attr('x', 400)
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
      .data(namespaces)
      .enter()
      .append('text')
      .attr('x', 400 + size * 1.2)
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
  }

  render() {
    return (
      <>
        {/* <div className="col-md-3 my-3"> */}
        <div className="col-md-12">
          <svg className="chart-container" ref={this.refStackedAreaChart} />
        </div>
      </>
    );
  }
}

export default D3StackedAreaChart;
