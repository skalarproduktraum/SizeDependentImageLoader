(function($) {
   $.SizeDependentImageLoader = function(element, options) {
        this.options = {};
   
        this.init = function(element, options) {
            this.options = $.extend({}, $.SizeDependentImageLoader.defaultOptions, options);
            // sort the sizes array in numerical order
            this.options.maximumHorizontalSizes = 
                this.options.maximumHorizontalSizes.sort(function(a, b){return a-b});

            if(this.options.findImageOnInit) {
                windowSizeUpdated(element, this.options);
            }

            $(window).bind('resize.SizeDependentImageLoader', {elem: element, options: this.options},
                function(event) { windowSizeUpdated(event.data.elem, event.data.options); }
            );

            return element;
        };

        this.destroy = function() {
            return this.each(function(){
                $(window).unbind('.SizeDependentImageLoader');
            }); 
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
            'imageVerticalSizes:': [768, 900, 1200],
            'maximumHorizontalSizes' : [1024, 1400, 1920],
            'cssProperty' : 'background-image',
            'findImageOnInit' : true,
            'repositionBackground': true,
            'backgroundPosition': 'center'
};

function windowSizeUpdated(element, options) {
            // find best fitting window width
            // set cssProperty of bindToClass or bindToElement to
            // the best-fitting image
            sizes = options.maximumHorizontalSizes;
            verticalSizes = options.imageVerticalSizes;
            windowWidth = $(window).width();
            windowHeight = $(window).height();

            var i = 0;
            var found = false;

            for(i = 0; i < sizes.length; i++) {
               // we have found an image exceeding the viewport width
               if(sizes[i] >= windowWidth && sizes[i-1] <= windowWidth 
                  || verticalSizes[i] >= windowHeight && verticalSizes[i-1] <= windowHeight) {
                   found = true;
                   break;
               }
            }
            if(sizes[0] >= windowWidth) {
                i = 0;
            } if (!found && sizes[sizes.length-1] < windowWidth) {
                i = sizes.length-1;
            }

            element.css(options.cssProperty, "url(" + options.imageBaseURL + "/" + options.imageName + "_" + sizes[i] + "." + options.imageExtension + ")");

            if(options.repositionBackground) {
                if(options.backgroundPosition == "center") {
                    position_x = -Math.abs(sizes[i] - windowWidth)/2;
                    position_y = -Math.abs(verticalSizes[i] - windowHeight)/2;
                    element.css("background-position", position_x + "px " + position_y + "px"); 
                }
            }
};


})( jQuery );

