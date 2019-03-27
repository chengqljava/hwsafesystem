
/**
 * 通讯录
 */
$(function () {
	loadContactList();
    $.ajax({
        type: "get",
        url: BASE_URL + "enterprise/entorg/listNodes",
        dataType: "json",
        data: {},
        success: function (data) {
            if (data) {
                $('#chart-container').orgchart({
                    'data': data,
                    'nodeTitle': 'name',
                    'nodeContent': 'empcount',
                    'direction': 'l2r',
//                    'verticalLevel': 3,
//                    'parentNodeSymbol': '',
                    'NODEID': 'id',
                    'createNode': function ($node, data) {
//                    	if(data.empcount > 0){                    		
                    		$($node).click(function () {
                    			var id = $(this).attr('id');
//                    			parent.openWin(BASE_URL + 'views/module/enterprise/entorg/entAddressListInfo.html?entorgid='+id, 
//                    					data.name,'50%', '50%');
                    			$("#contactname").val("");
                    			loadContactList(id);
                    			$("#orgid").val(id);
                    			scrollResize();
                    		})
//                    	}
                    }
                });
//                $('.orgchart').addClass('noncollapsable');

            }
        },
        error: function () {
            parent.toast("加载失败");
        }
    });

});

function loadContactList(entorgid,contactname){
    $.ajax({
        type : "post",
        url : BASE_URL + "enterprise/entcontacts/loadContactList",
        dataType: "json",
        data:{
            entorgid:entorgid,
            contactname:contactname || ''
        },
        success : function(data) {
            if (data) {
                var entAddressListInfoTpt = _.template($("#entAddressListInfoTpt").html());
                $("#entAddressListInfoForm").html(entAddressListInfoTpt(data));
            }
            scrollResize();
        },
        error : function() {
            parent.toast("初始化信息加载失败!");
        }
    });
}
function scrollResize() {
	$('#chart-container').niceScroll({
		cursorborder : "#4d86d6",
		cursorcolor : "#4d86d6",
		background : false,
		horizrailenabled : true,
		autohidemode : false
	}).show().resize();
	$('#contactlist').niceScroll({
		cursorborder : "#4d86d6",
		cursorcolor : "#4d86d6",
		background : false,
		horizrailenabled : true,
		autohidemode : false
	}).show().resize();
}
//查询
function searchData(){
	var contactname = $("#contactname").val();
	var orgid = $("#orgid").val();
	loadContactList(orgid,contactname);
}
//重置
function resetData(){
	$("#contactname").val("");
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
