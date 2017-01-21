
angular.module('xml2js',[]).filter('text2xml',['$window','$log',function($window,$log){return function(input){var xml;if('DOMParser'in $window){var parser=new $window.DOMParser();try{xml=parser.parseFromString(input,'text/xml');}catch(e){$log.error('Could not parse input: '+input);throw e;}}else if('ActiveXObject'in $window){xml=new $window.ActiveXObject('Microsoft.XMLDOM');if(!xml){$log.error('Could not load Microsoft ActiveX XMLDOM');throw new Error('Could not load Microsoft ActiveX XMLDOM');}else{try{xml.async=false;xml.loadXML(input);}catch(e){$log.error('Could not parse input: '+input);throw e;}}}else{throw new Error('Your JS engine does not support a native DOM parser');}
return xml;};}]);angular.module('xml2js').filter('xml2js',[function(){var NODE=1,TEXT=3,ATTRIBUTES_NAME='@attributes',NAMESPACE_NAME='@ns';function getNodeName(node){if(node.nodeType===TEXT){return'value';}
return node.localName||node.nodeName;}
function xmlToJs(xml){var obj={},attribute,item,name;if(xml.prefix){obj[NAMESPACE_NAME]={prefix:xml.prefix,URI:xml.namespaceURI};}
if(xml.nodeType===NODE){if(xml.attributes.length>0){obj[ATTRIBUTES_NAME]={};for(var j=0;j<xml.attributes.length;j++){attribute=xml.attributes.item(j);obj[ATTRIBUTES_NAME][getNodeName(attribute)]=xmlToJs(attribute);}}}else if(xml.nodeType===TEXT){return xml.nodeValue;}
if(xml.hasChildNodes()){for(var i=0;i<xml.childNodes.length;i++){item=xml.childNodes.item(i);name=getNodeName(item);if(angular.isUndefined(obj[name])){obj[name]=xmlToJs(item);}else{if(!angular.isArray(obj[name])){var old=obj[name];obj[name]=[];obj[name].push(old);}
obj[name].push(xmlToJs(item));}}}
return obj;}
return function(input){return xmlToJs(input);};}]);