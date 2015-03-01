WAF.define('VrWidgetGridWafWrapper', ['waf-core/widget','VrWidgetGrid'], function(widget,VrWidgetGrid) {


    /****************************************************************************************************************
     *	Waf datasource helper																						*
     ****************************************************************************************************************/
    var VrWidgetGridWafWrapper = function(buildData) {
            "use strict";


            /**************************************************************************************
             * internal vars
             *************************************************************************************/
            var lastRowUpwards = 0;
            var dataSourceListnerID = null;
            var sel;

			
			
			//TODO: improve, but atleast there is sorting in the grid for v2
			var sortHelper = {};
			sortHelper.lastSortSource = null;
			sortHelper.lastSortAttr = null;
			sortHelper.lastSortType = null;
			sortHelper.lastDiv = null;
			sortHelper.aboutToSort = false;
			sortHelper.sort = function(element) {
				//debugger;
			    var curSortSource = buildData.source._private.id;
			    var curSortAttr = element.getAttribute("datasourceattribute")
			    if (element.className === "content" && curSortAttr !== null && curSortAttr !== undefined) {                	
				    var next
				    if (curSortSource !== sortHelper.lastSortSource) {
				        sortHelper.lastSortType = "asc";
				    }
				    else {
				        if (curSortAttr !== sortHelper.lastSortAttr) {
				            sortHelper.lastSortType = "asc";
				        }
				        else {
				            if (sortHelper.lastSortType === "desc") {
				                sortHelper.lastSortType = "asc";
				            }
				            else {
				                sortHelper.lastSortType = "desc"
				            }
				        }
				    }
				    sortHelper.lastSortSource = curSortSource;
				    sortHelper.lastSortAttr = curSortAttr;
					sortHelper.aboutToSort = true
				    buildData.source.orderBy(curSortAttr + " " + sortHelper.lastSortType,{
				    	onSuccess:function(){
							sortHelper.aboutToSort = false;
				    		//get old div and remove icon
						    if(sortHelper.lastDiv !== null){
						        var oldDivContent = sortHelper.lastDiv.innerHTML;
						        oldDivContent = oldDivContent.replace("▼", "");
						        oldDivContent = oldDivContent.replace("▲", "");
						        sortHelper.lastDiv.innerHTML = oldDivContent;
						    }
						    //get new div, and content, and set it as the new old
						    var old = element.innerHTML;
						    sortHelper.lastDiv = element

						    if(sortHelper.lastSortType === "asc"){
						        element.innerHTML = old +"▼";
						    } else {
						        element.innerHTML = old+"▲";
						    }
				    		
				    		
				    	},onError:function(){
				    		//todo
				    		
				    		
				    	}});

				    
				}

			}
			sortHelper.sortRebuilder = function(headerRow){
				var elements = headerRow.getElementsByClassName("content");
				if(sortHelper.lastSortAttr !== null){
					for(var i = 0; i < elements.length; i++){
						var curSortAttr = elements[i].getAttribute("datasourceattribute")
			   			if (elements[i].className === "content" && curSortAttr === sortHelper.lastSortAttr) {
			   				var old = elements[i].innerHTML;
			   				if(sortHelper.lastSortType === "asc"){
						        elements[i].innerHTML = old +"▼";
						    } else {
						        elements[i].innerHTML = old +"▲";
						    }
						    sortHelper.lastDiv = elements[i]
			   			} else {
			   				if(elements[i].className === "content"){
			   					var oldDivContent = elements[i].innerHTML;
						        oldDivContent = oldDivContent.replace("▼", "");
						        oldDivContent = oldDivContent.replace("▲", "");
						        elements[i].innerHTML = oldDivContent;
			   					
			   				}
			   			}
					}
				}			
			};
			
			sortHelper.clear = function(){
				sortHelper.lastSortSource = null;
				sortHelper.lastSortAttr = null;
				sortHelper.lastSortType = null;
				sortHelper.lastDiv = null;
				
				
				
			};
			
			
			
			
			

            /**************************************************************************************
             * for when in studio/no datasource linked
             *************************************************************************************/
            var setSource = function(buildSetupParams, keepOldSelection) {
            	
                    var dummyData = {
                        getElement: function(row, obj, data) {
                            var DummyObj = {};
                            if (row < 4) {
                                for (var i = 0; i < buildSetupParams.attributeNames.length; i++) {
                                    var temp;
                                    if (window.Designer) {
                                        temp = "studio"
                                    }
                                    else {
                                        temp = "noSource"
                                    }
                                    DummyObj[buildSetupParams.attributeNames[i]] = temp;
                                }
                            }
                            var event = {
                                element: DummyObj,
                                userData: data
                            };
                            obj.onSuccess(event);
                        },
                        length: 4,
                        setSelection: function() {},
                        isSelected: function(row) {
                            if (row == 3) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        },
                        select: function() {},
                        selectRange: function() {},
                        getSelectedRows: function() {
                            return []
                        },
                        setSelectedRows: function() {},
                        _private: {
                            minPageSize: 40
                        },
                        countSelected : function(){
                        	return 1;
                        },
                        addListener: function() {}
                    };

                    if (buildSetupParams.source === undefined || buildSetupParams.source === null || (window.Designer)) {
                        buildSetupParams.source = dummyData;
                        sel = dummyData;
                    }
                    else {
                        /**************************************************************************************
                         * sets selection
                         *************************************************************************************/
                        if (keepOldSelection === true) {

                            sel = buildSetupParams.source.getSelection();
                            if (sel.getSelectedRows().length === 0) {
                                sel.select(buildData.source.getPosition());
                            }
                        }
                        else {
                        	sel = buildSetupParams.source.getSelection();
                            if (buildSetupParams.isMultiSelect === true && !sel.isModeMultiple()) {
                                sel = new WAF.Selection("multiple");
                            }
                            else {
                            	if(buildSetupParams.isMultiSelect === false){
                            		sel.reset("single");
                            	}
                                //sel = new WAF.Selection("single");
                            }
                            buildSetupParams.source.setSelection(sel);
                            if(sel.getSelectedRows().length === 0){
                            	sel.select(buildData.source.getPosition());
                        	}
                        }
                    }
                };

            setSource(buildData, false);

            /**************************************************************************************
             * sets selection
             *************************************************************************************/
            var setFooterData = function(setFooterHtml) {
                    var footer = document.createElement("DIV");
                    footer.style.align = "center";
                    footer.innerHTML = 'Total:     ' + buildData.source.length + "#" + sel.countSelected() + '    :Selected';
                    setFooterHtml(footer);
                };


            /**************************************************************************************
             * formats inserted entity/element
             *************************************************************************************/
            var formatData = function(attributeName, column, entity) {
                    try {
                        var attibuteType = buildData.source._private.atts[attributeName].type;
                        switch (attibuteType) {
                        case "number":
                        	var number = entity[attributeName]
                        	if(number === null){
                                number = 0;
                            }
                            if (buildData.numberPrecision !== "-1" && entity !== null) {
                                number = Math.round(number * Math.pow(10, buildData.numberPrecision)) / Math.pow(10, buildData.numberPrecision)
                                number = number.toFixed(buildData.numberPrecision);
                            }
                            if (buildData.decimalType !== "-1" && entity !== null) {
                                number = number.toString().replace(".", buildData.decimalType);
                            }
                            entity[attributeName] = number;
                            
                            break;
                        case "date":
                            if (buildData.dateFormat !== "-1" && entity !== null) {
                                entity[attributeName] = $.datepicker.formatDate(buildData.dateFormat, entity[attributeName]);
                            }
                            break;
                        }
                    }
                    catch (e) {};
                };

            var lastFocus = null;

            /**************************************************************************************
             * params to send to vanillagrid class
             *************************************************************************************/
            var params = {
                id: buildData.id,
                node : buildData.node,
                headerHeight: buildData.headerHeight,
                footerHeight: buildData.footerHeight,
                rowheight: buildData.rowheight,
                columnWidths: buildData.columnWidths,
                headerNames: buildData.headerNames,
                attributeNames: buildData.attributeNames,
                lockedColumns: buildData.lockedColumns,
                isMultiSelect: buildData.isMultiSelect,
                sortableColumns : buildData.sortableColumns,
                resizableColumns : buildData.resizableColumns,
                getDataScrollDelay : buildData.getDataScrollDelay,
                event_onHeaderRebuild : function (headerRow, vars){
                	
                	for (var i = 0; i < vars.attributeNames.length; i++) {
		                buildData.event_onCellHeaderDraw(i, vars.attributeNames[i], vars.headerNames[i], headerRow.children[i])
		            }
                	
                	//sets sorticon back
                	sortHelper.sortRebuilder(headerRow);
                	
                	
                },
                event_onRowClick: buildData.event_onRowClick,
                event_onRowDoubleClick: function(e) {
                    var that = this;
                    if(e.ctrlKey === false){
                    	buildData.event_onRowDoubleClick(e);
                	}
                    
                    try {
                        var myElement = e.target;
                        if (myElement.className === "content") {
                        	var enterHit = false;
                            var attributeName = myElement.getAttribute("datasourceattribute")
                            var oldValue = myElement.innerHTML
							try{
                            var attibuteType = buildData.source._private.atts[attributeName].type;
                        } catch(e){}
                            switch (attibuteType) {
                            case "number":
                            	if (buildData.decimalType !== "-1"){
                                	myElement.innerHTML = buildData.source[attributeName].toString().replace(".", buildData.decimalType);
                                } else {
                                	myElement.innerHTML = buildData.source[attributeName];
                                }
                                break;
                            case "date":

                                break;
                            }

                            //allow highlig if readonly
                            if (buildData.readOnly === true && buildData.allowHighlight === true) {
                                myElement.classList.add("vr-widget-grid-editCell");
                                myElement.setAttribute("contenteditable", "true");
                            }

                            if (buildData.readOnly === false) {
                                myElement.setAttribute("contenteditable", "true");
                                myElement.classList.add("vr-widget-grid-editCell");
                            }

                            //setback value
                            myElement.onblur = function(event) {
                                myElement.setAttribute("contenteditable", "false");
                                myElement.classList.remove("vr-widget-grid-editCell");
                                var newValue = myElement.innerHTML;
                                if (oldValue !== newValue && enterHit === false) {
                                	enterHit = true;
                                    var sourceValue = newValue;
                                    switch (attibuteType) {
                                    case "number":
                                    	if (buildData.decimalType !== "-1"){
                                    		if(sourceValue === null){
                                    			sourceValue = 0;
                                    		}
                                        	sourceValue = sourceValue.replace(buildData.decimalType, ".");
                                        	myElement.innerHTML = Math.round(sourceValue * Math.pow(10, buildData.numberPrecision)) / Math.pow(10, buildData.numberPrecision);
                                    	}
                                        break;
                                    case "date":
                                    	if (buildData.dateFormat !== "-1"){
                                        	sourceValue = new Date($.datepicker.parseDate(buildData.dateFormat, sourceValue).toString());
                                        	myElement.innerHTML = $.datepicker.formatDate(buildData.dateFormat, sourceValue);
                                        }
                                        break;
                                    default:
                                    }
                                    if(buildData.readOnly === false){
                                    	buildData.source[attributeName] = sourceValue;
                                	}
                                    buildData.source.autoDispatch(); //if local source then I need to rethink this..
                                    if (buildData.source.sync !== undefined) { //local source							
                                        if (buildData.source.getScope() === "global") {
                                            window[buildData.source._private.id][buildData.source.getPosition()][attributeName] = sourceValue;
                                        }
                                        else {
                                            //use sourceVar in web component
                                            var compID = buildData.source.getWebComponentID();
                                            $$(compID).sourcesVar[buildData.source._private.id.replace(compID + "_", "")][buildData.source.getPosition()][attributeName] = sourceValue;
                                        }
                                        buildData.source.sync();
                                    }
                                }
                                else {
                                    myElement.innerHTML = oldValue;
                                }
                            }

                            var ctrlDown = false;
                            var ctrlKey = 17,
                                vKey = 86,
                                cKey = 67;

                            myElement.onkeyup = function(ex) {
                                if (ex.keyCode == ctrlKey) {
                                    ctrlDown = false;
                                }
                            };

                            myElement.onkeydown = function(e) {
                                if (e.keyCode == 13) {
                                    myElement.onblur();
                                    buildData.source.dispatch("onBeforeCurrentElementChange");
                                    return false;
                                }
                                if (e.keyCode == ctrlKey) {
                                    ctrlDown = true;
                                }
                                if (buildData.readOnly === true) {
                                    if (ctrlDown && e.keyCode == cKey) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                }
                                else {
                                    return true;
                                }
                            }

                            var selectText = function(element) {
                                    var doc = document
                                    var text = element
                                    var range;
                                    var selection;
                                    if (doc.body.createTextRange) {
                                        range = document.body.createTextRange();
                                        range.moveToElementText(text);
                                        range.select();
                                    }
                                    else {
                                        if (window.getSelection) {
                                            selection = window.getSelection();
                                            range = document.createRange();
                                            range.selectNodeContents(text);
                                            selection.removeAllRanges();
                                            selection.addRange(range);
                                        }
                                    }
                                }
                            selectText(myElement);
                        }
                        
                        	


                    }
                    catch (e) {
                       // console.log("vrWidgetGrid:error updating source"); //this is mostly helper function during development, should be disabled in production
                    }

                    
                },
                event_onRowRightClick: buildData.event_onRowRightClick,
                event_onHeaderRowClick: function(e){
                	if(buildData.simpleAttributeSorting){
                		sortHelper.sort(e.target);
                	}
                	buildData.event_onHeaderRowClick(e);                	
                },
                event_onHeaderRowDoubleClick: buildData.event_onHeaderRowDoubleClick,
                event_onHeaderRowRightClick: buildData.event_onHeaderRowRightClick,
                getSourceLength: function() {
                    return buildData.source.length;
                },
                getHeaderTemplate: function(headerNames, attributeNames) {
                    var rowtemplate = "";
                    for (var i = 0; i < headerNames.length; i++) {
                        rowtemplate = rowtemplate + '<div><div class="content" datasourceattribute="' + attributeNames[i] + '">' + headerNames[i] + '</div></div>';
                    }
                    return rowtemplate;
                },
                getRowTemplate: function(entity, attributeNames) {
                    var rowtemplate = "";
                    for (var i = 0; i < attributeNames.length; i++) {
                        formatData(attributeNames[i], i, entity);
                        rowtemplate = rowtemplate + '<div><div class="content" datasourceattribute="' + attributeNames[i] + '">{{' + attributeNames[i] + '}}</div></div>';
                    }
                    return rowtemplate;
                },
                getDataElement: function(row, rowDiv, templateFN, getRowTemplateFN, vars, isDown, bigScroll) {
                    //this I need for making restcalls better when scrolling upwards
                    var pageSize = buildData.source._private.minPageSize;
                    //small waf data element.
                    var getRestData = function(row, rowDiv, vars, templateFN, getRowTemplateFN) {
                            buildData.source.getElement(row, {
                                onSuccess: function(event) {
                                    var xRow = parseInt(event.userData[1].style.top.replace("px", ""), 10) / event.userData[2].rowHeight;
                                    if (xRow === event.userData[0] && buildData.source.length > 0) {
                                        var xTemp = event.userData[3](event.userData[4](event.element, vars.attributeNames), event.element, vars.attributeNames);

                                            event.userData[1].innerHTML = xTemp;
                                            //trigger cellDraw event
                                            for (var i = 0; i < vars.attributeNames.length; i++) {
                                                var data = null;
                                                if (event.element !== null) {
                                                    data = event.element[vars.attributeNames[i]]
                                                }
                                                buildData.event_onCellDraw(i, vars.attributeNames[i], event.userData[1].children[i], data, event.element)
                                            }
                                       
                                    }
                                },
                                onError: function(err) {
                                    //todo...
                                }
                            }, [row, rowDiv, vars, templateFN, getRowTemplateFN]);
                        };
                    //check if going up
                    if (isDown === false && bigScroll === false) {
                        //going up, Im I under last restGet?
                        if (row < lastRowUpwards) {
                            //set next get
                            lastRowUpwards = (lastRowUpwards) - pageSize; // gets 40 from last top row.
                            //get data
                            getRestData(row, rowDiv, vars, templateFN, getRowTemplateFN);
                            //fill cache
                            if(buildData.activeScrollCache === true){
	                            buildData.source.getElement(lastRowUpwards - pageSize / 2, {
	                                onSuccess: function(event) {
	                                    //nothing for now.. just cache function..
	                                }
	                            });
                        	}
                        }
                        else {
                            //just get data, no need to prefill cache again
                            getRestData(row, rowDiv, vars, templateFN, getRowTemplateFN);
                        }
                    }
                    else {
                        //going down
                        //update last tops get row..
                        lastRowUpwards = vars.scrollVars.firstTop / vars.rowHeight;
                        //first get row
                        getRestData(row, rowDiv, vars, templateFN, getRowTemplateFN);
                        //fill cache with more data
                        if(buildData.activeScrollCache === true){
	                        buildData.source.getElement(row + pageSize, {
	                            onSuccess: function(event) {
	                                //nothing for now.. just cache function..
	                            }
	                        });
                    	}
                        if (bigScroll) {
                            //wanto cache upwards too
                            if(buildData.activeScrollCache === true){
	                            buildData.source.getElement(row - pageSize, {
	                                onSuccess: function(event) {
	                                    //nothing for now.. just cache function..
	                                }
	                            });
                        	}
                        }
                    }
                },
                isRowSelected: function(row) {
                    return sel.isSelected(row); //todo...replace...!
                },
                selection_isSelected: function(row) {
                    return sel.isSelected(row);
                },
                selection_select: function(row, add) {
                    sel.select(row, add);
                },
                selection_selectRange: function(from, to) {
                    sel.selectRange(from, to);
                },
                selection_getSelectedRows: function() {
                    return sel.getSelectedRows();
                },
                selection_setSelectedRows: function(array) {
                    sel.setSelectedRows(array);
                },
                setSelectedEntity: function(row, callback) {
                    buildData.source.select(row, {
                        onSuccess: function() {
                            callback.onSuccess();
                        }
                    });
                }
            }; //end params
            /**************************************************************************************
             * send params and create the grid
             *************************************************************************************/
            var myGrid = new VrWidgetGrid(params);





            /**************************************************************************************
             * add the waf datasource listner
             *************************************************************************************/
            var skipEvent = false;
            var dataSourceListnerID;
            var addDatasourceListners = function(source) {

                    dataSourceListnerID = buildData.source.addListener("all", function(e) {
                        switch (e.eventKind) {
                        case "onCollectionChange":
                        	if(sortHelper.aboutToSort === false){
                        		sortHelper.clear()
               					myGrid.updateHeaderTemplate();
                        	} 
                        
                        
                        	sel = buildData.source.getSelection();
                        	if(sel.getSelectedRows().length === 0){
                            	sel.select(buildData.source.getPosition());
                            	
                        	}
                        	myGrid.setlastSlectedRow(buildData.source.getPosition())
                            myGrid.adjustScollBody();
                            if (buildData.source.isNewElement()) {
                                myGrid.scrollTopRow(buildData.source.getPosition());
                                sel.select(buildData.source._private.currentElemPos);
                                myGrid.updateAllRows("onlySelection");
                            }
                            myGrid.updateAllRows();
                            myGrid.adjustScrollBars();
                            setFooterData(myGrid.setFooterHtml);
                            //if new I should also adjust scrollers to within current element
                            break;
                        case "onCurrentElementChange":
                            //adjust scrollTop?
                            if (myGrid.isHighlighting() === false) {
                                sel.select(buildData.source._private.currentElemPos);
                                myGrid.updateAllRows("onlySelection");
                            } 
                            myGrid.scrollTopRow(buildData.source.getPosition());
                            if (skipEvent === false) {
                                myGrid.updateAllRows();
                            }
                            setFooterData(myGrid.setFooterHtml);
                            break;
                        case "onAttributeChange":
                            myGrid.updateAllRows("onlyOne",e.dataSource.getPosition());//just current entity
                            break;
                        case "onSelectionChange":
                            if (skipEvent === false) {
                                myGrid.updateAllRows();
                            }
                            setFooterData(myGrid.setFooterHtml);
                            break;
                        case "onBeforeCurrentElementChange":
                            //is it a datasource?
                            if (buildData.source._private.sourceType === "dataClass") {
                                //is it touched/edited?
                                if (buildData.source.getCurrentElement().isTouched() === true) {
                                    if (buildData.readOnly === false) {
                                        if (buildData.autoSave === true) {
                                            skipEvent = true;
                                            buildData.source.save({
                                                onSuccess: function(e) {
                                                	skipEvent = false;
                                                    //do the server refresh
                                                },
                                                onError: function(err) {
                                                    //todo, this will break use outside waf, better have autoSave as option, maybe add this to fakedataprovider also
                                                    waf.ErrorManager.displayError(err, null, {
                                                        modal: true,
                                                        title: "Save Error"
                                                    });
                                                }
                                            }); //end save
                                        }
                                    }
                                }
                            }
                            if (skipEvent === false) {
                                myGrid.updateAllRows();
                            }
                            break;
                        case "onElementSaved":
                            if (buildData.refreshAfterAutoSave === true) {
                            	
                            	var rowNum = e.position;
                            	
                                e.serverRefresh({
                                    onSuccess: function(e) {
                                        myGrid.updateAllRows("onlyOne",e.position );//just entity row
                                    },
                                    onError: function(err) {
                                        //todo, this will break use outside waf, better have autoSave as option, maybe add this to fakedataprovider also
                                        waf.ErrorManager.displayError(err, null, {
                                            modal: true,
                                            title: "Save Error"
                                        });
                                    }
                                }); //end server Refresh()
                            }
                           	myGrid.updateAllRows("onlyOne",e.position );//just entity row
                            break;
                        }
                    });
                };
            addDatasourceListners();

			setFooterData(myGrid.setFooterHtml);

            /**************************************************************************************
             * public functions
             *************************************************************************************/



            this.getDataSourceListnerID = function() {
                return dataSourceListnerID; //someone will need this, needs to be called when a widget gets destroyed so events dont bouble up..
            };

            this.getColumnSetup = function() {
                return myGrid.getColumnSetup();
            };
            
            
            this.getHtmlCache = function(){
            	return myGrid.getHtmlCache();
            };

            this.setColumnSetup = function(columnsObj) {
                myGrid.setColumnSetup(columnsObj);
                myGrid.updateHeaderTemplate();
                myGrid.html_adjustRowWidth();

                myGrid.adjustScrollBars();
                myGrid.updateAllRows();
                myGrid.event_ResizableColumns();
                myGrid.event_SortableColumns();
                setFooterData(myGrid.setFooterHtml);
            };

            this.setSource = function(newSource, keepOldSelection) {
            	sortHelper.clear();
                buildData.source.removeListener({
                    ID: dataSourceListnerID
                });
                buildData.source = newSource;
                setSource(buildData, keepOldSelection);
                addDatasourceListners();
                myGrid.adjustScollBody(true);
                myGrid.updateAllRows();
                setFooterData(myGrid.setFooterHtml);
            }

			this.resetSortIcons = function(){
				sortHelper.clear();
			}

			this.onDestory = function(){
				 buildData.source.removeListener({
                    ID: dataSourceListnerID
                });
			}
			
			
			this.updateAllRows = function(){
				myGrid.updateAllRows();
			}

        }; //end
    return VrWidgetGridWafWrapper;

});