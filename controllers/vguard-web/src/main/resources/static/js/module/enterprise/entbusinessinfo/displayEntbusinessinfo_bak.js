/**
 * Created by Administrator on 2017/12/25.
 */
$(document).ready(function () {
    $("#myNav").affix({
        offset: {
            top: -1
        }
    });

    $('#myScrollspy').on('activate.bs.scrollspy', function () {
        // 执行一些动作...
        $(".nav li > a").next().hide();
        var currentItem = $(".nav li.active > a").next().show();
    });


    //获取企业基本信息
    initEntBaseInfo();
});

/**
 * 初始化企业基本信息
 */
function initEntBaseInfo() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entbaseinfo/showBaseInfo/' + getQueryString("businessinfoid"),
        cache: false,
        dataType: 'json',
        global: false,
        success: function (data) {
            console.log(data.entBusinessinfo);
            var entbusinessinfoTpt = _.template($("#entbusinessinfoTpt").html());
            $("#entbaseinfo").html(entbusinessinfoTpt(data));

            var entBusinessinfo = data.entBusinessinfo;
            loadDirectorTypeAllSelect(entBusinessinfo.city,entBusinessinfo.area,entBusinessinfo.street,entBusinessinfo.community,entBusinessinfo.directortypeid);

            //所属行业树
            // SelectTree.loadEconindustrySelect("econindustryname");

        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}


function loadDirectorTypeAllSelect(city, area, street, community, directortypeid) {
    if (directortypeid != null && directortypeid != "") {
        $.ajax({
            type: "post",
            url: BASE_URL + '/system/sysdirectortype/loadDirectorById',
            dataType: 'json',
            data: {
                "directortypeid": directortypeid,
                "citycode": city,//市
                "areacode": area,//区县
                "streetcode": street,//街道办
                "communitycode": community//社区
            },
            global: false,
            async: false,
            success: function (json) {
                if (json != null) {
                    $('#directortypeid').text(json.resultname);//行业主管分类
                    $('#managertypename').text(json.managertypename);//监管分类
                }
            },
            error: function () {

            }
        });
    } else {
        $('#directortypename').val("");
    }
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}