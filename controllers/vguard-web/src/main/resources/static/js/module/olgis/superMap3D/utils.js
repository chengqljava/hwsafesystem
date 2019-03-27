/*通用方法工具类*/

var utils = {};

//根据坐标点飞行到目的地
utils.flyTo = function(lon,lat,alti,heading,tilt,scene){
	var camera = new SuperMap.Web.Realspace.Camera(lon,lat,alti);//设置照相机
	camera.set_heading(heading);
    camera.set_tilt(tilt);
	scene.get_flyingOperator().flyTo(camera,1000,6);
}

//设置控件的当前操作为漫游
utils.pan = function(sceneControl){
	var panAction = new SuperMap.Web.UI.Action3Ds.PanSelect(sceneControl);
	sceneControl.set_sceneAction(panAction);
}

//设置三维文本风格
utils.setTextStyle3D = function(fontScale,opaqueRate,foreColor,bold){
	var textStyle3D = new SuperMap.Web.Core.TextStyle3D();
	textStyle3D.set_fontScale(0.8);
	textStyle3D.set_opaqueRate(100);
	textStyle3D.set_foreColor(new SuperMap.Web.Core.Color(255,255,255,255));
	textStyle3D.set_bold(true);
	return textStyle3D;
}