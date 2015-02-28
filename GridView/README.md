## Grid widget [Wakanda](http://wakanda.org)
* This allows you to display data in a grid
* Also allows you to resize columns, and move columns.

#####This widget uses 3rd party lib:
* Jquery: https://github.com/jquery (uses the one coming with wakanda, used for sortable and resize headers)
* mustasje.js : https://github.com/janl/mustache.js  (this is included)


[![Alt text for your video](http://img.youtube.com/vi/bmLeyyWKHzA/0.jpg)](https://www.youtube.com/watch?v=bmLeyyWKHzA)


#### Properties:

* __source__: Datasource of grid
* __grid columns__: This is the grid columns, header label, attribute in datasource and width
* __header height__: Height of header
* __row height__: Height of row
* __footer height__: Height of footer
* __header Click Sorting__: sort and add sort icon to header
* __resizable Columns__: makes column resizable -PS! this part uses jQuery resizable
* __sortable Columns__: makes column sortable/drag/drop -PS! this part uses jQuery sortable
* __get data scroll delay__: How fast you want it to get data after scrollstop
* __grid multiselect__: Setting this to tru will allow user to select multible rows
* __allow click and highlight__: allows user to doubleclick on cell, highlight text and copy it
* __read only__: sets grid to read only, if they chnage the old value will be set inn after focus is lost
* __auto save__: saves when user select another entity if entity is touched
* __refresh after autoSave__: rundServerRefresh after it have saved
* __locked Columns__: locaked columns from left, so when scrolling to the right these will allways display
* __desimal Type__: -1 is default, then it uses dot, you can replace this with comma if you want
* __number Rounding__: rounds numbers to this, and only display this number after desimal, will show full number when editing/entring to highlight
* __dateFormat__: dateformat to display in cells


-------------
#### Events:

* single click on row
* double click on row
* right click on row
* on cell Draw
* on cell header Draw
* on header click
* on header right click
* on header double click


-------------
#### Functions: $$("gridID")
* __.setSource(newSource, keepOldSelection)__: newSource:waf datasource, like sources.person, keepOldSelection: true/false
* __.getColumnSetup()__: returns object with 3 arrays: columnWidths,headerNames,attributeNames
* __.setColumnSetup(columnsObj)__: columnsObj: object with 3 arrays: columnWidths,headerNames,attributeNames








-------------
### Samples loacalization with desimal/dateformat and setting setting before grid is created

Add this to something that loads before page/widget (not in the waf.onLoad)
Y

```javascript
$("body").on("vrGridViewLoad", function(event, data){
			//here you could have checjked for localization etc
			//data that = this on the init in widget, so you could have loaded saved column layout or something ere
			data.that.desimalType(",");
			data.that.numberRounding(2);
			data.that.dateFormat("dd.mm.yy");
			
			//You can set all properties here like header, attributes, so if you have saved column setup earlier you can set it now if every user have own setup
			
		});
```


### Samples for On Cell Draw:

######Info, you will need to add this attribute datasourceattribute="name" to div to make it editable


Changing color of background
```javascript
try{
if(event.data.attributeName === "name3"){
   if(event.data.data.indexOf("3") !==-1){
      event.data.div.style.backgroundColor = 'lightgreen';
      event.data.div.style.color = "Black"; //so text done get color white when highlighted
   }
}
} catch(e){
 
}

```

Custom layout withing a cell
```javascript
try{
  if(event.data.attributeName === "name3"){
    var ID = event.data.entity.ID
    var name = event.data.entity.name3			
    event.data.div.innerHTML = '<div class="content" style= "height:51%; border-bottom: 1px solid rgb(230, 230, 230); padding: 3px 5px;">'+ID+'</div><div class="content" style= "height:49%; padding: 3px 5px;">'+name+'</div>'
}
} catch(e){
 
}

```

Coloring text red when edited but not saved
```javascript
try{
 if(event.data.autoSave === false && event.data.readOnly === false && event.data.entity._private.currentEntity.isTouched() === true){      
    event.data.div.style.color = "red"
}
} catch(e){

}
```


3 cells inside colum, one top, and 2 spilt in 2 under
```javascript
try {
   if (event.data.attributeName === "name3") {
       //values
      var cellTopValue = event.data.entity.ID.toString();
      var cellBottomLeftValue = event.data.entity.name3
      var cellBottomRightValue = event.data.entity.name3
      //colors
      var cellTopColor = "grey"; //for nothing use ""
      var cellBottomLeftColor = "red"
      var cellBottomRightColor = "lightgreen"
      //cells
       var cellTop = '<div class="content" style= "height:51%; position:relative; border-bottom: 1px solid rgb(230, 230, 230); padding: 3px 5px; background-color: ' + cellTopColor + '">' + cellTopValue + '</div>'
        var cellBottomLeft = '<div class="content" style= "height:49%; width:50%;  position:relative; padding: 3px 5px; background-color: ' + cellBottomLeftColor + '">' + cellBottomLeftValue + '</div>'
        var cellBottomRight = '<div class="content" style= "height:49%; width:50%; border-left: 1px solid rgb(230, 230, 230); top: -49%;float: right; position:relative; padding: 3px 5px; background-color: ' + cellBottomRightColor + '">' + cellBottomRightValue + '</div>'
        //add to cell
        event.data.div.innerHTML = cellTop + cellBottomLeft + cellBottomRight
    }
}
catch (e) {
 
}

```






#####Code for adding checkbox, that does not need rowclick to edit..:

```javascript
gridView3.cellDrawn = function gridView3_cellDrawn (event)
	{
		 try{
            if (event.data.attributeName === "myBool") {
                //values
                event.data.div.innerHTML = "";
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.checked = event.data.entity.myBool === true ? true:false;
                checkbox.className = "content";
                checkbox.style.top = "1px";
                checkbox.style.heigth = "15px";
                checkbox.style.left = "15px";
                checkbox.style.width = "15px";
                checkbox.setAttribute("datasourceattribute", "myBool");
                checkbox.addEventListener('myBoolClick', function(target){
                    var set = sources[event._emitter.gridDataSource().getID()][this.getAttribute("datasourceattribute")] === true ? false:true;
                    sources[event._emitter.gridDataSource().getID()][this.getAttribute("datasourceattribute")] = set;
                    sources[event._emitter.gridDataSource().getID()].autoDispatch();
                });
                event.data.div.appendChild(checkbox);

            }
        } catch(e){}	
	};
	
	
	gridView3.rowSingleClick = function gridView3_rowSingleClick (event)
	{
		var attribute = event.data.target.getAttribute("datasourceattribute");
        if(attribute === "myBool"){
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("myBoolClick", false, true); //need own trigger for this part...
            event.data.target.dispatchEvent(evt);
        }
	};
	

```


#####Code for adding select to cell

```javascript
  gridView3.rowSingleClick = function gridView3_rowSingleClick (event)
	{
		
		var attibute = event.data.target.getAttribute("datasourceattribute");
		if (attibute === "name") {
		    //values
		    if (event.data.target.type !== "select-one") {
		    	setTimeout(function(){
		        event.data.target.innerHTML = "";
		        var selectList = document.createElement('select');
		        selectList.type = "checkbox";
		        selectList.className = "content";
		        selectList.style.Index = "999";
		        selectList.style.top = "0px";
		        selectList.style.background = "transparent";
		        selectList.style.height = "100%";
		        selectList.style.width = "100%";
		        selectList.style.padding = "0px";
		        selectList.style.border = "none";
		        selectList.setAttribute("datasourceattribute", "name");
		        selectList.addEventListener('change', function(target) {
		            sources[event._emitter.gridDataSource().getID()][this.getAttribute("datasourceattribute")] = this.value;
		            sources[event._emitter.gridDataSource().getID()].autoDispatch();
		        });
		        
		        event.data.target.appendChild(selectList);

		        var currentValue = sources[event._emitter.gridDataSource().getID()][attibute];
		        var array = ["na", "male", "female", "foo"];
		        for (var i = 0; i < array.length; i++) {
		            var option = document.createElement("option");
		            option.value = array[i];
		            option.text = array[i];
		            selectList.appendChild(option);
		        }
		        if (array.indexOf(currentValue) === -1) {
		            var option = document.createElement("option");
		            option.value = currentValue;
		            option.text = currentValue;
		            selectList.appendChild(option);

		        }

		        selectList.value = currentValue;
		    }, 50);
			}
		}
	};

```


### More Information


For more information on how to install a custom widget, refer to [Installing a Custom Widget](http://doc.wakanda.org/WakandaStudio0/help/Title/en/page3869.html#1027761).

For more information about Custom Widgets, refer to [Custom Widgets](http://doc.wakanda.org/Wakanda0.v5/help/Title/en/page3863.html "Custom Widgets") in the [Architecture of Wakanda Applications](http://doc.wakanda.org/Wakanda0.v5/help/Title/en/page3844.html "Architecture of Wakanda Applications") manual.
