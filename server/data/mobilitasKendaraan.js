const { type } = require("./peminjamanKendaraan");

const dataMoilitas = {
     labels: [
    "Toyota Avanza",
    "Daihatsu GrandMax"
  ],
    logData: {
    Jan: [
      {
        nama: "Ziqa",
        title: "Senior Staff",
        reason: "Sakit",
        date: "2023-01-01",
        status: "Pending",
      },
    ],
},
  height: 350,
  width: 350,
  type: "radialBar",
  series: [67, 45,],
  plotOptions: {
    radialBar: {
      dataLabels: {
        total: {
          show: true,
          label: 'TOTAL'
        }
      }
    }
  },
  

}

module.exports = dataMoilitas;