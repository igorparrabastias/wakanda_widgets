(function(Select2widgetAdvanced) {


    Select2widgetAdvanced.setWidth('200');
    Select2widgetAdvanced.setHeight('27');
//	Select2Widget.addEvent({
//		'name':'onSelect',
//		'description':'when selected',
//		'category': 'select2 events'
//	}); 
//	Select2Widget.addEvent({
//		'name':'onQuery',
//		'description':'on query',
//		'category': 'select2 events'
//	}); 

	    /* Add a Label property */
    Select2widgetAdvanced.addLabel({
        'defaultValue': 'selectWidget',
        'position': 'top'
    });
    
    Select2widgetAdvanced.addEvent({
			    'name': 'overrideSet',
			    'description': 'overide set/serverRefresh',
			    'category': 'select override'
			});

});

