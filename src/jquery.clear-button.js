// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function($, window, document, undefined) {

    'use strict';

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults
    var pluginName = 'clearButton';
    var defaults = {
        text: 'Clear Text',
        position: 'topRight', // topLeft, topRight, bottomLeft, bottomRight
        positionSize: '5px',
        fontSize: '14px/100%',
        color: '#777'
    };
    var cssTextAreaCloseDiv = {
        position: 'relative',
        display: 'inline-block'
    };
    var cssTextAreaCloseBtn = {
        position: 'absolute',
        display: 'none',
        fontFamily: 'arial, sans-serif',
        textDecoration: 'none',
        textShadow: '0 1px 0 #fff'
    };

    $('head').append('<style>.clearButton-btn:after { content: "✖"; }</style>');

    // The actual plugin constructor
    function Plugin(element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function() {
            this.createButton();
            this.showHideButton();
        },

        setCSSBtn: function() {
            cssTextAreaCloseBtn.fontSize = this.settings.fontSize;
            cssTextAreaCloseBtn.color = this.settings.color;
            switch(this.settings.position) {
                case 'topLeft':
                    cssTextAreaCloseBtn.top = this.settings.positionSize;
                    cssTextAreaCloseBtn.left = this.settings.positionSize;
                    break;
                case 'topRight':
                    cssTextAreaCloseBtn.top = this.settings.positionSize;
                    cssTextAreaCloseBtn.right = this.settings.positionSize;
                    break;
                case 'bottomLeft':
                    cssTextAreaCloseBtn.bottom = this.settings.positionSize;
                    cssTextAreaCloseBtn.left = this.settings.positionSize;
                    break;
                case 'bottomRight':
                    cssTextAreaCloseBtn.bottom = this.settings.positionSize;
                    cssTextAreaCloseBtn.right = this.settings.positionSize;
                    break;
                default:
                    cssTextAreaCloseBtn.top = this.settings.positionSize;
                    cssTextAreaCloseBtn.right = this.settings.positionSize;
            }
        },

        createButton: function() {
            var $div = $('<div class="clearButton-div"></div>');
            var $button = $('<a href="#clearText" class="clearButton-btn" title="' + this.settings.text + '"></a>');
            this.setCSSBtn();
            $div.css(cssTextAreaCloseDiv);
            $button.css(cssTextAreaCloseBtn);
            this.$element.wrap($div);
            this.$element.parent().append($button);            
            $('.clearButton-btn').on('click', this.clearText);
        },

        showHideButton: function() {
            var self = this;
            this.$element.keyup(function() {
                if ($(this).val().length > 0) {
                    self.$element.closest('.clearButton-div').find('.clearButton-btn').show();
                }
                else {
                    self.$element.closest('.clearButton-div').find('.clearButton-btn').hide();
                }
            });
        },

        clearText: function(event) {
            event.preventDefault();
            $(this).closest('.clearButton-div').find('input[type="text"], textarea').val('');
            $(this).hide();
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);