(function(InputText) {


    InputText.setWidth('130');
    InputText.setHeight('22');


    InputText.addLabel({
        'defaultValue': 'Label',
        'position': 'left'
    });

	InputText.mapDomEvents({
    'click': 'click',
    'dblclick': 'dblclick',
    'keydown':'keydown',
    'keyup':'keyup',
    'focusin':'focusin',
    'focusout':'focusout',
    'mousedown':'mousedown',
    'mouseup':'mouseup',
    'blur':'blur',
    'mouseenter':'mouseenter',
    'mouseleave':'mouseleave'
	});

    InputText.setPanelStyle({
        'fClass': true,
        'text': true,
        'dropShadow': true,
        'background': true,
        'border': true,
        'sizePosition': true,
        'label': true
    });


	InputText.addStates([{
            label: 'hover',
            cssClass: 'waf-state-hover'
        }, {
            label: 'focus',
            cssClass: 'waf-state-focus'
        }, {
            label: 'disabled',
            cssClass: 'waf-state-disabled'
        }]
	
	)



});

// For more information, refer to http://doc.wakanda.org/Wakanda0.DevBranch/help/Title/en/page3870.html