/**
 * 企业采集时态图
 */
var EnterpriseGather=function(map,options){
	this._radius=(options==undefined?8:options.radius||8);
	this._blur=(options==undefined?15:options.blur||15);
	this._shadow=(options==undefined?250:options.shadow||250);
	this._opacity=(options==undefined?1:options.opacity||1);
	this._frameRate=(options==undefined?300:options.frameRate||300);
	this._map=map;
	this._source=null;
	this._heatmap=null;
	this._playFlag=0;   //0未开始或结束，1开始，2暂停
	this._animation=null;
	this._startDate=null;
	this._crrentDate=null;
	this._endDate=null;
	this._interval=0;
	this._totalInterval=0;
	this._init();
}

EnterpriseGather.prototype={
		_init:function(){
			var self=this;
			var elem=document.getElementById('time-panel');
			if(elem!=null){
				document.body.removeChild(elem);
			}
			var timePanel=document.createElement('div');
			timePanel.id='time-panel';
			timePanel.className='time-panel';
			document.body.appendChild(timePanel);
			
			var span=document.createElement('span');
			span.innerText='企业采集时态图';
			span.className='time-title';
			timePanel.appendChild(span);
			
			var timePanelTitle=document.createElement('div');
			timePanelTitle.className='time-panel-title';
			timePanel.appendChild(timePanelTitle);
			span=document.createElement('span');
			span.innerText='开始时间:';
			timePanelTitle.appendChild(span);
			var stInput=document.createElement('input');
			stInput.id='startDate';
			stInput.className='Wdate';
			stInput.type='text';
			stInput.style.width='90px';
			stInput.style.marginLeft='4px';
			/*stInput.onclick=function(){
				WdatePicker({lang:'zh-cn',dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endDate\')||\'new Date()\'}'});
			};*/
			stInput.onfocus=function(){
				WdatePicker({lang:'zh-cn',dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endDate\')||\'new Date()\'}'});
			};
			var nowDate=new Date();
			nowDate.setMonth(nowDate.getMonth()-1);
			stInput.value=this._formatDate(nowDate);
			timePanelTitle.appendChild(stInput);
			span=document.createElement('span');
			span.innerText='结束时间:';
			span.style.marginLeft='4px';
			timePanelTitle.appendChild(span);
			var endInput=document.createElement('input');
			endInput.id='endDate';
			endInput.className='Wdate';
			endInput.type='text';
			endInput.style.width='90px';
			endInput.style.marginLeft='4px';
			/*endInput.onclick=function(){
				WdatePicker({lang:'zh-cn',dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'startDate\')}',maxDate:new Date()});
			};*/
			endInput.onfocus=function(){
				WdatePicker({lang:'zh-cn',dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'startDate\')}',maxDate:new Date()});
			};
			endInput.value=this._formatDate(new Date());
			timePanelTitle.appendChild(endInput);
			var timePnelControl=document.createElement('div');
			timePnelControl.className='time-panel-control';
			timePanel.appendChild(timePnelControl);
			var timePanelProgressContainer=document.createElement('div');
			timePanelProgressContainer.className='time-panel-progress-container';
			timePnelControl.appendChild(timePanelProgressContainer);
			var timePanelProgressBar=document.createElement('div');
			timePanelProgressBar.className='time-panel-progress-bar';
			timePanelProgressContainer.appendChild(timePanelProgressBar);
			var timePanelProgress=document.createElement('span');
			timePanelProgress.className='time-panel-progress';
			timePanelProgressBar.appendChild(timePanelProgress);
			var timePanelPlay=document.createElement('div');
			timePanelPlay.id='play';
			timePanelPlay.className='time-panel-btn play';
			timePnelControl.appendChild(timePanelPlay);
			var closeImg=document.createElement('img');
			closeImg.className='time-close-img';
			closeImg.src=BASE_URL+"/images/gis/close.png";
			timePanel.appendChild(closeImg);
			closeImg.onclick=function(){
				self.destroy();
			}
			
			this._source=new ol.source.Vector();
			this._heatmap=new ol.layer.Heatmap({
				source:this._source,
				blur:this._blur,
				radius:this._radius,
				shadow:this._shadow,
				opacity:this._opacity
			});
			this._map.addLayer(this._heatmap);
			
			var playButton=document.getElementById('play');
			$('#play').click(function(){
				if(self._playFlag==0||self._playFlag==2){
					$(this).removeClass('play');
					self._playFlag=self._playFlag==2?1:0;
					self._play();
				}else{
					$(this).addClass('play');
					self._playFlag=2;
					self._stop();
				}
			});
		},
		destroy:function(){
			var elem=document.getElementById('time-panel');
			if(elem!=null){
				document.body.removeChild(elem);
			}
			this._map.removeLayer(this._heatmap);
			this._source=null;
			this._heatmap=null;
			this._stop();
		},
		_formatDate:function (date) {
		    var y = date.getFullYear();
		    var m = date.getMonth() + 1;
		    m = m < 10 ? '0' + m : m;
		    var d = date.getDate();
		    d = d < 10 ? ('0' + d) : d;
		    return y + '-' + m + '-' + d;
		},
		_play:function(){
			var self=this;
			if(this._playFlag==0){
				this._source.clear();
				$('.time-panel-progress').css('left','0px');
				var startDate=$('#startDate').val();
				var endDate=$('#endDate').val();
				startDate=this._startDate=new Date(startDate);
				
				this._currentDate=this._startDate;
				this._update();
				this._playFlag=1;
				
				endDate=this._endDate=new Date(endDate);
				var interval=endDate.getTime()-startDate.getTime();
				if(interval==0){
					interval=1;
				}else{
					interval=interval/(24*3600*1000);
				}
				var width=$('.time-panel-progress-bar').width()-8;
				
				this._interval=width/interval;
			}
			
			self._animation=setInterval(function(){
				self._totalInterval+=self._interval;
				if(self._totalInterval>=$('.time-panel-progress-bar').width()-8){
					$('.time-panel-progress').css('left',($('.time-panel-progress-bar').width()-8)+'px');
					self._stop();
					return;
				}
				$('.time-panel-progress').css('left',self._totalInterval+'px');
				self._startDate.setDate(self._startDate.getDate()+1);
				self._currentDate=self._startDate;
				self._update();
			},self._frameRate);
		},
		_stop:function(){
			if (this._animation !== null) {
		          clearInterval(this._animation);
		          this._animation = null;
			}
			if(this._playFlag==2){
			}else{
				$('#play').addClass('play');
				this._totalInterval=0;
				this._playFlag=0;
			}
		},
		_update:function(){
			var date=this._formatDate(this._currentDate);
			date=date.split('-').join('_');
			var data=entAcqTimeCount(date);
			if(data==undefined||data.length<=0)return;
			var features=[];
			data.forEach(function(item){
				if(item.LONGITUDE==undefined||item.LONGITUDE==""||item.LATITUDE==undefined||item.LATITUDE=="")return;
				let feature=new ol.Feature({
					geometry:new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.LONGITUDE),parseFloat(item.LATITUDE)]))
				});
				features.push(feature);
			})
			this._source.addFeatures(features);
		}
}