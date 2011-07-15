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

            $(window).resize(function() {
                if(this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function() {
                    $(this).trigger('resizeEnd');
                }, 250);
            });
            

            $(window).bind('resizeEnd.SizeDependentImageLoader', {elem: element, options: this.options},
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
            'mode': "css",
            'findImageOnInit' : true,
            'reposition': true,
            'repositioningRule': positionInCenterOfWindow
};

function positionInCenterOfWindow(windowWidth, windowHeight, imageWidth, imageHeight) {
    x = -(imageWidth - windowWidth)/2;
    y = -(imageHeight - windowHeight)/2;

    return [x, y];
}

function windowSizeUpdated(element, options) {
            // find best fitting window width
            // set cssProperty of bindToClass or bindToElement to
            // the best-fitting image
            sizes = options.maximumHorizontalSizes;
            verticalSizes = options.imageVerticalSizes;
            windowWidth = $(window).width();
            windowHeight = $(window).height();

            var i = 0;
            var j = 0;
            var found = false;

            for(i = 0; i < sizes.length; i++) {
               // we have found an image exceeding the viewport width
               if(sizes[i] >= windowWidth && sizes[i-1] <= windowWidth) { 
                   found = true;
                   break;
               }
            }
            if(sizes[0] >= windowWidth) {
                i = 0;
            } if (!found && sizes[sizes.length-1] < windowWidth) {
                i = sizes.length-1;
            }
            found = false;
            for(j = 0; j < sizes.length; j++) {
               // we have found an image exceeding the viewport width
               if(verticalSizes[j] >= windowHeight && verticalSizes[j-1] <= windowHeight) {
                   found = true;
                   break;
               }
            }
            if(verticalSizes[0] >= windowHeight) {
                j = 0;
            } if (!found && verticalSizes[verticalSizes.length-1] < windowHeight) {
                j = verticalSizes.length-1;
            }

            (i <= j) ? i=j : i=i;
            
            if(options.mode == "css") {
                element.css("backgroundImage", "url(" + options.imageBaseURL + "/" + options.imageName + "_" + sizes[i] + "." + options.imageExtension + ")");
                if(options.reposition) {
                    position = options.repositioningRule(windowWidth, windowHeight, sizes[i], verticalSizes[i]);
                    element.css("background-position", position[0] + "px " + position[1] + "px");
                }
            } 
            
            if(options.mode == "html") {
                element.attr("src", options.imageBaseURL + "/" + options.imageName + "_" + sizes[i] + "." + options.imageExtension);

                if(options.reposition) {
                    position = options.repositioningRule(windowWidth, windowHeight, sizes[i], verticalSizes[i]);
                    element.css("margin", position[0] + "px " + position[1] + "px"); 
                }
            }
};


})( jQuery );

