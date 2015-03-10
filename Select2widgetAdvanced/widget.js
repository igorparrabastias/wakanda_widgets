WAF.define('Select2widgetAdvanced', ['waf-core/widget', 'vrSelect2', 'VRmustache'], function(widget, Select2, Mustache) {



    var dropDown = function(that) {

            if (that.onlyDropDown()) {

                that.addQuerySting.hide();
                that.queryAttributes.hide();
                that.querySource.hide();
                that.relationAttribute.hide();
                that.addQuerySting.hide();
                that.addtionalQuerySting.hide();
                that.additionalQueryParam.hide();
                that.returnAttribute.hide();


            }
            else {

                that.addQuerySting.show();
                that.queryAttributes.show();
                that.querySource.show();
                that.relationAttribute.show();
                that.addQuerySting.show();
                that.returnAttribute.show();
                that.valueAttribute.show();
                if (that.addQuerySting()) {
                    that.addtionalQuerySting.show();
                    that.additionalQueryParam.show();
                }
                else {
                    that.addtionalQuerySting.hide();
                    that.additionalQueryParam.hide();
                }
            }




        };






    var Select2widgetAdvanced = widget.create('Select2widgetAdvanced', {

        onlyDropDown: widget.property({
            type: "boolean",
            defaultValue: true,
            bindable: false,
            onChange: function(x) {



                this.init();
            }
        }),
        overRideEvent: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),

        minimumInputLength: widget.property({
            type: "integer",
            defaultValue: 0,
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),
        maxServerSourceReturn: widget.property({
            type: "integer",
            defaultValue: 10,
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),
        querySource: widget.property({
            type: "datasource",
            onChange: function(x) {
                this.init();
            }
        }),
        relationAttribute: widget.property({
            type: "string",
            defaultValue: "",
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),
        returnAttribute: widget.property({
            type: "string",
            defaultValue: "",
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),
        valueAttribute: widget.property({
            type: "string",
            defaultValue: "",
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),
        setSource: widget.property({
            type: "datasource",
            onChange: function(x) {
                this.init();
            }
        }),
        queryAttributes: widget.property({
            type: 'list',
            attributes: ['attribute'],
            onInsert: function(x) {
                this.init();
            },
            onModify: function(x) {
                this.init();

            },
            onRemove: function(x) {
                this.init();

            }

        }),
        resultAttributes: widget.property({
            type: 'list',
            attributes: ['attribute'],
            onInsert: function(x) {
                this.init();
            },
            onModify: function(x) {
                this.init();

            },
            onRemove: function(x) {
                this.init();

            }

        }),
        addQuerySting: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),
        addtionalQuerySting: widget.property({
            type: "string",
            defaultValue: "& attributeName =",
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),
        additionalQueryParam: widget.property({
            type: "string",
            defaultValue: "Berlin",
            bindable: false,
            onChange: function(x) {
                this.init();
            }
        }),
        setValue: function(val) {
            if (val === undefined || val === null) {
                val = "";
            };
            var object = {
                id: undefined,
                text: val
            };
            $(this.node).find(" .select2WakWidget").select2("data", object);
        },
        getValue: function() {
            return $(this.node).find(" .select2WakWidget").select2("data").text

        },
        init: function() {

            try {
                dropDown(this)
            }
            catch (e) {}



            var that = this;
            $(this.node).html("");
            //$("#" + this.id).append('<select class="select2WakWidget"></select>');
            $(this.node).append('<input type="hidden" class="select2WakWidget"></input>');

            //wantto display search?
            var minimumResultsForSearch = null;
            if (this.minimumInputLength() === -1) {
                //remove search
                minimumResultsForSearch = -1;

            }


            if (!window.Designer) {


                //fix for when loading webcomponent, we need to set the value
                setTimeout(function() {
                    try {
                        that.setValue(that.setSource()[that.valueAttribute()])
                    }
                    catch (e) {}
                }, 40);

                this.myDatabaseListners = [];

                try {
                    var list = this.setSource().addListener("onCurrentElementChange", function(event) {
                        that.setValue(that.setSource()[that.valueAttribute()])
                    }, {
                        attributeName: that.valueAttribute()
                    } // attribute to listen to
                    );
                    this.myDatabaseListners.push(list);
                }
                catch (e) {

                }

                try {
                    var list = this.setSource().addListener("onAttributeChange", function(event) {
                        that.setValue(that.setSource()[that.valueAttribute()])
                    }, {
                        attributeName: that.valueAttribute()
                    } // attribute to listen to
                    );
                    this.myDatabaseListners.push(list);
                }
                catch (e) {

                }
            }



            var that = this;
            var $superCallback;
            var $superTempArray;
            var getArrayFromSource = function(source) {

                    if (source.getWebComponentID() === "") {
                        return window[source._private.id];
                    }
                    else {
                        return $$(source.getWebComponentID()).sourcesVar[source._private.id.replace(source.getWebComponentID() + "_", "")]
                    }
                };


            var setArrayFromSource = function(source, array) {

                    if (source.getWebComponentID() === "") {
                        window[source._private.id] = array;
                    }
                    else {
                        $$(source.getWebComponentID()).sourcesVar[source._private.id.replace(source.getWebComponentID() + "_", "")] = array;
                    }
                };

            $(this.node).find(" .select2WakWidget").select2({
                minimumInputLength: this.minimumInputLength(),
                minimumResultsForSearch: minimumResultsForSearch,
                escapeMarkup: function(m) {
                    return m;
                },
                dropdownAutoWidth: true,
                query: function(query) {
                    var data = {
                        results: []
                    };


                    if (that.onlyDropDown() === true) {
                        for (var i = 0; i < that.resultAttributes().length; i++) {
                            data.results.push({
                                id: that.resultAttributes()[i].attribute,
                                text: that.resultAttributes()[i].attribute
                            });
                        }

                        query.callback(data)


                    }
                    else {
                        //do all the other stuff...
                        //query source
                        var querySource = that.querySource();
                        if (querySource._private.sourceType === "array") {


                            var queryString = "";
                            var queryParams = [];
                            for (var i = 0; i < that.queryAttributes().length; i++) {
                                if (i === that.queryAttributes().length - 1) {
                                    queryString = queryString + "" + that.queryAttributes()[i].attribute + "==" + "" + query.term + "*";

                                }
                                else {
                                    queryString = queryString + "" + that.queryAttributes()[i].attribute + "==" + "" + query.term + "*" + " || ";

                                }

                            };

                            var resultAttributesArray = "";
                            var mustasjeResultString = "";
                            for (var i = 0; i < that.resultAttributes().length; i++) {
                                if (i === that.resultAttributes().length - 1) {
                                    resultAttributesArray = resultAttributesArray + "" + that.resultAttributes()[i].attribute;
                                    mustasjeResultString = mustasjeResultString + "{{" + that.resultAttributes()[i].attribute + "}}"
                                }
                                else {
                                    resultAttributesArray = resultAttributesArray + "" + that.resultAttributes()[i].attribute + ",";
                                    mustasjeResultString = mustasjeResultString + " {{" + that.resultAttributes()[i].attribute + "}} "
                                }

                            };

                            $superCallback = query.callback;
                            $superTempArray = JSON.parse(JSON.stringify(getArrayFromSource(that.querySource())));
                            that.querySource().query(queryString, {
                                onSuccess: function() {
                                    var resultArray = getArrayFromSource(that.querySource());
                                    var data = {
                                        results: []
                                    };
                                    for (var i = 0; i < that.querySource().length; i++) {
                                        // TODO u need to set this!!!
                                        data.results.push({
                                            id: i,
                                            text: Mustache.render(mustasjeResultString, resultArray[i])
                                        });
                                    }
                                    $superCallback(data);
                                    setArrayFromSource(that.querySource(), JSON.parse(JSON.stringify($superTempArray)));
                                }
                            });


                        }
                        else {

                            //query string                  
                            var queryString = "";
                            var queryParams = [];
                            for (var i = 0; i < that.queryAttributes().length; i++) {
                                if (i === that.queryAttributes().length - 1) {
                                    queryString = queryString + "" + that.queryAttributes()[i].attribute + "=:" + (parseInt(i) + parseInt(1));
                                    queryParams.push("*" + query.term + "*")
                                }
                                else {
                                    queryString = queryString + "" + that.queryAttributes()[i].attribute + "=:" + (parseInt(i) + parseInt(1)) + " || ";
                                    queryParams.push("*" + query.term + "*")
                                }

                            };

                            //result attribuyes
                            var resultAttributesArray = "";
                            var mustasjeResultString = "";
                            for (var i = 0; i < that.resultAttributes().length; i++) {
                                if (i === that.resultAttributes().length - 1) {
                                    resultAttributesArray = resultAttributesArray + "" + that.resultAttributes()[i].attribute;
                                    mustasjeResultString = mustasjeResultString + "{{" + that.resultAttributes()[i].attribute + "}}"
                                }
                                else {
                                    resultAttributesArray = resultAttributesArray + "" + that.resultAttributes()[i].attribute + ",";
                                    mustasjeResultString = mustasjeResultString + " {{" + that.resultAttributes()[i].attribute + "}} "
                                }

                            };


                            if (that.addQuerySting() === true) {
                                var addQueryString = that.addtionalQuerySting();
                                var addQueryParam = that.additionalQueryParam();
                                var i = queryParams.length;
                                queryString = queryString + " " + addQueryString + ":" + (parseInt(i) + parseInt(1));
                                queryParams.push(addQueryParam);

                            }



                            var getEntitysetURI = function(currentDatasource) {
                                    var entitySetRest = null;
                                    try {
                                        entitySetRest = sources[currentDatasource].getEntityCollection().getReference().dataURI;
                                    }
                                    catch (e) {}
                                    return entitySetRest;

                                };



                            var releaseEntitySet = function(entitySet) {
                                    try {
                                        if (entitySet !== null && entitySet !== undefined) {
                                            var handler = function() {
                                                    var i = 0;

                                                };

                                            var xhr = new XMLHttpRequest();
                                            xhr.onload = handler;
                                            xhr.open("post", entitySet + "?$method=release", true);
                                            xhr.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT'); // due to IE9 caching XHR
                                            xhr.setRequestHeader('Cache-Control', 'no-cache'); // due to IE9 caching XHR
                                            xhr.send();
                                        }
                                    }
                                    catch (e) {};


                                };

                            var entitysetURI = getEntitysetURI(that.querySource()._private.id);


                            that.querySource().query(queryString, {
                                onSuccess: function(event) {
                                    event.dataSource.toArray(resultAttributesArray, {
                                        onSuccess: function(event) {
                                            var resultArray = event.result;
                                            var data = {
                                                results: []
                                            };
                                            for (var i = 0; i < event.result.length; i++) {
                                                // TODO u need to set this!!!
                                                data.results.push({
                                                    id: resultArray[i].__KEY,
                                                    text: Mustache.render(mustasjeResultString, resultArray[i])
                                                });
                                            }
                                            event.userData[0](data);

                                        },
                                        top: that.maxServerSourceReturn(),
                                        userData: [event.userData[0]]
                                    });
                                    releaseEntitySet(entitysetURI);
                                },
                                params: queryParams,
                                userData: [query.callback]
                            }); //end actual query
                        } //array source
                    } //only dropdown
                } //end query
            }).on("select2-close", function(e) {
                that.CloseTimeout = setTimeout(function() {
                    var getEntitysetURI = function(currentDatasource) {
                            var entitySetRest = null;
                            try {
                                entitySetRest = sources[currentDatasource].getEntityCollection().getReference().dataURI;
                            }
                            catch (e) {}
                            return entitySetRest;

                        };



                    var releaseEntitySet = function(entitySet) {
                            try {
                                if (entitySet !== null && entitySet !== undefined) {
                                    var handler = function() {
                                            var i = 0;

                                        };

                                    var xhr = new XMLHttpRequest();
                                    xhr.onload = handler;
                                    xhr.open("post", entitySet + "?$method=release", true);
                                    xhr.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT'); // due to IE9 caching XHR
                                    xhr.setRequestHeader('Cache-Control', 'no-cache'); // due to IE9 caching XHR
                                    xhr.send();
                                }
                            }
                            catch (e) {};


                        };

                    var entitysetURI = getEntitysetURI(that.querySource()._private.id);
                    releaseEntitySet(entitysetURI);
                }, 500);
            }).on("change", function(e) { //"select2-close"
                clearTimeout(that.CloseTimeout);
                if (that.onlyDropDown() === true) {

                    if (that.setSource()._private.sourceType === "array") {
                        var array = getArrayFromSource(that.setSource());
                        array[that.setSource().getPosition()][that.valueAttribute()] = e.val;
                        that.setSource().sync();

                    }
                    else {
                        that.setSource()[that.valueAttribute()] = e.val;
                        that.setSource().autoDispatch();
                    }

                }
                else {
                    if (that.querySource()._private.sourceType === "array") {
                        that.querySource().select(e.val, {
                            onSuccess: function(e) {
                                if (that.overRideEvent()) {
                                    that.fire('overrideSet', {
                                        querySource: that.querySource(),
                                        source: that.setSource()
                                    });
                                }
                                else {
                                    if (that.setSource()._private.sourceType === "array") {
                                        var array = getArrayFromSource(that.setSource());
                                        array[that.setSource().getPosition()][that.relationAttribute()] = that.querySource()[that.returnAttribute()];
                                        that.setSource().sync();
                                    }
                                    else {
                                        that.setSource()[that.relationAttribute()] = that.querySource()[that.returnAttribute()];
                                        that.setSource().autoDispatch();
                                    }
                                }
                            }
                        });




                    }
                    else {


                        var getEntitysetURI = function(currentDatasource) {
                                var entitySetRest = null;
                                try {
                                    entitySetRest = sources[currentDatasource].getEntityCollection().getReference().dataURI;
                                }
                                catch (e) {}
                                return entitySetRest;

                            };



                        var releaseEntitySet = function(entitySet) {
                                try {
                                    if (entitySet !== null && entitySet !== undefined) {
                                        var xhr = new XMLHttpRequest();
                                        xhr.open("post", entitySet + "?$method=release", false);
                                        xhr.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT'); // due to IE9 caching XHR
                                        xhr.setRequestHeader('Cache-Control', 'no-cache'); // due to IE9 caching XHR
                                        xhr.send();
                                    }
                                }
                                catch (e) {};


                            };

                        var entitysetURI = getEntitysetURI(that.querySource()._private.id);

                        that.querySource().selectByKey(e.val, {
                            onSuccess: function(e) {
                                if (that.overRideEvent()) {
                                    that.fire('overrideSet', {
                                        querySource: that.querySource(),
                                        source: that.setSource()
                                    });
                                }
                                else {
                                    if (that.setSource()._private.sourceType === "array") {
                                        var array = getArrayFromSource(that.setSource());
                                        array[that.setSource().getPosition()][that.relationAttribute()] = that.querySource()[that.returnAttribute()];
                                        that.setSource().sync();

                                    }
                                    else {
                                        that.setSource()[that.relationAttribute()].set(that.querySource());
                                        that.setSource().serverRefresh();
                                    }

                                }
                                releaseEntitySet(entitysetURI);
                            }
                        });

                    }


                }

            });

            //set correct height
            $(this.node).find(" .select2WakWidget .select2-choice").css({
                "height": "100%"
            });


            //if in studio disable it
            if (window.Designer) {
                $(this.node).find(" .select2WakWidget").select2("enable", false);
                //so its selectable in studio
                $(this.node).append('<div class="selectableInStudio"></div>');
            }
            else {
                $(this.node).find(" .select2WakWidget").select2("enable", true);
                // $("#" + this.id).append('<div class="selectMe"></div>');
            }
        }

    });


    Select2widgetAdvanced.prototype.destroy = function() {



        that = this;
        //remove datasource listners
        this.myDatabaseListners.forEach(function(list) {
            try {
                $("#select2-drop-mask").click();
                that.setSource().removeListener(list);
            }
            catch (e) {}
        });

        this.$super('destroy')();
    };


    //    Select2widgetAdvanced.customizeProperty('returnAttribute', {
    //	    title: 'Return Value:',
    //	    description: 'Write the attibute in the setsource you want selected dropdown result to',
    //	    display: true,
    //	    sourceDisplay: true
    //	});
    return Select2widgetAdvanced;

});

/* For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3871.html */