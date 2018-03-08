/*
* Add a color function to B9
*
 */
/**
 * Add a property to native objects with inheritance
 * @param  {function} __Native__     native object name
 * @param  {[type]} __PropName__   [description]
 * @param  {[type]} __Function__   [description]
 * @param  {[type]} __writable__   [description]
 * @param  {[type]} __enumerable__ [description]
 * @return {[type]}                [description]
 */
function defineNativeProperty(__Native__, __PropName__, __Function__, __writable__, __enumerable__){
  Object.defineProperty(__Native__.prototype, __PropName__, {
    value: __Function__,
    writable: (__writable__==undefined?true:(typeof(__writable__)=="boolean"?__writable__:true)),
    enumerable: (__enumerable__==undefined?true:(typeof(__enumerable__)=="boolean"?__enumerable__:true))
  });
}

defineNativeProperty(Object, 'map', function(cb){
  let keyNames  = Object.keys   (this);
  let keyVals   = Object.values (this);
  //keyVals = Array.prototype.map.call(keyVals,cb);
  Object.assign(this,...Object.entries(this).map(([k, v]) => ({[k]: cb(v)})));
});
defineNativeProperty(Array, 'getValue', function(valName){
  return this[valName]
});
defineNativeProperty(Array, 'toKeyValuePair', function(){
  if(this.length != 2){
    throw new Error(`Array should have 2 values. Has ${this.length}.`);
  }else if(typeof this[0] == "object"){
    throw new Error(`Key value may not be of type ${typeof(this[0])}.`);
  }else if(typeof this[0] == "function"){
    throw new Error(`Key value may not be of type ${typeof(this[0])}.`)
  }
  let KVPair = {};
  KVPair[this[0]]=this[1];
  return KVPair;
});
defineNativeProperty(Object, 'filter', function(cb){
  let keyNames  = Object.keys   (this);
  let keyVals   = Object.values (this);
  //console.log(...[...Object.entries(this)].getValue('length'))
  let vals = [];
  [...Object.entries(this)]
    .filter(function(kv){
      return cb(kv[1],kv);
    })
    .forEach((v)=>{
      vals.push(v.toKeyValuePair());
    });
  /*
  keyNames.forEach((kn)=>{
    delete this[kn];
  });
  */
  //Object.assign(this,...vals);
  return Object.assign({},...vals);
});
function validArgs(){
  let nonUndC=0;
  [...arguments].forEach((e)=>{
    if(e!==undefined){
      nonUndC++;
    }
  });
  return nonUndC;
}
function convertLocalToGlobal(fn, toReplace, lclName){
  let lclFnStr = fn.toString();
  if(lclFnStr.includes('[native code]')){
    return fn;
  }else{
    let replaceRegExp = new RegExp(`(${toReplace.join(')|(')})`,'g');
    let gblFnStr = lclFnStr.replace(replaceRegExp,lclName);
    if(gblFnStr.startsWith('function ')){
      gblFnStr = gblFnStr.replace('function ','');
    }
    if(gblFnStr.startsWith('set ') || gblFnStr.startsWith('get ')){
      gblFnStr = gblFnStr.replace(/(set|get)/,'');
    }
    let gblFn = new Object.constructor(`return function ${gblFnStr}`)();
    return gblFn;
  }
}
class B9{
  constructor(context, instanceName){
    this.name = instanceName || "B9Instance";
    this.context = context;
    this.blacklist = [
      "init",
      "constructor",
      "integrate"
    ];
    this.specialProps=[
      "draw"
    ];
    this.STORED_VALUES = {
      fr: 60
    };
    this.ESSENTIAL_FUNCTIONS = {};
    this.width = this.context.canvas.width;
    this.height = this.context.canvas.height;
    this.toIntegrate = [
      Math
    ];
    this.integrate();
    this.init();
  }
  integrate(){
    this.toIntegrate.forEach((_module)=>{
      Object.getOwnPropertyNames(_module).forEach((_submodule)=>{
        Object.defineProperty(B9.prototype, _submodule, {
          value: _module[_submodule],
          writable: true,
          enumerable: true
        });
      });
    });
  }
  noFunc(){/*Nothing here*/}
  set draw(fn){
    this.ESSENTIAL_FUNCTIONS.draw = fn;
    if(this.ESSENTIAL_FUNCTIONS.draw){
      let self = this;
      function hiddenDraw(){
        self.ESSENTIAL_FUNCTIONS.draw();
        window.requestAnimationFrame(hiddenDraw);
      }
      window.requestAnimationFrame(hiddenDraw);
    }
  }
  get draw(){
    return this.ESSENTIAL_FUNCTIONS.draw || this.noFunc;
  }
  init(){
    this.draw = this.noFunc;
    Object.getOwnPropertyNames(B9.prototype).filter((e)=>{return !(this.blacklist.includes(e));}).forEach((propName)=>{
      console.log(propName)
      if(this.specialProps.includes(propName)){
        let Instance = this;
        Object.defineProperty(window, propName, {
          set: convertLocalToGlobal(Instance.__proto__["__lookupSetter__"](propName),['this'],Instance.name),
          get: convertLocalToGlobal(Instance.__proto__["__lookupGetter__"](propName),['this'],Instance.name)
        });
      }else{
        if(typeof this[propName] == "object" || typeof this[propName] == "function"){
          window[propName]=convertLocalToGlobal(this[propName], ['this'], this.name);//this[propName];
        }else{
          window[propName]=this[propName];//this[propName];
        }
      }
    });
  }
  color(){
    return {}
  }
  frameRate(fr){
    this.STORED_VALUES.framerate = 1e3/fr;
  }
  parseColor(r,g,b,a){
    let cType = "";
    let c = "";
    switch(validArgs(r,g,b,a)){
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
        c = `rgba(${r},${r},${r},1)`;
        break;
      case "WBA":
        c = `rgba(${r},${r},${r},${g})`;
        break;
      case "RGB":
        c = `rgba(${r},${g},${b},1)`;
        break;
      case "RGBA":
        c = `rgba(${r},${g},${b},${a})`;
        break;
    }
    return c;
  }
  fill(r,g,b,a){
    let c = this.parseColor(r,g,b,a);
    this.context.fillStyle = c;
    return c;
  }
  stroke(r,g,b,a){
    let c = this.parseColor(r,g,b,a);
    this.context.strokeStyle = c;
    return c;
  }
  noStroke(){
    this.stroke(0,0,0,0);
  }
  noFill(){
    this.fill(0,0,0,0);
  }
  rect(x,y,w,h){
    this.context.fillRect(x, y, w, h);
  }
  ellipse(x, y, rx, ry, rot, sAngle, eAngle, ac){
    this.context.beginPath();
    this.context.ellipse(x, y, rx, ry || rx, rot || 0, sAngle || 0, eAngle || (2 * Math.PI), ac || false);
    if(parseFloat(this.context.strokeStyle.split(',')[this.context.strokeStyle.split(',').length-1].replace(/\W/g,""))<1){
      this.context.fill();
    }else if(parseFloat(this.context.fillStyle.split(',')[this.context.fillStyle.split(',').length-1].replace(/\W/g,""))<1){
      this.context.stroke();
    }else{
      this.context.fill();
      this.context.stroke();
    }
    this.context.closePath();
  }
  background(r,g,b,a){
    this.STORED_VALUES.background = this.parseColor(r,g,b,a);
    this.fill(r,g,b,a);
    this.rect(0, 0, this.width, this.height);
  }
}
//window['B9']=B9;
