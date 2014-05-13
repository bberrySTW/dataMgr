

This library is a wrapper around jquery-uis' [sortables](http://jqueryui.com/sortable/), Igor Vaynbergs [Select2](http://ivaynberg.github.io/select2/), and shvetsgroups [multisortable](https://github.com/shvetsgroup/jquery.multisortable) libraries.


# DataMgr

The DataMgr controls the handling of data.  It can be used to create sortable/select2 managers, so that the only interface for adding/editing/deleting to them are through their respective DataMgr. however, this is not recommended due to the ideal of separation of data and display.  Support/APIs through the DataMgr isn't fully developed for this.  Ideally, this will be used solely to manage an array of data.

##Config

The DataMgr constructor function received an optional object for initialization.  These are the properties allowed.

```
var myDataMgr = new DataMgr({
    data: [], //initial starting data in the form of an array
    select2: {...}, //(optional) object that holds configuration paramaters for Sel2Mgr instantiation
    sortable: {...}, //(optional) object that holds configuration parametrs for SortableMgr instantiation
    filters: [] //(optional) array of callback functions for .filter
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

##### Getters

To retrieve an item based on its uuid, simply call `myDataMgr.getItemByUuid(id)`.  This returns the object in the data array that matches the input `id` if it exists.

Use `myDataMgr.getData()` to retrieve the entire data array.  This will include the property `.uuid`.

