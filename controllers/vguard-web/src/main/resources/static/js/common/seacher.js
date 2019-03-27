function initSeachInput(){
	//初始化搜索框
	$('.checkBoxContent').on('click',function(){
	    $(this).toggleClass('active');
	    var $id = $(this).data('id');
	    var $input = $(this).find('input');
	    var left = $input.offset().left;
	    var top = $input.offset().top;
	    var width = $input.css('width');
	    $('.checkBoxOption'+$id).toggle().css({
	        left:left,
	        top:top+32,
	        width:width
	    });
	});
	$('.checkBoxOption').on('click','li',function(){
	    var $value = $(this).html();
	    var $id = $(this).parent('ul').data('id');
	    $(this).parent('.checkBoxOption').hide();
	    $('.checkBoxContent'+$id).removeClass('active');
	    /* $('.checkBoxContent'+$id).find('input').attr('value',$value); */
	    $('.checkBoxContent'+$id).find('input').val($value);
	    return false;
	});
	$('.checkBoxOption').on('mouseleave',function(){
	    $(this).hide();
	    return false;
	});
    $('.allKinds').on('click','li',function(){
        $('.allKinds li').removeClass('active');
        $(this).addClass('active');
    })
    $('#flexDiv').on('click',function(){
        var $state = $('#flexBtn').data('state');
        if($state == '0'){
            $('.searchBox').css({
                height:'auto'
            })
            $('#flexBtn').data('state','1').html('收缩');
            $('#reditImg').css({
                transform: 'rotateZ(180deg)'
            });
        }
        else{
            $('.searchBox').css({
                height:'47'
            })
            $('#flexBtn').data('state','0').html('展开')
            $('#reditImg').css({
                transform: 'rotateZ(0deg)'
            });
        }
//      刷新grid
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96);
    })
}
/**
 * @param startTime 开始时间
 * @param endTime   截止时间
 */
function initDateSeach(startTime,endTime){
	// 日期插件
    $('#daterange-btn').daterangepicker({
    	ranges: {
            '最近7天': [moment().subtract(6,'days'), moment()],
            '最近30天': [moment().subtract(29,'days'), moment()],
            '最近60天': [moment().subtract(60,'days'), moment()]
        }, 
    	 locale: {
             format: 'YYYY/MM/DD',
             applyLabel: "确认",
             cancelLabel: "取消",
             fromLabel: "开始时间",
             toLabel: "结束时间",
             weekLabel: '周',
             customRangeLabel : '自定义时间',
             daysOfWeek:["日","一","二","三","四","五","六"],
             monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
         },
        startDate: moment(),
        endDate: moment(),
        maxDate: new Date(),
        firstDay: 1
    	},
    	function (start, end, label) {
    		$("#"+startTime).val(start.format('YYYY-MM-DD'));
    		$("#"+endTime).val(end.format('YYYY-MM-DD'));
			$('#daterange-btn span').html(start.format('YYYY/MM/DD') + '-' + end.format('YYYY/MM/DD'));
     	}
    );
}