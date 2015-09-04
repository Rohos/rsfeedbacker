/*!
 * jQuery RsFeedbacker Plugin v0.2.0
 * https://github.com/rohos/rsfeedbacker
 *
 * Copyright 2015 iRohos
 * Released under the MIT license
 */

;(function ($) {
    "use strict";

    // Constructor
    function RsFeedbacker(form, options) {

        this.version = "0.2.0";
        this.pluginName = 'rsfeedbacker';
        this.$form = form;
        this.$box = null;
        this.errors = {};
        this.types = ['default', 'bootstrap'];
        this.defaultType = 'default';
        this.defaultErrorKey = 'default';
        this.errorFldNamePattern = '{{%field%}}';
        this.attrLabelFld = 'data-rsfeedbacker-label';
        this.attrFormIsSend = 'data-rsfeedbacker-isSend',
        this.idModalBootstrap = 'id-rsfeedbacker-modal';
        this.notCheckFields = '';
        this.events = [
            'beforeCheckForm', 'afterCheckForm', 'beforeShowSuccess', 'afterShowSuccess',
            'beforeSendForm', 'afterSendForm', 'failSendForm', 'beforeShowErrors', 'afterShowErrors'
        ];
        this.settings = $.extend({}, {
            'debug': false, // (boolean)
            'novalidate': false, // (boolean)
            'boxCls': 'form_box', // (string)
            'bootstrapBoxCls': 'form-group', // (string)
            'errorBoxCls': 'errors_box', // (string)
            'errorCls': 'has-error', // (string)
            'type': 'default', // (string) item of this.types
            'needTrimVal': true, // (boolean)
            'successMsg': 'Спасибо, сообщение успешно отправлено', // (string)
            'rules': {}, // (object) {field : function(value) {}}
            'notCheckFields': '[type="submit"], [type="reset"]',
            'submitBtn': '[type="submit"]',
            'errorMsgs': {'default': 'Поле {{%field%}} обязательно для заполнения'} // (object) {errorKey : "text error"}
        }, options);

        this.setNovalidate();
        this.setNotCheckFields();
        this.setCallbacks();
        this.addListeners();
    };

    // Set not need to check fields
    RsFeedbacker.prototype.setNotCheckFields = function () {
        this.notCheckFields = this.settings['notCheckFields'];
    };

    // Add callbacks
    RsFeedbacker.prototype.setCallbacks = function () {
        var plugin = this;

        $.each (plugin.settings, function (key, callbackFunc) {
            // If function and valid event name
            if (typeof callbackFunc === 'function' && $.inArray[key, plugin.events] !== -1) {

                plugin.$form.on(plugin.buildEventName(key), function () {
                    callbackFunc.apply(plugin.$form, arguments);
                });
            }
        });
    };

    // Add listeners
    RsFeedbacker.prototype.addListeners = function () {
        var plugin = this;

        plugin.$form.on('submit', function (e) {
            e.preventDefault();
            plugin.clearErrorBox();

            plugin.checkFormFields() ? plugin.sendForm() : plugin.showErrors();
        });

        plugin.$form.on('reset', function (e) {
            plugin.clearErrorBox();
        });
    };

    // Set or not novalidate
    RsFeedbacker.prototype.setNovalidate = function () {

        this.settings['novalidate'] ? this.$form.attr('novalidate', '') : this.$form.attr('novalidate', 'novalidate');
    };

    // Initialization
    RsFeedbacker.prototype.init = function () {
        this.$box = this.$form.closest('.' + this.settings['boxCls']);

        this.setType();
        this.clearAll();
    };

    // Remove listeners
    RsFeedbacker.prototype.removeListeners = function () {
        this.$form.unbind('submit');
        this.$form.unbind('reset');
    };

    // Check form fields
    RsFeedbacker.prototype.checkFormFields = function () {
        var plugin = this,
            fields = plugin.$form.find('input,textarea,select');

        plugin.triggerCallbackEvent('beforeCheckForm');

        fields.not(plugin.notCheckFields).each(function (index) {
            var $field = $(this);

            if ($field.attr('required') && !($field.is('input') && $field.attr('type') == 'submit')) {
                // Get value
                var value = ($field.is('select')) ? $field.find('option:selected').val() : $field.val();

                // Trim
                if (plugin.settings['needTrimVal']) {
                    value = $.trim(value);
                };

                // Set error if empty
                if (value === '') {
                    plugin.errors[$field.attr('name')] = plugin.getErrorMsg('required', $field.attr(plugin.attrLabelFld));
                };
            };
        });

        plugin.triggerCallbackEvent('afterCheckForm', [plugin.errors]);

        return plugin.notErrors();
    };

    // Show success
    RsFeedbacker.prototype.showSuccess = function () {
        this.clearAll();

        plugin.triggerCallbackEvent('beforeShowSuccess');

        switch (this.settings['type']) {
            case 'bootstrap':
                this.showSuccessBootstrap();
                break;
            case 'default':
            default:
                this.showSuccessDefault();
        };

        plugin.triggerCallbackEvent('afterShowSuccess');
    };

    // Show success
    RsFeedbacker.prototype.showSuccessDefault = function () {
        alert(this.settings['successMsg']);
    };

    // Show success bootstrap
    RsFeedbacker.prototype.showSuccessBootstrap = function () {
        var $modal = $('#' + this.idModalBootstrap);

        if ($modal.length > 0) {
            $modal.find('div.modal-body').html('<h3>' + this.settings['successMsg'] + '</h3>');
        } else {
	        var html = '<div class="modal fade" id="' + this.idModalBootstrap + '" role="dialog" aria-hidden="true">';
	        html += '       <div class="modal-dialog">';
	        html += '           <div class="modal-content">';
	        html += '				<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span aria-hidden="true">&times;</span></button><br/></div>';
	        html += '               <div class="modal-body"><h3>' + this.settings['successMsg'] + '</h3></div>';
	        html += '           </div>';
	        html += '       </div>';
	        html += '</div>';

	        $('body').append(html);
	        
	        $modal = $('#' + this.idModalBootstrap);
        }

        $modal.modal();
    };

    // Check errors not exists
    RsFeedbacker.prototype.notErrors = function () {
        var size = 0;

        for (var val in this.errors) {
            if (this.errors.hasOwnProperty(val)) {
                ++size;
            }
        };

        return size == 0;
    };

    RsFeedbacker.prototype.setIsSend = function (flag) {
        var $submitBtn = this.$form.find(this.settings['submitBtn']);
        this.$form.attr(this.attrFormIsSet, flag ? 1 : 0);

        if ($submitBtn.length > 0) {
            $submitBtn.prop('disabled', flag ? true : false);
        }
    };

    // Send form
    RsFeedbacker.prototype.sendForm = function () {
        var plugin = this,
            url = plugin.$form.attr('action');

        plugin.triggerCallbackEvent('beforeSendForm');
        plugin.setIsSend(true);

        $.ajax({
            url: url ? url : window.location.href,
            method: plugin.$form.attr('method'),
            dataType: 'json',
            cache: false,
            data: plugin.$form.serialize()
        }).done(function (answer) {
            plugin.errors = answer.errors ? answer.errors : {};
            plugin.triggerCallbackEvent('afterSendForm', [answer, plugin.errors]);
            plugin.notErrors() ? plugin.showSuccess() : plugin.showErrors();
        }).fail(function(answer) {
            plugin.triggerCallbackEvent('failSendForm');
        }).always(function () {
            plugin.$form.attr(this.attrFormIsSet, 0);
        });
    };

    // Set type
    RsFeedbacker.prototype.setType = function () {
        if ($.inArray(this.settings['type'], this.types) == -1) {
            this.settings['type'] = this.defaultType;
        }
    };

    // Clear form data and errors
    RsFeedbacker.prototype.clearAll = function (notReset) {
        this.clearErrorBox();

        if (!notReset) {
            this.$form.trigger('reset');
        }
    };

    // Clear error box
    RsFeedbacker.prototype.clearErrorBox = function () {
        this.errors = {};

        switch (this.settings['type']) {
            case 'bootstrap':
                this.clearErrorBootstrapBox();
                break;
            case 'default':
            default:
                this.clearErrorDefaultBox();
        };
    };

    // Clear error default box
    RsFeedbacker.prototype.clearErrorDefaultBox = function () {
        var $errorBox = this.$box.find('.' + this.settings['errorBoxCls']);

        if ($errorBox.length > 0) {
            $errorBox.remove();
        }
    };

    // Clear error bootstrap box
    RsFeedbacker.prototype.clearErrorBootstrapBox = function () {
        var plugin = this,
            $errorBox = plugin.$box.find('.' + plugin.settings['errorCls']);

        if ($errorBox.length > 0) {
            $errorBox.each(function (index) {
                $(this).removeClass(plugin.settings['errorCls']);
            });
        }
    };

    // Get error msg
    RsFeedbacker.prototype.getErrorMsg = function (errorKey, name) {

        if (!this.settings['errorMsgs'][errorKey]) {
            errorKey = this.defaultErrorKey;
        }

        return this.settings['errorMsgs'][errorKey].replace(new RegExp(this.errorFldNamePattern, 'g'), name ? ('"' + name + '"') : '');
    };

    // Show errors
    RsFeedbacker.prototype.showErrors = function () {

        this.triggerCallbackEvent('beforeShowErrors', [this.errors]);

        switch (this.settings['type']) {
            case 'bootstrap':
                this.showBootstrapErrors();
                break;
            case 'default':
            default:
                this.showDefaultErrors();
        };

        this.triggerCallbackEvent('afterShowErrors', [this.errors]);
    };

    // Show errors by default
    RsFeedbacker.prototype.showDefaultErrors = function () {
        var html = '<div class="' + this.settings['errorBoxCls'] + '"><ul>';
        $.each(this.errors, function (name, value) {
            html += '<li>' + value + '</li>';
        });
        html += '</ul></div>';

        $(html).insertBefore(this.$form);
    };

    // Show errors by bootsrap
    RsFeedbacker.prototype.showBootstrapErrors = function () {
        var plugin = this;

        $.each(plugin.errors, function (name, value) {
            var $field = plugin.$form.find('[name="' + name + '"]');

            if ($field.length > 0) {
                var $box = $field.closest('.' + plugin.settings['bootstrapBoxCls']);

                if ($box.length > 0) {
                    $box.addClass(plugin.settings['errorCls']);
                }
            }
        });
    };

    RsFeedbacker.prototype.version = function () {
        return this.version;
    };

    RsFeedbacker.prototype.pluginName = function () {
        return this.pluginName;
    };

    RsFeedbacker.prototype.buildEventName = function (name) {
        return name +'.'+ this.pluginName;
    };

    RsFeedbacker.prototype.triggerCallbackEvent = function (name, params) {
        this.$form.trigger(this.buildEventName(name), params);
    };

    // Init plugin
    $.fn.rsFeedbacker = function (options) {
        var rsfeedbacker = new RsFeedbacker(this, options);
        rsfeedbacker.init();

        return this;
    };

})(jQuery);