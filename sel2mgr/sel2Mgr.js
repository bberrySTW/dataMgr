
function Sel2Mgr(conf) {
    // catch incorrect constructor function
    if (!(this instanceof Sel2Mgr)) {
        alert("you forgot to call Sel2Mgr with new");
        return;
    }

    if (conf) {
        // define private variables
        var sel2id = conf.id;
        var textprop = conf.textprop || 'name';
        var data = formatData(conf.data, conf.textprop);
        var ph = conf.placeholder || "Select an Item";
        var selectedID = -1;
        
        // instantiate the select2 menu
        $("#" + sel2id).select2({
            data: function () {
                return {
                    results: data
                };
            },
            placeholder: ph,
            dropdownAutoWidth: true
        }).on('select2-selecting', function (e) {
            selectedID = e.val;

            if(conf.selecting){ conf.selecting(e); }
        });
        
        // setup callbacks... (not fully developed yet)
        // if(conf.selectFxn) $("#"+sel2id).on('select2-selecting', conf.selectFxn);
    }
    else
    {
        return;
    }
    
    this.add = function (item) {
        data.push({text: item[textprop], id: item.uuid });
    }

    this.delSelected = function () {
        data = data.filter(function (e) {
            return (e.id !== selectedID)
        });
        $("#" + sel2id).select2('val', ph);
        selectedID = -1;
    }
    
    this.getData = function () {
        return data;
    }
    
    this.getSelectedProp = function(prop){
        if(prop === 'id' || prop === 'text') return $("#"+sel2id).select2('data')[prop];
        else
        {
            console.log('Sel2Mgr -> getSelectedProp : Attempted to retrieve property that doesnt exist!');
        }
    }

    this.setData = function (newData) {
        data = formatData(newData);
    }
    
    function formatData(dataset) {
        return dataset.map(function (el) {
            return {
                id: el.uuid,
                text: el[textprop]
            }
        });
    }
    
    this.editSelected = function(newName){
        if($("#"+sel2id).select2('data'))
        {
            var tmpItem = $("#"+sel2id).select2('data');
            tmpItem.text = newName;
            // had to reselect it because changing the .text doesnt 
            // change the text that is the selected item
            $("#"+sel2id).select2('val', tmpItem.id);
        }
    }
};
