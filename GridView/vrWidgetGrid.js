WAF.define('VrWidgetGrid', ['waf-core/widget', 'VrMustache'], function(widget, Mustache) {

    /****************************************************************************************************************
     *	This class will only contain the needed function to build a scrollable grid..								*
     ****************************************************************************************************************/
    var vrWidgetGrid = function(configParams) {
            "use strict";





            /**************************************************************************************
             * insternal vars
             *************************************************************************************/
            var vars = {
                id: configParams.id,
                node: configParams.node,
                headerHeight: configParams.headerHeight,
                footerHeight: configParams.footerHeight,
                columnWidths: configParams.columnWidths,
                headerNames: configParams.headerNames,
                attributeNames: configParams.attributeNames,
                lockedColumns: configParams.lockedColumns,
                resizableColumns: configParams.resizableColumns,
                sortableColumns: configParams.sortableColumns,
                getDataScrollDelay: configParams.getDataScrollDelay,
                contentHeight: 0,
                gridHeight: 0,
                gridWidth: 0,
                bigScrollLimit: 1000,
                scrollBodyHeight: 0,
                isMultiSelect: configParams.isMultiSelect,
                rowHeight: configParams.rowheight,
                indexBefore: null,
                //sortable helper vars
                noHorzScroll: true,
                htmlCache: {
                    grid: null,
                    header: null,
                    content: null,
                    footer: null,
                    rowsArray: [],
                    scrollBody: null
                },
                configFunctions: {
                    getCollectionLength: configParams.getSourceLength,
                    getRowTemplate: configParams.getRowTemplate,
                    getHeaderTemplate: configParams.getHeaderTemplate,
                    getDataElement: configParams.getDataElement,
                    isSelected: configParams.selection_isSelected,
                    select: configParams.selection_select,
                    selectRange: configParams.selection_selectRange,
                    getSelectedRows: configParams.selection_getSelectedRows,
                    setSelectedRows: configParams.selection_setSelectedRows,
                    setSelectedEntity: configParams.setSelectedEntity,
                    event_onRowClick: configParams.event_onRowClick,
                    event_onRowDoubleClick: configParams.event_onRowDoubleClick,
                    event_onRowRightClick: configParams.event_onRowRightClick,
                    event_onRowHeaderClick: configParams.event_onHeaderRowClick,
                    event_onHeaderRowDoubleClick: configParams.event_onHeaderRowDoubleClick,
                    event_onRowHeaderRightClick: configParams.event_onHeaderRowRightClick,
                    event_onHeaderRebuild: configParams.event_onHeaderRebuild
                },
                scrollVars: {
                    lastScrollTop: 0,
                    lastScrollLeft: 0,
                    halt: false,
                    firstTop: 0,
                    currentScrollLeft: 0
                },
                selectionVars: {
                    lastKeyKodeUsed: "none",
                    lastRowSelected: 0,
                    onClicked: false
                },
                css: {
                    css_wrapper: "vr-widget-grid",
                    css_rowSelected: "vr-widget-grid-row-selected",
                    css_row: "vr-widget-grid-row",
                    //used in header and normal rows
                    css_rowCell: "vr-widget-grid-row-cell",
                    css_rowColumn: "vr-widget-grid-row-column",
                    //column number added to this by system
                    css_headerCell: "vr-widget-grid-row-cell-header",
                    css_headerColumn: "vr-widget-grid-row-header-column",
                    //column number added to this by system
                    css_gridColumn: "vr-widget-grid-column",
                    //column number added to this by system
                    css_rowHeader: "vr-widget-grid-row-header",
                    css_mainHeader: "vr-widget-grid-header",
                    css_mainContent: "vr-widget-grid-body",
                    css_mainFooter: "vr-widget-grid-footer",
                    css_scrollBody: "vr-widget-grid-body-scroll",
                    css_rowEvenAlt: "vr-widget-grid-row-",
                    //uses event and alt depending type..
                    css_even: "even",
                    css_alt: "alt"


                }
            };





            /**************************************************************************************
             * get column totale width
             *************************************************************************************/
            var html_getColumnWidth = function() {
                    var total = 0;
                    for (var i = 0; i < vars.columnWidths.length; i++) {
                        total = total + parseInt(vars.columnWidths[i], 10);
                    }
                    return total;

                };











            /**************************************************************************************
             * fills data into row
             *************************************************************************************/
            var html_fillData = function(type, no) {

					
					
					

                    var i;
                    for (i = 0; i < vars.htmlCache.rowsArray.length; i++) {
                        var currentRow = vars.htmlCache.rowsArray[i].style.top.replace("px", "") / vars.rowHeight;
                        var row = vars.htmlCache.rowsArray[i];
                        if (type === "onlyOne") {
                            if (no === currentRow) {
                                vars.configFunctions.getDataElement(currentRow, row, html_insertTemplate, vars.configFunctions.getRowTemplate, vars, true);
                                if (vars.configFunctions.isSelected(currentRow)) {
                                    row.classList.add(vars.css.css_rowSelected);
                                }
                                else {
                                    row.classList.remove(vars.css.css_rowSelected);
                                }
                            }

                        }
                        else {
                            if (type === "onlySelection") {
                                if (vars.configFunctions.isSelected(currentRow)) {
                                    row.classList.add(vars.css.css_rowSelected);
                                }
                                else {
                                    row.classList.remove(vars.css.css_rowSelected);
                                }
                            }
                            else {
                                var row = vars.htmlCache.rowsArray[i];
                                vars.configFunctions.getDataElement(currentRow, row, html_insertTemplate, vars.configFunctions.getRowTemplate, vars, true);
                                if (vars.configFunctions.isSelected(currentRow)) {
                                    row.classList.add(vars.css.css_rowSelected);
                                }
                                else {
                                    row.classList.remove(vars.css.css_rowSelected);
                                }
                            }
                        }
                    }
                };





            /**************************************************************************************
             * mustache cache
             *************************************************************************************/
            var html_cacheTemplate = function(template) {
                    Mustache.parse(template);
                };





            /**************************************************************************************
             * inserts template
             *************************************************************************************/
            var html_insertTemplate = function(template, entity, attributeNames) {
                    var tempColumns = document.createElement("DIV");
                    tempColumns.innerHTML = Mustache.render(template, entity, attributeNames);
                    var i;
                    for (i = 0; i < tempColumns.children.length; i++) {
                        var width = vars.columnWidths[i];
                        if (width === undefined) {
                            width = 100;
                        }
                        tempColumns.children[i].style.height = "100%";
                        tempColumns.children[i].style.width = width + "px";
                        tempColumns.children[i].classList.add(vars.css.css_rowCell);
                        tempColumns.children[i].classList.add(vars.css.css_rowColumn + i);
                        tempColumns.children[i].classList.add(vars.css.css_gridColumn + i);
                        if (vars.lockedColumns > i) {
                            tempColumns.children[i].style.left = vars.scrollVars.currentScrollLeft + "px";
                            tempColumns.children[i].style.zIndex = "100";
                            tempColumns.children[i].style.position = "relative";
                        }
                    }
                    return tempColumns.innerHTML;
                };





            /**************************************************************************************
             * sets row to empty
             *************************************************************************************/
            var setEmptyTemplate = function() {
                    return html_insertTemplate(vars.configFunctions.getRowTemplate({}, []), {});
                };





            /**************************************************************************************
             * gets the main div to create grid in
             *************************************************************************************/
            var html_GetGridWrapper = function() {
                    vars.htmlCache.grid = vars.node ////document.getElementById(vars.id);
                    vars.htmlCache.grid.className = vars.css.css_wrapper;
                    //get default height and width
                    vars.gridHeight = vars.htmlCache.grid.clientHeight;
                    vars.gridWidght = vars.htmlCache.grid.clientWidth;
                };



            /**************************************************************************************
             * add header template to header div
             *************************************************************************************/
            var html_addHeaderTemplate = function() {

                    var tempColumns = document.createElement("DIV");
                    tempColumns.innerHTML = vars.configFunctions.getHeaderTemplate(vars.headerNames, vars.attributeNames);
                    var i;
                    for (i = 0; i < tempColumns.children.length; i++) {
                        var width = vars.columnWidths[i];
                        if (width === undefined) {
                            width = 100;
                        }
                        tempColumns.children[i].style.height = "100%";
                        tempColumns.children[i].style.width = width + "px";
                        tempColumns.children[i].classList.add(vars.css.css_headerCell);
                        tempColumns.children[i].classList.add(vars.css.css_headerColumn + i);
                        tempColumns.children[i].classList.add(vars.css.css_gridColumn + i);
                    }

                    //rowCell
                    var row = document.createElement("DIV");
                    row.className = vars.css.css_row + " " + vars.css.css_rowHeader;
                    row.style.top = top + "px";
                    row.style.height = vars.headerHeight + "px";
                    row.style.minWidth = vars.htmlCache.grid.offsetWidth + "px";
                    row.style.width = html_getColumnWidth() + "px";
                    row.innerHTML = tempColumns.innerHTML;
                    if (vars.htmlCache.header.childElementCount > 0) {
                        vars.htmlCache.header.removeChild(vars.htmlCache.header.childNodes[0])
                    }
                    vars.htmlCache.header.appendChild(row);
                    vars.configFunctions.event_onHeaderRebuild(vars.htmlCache.header.children[0], vars);
                };



            /**************************************************************************************
             * add header div
             *************************************************************************************/
            var html_addHeader = function() {
                    //create and append header div
                    vars.htmlCache.header = document.createElement("DIV");
                    vars.htmlCache.header.className = vars.css.css_mainHeader;
                    vars.htmlCache.header.style.height = vars.headerHeight + "px";
                    html_addHeaderTemplate();

                    vars.htmlCache.grid.appendChild(vars.htmlCache.header);
                };





            /**************************************************************************************
             * add content div
             *************************************************************************************/
            var html_addContent = function() {
                    //calculate content height
                    var gridWrapperheight = vars.gridHeight;
                    var headerAndFooterHeight = vars.headerHeight + vars.footerHeight;
                    vars.contentHeight = gridWrapperheight - headerAndFooterHeight;
                    //create and append content div
                    vars.htmlCache.content = document.createElement("DIV");
                    vars.htmlCache.content.className = vars.css.css_mainContent;
                    vars.htmlCache.content.style.height = vars.contentHeight + "px";
                    vars.htmlCache.grid.appendChild(vars.htmlCache.content);
                };





            /**************************************************************************************
             * adds the footer
             *************************************************************************************/
            var html_addFooter = function() {
                    //create and append 
                    vars.htmlCache.footer = document.createElement("DIV");
                    vars.htmlCache.footer.className = vars.css.css_mainFooter;
                    vars.htmlCache.footer.style.height = vars.footerHeight + "px";
                    vars.htmlCache.grid.appendChild(vars.htmlCache.footer);
                };





            /**************************************************************************************
             * sets scroll body
             *************************************************************************************/
            var html_setScrollBodyHeightToVar = function() {
                    var collectionLength = vars.configFunctions.getCollectionLength();
                    vars.scrollBodyHeight = collectionLength * vars.rowHeight;
                };






            /**************************************************************************************
             * add the scroll body
             *************************************************************************************/
            var html_addScrollBody = function() {
                    html_setScrollBodyHeightToVar();
                    //create and append 
                    vars.htmlCache.scrollBody = document.createElement("DIV");
                    vars.htmlCache.scrollBody.className = vars.css.css_scrollBody;
                    vars.htmlCache.scrollBody.style.height = vars.scrollBodyHeight + "px";
                    vars.htmlCache.content.appendChild(vars.htmlCache.scrollBody);
                };





            /**************************************************************************************
             * add the rows to scrolldiv
             *************************************************************************************/
            var html_adjustRowWidth = function() {
                    for (var i = 0; i < vars.htmlCache.rowsArray.length; i++) {
                        vars.htmlCache.rowsArray[i].style.width = html_getColumnWidth() + "px";
                    }
                };






            /**************************************************************************************
             * add the rows to scrolldiv
             *************************************************************************************/
            var html_addRows = function() {
                    var minimumRowsNeeded = parseInt(vars.contentHeight / vars.rowHeight, 10);
                    if (minimumRowsNeeded % 2 === 1) {
                        minimumRowsNeeded = minimumRowsNeeded + 15;
                    }
                    else {
                        minimumRowsNeeded = minimumRowsNeeded + 14;
                    }
                    var top = 0;
                    var i = 0;
                    for (i = 0; i < minimumRowsNeeded; i++) {
                        //see if its alt or even row
                        var rowClassType;
                        if (i % 2 === 0) {
                            rowClassType = vars.css.css_even;
                        }
                        else {
                            rowClassType = vars.css.css_alt;
                        }
                        //create row
                        var row = document.createElement("DIV");
                        row.className = vars.css.css_row + " " + vars.css.css_rowEvenAlt + rowClassType;
                        row.style.top = top + "px";
                        row.style.height = vars.rowHeight + "px";
                        row.style.minWidth = vars.htmlCache.grid.offsetWidth + "px";
                        row.style.width = html_getColumnWidth() + "px";
                        row.innerHTML = setEmptyTemplate();
                        vars.htmlCache.scrollBody.appendChild(row);
                        vars.htmlCache.rowsArray.push(row);
                        //set new top
                        top = top + vars.rowHeight;
                    }
                };





            /**************************************************************************************
             * fixes scrolling / top of divs
             * phones/pads and ie will be a little laggy on some if dragging with pointer down and rigth as same time.. and locked columns
             *************************************************************************************/
            var event_onScoll = function(event, triggerBig) {
                    var currentScrollTop = vars.htmlCache.content.scrollTop;
                    var currentScrollLeft = vars.htmlCache.content.scrollLeft;

                    var lockToVertOrHoz = true; //if you start dragging with mouse/pad then only allow up/down or right/left..  (
                    //if this is tru, then set scrollLeft to 0
                    if (vars.noHorzScroll) {
                        vars.htmlCache.content.scrollLeft = 0;
                    }


                    //up/down scrolling
                    if (currentScrollTop !== vars.scrollVars.lastScrollTop || triggerBig === true) {

                        //just make sure header is in sync.. //this is a issue when using middel button mouse...               	
                        if (vars.scrollVars.currentScrollLeft !== currentScrollLeft) {
                            var header = document.querySelector('#' + vars.id + ' .' + vars.css.css_rowHeader);

                            if (lockToVertOrHoz) {
                                header.style.left = -vars.scrollVars.currentScrollLeft + "px";
                                vars.htmlCache.content.scrollLeft = vars.scrollVars.currentScrollLeft;
                            }
                            else {
                                header.style.left = -currentScrollLeft + "px";
                                vars.scrollVars.currentScrollLeft = currentScrollLeft;
                            }


                            //is horz scroll
                            if (vars.lockedColumns > 0) {

                                currentScrollLeft = vars.htmlCache.content.scrollLeft; //need the updated one...
                                for (var lockedColNo = vars.lockedColumns; lockedColNo--;) {
                                    var fix = document.querySelectorAll('#' + vars.id + ' .' + vars.css.css_gridColumn + lockedColNo);
                                    //for(var i = 0; i < fix.length; i++){
                                    for (var i = fix.length; i--;) {
                                        fix[i].style.left = currentScrollLeft + "px";
                                        fix[i].style.zIndex = "100";
                                        fix[i].style.position = "relative";
                                    }
                                }
                            }
                        }




                        //is vert scroll
                        //check if down scroll.
                        var isDownScoll = true;
                        if (currentScrollTop < vars.scrollVars.lastScrollTop) {
                            isDownScoll = false;
                            //vars.htmlCache.rowsArray.reverse();
                        }
                        //check if big scroll
                        var isBigScroll = false;
                        if (currentScrollTop > vars.scrollVars.lastScrollTop + vars.bigScrollLimit || currentScrollTop < vars.scrollVars.lastScrollTop - vars.bigScrollLimit || triggerBig === true) {
                            isBigScroll = true;
                        }
                        //reset scrolltop
                        vars.scrollVars.lastScrollTop = currentScrollTop;
                        //check if big scroll
                        if (isBigScroll) {
                            vars.scrollVars.halt = true;
                            clearTimeout(vars.scrollVars.timer);
                            vars.scrollVars.timer = setTimeout(function() {
                                var currentRow = parseInt(vars.scrollVars.lastScrollTop / vars.rowHeight, 10);
                                vars.scrollVars.firstTop = currentRow * vars.rowHeight; //need this for later
                                var rowTop = vars.rowHeight * currentRow;
                                var i;
                                var bottomHit;
                                var bottomhitI;
                                for (i = 0; i < vars.htmlCache.rowsArray.length; i++) {

                                    //ajusts the row
                                    var adjustIt = function() {
                                            var row = vars.htmlCache.rowsArray[i];
                                            row.style.top = rowTop + "px";
                                            row.innerHTML = setEmptyTemplate();
                                            rowTop = rowTop + vars.rowHeight;
                                            //vars.configFunctions.getDataElement(currentRow, row, html_insertTemplate, vars.configFunctions.getRowTemplate, vars, isDownScoll, true);
                                            if (vars.configFunctions.isSelected(currentRow)) {
                                                row.classList.add(vars.css.css_rowSelected);
                                            }
                                            else {
                                                row.classList.remove(vars.css.css_rowSelected);
                                            }
                                        };

                                    if (currentRow >= 0 && currentRow <= vars.configFunctions.getCollectionLength() - 1) {
                                        adjustIt();
                                    }
                                    //if collection is smaller than the actuall row then I need to bring it with me
                                    if (currentRow > vars.configFunctions.getCollectionLength() - 1) {
                                        adjustIt();
                                    }

                                    //need to adjust my array
                                    if (currentRow === vars.configFunctions.getCollectionLength() - 1 && vars.htmlCache.rowsArray.length < vars.configFunctions.getCollectionLength() - 1) {
                                        bottomHit = true;
                                        bottomhitI = i;
                                    }
                                    currentRow = currentRow + 1;
                                }
                                //if I hit bottom, then I need to adjust the rowsArray.... code under fixes this.
                                if (bottomHit) {
                                    var lastTop = (vars.configFunctions.getCollectionLength() - 1) * vars.rowHeight;
                                    var firstTop = parseInt(vars.htmlCache.rowsArray[0].style.top.replace("px", ""), 10);
                                    for (i = vars.htmlCache.rowsArray.length - 1; i > bottomhitI; i--) {
                                        firstTop = firstTop - vars.rowHeight;
                                        var element = vars.htmlCache.rowsArray[i];
                                        element.style.top = firstTop + "px";
                                    }

                                }
                                
                                vars.htmlCache.rowsArray.sort(
								 	function(a,b) { 
								 	return parseInt(a.style.top.replace("px", "")) - parseInt(b.style.top.replace("px", "")) 
								 });
                                
                                
                                
                                
                                html_fillData();
                                vars.scrollVars.halt = false;
                            }, vars.getDataScrollDelay);
                        }
                        else {
                            //small scroll.
                            if (vars.scrollVars.halt === false) {
                                //set new top
                                var i;
                                var newTopValue;
                                var currentRow;
                                currentRow = parseInt((vars.scrollVars.lastScrollTop / vars.rowHeight), 10);
                                vars.scrollVars.firstTop = currentRow * vars.rowHeight;
                                var rowsUpdated = 0;
                                for (i = 0; i < vars.htmlCache.rowsArray.length; i++) {
                                    var row = vars.htmlCache.rowsArray[i];
                                    var rowTop = parseInt(row.style.top.replace("px", ""), 10);
                                    var update = false;
                                    if (isDownScoll) {
                                        if (rowTop < (currentScrollTop - vars.rowHeight)) {
                                            update = true;
                                            newTopValue = rowTop + (vars.rowHeight * vars.htmlCache.rowsArray.length) + "px";
                                            currentRow = (rowTop + (vars.rowHeight * vars.htmlCache.rowsArray.length)) / vars.rowHeight;
                                        }
                                    }
                                    else {
                                        if (rowTop > ((currentScrollTop + vars.contentHeight))) {
                                            update = true;
                                            newTopValue = rowTop - (vars.rowHeight * vars.htmlCache.rowsArray.length) + "px";
                                            currentRow = (rowTop - (vars.rowHeight * vars.htmlCache.rowsArray.length)) / vars.rowHeight;
                                        }
                                    }
                                    if (update === true && currentRow >= 0 && currentRow <= vars.configFunctions.getCollectionLength() - 1) {
                                        rowsUpdated = rowsUpdated + 1
                                        row.style.top = newTopValue;
                                        row.innerHTML = setEmptyTemplate();
                                        vars.configFunctions.getDataElement(currentRow, row, html_insertTemplate, vars.configFunctions.getRowTemplate, vars, isDownScoll, false);
                                        if (vars.configFunctions.isSelected(currentRow)) {
                                            row.classList.add(vars.css.css_rowSelected);
                                        }
                                        else {
                                            row.classList.remove(vars.css.css_rowSelected);
                                        }
                                    }
                                }
                                
                                vars.htmlCache.rowsArray.sort(
								 	function(a,b) { 
								 	return parseInt(a.style.top.replace("px", "")) - parseInt(b.style.top.replace("px", "")) 
								 });
                                
                            }
                        }
                    }
                    else {
                        if (vars.scrollVars.currentScrollLeft !== currentScrollLeft) {
                            currentScrollLeft = vars.htmlCache.content.scrollLeft;
                            var header = document.querySelector('#' + vars.id + ' .' + vars.css.css_rowHeader);
                            header.style.left = -currentScrollLeft + "px";
                            vars.scrollVars.currentScrollLeft = currentScrollLeft;

                            currentScrollLeft = vars.htmlCache.content.scrollLeft;
                            //is horz scroll
                            if (vars.lockedColumns > 0) {
                                //for(var lockedColNo = 0; lockedColNo < vars.lockedColumns; lockedColNo++){
                                for (var lockedColNo = vars.lockedColumns; lockedColNo--;) {
                                    var fix = document.querySelectorAll('#' + vars.id + ' .' + vars.css.css_gridColumn + lockedColNo);
                                    //for(var i = 0; i < fix.length; i++){
                                    for (var i = fix.length; i--;) {
                                        fix[i].style.left = currentScrollLeft + "px";
                                        fix[i].style.zIndex = "100";
                                        fix[i].style.position = "relative";
                                    }
                                }
                            }
                        }
                    } // end check scroll type
                }; //end scroll event


            /**************************************************************************************
             * fixes highlisgt and select
             *************************************************************************************/
            var event_onclickRow = function(e) {

                    //vars.selectionVars.
                    var rowHeight, currentRow, thisTop, currentKeyKode, isSel;

                    function remove(currentRow) {
                        var selectedRows, i;

                        function removeNo(array, row) {
                            array.splice(row, 1);
                        }
                        //sel = that.params.source.getSelection();
                        selectedRows = vars.configFunctions.getSelectedRows();
                        for (i = 0; i < selectedRows.length; i++) {
                            if (selectedRows[i] === currentRow) {
                                removeNo(selectedRows, i);
                                i--;
                            }
                        }
                        vars.configFunctions.setSelectedRows(selectedRows);
                    }

                    thisTop = e.currentTarget.style.top.replace("px", "");
                    rowHeight = vars.rowHeight;
                    currentRow = Math.round(thisTop / rowHeight);

                    if (currentRow !== vars.selectionVars.lastRowSelected) {
                        vars.selectionVars.onClicked = true;


                        if (currentRow <= (vars.configFunctions.getCollectionLength() - 1)) {
                            // sel = that.params.source.getSelection();
                            if (vars.isMultiSelect === true) {
                                currentKeyKode = "";
                                if (e.shiftKey) {
                                    currentKeyKode = "shift";
                                }
                                if (e.ctrlKey) {
                                    currentKeyKode = "ctrl";
                                }
                                if (!e.ctrlKey && !e.shiftKey) {
                                    currentKeyKode = "none";
                                }
                                if (currentKeyKode === "none") {                                       
                                    vars.configFunctions.select(currentRow);
                                    //html_fillData("onlySelection");
                                    
                                }
                                else {
                                    if (vars.selectionVars.lastKeyKodeUsed === "shift" && currentKeyKode === "ctrl") {
                                        isSel = vars.configFunctions.isSelected(currentRow);
                                        if (isSel === true) {
                                            remove(currentRow);
                                        }
                                        else {
                                            vars.configFunctions.select(currentRow, true);
                                        }
                                    }
                                    else {
                                        if (vars.selectionVars.lastKeyKodeUsed === "ctrl" && currentKeyKode === "shift") {
                                            vars.configFunctions.selectRange(vars.selectionVars.lastRowSelected, currentRow);
                                        }
                                        else {
                                            if (vars.selectionVars.lastKeyKodeUsed === "ctrl" && currentKeyKode === "ctrl") {
                                                isSel = vars.configFunctions.isSelected(currentRow);
                                                if (isSel === true) {
                                                    remove(currentRow);
                                                }
                                                else {
                                                    vars.configFunctions.select(currentRow, true);
                                                }
                                            }
                                            else {
                                                if (vars.selectionVars.lastKeyKodeUsed === "none" && currentKeyKode === "ctrl") {
                                                    isSel = vars.configFunctions.isSelected(currentRow);
                                                    if (isSel === true) {
                                                        remove(currentRow);
                                                    }
                                                    else {
                                                        vars.configFunctions.select(currentRow, true);
                                                    }
                                                }
                                                else {
                                                    if (vars.selectionVars.lastKeyKodeUsed === "shift" && currentKeyKode === "shift") {
                                                        if (vars.selectionVars.lastRowSelected > currentRow) {
                                                            vars.configFunctions.selectRange(currentRow, vars.selectionVars.lastRowSelected);
                                                        }
                                                        else {
                                                            vars.configFunctions.selectRange(vars.selectionVars.lastRowSelected, currentRow);
                                                        }
                                                    }
                                                    else {
                                                        if (vars.selectionVars.lastKeyKodeUsed === "none" && currentKeyKode === "shift") {
                                                            if (vars.selectionVars.lastRowSelected !== null) {
                                                                if (vars.selectionVars.lastRowSelected > currentRow) {
                                                                    vars.configFunctions.selectRange(currentRow, vars.selectionVars.lastRowSelected);
                                                                }
                                                                else {
                                                                    vars.configFunctions.selectRange(vars.selectionVars.lastRowSelected, currentRow);
                                                                }
                                                            }
                                                            else {
                                                                vars.configFunctions.select(currentRow);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                vars.configFunctions.select(currentRow);
                            }





                            //if user selects row 2-5, we haveto allow him to hold shift and click on row 9 and have row 2-9 highlighted
                            if (vars.selectionVars.lastKeyKodeUsed === "none" && currentKeyKode === "shift") {

                            }
                            else {


                                if (vars.selectionVars.lastKeyKodeUsed === "shift" && currentKeyKode === "shift") {
                                    //nothing, we wanto keep it where is is, so if user highlighs lower, he can
                                }
                                else {
                                    vars.selectionVars.lastRowSelected = currentRow;
                                }
                            }
                            vars.selectionVars.lastKeyKodeUsed = currentKeyKode;




                            html_fillData("onlySelection");


                            //so current selected entity get changed on click
                            if (currentRow >= 0) {
                                vars.configFunctions.setSelectedEntity(currentRow, {
                                    onSuccess: function() {
                                        vars.selectionVars.onClicked = false;
                                    }
                                });
                            }
                        }
                    }
                    else {
                        if (e.ctrlKey) {
                            currentKeyKode = "ctrl";
                        }
                        if (currentKeyKode === "ctrl") {
                            vars.selectionVars.lastKeyKodeUsed = currentKeyKode;
                            isSel = vars.configFunctions.isSelected(currentRow);
                            if (isSel === true) {
                                remove(currentRow);
                            }
                            vars.selectionVars.lastRowSelected = -1
                            html_fillData("onlySelection");
                        }
                    }
                };





            /**************************************************************************************
             * on double click event
             *************************************************************************************/
            var event_onDoubleClickRow = function(e) {
                    vars.configFunctions.event_onRowDoubleClick(e);
                    //make editable here if div.content
                    //add class to so text can be highlighted
                };





            /**************************************************************************************
             * on single click
             *************************************************************************************/
            var event_onSingleClickRow = function(e) {
                    event_onclickRow(e);
                    vars.configFunctions.event_onRowClick(e);
                };





            /**************************************************************************************
             * on right click
             *************************************************************************************/
            var event_onRightClickRow = function(e) {
                    event_onclickRow(e);
                    vars.configFunctions.event_onRowRightClick(e);
                };





            /**************************************************************************************
             * on single click
             *************************************************************************************/
            var event_onMouseDownRow = function(e) {
                    e.preventDefault();
                    if (e.button === 2) {
                        event_onRightClickRow(e);
                    }

                };

            /**************************************************************************************
             * on double click event
             *************************************************************************************/
            var event_onDoubleClickHeaderRow = function(e) {
                    vars.configFunctions.event_onHeaderRowDoubleClick(e);
                    //make editable here if div.content
                    //add class to so text can be highlighted
                };


            /**************************************************************************************
             * on single click Header
             *************************************************************************************/
            var event_onSingleClickHeaderRow = function(e) {

                    vars.configFunctions.event_onRowHeaderClick(e);
                };





            /**************************************************************************************
             * on right click Header
             *************************************************************************************/
            var event_onRightClickHeaderRow = function(e) {

                    vars.configFunctions.event_onRowHeaderRightClick(e);
                };





            /**************************************************************************************
             * on single click Header
             *************************************************************************************/
            var event_onMouseDownHeaderRow = function(e) {
                    e.preventDefault();
                    if (e.button === 2) {
                        event_onRightClickHeaderRow(e);
                    }

                };




            /**************************************************************************************
             * hiding scrollbars when not needed
             *************************************************************************************/
            var html_adjustScrollBars = function() {

                    var columnSize = html_getColumnWidth();
                    var bodyWidth = vars.htmlCache.content.offsetWidth;

                    var collectionHeight = vars.configFunctions.getCollectionLength() * vars.rowHeight;
                    var bodyHeight = vars.htmlCache.content.offsetHeight;
                    vars.noHorzScroll = false;
                    if (collectionHeight > bodyHeight && columnSize > bodyWidth) {
                        vars.htmlCache.content.style.overflowY = "";
                        vars.htmlCache.content.style.overflowX = "";
                        vars.htmlCache.content.style.overflow = "auto";
                    }

                    if (collectionHeight > bodyHeight && columnSize <= bodyWidth) {
                        vars.htmlCache.content.style.overflow = "";
                        vars.htmlCache.content.style.overflowY = "scoll";
                        vars.htmlCache.content.style.overflowX = "hidden";
                        vars.noHorzScroll = true;
                    }

                    if (collectionHeight <= bodyHeight && columnSize > bodyWidth) {
                        vars.htmlCache.content.scrollTop = 0;
                        vars.htmlCache.content.style.overflow = "";
                        vars.htmlCache.content.style.overflowY = "hidden";
                        vars.htmlCache.content.style.overflowX = "scoll";
                        vars.noHorzScroll = false;
                        setTimeout(function() {
                            event_onScoll({}, true)
                        }, 50);

                    }

                    if (collectionHeight < bodyHeight && columnSize < bodyWidth) {
                        vars.htmlCache.content.scrollTop = 0;
                        vars.htmlCache.content.style.overflowY = "";
                        vars.htmlCache.content.style.overflowX = "";
                        vars.htmlCache.content.style.overflow = "hidden";
                        setTimeout(function() {
                            event_onScoll({}, true)
                        }, 50);
                    }

                };

            /**************************************************************************************
             * add the resizble columns event //this uses jquery! no idea how to do it without it!
             *************************************************************************************/
            var event_ResizableColumns = function(that) {

                    if (vars.resizableColumns) {
                        for (var i = 0; i < vars.headerNames.length; i++) {
                            $("#" + vars.id + " ." + vars.css.css_headerColumn + i).resizable({
                                start: function() {
                                    //nothing for now
                                },
                                alsoResize: "#" + vars.id + " ." + vars.css.css_rowColumn + i,
                                resize: function(event, ui) {
                                    var sizeArray = 0;
                                    for (var i = 0; i < vars.htmlCache.rowsArray[0].childElementCount; i++) {
                                        sizeArray = sizeArray + vars.htmlCache.rowsArray[0].children[i].offsetWidth;
                                    }
                                    vars.htmlCache.header.firstElementChild.style.width = sizeArray + 1 + "px";
                                    for (var i = 0; i < vars.htmlCache.rowsArray.length; i++) {
                                        vars.htmlCache.rowsArray[i].style.width = sizeArray + 1 + "px";;
                                    }
                                },
                                stop: function(e, ui) {
                                    var sizeArray = [];
                                    for (var i = 0; i < vars.htmlCache.rowsArray[0].childElementCount; i++) {
                                        sizeArray.push(vars.htmlCache.rowsArray[0].children[i].offsetWidth);
                                    }
                                    vars.columnWidths = sizeArray;
                                    html_adjustRowWidth();
                                    html_adjustScrollBars();
                                    html_fillData();

                                }
                            });
                            $("#" + vars.id + " ." + vars.css.css_headerColumn + i + " .ui-icon").hide();
                        }
                    }
                };


            /**************************************************************************************************
     	Helper function for sortable event columns
     	****************************************************************************************************/
            var utilSortable_getIndex = function(itm, list) {
                    var i;
                    for (i = 0; i < list.length; i++) {
                        if (itm[0] === list[i]) break;
                    }
                    return i >= list.length ? -1 : i;
                };




            /**************************************************************************************
             * add sortable column event //this uses jquery! no idea how to do it without it!
             *************************************************************************************/

            var event_SortableColumns = function(that) {

                    if (vars.sortableColumns) {
                        $("#" + vars.id + " ." + vars.css.css_rowHeader).disableSelection();
                        $("#" + vars.id + " ." + vars.css.css_rowHeader).sortable({
                            axis: 'x',
                            start: function(event, ui) {
                                vars.indexBefore = utilSortable_getIndex(ui.item, $("#" + vars.id + " ." + vars.css.css_headerCell));
                            },
                            change: function(event, ui) {
                                var indexAfter = utilSortable_getIndex(ui.helper, $("#" + vars.id + " ." + vars.css.css_headerCell));
                            },
                            stop: function(event, ui) {
                                var indexAfter = utilSortable_getIndex(ui.item, $("#" + vars.id + " ." + vars.css.css_headerCell));

                                //rebuild the template, and update it
                                var x = vars.headerNames.splice(vars.indexBefore, 1)[0];
                                vars.headerNames.splice(indexAfter, 0, x);
                                var x = vars.attributeNames.splice(vars.indexBefore, 1)[0];
                                vars.attributeNames.splice(indexAfter, 0, x);
                                var x = vars.columnWidths.splice(vars.indexBefore, 1)[0];
                                vars.columnWidths.splice(indexAfter, 0, x);
                                html_addHeaderTemplate();
                                html_fillData();
                                event_SortableColumns();
                                event_ResizableColumns();
                                //fix for locked columns...
                                var currentScrollLeft = vars.htmlCache.content.scrollLeft;
                                var header = document.querySelector('#' + vars.id + ' .' + vars.css.css_rowHeader);
                                header.style.left = -currentScrollLeft + "px";
                                vars.scrollVars.currentScrollLeft = currentScrollLeft;
                                if (vars.lockedColumns > 0) {
                                    //for(var lockedColNo = 0; lockedColNo < vars.lockedColumns; lockedColNo++){
                                    for (var lockedColNo = vars.lockedColumns; lockedColNo--;) {
                                        var fix = document.querySelectorAll('#' + vars.id + ' .' + vars.css.css_gridColumn + lockedColNo);
                                        //for(var i = 0; i < fix.length; i++){
                                        for (var i = fix.length; i--;) {
                                            fix[i].style.left = currentScrollLeft + "px";
                                            fix[i].style.zIndex = "100";
                                            fix[i].style.position = "relative";
                                        }
                                    }
                                }
                            }
                        });
                    }
                };




            /**************************************************************************************
             * add the events
             *************************************************************************************/
            var event_addEvents = function() {
                    //add neede events
                    vars.htmlCache.content.addEventListener("scroll", event_onScoll);
                    vars.htmlCache.rowsArray.forEach(function(row) {
                        row.addEventListener("contextmenu", event_onMouseDownRow);
                        row.addEventListener("dblclick", event_onDoubleClickRow);
                        row.addEventListener("click", event_onSingleClickRow);
                    });


                    vars.htmlCache.header.addEventListener("contextmenu", event_onMouseDownHeaderRow);
                    vars.htmlCache.header.addEventListener("dblclick", event_onDoubleClickHeaderRow);
                    vars.htmlCache.header.addEventListener("click", event_onSingleClickHeaderRow);


                    //event_ResizableColumns(); //this uses jquery!
                    event_SortableColumns(); //this uses jquery!
                };


            /**************************************************************************************
             * add the html
             *************************************************************************************/
            var html_addHtml = function() {
                    //add needed html
                    html_GetGridWrapper();
                    html_addHeader();
                    html_addContent();
                    html_addFooter();
                    html_addScrollBody();
                    html_addRows();
                    html_cacheTemplate(vars.configFunctions.getRowTemplate({}, []));
                    html_adjustScrollBars();

                };





            /**************************************************************************************
             * will create the actuall grid
             *************************************************************************************/
            var init = function() {
                    //add html
                    html_addHtml();

                    //add events
                    event_addEvents();
                    //fillData
                    html_fillData();

                    //this needs to trigger after the actuall class is created... so first time its not picked up by system
//                    setTimeout(function() {
//                        vars.configFunctions.event_onHeaderRebuild(vars.htmlCache.header.children[0], vars);
//                        event_ResizableColumns()
//                    }, 0);

                };
            //create grid
            init();





            /**************************************************************************************
             * public functions
             *************************************************************************************/
            this.updateAllRows = html_fillData;


            //needed for adjusting when new collection
            this.adjustScollBody = function(resetToTop) {

                if (resetToTop) {
                    vars.htmlCache.content.scrollTop = 0;
                }
                //updateScrollBody height var
                html_setScrollBodyHeightToVar();
                //set hight to scrollbody div
                vars.htmlCache.scrollBody.style.height = vars.scrollBodyHeight + "px";
            };


            this.updateHeaderTemplate = function() {
                html_addHeaderTemplate();
                event_ResizableColumns();
                event_SortableColumns();
            };

            //adjusts row witdth
            this.html_adjustRowWidth = html_adjustRowWidth;


            //when highlighting
            this.isHighlighting = function() {
                return vars.selectionVars.onClicked;
            };


            //setting scrollheight when on elelment chnaged eetc
            this.scrollTopRow = function(row) {
                var curentScrollTop = vars.htmlCache.content.scrollTop;
                var scrollContentHeight = vars.htmlCache.content.scrollTop + vars.htmlCache.content.offsetHeight-vars.rowHeight;
                var nextTop = row * vars.rowHeight;
                if (curentScrollTop < nextTop && nextTop > scrollContentHeight) {
                    vars.htmlCache.content.scrollTop = row * vars.rowHeight;
                }
                if (curentScrollTop > nextTop && nextTop < scrollContentHeight) {
                    vars.htmlCache.content.scrollTop = row * vars.rowHeight;
                }
            };


            //returns arrays
            this.getColumnSetup = function() {
                var columnsObj = {
                    columnWidths: vars.columnWidths,
                    headerNames: vars.headerNames,
                    attributeNames: vars.attributeNames
                };
                return columnsObj;
            };



            //sets array (you still need to call a few functions after...
            this.setColumnSetup = function(columnsObj) {
                vars.columnWidths = columnsObj.columnWidths;
                vars.headerNames = columnsObj.headerNames;
                vars.attributeNames = columnsObj.attributeNames;
            };

            //will need this if we replace/rebuild header template
            this.event_ResizableColumns = event_ResizableColumns;
            this.event_SortableColumns = event_SortableColumns;

            // activate scrollbars checking
            this.adjustScrollBars = html_adjustScrollBars;


            //set footer
            this.setFooterHtml = function(inneHTML) {
                var footer = vars.node.querySelectorAll("." + vars.css.css_mainFooter)[0];
                footer.innerHTML = "";
                footer.appendChild(inneHTML);
            }

            this.getHtmlCache = function() {
                return vars.htmlCache;
            };

            this.setlastSlectedRow = function(no) {
                vars.selectionVars.lastRowSelected = no;
            }


        }; //end widget
    return vrWidgetGrid;

});