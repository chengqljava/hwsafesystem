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
$(function() {

	var gprsid = getQueryString("gprsid");
	$("#probeForm").validate({
		rules : {
            // gprsmoduleid:{
			// 	required : true
			// },
            // machineparam:{
			// 	required : true
			// },
            // ccid : {
			// 	required : true
			// },
            // simphone : {
			// 	required : true
			// }
		},
		messages : {
            // gprsmoduleid:{
			// 	required : "GPRS模块id不能为空"
			// },
            // machineparam:{
			// 	required : "机器参数不能空"
			// },
            // ccid : {
			// 	required : "CCID不能为空"
			// },
            // simphone : {
			// 	required : "SIM卡手机号不能为空"
			// }
		},
		submitHandler:function(form){
			save();
		} 
	});

	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macgprsmodule/loadProbe",
		dataType : "json",
		data : {
			"gprsid":gprsid
		},
		success : function(data) {
			if (data) {
				console.log(data);
				var selectProbeTb = _.template($("#selectProbeTb")
						.html());
				$("#probeForm").html(selectProbeTb(data));
				initSelected();
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});

});


/**
 * 初始化选择框
 */
function initSelected(){
    $('#optgroup').multiSelect({
        selectableHeader: "<input type='text' class='search-input' style='width:100%;margin-bottom:5px;' autocomplete='off' placeholder='请输入探头名称'>",
        selectionHeader: "<input type='text' class='search-input' style='width:100%;margin-bottom:5px;' autocomplete='off' placeholder='请输入探头名称'>",
        selectableOptgroup: false,
        afterInit: function(ms){
            var that = this,
                $selectableSearch = that.$selectableUl.prev(),
                $selectionSearch = that.$selectionUl.prev(),
                selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
                selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';
            that.qs1 = $selectableSearch.quicksearch(selectableSearchString).on('keydown', function(e){
                if (e.which === 40){
                    that.$selectableUl.focus();
                    return false;
                }
            });
            that.qs2 = $selectionSearch.quicksearch(selectionSearchString).on('keydown', function(e){
                if (e.which == 40){
                    that.$selectionUl.focus();
                    return false;
                }
            });
        },
        afterSelect: function(values){
            this.qs1.cache();
            this.qs2.cache();
        },
        afterDeselect: function(values){
            this.qs1.cache();
            this.qs2.cache();
        }
    });
}


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
    var params =$("#probeForm").serializeArray();
    console.log($("#optgroup").val());
    params.push({name:"probeids",value:$("#optgroup").val()});
	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macgprsmodule/saveProbe",
		data : params,
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});

}
