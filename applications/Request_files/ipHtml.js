
(function(){'use strict';inproces.directive('ipHtml',function($compile,$parse,$http,ipDialog,Upload){return{require:'ngModel',restrict:'A',link:function link(scope,element,attrs,ngModel){if(!ngModel)return;element.addClass('ip-html');element.removeAttr('ip-html');element.removeAttr('data-ip-html');element.attr('froala','froalaOptions');function uploadFile($event,editor,fileList){$event.preventDefault();angular.forEach(fileList,function(file){Upload.upload({url:'/entiteitproxy',headers:{'Content-Type':file.type},params:{schema:scope.record.data.schema,docunid:scope.record.data.docunid,action:'createbijlage',outputformat:'json',filename:file.name},data:{file:file}}).then(function(response){var link='/data/'+scope.record.data.schema+'/'+scope.record.data.docunid+'/'+file.name;editor.image.insert(link,true,{'name':file.name,'id':file.name},null,{link:link});});},this);return false;};scope.froalaOptions={toolbarVisibleWithoutSelection:false,key:"LDIE1QCYRWa2GPIb1d1H1==",toolbarInline:true,toolbarButtons:['fullscreen','bold','italic','underline','|','paragraphStyle','paragraphFormat','align','formatOL','formatUL','outdent','indent','-','insertLink','insertImage','insertVideo','insertFile','insertTable','undo','redo','clearFormatting','html'],toolbarButtonsSM:['bold','italic','underline','|','paragraphStyle','paragraphFormat','align','formatOL','formatUL','outdent','indent','-','insertLink','insertImage','insertVideo','insertFile','insertTable','undo','redo','clearFormatting'],language:'nl',zIndex:3000,charCounterCount:false,events:{'froalaEditor.image.beforeUpload':uploadFile,'froalaEditor.file.beforeUpload':uploadFile},spellcheck:true,paragraphFormat:{'N':'Normaal','SECTION':'Sectie','H1':'Kopregel 1','H2':'Kopregel 2','H3':'Kopregel 3','H4':'Kopregel 4'}};angular.extend(scope.froalaOptions,$parse(attrs.htmlOptions)(scope));$compile(element)(scope);}};});})();