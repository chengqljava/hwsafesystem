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
	loadData();
});

function loadData(){
    //获取企业类型信息
    $.ajax({
        type: "post",
        url: BASE_URL + "law/welcome/loadByQuarter",
        data: {
        	'userid':getQueryString("userid"),
			'year':$("#year").val()
        	},
        success: function (data) {
            if (data) {
//            	console.log(data);				
				var closedArr = [0,0,0,0]; //
				var quarteArr = [0,0,0,0]; //
				var registerArr = [0,0,0,0]; //
				var reviewArr = [0,0,0,0] //
                $.each(data.closeds, function (i, item) {
                    switch (item.QUARTER) {
                        case '1':
                        	closedArr[0] = item.QCOUNT;
                            break;
                        case '2':
                        	closedArr[1] = item.QCOUNT;
                            break;
                        case '3':
                        	closedArr[2] = item.QCOUNT;
                            break;
                        case '4':
                        	closedArr[3] = item.QCOUNT;
                            break;
                    }
                });
                $.each(data.quarters, function (i, item) {
                    switch (item.QUARTER) {
                        case '1':
                        	quarteArr[0] = item.QCOUNT;
                            break;
                        case '2':
                        	quarteArr[1] = item.QCOUNT;
                            break;
                        case '3':
                        	quarteArr[2] = item.QCOUNT;
                            break;
                        case '4':
                        	quarteArr[3] = item.QCOUNT;
                            break;
                    }
                });
                $.each(data.registers, function (i, item) {
                    switch (item.QUARTER) {
                        case '1':
                        	registerArr[0] = item.QCOUNT;
                            break;
                        case '2':
                        	registerArr[1] = item.QCOUNT;
                            break;
                        case '3':
                        	registerArr[2] = item.QCOUNT;
                            break;
                        case '4':
                        	registerArr[3] = item.QCOUNT;
                            break;
                    }
                });
                $.each(data.reviews, function (i, item) {
                    switch (item.QUARTER) {
                        case '1':
                        	reviewArr[0] = item.QCOUNT;
                            break;
                        case '2':
                        	reviewArr[1] = item.QCOUNT;
                            break;
                        case '3':
                        	reviewArr[2] = item.QCOUNT;
                            break;
                        case '4':
                        	reviewArr[3] = item.QCOUNT;
                            break;
                    }
                });
                initLaw(quarteArr,reviewArr,registerArr,closedArr);
            }
        }
    });
}

function initLaw(quarteArr,reviewArr,registerArr,closedArr){
	var option = {
		    tooltip : {
		        trigger: 'item',
		        
		    },
		    legend: {
		        data:['检查','复查','立案','结案']
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
		            name:'检查',
		            type:'bar',
		            data:quarteArr
		        },
		        {
		            name:'复查',
		            type:'bar',		      
		            data:reviewArr
		        },
		        {
		            name:'立案',
		            type:'bar',
		            data:registerArr
		        } ,
		       {
		            name:'结案',
		            type:'bar',
		            data:closedArr
		        }  
		    ]
		};
	var myChart = echarts.init(document.getElementById('lawchart'));
	myChart.setOption(option);
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}