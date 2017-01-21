
(function(factory){'use strict';if(typeof exports==='object'){module.exports=factory(typeof angular!=='undefined'?angular:require('angular'),typeof Chart!=='undefined'?Chart:require('chart.js'));}else if(typeof define==='function'&&define.amd){define(['angular','chart'],factory);}else{factory(angular,Chart);}}(function(angular,Chart){'use strict';Chart.defaults.global.responsive=true;Chart.defaults.global.multiTooltipTemplate='<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>';Chart.defaults.global.colours=['#97BBCD','#DCDCDC','#F7464A','#46BFBD','#FDB45C','#949FB1','#4D5360'];var usingExcanvas=typeof window.G_vmlCanvasManager==='object'&&window.G_vmlCanvasManager!==null&&typeof window.G_vmlCanvasManager.initElement==='function';if(usingExcanvas)Chart.defaults.global.animation=false;return angular.module('chart.js',[]).provider('ChartJs',ChartJsProvider).factory('ChartJsFactory',['ChartJs','$timeout',ChartJsFactory]).directive('chartBase',['ChartJsFactory',function(ChartJsFactory){return new ChartJsFactory();}]).directive('chartLine',['ChartJsFactory',function(ChartJsFactory){return new ChartJsFactory('Line');}]).directive('chartBar',['ChartJsFactory',function(ChartJsFactory){return new ChartJsFactory('Bar');}]).directive('chartRadar',['ChartJsFactory',function(ChartJsFactory){return new ChartJsFactory('Radar');}]).directive('chartDoughnut',['ChartJsFactory',function(ChartJsFactory){return new ChartJsFactory('Doughnut');}]).directive('chartPie',['ChartJsFactory',function(ChartJsFactory){return new ChartJsFactory('Pie');}]).directive('chartPolarArea',['ChartJsFactory',function(ChartJsFactory){return new ChartJsFactory('PolarArea');}]);function ChartJsProvider(){var options={};var ChartJs={Chart:Chart,getOptions:function(type){var typeOptions=type&&options[type]||{};return angular.extend({},options,typeOptions);}};this.setOptions=function(type,customOptions){if(!customOptions){customOptions=type;options=angular.extend(options,customOptions);return;}
options[type]=angular.extend(options[type]||{},customOptions);};this.$get=function(){return ChartJs;};}
function ChartJsFactory(ChartJs,$timeout){return function chart(type){return{restrict:'CA',scope:{data:'=?',labels:'=?',options:'=?',series:'=?',colours:'=?',getColour:'=?',chartType:'=',legend:'@',click:'=?',hover:'=?',chartData:'=?',chartLabels:'=?',chartOptions:'=?',chartSeries:'=?',chartColours:'=?',chartLegend:'@',chartClick:'=?',chartHover:'=?'},link:function(scope,elem){var chart,container=document.createElement('div');container.className='chart-container';elem.replaceWith(container);container.appendChild(elem[0]);if(usingExcanvas)window.G_vmlCanvasManager.initElement(elem[0]);['data','labels','options','series','colours','legend','click','hover'].forEach(deprecated);function aliasVar(fromName,toName){scope.$watch(fromName,function(newVal){if(typeof newVal==='undefined')return;scope[toName]=newVal;});}
aliasVar('chartData','data');aliasVar('chartLabels','labels');aliasVar('chartOptions','options');aliasVar('chartSeries','series');aliasVar('chartColours','colours');aliasVar('chartLegend','legend');aliasVar('chartClick','click');aliasVar('chartHover','hover');scope.$watch('data',function(newVal,oldVal){if(!newVal||!newVal.length||(Array.isArray(newVal[0])&&!newVal[0].length)){destroyChart(chart,scope);return;}
var chartType=type||scope.chartType;if(!chartType)return;if(chart&&canUpdateChart(newVal,oldVal))
return updateChart(chart,newVal,scope,elem);createChart(chartType);},true);scope.$watch('series',resetChart,true);scope.$watch('labels',resetChart,true);scope.$watch('options',resetChart,true);scope.$watch('colours',resetChart,true);scope.$watch('chartType',function(newVal,oldVal){if(isEmpty(newVal))return;if(angular.equals(newVal,oldVal))return;createChart(newVal);});scope.$on('$destroy',function(){destroyChart(chart,scope);});function resetChart(newVal,oldVal){if(isEmpty(newVal))return;if(angular.equals(newVal,oldVal))return;var chartType=type||scope.chartType;if(!chartType)return;createChart(chartType);}
function createChart(type){if(isResponsive(type,scope)&&elem[0].clientHeight===0&&container.clientHeight===0){return $timeout(function(){createChart(type);},50,false);}
if(!scope.data||!scope.data.length)return;scope.getColour=typeof scope.getColour==='function'?scope.getColour:getRandomColour;var colours=getColours(type,scope);var cvs=elem[0],ctx=cvs.getContext('2d');var data=Array.isArray(scope.data[0])?getDataSets(scope.labels,scope.data,scope.series||[],colours):getData(scope.labels,scope.data,colours);var options=angular.extend({},ChartJs.getOptions(type),scope.options);destroyChart(chart,scope);chart=new ChartJs.Chart(ctx)[type](data,options);scope.$emit('create',chart);cvs.onclick=scope.click?getEventHandler(scope,chart,'click',false):angular.noop;cvs.onmousemove=scope.hover?getEventHandler(scope,chart,'hover',true):angular.noop;if(scope.legend&&scope.legend!=='false')setLegend(elem,chart);}
function deprecated(attr){if(typeof console!=='undefined'&&ChartJs.getOptions().env!=='test'){var warn=typeof console.warn==='function'?console.warn:console.log;if(!!scope[attr]){warn.call(console,'"%s" is deprecated and will be removed in a future version. '+'Please use "chart-%s" instead.',attr,attr);}}}}};};function canUpdateChart(newVal,oldVal){if(newVal&&oldVal&&newVal.length&&oldVal.length){return Array.isArray(newVal[0])?newVal.length===oldVal.length&&newVal.every(function(element,index){return element.length===oldVal[index].length;}):oldVal.reduce(sum,0)>0?newVal.length===oldVal.length:false;}
return false;}
function sum(carry,val){return carry+val;}
function getEventHandler(scope,chart,action,triggerOnlyOnChange){var lastState=null;return function(evt){var atEvent=chart.getPointsAtEvent||chart.getBarsAtEvent||chart.getSegmentsAtEvent;if(atEvent){var activePoints=atEvent.call(chart,evt);if(triggerOnlyOnChange===false||angular.equals(lastState,activePoints)===false){lastState=activePoints;scope[action](activePoints,evt);scope.$apply();}}};}
function getColours(type,scope){var notEnoughColours=false;var colours=angular.copy(scope.colours||ChartJs.getOptions(type).colours||Chart.defaults.global.colours);while(colours.length<scope.data.length){colours.push(scope.getColour());notEnoughColours=true;}
if(notEnoughColours)scope.colours=colours;return colours.map(convertColour);}
function convertColour(colour){if(typeof colour==='object'&&colour!==null)return colour;if(typeof colour==='string'&&colour[0]==='#')return getColour(hexToRgb(colour.substr(1)));return getRandomColour();}
function getRandomColour(){var colour=[getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)];return getColour(colour);}
function getColour(colour){return{fillColor:rgba(colour,0.2),strokeColor:rgba(colour,1),pointColor:rgba(colour,1),pointStrokeColor:'#fff',pointHighlightFill:'#fff',pointHighlightStroke:rgba(colour,0.8)};}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function rgba(colour,alpha){if(usingExcanvas){return'rgb('+colour.join(',')+')';}else{return'rgba('+colour.concat(alpha).join(',')+')';}}
function hexToRgb(hex){var bigint=parseInt(hex,16),r=(bigint>>16)&255,g=(bigint>>8)&255,b=bigint&255;return[r,g,b];}
function getDataSets(labels,data,series,colours){return{labels:labels,datasets:data.map(function(item,i){return angular.extend({},colours[i],{label:series[i],data:item});})};}
function getData(labels,data,colours){return labels.map(function(label,i){return angular.extend({},colours[i],{label:label,value:data[i],color:colours[i].strokeColor,highlight:colours[i].pointHighlightStroke});});}
function setLegend(elem,chart){var $parent=elem.parent(),$oldLegend=$parent.find('chart-legend'),legend='<chart-legend>'+chart.generateLegend()+'</chart-legend>';if($oldLegend.length)$oldLegend.replaceWith(legend);else $parent.append(legend);}
function updateChart(chart,values,scope,elem){if(Array.isArray(scope.data[0])){chart.datasets.forEach(function(dataset,i){(dataset.points||dataset.bars).forEach(function(dataItem,j){dataItem.value=values[i][j];});});}else{chart.segments.forEach(function(segment,i){segment.value=values[i];});}
chart.update();scope.$emit('update',chart);if(scope.legend&&scope.legend!=='false')setLegend(elem,chart);}
function isEmpty(value){return!value||(Array.isArray(value)&&!value.length)||(typeof value==='object'&&!Object.keys(value).length);}
function isResponsive(type,scope){var options=angular.extend({},Chart.defaults.global,ChartJs.getOptions(type),scope.options);return options.responsive;}
function destroyChart(chart,scope){if(!chart)return;chart.destroy();scope.$emit('destroy',chart);}}}));