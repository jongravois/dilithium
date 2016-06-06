;(function(window) {

    function initFooter() {
        var footerBlocks = $('.page-footer_nav-left');
        
        if (footerBlocks.size()) {
            
            footerBlocks.masonry({
                itemSelector: '.page-footer_nav-list',
                percentPosition: true
            });

            footerBlocks.on('layoutComplete', function() {

                if (window.pageReadyComponents) {
                    pageReadyComponents.add('footer');
                }
            });
        }

        if (typeof window.initLangSelector === 'function') {

            if (window.pageReadyComponents) {

                if (!pageReadyComponents.langSelector) {
                    window.initLangSelector();
                    pageReadyComponents.add('langSelector');
                }

            } else {

                window.initLangSelector();
            }
        }
    }
    window.initFooter = initFooter;

})(window);