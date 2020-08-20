if (typeof MathQuill === 'undefined')
    throw 'Could not find MathQuill';

if (typeof tinymce === 'undefined')
    throw 'Could not find tinymce';

var MQ = MathQuill.getInterface(2);

tinymce.PluginManager.add('mathquill', function (editor, url) {
    var openDialog = function () {
        return editor.windowManager.open({
            title: 'Insert Mathquill Formula',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'input',
                        name: 'formula',
                        label: 'Formula'
                    },
                    {
                        type: 'label',
                        label: 'Preview',
                        items: [
                            {
                                type: 'htmlpanel',
                                html: '<div id="mathquill_preview">&nbsp;</div>'
                            }
                        ]
                    }
                ]
            },
            buttons: [
                {
                    type: 'cancel',
                    text: 'Close'
                },
                {
                    type: 'submit',
                    text: 'Save',
                    primary: true
                }
            ],
            onChange: function (api) {
                var data = api.getData();
                var mathquillPreviewElement = document.getElementById('mathquill_preview');
                var mathquillPreview = MQ.MathField(mathquillPreviewElement);
                mathquillPreview.latex(data.formula);
            },
            onSubmit: function (api) {
                var data = api.getData();
                
                // Create the Mathquill Formula Element
                var mathquillFormulaId = 'mathquill_' + Date.now();
                var mathquillFormula = tinymce.activeEditor.dom.createHTML(
                    'span',
                    {
                        id: mathquillFormulaId
                    },
                    data.formula
                );
                editor.insertContent(mathquillFormula);
                mathquillFormulaReference = tinymce.activeEditor.dom.get(mathquillFormulaId);
                MQ.StaticMath(mathquillFormulaReference);

                // Close dialog window
                api.close();
            }
        });
    };

    // Add a button that opens a window
    editor.ui.registry.addButton('mathquill', {
        icon: 'temporary-placeholder',
        onAction: function () {
            // Open dialog window
            openDialog();
        }
    });

    return {
        getMetadata: function () {
            return {
                name: "Mathquill plugin",
                url: "https://github.com/dallasclark/tinymce-mathquill-plugin"
            };
        }
    };
});