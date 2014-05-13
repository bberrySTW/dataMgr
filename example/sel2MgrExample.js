
function update(){
    var d = test.getData();
    $("#dataDisplay").html("");
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
       $("#dataDisplay").append(listItem);
    });
}

var test = new DataMgr({
    select2: {
        id: "sel2test",
        textprop: 'name',
        placeholder: 'Select a dude'
    },
    data: [{name:'joe'},{name:'brent'},{name:'andres'}]
});

update();

$("#del").on("click", function(){
    test.del();
    update();
});

$("#add").on("click", function(){

        try {
            var newItem = JSON.parse($("#addtext").val());
        } catch(e) {
            alert("Ivalid JSON!");
        }

        $("#addtext").val("");
        test.add(newItem);
        update();
    
});

$("#edit").on("click", function(){
    if($("#sel2test").select2("val"))
    {
        var obj = JSON.parse($("#edittext").val());
        for(prop in obj)
        {
            test.edit(prop, obj[prop]);
        }
        update();
        $("#edittext").val("");
    }
    else
    {
        alert("Select an item first!")
    }
});
