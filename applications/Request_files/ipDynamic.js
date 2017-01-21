
(function(){'use strict';inproces.directive('ipDynamic',function($compile){function link(scope,element,attrs,ngModel){if(!ngModel)return;scope.$watch(attrs.dynamic,function(html){if(html){element.html(html);$compile(element.contents())(scope);}});}
return{require:'ngModel',restrict:'EA',link:link};});})();