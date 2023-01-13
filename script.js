let newTaskButton = document.getElementById("newTask");
let todos = document.getElementById("todostorage");
let inputField = document.getElementById("inputField");
let dateField = document.getElementById("dateField");
let settings = document.getElementById("settingLabel");
let clear = document.getElementById("clear");
let close = document.getElementById("close");
let history = document.getElementById("history");
let closeTasks = document.getElementById("closeTasks");
let clearHistory = document.getElementById("clearHistory");
let refresh = document.getElementById("refresh")
const todolist = document.getElementById("todolist");


// add tasks listener
newTaskButton.addEventListener("click", function(){
    var paragraph = inputField.value;
    var dateInput = dateField.value;
    var validParagraph = checkTask(paragraph);
    var validDate = checkDate(dateInput);
    if (validParagraph && validDate) {
        addTask(paragraph, dateInput);
    }
    inputField.value = "";
    dateField.value = "";
    showTasks();
})

// adds tasks
function addTask (paragraph, dateInput) {
    var tasks = localStorage.getItem("todostorage");
    var taskArray = JSON.parse(tasks);

    if (taskArray == null || taskArray.length == 0) {
        taskArray = [{item: paragraph, date: dateInput, taskID: 0}];
    } else {
        taskArray[taskArray.length] = {item: paragraph, date: dateInput, taskID: taskArray.length};
    }

    var string = JSON.stringify(taskArray);
    localStorage.setItem("todostorage", string);
}

// checks if task input is valid 
function checkTask (paragraph) {
    if (paragraph != null) {
        paragraph = paragraph.trim()
        if (paragraph.length > 0) {
            return true
        } else {
            alert("Please enter a valid task");
            return false
        }
    } else {
        alert("Please enter a valid task");
        return false
    }
}

// checks if date is valid
function checkDate (dateInput) {
    if (dateInput != null) {
        dateInput = dateInput.trim();
        if (dateInput.length == 10) {
            var month = parseInt(dateInput.substring(0, 2));
            var day = parseInt(dateInput.substring (3, 5));
            var year = parseInt(dateInput.substring(6,10));
            if (month > 0 && month <= 12 && day > 0 && day <= 31 && year > 0) {
                return(true)
            } else {
                alert("Please enter a valid date");
                return(false)
            }
        } else {
            alert("Please enter a valid date"); 
            return(false)
        }
    } else {
        alert("Please enter a valid date");
        return(false)
    }
}

// displays the tasks
function showTasks() {
    var tasks = localStorage.getItem("todostorage");
    var taskArray = JSON.parse(tasks);
    todolist.innerHTML = ""

    var sortingPick = localStorage.getItem("sortingOption");
    var sortingOpt = document.getElementById("sortingOpt");
    if (sortingPick == null) {
        sortingPick = "0";
        localStorage.setItem("sortingOption", sortingPick);
    } else {
        sortingPick = parseInt(sortingPick);
        sortingOpt.options[sortingPick].setAttribute("selected", "selected");
    }
    var value = sortingOpt.options[sortingOpt.selectedIndex].value;
    if (sortingPick != value) {
        localStorage.setItem("sortingOption", value);
    }

    taskArray = sortArray (taskArray, value);
    if (taskArray != null) {
        for (var i = 0; i < taskArray.length; i++) {
            var string = taskArray[i].item;
            var dates = taskArray[i].date;
            var items = document.createElement("li");
            var buttons = document.createElement("button");
            var due = document.createElement("label");
            var taskInfo = document.createElement("input");
            var taskDate = document.createElement("input");
            var editLabel = document.createElement("button");
            buttons.setAttribute("id", i);
            buttons.classList.add("deleteButtons");
            editLabel.setAttribute("id", editLabel);
            
            // styling
            buttons.style.borderRadius = "50%";
            buttons.style.border = "1px solid white";
            buttons.style.height = "14px";
            buttons.style.marginRight = "10px";
            buttons.style.display = "inline-block";

            taskInfo.setAttribute("value", string);
            taskInfo.setAttribute("readonly", "readonly");
            taskInfo.style.background = "rgb(84, 95, 107)";
            taskInfo.style.color = "white";
            taskInfo.style.border = "none";
            taskInfo.style.width = "60px";
            taskInfo.setAttribute("type", "text");
            taskInfo.classList.add("taskName");

            due.innerHTML = "| Due: ";
            due.style.marginLeft = "85px";

            taskDate.setAttribute("value", dates);
            taskDate.style.background = "rgb(84, 95, 107)";
            taskDate.style.color = "white";
            taskDate.style.border = "none";
            taskDate.style.width = "80px";
            taskDate.setAttribute("readonly", "readonly");
            taskDate.setAttribute("type", "text");
            taskDate.classList.add("taskDate");

            editLabel.innerHTML = "✏️";
            editLabel.setAttribute("id", i);
            editLabel.style.backgroundColor = "rgb(84, 95, 107)"
            editLabel.style.border = "none";
            editLabel.classList.add("editIcon");
            
            items.setAttribute("id", i);
            items.appendChild(buttons);
            items.appendChild(taskInfo);
            items.appendChild(due);
            items.appendChild(taskDate);
            items.appendChild(editLabel);
            todolist.appendChild(items);
        }

        // deleting
        list = document.getElementsByClassName("deleteButtons");
        for (var i = 0; i < list.length; i++) {
            list[i].addEventListener("click", function (i) {
                var taskName = taskArray[i.target.id].item;
                var taskDate = taskArray[i.target.id].date;
                var taskIDS = taskArray[i.target.id].taskID;
                saveItem(taskName, taskDate, taskIDS);
                deleteItem(i.target.id, taskArray);
                displayHistory();
            });
        }

        // editing
        editList = document.getElementsByClassName("editIcon");
        for (var i = 0; i < editList.length; i++) {
            editList[i].addEventListener("click", function (i) {
                var taskName = document.getElementsByClassName("taskName");
                var taskDate = document.getElementsByClassName("taskDate");
                var taskIndex = i.target.id;
                if (i.target.innerHTML == "✏️") {
                    i.target.innerHTML = "Save";
                    i.target.style.color = "white";
                    taskName[taskIndex].removeAttribute("readonly");
                    taskDate[taskIndex].removeAttribute("readonly");
                } else {
                    var paragraph = taskName[taskIndex].value;
                    var dateInput = taskDate[taskIndex].value;
                    var validParagraph = checkTask(paragraph);
                    var validDate = checkDate(dateInput);
                    if (validParagraph && validDate) {
                        var ID = taskArray[taskIndex].taskID;
                        taskArray[taskIndex] = {item: paragraph, date: dateInput, taskID: ID}
                        var string = JSON.stringify(taskArray);
                        localStorage.setItem("todostorage", string);
                    }
                    i.target.innerHTML = "✏️";
                    showTasks();
                }
            });
        }
    
    }
    
} 

// sorts the array
function sortArray (taskArray, value) {
    if (value == "0") {
        taskArray.sort(function(a, b) {
            var taskA = a.taskID;
            var taskB = b.taskID;
            if (taskA < taskB) {
                return -1
            } else if (taskA > taskB) {
                return 1
            } else {
                return 0
            }
        });
        return taskArray;
    } else if (value == "1") {
        taskArray.sort(function(a, b) {
            var textA = a.item.toUpperCase();
            var textB = b.item.toUpperCase();
            if (textA < textB) {
                return -1
            } else if (textA > textB) {
                return 1
            } else {
                return 0
            }
        });
        return taskArray;
    } else {
        taskArray.sort(function(item1, item2) {
            a = item1.date;
            b = item2.date;
            var aMonth = parseInt(a.substring(0, 2));
            var aDay = parseInt(a.substring (3, 5));
            var aYear = parseInt(a.substring(6,10));
            var bMonth = parseInt(b.substring(0, 2));
            var bDay = parseInt(b.substring (3, 5));
            var bYear = parseInt(b.substring(6,10));
            if (aYear < bYear) {
                return -1
            } else if (aYear > bYear) {
                return 1
            } else {
                if (aMonth < bMonth) {
                    return -1
                } else if (aMonth > bMonth) {
                    return 1
                } else {
                    if (aDay < bDay) {
                        return -1
                    } else if (aDay > bDay) {
                        return 1
                    } else {
                        return 0
                    }
                }
            }
        });
        return taskArray;
    }
}

// deletes task
function deleteItem(index, taskArray) {
    var items = taskArray[index];
    taskArray.splice(index, 1);
    var string = JSON.stringify(taskArray);
    localStorage.setItem("todostorage", string);
    showTasks();
}

// saves deleted task
function saveItem(taskName, taskDate, taskIDS) {
    var completedArray = localStorage.getItem("completed");
    var array = JSON.parse(completedArray);
    if (array == null || array.length == 0) {
        array = [{item: taskName, date: taskDate, taskID: taskIDS}];
    } else {
        array[array.length] = {item: taskName, date: taskDate, taskID: taskIDS};
    } 
    var stringArray = JSON.stringify(array);
    localStorage.setItem("completed", stringArray);
}

// edits task
function editItem (index, taskArray, inputs) {
    var inputs = document.createElement("input");
}

// settings
settings.addEventListener("click", function() {
    var setting = document.getElementById("setting");
    var completedTasks = document.getElementById("completedTasks");
    if (setting.style.display == "block") {
        setting.style.display = "none";
        completedTasks.style.display = "none";
    } else {
        setting.style.display = "block";
        completedTasks.style.display = "none";
    }
})

// clear all tasks
clear.addEventListener("click", function() {
    taskArray = [];
    var string = JSON.stringify(taskArray);
    localStorage.setItem("todostorage", string);
    showTasks();
})

// refresh the todo list
refresh.addEventListener("click", function() {
    showTasks();
})

// display task history
function displayHistory () {
    var completedTasks = document.getElementById("completedTasks");
    completedTasks.style.display = "block";
    var tasks = localStorage.getItem("completed");
    var taskArray = JSON.parse(tasks);
    let list = document.getElementById("list");
    list.innerHTML = ""

    if (taskArray != null) {
        for (var i = 0; i < taskArray.length; i++) {
            var string = taskArray[i].item;
            var dates = taskArray[i].date;
            var items = document.createElement("li");
            items.appendChild(document.createTextNode(string + " | Due: " + dates));
            list.appendChild(items);
        }
    }
}

history.addEventListener("click", function(){
    displayHistory();
})

// close task history
closeTasks.addEventListener("click", function() {
    var completedTasks = document.getElementById("completedTasks");
    completedTasks.style.display = "none";
})

// clear task history
clearHistory.addEventListener("click", function() {
    taskArray = [];
    var string = JSON.stringify(taskArray);
    localStorage.setItem("completed", string);
    let list = document.getElementById("list");
    list.innerHTML = ""
})

showTasks();