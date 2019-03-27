 var count = $("#count").val();
 $(function(){
      for(var i=1;i<=count;i++){
          var ue = UE.getEditor('editor'+i);
      }
 });
/*保存(新增或编辑)*/
function save(){
    var params = $("#emsPlaElementform").serializeArray();
    for(var i=1;i<=count;i++){
        var content = UE.getEditor('editor'+i).getContent();
        var key = "content"+i;
        params.push({"name":key,"value":content});
    }
    $.ajax({
        type : 'post',
        url : BASE_URL+'/ems/emsplacontent/save',
        secureuri:false,
        cache : false,
        dataType : 'json',
        data : params,
        global : false,
        success : function(json) {
            if(json.success==true){
                parent.toast(json.msg);
            }else{
                parent.toast(json.msg);
            }
        },
        error : function() {
            parent.toast("保存失败");
        }
    });
}