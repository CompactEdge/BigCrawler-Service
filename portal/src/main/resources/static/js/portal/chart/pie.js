let pieOption = {
  title: {
    text: '',
    // subtext: 'subtext',
    left: 'center',
    // top: 'top',
    // top: 'middle',
    top: 'bottom',
    textStyle: {
      // color: '#fff',
      color: '#000',
      fontWeight: 'bold',
      fontSize: 18,
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)'
  },
  series: [
    {
      // name: '', {a}
      type: 'pie',
      // radius: ['65%', '90%'],
      center: ['50%', '50%'],
      // data: seriesData.seriesData,
      data: [],
      label: {
        show: true,
        // position: 'center',
        position: 'inside',
        formatter: '{value|{c}}',
        rich: {
          hr: {
            borderColor: '#aaa',
            width: '100%',
            borderWidth: 0.5,
            height: 1
          },
          value: {
            color: '#fff',
            // textBorderColor: '#000',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            // textShadowColor: 'transparent',
            textShadowBlur: '10',
            fontSize: 16,
            fontWeight: '800',
            padding: [10, 10],
            fontFamily: 'monospace',
            // align: 'right',
            // verticalAlign: 'middle',
            // backgroundColor: '#000',
            // borderRadius: 4,
          }
        }
      },
      color: [ '#759BFF', '#6BAEE8', '#81E6FF', '#6BE8E0', '#75FFCF' ],
      labelLine: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

function initPieChart() {
  const pieChartExists = document.querySelectorAll(".pie-chart");
  let pieChart = [];
  if (pieChartExists) {
    pieChartExists.forEach((e, i) => {
      pieChart.push(echarts.init(
        document.querySelectorAll(".pie-chart")[i],
        "default",
        { renderer: "canvas" }
      ));
    })
  }
  return pieChart;
}

function drawPieChart(data, option, chart, title, id) {
  const countK8s = countData(data, "Running");
  option.series[0].data = countK8s;
  option.title.text = title;
  chart.setOption(option, {notMerge: true, lazyUpdate: false});
  chart.off('click');
  chart.on('click', () => {
    // echarts event라 event 파라미터 없음
    // window.scroll({  // linux에서 호환되지 않음
    //   top: $(id).offset().top - 65,
    //   behavior: "smooth"
    // });
    $('html, body').animate({
      scrollTop: $(id).offset().top - 65
    }, 1000, "swing");
  });
  chart.resize();
}

function drawSvcPieChart(data, option, chart, title, id) {
  // const countServices = countService(data, "Running");
  const countServices = countService(data);
  const serviceGroupByNamespace = [];
  for (let [key, value] of Object.entries(countServices)) {
    serviceGroupByNamespace.push({ name: key, value: value });
  }

  option.series[0].data = serviceGroupByNamespace;
  option.title.text = title;
  chart.setOption(option, {notMerge: true, lazyUpdate: false});
  chart.off('click');
  chart.on('click', () => {
    // echarts event라 event 파라미터 없음
    $('html, body').animate({
      scrollTop: $(id).offset().top - 65
    }, 1000, "swing");
  });
  chart.resize();
}

function countData(data, status) {
  if (data) {
    let count = 0;
    data.forEach(val => {
      if (val.running === status) {
        count++;
      }
    });

    let seriesData = [];

    if (count !== 0) {
      seriesData.push({
        name: "Running",
        value: count,
        itemStyle: { color: "#3abd83" }
      });
    }

    if (data.length - count !== 0) {
      seriesData.push({
        name: "Fail",
        value: data.length - count,
        itemStyle: { color: "#e65f65" }
      });
    }

    return seriesData;
  }
}

function countService(services) {
  return services.reduce((acc, obj) =>
    ({
      ...acc,
      [obj.namespace]: (acc[obj.namespace] || 0) + 1
    }),
    {}
  );
}

const pie = {
  pieOption,
  initPieChart,
  drawPieChart,
  drawSvcPieChart,
}

export default pie;