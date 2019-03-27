	/***********************通用JS文件***********************/	
	//获取对象值HTML
	function $ge(obj){
		return document.getElementById(obj).value;
	}
	
	//设置对象值HTML
	function $se(obj,val){
		document.getElementById(obj).value=val;
	}
	
	//获取对象HTML
	function $geo(obj){
		return document.getElementById(obj);
	}
	
	//数据验证
	//1.数字验证
	function valid_number(v_number,v_type){
		//数字验证
		var number_00=/^[0-9]+$/;//验证非负整数（正整数 + 0)
		var number_02=/^[0-9]+$/;//验证非负整数（正整数 + 0)
		var number_03=/^((-[0-9]+)|(0+))$/;//验证非正整数（负整数 + 0）
		var number_04=/^((-[0-9]+)|([0-9]+))$/;//验证实数(带符号)
		var number_05=/^([0-9]+)(.[0-9]+)?$/;//验证有多位小数的正实数
		var number_06=/^(-[0-9]+)(.[0-9]+)?$/;//验证有多位小数的负实数
		var number_07=/^((-[0-9]+)|([0-9]+))(.[0-9]+)?$/;//验证有多位小数的实数(带符号)
		
		if(v_type==0){
			return number_00.test(v_number);
		}else if(v_type==2){
			return number_02.test(v_number);
		}else if(v_type==3){
			return number_03.test(v_number);
		}else if(v_type==4){
			return number_04.test(v_number);
		}else if(v_type==5){
			return number_05.test(v_number);
		}else if(v_type==6){
			return number_06.test(v_number);
		}else if(v_type==7){
			return number_07.test(v_number);
		}else{
			return false;
		}
	}
	
	//2.验证Email地址
	function valid_email(v_email){
		var email_00=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
		return email_00.test(v_email);
	}
	
	//3.验证身份证号
	function valid_idcard(v_idcard){
		var idcard_00=/^\d{15}|\d{18}$/;
		return idcard_00.test(v_idcard);
	}
	
	//4.验证手机号码
	function valid_tel(v_tel){
		var tel_00=/^(0)?1[3-9][0-9]{9}$/;
		return tel_00.test(v_tel);
	}
	
	//5.验证座机号码
	function valid_phone(v_phone){
		var phone_00=/^(([0\+]\d{2,3})?(0\d{2,3}))?(\d{7,8})$/; 
		return phone_00.test(v_phone);
	}
	
	//6.邮政编码
	function valid_post(v_post){
		var post_00=/\d{6}/;
		return post_00.test(v_post);
	}
	
	//7.日期验证(年月日)
	function valid_date(v_date){		
		var reg=/^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/;
		return reg.test(v_date); 
	}
	
	//IP地址验证：0.0.0.0-255.255.255.255
	function valid_IPAdress(v_ipadress){
		var post_00=/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
		return post_00.test(v_ipadress);
	}
	
	//验证日期和时间
	function valid_datetime(v_datetime){
		var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29)) (([0-1]{1}[0-9]{1}:[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1})|(2[0-3]{1}:[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}))$/;   
	    return reg.test(v_datetime);
	}
	
	//验证时间(时分)
	function valid_hm(v_hm){
		var reg = /[0-9]{2}:[0-9]{2}/;   
	    return reg.test(v_hm);
	}
	
	//获取当前日期
	function getCurDate(){
		var d = new Date();
    	yy = d.getUTCFullYear();
    	mm = ("00"+(d.getUTCMonth()+1)).slice(-2);
    	dd = ("00"+d.getUTCDate()).slice(-2);
    	var str=yy+'-'+mm+'-'+dd;
		return str;
	}
	
	//获取当前时间
	function getNowFormatDate() {
	    var date = new Date();
	    var seperator1 = "-";
	    var seperator2 = ":";
	    var month = date.getMonth() + 1;
	    var strDate = date.getDate();
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    var hours=date.getHours();
	    if (hours >= 0 && hours <= 9) {
	    	hours = "0" + hours;
	    }
	    var mins=date.getMinutes();
	    if (mins >= 0 && mins <= 9) {
	    	mins = "0" + mins;
	    }
	    var secs=date.getMinutes();
	    if (secs >= 0 && secs <= 9) {
	    	secs = "0" + secs;
	    }
	    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	            + " " + hours + seperator2 + mins  + seperator2 + secs;
	    return currentdate;
	} 
	
	//当前日期加减
	function curDateProc(prenext,day){   
		var   dd, mm, yy;   
	    var   reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
	    
    	var d = new Date();
    	yy = d.getUTCFullYear();
    	mm = ("00"+(d.getUTCMonth())).slice(-2);
    	dd = ("00"+d.getUTCDate()).slice(-2);
	  	
	 	if (prenext == null || (prenext != 'pre' && prenext != 'next')) {
	    	prenext = 'pre';
	  	}
	  	var s, d, t, t2;
	    t = Date.UTC(yy, mm, dd);
	    t2 = day * 1000 * 3600 * 24; //加减N天的时间
	    if (prenext == 'pre') {
	        t-= t2;
	    } else {
	        t+= t2;
	    }
	    d = new Date(t);
	
	    s = d.getUTCFullYear() + "-";
	    s += ("00"+(d.getUTCMonth()+1)).slice(-2) + "-";
	    s += ("00"+d.getUTCDate()).slice(-2);
	    
	    return s;
	}   
	
	//计算两个日期相差的天数
	function dateToDay(begdate,enddate){
		begdate=begdate.replace(/-/g,"/"); 
  		enddate=enddate.replace(/-/g,"/"); 
		var date1 = Date.parse(begdate); 
  		var date2 = Date.parse(enddate); 
  		
  		return Math.ceil((date2-date1)/(24*60*60*1000));
	}
	
	//指定日期加减天数 dd:指定日期  dadd:天数
	function getDateToDay(dd,dadd){
		var a = new Date(dd);
		a = a.valueOf();
		a = a + dadd * 24 * 60 * 60 * 1000;
		a = new Date(a);
		yy=a.getFullYear();
		mm=a.getMonth()+1;
		dd=a.getDate();
		if(mm<=9){
			mm="0"+mm;
		}
		if(dd<=9){
			dd="0"+dd;
		}
		return  yy+"-"+mm+"-"+dd;
	}

	//数据转换(全半角转换)
	function data_utils(s_data){
		s_data=String(s_data).replace(new RegExp(",","gm"),"，").replace(new RegExp("{","gm"),"｛").replace(new RegExp("}","gm"),"｝").replace(new RegExp("\"","gm"),"“").replace(new RegExp("'","gm"),"‘").replace(new RegExp(":","gm"),"：");
		s_data=s_data.replace(/\\/g,"/");
		s_data=replaceAll(s_data,"$","＄");
		return s_data;
	}
	
	//计算字符长度(汉字/英文)
	function strlen(str){
	    var len = 0;
	    for (var i=0; i<str.length; i++) {
	     var c = str.charCodeAt(i);
	    //单字节加1
	     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
	       len++;
	     }
	     else {
	      len+=2;
	     }
	    }
	    return len;
	}
	
	//汉字及英文件截取
	function cut_str(str, len){
        var char_length = 0;
        for (var i = 0; i < str.length; i++){
            var son_str = str.charAt(i);
            encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
            if (char_length >= len){
                var sub_len = char_length == len ? i+1 : i;
                return str.substr(0, sub_len);
                break;
            }
        }
    }
	
	//把秒转成时：分：秒
	function formatSecToHms(totalSeconds) {  
    	if (totalSeconds < 86400) {  
        	var dt = new Date("01/01/2000 0:00");  
        	dt.setSeconds(totalSeconds);  
        	var h = dt.getHours(),  
        	m = dt.getMinutes(),  
        	s = dt.getSeconds(),  
        	r = "";  
    		r += (h > 9 ? h.toString() : "0" + h.toString()) + ":";   
    		r += (m > 9 ? m.toString() : "0" + m.toString()) + ":"  
    		r += (s > 9 ? s.toString() : "0" + s.toString());  
    		return r; 
    	} else {  
        	return "00:00:00";  
    	}  
	} 	
	
	//参数一为被替换的字符串 参数二为被匹配的字符串 参数三为替换后的字符串
	function replaceAll(str, sptr, sptr1){
		while (str.indexOf(sptr) >= 0)
		{
			str = str.replace(sptr, sptr1);
		}
		return str;
	}
    
    //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
    function forbidBackSpace(e) {
        var ev = e || window.event; //获取event对象 
        var obj = ev.target || ev.srcElement; //获取事件源 
        var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
        //获取作为判断条件的事件类型 
        var vReadOnly = obj.readOnly;
        var vDisabled = obj.disabled;
        //处理undefined值情况 
        vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
        vDisabled = (vDisabled == undefined) ? true : vDisabled;
        //当敲Backspace键时，事件源类型为密码或单行、多行文本的， 
        //并且readOnly属性为true或disabled属性为true的，则退格键失效 
        var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效 
        var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
        //判断 
        if (flag2 || flag1) return false;
    }
    //禁止后退键 作用于Firefox、Opera
    document.onkeypress = forbidBackSpace;
    //禁止后退键  作用于IE、Chrome
    document.onkeydown = forbidBackSpace;  
    
      
     