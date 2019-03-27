/*新增或编辑课程管理*/
$(function () {
    $("#emsDrillPlanForm").validate({
        rules: {
        	drillname: {
                required: true
            },
            planname: {
                required: true
            },
            plandate: {
                required: true
            },
            planaddress:{
            	required: true
            },
            drilltype:{
            	required: true
            }
        },
        messages: {
        	drillname: {
                required: "请填写演练计划名称"
            },
            planname: {
                required: "请选择关联预案"
            },
            plandate: {
                required: "请填写计划演练时间"
            },
            planaddress: {
                required: "请填写计划演练地点"
            },
            drilltype:{
            	required: "请选择演练形式"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdrillplan/load/"+getQueryString("pid"),
        dataType: "json",
        data: {},
        success: function (data) {
            if (data) {
                var emsDrillPlanTpt = _.template($("#emsDrillPlanTpt").html());
                $("#emsDrillPlanForm").html(emsDrillPlanTpt(data));
                selPlan($("#planname"), BASE_URL + "ems/emsplaplaninfo/list");

                //演练形式
                SelectOption.loadDrilltype("drilltype");
               
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
});

/*保存(新增或编辑)*/
function save() {
    $.ajax({
        type: "post",
        async: false,
        url: BASE_URL + "ems/emsdrillplan/save",
        data: $("#emsDrillPlanForm").serializeArray(),
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("编辑失败");
        }
    });
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 查询企业
 * @param $ajax
 * @param url
 */
function selPlan($ajax, url) {
    $ajax.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {

                return {
                    planname: params.term, // search term
                    plantype: "",
                    planstate: "",
                    districtid: "",
                    rows: "10",
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;

                var itemList = [];
                for (var i = 0; i < data.datas.length; i++) {
                    itemList.push({
                            id: data.datas[i].PLANID,
                            text: data.datas[i].PLANNAME
                        }
                    )
                }
                return {
                    results: itemList,
                    pagination: {
                        more: params.page < data.totalpage
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        allowClear: true,//允许删除
        placeholder: "请选择",
        language: "zh-CN",
        templateResult: formatRepo, // omitted for brevity, see the source of this page
        templateSelection: formatPlanSelection // omitted for brevity, see the source of this page
    });
}

/**
 * 格式化查询结果
 * @param repo
 */
function formatRepo(repo) {
    if (repo.loading) return repo.text;
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";
    return markup;
}

/**
 * 格式化选择结果
 * @param repo
 * @returns {*}
 */
function formatPlanSelection(repo) {
    $("#planid").val(repo.id);
    return repo.text;
}