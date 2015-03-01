WAF.define('GridView', ['waf-core/widget', 'VrWidgetGridWafWrapper'], function(widget, VrWidgetGridWafWrapper) {


    //waf-studio-donotsave

    var GridView = widget.create('GridView', {

		gridDataSource: widget.property({
            type: 'datasource',
            onChange: function(x) {
                this.build();
            }
        }),
        gridColumns: widget.property({
            type: 'list',
            attributes: ['label', 'attribute', 'colSize'],
            onInsert: function(x) {
                this.build();
            },
            onModify: function(x) {
                this.build();

            },
            onRemove: function(x) {
                this.build();

            }


        }),
        gridMultiselect: widget.property({
            type: "boolean",
            defaultValue: true,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        allowClickAndHighlight: widget.property({
            type: "boolean",
            defaultValue: true,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        activeScrollCache: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false,
            onChange: function(x) {
                //this.build();
            }
        }),
        readOnly: widget.property({
            type: "boolean",
            defaultValue: true,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        headerClickSorting: widget.property({
            type: "boolean",
            defaultValue: true,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        sortableColumns: widget.property({
            type: "boolean",
            defaultValue: true,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        resizableColumns: widget.property({
            type: "boolean",
            defaultValue: true,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        autoSave: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        refreshAfterAutoSave: widget.property({
            type: "boolean",
            defaultValue: false,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        headerHeight: widget.property({
            type: "integer",
            defaultValue: 30,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        rowHeight: widget.property({
            type: "integer",
            defaultValue: 25,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        footerHeight: widget.property({
            type: "integer",
            defaultValue: 30,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        getDataScrollDelay: widget.property({
            type: "integer",
            defaultValue: 100,
            bindable: false
        }),
        lockedColumns: widget.property({
            type: "integer",
            defaultValue: 0,
            bindable: false,
            onChange: function(x) {
                this.build();
            }
        }),
        dateFormat: widget.property({
            type: "string",
            defaultValue: "-1",
            bindable: false

        }),
        desimalType: widget.property({
            type: "string",
            defaultValue: "-1",
            bindable: false
        }),
        numberRounding: widget.property({
            type: "integer",
            defaultValue: -1,
            bindable: false
        }),
        build: function() {
            var that = this;
            $(that.node).html("");

            $("body").trigger("vrGridViewLoad", {
                that: that,
                trigger: "onLoad"
            });

            var temp = document.createElement("DIV");
            temp.height = "100&";
            temp.width = "100%";
            that.node.appendChild(temp);


            var colHeaderNames = [];
            var colSize = [];
            var colAttributes = [];

            //fill arrays
            for (var i = 0; i < that.gridColumns().length; i++) {
                if (this.gridColumns(i) !== undefined) {
                    colHeaderNames.push(that.gridColumns(i).label);

                    if (parseInt(that.gridColumns(i).colSize).toString() !== "NaN") {
                        colSize.push(that.gridColumns(i).colSize)
                    }
                    else {
                        colSize.push(100)
                    }
                    colAttributes.push(that.gridColumns(i).attribute)
                }
            }



            var widgetJSData = {
                id: that.id,
                node: temp,
                headerHeight: that.headerHeight(),
                footerHeight: that.footerHeight(),
                rowheight: that.rowHeight(),
                isMultiSelect: that.gridMultiselect(),
                source: that.gridDataSource(),
                activeScrollCache : false,
                decimalType: that.desimalType(),
                allowHighlight: that.allowClickAndHighlight(),
                readOnly: that.readOnly(),
                autoSave: that.autoSave(),
                getDataScrollDelay : that.getDataScrollDelay(),
                refreshAfterAutoSave: that.refreshAfterAutoSave(),
                sortableColumns : that.sortableColumns(),
                resizableColumns : that.resizableColumns(),
                simpleAttributeSorting : that.headerClickSorting(),
                //this is useless atm
                dateFormat: that.dateFormat(),
                numberPrecision: that.numberRounding(),
                columnWidths: colSize,
                headerNames: colHeaderNames,
                attributeNames: colAttributes,
                lockedColumns: that.lockedColumns(),
                event_onRowClick: function(e) {
                    that.fire('rowSingleClick', {
                        target: e.target,
                        event: e,
                        readOnly: that.readOnly()
                    });
                },
                event_onRowDoubleClick: function(e) {
                    that.fire('rowDoubleClick', {
                        target: e.target,
                        event: e
                    });
                },
                event_onRowRightClick: function(e) {
                    that.fire('rowRightClick', {
                        target: e.target,
                        event: e
                    });
                },
                event_onHeaderRowClick: function(e, headerAttribute) {
                    that.fire('headerClick', {
                        headerAttribute: headerAttribute,
                        dataSource: that.gridDataSource()
                    });
                },
                event_onHeaderRowDoubleClick: function(e) {
                    that.fire('headerDoubleClick', {
                        target: e.target,
                        event: e
                    });
                },
                event_onHeaderRowRightClick: function(e) {
                    that.fire('headerRightClick', {
                        target: e.target,
                        event: e
                    });
                },
                event_onCellHeaderDraw : function(columnNo, attributeName, headerName, div){
                	//setTimeout(function(e){
                	that.fire('cellHeaderDrawn', {
                        columnNo: columnNo,
                        attributeName: attributeName,
                        headerName : headerName,
                        div: div
                    });             		
              //  },0)
                },
                event_onCellDraw: function(columnNo, attributeName, div, data, entity) {
                    that.fire('cellDrawn', {
                        columnNo: columnNo,
                        attributeName: attributeName,
                        div: div,
                        data: data,
                        entity: entity,
                        readOnly: that.readOnly(),
                        autoSave: that.autoSave()
                    });
                }
            };

            that.createdGrid = new VrWidgetGridWafWrapper(widgetJSData);




            //not I need to edit som parts due to bugs in widget api... I think its bugs atleast
            if (window.Designer) {
                temp.classList.add("waf-studio-donotsave");
                var htmlCache = that.createdGrid.getHtmlCache();
                htmlCache.content.scrollTop = 0;
                htmlCache.content.style.overflowY = "";
                htmlCache.content.style.overflowX = "";
                htmlCache.content.style.overflow = "hidden";
            };
            
            if (!window.Designer) {
	            if(that.gridDataSource().length >0){
		            setTimeout(function(){
		            	that.createdGrid.updateAllRows();
		        	},0);
	        	}
        	}




        },
        init: function() {
            var that = this;
            if (window.Designer) {
                setTimeout(function() { //universal way of getting widget api to work, delay stuff...
                    that.build();
                }, 500);
            }
            else {
                that.build();
            }
        }
    });

    //called when widget is destoryed
    GridView.prototype.destroy = function() {
        // Remove your listeners
        this.createdGrid.onDestory();
        // this.items().removListener(...)
        this.$super('destroy')();
    };

	
	GridView.prototype.setSource = function(newSource, keepOldSelection) {
		this.createdGrid.setSource(newSource, keepOldSelection);
	}
	
	GridView.prototype.getColumnSetup = function() {
		this.createdGrid.getColumnSetup();
	}

	GridView.prototype.setColumnSetup = function(columnsObj) {
		this.createdGrid.setColumnSetup(columnsObj);
	}



    return GridView;




});

/* For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3871.html */