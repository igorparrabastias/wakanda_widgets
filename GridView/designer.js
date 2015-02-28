(function(GridView) {
	
	
	GridView.setHeight(300);
	GridView.setWidth(300);
	


    //    /* Add a Label property */
    GridView.addLabel({
        'defaultValue': 'GridView',
        'position': 'top'
    });


    GridView.setPanelStyle({
        'fClass': true,
        'text': true,
        'dropShadow': true,
        'background': true,
        'border': true,
        'sizePosition': true,
        'label': true
    });


    GridView.addStructure({
        description: 'header',
        selector: '.vr-widget-grid-row-header',
        style: {
            text: true,
            textShadow: true,
            background: true,
            border: true
        }
    });

    GridView.addStructure({
        description: 'footer',
        selector: '.vr-widget-grid-footer',
        style: {
            text: true,
            textShadow: true,
            background: true,
            border: true
        }
    });

    GridView.addStructure({
        description: 'row alt',
        selector: '.vr-widget-grid-row-alt',
        style: {
            text: true,
            textShadow: true,
            background: true,
            border: true
        }
    });

    GridView.addStructure({
        description: 'row even',
        selector: '.vr-widget-grid-row-even',
        style: {
            text: true,
            textShadow: true,
            background: true,
            border: true
        }
    });


    GridView.addStructure({
        description: 'rows',
        selector: '.vr-widget-grid-row',
        style: {
            text: true,
            textShadow: true,
            background: true,
            border: true
        }
    });

    //events
    GridView.addEvent({
        'name': 'cellDrawn',
        'description': 'On Cell Draw',
        'category': 'draw events'
    });
    GridView.addEvent({
        'name': 'cellHeaderDrawn',
        'description': 'On Cell Header Draw',
        'category': 'draw events'
    });
    GridView.addEvent({
        'name': 'rowDoubleClick',
        'description': 'On Row Double Click',
        'category': 'click events'
    });

    GridView.addEvent({
        'name': 'rowSingleClick',
        'description': 'On Row Single Click',
        'category': 'click events'
    });

    GridView.addEvent({
        'name': 'rowRightClick',
        'description': 'On Row Right Click',
        'category': 'click events'
    });

    GridView.addEvent({
        'name': 'headerClick',
        'description': 'On Header Click',
        'category': 'click events'
    });
    
    GridView.addEvent({
        'name': 'headerDoubleClick',
        'description': 'On Header Double Click',
        'category': 'click events'
    });
    
    GridView.addEvent({
        'name': 'headerRightClick',
        'description': 'On Header Right Click',
        'category': 'click events'
    });
    
    
    

});

// For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3870.html