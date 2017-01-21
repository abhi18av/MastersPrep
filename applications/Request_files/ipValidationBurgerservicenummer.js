'use strict';(function(){inproces.directive('validationBurgerservicenummer',function(){return{restrict:'A',require:'ngModel',link:function(scope,elem,attrs,ctrl){var isValidBurgerservicenummer,parseBurgerservicenummer,formatBurgerservicenummer;parseBurgerservicenummer=function(value){if(value){return value.replace(/[^0-9]/g,'').trim();}else{return value;}};isValidBurgerservicenummer=function(value){if(!value){return true;}
if(value.length===10){return true;}
if(value.length!==9){return false;}
var checksum=0;for(var i=0;i<value.length-1;i++){checksum=checksum+(9-i)*parseInt(value.charAt(i),10);}
checksum=checksum-value.charAt(8);return checksum%11===0;};formatBurgerservicenummer=function(value){if(value){if(value.length>4){value=value.substring(0,4)+'.'+value.substring(4,value.length);}
if(value.length>7){value=value.substring(0,7)+'.'+value.substring(7,value.length);}}
return value;};ctrl.$parsers.unshift(function(viewValue){var parsed;if(viewValue!==null){parsed=parseBurgerservicenummer(viewValue);if(parsed!==viewValue){ctrl.$setViewValue(parsed);ctrl.$render();}
ctrl.$setValidity('burgerservicenummer',isValidBurgerservicenummer(parsed));return parsed;}});ctrl.$formatters.unshift(function(modelValue){var parsed;if(modelValue!==null){parsed=parseBurgerservicenummer(modelValue);if(parsed!==modelValue){scope[attrs.ngModel]=parsed;}
ctrl.$setValidity('burgerservicenummer',isValidBurgerservicenummer(parsed));return parsed;}});}};});}).call(this);