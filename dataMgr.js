
function DataMgr(config) {
    if (!(this instanceof DataMgr)) {
        alert("DataMgr: You forgot to call me with new!");
        return;
    }

    // returns local data array
    this.getData = function(){
        return data;
    }
    
    // filters out items that contain the key/value pair
    this.deleteByProp = function(key, value)
    {
        // filter out elements that do not have specified prop value
        data = data.filter(function (e) {
            return e[key] !== value;
        });
    }
    
    // filters out items that contain the key/value pairs
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

    // adds an item to the data array (as well as a uuid property)
    this.add = function(item){
        if(item.uuid)
        {
            console.log('DataMgr: Added item cannot have a uuid property!');
            return;
        }
        else
        {
            item.uuid = self.getID();
            data.push(item);
            if(display) { display.add(item); }
        }
        return item;
    }

    // retrieves an item based on uuid
    this.getItemByUuid = function(selID)
    {
        var idx = -1;
        // get the index in the array of the selected ID
        data.some(function(e, i){
            var ret = false
            if(e.uuid === selID )
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

    // create ID maker
    this.getID = generateIdMaker();

    var self = this;

    // initialization
    if (config) {
        var data = formatData(config.data);
        var display;
        if (config.select2) {
            var dispConf = config.select2;
            dispConf.data = data;
            display = new Sel2Mgr(dispConf);
            // define del/edit fxns for select2
            this.edit = sel2EditSelected;
            this.del = sel2DelSelected;
        }
        else if(config.sortable)
        {
            var dispConf = config.sortable;
            dispConf.data = data;
            display = new SortableMgr(dispConf);
            // define del/edit fxns for sortables
            this.edit = sortableEdit;
            this.del = sortableDel;
        }
    }
    else
    {
        console.log("DataMgr: This DataMgr won't do anything....");
    }

    // method used for deleting select2 items
    function sel2DelSelected(){
        this.deleteByProp('uuid', display.getSelectedProp('id'));
        display.delSelected();
    }
    
    function sel2EditSelected(prop, val){
        var selID = display.getSelectedProp('id');
        var item = this.getItemByUuid(selID);
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

    // method for editing sortable items by id
    // id is optional
    function sortableEdit(text, id)
    {
        var selArr = display.edit(text, id || "");
        data.forEach(function(e,i){
            if(selArr.get().some(function(ele){
                return (e.uuid === parseInt(ele,10));
            }))
            { 
                e[dispConf.textprop] = text;
            }
        });
    }

    // method for deleting sortable items
    function sortableDel()
    {
        var deleted = display.del();
        data = data.filter(function(e,i){
            return !deleted.get().some(function(ele,idx){
                return (e.uuid === parseInt(ele,10));
            });
        });
    }

    // adds a uuid to each element.
    function formatData(dataset){
        return dataset.map(function (el,idx) {
            if(el.uuid) 
            {
                console.log("DataMgr->formatData: The .uuid property should not exist in an element! Barfing...");
                console.log(el);
                console.log(idx);
                return;
            }
            el.uuid = self.getID();
            return el;
        });
    }
    
    // id maker factory
    function generateIdMaker() {
        var i = 0;
        return function() {
            return i++;
        }
    }
}
