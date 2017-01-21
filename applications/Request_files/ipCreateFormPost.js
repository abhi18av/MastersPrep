
(function(){inproces.factory('ipCreateFormPost',function(){function transformRequest(data,getHeaders){var headers=getHeaders();headers['Content-Type']='application/x-www-form-urlencoded; charset=utf-8';return(serializeData(data));}
function serializeData(data){if(!angular.isObject(data)){return(serializePrimitive(data));}
var buffer=[];for(var name in data){if(!data.hasOwnProperty(name)){continue;}
var value=data[name];if(angular.isArray(value)){angular.forEach(value,function(val,key){buffer.push(encodeURIComponent(name)+'='+
encodeURIComponent(serializePrimitive(val)));});}else{buffer.push(encodeURIComponent(name)+'='+
encodeURIComponent(serializePrimitive(value)));}}
var source=buffer.join('&').replace(/%20/g,'+');return(source);}
function serializePrimitive(value){if(value===null||value===undefined){return'';}
if(angular.isDate(value)){return value.getTime();}else{return value.toString();}}
return(transformRequest);});})();