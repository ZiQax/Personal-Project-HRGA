
    let myChart, myChart2, myChart3, myChart4;
    let ctx = document.getElementById('myChart')
    let ctx2 = document.getElementById('myChart2')
    let ctx3 = document.getElementById('myChart3')

    function beforeRender() {
      for (let id in Chart.instances) {
        Chart.instances[id].destroy();
      }
    }
    async function getDataAndRender() {
      try {
        const res = await fetch('http://localhost:3000/api/peminjaman');
        const res2 = await fetch('http://localhost:3000/api/kendaraan');
        const res3 = await fetch('http://localhost:3000/api/izin');

        const data = await res.json();
        const data2 = await res2.json();
        const data3 = await res3.json();


        ctx.parentNode.style.height = '200px';
        ctx.parentNode.style.width = '100%';

        myChart = new Chart(ctx, {
         type: data.type,
          data: {
            datasets: [{
              data: data.lineChart,
              backgroundColor: data.backgroundColor,
              fill: true,
              tension: 0.4
            },
            {
              data: data.lineChart2,
              backgroundColor: data.backgroundColor2,
              fill: true,
              tension: 0.4
            }], 
            labels: data.labels
          },    

          options: {
            elements: {
              point : {
                radius: 0
              }
            },
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 20,
                bottom: 20
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true,
                  padding: 10
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Total : ${context.raw}`;
                  }
                }
              },
              legend: {
                display: true
              }
            },
            onClick: (evt, elements, chart) => {
              if (elements.length > 0) {
                let index = elements[0].index;
                const month = chart.data.labels[index];

                window.location.href = `log.html?month=${month}`;
              }
            },

          }
        });

        ctx2.parentNode.style.height = '300px';
        ctx2.parentNode.style.width = '100%';

        myChart2 = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: data2.labels,
            datasets: [{
              type: 'line',
              label: 'Peminjaman perbulan',
              data: data2.pieChart,
              fill: data2.fill,
              borderWidth: 2,
              borderColor : 'red'
            },{
              type: 'bar',
              label: 'Peminjaman perbulan',
              data: data2.pieChart2,
              fill: data2.fill,
              backgroundColor: data2.backgroundColor
            }]
          },

          options: {
            layout: {
              padding: {
                left: -100,
                right: 10,
                top: 20,
                bottom: 50
              },
              position: 'start'
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Total : ${context.raw}`;
                  }
                }
              },
              legend: {
                display: true
              }
            },
            onClick: (evt, elements, chart) => {
              if (elements.length > 0) {
                let index = elements[0].index;
                const month = chart.data.labels[index];

                window.location.href = `log.html?month=${month}`;
              }
            },

          }
        });

        ctx3.parentNode.style.height = '450px';
        ctx3.parentNode.style.width = '100%';
        const myChart3 = new Chart(ctx3, {
          type: 'bar',
          data: {
            labels: data3.labels,
            datasets: [{
              label: 'Izin',
              data: data3.barChart,
              fill: data3.fill,
              tension: 0.4,
               backgroundColor: data3.backgroundColor
            }]
          },

          options: {
            elements: {
               bar : {
                 borderRadius: 20,
                 barPercentage: 10,
                 categoryPercentage: 0.5,
                 boderSkipped: false
               },

            },
            layout: {
              padding: {
                left: 20,
                right: 30,
                top: 30,
                bottom: 30
              },
              position: 'center'
            },
            responsive: true,
            aspectRatio: 2.5,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `Total : ${context.raw}`;
                  }
                }
              },
              legend: {
                display: true
              }
            },
            onClick: (evt, elements, chart) => {
              if (elements.length > 0) {
                let index = elements[0].index;
                const month = chart.data.labels[index];

                window.location.href = `log.html?month=${month}`;
              }
            },

          }
        });


      } catch (err) {
        console.log(err);
      }
    }

    window.addEventListener('load', getDataAndRender);


async function geData() {
  try {
    const response = await fetch('http://localhost:3000/api/mobilitas');
    const data = await response.json();

  var options1 = {
  chart: {
    height: data.height,
    width: data.width,
    type: data.type,
    events: {
      click: function (event, chartContext, opts) {
        if (opts.dataPointIndex !== undefined) {
          const car = data.labels[opts.dataPointIndex];
          window.location.href = `log.html?car=${car}`
        }
      }
    }
  },
  series: data.series,
  plotOptions: data.plotOptions,
  labels: data.labels
};
new ApexCharts(document.getElementById('myChart4'), options1).render();
}
  catch (err) {
    console.log(err);
  }
}

geData();