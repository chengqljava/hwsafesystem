$(document).ready(function() {
	//危化品企业类型树
	//SelectTree.loadChemicalEntTypeAllSelect("chemicaltype");

});

/*
 * 查询统计
 * */


$(".cxtj").click(function() {
	$('.subnav').css('display','none');
	$('.subnav2').css('display','block');
	SelectTree.loadChemicalEntTypeAllSelect("chemicaltype");
});

$(function(){
      $(".dropdown-toggle").dropdown();
      }); 

/*加载*/
function reloadGrid(districtcode,districtname){
	var data;
	var chemicaltypeid = $("#chemicaltype_select").val();
	var dangertype = $("#dangertype_select").val();
	
	var param = {"entname":$("#entname").val(), //企业名称
				 "chemicaltypeid":chemicaltypeid, //危化品企业类型
				 "dangertype":dangertype  //重大危险源类型
				};
	$.ajax({
		type :'post',
		url : BASE_URL+'/olgis/gisSearchEnt/criteriaQueryList',//条件查询
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
			data = map;
			var nameString="";
			for(var i=0;i<map.length;i++){
				var name = map[i].ENTNAME;
				var person = map[i].LEGALPERSON;
				var phone = map[i].PHONE;
				var status = map[i].STATUS;
				nameString += name + ",";
			}
			//alert(nameString+",数量："+map.length);
		},
		error : function(err) {
			parent.toast("服务出错，请与管理员联系！");
		}
	});
	return data;
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	var chemicaltypeid = $("#chemicaltype_select").val();
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#entname").val("");
	$("#chemicaltype").val("");
	$("#chemicaltype_select").val("");
});



