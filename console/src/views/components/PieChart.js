import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef(); // this.refs.current
    this.createPieChart = this.createPieChart.bind(this);
  }

  // https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes
  static propTypes = {
    url: PropTypes.string,
    data: PropTypes.array,
  };

  static defaultProps = {
    url: '',
    data: [{ name: '', value: '' }],
  };

  componentDidMount() {
    // console.log(this.props.data);
    // console.log(this.myRef.current);
    this.createPieChart();
  }

  createPieChart() {
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

    // https://github.com/d3/d3-scale-chromatic/blob/master/README.md
    // const color = d3.scaleOrdinal(d3.schemePaired);
    const color = d3.scaleOrdinal(['#ff7f0e', '#1f77b4']);

    const arc = d3
      .arc()
      .innerRadius(80)
      .outerRadius(outerRadius)
      .cornerRadius(12);

    const svg = d3
      .select(this.myRef.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    // The <g> SVG element is a container used to group other SVG elements.
    const g = svg
      .append('g')
      // .attr('opacity', '.6')
      .attr('stroke', 'transparent')
      .selectAll('path')
      .data(pie(this.props.data));

    // The <path> SVG element is the generic element to define a shape.
    g.join('path') // enter + append
      // .enter()
      // .append('path')
      .attr('fill', d => color(d.data.name))
      // .attr("stroke", "black")
      // .style("stroke-width", "2px")
      .attr('d', arc);

    // The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
    // g.append('title').text(d => `${d.data.name}: ${d.data.value}`);

    // The SVG <text> element draws a graphics element consisting of text.
    g.join('text')
      // .enter()
      // .append('text')
      .style('font-size', '3.5vw')
      .style('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .attr('fill', '#FFF')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      // .text(d => `${d.data.name}: ${d.data.value}`);
      .text(d => {
        if (d.data.name === 'object') {
          return;
        }
        return `${d.data.value}`;
      });
  }

  render() {
    return (
      <>
        <div className="col-md-3 my-3">
          <h3>{this.props.data.object}</h3>
          <svg className="pie-container" ref={this.myRef} />
        </div>
      </>
    );
  }
}

export default PieChart;
