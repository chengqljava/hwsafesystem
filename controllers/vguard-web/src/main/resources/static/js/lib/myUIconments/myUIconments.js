$(function(){
    $('body').on('click','.options li',function(){
        var $parent = $(this).parent('.options').parent('.btn-pulldown');
        $parent.removeClass('open');
    });
    $('body').on('mouseenter','.btn-pulldown',function(){
        $(this).addClass('open');
    });
    $('body').on('mouseleave','.btn-pulldown',function(){
        $(this).removeClass('open');
    });
    $('body').on('input','.input-group-canClear input',function(){
        console.log($(this).val());
        if($(this).val() != ''){
            $(this).next().show();
        }
        else{
            $(this).next().hide();
        }
    });
    $('body').on('click','.input-group-canClear .input-clear',function(){
        $(this).prev().val('');
        $(this).hide();
    });

    $('body').on('click','.radio-btn-select ul li',function(){
        if($(this).hasClass('active')){
            return false;
        };
        $(this).parent('ul').find('li').removeClass('active');
        $(this).addClass('active');
    });
    // 数字输入框右侧按钮click事件
    $('body').on('click','.input-group-icon .handler .anticon',function(){
        var $input = $(this).parent().parent().find('input');
        var $val = $input.val();
        if($(this).hasClass('numAdd')){
            $val ++;
        }
        else{
            $val --;
        }
        $input.val($val);
    });
    // 数字输入框右侧按钮鼠标放下数字加减事件
    var index;
    $('body').on('mousedown','.input-group-icon .handler .anticon',function(){
        var $input = $(this).parent().parent().find('input');
        var $val = $input.val();
        var isAdd = $(this).hasClass('numAdd');
        index = setInterval(function(){
            if(isAdd){
                $val ++;
            }
            else{
                $val --;
            }
            $input.val($val);
        },300);
    });
    // 鼠标抬起时清除数字加减操作
    $('body').on('mouseup',function(){
        clearInterval(index);
    });
    // 文本域自适应高度
    $('textarea.autoHeight').autoTextarea();
    //时间选择器
    laydate.render({
        elem: '#timepicker'
        ,type: 'time'
    });
    $('body').on('click','.card-tabs li',function(){
        $(this).parent().find('li').removeClass('active');
        $(this).addClass('active');
    });
    $('body').on('click','.zdmb .zdmb-head',function(){
        $(this).toggleClass('right');
    });
    $('body').on('click','.sfq .zdmb-head',function(){
        if($(this).hasClass('right')){
            $(this).removeClass('right');
        }
        else{
            $('.sfq .zdmb-head').removeClass('right');
            $(this).addClass('right');
        };
    });
});
$.fn.autoTextarea = function (options) {
    var defaults = {
        maxHeight: null, // 文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度  
        minHeight: $(this).height() // 默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示  
    };
    var opts = $.extend({}, defaults, options);

    return $(this).each(function () {
        $(this).bind('paste cut keydown keyup focus blur', function () {
            var height = 0;
            var style = this.style;

            this.style.height = opts.minHeight + 'px';
            if (this.scrollHeight > opts.minHeight) {
                if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                    height = opts.maxHeight - 10;
                    style.overflowY = 'scroll';
                } else {
                    height = this.scrollHeight - 10;
                    style.overflowY = 'hidden';
                }
                style.height = height + 'px';
            }
        });
    });
};