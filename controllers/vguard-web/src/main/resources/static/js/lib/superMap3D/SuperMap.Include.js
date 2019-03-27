
function _IncludeScript(inc){
  var script='<'+'script type="text/javascript" src='+BASE_URL+'/js/lib/superMap3D/lib_Realspace/'+inc+''+'><'+'/script>'; 
	document.writeln(script); 
}

function _Include2DScript(inc){
	var script='<'+'script type="text/javascript" src='+BASE_URL+'/js/lib/superMap3D/lib_Ajax/'+inc+''+'><'+'/script>'; 
	document.writeln(script); 
}

if(!Function.__typeName)
{    
    _Include2DScript('MicrosoftAjax.js'); 

	_Include2DScript('SuperMap-7.0.1-11323.js');

    _IncludeScript('SuperMap.Web.Realspace.js');   
                   
}