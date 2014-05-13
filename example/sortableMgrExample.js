var myList = new DataMgr({
      sortable: {
         dataTemplate: {
            tag: 'div',
            attr: { class: 'ui-state-default listitem' },
            children: {
               tag: 'span',
               attr: { text: "" }
            }
         },
         id: "list1",
         sortableClass: 'sortable1',
         textprop: 'name',
         multiOptions: { items: 'div', selectedClass: 'select3' }
      },
      data: [{name:'item1'}, {name:'item2'}],
});

$("#add").on('click', function(){
   var v = $("#addtext").val();
   myList.add({name:v});
   update(myList, 'dataDisplay');
});

$("#del").on("click", function(){
   myList.del();
   update(myList, 'dataDisplay');
});

$("#edit").on("click", function(){
   var v = $("#edittext").val();
   myList.edit(v);
   update(myList, 'dataDisplay');
});

update(myList, 'dataDisplay');


function update(list, dispID){
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
}

var msm = new MultiSortableMgr({
   sortableA: {
      dataTemplate: {
         tag: 'div',
         attr: { class: 'ui-state-default listitem green'},
         children: {
            tag: 'span',
            attr: { text: "" }
         }
      },
      id: "list2",
      textprop: 'name',
      data: [{name:'item1', foo:"test", bar:5}, {name:'item2'}, {name:'item5'}]
   },
   sortableB: {
      dataTemplate: {
         tag: 'div',
         attr: { class: 'ui-state-default listitem red'},
         children: [{
            tag: 'span',
            attr: { text: "" }
         },{
            tag: 'div',
            attr: { class: 'subdiv' }
         }]
      },
      id: "list3",
      textprop: 'name',
      data: [{name:'item3'}, {name:'item4'}]
   },
   multiClass: 'multisortable',
   multiOptions: { items:'>div', selectedClass: ['select','select2']}
});

var dArr = msm.getDataLists();

update(dArr[0], 'dataDisplay2');
update(dArr[1], 'dataDisplay3');

$("#add2").on('click', function(e){
   var v = JSON.parse($("#addtext2").val());
   var list = v.toList;
   delete v.toList;
   msm.addTo(list, v);
});

$("#edit2").on("click", function(e){
   var v = JSON.parse($("#edittext2").val());
   var list = v.edit;
   delete v.edit;
   msm.editSelected(list, v);
})

$("#del2").on('click', function(e){
   msm.deleteSelected();
});
