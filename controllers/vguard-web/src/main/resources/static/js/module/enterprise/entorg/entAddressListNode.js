/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * 设备维修
 */
$(function () {
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
                    	if(data.empcount > 0){                    		
                    		$($node).click(function () {
                    			var id = $(this).attr('id');
                    			parent.openWin(BASE_URL + 'views/module/enterprise/entorg/entAddressListInfo.html?entorgid='+id, 
                    					data.name,'50%', '50%');
                    		})
                    	}
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

/**
 * 保存
 *
 * @returns
 */

function save() {
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macbrandtype/save",
        data: $("#macbrandtypeForm").serializeArray(),
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//刷新列表
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });

}
