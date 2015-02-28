WAF.define('InputText', ['waf-core/widget', 'VRaccounting'], function(widget, accounting) {


    //widget
    var InputText = widget.create('InputText', {
        setValuePrivate: function(data) {
            var result = data;
            switch (this.attributeType) {
            case "Number":
                result = accounting.unformat(result, this.desimalSeperator());
                break;
            case "String":
                break;
            case "Date":
                result = new Date($.datepicker.parseDate(this.dateFormat(), result).toString());
            }
            return result;
        },
        getValuePrivate: function(data) {
            var result = data;
            switch (this.attributeType) {
            case "Number":
                var tail = 0;
                if (data !== null) {
                    var precision = result.toString().split(".");
                    if (precision.length = 2) {
                        try {
                            tail = precision[1].length
                        }
                        catch (e) {
                            tail = 0;
                        }
                    }
                }
                if (this.displayPrecision() !== -1) {
                    tail = this.displayPrecision();
                }
                result = accounting.formatMoney(result, this.numberSymbol(), tail, this.thousandSeperator(), this.desimalSeperator());
                if(this.applyStringFormatToNumbers()){
                	result = this.formatString(result, this.stringFormat());
                }
                break;
            case "String":
            	if(this.stringFormat() !== ""){
            		result = this.formatString(result, this.stringFormat());
            	}
            
                break;
            case "Date":
                result = $.datepicker.formatDate(this.dateFormat(), new Date(result))
            }
            return result;
        },
        refresh : function(){
                this.node.value = this.getValuePrivate(this.originalValue);
        },
        tagName: 'input',
        value: widget.property({
		    }),
        readOnly: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false
        }),
        password: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false
        }),
        multiline: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false,
            onChange: function() {
                this.init();

            }
        }),
        stringFormat: widget.property({
            type: "string",
            defaultValue: "",
            bindable: false
        }),
        keyDownRegex: widget.property({
            type: "string",
            defaultValue: "",
            bindable: false
        }),
        applyStringFormatToNumbers: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false
        }),
        desimalSeperator: widget.property({
            type: "string",
            defaultValue: "auto",
            bindable: false
        }),
        thousandSeperator: widget.property({
            type: "string",
            defaultValue: "-1",
            bindable: false
        }),
        displayPrecision: widget.property({
            type: "integer",
            defaultValue: -1,
            bindable: false
        }),
        numberSymbol: widget.property({
            type: "string",
            defaultValue: "",
            bindable: false
        }),
        localeDate: widget.property({
            type: "string",
            defaultValue: "auto",
            bindable: false
        }),
        dateFormat: widget.property({
            type: "string",
            defaultValue: "mm/dd/yy",
            bindable: false
        }),
        useDatePicker: widget.property({
            type: "boolean",
            defaultValue: true,
            bindable: false,
            onChange: function(value) {
                if (value) {
                    this.showDatePickerButton.show();
                }
                else {
                    this.showDatePickerButton.hide();
                }
            }
        }),
        showDatePickerButton: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false
        }),
        init: function() {

			//so datasource and name is displayed in 
			var that = this;
			if(window.Designer){
				setTimeout(function(){
				try {
				 that.value("["+that._boundAttributes.value.datasourceName +"."+that._boundAttributes.value.attribute+"]");
				 } catch(e){};
				 },20);
				 
				 
				this.subscribe('datasourceBindingChange', 'value', function() {
		            this.value("["+this._boundAttributes.value.datasourceName +"."+this._boundAttributes.value.attribute+"]");
		        }, this);
			
			//small fix for wak 10, so timeout actually edits the node value
				try{
					that.value("*");
				} catch(e){};
			
			}

            //basic vars
            var that = this;
            if(window.Designer){
            	this.$node = $(this.node); //api changes in wak 10...
            } else {
            	this.$node = $("#" + this.id); //this dont work in studio, they really need to rethink this..
        	}
            this.$node.addClass("waf-textField");
            this.$node.addClass("waf-state-default");
            this.originalValue = this.value();
            this.focusEventUpdate = false;

            var localeNumberFormat = this.getNumberFormatCodes(WAF.utils.getBrowserLang());



            if (this.desimalSeperator() === "auto") {
                this.desimalSeperator(localeNumberFormat.dec)
            } 

            if (this.thousandSeperator() === "auto") {
                this.thousandSeperator(localeNumberFormat.group)
            } else {
				if (this.thousandSeperator() === "-1") {
					this.thousandSeperator("")
				}
            }




            //for some reason this makes it a text area?? bug??
            this.$node.html("");
            if (this.multiline()) {
            	try{
            	var tagName = 'TEXTAREA';
            	var $replace = $('<' + tagName + '>');
				$replace.attr('id', this.node.id);
				$replace.attr('class', this.node.className);
				$replace.attr('style', this.node.style);
				$replace.val(this.value);
				this.$node.replaceWith($replace);
//                this.$node.append("<textarea>");
                this.$node.addClass("no-resize");
            	} catch (e){}
            }




            //set value, use try catch so sttudio dont annoy me to much and mess everything up
            try {
                this.binding = that.value.boundDatasource();
                if (this.binding) {
                    //this.node.value = this.getValuePrivate(this.binding.datasource[this.binding.attribute]);
                    var testValue = this.getValuePrivate(this.binding.datasource[this.binding.attribute]);
	                if(testValue !== undefined){
	                	that.node.value = testValue;
	            	} else {
	            		that.node.value = null;
	            		this.originalValue = null;
	            	}
	                }
            }
            catch (e) {
                this.binding = null;
                
            }

			
			if(!this.binding){
                	this.originalValue = "";	
			}
			

            //set type
            this.attributeType = this.getType();




            //trigger a onload, so user can check local settings and do what he wants
            //this way he can set the desimalSeperator like this options.that.desimalSeperator(",")
            $("body").trigger("vrInputTextLoad", {
                that: this,
                trigger: "onLoad"
            });




            //set date format for widget
            var dataFormat;
            try {
                if (this.localeDate() === "auto") {
                    dataFormat = $.datepicker.regional[WAF.utils.getBrowserLang()].dateFormat;
                }
                else {
                    dataFormat = this.localeDate() === "-1" ? this.dateFormat() : $.datepicker.regional[this.localeDate()].dateFormat;
                }
            }
            catch (e) {
                dataFormat = this.dateFormat()
            }
            this.dateFormat(dataFormat);



            if (this.useDatePicker() && this.attributeType === "Date") {
                this.addDatepicker();
            }


            //get value when the "value" propertie chnages
            var valueSubscriber = this.value.onChange(function() {
                valueSubscriber.pause();
                this.originalValue = this.value();
                var testValue = this.getValuePrivate(this.value());
                if(testValue !== undefined){
                	that.node.value = testValue;
            	} else {
            		that.node.value = null;
            		this.originalValue = null;
            	}
                valueSubscriber.resume();
            });






            if (this.password()) {
                this.$node.prop("type", "password");
            }
            else {
                this.$node.prop("type", "text");
            }



            this.$node.on('blur', function(event) {
                if (this.focusEventUpdate == false) {
                    if (this.binding) {
                        var temp = this.setValuePrivate(event.target.value); //event.target.value;
                        this.binding.datasource[this.binding.attribute] = temp;
                        this.originalValue = temp;
                        this.binding.datasource.dispatch("onAttributeChange");
                        this.binding.datasource.autoDispatch();
                    }
                    else {
                        this.originalValue = this.setValuePrivate(event.target.value);
                        this.node.value = this.getValuePrivate(this.originalValue);
                    }
                }
                else {
                    this.focusEventUpdate = false;
                }
                that.fire("blur", {
                    event: event
                })
            }.bind(this));



            this.$node.hover(function() {
                that.$node.addClass("waf-state-hover");
            }, function() {
                that.$node.removeClass("waf-state-hover");
            });


            this.$node.on('focusin', function(event) {
                if (this.attributeType === "Number") {
                    try {
	                    var precision = this.originalValue.toString().split(".");
	                    if (precision.length = 2) {
	                        try {
	                            tail = precision[1].length
	                        }
	                        catch (e) {
	                            tail = 0;
	                        }
	                    }
                	} catch(e){
                    	tail = 0;
                    }
                    this.node.value = accounting.formatMoney(this.originalValue, "", tail, "", this.desimalSeperator());
                }
                
                if (this.attributeType === "String") {
                	
                	this.node.value = this.originalValue;
                	
                }

                that.$node.addClass("waf-state-focus");
                that.fire("focusin", {
                    event: event
                });
            }.bind(this));

            this.$node.on('focusout', function(event) {
            	
            	if(this.originalValue === null || this.originalValue === undefined){
            		this.originalValue = "";	
            	}
            	
            	
                if (this.binding) {
                    var temp = this.setValuePrivate(event.target.value); //event.target.value;
                    if (temp.toString() === this.originalValue.toString()) {
                        this.focusEventUpdate = true;
                        this.originalValue = this.setValuePrivate(event.target.value);
                        this.node.value = this.getValuePrivate(this.originalValue);
                    }
                }
                else {
                    var temp = this.setValuePrivate(event.target.value);
                    if (temp.toString() === this.originalValue.toString()) {
                    	this.focusEventUpdate = true;
                        this.originalValue = this.setValuePrivate(event.target.value);
                        this.node.value = this.getValuePrivate(this.originalValue);
                    }
                }

                that.$node.removeClass("waf-state-focus");
                that.fire("focusout", {
                    event: event
                });


            }.bind(this));

            this.$node.on('keyup', function(event) {
                that.fire("keyup", {
                    event: event
                });
            }.bind(this));

            this.$node.on('keydown', function(event) {
                that.fire("keydown", {
                    event: event
                });
                if (this.readOnly()) {
                    return false;
                } else {
                if(this.keyDownRegex() !== "" && event.keyCode !== 8){
                	var regexFormat = new RegExp(this.keyDownRegex());
                	if(event.originalEvent.location === 3){
                		if(String.fromCharCode(event.keyCode-48).match(regexFormat) === null){
	                		return false;
	                	}                		
                	} else {
	                	if(String.fromCharCode(event.keyCode).match(regexFormat) === null){
	                		return false;
	                	}
                	}
                }
                }
            }.bind(this));

            this.$node.on('click', function(event) {
                that.fire("click", {
                    event: event
                });
            }.bind(this));

            this.$node.on('dblclick', function(event) {
                that.fire("dblclick", {
                    event: event
                });
            }.bind(this));

            this.$node.on('mousedown', function(event) {
                that.fire("mousedown", {
                    event: event
                });
            }.bind(this));

            this.$node.on('mouseup', function(event) {
                that.fire("mouseup", {
                    event: event
                });
            }.bind(this));

            this.$node.on('mouseenter', function(event) {
                that.fire("mouseenter", {
                    event: event
                });
            }.bind(this));

            this.$node.on('mouseleave', function(event) {
                that.fire("mouseleave", {
                    event: event
                });
            }.bind(this));





        },
        getType: function(data) {
            if (this.binding) {
                switch (this.binding.datasource.getAttribute(this.binding.attribute).type) {
                case "long":
                case "number":
                case "float":
                case "long":
                case "byte":
                case "word":
                case "long64":
                    return 'Number';
                case "string":
                    return "String";
                case "date":
                    return "Date";
                }
            }
            else {
                if (data !== undefined && data !== null) {
                    switch (jQuery.type(data)) {
                    case "number":
                        this.attributeType = "Number";
                        this.removeDatepicker();
                        return "Number";
                    case "string":
                        this.attributeType = "String";
                        this.removeDatepicker();
                        return "String";
                    case "date":
                        this.attributeType = "Date";
                        this.addDatepicker();
                        return "Date";

                    }
                }
                else {
                    this.attributeType = "String";
                    this.removeDatepicker();
                    return "String"
                }

            }
        },
        addDatepicker: function() {
            var that = this;
            $.datepicker.setDefaults($.datepicker.regional[this.localeDate()]);
            if (!this.readOnly()) {
                if (this.showDatePickerButton()) {
                    this.$node.datepicker({
                        dateFormat: this.dateFormat(),
                        onSelect: function(dateText) {
                            if (that.binding) {
                                that.binding.datasource[that.binding.attribute] = that.setValuePrivate(dateText);
                                that.binding.datasource.dispatch("onAttributeChange");
                                that.binding.datasource.autoDispatch();
                            }
                        },
                        showOn: 'button',
                        buttonImageOnly: true,
                        buttonImage: '/waLib/WAF/widget/png/date-picker-trigger.png?id=' + this.node.id
                    });
                    //todo: clean up
                    var dateIcon = $('img[src="/waLib/WAF/widget/png/date-picker-trigger.png?id=' + this.node.id + '"]');
                    var dateIconLeft = this.$node.position().left + this.$node[0].offsetWidth;
                    dateIcon.css({
                        'position': 'absolute',
                        'left': dateIconLeft + 'px',
                        'top': this.$node.css('top'),
                        'cursor': 'pointer'
                    });
                }
                else {

                    //this.$node.datepicker($.datepicker.regional[this.localeDate()]);
                    this.$node.datepicker({
                        dateFormat: this.dateFormat(),
                        onSelect: function(dateText) {
                            if (that.binding) {
                                that.binding.datasource[that.binding.attribute] = that.setValuePrivate(dateText);
                                that.binding.datasource.dispatch("onAttributeChange");
                                that.binding.datasource.autoDispatch();
                            }
                        }

                    });
                }
            }
        },
        removeDatepicker: function() {
            if (this.$node.hasClass("hasDatepicker")) {
                this.$node.datepicker('destroy');
            };
        },
        getNumberFormatCodes: function(locale) {
            var dec = ".";
            var group = ",";

            if (locale === "us" || locale === "ae" || locale === "eg" || locale === "il" || locale === "jp" || locale === "sk" || locale === "th" || locale === "cn" || locale === "hk" || locale === "tw" || locale === "au" || locale === "ca" || locale === "gb" || locale === "in") {
                dec = ".";
                group = ",";
            }
            else if (locale === "no" || locale === "de" || locale === "vn" || locale === "es" || locale === "dk" || locale === "at" || locale === "gr" || locale === "br") {
                dec = ",";
                group = ".";
            }
            else if (locale === "cz" || locale === "fr" || locale === "fi" || locale === "ru" || locale === "se") {
                group = " ";
                dec = ",";
            }
            else if (locale === "ch") {
                group = "'";
                dec = ".";
            }

            return {
                dec: dec,
                group: group
            };
        },
        formatString: function(value, options) {
            var result;
            if (options == null || value == null) {
                result = value;
            }
            else {
                if (typeof options === 'string') options = {
                    format: options
                };
                switch (options.format) {
                case 'U':
                    result = value.toUpperCase();
                    break;
                case 'l':
                    result = value.toLowerCase();
                    break;
                case 'C':
                    result = value.capitalize();
                    break;
                case 'c':
                    result = value.capitalizeEachWord();
                    break;

                default:
                    // Phonenumber like format. 
                    // Use # as placeholder, other chars will be inserted as is... (ie: "(###) ###-###" )
                    result = '';
                    var j = 0;
                    var format = options.format || '';
                    for (var i = 0; i < format.length; i++)
                    result += format[i] == '#' ? (value[j++] || '') : format[i];
                    result += value.slice(j);
                }
            }

            return result;
        },
        capitalize: function() {
            if (this.length > 1) {
                return this[0].toUpperCase() + this.substring(1).toLowerCase();
            }
            else return this.toUpperCase();
        },
        capitalizeEachWord: function() {
            var result = this.split(" ");
            for (var i = 0, nbElems = result.length; i < nbElems; i++) {
                var elem = result[i];
                if ((typeof elem == "string") || (elem instanceof String)) result[i] = elem.capitalize();
            }

            return result.join(" ");
        }
    });





    //other functions
    InputText.prototype.getValue = function() {
        return this.setValuePrivate(this.node.value)
    };

    InputText.prototype.setValue = function(value) {
        this.originalValue = value;
        this.attributeType = this.getType(value);
        this.node.value = this.getValuePrivate(value); //event.target.value;
        if (this.binding) {
            this.binding.datasource[this.binding.attribute] = this.setValuePrivate(this.node.value);
            this.binding.datasource.dispatch("onAttributeChange");
            this.binding.datasource.autoDispatch();
        }
        else {

        }
    };

    InputText.prototype.disable = function() {
    	this.readOnly(true);
        this.$node.addClass("waf-state-disabled");
    };

    InputText.prototype.enable = function() {
    	this.readOnly(false);
        this.$node.removeClass("waf-state-disabled");
    };

    InputText.prototype.enableDatePicker = function() {
        this.addDatepicker();
    };

    InputText.prototype.disableDatePicker = function() {
        this.removeDatepicker();
    };

	InputText.prototype.getFormatedValue = function() {
    	return this.node.value;
    };
    
    InputText.prototype.getISOdate = function() {
    	return $.datepicker.formatDate("yy-mm-dd", this.originalValue)
    };
    
    InputText.prototype.getISOweek = function() {
    	return $.datepicker.iso8601Week(this.originalValue)
    };
    
   // getISOdate



    return InputText;


});

/* For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3871.html */
