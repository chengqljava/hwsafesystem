/**
 * 资源数据显示与查询面板
 */
var DataPanel=function(){
	this._init();
}

DataPanel.prototype={
		_init:function(){
			this._destroy();
			var subnav=document.createElement('div');
			subnav.className = 'subnav';
			//subnav.style.display='none';
			var nav=document.getElementsByTagName('nav')[0];
			nav.appendChild(subnav);
			var subContent=document.createElement('div');
			subContent.className='subContent';
			subnav.appendChild(subContent);
			var subTitle=document.createElement('div');
			subTitle.innerHTML='重大危险源(0)';
			subTitle.className='subTitle';
			subContent.appendChild(subTitle);
			var search=document.createElement('div');
			search.className='searchForm';
			subContent.appendChild(search);
			var filter=document.createElement('input');
			filter.className='inputSearch';
			filter.type='text';
			search.appendChild(filter);
			var filterBtn=document.createElement('i');
			filterBtn.className='searchBtn';
			search.appendChild(filterBtn);
			
			var grid=document.createElement('div');
			grid.id='featureGrid';
			grid.style='display:block;height:210px;overflow-y:auto;overflow-x:hidden;';
			subContent.appendChild(grid);
		},
		_destroy:function(){
			var element=document.getElementById('#subnav');
			if(element!=undefined)document.getElementsByTagName('nav')[0].removeChild(subnav);
		},
		destroy:function(){
			this._destroy();
		}
}