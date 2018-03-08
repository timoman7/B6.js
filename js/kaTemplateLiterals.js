function tmpl8Lit(_str){
  let evil = eval;
  var tlRE = new RegExp('(\\$\\{)[a-zA-Z0-9\\_\\.\\,\\(\\)]*(\\})','g');
  var tls = _str.match(tlRE);
  tls.forEach(function(tl){
    _str=_str.replace(tl,evil('`'+tl+'`'));
  });
  return _str;
}
