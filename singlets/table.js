(function(window) {
    var tableOptions = {
        activeTab: 1,
        tabSelector: '.table_mobile_tabs',
        tableSelector: '.table_main_container'
    }

    function switchTab(index, id){
        tableOptions.activeTab = index;
        $('.table_mobile_tabs[data-table='+id+'] a').removeClass('active')
        $('.table_mobile_tabs[data-table='+id+'] li:eq('+index+') a').addClass('active')
        
        if(typeof id != 'undefined'){id = '#'+id}else{id = ''}1
        $(id+tableOptions.tableSelector+' .table_inner>tbody>tr>td').removeClass('active')
        $(id+tableOptions.tableSelector+' .table_inner>tbody>tr>td:nth-child('+(index+2)+')').addClass('active')
        $(id+tableOptions.tableSelector+' .table_inner>tbody>tr>td .icon').removeClass('active')
        $(id+tableOptions.tableSelector+' .table_inner>tbody>tr>td .icon:nth-child('+(index+1)+') ').addClass('active')
        defineHiddenBlocks(index,id)
    }
    function defineHiddenBlocks(index,id){
        var add='';

        if(typeof id == 'undefined'){id = ''}

        if(typeof index !== 'undefined'){add = ':nth-child('+(index+2)+')';}
        $(id+tableOptions.tableSelector+' .table_inner>tbody>tr>td'+add).each(function(){
            
            if($(this).text() == '' && $(this).find(".icon_").length>0 ){
                $(this).closest('tr').addClass('mobile-empty')
            }else{
                $(this).closest('tr').removeClass('mobile-empty')
            }
        })
    }
    function bindTooltips() {
        $('.table_inner>tbody>tr>td:first-child').mouseenter(function(e){
            e.stopPropagation();
            $(this).find('.description').fadeIn(100)
            var el = $(this);
            // if(window.innerWidth<600 && $('.responsive-tbl').length>0 ){
            //     $('html, body').animate({
            //         scrollTop: $(el).find('.description').offset().top
            //     }, 1000);
            // }
        }).mouseleave(function(e){
            e.stopPropagation();
            $(this).find('.description').fadeOut(0)
        })
        $('.description').click(function(){$(this).fadeOut(0)})
    }
    function bindTabs() {
        $(document).on( 'click','.table_mobile_tabs a', function(e){
            switchTab($(this).parent().index(), $(this).parent().parent().attr('data-table'))
            e.preventDefault();
            return false;
        })
        defineHiddenBlocks(0);
        switchTab(0);
    }
    function initTable() {
        bindTabs();
        bindTooltips();
    }

    window.initTable = initTable;
})(window);
$(document).ready(function(){
    initTable();
})
