var allAreaList = [];

$(function () {
	initAllArea();
	var contactsid = getQueryString("contactsid");
	
	 //保存按钮
    $("body").on('click', '#saveData', function () {
    	var contactsid = $("#contactsid").val();
    	if(contactsid == ""){
    		parent.toast("请选择人员！");
    		return;
    	}
    	var areaArr = $("#optgroup").val();
    	if(areaArr == null || areaArr.length == 0 ){
    		parent.toast("请选择区域！");
    		return;
    	}
    	save();
    });
	
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/lkcontactsplacearea/load",
		dataType : "json",
		data :{
			contactsid:contactsid
		},
		success : function(data) {
			if (data) {
				var contactsTpt = _.template($("#contactsTpt").html());
				$("#contactsForm").html(contactsTpt(data));
//				SelectTwo.initSelect2($('#contactsname'),BASE_URL + "enterprise/entcontacts/loadContactSimpleInfo",'请选择人员',formatRepo,formatRepoSelection);
//				$("#contactsname").bind('change',function(){
//                	initSafepeople($("#contactsid").val());
//                })
				data.allAreaList = allAreaList;
				var areaIds = new Array();
				$.each(data.conPlaceList,function(i,obj){
					console.log(obj.placeareaid);
					areaIds.push(obj.placeareaid);
            	});
            	data.areaIds = areaIds;
            	var selectAreaTb = _.template($("#selectAreaTb").html());
				$("#selectAreaForm").html(selectAreaTb(data));
				
				initSelected();
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

function initSafepeople(contactsid){
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/entcontacts/load",
		dataType : "json",
		data :{
			contactsid:contactsid
		},
		success : function(data) {
			if (data) {
				var sex;
				if(data.sex == "0"){
					sex = "男";
				} else {
					sex = "女";
				}
				$("#sex").val(sex);// 性别下拉框
				$("#position").val(data.position);
				$("#entorgid").val(data.entOrg != null ? data.entOrg.entorgname:"");
				$("#mobile").val(data.mobile);
				$("#telphone").val(data.telphone);
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
}
//所有区域
function initAllArea(){
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskplacearea/loadPlaceSelect",
		data :{},
		cache: false,
        dataType: 'json',
        global: false,
        async: false,
		success : function(data) {
			if (data) {
				allAreaList = data;
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});	
}

/**
 * 初始化选择框
 */
function initSelected(){
	$('#optgroup').multiSelect({
		selectableHeader: "<input type='text' class='search-input' style='width:100%;margin-bottom:5px;' autocomplete='off' placeholder='请输入区域名称'>",
		selectionHeader: "<input type='text' class='search-input' style='width:100%;margin-bottom:5px;' autocomplete='off' placeholder='请输入区域名称'>",
	    selectableOptgroup: true,
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

/*保存(新增或编辑)*/
function save(){
	
	var formData = $("#contactsTpt").serializeArray();
	var arealistData = {name: "areaArr", value: $("#optgroup").val()};
	var contactsid = {name: "contactsid", value: $("#contactsid").val()};
	formData.push(arealistData); 
	formData.push(contactsid); 
	console.log(formData);
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/lkcontactsplacearea/save",
		data : formData,
		success : function(data) {
			if(data.success==true){
				parent.toast(data.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(data.msg);
			}
		},
		error : function() {
			parent.toast("编辑失败");
		}
	});
}

function formatRepo(repo){
	if (repo.loading) {
	    return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    return markup;
}

function formatRepoSelection(repo){
    $("#contactsid").val(repo.id);
	$("#contactsname").val(repo.id);
	return repo.text;
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}