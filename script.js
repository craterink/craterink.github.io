var p = 0.5;
var start = 0;
var delta = 1;
var walkData;

var width = 100;
var height = 100;

var lineChart;
var expChart;

function RandomWalk(p, start, delta) {
    this.p = p;
    this.current = 0;
    this.delta = 1;
    this.time = 0;
    
    this.walk = function() {
      var random = Math.random();
      var walkUp = random <= this.p;
      
      if(walkUp) {
        this.current += this.delta;
      }
      else {
        this.current -= this.delta;
      }
      
      this.time++;
      
      return walkUp;
    }
    
}

function doAWalk(pVal) {
  pVal = ((pVal === undefined) ? p : pVal);
  var walker = new RandomWalk(pVal, start, delta);
  
  walkData = {
        datasets: [{
            borderColor: "rgba(75,100,255,1)",
            tension:0,
            fill : false,
            label: 'Random Walk with p=' + p,
            data: []
        }]
  };
  
  walkData.datasets[0].data.push({
    x : walker.time,
    y : walker.current
  });
  
  while(walker.time < 1000 && (walker.current !== 0 || walker.time === 0)) {
    walker.walk();
    
    walkData.datasets[0].data.push({
      x : walker.time,
      y : walker.current
    });
  }
  
  return walker;
}

function doWalk() {
  var ctx = document.getElementById('myChart').getContext('2d');
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  p = $('#pVal').val();
  
  doAWalk();
  
  if(lineChart !== undefined) {
    lineChart.destroy();
  }
   lineChart = new Chart(ctx, 
    {
      type: 'line',
      data: walkData,
      responsive:false,
      options: {
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
      }
    });
}

function averages() {
  var nExp = $('#nValExp').val();
  var pExp = $('#pValExp').val();
  
  var data = [];
  var avgData = [];
  var runningAvg = 0;
  
  for(var i = 0; i < nExp; i++) {
    var walker = doAWalk(pExp);
    runningAvg = (runningAvg * i + walker.time)/(i + 1);
    
    data.push({
      x : i,
      y : walker.time
    });
    avgData.push({
      x : i,
      y : runningAvg
    })
  }
  
  var expData = {
    datasets: [{
      borderColor: "rgba(75,192,192,1)",
      tension:0,
      fill : false,
      label: 'Time until 0',
      data: data
    }, {
      fill : false,
      borderColor: "rgba(75,192,100,0.4)",
      label: 'Running Average',
      data: avgData
    }]
  }
  
  var ctxExp = document.getElementById('expChart').getContext('2d');
  ctxExp.canvas.width = width;
  ctxExp.canvas.height = height;
  
  if(expChart !== undefined) {
    expChart.destroy();
  }
  expChart = new Chart(ctxExp, 
  {
    type: 'line',
    responsive:false,
    data: expData,
    options: {
      maintainAspectRatio: false,
      scales: {
          xAxes: [{
              type: 'linear',
              position: 'bottom'
          }]
      }
    }
  });
}

$(doWalk);
$(averages);


