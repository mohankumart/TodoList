
Introduction:
Todo List is a reusable component.It can be initialized with minimum code of Html and java script code.

	1)	Html Markup
		<div class="page-tran-holder">
			<div id="todolist"></div>
			<div id="todoform"></div>
		</div>
	2)	Java script Code
		User need to create a config object and pass it to the TodoList constructor.
			a. id - It is the id of the todolist and it is mandatory field
			b. formId - It is id of the todolist form and it is mandatory field
			c.onAdd - If user provides the onAdd with the callback method.The callback will be called after todo item is added to todolist.It is not mandatory field
			d.ondelete - If user provides the onDelete with the callback method.The callback will be called after the todo item is deleted from todolist.It is not mandatory field.
		var config = {
			"id":"todolist",
			"formId":"todoform",
			"onAdd":function(){
				console.log("Todo Item is added");
			},
			"onDelete":function(){
				console.log("Todo Item is deleted");
			}
		};
		var todolist = new TodoList(config);


Javascript:
	Composite design pattern is used to implemented TodoList. Each TodoItem is assigned unique Id and stored in associative array object(TodoList Manager).TodoList exposes some public methods which can be invoked with 
	the help of todolist instance object.
	
css:
	user need not write any css code.However user can easily customize the Todolist as the styles are applied with the help of classes.
	
Html:
	user need to write minimum html code.Html is written as per html5 web standards.

Used localStorage for persistence of todo items.
Testing:

TodoList is tested in Chrome 32, Firefox 26, IE 11.	

		