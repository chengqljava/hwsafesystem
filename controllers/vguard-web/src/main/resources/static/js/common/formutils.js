function initDisplayPage(){
	$("form select").each(function(index,element){
		$(element).attr("disabled","disabled");
		$(element).attr("title",$(element).find("option:selected").text());
	});
	
	$("form input[type=text]").each(function(index,element){
		$(element).attr("disabled","disabled");
		$(element).attr("title",$(element).val());
	});
	
	$("form input[type=date]").each(function(index,element){
		$(element).attr("disabled","disabled");
		$(element).attr("title",$(element).val());
	});
	
	$("form input[type=email]").each(function(index,element){
		$(element).attr("disabled","disabled");
		$(element).attr("title",$(element).val());
	});
	
	$("form textarea").each(function(index,element){
		$(element).attr("disabled","disabled");
		$(element).attr("title",$(element).val());
	});
	
	$("form input[type=radio]").each(function(index,element){
		$(element).attr("disabled","disabled");
	});
	
	$("form input[type=checkbox]").each(function(index,element){
		$(element).attr("disabled","disabled");
	});
}



function removeAllDisabled(){
	$("form select").each(function(index,element){
		$(element).removeAttr("disabled");
	});
	
	$("form input[type=text]").each(function(index,element){
		$(element).removeAttr("disabled");
	});
	
	$("form input[type=date]").each(function(index,element){
		$(element).removeAttr("disabled");
	});
	
	$("form input[type=email]").each(function(index,element){
		$(element).removeAttr("disabled");
	});
	
	$("form textarea").each(function(index,element){
		$(element).removeAttr("disabled");
	});
	
	$("form input[type=radio]").each(function(index,element){
		$(element).removeAttr("disabled");
	});
	
	$("form input[type=checkbox]").each(function(index,element){
		$(element).removeAttr("disabled");
	});
}


function initDisplayPageByForm(formid){
	$("#"+formid+" select").each(function(index,element){
		$(element).attr("disabled","disabled");
	});
	
	$("#"+formid+" input[type=text]").each(function(index,element){
		$(element).attr("disabled","disabled");
	});
	$("#"+formid+"  input[type=date]").each(function(index,element){
		$(element).attr("disabled","disabled");
	});
	
	$("#"+formid+"  textarea").each(function(index,element){
		$(element).attr("disabled","disabled");
	});
}