function SortableMgr(conf){
   // catch incorrect constructor function
   if (!(this instanceof SortableMgr)) {
      alert("you forgot to call SortableMgr with new");
      return;
   }

   // read conf data and initialize sortable
   if(conf) {
      // define private varss
         var id = conf.id,
            dataTemplate = conf.dataTemplate,
            sortableClass = conf.sortableClass, 
            selectedClass = conf.multiOptions.selectedClass,
            textprop = conf.textprop,
            rxFxn = conf.rxFxn || function(){},
            stopFxn = conf.stopFxn || function(){},
            self = this;

         // this is for setting the appropriate .del and .edit functions
         if(selectedClass)
         {
            // do not call multisortable if using MultiSortableMgr
            if(sortableClass && !conf.multi)
            {
               $("."+sortableClass).multisortable(conf.multiOptions);
            }

            // set up required event handlers for selecting use and provide
            // user access to stop and receive handlers.
            $("#"+id).sortable().on('click', clearSelected)
            .on( "sortreceive", function(e,u) {
               var list = $(e.target);
               if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  list.find('.multiselectable-previous').removeClass('multiselectable-previous');
                  list.find('.'+selectedClass).removeClass(selectedClass);
                  u.item.addClass(selectedClass);
               }

               rxFxn(e,u);

            }).on("sortstop", function(e,ui){
               stopFxn(e,ui);
            });
            this.del = delBySelected;
            this.edit = editBySelected
         }
         else
         {
            // this is non-selectable implementation, thus requiring deletion
            // and edits using an ID.
            $("#"+id).sortable();
            this.del = delById;
            this.edit = editById;
         }

         // adds the initial data elements to the list
         $("#"+id).append(elemGen(formatData(conf.data)));
   }

   // adds item to display and local data arr
   this.add = function(item){
      $("#"+id).append(elemGen(formatData([item])));
   }

   // deletes item based on a given id
   function delById(uid){
      $("#"+uid).remove();
   }

   // deletes all items based on a selectedClass
   function delBySelected(){
      return $("#"+id+' .'+selectedClass).map(function(i,e){
         delById(e.id);
         return e.id.substr(id.length+1);
      });
   }

   // edits all items based on selectedClass
   function editBySelected(text){
      return $("#"+id+' .'+selectedClass).map(function(i,e){
         editById(text, e.id);
         return e.id.substr(id.length+1);
      });
   }

   // Returns all selected elements
   this.getSelected = function(){
      var arr = [];
      $("#"+id+' .'+selectedClass).each(function(i,e){
         arr.push(e);
      });
      return arr;
   }

   // returns the DOM for the sortable
   this.getData = function(){
      var arr = [];
      $("#"+id).each(function(i,e){
         arr.push(e)
      });
      return arr;      
   }

   // edits the span text
   function editById(text, uid){
      $("#"+uid).find('span').text(text);
   }

   // adds an id to the node based on the id of the container
   // and a uuid attribute.
   //!!!!!!!!! maybe i should fix this if no uuid attribute? !!!!!!!!!!!!!
   function formatData(d){
      return d.map(function(e,i){
         var t = JSON.parse(JSON.stringify(dataTemplate));
         replaceText(e[textprop],t);
         t.attr.id = id+"_"+e.uuid;
         return t;
      });
   }

   // recursively inserts 'text' into an objects 'text' properties
   function replaceText(text, obj) {
      if ($.isArray(obj)) {
         obj.forEach(function (elem) {
            replaceText(text, elem);
         });
      } else if (typeof obj === 'object') {
         for (prop in obj) {
            if (prop === 'text') {
               obj[prop] = text;
            } else {
               replaceText(text, obj[prop]);
            }
         }
      }
   }

   // creates an element(s) from JSON
   function elemGen(e) {
      if ($.isArray(e)) {
         var elm = $.map(e, function (elem) {
            return elemGen(elem);
         });
         return elm;
      } else if (typeof e === 'object') {
         if('nodeType' in e) {
            return e;
         }
         if (e.tag) {
            var elm = $('<' + e.tag + '>', e.attr);
            if (e.children) {
               elm.append(elemGen(e.children));
            }
            return elm;
         }
         else {
            console.log("elemGen: Error creating element (No type)");
         }
      }
   }

   // remove selected class from list
   function clearSelected(e){
      if(!$(e.target).hasClass(selectedClass)){ 
         $("#"+id+' .'+selectedClass).removeClass(selectedClass); 
      }
   }
}