import React from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import useFetch from '../../hook/useFetch';

import { url } from '../../utils/url';

const chartConfig = {
  datasets: [
    {
      label: 'Bar Chart',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'red',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    },
  ],
};

const options = { maintainAspectRatio: false, responsive: true };

const BasicBarChart = ({ config }) => {
  const csvData = useFetch({
    url: url.getDataUrl(config.dataSource),
    query: { columns: [config.xColumn, config.yColumn] },
  });

  const data = {
    labels: csvData && csvData.data[config.xColumn],
    datasets: [
      {
        data: csvData && csvData.data[config.yColumn],
        ...chartConfig.datasets[0],
      },
    ],
  };

  return <Bar data={data} options={options} />;
};
BasicBarChart.propTypes = {
  config: PropTypes.shape({
    dataSource: PropTypes.string.isRequired,
    xColumn: PropTypes.string.isRequired,
    yColumn: PropTypes.string.isRequired,
  }).isRequired,
};

export default BasicBarChart;