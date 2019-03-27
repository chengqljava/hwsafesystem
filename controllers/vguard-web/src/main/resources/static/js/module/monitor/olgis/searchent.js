var SearchEnt = function(){

};
SearchEnt.prototype={
		search:function(filter,districtcode){
			$.jgrid.defaults.styleUI = 'Bootstrap';
			var entlist=monitordatas.getEnterprises(filter,districtcode);
			var mydata = [];
			if(entlist==undefined||entlist.length<=0)return mydata;
			for(var key in entlist){
				var item=entlist[key];
				var arr={};
				arr.id = key;
				arr.ENTNAME = item.ENTNAME;
				arr.BUSINESSINFOID = item.BUSINESSINFOID;
				arr.LONGITUDE = item.LONGITUDE;
				arr.LATITUDE = item.LATITUDE;
				arr.LEGALPERSON = item.LEGALPERSON;
				arr.PHONE = item.PHONE;
				arr.ADDRESS = item.ADDRESS;
				mydata.push(arr);
			}
			var tWidth = $(".searchArea").width();
			var tHeight = $(".searchArea").height()*5;
			$("#jqGrid").jqGrid({
			    datatype: "local", 
			    height: 'auto', 
			    rowNum: 11, 
			    rowList: [10,20,30], 
			    colNames:['编号','企业名称','entid','x','y','负责人','电话','地址'], 
			    colModel:[ 
			    {name:'id',index:'id', sorttype:"int",align:"center",hidden:true}, 
			    {name:'ENTNAME',index:'ENTNAME',width:tWidth}, 
			    {name:'BUSINESSINFOID',index:'BUSINESSINFOID',hidden:true}, 
			    {name:'LONGITUDE',index:'LONGITUDE',hidden:true}, 
			    {name:'LATITUDE',index:'LATITUDE',hidden:true}, 
			    {name:'LEGALPERSON',index:'LEGALPERSON',hidden:true}, 
			    {name:'PHONE',index:'PHONE',hidden:true}, 
			    {name:'ADDRESS',index:'ADDRESS',hidden:true}
			    ], 
			    pager: "#jqGridPager", 
			    viewrecords: true,
			    multiselect: false,
			    altRows: true,
			    autowidth: true ,
			    loadComplete : function() {
			      //  $("#jqGrid").setGridWidth($(window).width()*0.99);
			    },
			    gridComplete: function () {
			    	//去除表头
			    	$(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-hdiv').remove(); 
			    },
		    	onSelectRow: function(id){
					var rowdata = $("#jqGrid").jqGrid('getRowData', id);
					//加载popup弹出事件
					popPanel.loadClosePopup(rowdata);
					
					$(".entName").empty();
					$(".entName").append(rowdata.ENTNAME);
					$('.wrapper').show();
					$('#mapfrm').attr("src",BASE_URL+"/olgis/gispage/addjcjkAlarm/"+rowdata.BUSINESSINFOID);
					$('#alarminfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkAlarm/"+rowdata.BUSINESSINFOID); 
					$('#videoinfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkVideoAll/"+rowdata.BUSINESSINFOID); 
					$('#datainfo').attr("href",BASE_URL+"/olgis/gispage/addjcjkDataAll/"+rowdata.BUSINESSINFOID);
					var p1=ol.proj.transform([parseFloat(rowdata.LONGITUDE),parseFloat(rowdata.LATITUDE)],'EPSG:4326','EPSG:3857');
					var coordsmove=ol.proj.transform([parseFloat(rowdata.LONGITUDE)+0.12,parseFloat(rowdata.LATITUDE)],'EPSG:4326','EPSG:3857');
					app.map.getView().setCenter(p1);
					//var p2 = [p1[0]+13500,p1[1]+3500]
				   utils.mapPan(app.map,coordsmove);
				}

			});
			//清除表格数据并重新加载
			$("#jqGrid" ).clearGridData(); 
			for ( var i = 0; i <= mydata.length; i++){ 
				$("#jqGrid").jqGrid('addRowData', i + 1, mydata[i]); }
			}
}