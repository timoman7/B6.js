let canv = document.getElementById('Screen');
CanvasRenderingContext2D.prototype.background = function(r,g,b,a){
  let cType = "";
  switch(arguments.length){
    case 1:
      cType = "WB";
      break;
    case 2:
      cType = "WBA";
      break;
    case 3:
      cType = "RGB";
      break;
    case 4:
      cType = "RGBA";
      break;
  }
  switch(cType){
    case "WB":
      this.fillStyle = `rgba(${r},${r},${r},255)`;
      break;
    case "WBA":
      this.fillStyle = `rgba(${r},${r},${r},${g})`;
      break;
    case "RGB":
      this.fillStyle = `rgba(${r},${g},${b},255)`;
      break;
    case "RGBA":
      this.fillStyle = `rgba(${r},${g},${b},${a})`;
      break;
  }
  this.fillRect(0, 0, this.canvas.width, this.canvas.height);
};
let cont = new B9(canv.getContext('2d'), 'cont');
let Patterns = {
  'standard':[
    [1,1,1],
    [1,0,1],
    [1,1,1]
  ],
  '5x5':[
    [0,1,1,1,2],
    [1,2,0,2,1],
    [1,0,1,0,1],
    [1,2,0,2,1],
    [0,1,1,1,0]
  ],
  '7x7':[
    [0,1,1,1,1,1,0],
    [1,1,0,1,0,1,1],
    [1,0,1,1,1,0,1],
    [1,1,1,1,1,1,1],
    [1,0,1,1,1,0,1],
    [1,1,0,1,0,1,1],
    [0,1,1,1,1,1,0]
  ],
  'meme':[
    [2,2,2,2,2],
    [2,2,2,2,2],
    [2,2,2,2,2],
    [2,2,2,2,2],
    [2,2,2,2,2]
  ]
};
let logged = {pattern: [], depth: []};
function Menger(x,y,w,h,pattern,depth){
    cont.noStroke();
    this.depth = depth;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.pattern=pattern;
    if(this.depth > 0){
        cont.fill(255, 0, 0, 100/255);
        cont.rect(this.x,this.y,this.w,this.h);
        //cont.ellipse(this.x + (this.w / 2), this.y + (this.h / 2), this.w, this.h);
        if(logged.depth[this.depth] != true){
          console.table(this.pattern);
          logged.depth[this.depth] = true;
        }
        let sub_y = 0;
        this.pattern.forEach((yArr)=>{
            let sub_x = 0;
            yArr.forEach((xVal)=>{
                if(xVal == 1){
                    this.empty = false;
                }else if(xVal == 2){
                    this.empty = false;
                }else{
                    this.empty = true;
                }
                let mod_x = Math.floor((this.x + (sub_x * Math.floor(this.w/yArr.length)))*100)/100;
                let mod_y = Math.floor((this.y + (sub_y * Math.floor(this.h/this.pattern.length)))*100)/100;
                let mod_w = Math.floor((this.w/yArr.length)*100)/100;
                let mod_h = Math.floor((this.h/this.pattern.length)*100)/100;
                if(!this.empty){
                    for(let sy = 0; sy < this.pattern.length; sy++){
                        for(let sx = 0; sx < this.pattern[sy].length; sx++){
                            let xVal = this.pattern[sy][sx];
                            if(xVal == 2){
                              this.pattern[sy][sx] = Math.round(Math.random()*2);
                            }
                        }
                    }

                    new Menger(mod_x,mod_y,mod_w,mod_h,this.pattern,this.depth-1);
                }else{
                    cont.fill(255,255,255);
                    cont.rect(mod_x,mod_y,mod_w+1,mod_h+1);
                    //cont.ellipse(mod_x + (mod_w / 2), mod_y + (mod_h / 2), mod_w, mod_h);
                }
                sub_x++;
            });
            sub_y++;
        });
    }

};
cont.background(100);
new Menger(0,0,cont.width,cont.height,Patterns['meme'],4);
