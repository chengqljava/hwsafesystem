

//删除企业数据（关联删除坐标位置）
function deleteAddr(addrid){
	var id = addrid || "CFD3C0C2BAD3407488A285DDF1052673";
	var id = {"id":id};
	//弹出提示框
	parent.confirm('确认删除吗?',function(){
		 $.ajax({ 
		  		url: BASE_URL+"/olgis/gispage/delete",
		  		type:'post',
		  		dataType:'json',
		  		data:id,
		  		success: function(json){
		  			if(json.success==true){
		  				parent.toast(json.msg);
		  				
		  			}else{
		  				parent.toast(json.msg);
		  			}
		  		}
			 });
		});
	 }