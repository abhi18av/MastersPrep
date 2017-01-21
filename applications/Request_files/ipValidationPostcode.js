'use strict';(function(){inproces.directive('validationPostcode',function(){return{restrict:'A',require:'ngModel',link:function(scope,elem,attrs,ctrl){var isValidPostcode,parsePostcode;parsePostcode=function(value){if(value){return value.toUpperCase().trim();}else{return value;}};isValidPostcode=function(value){return!value||(/^[\d]{4} ?[a-zA-Z]{2}$/).test(value);};ctrl.$parsers.unshift(function(viewValue){var parsed;if(viewValue!==null){parsed=parsePostcode(viewValue);if(parsed!==viewValue){ctrl.$setViewValue(parsed);ctrl.$render();}
ctrl.$setValidity('postcode',isValidPostcode(parsed));return parsed;}});ctrl.$formatters.unshift(function(modelValue){var parsed;if(modelValue!==null){parsed=parsePostcode(modelValue);if(parsed!==modelValue){scope[attrs.ngModel]=parsed;}
ctrl.$setValidity('postcode',isValidPostcode(parsed));return parsed;}});}};});}).call(this);(function(){inproces.directive('validationPostcodegeenspatie',function(){return{restrict:'A',require:'ngModel',link:function(scope,elem,attrs,ctrl){var isValidPostcodegeenspatie,parsePostcodegeenspatie;parsePostcodegeenspatie=function(value){if(value){return value.toUpperCase().trim().replace(/\s/g,'');}else{return value;}};isValidPostcodegeenspatie=function(value){return!value||(/^[\d]{4} ?[a-zA-Z]{2}$/).test(value);};ctrl.$parsers.unshift(function(viewValue){var parsed,valid;if(viewValue!==null){parsed=parsePostcodegeenspatie(viewValue);if(parsed!==viewValue){ctrl.$setViewValue(parsed);ctrl.$render();}
valid=isValidPostcodegeenspatie(parsed);ctrl.$setValidity('postcodegeenspatie',valid);return parsed;}});return ctrl.$formatters.unshift(function(modelValue){var parsed,valid;if(modelValue!==null){parsed=parsePostcodegeenspatie(modelValue);if(parsed!==modelValue){scope[attrs.ngModel]=parsed;}
valid=isValidPostcodegeenspatie(parsed);ctrl.$setValidity('postcodegeenspatie',valid);return parsed;}});}};});}).call(this);