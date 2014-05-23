
function Sel2Mgr(conf) {
    // catch incorrect constructor function
    if (!(this instanceof Sel2Mgr)) {
        alert("you forgot to call Sel2Mgr with new");
        return;
    }

    // retrieves an item based on uuid
    this.getItemById = function(selID)
    {
        var idx = -1;
        // get the index in the array of the selected ID
        data.some(function(e, i){
            var ret = false
            if(e.id === selID )
            {
                idx = i;
                ret = true;
            }
            return ret;
        });
        if(data[idx])
        {
            return data[idx];
        }
        else
        {
            console.log("DataMgr -> getItemByUuid : could not find item with selected UUID. Barfing...");
            return;
        }
    }
    
    this.add = function (item) {
        if(item[textprop]) {
            data.push({text: item[textprop], id: item.uuid || sel2id+"_"+getID() }); 
        }
        $("#"+sel2id).select2('val', item.uuid);
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

    var getID = generateIdMaker();

    if (conf) {
        // define private variables
        var sel2id = conf.id || '';
        var textprop = conf.textprop || 'name';
        var data = formatData(conf.data);
        var ph = conf.placeholder || "Select an Item";
        var selectedID = -1;

        if(!sel2id)
        {
            alert('Sel2Mgr: No select2 id specified!');
            return;
        }
        
        // instantiate the select2 menu
        $("#" + sel2id).select2({
            data: function () {
                return {
                    results: data
                };
            },
            placeholder: ph,
            dropdownAutoWidth: true,
            allowClear: conf.allowClear || false,
        }).on('select2-selecting', function (e) {
            selectedID = e.val;
            if(conf.selecting){ conf.selecting(e); }
        }).on('select2-clearing', conf.clearing);
        
    }
    else
    {
        return;
    }

    // id maker factory
    function generateIdMaker() {
        var i = 1;
        return function() {
            return i++;
        }
    }

    // give a uuid to the data
    function formatData(dataset) {
        return dataset.map(function (el) {
            return {
                id: el.uuid || sel2id+"_"+getID(),
                text: el[textprop]
            }
        });
    }

};
