Currently the DataMgr is dependent on using the Sel2Mgr.  This is a limitation and will be removed later...


Config
======

DataMgr Config
--------------

The DataMgr constructor function receives an object with the following properties

-  data : [array]

When using the DataMgr for a select2 box, then you must define the configuration for select2..

Sel2Mgr Config
--------------

The Sel2Mgr constructor function (called by DataMgr if defined) receives an object with the following properties

- data : [array](this will be handled by the DataMgr, no need to define this if using Sel2Mgr through the DataMgr)
- id : id of the element that you want select2 bound to
- textprop : the data array for select2 must contain a displayed text property.  This is the key for that.
- placeholder : optional placeholder

API
===

DataMgr
-------

### add (item)
This will add 'item' to the dataset.

An item will be added to the select2 dropdown if being used, and the textprop is included in the item provided

### deleteByProp(key, value)
This searches the data array and removes items that do have the key/value

### deleteByProps (keys, values)
This searches the data arrays and removes items that do contain all the keys/values

### delSelected
This deletes the selected (assuming using select2) item

### editSelected(prop, val)
this edits or adds a property of the selected item and set it to val

### getData
Gets the data array (stupid)


Sel2Mgr
-------

### add(item)
Adds the item onto the data array (assuming item is an object, and textprop exists in that object)

### delSelected
Deletes the selected item from the data array.  The displayed item becomes the placeholder

### getData
Gets the select2 data array (stupid)

### getSelectedProp(prop)
The select2 data array contains 2 properties (id, text).  This will retrieve the given property of the currently selected item

### setData(dataset)
Formats dataset to have appropriate properties for select2, and changes the data array



















