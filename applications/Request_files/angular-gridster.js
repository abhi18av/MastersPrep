
(function(root,factory){'use strict';if(typeof define==='function'&&define.amd){define(['angular'],factory);}else if(typeof exports==='object'){module.exports=factory(require('angular'));}else{factory(root.angular);}}(this,function(angular){'use strict';return angular.module('gridster',[]).constant('gridsterConfig',{columns:6,pushing:true,floating:true,swapping:false,width:'auto',colWidth:'auto',rowHeight:'match',margins:[10,10],outerMargin:true,sparse:false,isMobile:false,mobileBreakPoint:600,mobileModeEnabled:true,minColumns:1,minRows:1,maxRows:100,defaultSizeX:2,defaultSizeY:1,minSizeX:1,maxSizeX:null,minSizeY:1,maxSizeY:null,saveGridItemCalculatedHeightInMobile:false,resizable:{enabled:true,handles:['s','e','n','w','se','ne','sw','nw']},draggable:{enabled:true,scrollSensitivity:20,scrollSpeed:15}}).controller('GridsterCtrl',['gridsterConfig','$timeout',function(gridsterConfig,$timeout){var gridster=this;angular.extend(this,gridsterConfig);this.resizable=angular.extend({},gridsterConfig.resizable||{});this.draggable=angular.extend({},gridsterConfig.draggable||{});var flag=false;this.layoutChanged=function(){if(flag){return;}
flag=true;$timeout(function(){flag=false;if(gridster.loaded){gridster.floatItemsUp();}
gridster.updateHeight(gridster.movingItem?gridster.movingItem.sizeY:0);},30);};this.grid=[];this.allItems=[];this.destroy=function(){if(this.grid){this.grid=[];}
this.$element=null;if(this.allItems){this.allItems.length=0;this.allItems=null;}};this.setOptions=function(options){if(!options){return;}
options=angular.extend({},options);if(options.draggable){angular.extend(this.draggable,options.draggable);delete(options.draggable);}
if(options.resizable){angular.extend(this.resizable,options.resizable);delete(options.resizable);}
angular.extend(this,options);if(!this.margins||this.margins.length!==2){this.margins=[0,0];}else{for(var x=0,l=this.margins.length;x<l;++x){this.margins[x]=parseInt(this.margins[x],10);if(isNaN(this.margins[x])){this.margins[x]=0;}}}};this.canItemOccupy=function(item,row,column){return row>-1&&column>-1&&item.sizeX+column<=this.columns&&item.sizeY+row<=this.maxRows;};this.autoSetItemPosition=function(item){for(var rowIndex=0;rowIndex<this.maxRows;++rowIndex){for(var colIndex=0;colIndex<this.columns;++colIndex){var items=this.getItems(rowIndex,colIndex,item.sizeX,item.sizeY,item);if(items.length===0&&this.canItemOccupy(item,rowIndex,colIndex)){this.putItem(item,rowIndex,colIndex);return;}}}
throw new Error('Unable to place item!');};this.getItems=function(row,column,sizeX,sizeY,excludeItems){var items=[];if(!sizeX||!sizeY){sizeX=sizeY=1;}
if(excludeItems&&!(excludeItems instanceof Array)){excludeItems=[excludeItems];}
var item;if(this.sparse===false){for(var h=0;h<sizeY;++h){for(var w=0;w<sizeX;++w){item=this.getItem(row+h,column+w,excludeItems);if(item&&(!excludeItems||excludeItems.indexOf(item)===-1)&&items.indexOf(item)===-1){items.push(item);}}}}else{var bottom=row+sizeY-1;var right=column+sizeX-1;for(var i=0;i<this.allItems.length;++i){item=this.allItems[i];if(item&&(!excludeItems||excludeItems.indexOf(item)===-1)&&items.indexOf(item)===-1&&this.intersect(item,column,right,row,bottom)){items.push(item);}}}
return items;};this.getBoundingBox=function(items){if(items.length===0){return null;}
if(items.length===1){return{row:items[0].row,col:items[0].col,sizeY:items[0].sizeY,sizeX:items[0].sizeX};}
var maxRow=0;var maxCol=0;var minRow=9999;var minCol=9999;for(var i=0,l=items.length;i<l;++i){var item=items[i];minRow=Math.min(item.row,minRow);minCol=Math.min(item.col,minCol);maxRow=Math.max(item.row+item.sizeY,maxRow);maxCol=Math.max(item.col+item.sizeX,maxCol);}
return{row:minRow,col:minCol,sizeY:maxRow-minRow,sizeX:maxCol-minCol};};this.intersect=function(item,left,right,top,bottom){return(left<=item.col+item.sizeX-1&&right>=item.col&&top<=item.row+item.sizeY-1&&bottom>=item.row);};this.removeItem=function(item){var index;for(var rowIndex=0,l=this.grid.length;rowIndex<l;++rowIndex){var columns=this.grid[rowIndex];if(!columns){continue;}
index=columns.indexOf(item);if(index!==-1){columns[index]=null;break;}}
if(this.sparse){index=this.allItems.indexOf(item);if(index!==-1){this.allItems.splice(index,1);}}
this.layoutChanged();};this.getItem=function(row,column,excludeItems){if(excludeItems&&!(excludeItems instanceof Array)){excludeItems=[excludeItems];}
var sizeY=1;while(row>-1){var sizeX=1,col=column;while(col>-1){var items=this.grid[row];if(items){var item=items[col];if(item&&(!excludeItems||excludeItems.indexOf(item)===-1)&&item.sizeX>=sizeX&&item.sizeY>=sizeY){return item;}}
++sizeX;--col;}
--row;++sizeY;}
return null;};this.putItems=function(items){for(var i=0,l=items.length;i<l;++i){this.putItem(items[i]);}};this.putItem=function(item,row,column,ignoreItems){if(typeof row==='undefined'||row===null){row=item.row;column=item.col;if(typeof row==='undefined'||row===null){this.autoSetItemPosition(item);return;}}
if(!this.canItemOccupy(item,row,column)){column=Math.min(this.columns-item.sizeX,Math.max(0,column));row=Math.min(this.maxRows-item.sizeY,Math.max(0,row));}
if(item.oldRow!==null&&typeof item.oldRow!=='undefined'){var samePosition=item.oldRow===row&&item.oldColumn===column;var inGrid=this.grid[row]&&this.grid[row][column]===item;if(samePosition&&inGrid){item.row=row;item.col=column;return;}else{var oldRow=this.grid[item.oldRow];if(oldRow&&oldRow[item.oldColumn]===item){delete oldRow[item.oldColumn];}}}
item.oldRow=item.row=row;item.oldColumn=item.col=column;this.moveOverlappingItems(item,ignoreItems);if(!this.grid[row]){this.grid[row]=[];}
this.grid[row][column]=item;if(this.sparse&&this.allItems.indexOf(item)===-1){this.allItems.push(item);}
if(this.movingItem===item){this.floatItemUp(item);}
this.layoutChanged();};this.swapItems=function(item1,item2){this.grid[item1.row][item1.col]=item2;this.grid[item2.row][item2.col]=item1;var item1Row=item1.row;var item1Col=item1.col;item1.row=item2.row;item1.col=item2.col;item2.row=item1Row;item2.col=item1Col;};this.moveOverlappingItems=function(item,ignoreItems){if(!ignoreItems){ignoreItems=[item];}else if(ignoreItems.indexOf(item)===-1){ignoreItems=ignoreItems.slice(0);ignoreItems.push(item);}
var overlappingItems=this.getItems(item.row,item.col,item.sizeX,item.sizeY,ignoreItems);this.moveItemsDown(overlappingItems,item.row+item.sizeY,ignoreItems);};this.moveItemsDown=function(items,newRow,ignoreItems){if(!items||items.length===0){return;}
items.sort(function(a,b){return a.row-b.row;});ignoreItems=ignoreItems?ignoreItems.slice(0):[];var topRows={},item,i,l;for(i=0,l=items.length;i<l;++i){item=items[i];var topRow=topRows[item.col];if(typeof topRow==='undefined'||item.row<topRow){topRows[item.col]=item.row;}}
for(i=0,l=items.length;i<l;++i){item=items[i];var rowsToMove=newRow-topRows[item.col];this.moveItemDown(item,item.row+rowsToMove,ignoreItems);ignoreItems.push(item);}};this.moveItemDown=function(item,newRow,ignoreItems){if(item.row>=newRow){return;}
while(item.row<newRow){++item.row;this.moveOverlappingItems(item,ignoreItems);}
this.putItem(item,item.row,item.col,ignoreItems);};this.floatItemsUp=function(){if(this.floating===false){return;}
for(var rowIndex=0,l=this.grid.length;rowIndex<l;++rowIndex){var columns=this.grid[rowIndex];if(!columns){continue;}
for(var colIndex=0,len=columns.length;colIndex<len;++colIndex){var item=columns[colIndex];if(item){this.floatItemUp(item);}}}};this.floatItemUp=function(item){if(this.floating===false){return;}
var colIndex=item.col,sizeY=item.sizeY,sizeX=item.sizeX,bestRow=null,bestColumn=null,rowIndex=item.row-1;while(rowIndex>-1){var items=this.getItems(rowIndex,colIndex,sizeX,sizeY,item);if(items.length!==0){break;}
bestRow=rowIndex;bestColumn=colIndex;--rowIndex;}
if(bestRow!==null){this.putItem(item,bestRow,bestColumn);}};this.updateHeight=function(plus){var maxHeight=this.minRows;plus=plus||0;for(var rowIndex=this.grid.length;rowIndex>=0;--rowIndex){var columns=this.grid[rowIndex];if(!columns){continue;}
for(var colIndex=0,len=columns.length;colIndex<len;++colIndex){if(columns[colIndex]){maxHeight=Math.max(maxHeight,rowIndex+plus+columns[colIndex].sizeY);}}}
this.gridHeight=this.maxRows-maxHeight>0?Math.min(this.maxRows,maxHeight):Math.max(this.maxRows,maxHeight);};this.pixelsToRows=function(pixels,ceilOrFloor){if(!this.outerMargin){pixels+=this.margins[0]/2;}
if(ceilOrFloor===true){return Math.ceil(pixels/this.curRowHeight);}else if(ceilOrFloor===false){return Math.floor(pixels/this.curRowHeight);}
return Math.round(pixels/this.curRowHeight);};this.pixelsToColumns=function(pixels,ceilOrFloor){if(!this.outerMargin){pixels+=this.margins[1]/2;}
if(ceilOrFloor===true){return Math.ceil(pixels/this.curColWidth);}else if(ceilOrFloor===false){return Math.floor(pixels/this.curColWidth);}
return Math.round(pixels/this.curColWidth);};}]).directive('gridsterPreview',function(){return{replace:true,scope:true,require:'^gridster',template:'<div ng-style="previewStyle()" class="gridster-item gridster-preview-holder"></div>',link:function(scope,$el,attrs,gridster){scope.previewStyle=function(){if(!gridster.movingItem){return{display:'none'};}
return{display:'block',height:(gridster.movingItem.sizeY*gridster.curRowHeight-gridster.margins[0])+'px',width:(gridster.movingItem.sizeX*gridster.curColWidth-gridster.margins[1])+'px',top:(gridster.movingItem.row*gridster.curRowHeight+(gridster.outerMargin?gridster.margins[0]:0))+'px',left:(gridster.movingItem.col*gridster.curColWidth+(gridster.outerMargin?gridster.margins[1]:0))+'px'};};}};}).directive('gridster',['$timeout','$window','$rootScope','gridsterDebounce',function($timeout,$window,$rootScope,gridsterDebounce){return{scope:true,restrict:'EAC',controller:'GridsterCtrl',controllerAs:'gridster',compile:function($tplElem){$tplElem.prepend('<div ng-if="gridster.movingItem" gridster-preview></div>');return function(scope,$elem,attrs,gridster){gridster.loaded=false;gridster.$element=$elem;scope.gridster=gridster;$elem.addClass('gridster');var isVisible=function(ele){return ele.style.visibility!=='hidden'&&ele.style.display!=='none';};function updateHeight(){$elem.css('height',(gridster.gridHeight*gridster.curRowHeight)+(gridster.outerMargin?gridster.margins[0]:-gridster.margins[0])+'px');}
scope.$watch(function(){return gridster.gridHeight;},updateHeight);scope.$watch(function(){return gridster.movingItem;},function(){gridster.updateHeight(gridster.movingItem?gridster.movingItem.sizeY:0);});function refresh(config){gridster.setOptions(config);if(!isVisible($elem[0])){return;}
if(gridster.width==='auto'){gridster.curWidth=$elem[0].offsetWidth||parseInt($elem.css('width'),10);}else{gridster.curWidth=gridster.width;}
if(gridster.colWidth==='auto'){gridster.curColWidth=(gridster.curWidth+(gridster.outerMargin?-gridster.margins[1]:gridster.margins[1]))/gridster.columns;}else{gridster.curColWidth=gridster.colWidth;}
gridster.curRowHeight=gridster.rowHeight;if(typeof gridster.rowHeight==='string'){if(gridster.rowHeight==='match'){gridster.curRowHeight=Math.round(gridster.curColWidth);}else if(gridster.rowHeight.indexOf('*')!==-1){gridster.curRowHeight=Math.round(gridster.curColWidth*gridster.rowHeight.replace('*','').replace(' ',''));}else if(gridster.rowHeight.indexOf('/')!==-1){gridster.curRowHeight=Math.round(gridster.curColWidth/gridster.rowHeight.replace('/','').replace(' ',''));}}
gridster.isMobile=gridster.mobileModeEnabled&&gridster.curWidth<=gridster.mobileBreakPoint;for(var rowIndex=0,l=gridster.grid.length;rowIndex<l;++rowIndex){var columns=gridster.grid[rowIndex];if(!columns){continue;}
for(var colIndex=0,len=columns.length;colIndex<len;++colIndex){if(columns[colIndex]){var item=columns[colIndex];item.setElementPosition();item.setElementSizeY();item.setElementSizeX();}}}
updateHeight();}
var optionsKey=attrs.gridster;if(optionsKey){scope.$parent.$watch(optionsKey,function(newConfig){refresh(newConfig);},true);}else{refresh({});}
scope.$watch(function(){return gridster.loaded;},function(){if(gridster.loaded){$elem.addClass('gridster-loaded');$rootScope.$broadcast('gridster-loaded',gridster);}else{$elem.removeClass('gridster-loaded');}});scope.$watch(function(){return gridster.isMobile;},function(){if(gridster.isMobile){$elem.addClass('gridster-mobile').removeClass('gridster-desktop');}else{$elem.removeClass('gridster-mobile').addClass('gridster-desktop');}
$rootScope.$broadcast('gridster-mobile-changed',gridster);});scope.$watch(function(){return gridster.draggable;},function(){$rootScope.$broadcast('gridster-draggable-changed',gridster);},true);scope.$watch(function(){return gridster.resizable;},function(){$rootScope.$broadcast('gridster-resizable-changed',gridster);},true);var prevWidth=$elem[0].offsetWidth||parseInt($elem.css('width'),10);var resize=function(){var width=$elem[0].offsetWidth||parseInt($elem.css('width'),10);if(!width||width===prevWidth||gridster.movingItem){return;}
prevWidth=width;if(gridster.loaded){$elem.removeClass('gridster-loaded');}
refresh();if(gridster.loaded){$elem.addClass('gridster-loaded');}
$rootScope.$broadcast('gridster-resized',[width,$elem[0].offsetHeight],gridster);};var onResize=gridsterDebounce(function onResize(){resize();$timeout(function(){scope.$apply();});},100);scope.$watch(function(){return isVisible($elem[0]);},onResize);if(typeof window.addResizeListener==='function'){window.addResizeListener($elem[0],onResize);}else{scope.$watch(function(){return $elem[0].offsetWidth||parseInt($elem.css('width'),10);},resize);}
var $win=angular.element($window);$win.on('resize',onResize);scope.$on('$destroy',function(){gridster.destroy();$win.off('resize',onResize);if(typeof window.removeResizeListener==='function'){window.removeResizeListener($elem[0],onResize);}});$timeout(function(){scope.$watch('gridster.floating',function(){gridster.floatItemsUp();});gridster.loaded=true;},100);};}};}]).controller('GridsterItemCtrl',function(){this.$element=null;this.gridster=null;this.row=null;this.col=null;this.sizeX=null;this.sizeY=null;this.minSizeX=0;this.minSizeY=0;this.maxSizeX=null;this.maxSizeY=null;this.init=function($element,gridster){this.$element=$element;this.gridster=gridster;this.sizeX=gridster.defaultSizeX;this.sizeY=gridster.defaultSizeY;};this.destroy=function(){this.gridster=null;this.$element=null;};this.toJSON=function(){return{row:this.row,col:this.col,sizeY:this.sizeY,sizeX:this.sizeX};};this.isMoving=function(){return this.gridster.movingItem===this;};this.setPosition=function(row,column){this.gridster.putItem(this,row,column);if(!this.isMoving()){this.setElementPosition();}};this.setSize=function(key,value,preventMove){key=key.toUpperCase();var camelCase='size'+key,titleCase='Size'+key;if(value===''){return;}
value=parseInt(value,10);if(isNaN(value)||value===0){value=this.gridster['default'+titleCase];}
var max=key==='X'?this.gridster.columns:this.gridster.maxRows;if(this['max'+titleCase]){max=Math.min(this['max'+titleCase],max);}
if(this.gridster['max'+titleCase]){max=Math.min(this.gridster['max'+titleCase],max);}
if(key==='X'&&this.cols){max-=this.cols;}else if(key==='Y'&&this.rows){max-=this.rows;}
var min=0;if(this['min'+titleCase]){min=Math.max(this['min'+titleCase],min);}
if(this.gridster['min'+titleCase]){min=Math.max(this.gridster['min'+titleCase],min);}
value=Math.max(Math.min(value,max),min);var changed=(this[camelCase]!==value||(this['old'+titleCase]&&this['old'+titleCase]!==value));this['old'+titleCase]=this[camelCase]=value;if(!this.isMoving()){this['setElement'+titleCase]();}
if(!preventMove&&changed){this.gridster.moveOverlappingItems(this);this.gridster.layoutChanged();}
return changed;};this.setSizeY=function(rows,preventMove){return this.setSize('Y',rows,preventMove);};this.setSizeX=function(columns,preventMove){return this.setSize('X',columns,preventMove);};this.setElementPosition=function(){if(this.gridster.isMobile){this.$element.css({marginLeft:this.gridster.margins[0]+'px',marginRight:this.gridster.margins[0]+'px',marginTop:this.gridster.margins[1]+'px',marginBottom:this.gridster.margins[1]+'px',top:'',left:''});}else{this.$element.css({margin:0,top:(this.row*this.gridster.curRowHeight+(this.gridster.outerMargin?this.gridster.margins[0]:0))+'px',left:(this.col*this.gridster.curColWidth+(this.gridster.outerMargin?this.gridster.margins[1]:0))+'px'});}};this.setElementSizeY=function(){if(this.gridster.isMobile&&!this.gridster.saveGridItemCalculatedHeightInMobile){this.$element.css('height','');}else{this.$element.css('height',(this.sizeY*this.gridster.curRowHeight-this.gridster.margins[0])+'px');}};this.setElementSizeX=function(){if(this.gridster.isMobile){this.$element.css('width','');}else{this.$element.css('width',(this.sizeX*this.gridster.curColWidth-this.gridster.margins[1])+'px');}};this.getElementSizeX=function(){return(this.sizeX*this.gridster.curColWidth-this.gridster.margins[1]);};this.getElementSizeY=function(){return(this.sizeY*this.gridster.curRowHeight-this.gridster.margins[0]);};}).factory('GridsterTouch',[function(){return function GridsterTouch(target,startEvent,moveEvent,endEvent){var lastXYById={};var numberOfKeys=function(theObject){if(Object.keys){return Object.keys(theObject).length;}
var n=0,key;for(key in theObject){++n;}
return n;};var computeDocumentToElementDelta=function(theElement){var elementLeft=0;var elementTop=0;var oldIEUserAgent=navigator.userAgent.match(/\bMSIE\b/);for(var offsetElement=theElement;offsetElement!=null;offsetElement=offsetElement.offsetParent){if(oldIEUserAgent&&(!document.documentMode||document.documentMode<8)&&offsetElement.currentStyle.position==='relative'&&offsetElement.offsetParent&&offsetElement.offsetParent.currentStyle.position==='relative'&&offsetElement.offsetLeft===offsetElement.offsetParent.offsetLeft){elementTop+=offsetElement.offsetTop;}else{elementLeft+=offsetElement.offsetLeft;elementTop+=offsetElement.offsetTop;}}
return{x:elementLeft,y:elementTop};};var documentToTargetDelta=computeDocumentToElementDelta(target);var useSetReleaseCapture=false;var doEvent=function(theEvtObj){if(theEvtObj.type==='mousemove'&&numberOfKeys(lastXYById)===0){return;}
var prevent=true;var pointerList=theEvtObj.changedTouches?theEvtObj.changedTouches:[theEvtObj];for(var i=0;i<pointerList.length;++i){var pointerObj=pointerList[i];var pointerId=(typeof pointerObj.identifier!=='undefined')?pointerObj.identifier:(typeof pointerObj.pointerId!=='undefined')?pointerObj.pointerId:1;if(typeof pointerObj.pageX==='undefined'){pointerObj.pageX=pointerObj.offsetX+documentToTargetDelta.x;pointerObj.pageY=pointerObj.offsetY+documentToTargetDelta.y;if(pointerObj.srcElement.offsetParent===target&&document.documentMode&&document.documentMode===8&&pointerObj.type==='mousedown'){pointerObj.pageX+=pointerObj.srcElement.offsetLeft;pointerObj.pageY+=pointerObj.srcElement.offsetTop;}else if(pointerObj.srcElement!==target&&!document.documentMode||document.documentMode<8){var sx=-2,sy=-2;for(var scrollElement=pointerObj.srcElement;scrollElement!==null;scrollElement=scrollElement.parentNode){sx+=scrollElement.scrollLeft?scrollElement.scrollLeft:0;sy+=scrollElement.scrollTop?scrollElement.scrollTop:0;}
pointerObj.pageX=pointerObj.clientX+sx;pointerObj.pageY=pointerObj.clientY+sy;}}
var pageX=pointerObj.pageX;var pageY=pointerObj.pageY;if(theEvtObj.type.match(/(start|down)$/i)){documentToTargetDelta=computeDocumentToElementDelta(target);if(lastXYById[pointerId]){if(endEvent){endEvent({target:theEvtObj.target,which:theEvtObj.which,pointerId:pointerId,pageX:pageX,pageY:pageY});}
delete lastXYById[pointerId];}
if(startEvent){if(prevent){prevent=startEvent({target:theEvtObj.target,which:theEvtObj.which,pointerId:pointerId,pageX:pageX,pageY:pageY});}}
lastXYById[pointerId]={x:pageX,y:pageY};if(target.msSetPointerCapture&&prevent){target.msSetPointerCapture(pointerId);}else if(theEvtObj.type==='mousedown'&&numberOfKeys(lastXYById)===1){if(useSetReleaseCapture){target.setCapture(true);}else{document.addEventListener('mousemove',doEvent,false);document.addEventListener('mouseup',doEvent,false);}}}else if(theEvtObj.type.match(/move$/i)){if(lastXYById[pointerId]&&!(lastXYById[pointerId].x===pageX&&lastXYById[pointerId].y===pageY)){if(moveEvent&&prevent){prevent=moveEvent({target:theEvtObj.target,which:theEvtObj.which,pointerId:pointerId,pageX:pageX,pageY:pageY});}
lastXYById[pointerId].x=pageX;lastXYById[pointerId].y=pageY;}}else if(lastXYById[pointerId]&&theEvtObj.type.match(/(up|end|cancel)$/i)){if(endEvent&&prevent){prevent=endEvent({target:theEvtObj.target,which:theEvtObj.which,pointerId:pointerId,pageX:pageX,pageY:pageY});}
delete lastXYById[pointerId];if(target.msReleasePointerCapture){target.msReleasePointerCapture(pointerId);}else if(theEvtObj.type==='mouseup'&&numberOfKeys(lastXYById)===0){if(useSetReleaseCapture){target.releaseCapture();}else{document.removeEventListener('mousemove',doEvent,false);document.removeEventListener('mouseup',doEvent,false);}}}}
if(prevent){if(theEvtObj.preventDefault){theEvtObj.preventDefault();}
if(theEvtObj.preventManipulation){theEvtObj.preventManipulation();}
if(theEvtObj.preventMouseEvent){theEvtObj.preventMouseEvent();}}};var contentZooming,msTouchAction;this.enable=function(){if(window.navigator.msPointerEnabled){target.addEventListener('MSPointerDown',doEvent,false);target.addEventListener('MSPointerMove',doEvent,false);target.addEventListener('MSPointerUp',doEvent,false);target.addEventListener('MSPointerCancel',doEvent,false);if(typeof target.style.msContentZooming!=='undefined'){contentZooming=target.style.msContentZooming;target.style.msContentZooming='none';}
if(typeof target.style.msTouchAction!=='undefined'){msTouchAction=target.style.msTouchAction;target.style.msTouchAction='none';}}else if(target.addEventListener){target.addEventListener('touchstart',doEvent,false);target.addEventListener('touchmove',doEvent,false);target.addEventListener('touchend',doEvent,false);target.addEventListener('touchcancel',doEvent,false);target.addEventListener('mousedown',doEvent,false);if(target.setCapture&&!window.navigator.userAgent.match(/\bGecko\b/)){useSetReleaseCapture=true;target.addEventListener('mousemove',doEvent,false);target.addEventListener('mouseup',doEvent,false);}}else if(target.attachEvent&&target.setCapture){useSetReleaseCapture=true;target.attachEvent('onmousedown',function(){doEvent(window.event);window.event.returnValue=false;return false;});target.attachEvent('onmousemove',function(){doEvent(window.event);window.event.returnValue=false;return false;});target.attachEvent('onmouseup',function(){doEvent(window.event);window.event.returnValue=false;return false;});}};this.disable=function(){if(window.navigator.msPointerEnabled){target.removeEventListener('MSPointerDown',doEvent,false);target.removeEventListener('MSPointerMove',doEvent,false);target.removeEventListener('MSPointerUp',doEvent,false);target.removeEventListener('MSPointerCancel',doEvent,false);if(contentZooming){target.style.msContentZooming=contentZooming;}
if(msTouchAction){target.style.msTouchAction=msTouchAction;}}else if(target.removeEventListener){target.removeEventListener('touchstart',doEvent,false);target.removeEventListener('touchmove',doEvent,false);target.removeEventListener('touchend',doEvent,false);target.removeEventListener('touchcancel',doEvent,false);target.removeEventListener('mousedown',doEvent,false);if(target.setCapture&&!window.navigator.userAgent.match(/\bGecko\b/)){useSetReleaseCapture=true;target.removeEventListener('mousemove',doEvent,false);target.removeEventListener('mouseup',doEvent,false);}}else if(target.detachEvent&&target.setCapture){useSetReleaseCapture=true;target.detachEvent('onmousedown');target.detachEvent('onmousemove');target.detachEvent('onmouseup');}};return this;};}]).factory('GridsterDraggable',['$document','$window','GridsterTouch',function($document,$window,GridsterTouch){function GridsterDraggable($el,scope,gridster,item,itemOptions){var elmX,elmY,elmW,elmH,mouseX=0,mouseY=0,lastMouseX=0,lastMouseY=0,mOffX=0,mOffY=0,minTop=0,minLeft=0,realdocument=$document[0];var originalCol,originalRow;var inputTags=['select','option','input','textarea','button'];function dragStart(event){$el.addClass('gridster-item-moving');gridster.movingItem=item;gridster.updateHeight(item.sizeY);scope.$apply(function(){if(gridster.draggable&&gridster.draggable.start){gridster.draggable.start(event,$el,itemOptions,item);}});}
function drag(event){var oldRow=item.row,oldCol=item.col,hasCallback=gridster.draggable&&gridster.draggable.drag,scrollSensitivity=gridster.draggable.scrollSensitivity,scrollSpeed=gridster.draggable.scrollSpeed;var row=Math.min(gridster.pixelsToRows(elmY),gridster.maxRows-1);var col=Math.min(gridster.pixelsToColumns(elmX),gridster.columns-1);var itemsInTheWay=gridster.getItems(row,col,item.sizeX,item.sizeY,item);var hasItemsInTheWay=itemsInTheWay.length!==0;if(gridster.swapping===true&&hasItemsInTheWay){var boundingBoxItem=gridster.getBoundingBox(itemsInTheWay),sameSize=boundingBoxItem.sizeX===item.sizeX&&boundingBoxItem.sizeY===item.sizeY,sameRow=boundingBoxItem.row===oldRow,sameCol=boundingBoxItem.col===oldCol,samePosition=boundingBoxItem.row===row&&boundingBoxItem.col===col,inline=sameRow||sameCol;if(sameSize&&itemsInTheWay.length===1){if(samePosition){gridster.swapItems(item,itemsInTheWay[0]);}else if(inline){return;}}else if(boundingBoxItem.sizeX<=item.sizeX&&boundingBoxItem.sizeY<=item.sizeY&&inline){var emptyRow=item.row<=row?item.row:row+item.sizeY,emptyCol=item.col<=col?item.col:col+item.sizeX,rowOffset=emptyRow-boundingBoxItem.row,colOffset=emptyCol-boundingBoxItem.col;for(var i=0,l=itemsInTheWay.length;i<l;++i){var itemInTheWay=itemsInTheWay[i];var itemsInFreeSpace=gridster.getItems(itemInTheWay.row+rowOffset,itemInTheWay.col+colOffset,itemInTheWay.sizeX,itemInTheWay.sizeY,item);if(itemsInFreeSpace.length===0){gridster.putItem(itemInTheWay,itemInTheWay.row+rowOffset,itemInTheWay.col+colOffset);}}}}
if(gridster.pushing!==false||!hasItemsInTheWay){item.row=row;item.col=col;}
if(event.pageY-realdocument.body.scrollTop<scrollSensitivity){realdocument.body.scrollTop=realdocument.body.scrollTop-scrollSpeed;}else if($window.innerHeight-(event.pageY-realdocument.body.scrollTop)<scrollSensitivity){realdocument.body.scrollTop=realdocument.body.scrollTop+scrollSpeed;}
if(event.pageX-realdocument.body.scrollLeft<scrollSensitivity){realdocument.body.scrollLeft=realdocument.body.scrollLeft-scrollSpeed;}else if($window.innerWidth-(event.pageX-realdocument.body.scrollLeft)<scrollSensitivity){realdocument.body.scrollLeft=realdocument.body.scrollLeft+scrollSpeed;}
if(hasCallback||oldRow!==item.row||oldCol!==item.col){scope.$apply(function(){if(hasCallback){gridster.draggable.drag(event,$el,itemOptions,item);}});}}
function dragStop(event){$el.removeClass('gridster-item-moving');var row=Math.min(gridster.pixelsToRows(elmY),gridster.maxRows-1);var col=Math.min(gridster.pixelsToColumns(elmX),gridster.columns-1);if(gridster.pushing!==false||gridster.getItems(row,col,item.sizeX,item.sizeY,item).length===0){item.row=row;item.col=col;}
gridster.movingItem=null;item.setPosition(item.row,item.col);scope.$apply(function(){if(gridster.draggable&&gridster.draggable.stop){gridster.draggable.stop(event,$el,itemOptions,item);}});}
function mouseDown(e){if(inputTags.indexOf(e.target.nodeName.toLowerCase())!==-1){return false;}
var $target=angular.element(e.target);if($target.hasClass('gridster-item-resizable-handler')){return false;}
if($target.attr('onclick')||$target.attr('ng-click')){return false;}
if($target.closest&&$target.closest('.gridster-no-drag').length){return false;}
if(gridster.draggable&&gridster.draggable.handle){var $dragHandles=angular.element($el[0].querySelectorAll(gridster.draggable.handle));var match=false;outerloop:for(var h=0,hl=$dragHandles.length;h<hl;++h){var handle=$dragHandles[h];if(handle===e.target){match=true;break;}
var target=e.target;for(var p=0;p<20;++p){var parent=target.parentNode;if(parent===$el[0]||!parent){break;}
if(parent===handle){match=true;break outerloop;}
target=parent;}}
if(!match){return false;}}
switch(e.which){case 1:break;case 2:case 3:return;}
lastMouseX=e.pageX;lastMouseY=e.pageY;elmX=parseInt($el.css('left'),10);elmY=parseInt($el.css('top'),10);elmW=$el[0].offsetWidth;elmH=$el[0].offsetHeight;originalCol=item.col;originalRow=item.row;dragStart(e);return true;}
function mouseMove(e){if(!$el.hasClass('gridster-item-moving')||$el.hasClass('gridster-item-resizing')){return false;}
var maxLeft=gridster.curWidth-1;var maxTop=gridster.curRowHeight*gridster.maxRows-1;mouseX=e.pageX;mouseY=e.pageY;var diffX=mouseX-lastMouseX+mOffX;var diffY=mouseY-lastMouseY+mOffY;mOffX=mOffY=0;lastMouseX=mouseX;lastMouseY=mouseY;var dX=diffX,dY=diffY;if(elmX+dX<minLeft){diffX=minLeft-elmX;mOffX=dX-diffX;}else if(elmX+elmW+dX>maxLeft){diffX=maxLeft-elmX-elmW;mOffX=dX-diffX;}
if(elmY+dY<minTop){diffY=minTop-elmY;mOffY=dY-diffY;}else if(elmY+elmH+dY>maxTop){diffY=maxTop-elmY-elmH;mOffY=dY-diffY;}
elmX+=diffX;elmY+=diffY;$el.css({'top':elmY+'px','left':elmX+'px'});drag(e);return true;}
function mouseUp(e){if(!$el.hasClass('gridster-item-moving')||$el.hasClass('gridster-item-resizing')){return false;}
mOffX=mOffY=0;dragStop(e);return true;}
var enabled=null;var gridsterTouch=null;this.enable=function(){if(enabled===true){return;}
enabled=true;if(gridsterTouch){gridsterTouch.enable();return;}
gridsterTouch=new GridsterTouch($el[0],mouseDown,mouseMove,mouseUp);gridsterTouch.enable();};this.disable=function(){if(enabled===false){return;}
enabled=false;if(gridsterTouch){gridsterTouch.disable();}};this.toggle=function(enabled){if(enabled){this.enable();}else{this.disable();}};this.destroy=function(){this.disable();};}
return GridsterDraggable;}]).factory('GridsterResizable',['GridsterTouch',function(GridsterTouch){function GridsterResizable($el,scope,gridster,item,itemOptions){function ResizeHandle(handleClass){var hClass=handleClass;var elmX,elmY,elmW,elmH,mouseX=0,mouseY=0,lastMouseX=0,lastMouseY=0,mOffX=0,mOffY=0,minTop=0,maxTop=9999,minLeft=0;var getMinHeight=function(){return(item.minSizeY?item.minSizeY:1)*gridster.curRowHeight-gridster.margins[0];};var getMinWidth=function(){return(item.minSizeX?item.minSizeX:1)*gridster.curColWidth-gridster.margins[1];};var originalWidth,originalHeight;var savedDraggable;function resizeStart(e){$el.addClass('gridster-item-moving');$el.addClass('gridster-item-resizing');gridster.movingItem=item;item.setElementSizeX();item.setElementSizeY();item.setElementPosition();gridster.updateHeight(1);scope.$apply(function(){if(gridster.resizable&&gridster.resizable.start){gridster.resizable.start(e,$el,itemOptions,item);}});}
function resize(e){var oldRow=item.row,oldCol=item.col,oldSizeX=item.sizeX,oldSizeY=item.sizeY,hasCallback=gridster.resizable&&gridster.resizable.resize;var col=item.col;if(['w','nw','sw'].indexOf(handleClass)!==-1){col=gridster.pixelsToColumns(elmX,false);}
var row=item.row;if(['n','ne','nw'].indexOf(handleClass)!==-1){row=gridster.pixelsToRows(elmY,false);}
var sizeX=item.sizeX;if(['n','s'].indexOf(handleClass)===-1){sizeX=gridster.pixelsToColumns(elmW,true);}
var sizeY=item.sizeY;if(['e','w'].indexOf(handleClass)===-1){sizeY=gridster.pixelsToRows(elmH,true);}
var canOccupy=row>-1&&col>-1&&sizeX+col<=gridster.columns&&sizeY+row<=gridster.maxRows;if(canOccupy&&(gridster.pushing!==false||gridster.getItems(row,col,sizeX,sizeY,item).length===0)){item.row=row;item.col=col;item.sizeX=sizeX;item.sizeY=sizeY;}
var isChanged=item.row!==oldRow||item.col!==oldCol||item.sizeX!==oldSizeX||item.sizeY!==oldSizeY;if(hasCallback||isChanged){scope.$apply(function(){if(hasCallback){gridster.resizable.resize(e,$el,itemOptions,item);}});}}
function resizeStop(e){$el.removeClass('gridster-item-moving');$el.removeClass('gridster-item-resizing');gridster.movingItem=null;item.setPosition(item.row,item.col);item.setSizeY(item.sizeY);item.setSizeX(item.sizeX);scope.$apply(function(){if(gridster.resizable&&gridster.resizable.stop){gridster.resizable.stop(e,$el,itemOptions,item);}});}
function mouseDown(e){switch(e.which){case 1:break;case 2:case 3:return;}
savedDraggable=gridster.draggable.enabled;if(savedDraggable){gridster.draggable.enabled=false;scope.$broadcast('gridster-draggable-changed',gridster);}
lastMouseX=e.pageX;lastMouseY=e.pageY;elmX=parseInt($el.css('left'),10);elmY=parseInt($el.css('top'),10);elmW=$el[0].offsetWidth;elmH=$el[0].offsetHeight;originalWidth=item.sizeX;originalHeight=item.sizeY;resizeStart(e);return true;}
function mouseMove(e){var maxLeft=gridster.curWidth-1;mouseX=e.pageX;mouseY=e.pageY;var diffX=mouseX-lastMouseX+mOffX;var diffY=mouseY-lastMouseY+mOffY;mOffX=mOffY=0;lastMouseX=mouseX;lastMouseY=mouseY;var dY=diffY,dX=diffX;if(hClass.indexOf('n')>=0){if(elmH-dY<getMinHeight()){diffY=elmH-getMinHeight();mOffY=dY-diffY;}else if(elmY+dY<minTop){diffY=minTop-elmY;mOffY=dY-diffY;}
elmY+=diffY;elmH-=diffY;}
if(hClass.indexOf('s')>=0){if(elmH+dY<getMinHeight()){diffY=getMinHeight()-elmH;mOffY=dY-diffY;}else if(elmY+elmH+dY>maxTop){diffY=maxTop-elmY-elmH;mOffY=dY-diffY;}
elmH+=diffY;}
if(hClass.indexOf('w')>=0){if(elmW-dX<getMinWidth()){diffX=elmW-getMinWidth();mOffX=dX-diffX;}else if(elmX+dX<minLeft){diffX=minLeft-elmX;mOffX=dX-diffX;}
elmX+=diffX;elmW-=diffX;}
if(hClass.indexOf('e')>=0){if(elmW+dX<getMinWidth()){diffX=getMinWidth()-elmW;mOffX=dX-diffX;}else if(elmX+elmW+dX>maxLeft){diffX=maxLeft-elmX-elmW;mOffX=dX-diffX;}
elmW+=diffX;}
$el.css({'top':elmY+'px','left':elmX+'px','width':elmW+'px','height':elmH+'px'});resize(e);return true;}
function mouseUp(e){if(gridster.draggable.enabled!==savedDraggable){gridster.draggable.enabled=savedDraggable;scope.$broadcast('gridster-draggable-changed',gridster);}
mOffX=mOffY=0;resizeStop(e);return true;}
var $dragHandle=null;var unifiedInput;this.enable=function(){if(!$dragHandle){$dragHandle=angular.element('<div class="gridster-item-resizable-handler handle-'+hClass+'"></div>');$el.append($dragHandle);}
unifiedInput=new GridsterTouch($dragHandle[0],mouseDown,mouseMove,mouseUp);unifiedInput.enable();};this.disable=function(){if($dragHandle){$dragHandle.remove();$dragHandle=null;}
unifiedInput.disable();unifiedInput=undefined;};this.destroy=function(){this.disable();};}
var handles=[];var handlesOpts=gridster.resizable.handles;if(typeof handlesOpts==='string'){handlesOpts=gridster.resizable.handles.split(',');}
var enabled=false;for(var c=0,l=handlesOpts.length;c<l;c++){handles.push(new ResizeHandle(handlesOpts[c]));}
this.enable=function(){if(enabled){return;}
for(var c=0,l=handles.length;c<l;c++){handles[c].enable();}
enabled=true;};this.disable=function(){if(!enabled){return;}
for(var c=0,l=handles.length;c<l;c++){handles[c].disable();}
enabled=false;};this.toggle=function(enabled){if(enabled){this.enable();}else{this.disable();}};this.destroy=function(){for(var c=0,l=handles.length;c<l;c++){handles[c].destroy();}};}
return GridsterResizable;}]).factory('gridsterDebounce',function(){return function gridsterDebounce(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;var later=function(){timeout=null;if(!immediate){func.apply(context,args);}};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow){func.apply(context,args);}};};}).directive('gridsterItem',['$parse','GridsterDraggable','GridsterResizable','gridsterDebounce',function($parse,GridsterDraggable,GridsterResizable,gridsterDebounce){return{scope:true,restrict:'EA',controller:'GridsterItemCtrl',controllerAs:'gridsterItem',require:['^gridster','gridsterItem'],link:function(scope,$el,attrs,controllers){var optionsKey=attrs.gridsterItem,options;var gridster=controllers[0],item=controllers[1];scope.gridster=gridster;if(optionsKey){var $optionsGetter=$parse(optionsKey);options=$optionsGetter(scope)||{};if(!options&&$optionsGetter.assign){options={row:item.row,col:item.col,sizeX:item.sizeX,sizeY:item.sizeY,minSizeX:0,minSizeY:0,maxSizeX:null,maxSizeY:null};$optionsGetter.assign(scope,options);}}else{options=attrs;}
item.init($el,gridster);$el.addClass('gridster-item');var aspects=['minSizeX','maxSizeX','minSizeY','maxSizeY','sizeX','sizeY','row','col'],$getters={};var expressions=[];var aspectFn=function(aspect){var expression;if(typeof options[aspect]==='string'){expression=options[aspect];}else if(typeof options[aspect.toLowerCase()]==='string'){expression=options[aspect.toLowerCase()];}else if(optionsKey){expression=optionsKey+'.'+aspect;}else{return;}
expressions.push('"'+aspect+'":'+expression);$getters[aspect]=$parse(expression);var val=$getters[aspect](scope);if(typeof val==='number'){item[aspect]=val;}};for(var i=0,l=aspects.length;i<l;++i){aspectFn(aspects[i]);}
var watchExpressions='{'+expressions.join(',')+'}';scope.$watchCollection(watchExpressions,function(newVals,oldVals){for(var aspect in newVals){var newVal=newVals[aspect];var oldVal=oldVals[aspect];if(oldVal===newVal){continue;}
newVal=parseInt(newVal,10);if(!isNaN(newVal)){item[aspect]=newVal;}}});function positionChanged(){item.setPosition(item.row,item.col);if($getters.row&&$getters.row.assign){$getters.row.assign(scope,item.row);}
if($getters.col&&$getters.col.assign){$getters.col.assign(scope,item.col);}}
scope.$watch(function(){return item.row+','+item.col;},positionChanged);function sizeChanged(){var changedX=item.setSizeX(item.sizeX,true);if(changedX&&$getters.sizeX&&$getters.sizeX.assign){$getters.sizeX.assign(scope,item.sizeX);}
var changedY=item.setSizeY(item.sizeY,true);if(changedY&&$getters.sizeY&&$getters.sizeY.assign){$getters.sizeY.assign(scope,item.sizeY);}
if(changedX||changedY){item.gridster.moveOverlappingItems(item);gridster.layoutChanged();scope.$broadcast('gridster-item-resized',item);}}
scope.$watch(function(){return item.sizeY+','+item.sizeX+','+item.minSizeX+','+item.maxSizeX+','+item.minSizeY+','+item.maxSizeY;},sizeChanged);var draggable=new GridsterDraggable($el,scope,gridster,item,options);var resizable=new GridsterResizable($el,scope,gridster,item,options);var updateResizable=function(){resizable.toggle(!gridster.isMobile&&gridster.resizable&&gridster.resizable.enabled);};updateResizable();var updateDraggable=function(){draggable.toggle(!gridster.isMobile&&gridster.draggable&&gridster.draggable.enabled);};updateDraggable();scope.$on('gridster-draggable-changed',updateDraggable);scope.$on('gridster-resizable-changed',updateResizable);scope.$on('gridster-resized',updateResizable);scope.$on('gridster-mobile-changed',function(){updateResizable();updateDraggable();});function whichTransitionEvent(){var el=document.createElement('div');var transitions={'transition':'transitionend','OTransition':'oTransitionEnd','MozTransition':'transitionend','WebkitTransition':'webkitTransitionEnd'};for(var t in transitions){if(el.style[t]!==undefined){return transitions[t];}}}
var debouncedTransitionEndPublisher=gridsterDebounce(function(){scope.$apply(function(){scope.$broadcast('gridster-item-transition-end',item);});},50);$el.on(whichTransitionEvent(),debouncedTransitionEndPublisher);scope.$broadcast('gridster-item-initialized',item);return scope.$on('$destroy',function(){try{resizable.destroy();draggable.destroy();}catch(e){}
try{gridster.removeItem(item);}catch(e){}
try{item.destroy();}catch(e){}});}};}]).directive('gridsterNoDrag',function(){return{restrict:'A',link:function(scope,$element){$element.addClass('gridster-no-drag');}};});}));