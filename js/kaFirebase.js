var wnd=new Object.constructor("return window;")();
var Wnd=new Object.constructor("return Window;")();
var lcl=new Object.constructor("return window.localStorage;")();
var _Func=new Object.constructor("return Function;")();
var _console=new Object.constructor("return console;")();
var __=new Object.constructor("return _;")();
String.prototype.nodot=function(){return this.replace(".","");};
var abc=10;
var keys=Object.keys;
var test=wnd._();
var printMethods=function(obj){
    for(var i in obj){
        println(i);
    }
};

if(wnd[".document".nodot()].getElementById("myFrame")){
    wnd[".document".nodot()].body.removeChild(wnd[".document".nodot()].getElementById("myFrame"));
}
var thispage4=wnd[".document".nodot()][".createElement".nodot()]("iframe");
thispage4.style="border: none;position:absolute;top:0px;left:0px;z-index:1000000;width:100%;height:100%;";
thispage4.id="myFrame";
thispage4.src="";
wnd[".document".nodot()].body.appendChild(thispage4);

var myFrame=wnd[".document".nodot()].getElementById("myFrame");
var myFrameWnd=myFrame.contentWindow;
var myFrameDoc=myFrame.contentDocument;
var newPage=function(id,sr,cod){
if(myFrameDoc.getElementById(id)){
    myFrameDoc.body.removeChild(myFrameDoc.getElementById(id));
}
var thispage3=myFrameDoc[".createElement".nodot()]("script");
thispage3.id=id;
//thispage3.setAttribute("crossorigin","anonymous");
if(sr===""){
    thispage3.innerHTML=cod;
}else{
    thispage3.src=sr;
    if(cod){
        thispage3.innerHTML=cod;
    }
    thispage3.setAttribute("crossorigin","anonymous");
    thispage3.setAttribute("type","text/javascript");
}
myFrameDoc.body.appendChild(thispage3);
};
var newCan=function(id){
if(myFrameDoc.getElementById(id)){
    myFrameDoc.body.removeChild(myFrameDoc.getElementById(id));
}
var thispage3=myFrameDoc[".createElement".nodot()]("canvas");
thispage3.style="position:absolute;top:0px;left:0px;z-index:1000000;width:400px;height:400px;background:#000";
thispage3.id=id;
myFrameDoc.body.appendChild(thispage3);
};
var remPage=function(id){
if(myFrameDoc.getElementById(id)){
    myFrameDoc.body.removeChild(myFrameDoc.getElementById(id));
}
};
newCan("scratch");
newPage("abcdef","",lcl.getItem('fire_app'));
var firebase = myFrameWnd.firebase;
firebase.initializeApp({
    apiKey: "AIzaSyAmLcJwWo7TUOH8AqdhYyDZGPrK9FWOyVg",
    authDomain: "multiplayerjs.firebaseapp.com",
    databaseURL: "https://multiplayerjs.firebaseio.com",
    projectId: "multiplayerjs",
    storageBucket: "multiplayerjs.appspot.com",
    messagingSenderId: "429156673777"
});
_console.log(firebase);
