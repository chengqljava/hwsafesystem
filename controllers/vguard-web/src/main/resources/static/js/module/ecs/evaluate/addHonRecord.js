$(document).ready(function() {
	/**
	 * 诚信评价
	 */
	/*$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecshonrecord/load/null",
		data : {},
		success : function(data) {
			alert($("#tok").val());
		}
	});*/
	//查询评价项
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecshonoption/listAll",
		data : {},
		success : function(data) {
			var ecsHonRecordTpt = _.template($("#ecsHonRecordTpt").html());
			$("#ecsHonRecordForm").html(ecsHonRecordTpt(data));
			//加载企业
			SelectTwo.initSelect2($('#belongentselect2'),BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo",'请选择企业',formatRepo,formatRepoSelection);
			//加载
			$.each(data.honOptionList,function(index,honOption){
				$("#honOptionTB").append("<tr>" +
						"<td width='25%' align='left'><input type='text' name='optionname' id='optionname_"+index+"' value='"+honOption.TYPE+"' disabled/></td>" +
						"<td width='25%' align='left'><input type='text' name='optionweight' id='optionweight_"+index+"' value='"+honOption.WEIGHT+"' disabled/></td>" +
						"<td width='25%' align='left'><input type='text' id='score_"+index+"' name='score' onblur='getWeightscore(this)' /></td>" +
						"<td width='25%' align='left'><input type='text' id='weightscore_"+index+"' name='weightscore' disabled/></td>" +
						"</tr>");
			});
			$("#honOptionTB").append("<tr><td colspan='3'></td><td align='left'><input type='text' id='score' name='score' placeholder='权重合计得分' disabled/></td></tr>")
		}
	});
	
	$("#ecsHonRecordForm").validate({
		rules: {
			businessinfoid: {
				required: true
			},
			noticetime: {
				required: true 
			},
			score:{
				isDigits:true,
				range:[0,100]
			}
		},
		messages: {
			businessinfoid: {
				required: "企业名称不能为空"
			},
			noticetime: {
				required: "评价周期不能为空"
			},
			score:{
				isDigits:"请输入数字",
				range:"请输入0~100之间的整数"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
	
});

//自动计算权重得分
function getWeightscore(e){
	//权重
	var optionweight =$(e).parent().parent().find("input[name='optionweight']").val();
	//打分数值
	var score =$(e).parent().find("input[name='score']").val();
	/*if (score > 100 || score < 0) {
		parent.toast("打分值为0~100之间!");
		return;
	}*/
	//权重得分
	if (score >= 0 && score<=100) {
		var weightscore = (Number(optionweight)*Number(score)).toFixed(1);
		$(e).parent().parent().find("input[name='weightscore']").val(weightscore);
		//更新权重合计得分
		var $weightScore = $("#honOptionTB tr input[name='weightscore']");
		var sum = 0.0;
		if ($weightScore.size() > 0) {
			for (var n = 0; n < $weightScore.size(); n++) {
				var ss = $($weightScore[n]).val();
				sum +=Number(ss);
			}
		}
		$("#score").val(sum.toFixed(1));
	}
}

/*保存(新增或编辑)*/
function save(){
	 //评价项
    var honOptionList = [];
    var $honOption = $("#honOptionTB tr");
    var isHonOption = true;
//    alert($honOption.size());
    //获取评价项信息
    if (0 < $honOption.size()) {
        for (var n = 1; n < $honOption.size()-1; n++) {
            var optionname = $($honOption[n]).find("input[name='optionname']").val(),
            	optionweight = $($honOption[n]).find("input[name='optionweight']").val(),
            	score = $($honOption[n]).find("input[name='score']").val(),
            	weightscore = $($honOption[n]).find("input[name='weightscore']").val();
            
//            	alert("optionname:"+optionname);
//            	alert("optionweight:"+optionweight);
//            	alert("score:"+score);
//            	alert("weightscore:"+weightscore);
            if (("" == optionname) || ("" == optionweight) || ("" == score) || ("" == weightscore)){
                parent.toast("评价项信息不能为空!");
                isHonOption = false;
                return;
            }
            honOptionList.push({
                "optionname": optionname,
                "optionweight": optionweight,
                "score": score,
                "weightscore": weightscore,
            });
        }
    }
    
    if (isHonOption) {
    	 var honOptions = {name: 'honOptionList', value: JSON.stringify(honOptionList)};
    	 var sorceSum = {name:"sorceSum",value:$("#score").val()};
         var formdata = $("#ecsHonRecordForm").serializeArray();
         formdata.push(honOptions);
         formdata.push(sorceSum);
    	$.ajax({
    		type : 'post',
    		url : BASE_URL + 'ecs/ecshonrecord/save',
    		cache : false,
    		dataType : 'json',
    		data : formdata,
    		global : false,
    		success : function(json) {
    			parent.toast(json.msg);//弹出提示信息
    			parent.getActiveIFrame().reloadGrid();//重新加载
    			parent.closeWin();// 关闭弹出框
    		},
    		error : function() {
    			parent.toast("保存失败");
    		}
    	});
	}
	
}
/**
 * 选择企业
 * @param $ajax
 * @param url 完整的地址
 */
function formatRepo(repo){
	if (repo.loading) {
	    return repo.text;
	}
	var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    
    return markup;
}

function formatRepoSelection(repo){
	$("#businessinfoid").val(repo.id);
	$("#belongentselect2").val(repo.id);
	 return repo.text;
}
