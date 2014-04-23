
function DataMgr(config) {
    if (!(this instanceof DataMgr)) {
        alert("DataMgr: You forgot to call me with new!");
        return;
    }
    var getID = generateIdMaker();
    if (config) {
        var data = formatData(config.data);
        var display;
        if (config.select2) {
            var dispConf = config.select2;
            dispConf.data = data;
            display = new Sel2Mgr(dispConf);
        }
    }
    
    this.add = function(item){
        if(item.id)
        {
            console.log('DataMgr: Added item cannot have an id property!');
            return;
        }
        else
        {
            item.id = getID();
            data.push(item);
            display.add(item);
        }
    }
    
    this.deleteByProp = function(key, value)
    {
        // filter out elements that do not have specified prop value
        data = data.filter(function (e) {
            return e[key] !== value;
        });
    }
    
    this.deleteByProps = function(keys, values)
    {
        data = data.filter(function(e){
            var count = 0;
            keys.forEach(function(key,idx){
                if(e[key] === values[idx])
                {
                    count++;
                }
                    
            });
            return count !== keys.length;
        });
    }
    
    this.delSelected = function(){
        this.deleteByProp('id', display.getSelectedProp('id'));
        display.delSelected();
    }
    
    this.editSelected = function(prop, val){
        var selID = display.getSelectedProp('id');
        var item = getItemByIdx(selID);
        if(item)
        {
            item[prop] = val;
            // change displayed name...
            if(prop === dispConf.textprop)
            {
                display.editSelected(val);
            }
        }
    }
    
    this.getData = function(){
        return data;
    }

    function getItemByIdx(selID)
    {
        var idx = -1;
        // get the index in the array of the selected ID
        data.some(function(e, i){
            var ret = false
            if(e.id && e.id === selID )
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
            console.log("DataMgr -> getItemByIdx : could not find selected index. Barfing...");
            return;
        }
    }

    function formatData(dataset){
        return dataset.map(function (el) {
            if(el.id) 
            {
                console.log("DataMgr->formatData: id exists for an element in the dataset! Barfing...");
            }
            el.id = getID();
            return el;
        });
    }
    
    // maybe i could put this outside the constructor function
    // as it will be used in other constructor functions later
    // in the project...
    function generateIdMaker() {
        var i = 0;
        return function() {
            return i++;
        }
    }
}
