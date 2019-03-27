!function () {
    //这个类是用于和 默认也绑定的js类；负责给Mirs平台一些参数，或处理一些回调。


    //初始化二次开发项目名称空间.curProject 二次开发项目使用人员请自行更改为自己的名称空间)
    window.curProject = window.curProject || {};


    //如果js 被重复引用抛出异常，最好别是 return 那样重复引用了也不知道，当然也不会报错；
    if (window.curProject.Default) throw new Error('curProject.Default 类重复加载');

    //类化JavaScript ；v 是 view 的缩写
    var v = window.curProject.Default = function () {

    };
    //如下3个函数必须实现
    //返回创建Mirs研发平台整体框架的，父 Element，如果二次开发自定义了首页这里可以自己传给mirs平台一个重定义后的位置。
    v.prototype.getMirsParentElement = function () {
        return document.getElementById("mirsParent");
    }
    //获取初始化的一些参数，比如路径可用于多网卡环境变化，这个借口实现相对静态的配置，加载后不再可以变更
    v.prototype.getMirsConfig = function () {
        var rtn = {
            SiteUrl: "/Mirs.Quick" //可以是绝对路径 2015-6-18
			, DebugSwitch: true //调试状态，客户端会有调试输出或调试日志 2015-6-18
		    , DefTheme: "Default"//当用户无主题的时候的默认主题颜色(选配节)
            , WinManagerBarSwitch: true//窗口管理工具栏开关 默认为true开启，关闭false(选配节)
        };
        return rtn;
    }

    // call-back 函数，平台加载完成后会调用本函数，二次开发人员可以在这里做后续的处理
    v.prototype.MirsAppCompleted = function () {

        var app = window.Mirs.Application.getInstance();
        var cwin = app.getWorkControl().getMdiControl().createChildWindow("77B720EB-7F74-4BC4-B27F-EE0CE75258C4");

        var iframeEle = document.createElement("iframe");
        //iframeEle.src = "Document/Guided/GuidedIndex.html";
        iframeEle.src = "welcome";
        iframeEle.style.width = "100%";
        iframeEle.style.height = "100%";
        iframeEle.id = "GuidedPage";

        cwin.setIframeElement(iframeEle);
        cwin.getContainer().appendChild(iframeEle);
        cwin.setCaption("欢迎");

        cwin.show();
        
        var wcd=window.workControl.Demo.getInstance();
        var wcdc=wcd.create();
        
        //2.设置扩展按钮----账号
        var emtUser = document.createElement("div");
        var emtUserIcon = document.createElement("div");
        emtUserIcon.className = "msetItemIcon";
        emtUserIcon.style.backgroundImage = "url(images/user.png)";
        emtUser.appendChild(emtUserIcon);
        var emtUserTitle = document.createElement("div");
        emtUserTitle.className = "msetItemTitle";
        emtUserTitle.innerHTML = "账户";
        emtUser.appendChild(emtUserTitle);
        var userItem = window.Mirs.Navigation.ExtenMenu.CreateItem(emtUser); //创建面板插件对象
        emtUser.addEventListener("click", account);
       
     

        //3 设置扩展按钮----系统退出
        var emtLogout = document.createElement("div");

        var msetItemIcon = document.createElement("div");
        msetItemIcon.className = "msetItemIcon";
        msetItemIcon.style.backgroundImage = "url(images/signout.png)";
        emtLogout.appendChild(msetItemIcon);
        var msetItemTitle = document.createElement("div");
        msetItemTitle.className = "msetItemTitle";
        msetItemTitle.innerHTML = "系统退出";
        emtLogout.appendChild(msetItemTitle);
        var tempItem = window.Mirs.Navigation.ExtenMenu.CreateItem(emtLogout); //创建面板插件对象
        emtLogout.addEventListener("click", logout);
        

        //设置logo
        //app.getNavControl().setLogo("MirsImages/logo/dota2logo.jpg");

        //设置窗口管理工具栏最小显示宽度
        //var WinManagerBar= window.Mirs.Navigation.WinManagerBar.getInstance();
        //WinManagerBar.setMinVisibleWidth(321);
    }
    
    //用户信息
    var _userPageFrm = null;
    v.prototype.user = function () {
        if (_userPageFrm) {
            _userPageFrm.show();
        } else {
            var app = window.Mirs.Application.getInstance();
            var cwin = app.getWorkControl().getMdiControl().createChildWindow();
            var iframeEle = document.createElement("iframe");
            // http://localhost/Config/UserConfig/User/Info.html
            var hostName = window.location.hostname;
            var url = "";
            if (hostName == "123.160.220.42") {
                url = "http://" + hostName + ":50101/Config/UserConfig/User/Info.html?ticket=";

            } else {
                url = "http://" + hostName + "/Config/UserConfig/User/Info.html?ticket=";
            }
            iframeEle.src = url + encodeURIComponent(Global.ticket);
            iframeEle.style.width = "100%";
            iframeEle.style.height = "100%";
            iframeEle.id = "UserMessage";
            iframeEle.name = "UserMessage";
            cwin.setIframeElement(iframeEle);
            cwin.getContainer().appendChild(iframeEle);
            _userPageFrm = null;
            cwin.setCaption("账户");

            cwin.show();
            _userPageFrm = cwin;
        }
    }
}();