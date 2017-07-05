(function() {

  // --------------- IO

  var socket = io();
  var nome = new Date().getTime();
  socket.emit('join', nome);



  // --------------- Canvas
  
  var canvas = document.getElementById('paint');
  var ctx = canvas.getContext('2d');
  
  canvas.width = 1300;
  canvas.height = 640;
  
  
      var lol = new Image();
      lol.onload = function() {
        ctx.drawImage(this, 0, 0);
      };
      lol.src = 'lol.png';


  // Creating a tmp canvas
  var tmp_canvas = document.createElement('canvas');
  var tmp_ctx = tmp_canvas.getContext('2d');
  tmp_canvas.id = 'tmp_canvas';
  tmp_canvas.width = canvas.width;
  tmp_canvas.height = canvas.height;
  
  fuckingDiv.appendChild(tmp_canvas);

  var mouse = {x: 0, y: 0};
  var last_mouse = {x: 0, y: 0};
  
  // Pencil Points
  var ppts = [];
  
  /* Mouse Capturing Work */
  tmp_canvas.addEventListener('mousemove', function(e) {
    mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
  }, false);
  
  
  /* Drawing on Paint App */
  tmp_ctx.lineWidth = ctx.lineWidth = 5;
  tmp_ctx.lineJoin = ctx.lineJoin = 'round';
  tmp_ctx.lineCap = ctx.lineCap = 'round';
  tmp_ctx.strokeStyle = ctx.strokeStyle = 'black';
  tmp_ctx.fillStyle = ctx.fillStyle = 'black';
  
  tmp_canvas.addEventListener('mousedown', function(e) {
    tmp_canvas.addEventListener('mousemove', onPaint, false);
    
    mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
    mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    
    ppts.push([mouse.x, mouse.y]);
    
    onPaint();
  }, false);
  
  tmp_canvas.addEventListener('mouseup', function() {
    tmp_canvas.removeEventListener('mousemove', onPaint, false);


    // Writing down to real canvas now
    //ctx.drawImage(tmp_canvas, 0, 0);

    
      socket.emit('ppts', ppts);
    
    // Clearing tmp canvas
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
    
    // Emptying up Pencil Points
    ppts = [];
  }, false);
  
  var onPaint = function() {
    
    // Saving all the points in an array
    ppts.push([mouse.x, mouse.y]);
    
    if (ppts.length < 3) {
      var b = ppts[0];
      tmp_ctx.beginPath();
      //ctx.moveTo(b.x, b.y);
      //ctx.lineTo(b.x+50, b.y+50);
      tmp_ctx.arc(b[0], b[1], tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
      tmp_ctx.fill();
      tmp_ctx.closePath();
      
      return;
    }
    
    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
    
    tmp_ctx.beginPath();
    tmp_ctx.moveTo(ppts[0][0], ppts[0][1]);
    
    for (var i = 1; i < ppts.length - 2; i++) {
      var c = (ppts[i][0] + ppts[i + 1][0]) / 2;
      var d = (ppts[i][1] + ppts[i + 1][1]) / 2;
      
      tmp_ctx.quadraticCurveTo(ppts[i][0], ppts[i][1], c, d);
    }
    
    // For the last 2 points
    tmp_ctx.quadraticCurveTo(
      ppts[i][0],
      ppts[i][1],
      ppts[i + 1][0],
      ppts[i + 1][1]
    );
    tmp_ctx.stroke();
    
  };

  var render = function(points) {
       
    if (points.length < 3) {
      var b = points[0];
      ctx.beginPath();
      //ctx.moveTo(b.x, b.y);
      //ctx.lineTo(b.x+50, b.y+50);
      ctx.arc(b[0], b[1], ctx.lineWidth / 2, 0, Math.PI * 2, !0);
      ctx.fill();
      ctx.closePath();
      
      return;
    }
    
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    
    for (var i = 1; i < points.length - 2; i++) {
      var c = (points[i][0] + points[i + 1][0]) / 2;
      var d = (points[i][1] + points[i + 1][1]) / 2;
      
      ctx.quadraticCurveTo(points[i][0], points[i][1], c, d);
    }
    
    // For the last 2 points
    ctx.quadraticCurveTo(
      points[i][0],
      points[i][1],
      points[i + 1][0],
      points[i + 1][1]
    );
    //ctx.closePath();
    ctx.stroke();

    canvas.toBlob(function(blob) {
      socket.emit('img', blob);
    });
    
  };

    socket.on('ppts', function(arr){
      //console.log(arr);
      render(arr);
    });
  
}());
