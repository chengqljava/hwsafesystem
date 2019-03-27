$(function(){
    loadSafemenutree();
});

/**
 *保存 
 */
function save(){
    var treeSelectId = $("#treeSelectId").val();
    if(treeSelectId == ""){
        parent.toast("没有选择相应的事故");
        return;
    }
    $.ajax({
        type : 'post',
        url : BASE_URL+'/ems/emsplaeventtype/save',
        cache : false,
        dataType : 'json',
        data : {treeSelectId:treeSelectId,plandId:$("#planId").val(),token:$("#token").val()},
        global : false,
        success : function(json) {
            if(json.success==true){
                parent.toast(json.msg);//弹出提示信息
                parent.closeWin();// 关闭弹出框
            }else{
                parent.toast(json.msg);
            }
        },
        error : function() {
            parent.toast("保存失败");
        }
    });
}

/**
 * 加载安全信息树
 */
function loadSafemenutree(){
    var setting = {
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
            },
            data : {
                simpleData : {
                    enable : true
                }
            },
            callback: {
                onCheck: treeClick
            }
    };  
    $.ajax({
        type :'post',
        url : BASE_URL+'/ems/emsplaeventtype/load',
        cache : false,
        data:{planId:$("#planId").val()},
        dataType : 'json',
        global : false,
        async : false,
        success : function(map) {
            var tree_map = initTreeMap(map);
            $.fn.zTree.init($("#emsplaevent"), setting, tree_map);
        },
        error : function() {
        	console.log("网络异常");
        }
    });
    
    //树图标的初始化
    function initTreeMap(map) {
        var t_map = new Array();
        //遍历子节点
        if (map != null && map.length > 0) {
            var open = false;
            for ( var i = 0; i < map.length; i++) {
                var icon = "";
                t_map.push(new Node(map[i].ID, map[i].PID, map[i].NAME,
                        true,icon,map[i].CHECKED));
            }
        } else {
            t_map = null;
        }
        return t_map;
    }
    
    //树节点对象
    function Node(id, pId, name, open, icon,checked) {
        this.id = id;
        this.pId = pId;
        this.name = name;
        this.open = open;
        this.icon = icon;
        this.checked = checked;
    }
}

/**点击权限树节点*/
function treeClick(){
    var zTree = $.fn.zTree.getZTreeObj("emsplaevent");
    var nodes = zTree.getCheckedNodes(true);
    var eventId = "";
    nodes.sort(function compare(a, b) {
        return a.id - b.id;
    });
    for ( var i = 0, l = nodes.length; i < l; i++) {
        eventId += nodes[i].id + ",";
    }
    if (eventId.length > 0){
        eventId = eventId.substring(0, eventId.length - 1);
    }
   $("#treeSelectId").val(eventId);
}