/*!
 * jQuery RsFeedbacker Plugin v0.0.1
 * https://github.com/rohos/rsfeedbacker
 *
 * Copyright 2015 iRohos
 * Released under the MIT license
 */

;(function ($) {

    // Constructor
    function RsFeedbacker(form, options) {
        this._$form = form;
        this._$box = null;
        this._errors = {};
        this._types = ['default', 'bootstrap'];
        this._defaultType = 'default';
        this._defaultErrorKey = 'default';
        this._errorFldNamePattern = '{{%field%}}';
        this._attrLabelFld = 'data-rsfeedbacker-label';
        this._idModalBootstrap = 'id-rsfeedbacker-modal';
        this._settings = $.extend({}, {
            'debug': false, // (boolean)
            'boxCls': 'form_box', // (string)
            'bootstrapBoxCls': 'form-group', // (string)
            'errorBoxCls': 'errors_box', // (string)
            'errorCls': 'has-error', // (string)
            'type': 'default', // (string) item of this._types
            'needTrimVal': true, // (boolean)
            'successMsg': 'Спасибо, сообщение успешно отправлено', // (string)
            'errorMsgs': {'default': 'Поле {{%field%}} обязательно для заполнения'} // (object) {errorKey : "text error"}
        }, options);

        this.addListeners();
    };

    // Initialization
    RsFeedbacker.prototype.init = function () {
        this._$box = this._$form.closest('.' + this._settings['boxCls']);

        this.setType();
        this.clearAll();
    };

    // Add listeners
    RsFeedbacker.prototype.addListeners = function () {
        var plugin = this;

        plugin._$form.on('submit', function (e) {
            e.preventDefault();
            plugin.clearErrorBox();

            if (plugin.checkFormFields()) {
                plugin.sendForm();
            } else {
                plugin.showErrors();
            }
        });
    };

    // Remove listeners
    RsFeedbacker.prototype.removeListeners = function () {
        this._$form.unbind('submit');
    };

    // Check form fields
    RsFeedbacker.prototype.checkFormFields = function () {
        var plugin = this;

        plugin._$form.find('input,textarea,select').each(function (index) {
            var $field = $(this);

            if ($field.attr('required') && !($field.is('input') && $field.attr('type') == 'submit')) {
                // Get value
                var value = ($field.is('select')) ? $field.find('option:selected').val() : $field.val();

                // Trim
                if (plugin._settings['needTrimVal']) {
                    value = $.trim(value);
                };

                // Set error if empty
                if (value === '') {
                    plugin._errors[$field.attr('name')] = plugin.getErrorMsg('required', $field.attr(plugin._attrLabelFld));
                };
            };
        });

        return plugin.notErrors();
    };

    // Show success
    RsFeedbacker.prototype.showSuccess = function () {
        this.clearAll();

        switch (this._settings['type']) {
            case 'bootstrap':
                this.showSuccessBootstrap();
                break;
            case 'default':
            default:
                this.showSuccessDefault();
        };
    };

    // Show success
    RsFeedbacker.prototype.showSuccessDefault = function () {
        alert(this._settings['successMsg']);
    };

    // Show success bootstrap
    RsFeedbacker.prototype.showSuccessBootstrap = function () {
        var $modal = $('#' + this._idModalBootstrap);

        if ($modal.length > 0) {
            $modal.find('div.modal-body').html('<h3>' + this._settings['successMsg'] + '</h3>');
        } else {
	        var html = '<div class="modal fade" id="' + this._idModalBootstrap + '" role="dialog" aria-hidden="true">';
	        html += '       <div class="modal-dialog">';
	        html += '           <div class="modal-content">';
	        html += '				<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true"><span aria-hidden="true">&times;</span></button><br/></div>';
	        html += '               <div class="modal-body"><h3>' + this._settings['successMsg'] + '</h3></div>';
	        html += '           </div>';
	        html += '       </div>';
	        html += '</div>';

	        $('body').append(html);
	        
	        $modal = $('#' + this._idModalBootstrap);
        }

        $modal.modal();
    };

    // Check errors not exists
    RsFeedbacker.prototype.notErrors = function () {
        var size = 0;

        for (var val in this._errors) {
            if (this._errors.hasOwnProperty(val)) {
                ++size;
            }
        };

        return size == 0;
    };

    // Send form
    RsFeedbacker.prototype.sendForm = function () {
        var plugin = this;
        var url = plugin._$form.attr('action');

        $.ajax({
            url: url ? url : window.location.href,
            method: plugin._$form.attr('method'),
            dataType: 'json',
            cache: false,
            data: plugin._$form.serialize()
        }).done(function (answer) {
            plugin._errors = answer.errors ? answer.errors : {};

            if (plugin.notErrors()) {
                plugin.showSuccess();
            } else {
                plugin.showErrors();
            }
        });
    };

    // Set type
    RsFeedbacker.prototype.setType = function () {
        if ($.inArray(this._settings['type'], this._types) == -1) {
            this._settings['type'] = this._defaultType;
        }
    };

    // Clear form data and errors
    RsFeedbacker.prototype.clearAll = function (notReset) {
        this.clearErrorBox();

        if (!notReset) {
            this._$form.trigger('reset');
        }
    };

    // Clear error box
    RsFeedbacker.prototype.clearErrorBox = function () {
        this._errors = {};

        switch (this._settings['type']) {
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
        var $errorBox = this._$box.find('.' + this._settings['errorBoxCls']);

        if ($errorBox.length > 0) {
            $errorBox.remove();
        }
    };

    // Clear error bootstrap box
    RsFeedbacker.prototype.clearErrorBootstrapBox = function () {
        var plugin = this;
        var $errorBox = this._$box.find('.' + this._settings['errorCls']);

        if ($errorBox.length > 0) {
            $errorBox.each(function (index) {
                $(this).removeClass(plugin._settings['errorCls']);
            });
        }
    };

    // Get error msg
    RsFeedbacker.prototype.getErrorMsg = function (errorKey, name) {
        if (!this._settings['errorMsgs'][errorKey]) {
            errorKey = this._defaultErrorKey;
        }

        return this._settings['errorMsgs'][errorKey].replace(new RegExp(this._errorFldNamePattern, 'g'), name ? ('"' + name + '"') : '');
    };

    // Show errors
    RsFeedbacker.prototype.showErrors = function () {

        switch (this._settings['type']) {
            case 'bootstrap':
                this.showBootstrapErrors();
                break;
            case 'default':
            default:
                this.showDefaultErrors();
        };
    };

    // Show errors by default
    RsFeedbacker.prototype.showDefaultErrors = function () {
        var html = '<div class="' + this._settings['errorBoxCls'] + '"><ul>';
        $.each(this._errors, function (name, value) {
            html += '<li>' + value + '</li>';
        });
        html += '</ul></div>';

        $(html).insertBefore(this._$form);
    };

    // Show errors by bootsrap
    RsFeedbacker.prototype.showBootstrapErrors = function () {
        var plugin = this;

        $.each(this._errors, function (name, value) {
            var $field = plugin._$form.find('[name="' + name + '"]');

            if ($field.length > 0) {
                var $box = $field.closest('.' + plugin._settings['bootstrapBoxCls']);

                if ($box.length > 0) {
                    $box.addClass(plugin._settings['errorCls']);
                }
            }
        });
    };

    // Init plugin
    $.fn.rsFeedbacker = function (options) {
        var rsfeedbacker = new RsFeedbacker(this, options);
        rsfeedbacker.init();

        return this;
    };

})(jQuery);