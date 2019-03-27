/**
 * 按需加载js或css资源
 */
function include_res(resNameArr, type) {
    //默认蓝色blue皮肤
    var BASE_URL = location.protocol + "//" + location.host
        + location.pathname.match("/[^/]*/?")[0], skin = "blue";
    if (resNameArr && 0 < resNameArr.length &&
        null != type && undefined != type && "null" != type && "" != type) {
        for (var i = 0; i < resNameArr.length; i++) {
            if ("jslib" == type) {
                switch (resNameArr[i]) {

                    case "orgcharts":
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/orgcharts/js/jquery.orgchart.js'></script>");
                        break;
                    case "htmltopdf":
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/html2pdf/html2canvas.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/html2pdf/jsPdf.debug.js'></script>");
                        break;
                    case "pager":
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/pager/pager.js'></script>");
                        break;
                    case "jquerynav":
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/jquery.nav/jquery.nav.js'></script>");
                        break;
                    case "daterangepicker":
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/daterangepicker/moment.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/daterangepicker/daterangepicker.js'></script>");
                        break;
                    case "select_two":
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/select_two.js'></script>");
                        break;
                    case "layer":
//					var script1 = document.createElement("script"), script2 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
//					//layer 弹出框第三方包
//					script1.src = BASE_URL + "js/lib/layer/layer-2.2.js";
//					//自己基于layer封装的弹出框
//					script2.src = BASE_URL + "js/common/mylayer.js";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/layer/layer-2.2.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/mylayer.js'></script>");
                        break;
                    case "shrink":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//shrink 控件
//					script.src = BASE_URL + "js/common/shrink.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/shrink.js'></script>");
                        break;
                    case "jquery":
//					var script1 = document.createElement("script");
//					script2 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
                        //jquery库
//					script1.src = BASE_URL + "js/lib/jquery-1.11.2.min.js";
//					script2.src = BASE_URL + "js/common/jquery-customer.js";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/jquery-1.11.2.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/jquery-customer.js'></script>");
                        break;
                    case "bootstrap":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//bootstrap 控件
//					script.src = BASE_URL + "js/lib/bootstrap.min.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/bootstrap.min.js'></script>");
                        break;
                    case "jqueryui":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//jqueryui 控件
//					script.src = BASE_URL + "js/lib/jqueryUI/jquery-ui.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/jqueryUI/jquery-ui.js'></script>");
                        break;
                    case "jqgrid":
//					var script1 = document.createElement("script"), script2 = document
//							.createElement("script"), script3 = document
//							.createElement("script"), script4 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
//					script3.type = "text/javascript";
//					script4.type = "text/javascript";
//					//jqgrid库
//					script1.src = BASE_URL
//							+ "js/lib/jqGrid/jquery.jqGrid.min.js";
//					//汉化包
//					script2.src = BASE_URL
//							+ "js/lib/jqGrid/i18n/grid.locale-cn.js";
//					//三级表头 js
//					script3.src = BASE_URL
//							+ "js/lib/jqGrid/jquery.jqGrid.groupHeader-0.2.1.js";
//					//分页
//					script4.src = BASE_URL + "js/common/page.js";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script3.onerror = function() {
//					};
//					script4.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					script3.onload = function() {
//					};
//					script4.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
//					document.body.appendChild(script3);
//					document.body.appendChild(script4);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/jqGrid/jquery.jqGrid.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/jqGrid/i18n/grid.locale-cn.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/jqGrid/jquery.jqGrid.groupHeader-0.2.1.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/jqGrid/gridscroll.js'></script>");
                        break;
                    case "validate":
//					var script1 = document.createElement("script"), script2 = document
//							.createElement("script"), script3 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
//					script3.type = "text/javascript";
//					//validate库
//					script1.src = BASE_URL
//							+ "js/lib/validate/jquery.validate.js";
//					script2.src = BASE_URL
//							+ "js/lib/validate/additional-methods.min.js";
//					script3.src = BASE_URL
//							+ "js/lib/validate/additional-methods.js";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script3.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					script3.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
//					document.body.appendChild(script3);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/validate/jquery.validate.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/validate/additional-methods.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/validate/additional-methods.js'></script>");
                        break;
                    case "date":
//					var script1 = document.createElement("script"), script2 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
//					//日期库
//					script1.src = BASE_URL
//							+ "js/lib/datetimepicker/bootstrap-datetimepicker.min.js";
//					script2.src = BASE_URL
//							+ "js/lib/datetimepicker/locales/bootstrap-datetimepicker.zh-CN.js";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/datetimepicker/bootstrap-datetimepicker.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/datetimepicker/locales/bootstrap-datetimepicker.zh-CN.js'></script>");
                        break;
                    case "datepicker":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//日期库
//					script.src = BASE_URL + "js/lib/datepicker/WdatePicker.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/datepicker/WdatePicker.js'></script>");
                        break;
                    case "calendar":
//					var script1 = document.createElement("script"), script2 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
//					//日历库
//					script1.src = BASE_URL
//							+ "js/lib/calendar/bootstrap-year-calendar.min.js";
//					script2.src = BASE_URL
//							+ "js/lib/calendar/bootstrap-popover.js";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/calendar/bootstrap-year-calendar.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/calendar/bootstrap-popover.js'></script>");
                        break;
                    case "ztree":
//					var script1 = document.createElement("script"), script2 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
//					//ztree树
//					script1.src = BASE_URL
//							+ "js/lib/ztree/jquery.ztree.core-3.5.js";
//					script2.src = BASE_URL
//							+ "js/lib/ztree/jquery.ztree.excheck-3.5.min.js";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/ztree/jquery.ztree.core-3.5.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/ztree/jquery.ztree.excheck-3.5.min.js'></script>");
                        break;
                    case "pushlet":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//pushlet库
//					script.src = BASE_URL
//							+ "js/lib/pushlet/ajax-pushlet-client.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/pushlet/ajax-pushlet-client.js'></script>");
                        break;
                    case "echarts":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//echarts图表
//					script.src = BASE_URL + "js/lib/echarts/echarts.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/echarts/echarts.min.js'></script>");
                        break;
                    case "drag":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//drag拖拽
//					script.src = BASE_URL
//							+ "js/lib/drag/draggabilly.pkgd.min.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/drag/draggabilly.pkgd.min.js'></script>");
                        break;
                    case "fastclick":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//fastclick移动优先的跨屏前端框架(转换到触摸屏设备)
//					script.src = BASE_URL + "js/lib/fastclick/fastclick.min.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/fastclick/fastclick.min.js'></script>");
                        break;
                    case "slimscroll":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//slimscroll 滚动条
//					script.src = BASE_URL
//							+ "js/lib/slimScroll/jquery.slimscroll.min.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/slimScroll/jquery.slimscroll.min.js'></script>");
                        break;
                    case "fileinput":
//					var script1 = document.createElement("script"), script2 = document
//							.createElement("script"), script3 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
//					script3.type = "text/javascript";
//					//fileinput图表
//					script1.src = BASE_URL
//							+ "js/lib/fileinput/fileinput.min.js";
//					script2.src = BASE_URL
//							+ "js/lib/fileinput/fileinput_locale_zh.js";
//					script3.src = BASE_URL + "js/common/fileutil.js";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script3.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					script3.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
//					document.body.appendChild(script3);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/fileinput/fileinput.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/fileinput/fileinput_locale_zh.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/fileutil.js'></script>");
                        break;
                    case "ajaxfileupload":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//ajaxfileupload图表
//					script.src = BASE_URL
//							+ "js/lib/ajaxfileupload/ajaxfileupload.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/ajaxfileupload/ajaxfileupload.js'></script>");
                        break;
                    case "dateutil":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//dateutil
//					script.src = BASE_URL + "js/common/dateutil.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/dateutil.js'></script>");
                        break;
                    case "select_option":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//下拉框
//					script.src = BASE_URL + "js/common/select_option.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/select_option.js'></script>");
                        break;
                    case "select_tree":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//下拉树
//					script.src = BASE_URL + "js/common/select_tree.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/select_tree.js'></script>");
                        break;
                    case "formutils":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//formutils
//					script.src = BASE_URL + "js/common/formutils.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/formutils.js'></script>");
                        break;
                    case "input_select":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//input_select
//					script.src = BASE_URL
//							+ "js/lib/inputSelect/bootstrap-select.min.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/inputSelect/bootstrap-select.min.js'></script>");
                        break;
                    case "multiselect":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//multiselect
//					script.src = BASE_URL
//							+ "js/lib/multiselect/bootstrap-multiselect.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/multiselect/bootstrap-multiselect.js'></script>");
                        break;
                    case "modernizr":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//modernizr
//					script.src = BASE_URL + "js/lib/modernizr/modernizr.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/modernizr/modernizr.js'></script>");
                        break;
                    case "contabs":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//contabs
//					script.src = BASE_URL + "js/lib/contabs/contabs.min.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/contabs/contabs.min.js'></script>");
                        break;
                    case "superSlide":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//superSlide
//					script.src = BASE_URL
//							+ "js/lib/superSlide/jquery.SuperSlide.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/superSlide/jquery.SuperSlide.js'></script>");
                        break;
                    case "ueditor":
//					var script1 = document.createElement("script"), script2 = document
//							.createElement("script"), script3 = document
//							.createElement("script");
//					script1.type = "text/javascript";
//					script2.type = "text/javascript";
//					script3.type = "text/javascript";
//					//ueditor编辑器
//					script1.src = BASE_URL + "js/lib/UEditor/ueditor.config.js";
//					script2.src = BASE_URL
//							+ "js/lib/UEditor/ueditor.all.min.js";
//					//建议手动加在语言，避免在ie下有时因为加载语言失败导致编辑器加载失败,这里加载的语言文件会覆盖你在配置项目里添加的语言类型，比如你在配置项目里配置的是英文，这里加载的中文，那最后就是中文
//					script3.src = BASE_URL
//							+ "js/lib/UEditor/lang/zh-cn/zh-cn.js";
//					script1.charset = "utf-8";
//					script2.charset = "utf-8";
//					script3.charset = "utf-8";
//					script1.onerror = function() {
//					};
//					script2.onerror = function() {
//					};
//					script3.onerror = function() {
//					};
//					script1.onload = function() {
//					};
//					script2.onload = function() {
//					};
//					script3.onload = function() {
//					};
//					document.body.appendChild(script1);
//					document.body.appendChild(script2);
//					document.body.appendChild(script3);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/UEditor/ueditor.config.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/UEditor/ueditor.all.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/UEditor/lang/zh-cn/zh-cn.js'></script>");
                        break;
                    case "timeline":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//timeline css (CSS3垂直时间轴)
//					script.src = BASE_URL
//							+ "js/lib/timeline/modernizr.custom.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/timeline/modernizr.custom.js'></script>");
                        break;
                    case "cameraZW":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					//自己封装的视频播放插件 大华和海康
//					script.src = BASE_URL + "js/common/cameraZW/cameraZW.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/cameraZW/cameraZW.js'></script>");
                        break;
                    case "displayOper":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					// 显示权限按钮
//					script.src = BASE_URL + "js/common/jquery.displayOper.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/jquery.displayOper.js'></script>");
                        break;
                    case "underscore":
//					var script = document.createElement("script");
//					script.type = "text/javascript";
//					// underscore工具类
//					script.src = BASE_URL + "js/lib/underscore-min.js";
//					script.onerror = function() {
//					};
//					script.onload = function() {
//					};
//					document.body.appendChild(script);
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/underscore/underscore-min.js'></script>");
                        break;
                    case "maputil":
                        //map类型工具类
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/maputil.js'></script>");
                        break;
                    case "chosen":
                        //chosen下拉复选框
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/chosen/chosen.jquery.min.js'></script>");
                        break;
                    case "select2":
                        //输入选择框
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/select2/select2.full.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/select2/i18n/zh-CN.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/select_two.js'></script>");
                        // document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/select2/js/select2.full.min.js'></script>");
                        break;
                    case "numeral":
                        //金额-千分位等数值转换工具类
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/numeraljs/numeral.min.js'></script>");
                        break;
                    case "html5":
                        //html5对老浏览器的兼容调整
                        document.write("<!--[if lt IE 9]>" +
                            "<script src='" + BASE_URL + "js/lib/html5shiv-3.7.2.min.js'></script>" +
                            "<script src='" + BASE_URL + "js/lib/respond-1.4.2.min.js'></script>" +
                            "<![endif]-->");
                        break;
                    case "websocket":
                        //Websocket-sockJS(兼容各种浏览器的websocket支持)
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/websocket/sockjs-1.1.1.min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/websocket/reconnecting-websocket.min.js'></script>");
                        break;
                    case "gisMap":
                        //gis地图
                        document.write("<script type='text/javascript' src='http://api.map.baidu.com/api?v=2.0&ak=kgpndOpekdOymqCmM7GBEFg7'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/gis/AreaRestriction_min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/gis/DrawingManager_min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/gis/GeoUtils_min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/gis/DistanceTool_min.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/baidumaplib/BMapLib_InfoBox.min.js'></script>");
                        break;
                    case "metisMenu":
                        //手风琴菜单导航及其配置
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/metisMenu.js'></script>");
                        document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/gis/gnmenu.js'></script>");
                        break;
                    case "ObserverJS":
                    	//观察者模式实现事件监听JS
                    	document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/Observer.js'></script>");
                    	break;
                    case "jPlayer":
                    	//输入选择框
                    	document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/jPlayer-master/dist/jplayer/jquery.jplayer.min.js'></script>")
                    	break;
                    case "autoheight":
                    	//输入选择框
                    	document.write("<script type='text/javascript' src='" + BASE_URL + "js/common/autoheight.js'></script>")
                    	break;
                    case "nicescroll":
                    	//滚动条插件
                    	document.write("<script type='text/javascript' src='" + BASE_URL + "js/lib/scroll/jquery.nicescroll.min.js'></script>")
                    	break;
                    default:
                        break;
                }
            } else if ("jsmod" == type) {
//				var script = document.createElement("script");
//				script.type = "text/javascript";
//				// 业务js
//				script.src = BASE_URL + resNameArr[i];
//				script.onerror = function() {
//				};
//				script.onload = function() {
//				};
//				document.body.appendChild(script);
                document.write("<script type='text/javascript' src='" + BASE_URL + resNameArr[i] + "'></script>");
            } else if ("css" == type) {
                switch (resNameArr[i]) {
                    case "orgcharts":
                        document.write("<link href='" + BASE_URL + "js/lib/orgcharts/css/font-awesome.min.css' rel='stylesheet' type='text/css' />");
                        document.write("<link href='" + BASE_URL + "js/lib/orgcharts/css/jquery.orgchart.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "orgchartscol":
                        document.write("<link href='" + BASE_URL + "js/lib/orgcharts/css/font-awesome.min.css' rel='stylesheet' type='text/css' />");
                        document.write("<link href='" + BASE_URL + "js/lib/orgcharts/css/jquery.orgchart-col.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "daterangepicker":
                        document.write("<link href='" + BASE_URL + "css/lib/daterangepicker/daterangepicker.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "bootstrap":
//					var linkTag = document.createElement("link");
//					linkTag.href = BASE_URL + "css/lib/bootstrap.min.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/lib/bootstrap.min.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "jqgrid":
//					var linkTag1 = document.createElement("link"), linkTag2 = document
//							.createElement("link"), linkTag3 = document
//							.createElement("link");
//					//jqgrid css
//					linkTag1.href = BASE_URL
//							+ "css/lib/jqGrid/ui.jqgrid-bootstrap-ui.css";
//					linkTag2.href = BASE_URL + "css/lib/jqGrid/ui.jqgrid.css";
//					linkTag3.href = BASE_URL
//							+ "css/lib/jqGrid/ui.jqgrid-bootstrap.css";
//					linkTag1.setAttribute("rel", "stylesheet");
//					linkTag2.setAttribute("rel", "stylesheet");
//					linkTag3.setAttribute("rel", "stylesheet");
//					linkTag1.setAttribute("type", "text/css");
//					linkTag2.setAttribute("type", "text/css");
//					linkTag3.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag1);
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag2);
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag3);
                        document.write("<link href='" + BASE_URL + "css/lib/jqGrid/ui.jqgrid-bootstrap-ui.css' rel='stylesheet' type='text/css' />");
                        document.write("<link href='" + BASE_URL + "css/lib/jqGrid/ui.jqgrid.css' rel='stylesheet' type='text/css' />");
                        document.write("<link href='" + BASE_URL + "css/lib/jqGrid/ui.jqgrid-bootstrap.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "jqueryui":
//					var linkTag = document.createElement("link");
//					//jqueryUI css
//					linkTag.href = BASE_URL + "css/lib/jqueryUI/jquery-ui.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/lib/jqueryUI/jquery-ui.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "date":
//					var linkTag = document.createElement("link");
//					//datetimepicker css
//					linkTag.href = BASE_URL
//							+ "css/lib/datetimepicker/bootstrap-datetimepicker.min.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/lib/datetimepicker/bootstrap-datetimepicker.min.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "calendar":
//					var linkTag = document.createElement("link");
//					//alendar css
//					linkTag.href = BASE_URL
//							+ "css/lib/calendar/bootstrap-year-calendar.min.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/lib/calendar/bootstrap-year-calendar.min.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "ztree":
//					var linkTag = document.createElement("link");
//					//ztree css
//					linkTag.href = BASE_URL
//							+ "css/lib/zTreeStyle/zTreeStyle.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/lib/zTreeStyle/zTreeStyle.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "layer":
//					var linkTag1 = document.createElement("link"), linkTag2 = document
//							.createElement("link");
//					//layer弹出框
//					linkTag1.href = BASE_URL + "css/theme/" + skin
//							+ "/layer/layer.min.css";
//					linkTag2.href = BASE_URL + "css/theme/" + skin
//							+ "/layer/layer.ext.min.css";
//					linkTag1.setAttribute("rel", "stylesheet");
//					linkTag2.setAttribute("rel", "stylesheet");
//					linkTag1.setAttribute("type", "text/css");
//					linkTag2.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag1);
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag2);
                        document.write("<link href='" + BASE_URL + "css/theme/" + skin
                            + "/layer/layer.min.css' rel='stylesheet' type='text/css' />");
                        document.write("<link href='" + BASE_URL + "css/theme/" + skin
                            + "/layer/layer.ext.min.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "fileinput":
//					var linkTag = document.createElement("link");
//					//fileinput css
//					linkTag.href = BASE_URL + "css/lib/fileinput/fileinput.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/lib/fileinput/fileinput.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "login":
//					var linkTag = document.createElement("link");
//					//login css
//					linkTag.href = BASE_URL + "css/common/login.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/common/login.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "register":
//					var linkTag = document.createElement("link");
//					//register css
//					linkTag.href = BASE_URL + "css/common/register.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/common/register.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "font":
//					var linkTag = document.createElement("link");
//					//awesome css
//					linkTag.href = BASE_URL + "css/fonts/font-awesome.min.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/fonts/font-awesome.min.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "main":
//					var linkTag1 = document.createElement("link"), linkTag2 = document
//							.createElement("link");
//					//main css
//					linkTag1.href = BASE_URL + "css/common/main.css";
//					linkTag2.href = BASE_URL + "css/theme/" + skin
//							+ "/main.css";
//					linkTag1.setAttribute("rel", "stylesheet");
//					linkTag2.setAttribute("rel", "stylesheet");
//					linkTag1.setAttribute("type", "text/css");
//					linkTag2.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag1);
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag2);
                        document.write("<link href='" + BASE_URL + "css/common/main.css' rel='stylesheet' type='text/css' />");
                        document.write("<link href='" + BASE_URL + "css/theme/" + skin
                            + "/main.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "wtqmain":
//					var linkTag = document.createElement("link");
//					//wtqmain css
//					linkTag.href = BASE_URL + "css/common/wtqmain.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/common/wtqmain.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "input_select":
//					var linkTag = document.createElement("link");
//					//input_select css
//					linkTag.href = BASE_URL
//							+ "css/lib/inputSelect/bootstrap-select.min.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/lib/inputSelect/bootstrap-select.min.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "multiselect":
//					var linkTag = document.createElement("link");
//					//multiselect css
//					linkTag.href = BASE_URL
//							+ "css/lib/multiselect/bootstrap-multiselect.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);

                        document.write("<link href='" + BASE_URL + "css/lib/multiselect/bootstrap-multiselect.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "timeline":
//					var linkTag = document.createElement("link");
//					//timeline css (CSS3垂直时间轴)
//					linkTag.href = BASE_URL + "css/lib/timeline/component.css";
//					//					linkTag.href = BASE_URL + "css/lib/timeline/default.css";
//					linkTag.setAttribute("rel", "stylesheet");
//					linkTag.setAttribute("type", "text/css");
//					document.getElementsByTagName("head")[0]
//							.appendChild(linkTag);
                        document.write("<link href='" + BASE_URL + "css/lib/timeline/component.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "accordMenu":
                        //垂直导航条样式
                        document.write("<link href='" + BASE_URL + "css/lib/accordMenu/jquery-accordion-menu.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "bidIndex":
                        //垂直导航条样式
                        document.write("<link href='" + BASE_URL + "css/module/bid/bidIndex.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "chosen":
                        //下拉框复选插件
                        document.write("<link href='" + BASE_URL + "js/lib/chosen/chosen.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "select2":
                        //输入选择框
                        document.write("<link href='" + BASE_URL + "css/lib/select2/select2.min.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "gisMap":
                        //输入选择框
                        document.write("<link href='" + BASE_URL + "css/gis/DrawingManager_min.css' rel='stylesheet' type='text/css' />");
                        break;
                    case "jPlayer":
                    	//输入选择框
                    	document.write("<link href='" + BASE_URL + "js/lib/jPlayer-master/dist/skin/blue.monday/css/jplayer.blue.monday.min.css' rel='stylesheet' type='text/css' />");
                    	break;
                    case "gisPortal":
                    	//gis首页样式
                    	document.write("<link href='" + BASE_URL + "css/portal/simple-line-icons/simple-line-icons.css' rel='stylesheet' type='text/css' />");
                    	document.write("<link href='" + BASE_URL + "css/portal/fontawesome-free-5.0.2/web-fonts-with-css/css/fontawesome-all.min.css' rel='stylesheet' type='text/css' />");
                    	document.write("<link href='" + BASE_URL + "css/portal/style.css' rel='stylesheet' type='text/css' />");
                    	break;
                    case "syhtfont":
                    	//思源黑体字体
                    	document.write("<link href='" + BASE_URL + "css/fonts/syhtfont.css' rel='stylesheet' type='text/css' />");
                    	break;
                    default:
                        break;
                }
            }
        }
    } else {
        console.error("参数错误!");
    }
    return BASE_URL;
}