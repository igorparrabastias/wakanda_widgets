## Input widget [Wakanda](http://wakanda.org)
* this allows you to diaplay numbers and dates in different formats


#####This widget uses 3rd party lib:
* Jquery: https://github.com/jquery (included with wakanda)
* accounting.js : https://github.com/openexchangerates/accounting.js (included with widget)


[![Alt text for your video](http://img.youtube.com/vi/vioGsWSUdvs/0.jpg)](http://www.youtube.com/watch?v=vioGsWSUdvs&feature=youtu.be)


#### Properties:

* __Value source__: Datasource of widget
* __stringFormat__: normal stringformat, see wakanda docs for how to use
* __keyDownRegex__: use regex for input, like "^[A-Z]+$" for letters only, or ^[0-9]+$ for numbers only (not used regex much... so if my sample is wrong, then sorry, used those 2 when testing..
* __applyStringFormatToNumbers__: applies stringformat to numbers after all other formating have been done
* __readOnly__: Makes input readonly, and does not show datepicker
* __password__: shows only *** etc
* __multiline__: makes it a multiline (textarea)
* __desimalSeperator__: If its "auto" it tries to use localization in browser, else set it yourself like ","  (default is dot)
* __thousandSeperator__: If its "auto" it tries to use localization in browser, else set it yourself like "." (default is comma) for not having any at all you must use "-1"
* __displayPrecision__: Precision to use when displaying numbers, this is only display!!!! not edit (default is entire number)
* __numberSymbol__: Symbol to use like $, £ etc
* __localeDate__: If its "auto" it tries to use localization in browser, else set it yourself like "no" for norwegian, the changes language in query datepicker dropdown also, to only use format under dateformat use "-1" here
* __dateFormat__: dateformat it uses if localization isnt found
* __useDatePicker__: if you wanto show datepicker or not
* __showDatePickerButton__: if you wanto show datepicker button.



-------------
#### Events:

  * click
  * dblclick
  * keydown
  * keyup
  * focusin
  * focusout
  * mousedown
  * mouseup
  * blur
  * mouseenter
  * mouseleave



-------------
#### Functions:

* __getValue__: get value, will return a non formated value
* __setValue__: set value
* __disable__: not done yet
* __enable__: not done yet
* __getFormatedValue__: returns the displayed value in input
* __getISOdate__: returns datestring in this format : yy-mm-dd
* __getISOweek__: returns iso week
* __enableDatePicker__: enable datepicker
* __disabledatePicker__: disable datepicker



-------------
#### Todo:
* nothing atm



-------------
### Samples for on load of widget:

Listen for onload event for all widgets and override localization, this haveto be ouside the onload function of waf...
```javascript
$("body").on("vrInputTextLoad", function(event, data){
			//do something, override localisation
	data.that.thousandSeperator("");
        data.that.desimalSeperator(",");
        data.that.localeDate("-1");
        data.that.dateFormat("dd.mm.yy");
        data.that.refresh(); //make sure the widget updates the values
});

```

todo..
```javascript
//todo

```
