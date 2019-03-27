$(function() {	
	loadallevent(1);
});

$('.searchIcon').on('click', function () {
	loadallevent(1);
});

function loadallevent(page){
	var name = $("#eventname").val();
	var eventlevel = $(".accidentKind .selected").val();
	var sort = $(".order .selected").val();
	var sord ;
	if(sort == 0){
		sord = "asc"
	} else {
		sord = "desc"
	}
	$.ajax({
		type : "post",
		url : BASE_URL + "/ems/emssucevent/loadallevent",
		dataType : "json",
		data : {
			name: name,
			eventlevel: eventlevel,
			sort: sort,
			page:page || 1,
			rows: 5,
			sidx: "TIME",
			sord: sord
		},
		success : function(data) {
            if (data) {
                var eventListTpt = _.template($("#eventListTpt").html());
                $("#eventlist").html(eventListTpt(data));
            }
		    Page({
		        num: data.total, //页码数
		        startnum: page, //指定页码
		        elem: $('#eventPage'), //指定的元素
		        callback: function (n) { //回调函数 n 为当前页码        	
		        	loadallevent(n);
		        }
		    })
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}