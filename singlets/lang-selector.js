;(function(window) {

    function initLangSelector(){
        var langSelectorWrapper = $('.lang-selector_wrapper'),
            langSelectorList = $('.lang-selector_list'),
            langSelectorTrigger = $('.lang-selector_trigger'),
            langSelectorItem = $('.lang-selector_item');

        function setLang(value, text) {
            langSelectorTrigger.text(text);
            langSelectorItem.removeAttr('data-selected').filter('[data-value="' + value + '"]').attr('data-selected', '');
        }

        langSelectorTrigger.on('click', function(e){
            e.stopPropagation();
            langSelectorWrapper.toggleClass('opened');
        });
        langSelectorItem.on('click', function(){
            setLang($(this).data('value'), $(this).text());
            langSelectorWrapper.removeClass('opened');
        });

        $('.header, .main, .page-footer').on('click', function(){
            langSelectorWrapper.removeClass('opened');
        });
    }

    window.initLangSelector = initLangSelector;

})(window);