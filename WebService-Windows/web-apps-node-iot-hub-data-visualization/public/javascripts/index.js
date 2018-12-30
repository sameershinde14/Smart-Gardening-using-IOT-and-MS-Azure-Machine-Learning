$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }

  //Test startes here
  var MoistureData = [];
  var data2 = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Moisture',
        yAxisID: 'Moisture',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: MoistureData
      }
    ]
  }
  //test ends here

  //Test startes here
  var LightData = [];
  var data3 = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Light',
        yAxisID: 'Light',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: LightData
      }
    ]
  }
  //test ends here


  var basicOption = {
    title: {
      display: true,
      text: 'Temperature & Humidity Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //test starts here
  var basicOption2 = {
    title: {
      display: true,
      text: 'Moisture Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Moisture',
        type: 'linear',
        scaleLabel: {
          labelString: 'Moisture',
          display: true
        },
        position: 'left',
      }]
    }
  }
  //test ends here

  //test starts here
  var basicOption3 = {
    title: {
      display: true,
      text: 'Light Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Light',
        type: 'linear',
        scaleLabel: {
          labelString: 'Light',
          display: true
        },
        position: 'left',
      }]
    }
  }
  //test ends here


  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });


  var ctx2 = document.getElementById("myChart2").getContext("2d");
  var optionsNoAnimation2 = { animation: false }
  var myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: data2,
    options: basicOption2
  });

  var ctx3 = document.getElementById("myChart3").getContext("2d");
  var optionsNoAnimation2 = { animation: false }
  var myLineChart3 = new Chart(ctx3, {
    type: 'line',
    data: data3,
    options: basicOption3
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      if(obj.moisture) {
          MoistureData.push(obj.moisture);
      }
      if(MoistureData.length > maxLen) {
          MoistureData.shift();
      }

      if(obj.light) {
          LightData.push(obj.light);
      }
      if(LightData.length > maxLen) {
          LightData.shift();
      }

      myLineChart.update();
      myLineChart2.update();
      myLineChart3.update();
    } catch (err) {
      console.error(err);
    }
  }

});
