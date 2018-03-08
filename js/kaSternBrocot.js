function SternBrocot(){
    let q = 0;
    let temp = arguments[arguments.length-1];
    let num = 0;
    for(let i = arguments.length-1; i>0; i--){
        if(i === arguments.length-1){
            num = 1/arguments[i];
        }else{
            num = 1/(arguments[i]+num);
        }
    }
    q = arguments[0] + num;
    return q;
}
