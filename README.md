

This library is a wrapper around jquery-uis' [sortables](http://jqueryui.com/sortable/), Igor Vaynbergs [Select2](http://ivaynberg.github.io/select2/), and shvetsgroups [multisortable](https://github.com/shvetsgroup/jquery.multisortable) libraries.


# DataMgr

The DataMgr controls the handling of data.  It can be used to create sortable/select2 managers, so that the only interface for adding/editing/deleting to them are through their respective DataMgr. however, this is not recommended due to the ideal of separation of data and display.  Support/APIs through the DataMgr isn't fully developed for this.  Ideally, this will be used solely to manage an array of data.

##Config

The DataMgr constructor function received an optional object for initialization.  These are the properties allowed.

```javascript
var myDataMgr = new DataMgr({
    data: [...], //initial starting data in the form of an array
    select2: {...}, //(optional) object that holds configuration paramaters for Sel2Mgr instantiation
    sortable: {...}, //(optional) object that holds configuration parametrs for SortableMgr instantiation
    filters: [...] //(optional) array of callback functions for .filter
});

```

The DataMgr can only be instantiated with a select2 OR a sortable, but NOT both.

Each data item will contain a 'uuid' property.  This property must not exist in any data item PRIOR TO instantiation of DataMgr.  This property is used to uniquely identify each element.

## API

##### Adding

Adds an object to the data array.  Additionally, the to-be-added object is ran through any filters prior to being added.

Returns the object if successful.

Example use: `myDataMgr.add({foo:'bar'})`

If the DataMgr is created using sortable or select2, this will additionally call the `.add` function for its' respective display.

##### Deleting

Deleting/Removing an object/objects from the data array is primarily performed via filtering.  There are two methods that do this implicitly.

`myDataMgr.deleteByProp(key,value)`
and
`myDataMgr.deleteByProps(keys,values)`

Given a key value pair or an array of key/value pairs, the data array will filter out the objects that DO NOT match said pair/pairs.

If the DataMgr is created using sortable or select2, there is an additional function provided for deleting based on display state. Their functionality depends on which display is used.

Example use: `myDataMgr.del()`

For select2, it will remove the item from the select2 menu in addition to the data array. 

For sortable, it will call the `.del()` function for the sortable, which can vary based on sortable configuration.

None of these delete functions return a value.

##### Filtering

There is a built-in filtering capability that runs [.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) on the data array.  A private _filter_ variable contains an array of callback functions that will be ran on the data array (or on a to-be-added data item).

Simply call `myDataMgr.filterData` to apply the filters to the internal data array.

To add filters to the array (initially the array is empty), call
`myDataMgr.addFilter(fxn)` where `fxn` is the callback function used to check validity of each data item.

##### Editing

Currently there is no editing available directly through the DataMgr.

Editing via select2 and sortable is provided via the `myDataMgr.edit(arg1, arg2)` functions.

For select2, the `arg1` is the property that needs to be edited, and `arg2` is the value for said property.

For sortables, the `arg1` is the displayed text to modify based on the selected items.  An optional `arg2` is the id of the item to edit.

Neither has a return value.

##### Getters

To retrieve an item based on its uuid, simply call `myDataMgr.getItemByUuid(id)`.  This returns the object in the data array that matches the input `id` if it exists.

Use `myDataMgr.getData()` to retrieve the entire data array.  This will include the property `.uuid`.

---

# Sel2Mgr

The Sel2Mgr can be instantiated with the DataMgr or standalone. It creates a select2 element applied to a given id with the dataset provided.

##Config

The Sel2Mgr constructor function received an optional object for initialization.  These are the properties allowed.

```javascript
var mySel2Mgr = new Sel2Mgr({
    id: 'select2id', // id of the HTML element to attach to
    textprop: 'foo', // property that contains the text to be displayed.  If undefined, it defaults to 'name'
    data: [...], // array of elements to be displayed
    placeholder: 'Pick One!' // This string will be displayed when no item is selected. Defaults to 'Select an Item'
    selecting: function(){ ... } // Callback function for the on-selecting event
});

```

Extraneous properties are filtered out from the data array on instantiation (as well as when adding a new item).  The properties for a select2 item are `id` and `text`.


## API

##### Adding

Adding items is as simple as `mySel2Mgr.add(item)` where `item` is an object of the following form:
```javascript
{
    text: 'exampleItem!',
    id: 'sel2item_51'
}
``` 

The `text` property sets the text displayed.  This property can be of any name assuming the Sel2Mgr was instantiated with `textprop`. The `id` property should be a unique value from other `id` properties in the `data` array. This will be automatically generated if not defined (warning: only use the automatic generation if all elements have their id automatically generated.  Mixing id definitions may cause the Sel2Mgr to fail).

##### Editing

Editing items only requires a text field input.

`mySel2Mgr.editSelected(text)` where `text` is the to-be-displayed string.

##### Deleting

`mySel2Mgr.delSelected()` will delete the selected item from the data array.

##### Setting Data Array

`mySel2Mgr.setData` will receive a data array and use `textprop` to create the new text fields to display.  These new data array items are also given new unique identifiers (if not provided).  The updating of the select2 element will happen automatically.

##### Getters

`mySel2Mgr.getData` will return the data array used for the select2 element.  It will contain an array of objects with `text` and `id` properties.

`mySel2Mgr.getSelectedProp(prop)` will retrieve a single property of the selected object.

---

# SortableMgr

The Sortable can be instantiated with the DataMgr or standalone. It creates a jquery-ui sortable element applied to a given id with the dataset provided.

## Config

The Sortable constructor function received an optional object for initialization.  These are the properties allowed.

```javascript
var mySortableMgr = new SortableMgr({
    id: 'sortableId', // id of the HTML element to attach to
    dataTemplate: {..explained further below..}, // JSON object to be parsed into an HTML element representing each item
    sortableClass: 'sortable', // Optional string used to select the multisortable elements by class
    multiOptions: {..}, // object used when SortableMgr instantiated for multisortable
    textprop: 'text', // string for defining the property that contains the text to be displayed. Defaults to 'name'
    rxFxn: function(event, ui){ ... }, // Optional callback function for the receive event.  'event' and 'ui' objects provided
    stopFxn: function(event, ui){ ...}, // Optional callback function for the stop event. 'event' and 'ui' objects provided
});
```


the `dataTemplate` object is of the form:
```javascript
{
    tag: 'div', // this is the element tag
    attr: { class:'divClass' }, // this is an object of attributes to assign to the element
    children: { // this is an array or object of the same form (tag, attr, children properties);
        tag: 'span',
        attr: { text: "" }
    } 
}
```

When data is received, an internal function creates an HTML element using the dataTemplate.  Each item with the `text` property in the `attr` object will have the data elements' `textprop`.

Upon reception of a data array (or when adding an element), the data is formatted so that the id of the element created is a unique id.  A predefined id property in the attr object will be overwritten.

For displaying text, it is required to use `<span>` tags. This is for editing purposes, as editing textNodes for various tags isn't so good.

## API

##### Adding

Adding items is as simple as `mySortableMgr.add(item)` where `item` is an object with the property `textprop` and value for displayed text. The item will be formatted to the dataTemplate and injected into the sortable.

##### Editing

The edit function operates differently based on how the sortable is instantiated.  If using a selectedClass and sortableClass, then using `mySortableMgr.edit(text)` will edit all the selected elements' text to be the input `text` argument.

Otherwise, an id is required for the edit function like `mySortableMgr.edit(text, id)`. The selected ids text will be replaced with the input `test` argument.

##### Deleting

Deletion follows a similar paradigm.  If using the selectedClass and sortableClass, then called `mySortableMgr.del()` will delete the selected elements.  Otherwise use `mySortableMgr.del(uid)` to delete a specified id.

##### Getters

`mySortableMgr.getData()` will return the HTML element array that the sortable manager holds.

`mySortableMgr.getSelected()` will return the HTML element array of the selected elements.

---

# MultiSortableMgr

The purpose of the MultiSortableMgr was to more easily deal with data that is transferred between connected sortables. It is dependent on the SortableMgr, and has similar API and setup accordingly.

## Config

The MultiSortableMgr constructor function received a required object for initialization.  These are the properties allowed.

```javascript
var myMultiSortableMgr = new MultiSortableMgr({
    sortableA: {...}, // object that contains the setup for the first sortable
    sortableB: {...}, // object that contains the setup for the second sortable
    multiClass: {...}, // class that each sortable list is assigned
    multiOptions: {...}, // object that contains objects for a multisortable object (explained below)
});
```

the multiOptions object contains 2 parameters, the selector for the items within a multisortable, and the selectedClass for each list like so...

```javascript
{
    items: ">div", // selector for elements
    selectedClass: ['selected1','selected2'] // array of 2 classes to be applied to the respective list on selecting
}
```

One exception regarding the sortable setup object.... the `rxFxn` and `stopFxn` for both sortables will not be applied as they are used for multisortable data upkeep.

## API

##### Adding

`myMultiSortableMgr.addTo(listID, item)` will add an `item` to the respective list with id `listID`. This is done by calling the SortableMgr's `.add` function.

##### Editing

`myMultiSortableMgr.editSelected(listID, item)` will edit an the selected items and replace them with the text in `item` (only `<span>`'s text nodes will be replaced!).

##### Deleting

`myMultiSortableMgr.deleteSelected()` will delete the selected elements from BOTH sortables as well as each respective DataMgr instances.

##### Getters

`myMultiSortableMgr.getDataLists` will retrieve the data arrays for the DataMgr instances.
