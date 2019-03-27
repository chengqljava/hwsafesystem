$(document).ready(function() {
    SelectOption.loadOchWorkPlace("workplace");//所在作业场所名称
    SelectOption.loadSex("sex");//性别
    SelectOption.loadNation("nation");//民族
    SelectOption.loadEducation("education");//学历
    SelectOption.loadTechnical("technical");//技术职称
    
    //接害工龄和总工龄比较
    jQuery.validator.addMethod("comparedate" ,function(value,element){
         var workage = $('#workage').val();//总工龄
         var indirectharmage = $('#indirectharmage').val();//接害工龄
         if(workage!=null && workage!=""){
             return  parseInt(workage) >= parseInt(indirectharmage);
         }else{
             return false;
         }
    },"接害工龄不能大于总工龄");
    
    $("#ochworkerform").validate({
        rules : {
            name : {
                required : true
            },
            birthday : {
                required : true
            },
            tel : {
                required : true,
                isTel:true
            },
            sex : {
                required : true
            },
            nation: {
                required : true
            },
            workage : {
                required : true,
                isFloatGteZero:true
            },
            indirectharmage : {
                required : true,
                comparedate:true,
                isFloatGteZero:true
            },
            address : {
                required : true
            },
            worktype : {
                required : true
            },
            education : {
                required : true
            },
            technical : {
                required : true
            },
            healthnum : {
                required : true,
                isLetterAndNumAndUnderline:true
            },
            workplace : {
                required : true
            },
            careerhist : {
                required : true
            },
            pasthist : {
                required : true
            },
            hazardshist : {
                required : true
            },
            hazardsele : {
                required : true
            }
        },
        messages : {
            name : {
                required : "姓名不能为空"
            },
            birthday : {
                required : "出生日期不能为空"
            },
            tel : {
                required : "联系电话不能为空",
                isTel:"联系电话格式错误"
            },
            sex : {
                required : "性别未选择"
            },
            nation : {
                required : "民族未选择"
            },
            workage : {
                required : "总工龄不能为空",
                isFloatGteZero:"必须大于等于0"
            },
            indirectharmage : {
                required : "接害工龄不能为空",
                comparedate:"接害工龄大于总工龄",
                isFloatGteZero:"必须大于等于0"
            },
            address : {
                required : "家庭住址不能为空"
            },
            worktype : {
                required : "工种不能为空"
            },
            education : {
                required : "学历未选择"
            },
            technical : {
                required : "技术职称未选择"
            },
            healthnum : {
                required : "职业健康检查表编号不能为空",
                isLetterAndNumAndUnderline:"只能输入字母、数字、下划线"
            },
            workplace : {
                required : "所在作业场所名称不能为空"
            },
            careerhist : {
                required : "职业史不能为空"
            },
            pasthist : {
                required : "既往史不能为空"
            },
            hazardshist : {
                required : "职业病危害接触史不能为空"
            },
            hazardsele : {
                required : "作业危害因素不能为空"
            }
        },
        submitHandler : function(form) {
            save();
        }
    });
});

/**保存*/
function save() {
    $.ajax({
        type : 'post',
        url : BASE_URL + '/health/ochworker/save',
        cache : false,
        dataType : 'json',
        data : $("#ochworkerform").serializeArray(),
        global : false,
        success : function(json) {
            if (json.success == true) {
                parent.toast(json.msg);
                //弹出提示信息
                parent.parent.getActiveIFrame().reloadGrid();
                //刷新列表
                parent.parent.closeWin();
                // 关闭弹出框
            } else {
                parent.toast(json.msg);
            }
        },
        error : function() {
            parent.toast("保存失败");
        }
    });
}