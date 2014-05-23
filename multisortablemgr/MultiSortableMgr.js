function MultiSortableMgr(conf){
   // catch incorrect constructor function
   if (!(this instanceof MultiSortableMgr)) {
      alert("you forgot to call SortableMgr with new");
      return;
   }

   if(conf)
   {
      // set locals
      var multiOptions = conf.multiOptions;
      var multiClass = conf.multiClass;
      var sort1Conf = conf.sortableA;
      var sort2Conf = conf.sortableB;

      // add selected class to list dom element for later multisortable use
      $("#"+sort2Conf.id).data("selectedClass", conf.multiOptions.selectedClass[1]);
      $("#"+sort1Conf.id).data('selectedClass', conf.multiOptions.selectedClass[0]);

      $("."+multiClass).multisortable(multiOptions);

      // the data will get UUID properties in here
      var d1 = new DataMgr(sort1Conf);
      var d2 = new DataMgr(sort2Conf);

      // set unique IDs for both lists
      d1.listID = sort1Conf.id;
      d2.listID = sort2Conf.id

      // assign receive and stop callback functions.
      conf.sortableA.rxFxn = rx;
      conf.sortableB.rxFxn = rx;
      conf.sortableA.stopFxn = stop;
      conf.sortableB.stopFxn = stop;
      conf.sortableA.multi = true;
      conf.sortableB.multi = true;
      conf.sortableA.multiOptions = { items:conf.multiOptions.items, selectedClass: conf.multiOptions.selectedClass[0]};
      conf.sortableB.multiOptions ={ items:conf.multiOptions.items, selectedClass: conf.multiOptions.selectedClass[1]};
      
      // the initial data for these will have UUID properties assigned
      var sort1 = new SortableMgr(conf.sortableA);
      var sort2 = new SortableMgr(conf.sortableB);

      // connect the sortable lists
      $("#"+sort1Conf.id).sortable('option', 'connectWith', '#'+sort2Conf.id);
      $("#"+sort2Conf.id).sortable('option', 'connectWith', '#'+sort1Conf.id);

      // define callback function when receiving an item
      function rx(evt,ui){   
         var item = ui.item;
         var list = ui.sender;
         // list2
         if($(list).attr('id') === d1.listID)
         {
            // remove item from d1 and add to d2
            var selArr = sort2.getSelected().concat(sort1.getSelected());
            selArr.forEach(function(e,i){
               moveItems(d1, d2, sort2, e);
            });
         }
         else if($(list).attr('id') === d2.listID)
         {
            // remove item from d2 and add to d1
            var selArr = sort1.getSelected().concat(sort2.getSelected());
            selArr.forEach(function(e,i){
               moveItems(d2, d1, sort1, e);
            });
         }
      }

   }

   this.moveItem

   // add an item to a list. (simply calls data/sortable mgrs add fxn)
   this.addTo = function(listID, item)
   {
      if(listID === d1.listID)
      {
         var ret = d1.add(item);
         sort1.add(ret);
      }
      else if(listID === d2.listID)
      {
         var ret = d2.add(item);
         sort2.add(ret);
      }
/*      update(d1, 'dataDisplay2');
      update(d2, 'dataDisplay3');*/
   }

   // property editing is shallow (1 level deep)
   // deep text editing.
   // For displaying/changing text, only <span>s should be used!
   this.editSelected = function(listID, item)
   {

      if(listID === d1.listID)
      {
         var dataList = d1;
         var selArr = sort1.getSelected();
      }
      else if(listID === d2.listID)
      {
         var dataList = d2;
         var selArr = sort2.getSelected();
      }
      else 
      {
         console.log("MultiSortableMgr -> editSelected: Invalid list ID. returning");
         return;
      }

      selArr.forEach(function(e,i){
         var uuid = parseInt($(e).attr('id').substr(dataList.listID.length+1),10);
         var dataItem = dataList.getItemByUuid(uuid);
         for(prop in item)
         {
            dataItem[prop] = item[prop];
            if(prop === sort1Conf.textprop)
            {
               $(e).find('span').text(item[prop]);
            }
         }
      });

      // THIS IS FOR TESTING PURPOSES ONLY //
/*      update(d1, 'dataDisplay2');
      update(d2, 'dataDisplay3');*/
      ///////////////////////////////////////
   }

   // finds the selected items in BOTH lists and deletes them from
   // both display and data objects
   this.deleteSelected = function(){
      var selArr = sort1.getSelected();
      selArr.forEach(function(e,i){
         var uuid = parseInt($(e).attr('id').substr(d1.listID.length+1),10);
         d1.deleteByProp('uuid',uuid);
      });

      selArr = sort2.getSelected();
      selArr.forEach(function(e,i){
         var uuid = parseInt($(e).attr('id').substr(d2.listID.length+1),10);
         d2.deleteByProp('uuid',uuid);
      });

      sort1.del();
      sort2.del();

      // THIS IS FOR TESTING PURPOSES ONLY //
/*      update(d1, 'dataDisplay2');
      update(d2, 'dataDisplay3');*/
      ///////////////////////////////////////

   }

   // this will actually delete the item from the sender list and then add
   // a NEW one to the receiver list. this was necessary since both lists
   // may not have the same HTML.
   function moveItems(fromD, toD, toSort, item)
   {
      // get uuid from the end of the element's ID and make it a number type
      var itemID = $(item).attr('id');
      var uuid = parseInt(itemID.substr(fromD.listID.length+1),10);
      var dataItem = fromD.getItemByUuid(uuid);
      fromD.deleteByProp('uuid', uuid);
      delete dataItem.uuid;
      var retItem = toD.add(dataItem);
      $("#"+itemID).remove();
      toSort.add(retItem);

      // THIS IS FOR TESTING PURPOSES ONLY //
/*      update(d1, 'dataDisplay2');
      update(d2, 'dataDisplay3');*/
      ///////////////////////////////////////
   }

   // !!!!!!!!!!!! THIS IS IN HERE FOR TESTING PURPOSES ONLY !!!!!!!!!!!!!
/*   function update(list, dispID){
      var d = list.getData();
      $("#"+dispID).html("");
      d.forEach(function(e){
         var listItem = document.createElement('li');
         var tmparr = [];
         for(prop in e)
         {
            var next = prop + ": "+ e[prop];
            tmparr.push(next);
         }
         var text = tmparr.join(", ");
         var node = document.createTextNode("{ "+text+" }");
         listItem.appendChild(node); 
         $("#"+dispID).append(listItem);
      });
   }*/
   ///////////////////////////////////////////////////////////////////////

   // get data lists as an array from the dataMgrs
   this.getDataLists = function(){
      return [d1.getData(), d2.getData()];
   }

}
