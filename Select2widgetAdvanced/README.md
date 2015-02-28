## Custom Widget for [Wakanda](http://wakanda.org)
The __Select2Widget__ widget allows you to use select2 in wakanda

#####This widget uses 3rd party lib:
* Jquery: https://github.com/jquery (included with wakanda)
* mustasje.js : https://github.com/janl/mustache.js (included with widget)
* Select2: https://github.com/ivaynberg/select2 (included with widget)


This is only tested with wak9 beta1


![widget](/images/select2Widget.PNG "")

### Properties
This widget has the following properties:

For information how to use untill I get docs updated see this: https://dl.dropboxusercontent.com/u/23375256/wakanda.org/files/seelct2localWithAdditionalQueryParmas.zip

Try to explain the attibute in a person -> company class
* __dropdownOnly__: for when only using the resultArray, and not related attibutes
* __overrideEvent__ : used for overide returned result (see sample solution)
* __minimumInputLength__ This is how many letters you need to enter before query, setting this to -1 will remove the seach bar on dropdown
* __relationAttibute__ : company relation attibute in a person class
* __returnAttribute__  name in the company class (this is the one ending up in select widget after selecting)
* __valueAttibute__ companyName -alias attibute in person class for company name (this is the one displayed in the select)
* __querySource__ datasource it will preform query on
* __maxServerSourceReturn__ max returned entities on server datasource result
* __setSource__ the datasource it will set value to/bind
* __queryAttributes__ attributes in querySource it will query
* __resultAttibutes__ attributes from query source it will display in select dropdown
* __addQuerystring__ This and 2 uder is used to add to query string used by widget
* __AdditionalQueryString__
* __AdditionalQueryParam__

===================

### How to use

* wak9 beta tested
https://dl.dropboxusercontent.com/u/23375256/wakanda.org/sampleGithub/seelct2local-withMaxServerReturn.zip


### More Information
Fot video etc go here:
http://forum.wakanda.org/showthread.php?6612-playing-around-making-a-select2-widget


For more information on how to install a custom widget, refer to [Installing a Custom Widget](http://doc.wakanda.org/WakandaStudio0/help/Title/en/page3869.html#1027761).

For more information about Custom Widgets, refer to [Custom Widgets](http://doc.wakanda.org/Wakanda0.v5/help/Title/en/page3863.html "Custom Widgets") in the [Architecture of Wakanda Applications](http://doc.wakanda.org/Wakanda0.v5/help/Title/en/page3844.html "Architecture of Wakanda Applications") manual.
