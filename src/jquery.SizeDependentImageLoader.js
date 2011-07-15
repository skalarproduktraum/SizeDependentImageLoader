(function($) {
   $.SizeDependentImageLoader = function(element, options) {
        this.options = {};
   
        this.init = function(element, options) {
            this.options = $.extend({}, $.SizeDependentImageLoader.defaultOptions, options);
            // sort the sizes array in numerical order
            this.options.maximalVerticalSizes = 
                this.options.maximalVerticalSizes.sort(function(a, b){return a-b});

            if(this.options.findImageOnInit) {
                windowSizeUpdated($(this), this.options);
            }

            $(window).bind('resize.SizeDependentImageLoader', {elem: $(this), options: this.options},
                function(event) { windowSizeUpdated(event.data.elem, event.data.options); }
            );

            /*return this.each(function() {
                 var $this = $(this),
                   data = $this.data('SizeDependentImageLoader'),
                    currentWindowWidth = $(window).width(),
                    currentImageWidth = 0
                 });
         
                // If the plugin hasn't been initialized yet
                if ( ! data ) {
                    $(this).data('SizeDependentImageLoader', {
                        currentWindowWidth : $(window).width(),
                        currentImageWidth : 0
                    });
                }
            });*/
            
        
        };

        this.destroy = function() {
            /*return this.each(function(){
                $(window).unbind('.SizeDependentImageLoader');

                var $this = $(this),
                    data = $this.data('SizeDependentImageLoader');

                // Namespacing FTW
                $(window).unbind('.SizeDependentImageLoader');
                data.tooltip.remove();
                $this.removeData('SizeDependentImageLoader');
            });*/ 
        };

        this.init(element, options);
    };

$.fn.SizeDependentImageLoader = function(options) {
    return this.each(function() {
        (new $.SizeDependentImageLoader($(this), options));
    });
};

$.SizeDependentImageLoader.defaultOptions = {
            'imageName' : '',
            'imageExtension' : 'jpg',
            'imageBaseURL' : '',
            'maximalVerticalSizes' : [1024, 1400, 1920],
            'cssProperty' : 'background-image',
            'findImageOnInit' : true
};

function windowSizeUpdated(element, options) {
            // find best fitting window width
            // set cssProperty of bindToClass or bindToElement to
            // the best-fitting image
            sizes = options.maximalVerticalSizes;
            var i = 0;
            for(i = 0; i < sizes.length; i++) {
               // we have found an image exceeding the viewport width
               if(sizes[i] > $(window).width() &&
                  sizes[i-1] < $(window).width() ) {
                   console.log("Found fitting size: " + sizes[i]);
                   element.css(options.cssProperty, "url(" + options.imageBaseURL + "/" + options.imageName + "_" + sizes[i] + "." + options.imageExtension + ")");
                   return;
               }
            }
            if(sizes[0] > $(window).width()) {
                i = 0;
            } if (sizes[sizes.length-1] < $(window).width()) {
                i = sizes.length-1;
            }
            console.log("Found fitting size: " + sizes[i]);
            element.css(options.cssProperty, "url(" + options.imageBaseURL + "/" + options.imageName + "_" + sizes[i] + "." + options.imageExtension + ")");
        };


})( jQuery );

