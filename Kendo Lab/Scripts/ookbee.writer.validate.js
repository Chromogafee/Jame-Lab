jQuery.fn.extend({
    isEmpty: function () {
        if (!this.val()) {
            return true;
        }
        return false;
    },
    isImgFile: function () {
        var extension = this.val().split('.')[this.val().split('.').length - 1];
        if ($.inArray(extension.toLowerCase(), ['jpeg', 'png', 'gif','jpg']) == -1) {
            return false; // search not found
        }
        return true;
    },
    isPdfFile: function () {
        var extension = this.val().split('.')[this.val().split('.').length - 1];
        if ($.inArray(extension.toLowerCase(), ['pdf']) == -1) {
            return false; // search not found
        }
        return true;
    },
    isEpubFile: function () {
        var extension = this.val().split('.')[this.val().split('.').length - 1];
        if ($.inArray(extension.toLowerCase(), ['epub']) == -1) {
            return false; // search not found
        }
        return true;
    },
    isLengthBetween: function (min, max) {
        var l = this.val().length;
        if (l <= max && l >= min) {
            return true;
        }
        return false;
    },
    isFixLength: function (fix) {
        var l = this.val().length;
        if (l == fix) {
            return true;
        }
        return false;
    },
    isMoreMaxLength: function (max) {
        var l = this.val().length;
        if (l > max) {
            return true;
        }
        return false;
    },
    isLessMinLength: function (min) {
        var l = this.val().length;
        if (l < min) {
            return true;
        }
        return false;
    },
    isNumerics: function () {
        return $.isNumeric(this.val());
    },
    isRegulaExpress: function (reg) {
        return this.val().match(reg);
    },
    isDigitOnly: function () {
        return this.val().match(/^\d+$/);
    },
    isNumberWithPoint: function () {
        return this.val().match('[-+]?([0-9]*.[0-9]+|[0-9]+)');
    },
    isEmail: function () {
        return this.val().match('^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$');
    },
    isDateFormate: function (formate) {
        console.log(formate);
        if (formate.toLowerCase() == 'dd/mm/yyyy') {
            return this.val().match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/);
        } else if (formate.toLowerCase() == 'mm/dd/yyyy') {
            return this.val().match('^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)dd$');
        }
        
        return true;
    },
    addErrorValidate: function (messageError) {
        var $parent = this;
        var count = 0;
        while (true) {
            $parent = $parent.parent();
            if ($parent.is("div")) {
                count = count + 1;
                if (count == 1) {
                    $parent.append('<small class="help-block writerValidate" style="display: block;">' + messageError + '</small>');
                } else if (count == 2) {
                    $parent.addClass('has-error');
                    break;
                }
            }
        }
    },
    removeErrorValidate: function () {
        $('.writerValidate').remove();
        this.find(".has-error ").each(function (index,item) {
            $(item).removeClass("has-error ");
        });
    },
    addError: function (messageError) {
        this.addClass('borderRed');
        this.parent().append('<small class="help-block writerValidate" style="display: block; color: rgb(255, 0, 0); text-align: right;">' + messageError + '</small>');
    },
    addErrorForPrice: function (messageError) {
        this.addClass('borderRed');
        this.parent().append('<small class="help-block writerValidate" style="display: inline-block; color: rgb(255, 0, 0); text-align: right; margin-left: 0.7em;">' + messageError + '</small>');
    },
    addErrorForDatpicker: function (messageError) {
        this.addClass('borderRed');
        this.parent().parent().append('<small class="help-block writerValidate" style="display: block; color: rgb(255, 0, 0); text-align: left;">' + messageError + '</small>');
    },
    addErrorForDropdownCategory: function (messageError) {
        this.children('input').addClass('borderRed');
        this.children('span').children('button').addClass('borderRed');
        this.parent().append('<small class="help-block writerValidate" style="display: block; color: rgb(255, 0, 0); text-align: right;">' + messageError + '</small>');
    },
    //addErrorBroder: function () {
    //    this.addClass('borderRed');
    //},
    //addErrorBroderForTag: function () {
    //    this.parent().addClass('borderRed');
    //},
    addErrorForTag: function (messageError) {
        this.next().addClass('borderRed');
        this.parent().append('<small class="help-block writerValidate" style="display: block; color: rgb(255, 0, 0); text-align: right;">' + messageError + '</small>');
    },
    removeErrorAll: function removeErrorValidate() {
        $('.writerValidate').remove();
        this.find(".borderRed").each(function (index, item) {
            $(item).removeClass("borderRed");
        });
    }, 
});

