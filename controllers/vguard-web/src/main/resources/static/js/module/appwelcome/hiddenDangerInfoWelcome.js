var isDetail = GetQueryString("isDetail");
//初始化加载
$(function(){
	
	 var currYear = new Date().getFullYear();
	 $("#year").val(currYear);
	    var html = "<li>" + (currYear - 4) + "</li>" +
	        "<li>" + (currYear - 3) + "</li>" +
	        "<li>" + (currYear - 2) + "</li>" +
	        "<li>" + (currYear - 1) + "</li>" +
	        "<li class='cur'>" + currYear + "</li>";
	    $(".year").html(html);

	    $(".year").on("click", "li", function () {
	        $(this).addClass('cur').siblings().removeClass('cur');
	        $("#year").val($(this).text());
//	        setTimeByQarter($(this).text(), $("#qarter").val());
	        if ($(this).index() == 0) {
	            var year = parseInt($(this).text());
	            var html = "<li>" + (year - 2) + "</li>" +
	                "<li>" + (year - 1) + "</li>" +
	                "<li class='cur'>" + year + "</li>" +
	                "<li>" + (year + 1) + "</li>" +
	                "<li>" + (year + 2) + "</li>";
	            $(".year").html(html);
	        } else if ($(this).index() == 4) {
	            var year = parseInt($(this).text());
	            var curYear = new Date().getFullYear();
	            if (year != curYear) {
	                var html = "<li>" + (year - 2) + "</li>" +
	                    "<li>" + (year - 1) + "</li>" +
	                    "<li class='cur'>" + year + "</li>" +
	                    "<li>" + (year + 1) + "</li>" +
	                    "<li>" + (year + 2) + "</li>";
	                $(".year").html(html);
	            }
	        }
	        loadData();
	    });
	
	//加载数据
	loadData();
});

//获取选择年份
function loadhidenDanger(){
	loadData();
}

/**
 * 加载数据
 * @param checktime
 */
function loadData(){
	$.ajax({
		type:"post",
		cache : false,
		url:BASE_URL +'hiddendanger/hdientcount/mobileReport',
		data:{
			'userid':GetQueryString("userid"),
			'year':$("#year").val()
		},
		dataType : 'json',
		global : false,
		success:function(data){
			if(data){
				//查看全部
				if(isDetail == true || isDetail == "true"){
					$("#zczb").html(data.data.checkSum);
					$("#wgxc").html(data.data.overSum);
					$("#yhzg").html(data.data.notSum);
					
				}
				//加载执法状态柱状图
				initHidenDangerInfo(data);
			}
		}
			
	});	
}

function initHidenDangerInfo(data){
//	alert(JSON.stringify(data));
	var option = {
//			title : {
//				text:'隐患排查数量',
//			     textStyle: {
//			    	 	align:"center",
//			        	fontFamily: "微软雅黑",
//			        	fontSize: 12,
//			        	color: "black"
//			        }
//			},
		    tooltip : {
		        trigger: 'item',
		    },
		    legend: {
		        data:['自查隐患','已整改','超期未整改']
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : ['第一季度','第二季度','第三季度','第四季度']
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:'自查隐患',
		            type:'bar',
		            data:data.data.hidList
		        },
		        {
		            name:'已整改',
		            type:'bar',
		      
		            data:data.data.overList
		        },
		        {
		            name:'超期未整改',
		            type:'bar',
		            data:data.data.notList
		        } 
		    ]
		};
	
	var myChart = echarts.init(document.getElementById('dangerchart'));
	myChart.setOption(option);
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}