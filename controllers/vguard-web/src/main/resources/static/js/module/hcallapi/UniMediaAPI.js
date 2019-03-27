
/**
 * Javsascript library for iSoftCall OpenAPI.
 */


//OpenAPI接口对象
var UMO = {

    _apihost:    "http://127.0.0.1:8080/DeskServer",
    _bizhost:    "",                //Reserved
    _dom:        "",                //保存登录返回的企业ID
    _token:      "",	              //保存登录返回的令牌
    _loginok:    false,             //登录成功
    _evtname:    "msievent",        //侦听事件名
    _lastInitTime: 0,               //上次初始化时间
    _retrydelay: 1000,              //重试延迟
    _running:    false,

    _evthandler:                    //保存的事件回调函数
    {
        onReadyState: function(status){},
        onCallincome: function(ano, bno, uud){},
        onTalked: function(ano, bno, uud){},
        onRingStoped: function(){},
        onHookChanged: function(status){},
        onAgentChanged: function(status){},
        onAsyncFinished: function(atype, taskid, ret, desc){},
        onAllBusy: function(status, acd, quelen){},
        onQuelen: function(acd, quelen){},
        onSmsincome: function(dtime, from, content, slot){},
        onOperCallback: function( flowid, callid, direction, teleno, time, state ){},
        onSpeedCallback: function( flowid, callid, direction, teleno, time, state, desc ){}
    },

    //-------------------------------------- Common ------------------------------------

    /**
     * 启动
     * @param apiurl
     * @param bizurl
     * @param evthandler
     * @param eid
     * @param epwd
     * @param aid
     * @param apwd
     * @param adn
     * @param cb
     * @param w
     */
    start: function(apiurl, bizurl, evthandler, eid, epwd, aid, apwd, adn, cb, w)
    {
        if (UMO._running == true)
        {
            if ((cb != null) && (cb != undefined)) {
                cb("/comm/start", {"errno": "0", "errmsg": ""});
            }
            return;
        }

        //跨站脚本
        jQuery.support.cors = true;

        UMO._apihost = apiurl;
        UMO._bizhost = bizurl;
        UMO._evthandler = evthandler;
        UMO._dom = eid;
        UMO._userid = aid;

        var cmd = "/comm/start";
        var args = "dom="+eid+"&epwd="+epwd+"&aid="+aid+"&apwd="+apwd+"&adn="+adn;
        UMO._ajaxcall(cmd, args, function(cmd, result) {
            //
            if (result.errno == 0)
            {
                UMO._running = true;
                UMO._token = result.token;

                //PushLet推送
                UMO._initpush();

                //启动ping
                UMO._pinging();
            }

            if ((cb != null) && (cb != undefined))
            {
                cb(cmd, result);
            }
        }, w);
    },

    /**
     * 退出
     * @param cb
     * @param w
     */
    exit: function(cb, w)
    {
        //停止PushLet推送事件
        UMO._running = false;

        var cmd = "/comm/exit";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);

            //清空dom
            UMO._dom = "";
            UMO._token = "";
        }
    },

    /**
     *
     * @param cb
     * @param w
     */
    ping: function(cb, w)
    {
        var cmd = "/comm/ping";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 查询最后一次事件
     * @param evttype
     * @param cb
     * @param w
     */
    getevent: function(evttype, cb, w)
    {
        var cmd = "/comm/getevent";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&evttype="+evttype;

        UMO._ajaxcall(cmd, args, function(cmd, result){
            if ((cb != null) && (cb != undefined))
            {
                cb(cmd, result);
            }
        }, w);
    },

    /**
     * 订阅全局事件
     * @param evttypes
     * @param cb
     * @param w
     */
    subscribe: function(evttypes, cb, w)
    {
        var cmd = "/comm/subscribe";
        var args = "dom="+UMO._dom+"&token="+UMO._token +"&evttypes="+evttypes;

        UMO._ajaxcall(cmd, args, function(cmd, result){
            if ((cb != null) && (cb != undefined))
            {
                cb(cmd, result);
            }
        }, w);
    },

    /**
     * 获取序列号
     * @param cb
     * @param w
     */
    getsysid: function(cb, w)
    {
        var cmd = "/comm/getsysid";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        UMO._ajaxcall(cmd, args, function(cmd, result){
            if ((cb != null) && (cb != undefined))
            {
                cb(cmd, result);
            }
        }, w);
    },

    /**
     * 获取位置
     * @param cb
     * @param w
     */
    getpos: function(cb, w)
    {
        var cmd = "/comm/getpos";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        UMO._ajaxcall(cmd, args, function(cmd, result){
            if ((cb != null) && (cb != undefined))
            {
                cb(cmd, result);
            }
        }, w);
    },

    /**
     * 获取当前用户
     * @param cb
     * @param w
     */
    getuser: function(cb, w)
    {
        var cmd = "/comm/getuser";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        UMO._ajaxcall(cmd, args, function(cmd, result){
            if ((cb != null) && (cb != undefined))
            {
                cb(cmd, result);
            }
        }, w);
    },

    /**
     * 获取当前版本
     * @param cb
     * @param w
     */
    getversion: function(cb, w)
    {
        var cmd = "/comm/getversion";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        UMO._ajaxcall(cmd, args, function(cmd, result){
            if ((cb != null) && (cb != undefined))
            {
                cb(cmd, result);
            }
        }, w);
    },


    //-------------------------------------- Tele ------------------------------------

    //--- Call ---

    /**
     * 快速拨号
     * @param teleno
     * @param dispno
     * @param playfile
     * @param oper
     * @param param
     * @param gid
     * @param recflag
     * @param uud
     * @param backurl
     * @param cb
     * @param w
     */
    speeddial: function(teleno, dispno, playfile, oper, param, gid, recflag, uud, backurl, cb, w)
    {
        var cmd = "/tele/call/speeddial";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&teleno=" + teleno
            + "&dispno=" + dispno + "&playfile=" + playfile + "&oper=" + oper
            + "&param=" + param + "&gid=" + gid + "&recflag="+ recflag + "&uud=" + uud + "&backurl=" + encodeURIComponent(backurl) ;
        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 发送短信
     * @param teleno
     * @param content
     * @param options
     * @param slot
     * @param cb
     * @param w
     */
    speedsms: function(teleno, content, options, slot, cb, w)
    {
        var cmd = "/tele/call/speedsms";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&teleno=" + teleno + "&content=" + encodeURIComponent(content)
            + "&options=" + options + "&slot=" + slot;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 快速放音
     * @param callid
     * @param playfile
     * @param dtmfcnt
     * @param termchars
     * @param loop
     * @param async
     * @param cb
     * @param w
     */
    speedplay: function(callid, playfile, dtmfcnt, termchars, loop, async, cb, w)
    {
        var cmd = "/tele/call/speedplay";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&callid=" + callid + "&playfile=" + encodeURIComponent(playfile)
            + "&dtmfcnt=" + dtmfcnt + "&termchars=" + termchars + "&loop=" + loop
            + "&async=" + async;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 快速录音
     * @param callid
     * @param filename
     * @param async
     * @param maxtime
     * @param termchar
     * @param append
     * @param cb
     * @param w
     */
    speedrecord: function(callid, filename, async, maxtime, termchar, append, cb, w)
    {
        var cmd = "/tele/call/speedrecord";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&callid=" + callid + "&filename=" + encodeURIComponent(filename)
            + "&async=" + async + "&maxtime=" + maxtime + "&termchar=" + termchar
            + "&append=" + append;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 快速停止
     * @param callid
     * @param taskid
     * @param type
     * @param cb
     * @param w
     */
    speedstop: function(callid, taskid, type, cb, w)
    {
        var cmd = "/tele/call/speedstop";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&callid=" + callid + "&taskid=" + taskid  + "&type=" + type;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },


    /**
     * 快速挂机
     * @param callid
     * @param cb
     * @param w
     */
    speedhook: function(callid, cb, w)
    {
        var cmd = "/tele/call/speedhook";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&callid=" + callid;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 快速前转
     * @param callid
     * @param acdno
     * @param aidplay
     * @param cb
     * @param w
     */
    speedfoward: function(callid, acdno, aidplay, cb, w)
    {
        var cmd = "/tele/call/speedfoward";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&callid=" + callid + "&acdno=" + acdno
            + "&aidplay=" + aidplay;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 快速连接
     * @param callid1
     * @param callid2
     * @param action
     * @param cb
     * @param w
     */
    speedconnect: function(callid1, callid2, action, cb, w)
    {
        var cmd = "/tele/call/speedconnect";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&callid1=" + callid1 + "&callid2=" + callid2
            + "&action=" + action;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    //--- Conf --

    /**
     * 新建会议
     * @param password
     * @param cb
     * @param w
     */
    confnew: function(password, cb, w)
    {
        var cmd = "/tele/conf/new";
        var args = "dom="+UMO._dom+"&token="+UMO._token+ "&password=" + password;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 删除会议
     * @param confid
     * @param password
     * @param cb
     * @param w
     */
    confdelete: function(confid, password, cb, w)
    {
        var cmd = "/tele/conf/delete";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&confid=" + confid + "&password=" + password;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 会议邀请
     * @param confid
     * @param password
     * @param dispno
     * @param teleno
     * @param gid
     * @param attr
     * @param cb
     * @param w
     */
    confinvite: function(confid, password, dispno, teleno, gid, attr, cb, w)
    {
        var cmd = "/tele/conf/invite";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&confid=" + confid + "&password=" + password
            + "&dispno=" + dispno +"&teleno=" + teleno + "&gid=" + gid + "&attr=" + attr;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 会议踢出
     * @param confid
     * @param password
     * @param callid
     * @param teleno
     * @param cb
     * @param w
     */
    confkick: function(confid, password, callid, teleno, cb, w)
    {
        var cmd = "/tele/conf/kick";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&confid=" + confid + "&password=" + password
            + "&callid=" + callid + "&teleno=" + teleno;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 会议属性
     * @param confid
     * @param password
     * @param callid
     * @param teleno
     * @param newattr
     * @param cb
     * @param w
     */
    confattr: function(confid, password, callid, teleno, newattr, cb, w)
    {
        var cmd = "/tele/conf/attr";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&confid=" + confid + "&password=" + password
            + "&callid=" + callid + "&teleno=" + teleno + "&newattr=" + newattr;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 会议列表
     * @param cb
     * @param w
     */
    conflist: function(cb, w)
    {
        var cmd = "/tele/conf/list";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 会议成员
     * @param confid
     * @param password
     * @param cb
     * @param w
     */
    confmember: function(confid, password, cb, w)
    {
        var cmd = "/tele/conf/member";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&confid=" + confid + "&password=" + password;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },
    
    //--- Fax ---

    /**
     * 发送传真
     * @param teleno
     * @param faxfile
     * @param dtime
     * @param options
     * @param gid
     * @param cb
     * @param w
     */
    faxsend: function(teleno, faxfile, dtime, options, gid, cb, w)
    {
        var cmd = "/tele/fax/send";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&teleno=" + teleno + "&teleno=" + teleno + "&faxfile=" + faxfile
            + "&dtime=" + dtime + "&options=" + options;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 传真列表
     * @param cb
     * @param w
     */
    faxlist: function(cb, w)
    {
        var cmd = "/tele/fax/list";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 删除传真
     * @param faxfile
     * @param cb
     * @param w
     */
    faxdelete: function(faxfile, cb, w)
    {
        var cmd = "/tele/fax/delete";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&faxfile=" + faxfile;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },


    //--- Voice --

    /**
     * g729解码（仅用于Windows版）
     * @param srcfile
     * @param destfile
     * @param cb
     * @param w
     */
    g729decode: function(srcfile, destfile, cb, w)
    {
        var cmd = "/tele/vox/g729decode";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&srcfile=" + srcfile + "&destfile=" + destfile;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 文本转语音
     * @param text
     * @param destfile
     * @param option
     * @param cb
     * @param w
     */
    text2wave: function(text, destfile, option, cb, w)
    {
        var cmd = "/tele/vox/text2wave";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&text=" + text
            + "&destfile=" + destfile + "&option=" + option;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },


    //--- System ---

    /**
     * 队列列表
     * @param acd
     * @param cb
     * @param w
     */
    acdlist: function(acd, cb, w)
    {
        var cmd = "/tele/sys/getacdinfolist";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&acd="+acd;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 话务员列表
     * @param acd
     * @param cb
     * @param w
     */
    agentlist: function(acd, cb, w)
    {
        var cmd = "/tele/sys/getagentinfolist";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&acd="+acd;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 中继列表
     * @param cb
     * @param w
     */
    trunklist: function(cb, w)
    {
        var cmd = "/tele/sys/gettrunkinfolist";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 内线列表
     * @param cb
     * @param w
     */
    msilist: function(cb, w)
    {
        var cmd = "/tele/sys/getmsiinfolist";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 呼叫列表
     * @param cb
     * @param w
     */
    calllist: function(cb, w)
    {
        var cmd = "/tele/sys/getcallinfolist";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 流程列表
     * @param cb
     * @param w
     */
    flowlist: function(cb, w)
    {
        var cmd = "/tele/sys/getflowinfolist";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 外呼任务列表
     * @param cb
     * @param w
     */
    tasklist: function(cb, w)
    {
        var cmd = "/tele/sys/gettaskinfolist";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 注册列表
     * @param isall
     * @param cb
     * @param w
     */
    sipuserlist: function(isall, cb, w)
    {
        var cmd = "/tele/sys/getsipuserlist";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&all=" + isall;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 系统信息
     * @param cb
     * @param w
     */
    sysinfo: function(cb, w)
    {
        var cmd = "/tele/sys/getsysteminfo";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 运行状态
     * @param cb
     * @param w
     */
    runstatelist: function(cb, w)
    {
        var cmd = "/tele/sys/getrunstatelist";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },


    //--- Agent

    /**
     * 签入
     * @param aid
     * @param acd
     * @param skill
     * @param mon
     * @param silent
     * @param cb
     * @param w
     */
    login: function(aid, acd, skill, mon, silent, cb, w)
    {
        var cmd = "/tele/agent/login";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&aid="+aid
            +"&acd="+acd+"&skill="+skill+"&mon="+mon+"&silent="+silent;

        UMO._ajaxcall(cmd, args, function(cmd, result){
            if (result.errno == 0)
            {
                UMO._loginok = true;
            }
            if ((cb != null) && (cb != undefined))
            {
                cb(cmd, result);
            }
        }, w);
    },

    /**
     * 签出
     * @param aid
     * @param cb
     * @param w
     */
    logout: function(aid, cb, w)
    {
        var cmd = "/tele/agent/logout";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&aid="+aid;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, function(cmd, result){
                if (result.errno == 0)
                {
                    UMO._loginok = false;
                }
                if ((cb != null) && (cb != undefined))
                {
                    cb(cmd, result);
                }
            }, w);
        }
    },

    /**
     * 摘机（保留）
     * @param cb
     * @param w
     */
    offhook: function(cb, w)
    {
        var cmd = "/tele/agent/offhook";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 挂机
     * @param cb
     * @param w
     */
    onhook: function(cb, w)
    {
        var cmd = "/tele/agent/onhook";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 示忙
     * @param cb
     * @param w
     */
    setbusy: function(cb, w)
    {
        var cmd = "/tele/agent/setbusy";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 示闲
     * @param cb
     * @param w
     */
    setidle: function(cb, w)
    {
        var cmd = "/tele/agent/setidle";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 拨号
     * @param teleno
     * @param gid
     * @param uud
     * @param async
     * @param cb
     * @param w
     */
    dialout: function(teleno, gid, uud, async, cb, w)
    {
        var cmd = "/tele/agent/dialout";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&teleno="+teleno
               + "&gid="+gid + "&uud="+uud+"&async="+async;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 初始会议
     * @param teleno
     * @param uud
     * @param async
     * @param cb
     * @param w
     */
    initconf: function(teleno, uud, async, cb, w)
    {
        var cmd = "/tele/agent/initconf";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&teleno="+teleno
            +"&uud="+uud+"&async="+async;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 完成会议
     * @param cb
     * @param w
     */
    compconf: function(cb, w)
    {
        var cmd = "/tele/agent/compconf";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 初始转移
     * @param teleno
     * @param uud
     * @param async
     * @param cb
     * @param w
     */
    inittrans: function(teleno, uud, async, cb, w)
    {
        var cmd = "/tele/agent/inittrans";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&teleno="+teleno
            +"&uud="+uud+"&async="+async;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 完成转移
     * @param cb
     * @param w
     */
    comptrans: function(cb, w)
    {
        var cmd = "/tele/agent/comptrans";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 挂起（保持）
     * @param cb
     * @param w
     */
    hold: function(cb, w)
    {
        var cmd = "/tele/agent/hold";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 恢复
     * @param cb
     * @param w
     */
    retrieve: function(cb, w)
    {
        var cmd = "/tele/agent/retrieve";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 放音
     * @param filename
     * @param tts
     * @param async
     * @param loop
     * @param cb
     * @param w
     */
    play: function(filename, tts, async, loop, cb, w)
    {
        var cmd = "/tele/agent/play";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            +"&filename="+filename+"&tts="+tts+"&async="+async+"&loop="+loop;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 录音
     * @param filename
     * @param async
     * @param maxtime
     * @param termchar
     * @param append
     * @param cb
     * @param w
     */
    record: function(filename, async, maxtime, termchar, append, cb, w)
    {
        var cmd = "/tele/agent/record";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            +"&filename="+filename+"&async="+async+"&maxtime="+maxtime
            +"&termchar="+termchar+"&append="+append;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },


    /**
     * 收码
     * @param filename
     * @param tts
     * @param loop
     * @param maxdigits
     * @param termchars
     * @param timeout
     * @param cb
     * @param w
     */
    getdtmf: function(filename, tts, loop, maxdigits, termchars, timeout, cb, w)
    {
        var cmd = "/tele/agent/getdtmf";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            +"&filename="+filename+"&tts="+tts+"&loop="+loop
            +"&maxdigits="+maxdigits+"&timeout="+timeout;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 停止操作
     * @param taskid
     * @param type
     * @param cb
     * @param w
     */
    stopop: function(taskid, type, cb, w)
    {
        var cmd = "/tele/agent/stopop";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&taskid="+taskid+"&type="+type;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 设置UUD
     * @param uud
     * @param cb
     * @param w
     */
    setuud: function(uud, cb, w)
    {
        var cmd = "/tele/agent/setuud";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            +"&uud="+uud;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 获取当前呼叫的话单ID
     * @param cb
     * @param w
     */
    getcdrid: function(cb, w)
    {
        var cmd = "/tele/agent/getcdrid";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 获取当前呼叫的呼叫ID
     * @param cb
     * @param w
     */
    getcallid: function(cb, w)
    {
        var cmd = "/tele/agent/getcallid";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    //--- Moitor

    /**
     * 强插
     * @param destaid
     * @param mode
     * @param cb
     * @param w
     */
    interrupt: function(destaid, mode, cb, w)
    {
        var cmd = "/tele/monitor/interrupt";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&destaid="+destaid+"&mode="+mode;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 拦截
     * @param destaid
     * @param cb
     * @param w
     */
    intercept: function(destaid, cb, w)
    {
        var cmd = "/tele/monitor/intercept";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&destaid="+destaid;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 监听
     * @param destaid
     * @param mode
     * @param cb
     * @param w
     */
    listen: function(destaid, mode, cb, w)
    {
        var cmd = "/tele/monitor/listen";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&destaid="+destaid+"&mode="+mode;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 强拆
     * @param destaid
     * @param cb
     * @param w
     */
    forceonhook: function(destaid, cb, w)
    {
        var cmd = "/tele/monitor/forceonhook";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&destaid="+destaid;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },


    /**
     * 加入acd
     * @param destaid
     * @param acd
     * @param skill
     * @param cb
     * @param w
     */
    joinacd: function(destaid, acd, skill, cb, w)
    {
        var cmd = "/tele/monitor/joinacd";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&destaid="+destaid
            +"&acd="+acd+"&skill="+skill;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 离开acd
     * @param destaid
     * @param acd
     * @param cb
     * @param w
     */
    leaveacd: function(destaid, acd, cb, w)
    {
        var cmd = "/tele/monitor/leaveacd";
        var args = "dom="+UMO._dom+"&token="+UMO._token+"&destaid="+destaid+"&acd="+acd;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },



    //-------------------------------------- Storage ------------------------------------

    /**
     * 新建数据表
     * @param data
     * @param flds
     * @param keyfld
     * @param indices
     * @param cb
     * @param w
     */
    datanew: function(data, flds, keyfld, indices, cb, w)
    {
        var cmd = "/storage/data/new";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&data=" + data
            + "&flds=" + flds
            + "&keyfld=" + keyfld
            + "&indices=" + indices;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 删除数据表
     * @param data
     * @param cb
     * @param w
     */
    datadelete: function(data, cb, w)
    {
        var cmd = "/storage/data/delete";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&data=" + data;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 数据操作
     * @param data
     * @param realm
     * @param mode
     * @param flds
     * @param vals
     * @param where
     * @param group
     * @param order
     * @param size
     * @param idx
     * @param cb
     * @param w
     */
    dataoper: function(data, realm, mode, flds, vals, where, group, order, size, idx, cb, w)
    {
        var cmd = "/storage/data/oper";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&data=" + data + "&realm=" + realm + "&m=" + mode
            + "&f=" + encodeURIComponent(flds)
            + "&v=" + encodeURIComponent(vals)
            + "&w=" + encodeURIComponent(where)
            + "&g=" + group + "&o=" + order + "&s=" + size + "&i=" + idx ;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 新建备份
     * @param appname
     * @param cb
     * @param w
     */
    backupnew: function(appname, cb, w)
    {
        var cmd = "/storage/backup/new";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&appname=" + appname;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 还原备份
     * @param appname
     * @param backfile
     * @param cb
     * @param w
     */
    backuprestore: function(appname, backfile, cb, w)
    {
        var cmd = "/storage/backup/restore";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&appname=" + appname
            + "&backfile=" + backfile;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 备份列表
     * @param appname
     * @param cb
     * @param w
     */
    backuplist: function(appname, cb, w)
    {
        var cmd = "/storage/backup/list";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&appname=" + appname;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 删除备份
     * @param appname
     * @param backfile
     * @param cb
     * @param w
     */
    backupdelete: function(appname, backfile, cb, w)
    {
        var cmd = "/storage/backup/delete";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&appname=" + appname
            + "&backfile=" + backfile;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 新建存储过程
     * @param proc
     * @param parm
     * @param code
     * @param cb
     * @param w
     */
    procnew: function(proc, parm, code, cb, w)
    {
        var cmd = "/storage/proc/new";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&proc=" + proc
            + "&parm=" + encodeURIComponent(parm)
            + "&code=" + encodeURIComponent(code) ;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 删除存储过程
     * @param proc
     * @param cb
     * @param w
     */
    procdelete: function(proc, cb, w)
    {
        var cmd = "/storage/proc/delete";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&proc=" + proc;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 执行存储过程
     * @param realm
     * @param proc
     * @param parms
     * @param cb
     * @param w
     */
    procexec: function(realm, proc, parms, cb, w)
    {
        var cmd = "/storage/proc/exec";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&realm=" + realm
            + "&proc=" + proc
            + "&parms=" + encodeURIComponent(parms);

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 文件导入
     * @param file
     * @param data
     * @param flds
     * @param types
     * @param opt
     * @param badfile
     * @param cb
     * @param w
     */
    fileimport: function(file, data, flds, types, opt, badfile, cb, w)
    {
        var cmd = "/storage/file/import";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&file=" + file
            + "&data=" + data
            + "&flds=" + flds
            + "&types=" + types
            + "&option=" + opt
            + "&badfile=" + badfile;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 文件导出
     * @param file
     * @param data
     * @param flds
     * @param where
     * @param order
     * @param limit
     * @param opt
     * @param cb
     * @param w
     */
    fileexport: function(file, data, flds, where, order, limit, opt, cb, w)
    {
        var cmd = "/storage/file/export";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&file=" + file
            + "&data=" + data
            + "&flds=" + encodeURIComponent(flds)
            + "&where=" + encodeURIComponent(where)
            + "&order=" + order
            + "&limit=" + limit + "&option=" + opt;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },


    /**
     * 上传文件
     *
     * @param container 上传容器
     * @param scope
     * @param object
     * @param path
     * @param exts 文件名过滤器
     * @param dest 保存到服务器的文件名，为空使用原文件名
     * @param cb
     */
    fileupload: function(container, scope, object, path, exts, dest, cb, w)
    {
        $("#" + container).pluploadQueue({
            // General settings
            runtimes : 'html5,flash,silverlight,html4',
            url : UMO._apihost + '/storage/file/upload',

            height: "100%",

            // User can upload no more then 20 files in one go (sets multiple_queues to false)
            max_file_count: 20,

            chunk_size: '1mb',

            // Resize images on clientside if we can
            resize : {
                width : 200,
                height : 200,
                quality : 90,
                crop: true // crop to exact dimensions
            },

            filters : {
                // Maximum file size
                max_file_size : '1000mb',
                // Specify what files to browse for
                mime_types: [
                    {title : "Image files", extensions : "jpg,gif,png"},
                    {title : "Zip files", extensions : "zip"},
                    {title : "Xls files", extensions : "xls,xlsx"}
                ]
            },

            multipart_params: {
                dom: UMO._dom,
                token: UMO._token,
                scope: scope,
                object: object,
                path: path,
                exts: exts,
                dest: dest
            },

            // Rename files by clicking on their titles
            rename: true,

            // Sort files
            sortable: true,

            // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
            dragdrop: true,

            // Views to activate
            views: {
                list: true,
                thumbs: true, // Show thumbs
                active: 'thumbs'
            },

            // Flash settings
            flash_swf_url : 'lib/plupload/Moxie.swf',

            // Silverlight settings
            silverlight_xap_url : 'lib/plupload/Moxie.xap'
        }, cb);

        /*if (cb != null)
        {
            cb("/storage/file/upload", {errno:0, errmsg:""});
        }*/
    },

    /**
     * 文件下载
     * @param scope
     * @param object
     * @param path
     * @param file
     * @param cb
     * @param w
     */
    filedownload: function(scope, object, path, file, cb, w)
    {
        var cmd = "/storage/file/download";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&scope=" + scope + "&object=" + object
            + "&path=" + path + "&file=" + file;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 新增配置
     * @param scope
     * @param object
     * @param file
     * @param node
     * @param value
     * @param cb
     * @param w
     */
    confignew: function(scope, object, file, node, value, cb, w)
    {
        var cmd = "/storage/config/new";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&scope=" + scope + "&object=" + object + "&file=" + file
            + "&node=" + node + "&value=" + encodeURIComponent(value) ;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 添加配置
     * @param scope
     * @param object
     * @param file
     * @param node
     * @param value
     * @param cb
     * @param w
     */
	configadd:function(scope, object, file, node, value, cb, w)
    {
        var cmd = "/storage/config/add";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&scope=" + scope + "&object=" + object + "&file=" + file
            + "&node=" + node + "&value=" + encodeURIComponent(value) ;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 写入配置
     * @param scope
     * @param object
     * @param file
     * @param node
     * @param value
     * @param cb
     * @param w
     */
    configwrite: function(scope, object, file, node, value, cb, w)
    {
        var cmd = "/storage/config/write";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&scope=" + scope + "&object=" + object + "&file=" + file
            + "&node=" + node + "&value=" + encodeURIComponent(value) ;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 读取配置
     * @param scope
     * @param object
     * @param file
     * @param node
     * @param cb
     * @param w
     */
    configread: function(scope, object, file, node, cb, w)
    {
        var cmd = "/storage/config/read";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&scope=" + scope + "&object=" + object + "&file=" + file
            + "&node=" + node  ;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 删除配置
     * @param scope
     * @param object
     * @param file
     * @param node
     * @param cb
     * @param w
     */
    configdelete: function(scope, object, file, node, cb, w)
    {
        var cmd = "/storage/config/delete";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&scope=" + scope + "&object=" + object + "&file=" + file
            + "&node=" + node ;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 资源列表
     * @param scope
     * @param object
     * @param path
     * @param exts
     * @param cb
     * @param w
     */
    resourcelist: function (scope, object, path, exts, cb, w)
    {
        var cmd = "/storage/resource/list";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&scope=" + scope + "&object=" + object + "&path=" + path
            + "&exts=" + exts ;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },


    //FullTest
    //-------------------------------------- Application ------------------------------------
    /**
     * 应用下载
     * @param appname
     * @param version
     * @param cb
     * @param w
     */
    appdownload: function(appname, version, cb, w)
    {
        var cmd = "/app/download";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&appname=" + appname + "&version=" + version;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 应用安装
     * @param appname
     * @param options
     * @param cb
     * @param w
     */
    appinstall: function(appname, options, cb, w)
    {
        var cmd = "/app/install";
        var args = "dom="+UMO._dom+"&token="+UMO._token
            + "&appname=" + appname + "&options=" + options;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 安装确认
     * @param appname
     * @param action
     * @param options
     * @param cb
     */
    appconfirm: function (appname, action, options, cb, w)
    {
        var cmd = "/app/confirm";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&appname=" + appname
            + "&action=" + action + "&options=" + options;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 应用状态
     * @param appname
     * @param cb
     * @param w
     */
    appstate: function(appname, cb, w)
    {
        var cmd = "/app/state";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&appname=" + appname;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 应用卸载
     * @param appname
     * @param dataclean
     * @param options
     * @param cb
     */
    appuninstall: function(appname, dataclean, options, cb, w)
    {
        var cmd = "/app/uninstall";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&appname=" + appname
            + "&dataclean=" + dataclean + "&options=" + options;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 已装应用
     * @param type
     * @param cb
     */
    appinstalled: function(type, cb, w)
    {
        var cmd = "/app/appinstalled";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&type=" + type;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 已装组件
     * @param cb
     */
    widgetinstalled: function(cb, w)
    {
        var cmd = "/app/widgetinstalled";
        var args = "dom="+UMO._dom+"&token="+UMO._token;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    //-------------------------------------- Enterprise ------------------------------------

    /**
     * 部门列表
     * @param parentid
     * @param cb
     * @param w
     */
    entdeptlist: function(parentid, cb, w)
    {
        var cmd = "/ent/deptlist";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&parentid=" + parentid;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 部门信息
     * @param deptid
     * @param cb
     * @param w
     */
    entdeptinfo: function(deptid, cb, w)
    {
        var cmd = "/ent/deptinfo";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&deptid=" + deptid;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 员工列表
     * @param deptid
     * @param cb
     * @param w
     */
    entuserlist: function(deptid, cb, w)
    {
        var cmd = "/ent/userlist";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&deptid=" + deptid;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    /**
     * 员工信息
     * @param userid
     * @param cb
     * @param w
     */
    entuserinfo: function(userid, cb, w)
    {
        var cmd = "/ent/userinfo";
        var args = "dom="+UMO._dom+"&token="+UMO._token + "&userid=" + userid;

        if (UMO._tokenvalid(cmd, cb))
        {
            UMO._ajaxcall(cmd, args, cb, w);
        }
    },

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //------------------------------ 以下为内部使用函数 -------------------------------------------

    //push加入
    _initpush: function()
    {
        UMO._lastInitTime = new Date().getTime();

        PLR.pullURL = UMO._apihost + '/puller.srv';
        PLR.joinListen(UMO._evtname);
    },


    //定时请求
    _pinging: function()
    {
        UMO.ping(function(cmd, result){
            if (result.errno == 0)
            {
                setTimeout("UMO._pinging();", 60000);
            }
        });
    },

    //检测令牌
    _tokenvalid: function(cmd, cb)
    {
        if (UMO._token == "")
        {
            if (cb != null)
            {
                var result = {errno:UMO.ERR_BADTOKEN, errmsg:UMO.MSG_NOTLOGIN};
                cb(cmd, result);
            }
            return false;
        }
        return true;
    },

    //网络调用
    _ajaxcall: function(cmd, args, cb, w)
    {
        var params = args;
        if (w != undefined) {
            try {
                var loc = w.location.href;
                params += "&refer=" + encodeURIComponent(loc);
            }
            catch(e)
            {}
        }
        $.ajax({
            url: UMO._apihost + cmd,
            type: "POST",
            data: params,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            error: function(xhr, ajaxOptions)
            {
                if (cb != null)
                {
                    var result = {errno:UMO.ERR_AJAXERR, errmsg:UMO.MSG_AJAXERR};
                    cb(cmd, result);
                }
            },
            success: function(result)
            {
                if (cb != null)
                {
                    cb(cmd, result);
                }
            }
        });
    },

    _addEvent: function (obj, evType, callback, useCapture) {
        if (obj.addEventListener) {
            obj.addEventListener(evType, callback, useCapture);
            return true;
        } else if (obj.attachEvent) {
            return obj.attachEvent('on' + evType, callback);
        } else {
            obj['on' + evType] = callback;
        }
    },

    //错误消息常量
    ERR_AJAXERR: -1,
    ERR_BADTOKEN: -2,

    MSG_AJAXERR: "网络错误",
    MSG_NOTLOGIN: "无效令牌",
    MSG_NONE: "无"
};


// 事件拉取Puller对象
var PLR = {

    pullURL: null,
    lastInitTime: "",

    joinListen: function(aSubject)
    {
        var subject = aSubject;

        $.ajax({
            url: PLR.pullURL,
            type: "POST",
            data: "dom="+UMO._dom + "&token="+UMO._token,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            error: function(xhr, ajaxOptions)
            {
                if (UMO._running == true)
                {
                    window.onError(null);
                }
            },
            success: function(result)
            {
                if (result.errno == 0)
                {
                    for (var i=0; i<result.evts.length; i++)
                    {
                        var evt = result.evts[i];

                        var event = new PullerEvent();
                        for (var p in evt)
                        {
                            event.put(p, evt[p]);
                        }
                        window.onData(event);
                    }
                }

                if ((UMO._running == true) && (result.errno != 100))
                {
                    //如果运行中并且不是无效令牌，则继续
                    setTimeout("PLR.joinListen('" + subject + "');", 50);
                }
            }
        });
    }
}

// 拉取事件对象
function PullerEvent() {
    // Member variable setup; the assoc array stores the N/V pairs
    this.arr = [];

    this.put = function(name, value) {
        return this.arr[name] = value;
    };

    this.get = function(name) {
        return this.arr[name];
    };
}


//---- Window对象全局Pushlet回调函数

//错误 windows.OnError
function onError(event)
{
    //toast("消息推送错误, uid=" + PLR.userId + ", 重试...")

    var dt = new Date();
    var diff = dt.getTime() - UMO._lastInitTime;
    if (diff > 60000)  //60秒以上，复位重试延迟
    {
        UMO._retrydelay = 1000;
    }

    //稍后重试（时间逐步延长）
    setTimeout("UMO._initpush();", UMO._retrydelay);
    UMO._retrydelay = UMO._retrydelay * 2;
}


//Pushlet事件回调处理
function onData(event)
{
    var evttype = event.get("evttype");
    switch(evttype)
    {
        case "readystate":
            if (UMO._evthandler.onReadyState != null)
            {
                var status = event.get("status");
                UMO._evthandler.onReadyState(status);
            }
            break;

        case "callincome":
            if (UMO._evthandler.onCallincome != null)
            {
                var ano = event.get("ano");
                var bno = event.get("bno");
                var uud = event.get("uud");
                UMO._evthandler.onCallincome(ano, bno, uud, callid);
            }
            break;

        case "talked":
            if (UMO._evthandler.onTalked != null)
            {
                var ano = event.get("ano");
                var bno = event.get("bno");
                var uud = event.get("uud");
                UMO._evthandler.onTalked(ano, bno, uud);
            }
            break;

        case "ringstop":
            if (UMO._evthandler.onRingStoped != null)
            {
                UMO._evthandler.onRingStoped();
            }
            break;

        case "hookchanged":
            if (UMO._evthandler.onHookChanged != null)
            {
                var status = event.get("status");
                UMO._evthandler.onHookChanged(status);
            }
            break;

        case "agentchanged":
            if (UMO._evthandler.onAgentChanged != null)
            {
                var status = event.get("status");
                UMO._evthandler.onAgentChanged(status);
            }
            break;

        case "asyncfinished":
            if (UMO._evthandler.onAsyncFinished != null)
            {
                var atype = event.get("atype");
                var taskid = event.get("taskid");
                var ret = event.get("ret");
                var desc = event.get("desc");
                UMO._evthandler.onAsyncFinished(atype, taskid, ret, desc);
            }
            break;

        case "allbusy":
            if (UMO._evthandler.onAllBusy != null)
            {
                var status = event.get("status");
                var acd = event.get("acd");
                var quelen = event.get("quelen");
                UMO._evthandler.onAllBusy(status, acd, quelen);
            }
            break;

        case "quelen":
            if (UMO._evthandler.onQuelen != null)
            {
                var acd = event.get("acd");
                var quelen = event.get("quelen");
                UMO._evthandler.onQuelen(acd, quelen);
            }
            break;

        case "smsincome":
            if (UMO._evthandler.onSmsincome != null)
            {
                var dtime = event.get("dtime");
                var from = event.get("from");
                var content = event.get("content");
                var slot = event.get("slot");
                UMO._evthandler.onSmsincome(dtime, from, content, slot);
            }
            break;

        case "opercallback":
            if (UMO._evthandler.onOperCallback != null)
            {
                var flowid = event.get("flowid");
                var callid = event.get("callid");
                var direction = event.get("direction");
                var teleno = event.get("teleno");
                var time = event.get("time");
                var state = event.get("state");
                UMO._evthandler.onOperCallback(flowid, callid, direction, teleno, time, state);
            }
            break;

        case "speedcallback":
            if (UMO._evthandler.onSpeedCallback != null)
            {
                var flowid = event.get("flowid");
                var callid = event.get("callid");
                var direction = event.get("direction");
                var teleno = event.get("teleno");
                var time = event.get("time");
                var state = event.get("state");
                var desc = event.get("desc");
                UMO._evthandler.onSpeedCallback(flowid, callid, direction, teleno, time, state, desc );
            }
            break;
    }
};


