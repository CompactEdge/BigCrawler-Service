import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class D3PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.refPieChart = React.createRef(); // this.refs.current
    this.handleCreatePieChart = this.handleCreatePieChart.bind(this);
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
    if (!this.props.init) {
      this.handleCreatePieChart();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      // TODO: 컴포넌트를 지우지 않고 데이터 갱신만 되어야 함
      d3.select(this.refPieChart.current).select('svg').remove();
      d3.select(this.refPieChart.current).select('.pie-tooltip').remove();
      this.handleCreatePieChart();
    }
  }

  handleCreatePieChart() {
    // https://observablehq.com/@d3/pie-settings?collection=@d3/d3-shape
    const width = 750;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const outerRadius = radius - 1;
    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.value)
      .padAngle(0.03);

    const arc = d3
      .arc()
      .innerRadius(120)
      .outerRadius(outerRadius)
      .cornerRadius(12);

    const svg = d3
      .select(this.refPieChart.current)
      .append('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const title = this.props.data.find(d => {
      return d.name === 'object';
    });
    // The SVG <text> element draws a graphics element consisting of text.
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '30')
      .attr('font-weight', '500')
      .text(title.value);

    // The <g> SVG element is a container used to group other SVG elements.
    const g = svg
      .append('g')
      .selectAll('path')
      .data(
        pie(
          this.props.data.filter(d => {
            return d.name !== 'object' && d.value !== 0;
          }),
        ),
      );

    // prettier-ignore
    const tooltip = d3.select(this.refPieChart.current).append('div').attr('class', 'pie-tooltip tooltip');
    tooltip.append('div').attr('class', 'label');
    tooltip.append('div').attr('class', 'count');

    // https://github.com/d3/d3-scale-chromatic/blob/master/README.md
    // const color = d3.scaleOrdinal(d3.schemePaired);
    // prettier-ignore
    // const color = d3.scaleOrdinal([
    //   '#1f77b4',
    //   '#ff7f0e',
    //   '#a9a9a9',
    // ]);

    // The <path> SVG element is the generic element to define a shape.
    g.join('path') // enter + append
      // .enter()
      // .append('path')
      // .attr('fill', d => chart(d.data.name))
      .attr('fill', d => {
        if (d.data.name === 'running') {
          // return color(0)
          return '#1f77b4';
        }
        if (d.data.name === 'fail') {
          // return color(1)
          return '#ff7f0e';
        }
      })
      // .attr("stroke", "black")
      // .style("stroke-width", "2px")
      .on('mouseover', function (e, d) {
        const current = this;
        svg
          .selectAll('path')
          .filter(function () {
            return this !== current;
          })
          .transition()
          .duration(200)
          .style('opacity', '.3');

          tooltip
          .select('.label')
          .html(d.data.name.toUpperCase())
          .style('color', '#000');
          tooltip.select('.count').html(d.data.value);

        })
        .on('mousemove', function (e) {
          tooltip.style('display', 'block').style('opacity', 1);
        // console.log(e);
        tooltip
          .style('top', e.layerY + 15 + 'px')
          .style('left', e.layerX + 25 + 'px');
      })
      .on('mouseout', function () {
        const current = this;
        // console.log(this)
        d3.select(this).style('opacity', 1);
        svg
          .selectAll('path')
          .filter(function () {
            return this !== current;
          })
          .transition()
          .duration(200)
          .style('opacity', 1);

        tooltip.style('display', 'none').style('opacity', 0);
      })
      .attr('d', arc);
    // TODO: update data with transition animation
    // .transition()
    // .duration(750)
    // .attrTween('d', function (d) {
    //   var interpolate = d3.interpolate(this._current, d);
    //   this._current = interpolate(0);
    //   return function (t) {
    //     return arc(interpolate(t));
    //   };
    // });

    // The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
    // g.append('title').text(d => `${d.data.name}: ${d.data.value}`);

    // g.join('text')
    //   // .enter()
    //   // .append('text')
    //   .style('font-size', '3.5vw')
    //   .style('font-weight', 'bold')
    //   .attr('font-family', 'sans-serif')
    //   .attr('fill', '#FFF')
    //   .attr('text-anchor', 'middle')
    //   .attr('dominant-baseline', 'middle')
    //   .attr('transform', d => `translate(${arc.centroid(d)})`)
    //   // .text(d => `${d.data.name}: ${d.data.value}`);
    //   .text(d => {
    //     if (d.data.name === 'object') {
    //       return;
    //     }
    //     return `${d.data.value}`;
    //   });
  }

  render() {
    return (
      <>
        <div className="chart-container" ref={this.refPieChart} />
      </>
    );
  }
}

export default D3PieChart;
