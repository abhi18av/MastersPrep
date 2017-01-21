
(function(){'use strict';inproces.directive('ipSignature',function ipSignature($window,$parse){return{restrict:'EA',replace:true,template:'<div style="position:relative;width:{{ options.width }}px;height: {{ options.height }}px" class="ip-signature {{ options.class }}">'+'<button style="position:absolute;right:0;" class="{{ options.buttonclass }}" ng-click="clear()"><md-icon md-font-icon="ion-android-close" title="opnieuw"></md-icon></button>'+'<canvas width="{{ options.width }}" height="{{ options.height }}"></canvas>'+'</div>',require:'?ngModel',link:function(scope,element,attributes,ngModel){scope.options={width:200,height:100,dotSize:1,penColor:"rgb(0,0,128)",clear:"opnieuw",onEnd:function($event){ngModel.$setViewValue(scope.signaturePad.toDataURL());}};try{var options=$parse(attributes.options)(scope);angular.extend(scope.options,options);}catch(e){}
var canvas=element.find('canvas')[0];scope.signaturePad=new SignaturePad(canvas,scope.options);scope.$watch(attributes.ngModel,function(value,oldvalue,scope){scope.signaturePad.clear();var image=new Image();image.src=value;canvas.getContext("2d").drawImage(image,0,0,scope.options.width,scope.options.height);scope.signaturePad._isEmpty=false;});scope.clear=function(){scope.signaturePad.clear();ngModel.$setViewValue('');};scope.onResize=function(){var canvas=element.find('canvas')[0];var ratio=Math.max($window.devicePixelRatio||1,1);canvas.width=canvas.offsetWidth*ratio;canvas.height=canvas.offsetHeight*ratio;canvas.getContext("2d").scale(ratio,ratio);}
scope.onResize();angular.element($window).bind('resize',function(){scope.onResize();});}};});})();