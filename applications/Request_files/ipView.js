
(function(){'use strict';inproces.directive('ipView',function ipView($compile,$state,$q){return{restrict:'A',compile:function($element,$attr){var view=$attr.ipView;var params={portal:null,view:null,widget:null,schema:null,sleutel:null,file:null};var parameters=($attr.ipParams||'').split(',');if(parameters.length>0){angular.forEach(parameters,function(parameter){if(parameter){params[parameter]=null;}});}
$element.attr('ui-view',view);$element[0].removeAttribute('ip-view');$element[0].removeAttribute('data-ip-view');var views={};views[view]={templateProvider:function(ipTemplate,$stateParams){return ipTemplate($stateParams);}};if(!$state.get(view)){providers.$stateProvider.state(view,{url:'/'+view+'/:widget/:schema/:sleutel/:file',params:params,sticky:true,parent:'portal',views:views});}
var fn=$compile($element);return function(scope){fn(scope);};}};});})();