
(function(){'use strict';inproces.directive('ipInhoud',function($compile){function link(scope,element,attrs,ngModel){if(!ngModel)return;element.addClass('ip-inhoud');element.attr('ng-bind-html',attrs.ngModel);ngModel.$render=function(){var el=angular.element(ngModel.$viewValue||''),compiled=$compile(el);element.html(el);compiled(scope);};}
return{require:'ngModel',restrict:'A',link:link};});})();