/**
 * Created by Administrator on 2017/10/25.
 */
function initTodoInfo() {
	$.ajax({
		type:"post",
		url:BASE_URL + "law/welcome/todolist",
		data:{},
		success:function(data){
			if(data){
				$("#todoinfo").empty();
				if(data.datas.length<8){//判断当前待办文书数据范围
					var lawinfo = "";
					_.map(data.datas,function(lawdata){
						var linkaddr = '<a href="javascript:void(0);" style="color: #ED5851;" onclick="openLawInfo(\''+lawdata.CHECKINFOID+'\',\''+lawdata.WRITTYPE+'\',\''+lawdata.ENTNAME+'\')">';
						lawinfo+="<tr><td title="+getLawType(lawdata.WRITTYPE)+">"+getLawType(lawdata.WRITTYPE)+"</a></td><td title="+lawdata.ENTNAME+">"+lawdata.ENTNAME+"</td><td title="+isBlank(lawdata.USERNAME)+">"+isBlank(lawdata.USERNAME)+"</td><td title="+getFlowState(lawdata.FLOWSTAT)+">"+linkaddr+getFlowState(lawdata.FLOWSTAT)+"</td></tr>";
					});
					
				}else{
					var lawinfo = "";
					_.map(data.datas,function(lawdata,index){
						if (index < 8) {
							var linkaddr = '<a href="javascript:void(0);" style="color: #ED5851;" onclick="openLawInfo(\''+lawdata.CHECKINFOID+'\',\''+lawdata.WRITTYPE+'\',\''+lawdata.ENTNAME+'\')">';
							lawinfo+="<tr><td title="+getLawType(lawdata.WRITTYPE)+">"+getLawType(lawdata.WRITTYPE)+"</a></td><td title="+lawdata.ENTNAME+">"+lawdata.ENTNAME+"</td><td title="+isBlank(lawdata.USERNAME)+">"+isBlank(lawdata.USERNAME)+"</td><td title="+getFlowState(lawdata.FLOWSTAT)+">"+linkaddr+getFlowState(lawdata.FLOWSTAT)+"</td></tr>";
						}
					});
					//大于某个范围显示更多查看链接
					$("#moretodo").css("display","block");
				}
				$("#todoinfo").append(lawinfo);
			}else{
				$("#todoinfo").append("<tr><td colspan='4'>无数据</td></tr>");
			}
		}
			
	});
}

//打开待办文书窗口
function openLawInfo(checkinfoid,type,entname){
	parent.openWinWithCloseCallback(BASE_URL+"/law/lawdocinfo/menu?id="+checkinfoid+"&doctype=null&menupagetype=menuDisplay&menuInfo=menuInfo&writtype="+type,entname,'65%','75%',true, null, function () {
		initTodoInfo();
    });
}

//点击"查看更多"链接
function moreInfo(){
	parent.openWin(BASE_URL+"/law/lawtodo/DBWS_GOV","待办文书",'80%','98%');	
}


/**
 * 文书类型
 * @param type
 * @returns {String}
 */
function getLawType(type){
	var writtype = "";
	switch(type){
	case "01":
		writtype = "立案审批表";
		break;
	case "02":
		writtype = "案件处理呈批表";
		break;
	case "03":
		writtype = "案件移送审批表";
		break;
	case "04":
		writtype = "结案审批表";
		break;
	case "05":
		writtype = "延期(分期)缴纳罚款审批表";
		break;
		
	}
	return writtype;
}

/**
 * 流程状态
 * @param state
 * @returns {String}
 */
function getFlowState(state){
	var statename = "";
	switch(state){
	case "1":
		statename = "已发起";
		break;
	case "2":
		statename = "已审核";
		break;
	case "3":
		statename = "已审批";
		break;
	case "4":
		statename = "已退回";
		break;
	}
	return statename;
}

function isBlank(username){
	if(username==null||username==""){
		return "--";
	}else{
		return username;
	}
}