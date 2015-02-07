function TodoList(config){
	//Initialize the local variables
	var todoitems = {},id = config.id,formId = config.formId,currentTodoItem,todolist = document.getElementById(id),todoform = document.getElementById(formId),onAddEvent,onDeleteEvent;
	
	//Initialize the custom events
	if(document.createEvent){
		//on Add Event
		onAddEvent = document.createEvent("Event");
		onAddEvent.initEvent("onAdd",true,false);
		
		//on delete Event
		onDeleteEvent = document.createEvent("Event");
		onDeleteEvent.initEvent("onDelete",true,false);
	}else{
		//on Add Event
		onAddEvent = new Event('onAdd');
		
		//on delete Event
		onDeleteEvent = new Event('onDelete');
	}
	
	//Initialize the templates
	var todoHeader = "<h2>Todo Tasks</h2>",
	todoHeaderTemplate = "<div class='todolistheader'><div class='mainbuttons'><ul class='actions'><li class='action-item'><input class='fleft' type='button' value='Add'/></li><li class='action-item'><input class='fleft' type='button' value='Clear'/></li></ul></div></div>",
	todoBodyTemplate = "<div class='todolistbody'></div>",
	todolistItemTemplate = "<div id='#{id}' class='todolistitem container cf'><div class='section taskstatus'></div><div class='section taskmain'><span class='tasktext'>#{tasktext}</span></div><div class='section taskdate'><span class='taskdate-view'>#{taskdate}</span></div><div class='section taskactions'><ul class='actions'><li class='action-item'><input type='button' value='Edit'/></li><li class='action-item'><input type='button' value='Delete'/></li><li class='action-item'><input type='button' value='Top'/></li></ul></div></div>",
	todolistform = "<form role='form' class='stack-form'><fieldset><legend id='mode'>Create Task</legend><label for='todotext'>Task</label><input type='text' maxlength='40' class='todotext'/><label for='tododesc'>Description</label><textarea maxlength='140' rows='4' cols='50' class='tododesc'></textarea><label for='todostatus'>Status</label><select class='todostatus'><option value='New'>New</option><option value='In progress'>In progress</option><option value='Done'>Done</option></select><label for='todopriority'>Priority</label><select class='todopriority'><option value='Low'>Low</option><option value='Medium'>Medium</option><option value='High'>High</option></select><label for='tododate'>Date</label><input type='date' id='taskdate' class='tododate'/><button class='todo-button cancel' type='button'>Cancel</button><button class='todo-button save' type='button'>Save</button><button class='todo-button update' type='button'>Update</button></fieldset></form>";
	
	todolist.setAttribute("class","page-tran page-tran-todolist page-tran-current");
	todolist.appendChild(todoHeader.toDomElement());
	todolist.appendChild(todoHeaderTemplate.toDomElement());
	todolist.appendChild(todoBodyTemplate.toDomElement());
	
	todoform.setAttribute("class","page-tran page-tran-todolistform");
	todoform.appendChild(todolistform.toDomElement());	

	//Initialize the reusable elements 	
	var todotextele = document.querySelector("#"+formId+" "+".todotext"),
	tododescele = document.querySelector("#"+formId+" "+".tododesc"),
	todostatusele = document.querySelector("#"+formId+" "+".todostatus"),
	todopriorityele = document.querySelector("#"+formId+" "+".todopriority"),
	tododateele = document.querySelector("#"+formId+" "+".tododate"),
	savebutton = document.querySelector("#"+formId+" "+".save"),
	updatebutton = document.querySelector("#"+formId+" "+".update");
	
	var tThis = this; 
	
	//private class.Holds all the todo items data
	function TodoListItem(options){
		var todolistbody = todolist.lastChild;
		var todolistItemEle =  todolistbody.appendChild((todolistItemTemplate.replace( /#\{tasktext\}/g, options.todotext).replace( /#\{taskdate\}/g, options.tododate).replace( /#\{id\}/g, options.uniqueid)).toDomElement());
		
		this.todotext = options.todotext;
		this.tododesc = options.tododesc;
		this.todostatus = options.todostatus;
		this.todopriority = options.todopriority;
		this.tododate = options.tododate;
		this.uniqueid = options.uniqueid;
		
		this.setTodoText = function(todotext){
			this.todotext = todotext;
		};
		this.setTodoDesc = function(tododesc){
			this.tododesc = tododesc;
		};
		this.setTodoStatus = function(todostatus){
			this.todostatus = todostatus;
		};
		this.setUniqueId = function(uniqueid){
			this.uniqueid = uniqueid;
		};
		this.setTodoPriority = function(todopriority){
			this.todopriority = todopriority;
		};
		this.setTodoDate = function(tododate){
			this.tododate = tododate;
		}

		this.getTodoText = function(){
			return this.todotext;
		};
		this.getTodoDesc = function(){
			return this.tododesc;
		};
		this.getTodoStatus = function(){
			return this.todostatus;
		};
		this.getUniqueId = function(){
			return this.uniqueid;
		};
		
		this.getTodoElement = function(){
			return document.getElementById(this.uniqueid);
		};
		this.getTodoPriority = function(){
			return this.todopriority;
		};
		this.getTodoDate = function(){
			return this.tododate;
		};
	}
	
	//public methods.User can invoke these methods with the help of instance variable
	this.addItem = function(todoItems){
		//merge the todoitems of user and default items
		var uniqueid = generateId();
		var options = {"uniqueid":uniqueid,"todotext":"","tododesc":"","todostatus":"New","todopriority":"","tododate":""};
		for(var item in todoItems){
			options[item] = todoItems[item];
		}
		if(window.localStorage){
			localStorage.setItem(uniqueid, JSON.stringify(options));
			var uniqueids = JSON.parse(localStorage.getItem('uniqueids'));
			uniqueids.push(uniqueid);
			localStorage.setItem('uniqueids', JSON.stringify(uniqueids));
		}
		
		var todolistitem = new TodoListItem(options);
		todoitems[uniqueid] = todolistitem;
		setStatusStyle(todolistitem);
		setPriorityStyle(todolistitem);
	};
	
	this.deleteAllItems = function(){
		for(var item in todoitems){
			delete todoitems[item];
			if(window.localStorage){
				localStorage.removeItem(item);
				var uniqueids = JSON.parse(localStorage.getItem('uniqueids'));
				uniqueids.splice(uniqueids.indexOf(item),1);
				localStorage.setItem('uniqueids',JSON.stringify(uniqueids));
			}
		}
		var todolistbody = document.querySelector("#"+id+" "+".todolistbody");
		todolistbody.innerHTML = "";
	};
	
	this.deleteItem = function(targetEle){
		var todolistitem = targetEle.parentNode.parentNode.parentNode.parentNode;
		var uniqueid = todolistitem.getAttribute("id");
		
		var removeTodoItem = document.getElementById(uniqueid);
		removeTodoItem.parentNode.removeChild(removeTodoItem);
		delete todoitems[uniqueid];
		if(window.localStorage){
			localStorage.removeItem(uniqueid);
			var uniqueids = JSON.parse(localStorage.getItem('uniqueids'));
			uniqueids.splice(uniqueids.indexOf(uniqueid),1);
			localStorage.setItem('uniqueids',JSON.stringify(uniqueids));
		}
		
	};
	
	this.createItem = function(){
		toggleform("add");
		cleanform();
		document.getElementById('mode').innerHTML = 'Create Task';
		this.changePageTo("todoform");
	};
	
	this.editItem = function(targetEle){
		toggleform("edit");
		cleanform()
		var todolistitemele = targetEle.parentNode.parentNode.parentNode.parentNode;
		var uniqueid = todolistitemele.getAttribute("id");
		currentTodoItem = todoitems[uniqueid];
		this.changePageTo("todoform");
		todotextele.value = currentTodoItem.getTodoText();
		tododescele.value = currentTodoItem.getTodoDesc();
		todostatusele.value = currentTodoItem.getTodoStatus();
		todopriorityele.value = currentTodoItem.getTodoPriority();
		document.getElementById('mode').innerHTML = 'Edit Task';
		var date = new Date(currentTodoItem.getTodoDate());

		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();

		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;

		var today = year + "-" + month + "-" + day;       
		tododateele.value = today;

	};
	
	this.updateItem = function(todoItems){
		var uniqueId = currentTodoItem.getUniqueId();
		var options = {"uniqueid":uniqueId,"todotext":"","tododesc":"","todostatus":"New","todopriority":"","tododate":""};
		for(var item in todoItems){
			options[item] = todoItems[item];
		}
		currentTodoItem.setTodoText(options.todotext);
		currentTodoItem.setTodoDesc(options.tododesc);
		currentTodoItem.setTodoStatus(options.todostatus);
		currentTodoItem.setTodoPriority(options.todopriority);
		currentTodoItem.setTodoDate(options.tododate);
		//update the ui element as well
		

		document.querySelector("#"+uniqueId+" "+".tasktext").innerHTML = options.todotext;
		document.querySelector("#"+uniqueId+" "+".taskdate-view").innerHTML = options.tododate;
		this.changePageTo("todolist");
		setStatusStyle(currentTodoItem);
		setPriorityStyle(currentTodoItem);
		if(window.localStorage){
			localStorage.setItem(uniqueId,JSON.stringify(options));
		}
	};
	
	this.moveItemTop = function(targetEle){
		var todolistitemele = targetEle.parentNode.parentNode.parentNode.parentNode;
		var uniqueid = todolistitemele.getAttribute("id");
		var removeTodoItem = document.getElementById(uniqueid);
		var parentnode = removeTodoItem.parentNode;
		parentnode.removeChild(removeTodoItem);
		parentnode.insertBefore(removeTodoItem, parentnode.firstChild);
	};
	
	this.changePageTo = function(type){
		var inele,outele,classvalue;
		if(type=="todolist"){
			inele = document.getElementById(id);
			outele = document.getElementById(formId);
		}else{
			inele = document.getElementById(formId);
			outele = document.getElementById(id);
		}
		
		classvalue = inele.getAttribute("class");
		inele.setAttribute("class",classvalue+" "+"page-tran-current");
		
		classvalue = outele.getAttribute("class");
		outele.setAttribute("class",classvalue+" "+"page-tran-rotatePageOut");
		
		classvalue = inele.getAttribute("class");
		inele.setAttribute("class",classvalue+" "+"page-tran-rotatePageIn");
		
		setTimeout(function(){
			if(type=="todolist"){
				inele.setAttribute("class","page-tran page-tran-todolist page-tran-current");
				outele.setAttribute("class","page-tran page-tran-todolistform");
				document.querySelector("#"+id+" "+"input[value=Add]").focus();
			}else{
				inele.setAttribute("class","page-tran page-tran-todolistform page-tran-current");
				outele.setAttribute("class","page-tran page-tran-todolist");
				todotextele.focus();
			}
		},1000);
	};
	
	//private methods.User cannot access these methods.These are helper functions for internal use.
	function setPriorityStyle(todolistitem){
		var taskele = todolistitem.getTodoElement().querySelector('.taskstatus');
		var priority = todolistitem.getTodoPriority();
		if(priority == "High"){
			taskele.setAttribute("class","section taskstatus task-high");
		}else if(priority == "Medium"){
			taskele.setAttribute("class","section taskstatus task-medium");
		}else{
			taskele.setAttribute("class","section taskstatus task-low");
		}
	}
	
	function setStatusStyle(todolistitem) {
		var taskele = todolistitem.getTodoElement().querySelector('.tasktext');
		var status = todolistitem.getTodoStatus();
		if(status == "Done"){
			taskele.setAttribute("class","tasktext task-done");
		}else if(status == "New"){
			taskele.setAttribute("class","tasktext task-new");
		}else{
			taskele.setAttribute("class","tasktext task-inprogress");
		}
	}
	
	function toggleform (mode){
		if(mode == "add"){
			savebutton.style.display = "inline";
			updatebutton.style.display = "none";
		}else{
			savebutton.style.display = "none";
			updatebutton.style.display = "inline";
		}
	}
	
	function cleanform(){
		todotextele.value = ""; 
		tododescele.value = ""; 
		todostatusele.value = "New";
		todopriorityele.value = "Low";
		var date = new Date();

		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();

		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;

		var today = year + "-" + month + "-" + day;       
		tododateele.value = today;
	}
	
	function getTodoDetails(){
		var todotext = document.querySelector("#todoform .todotext").value; 
		var tododesc = document.querySelector("#todoform .tododesc").value; 
		var todostatus = document.querySelector("#todoform .todostatus").value;
		var todopriority = document.querySelector("#todoform .todopriority").value;	
		var tododate = 	document.querySelector("#todoform .tododate").value;		
		var tododetails = {"todotext":todotext,"tododesc":tododesc,"todostatus":todostatus,"todopriority":todopriority,"tododate":tododate};
		return tododetails;
	}

	
	function addEventListenrs(){
		document.querySelector("#"+formId+" "+".cancel").addEventListener("click", function(){
			tThis.changePageTo("todolist");
		}, false);
		document.querySelector("#"+formId+" "+".save").addEventListener("click", function(){
			tThis.addItem(getTodoDetails());
			tThis.changePageTo("todolist");
			if(config.onAdd){
				this.addEventListener('onAdd', config.onAdd, false);
			}
			this.dispatchEvent(onAddEvent);
		}, false);
		document.querySelector("#"+formId+" "+".update").addEventListener("click", function(){
			tThis.updateItem(getTodoDetails());
			tThis.changePageTo("todolist");
		}, false);
		
		document.querySelector("#"+id+" "+".todolistbody").addEventListener("click", function(event){
			if(event.target.value == "Edit"){
				tThis.editItem(event.target);
			}else if(event.target.value == "Top"){
				tThis.moveItemTop(event.target);
			}else{
				tThis.deleteItem(event.target);
			}
			
			if(config.onDelete){
				this.addEventListener('onDelete', config.onDelete, false);
			}
			this.dispatchEvent(onDeleteEvent);
			
		}, false);
		
		document.querySelector("#"+id+" "+"input[value=Add]").addEventListener("click", function(event){
			tThis.createItem("todoform");
		}, false);
		document.querySelector("#"+id+" "+"input[value=Clear]").addEventListener("click", function(event){
			tThis.deleteAllItems();
		}, false);
	}
	
	//attach the listeners
	addEventListenrs();
	if(window.localStorage){
		if(localStorage.getItem('uniqueids')){
			var uniqueids = JSON.parse(localStorage.getItem('uniqueids'));
			var len = uniqueids.length;
			for(var i=0;i<len;i++){
				var persistedtodoitems = JSON.parse(localStorage.getItem(uniqueids[i]));
				var todolistitem = new TodoListItem(persistedtodoitems);
				todoitems[persistedtodoitems.uniqueid] = todolistitem;
				setStatusStyle(todolistitem);
				setPriorityStyle(todolistitem);
			}
		}else{
			localStorage.setItem('uniqueids',JSON.stringify([]));
		}
	}
}
