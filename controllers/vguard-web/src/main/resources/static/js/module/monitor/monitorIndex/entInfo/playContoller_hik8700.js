/**
 * 初始化调用海康8700平台视频基本配置参数
 */
function initHik8700(spvxOcx) {
//	spvxOcx.PVX_Uninit();
	spvxOcx.MPV_Init(1);
	var localParam = "<?xml version='1.0' encoding='UTF-8'?>" + 
					 "<localParam>" +
					 " 	<picType>1</picType>" +         
					 " 	<capturePath>C:\Hikvision8700Cap</capturePath>" +   
					 " 	<recordSize>2</recordSize>" +
					 " 	<recordPath>C:\Hikvision8700Rec</recordPath>" +
					 " 	<limitPreviewTime>0</limitPreviewTime>" +
					 " 	<showMsgTip>1</showMsgTip>" +
					 "</localParam>";
	spvxOcx.MPV_SetLocalParam(localParam);
}  
    
/**
 * hik8700云台-焦距+
 */
function PTZAddTimes_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 11, 3);
}

/**
 * hik8700云台-焦距-
 */
function PTZMinusTimes_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 12, 3);
}

/**
 * hik8700云台-左
 */
function PTZLeft_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 23, 3);
}

/**
 * hik8700云台-右
 */
function PTZRight_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 24, 3);
}

/**
 * hik8700云台-左上
 */
function PTZLeftUp_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 25, 3);
}

/**
 * hik8700云台-上
 */
function PTZUp_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 21, 3);
}

/**
 * hik8700云台-右上
 */
function PTZRightUp_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 26, 3);
}

/**
 * hik8700云台-左下
 */
function PTZLeftDown_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 27, 3);
}

/**
 * hik8700云台-下
 */
function PTZDown_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 22, 3);
}

/**
 * hik8700云台-右下
 */
function PTZRightDown_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 28, 3);
}

/**
 * hik8700云台-焦点-
 */
function PTZNearFocus_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 14, 3);
}

/**
 * hik8700云台-焦点+
 */
function PTZFarFocus_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 13, 3);
}

/**
 * hik8700云台-光圈-
 */
function PTZSmallAperture_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 16, 3);
}

/**
 * hik8700云台-光圈+
 */
function PTZLargeAperture_8700() {
	if (!window.spvxOcx) {
		window.spvxOcx = document.getElementById("spvViewOCX");
	}
	window.spvxOcx.MPV_PTZCtrl(-1, 0, 15, 3);
}