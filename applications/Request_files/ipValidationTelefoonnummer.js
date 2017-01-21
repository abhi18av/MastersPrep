'use strict';(function(){inproces.directive('validationTelefoonnummer',function(){return{restrict:'A',require:'ngModel',link:function(scope,elem,attrs,ctrl){var isValidTelefoonnummer,parseTelefoonnummer;parseTelefoonnummer=function(value){if(value){return value.replace(/[^\d \+\-]/g,'').trim();}else{return value;}};isValidTelefoonnummer=function(value){return!value||(/^[\+0][ \d\-]*$/).test(value);};ctrl.$parsers.unshift(function(viewValue){var parsed;if(viewValue!==null){parsed=parseTelefoonnummer(viewValue);if(parsed!==viewValue){ctrl.$setViewValue(parsed);ctrl.$render();}
ctrl.$setValidity('telefoonnummer',isValidTelefoonnummer(parsed));return parsed;}});ctrl.$formatters.unshift(function(modelValue){var parsed;if(modelValue!==null){parsed=parseTelefoonnummer(modelValue);if(parsed!==modelValue){scope[attrs.ngModel]=parsed;}
ctrl.$setValidity('telefoonnummer',isValidTelefoonnummer(parsed));return parsed;}});}};});}).call(this);