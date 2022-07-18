const toRead = [];
const RENDER_EVENT = "render-todo";

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

const incompleteBook = "toRead";
const completeBook = "complete-toRead";


document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("form");

    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

function addBook(){
    const bookTitle = document.getElementById("title").value;
    const bookAuthor = document.getElementById("author").value;
    const bookYear = document.getElementById("year").value;

    const incomplete = document.getElementById(incompleteBook);
    const complete = document.getElementById(completeBook);

    const isComplete = document.getElementById("isComplete").checked;

    const generateID = generateId();
    const toReadObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, isComplete);
    


    toRead.push(toReadObject);
    


    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function generateId(){
    return +new Date();
}

function generateBookObject(id, bookTitle, bookAuthor, bookYear, isComplete){
    return {
        id,
        bookTitle,
        bookAuthor,
        bookYear,
        isComplete
    }

}

document.addEventListener(RENDER_EVENT, function(){
    const unCompleteTODOList = document.getElementById("toRead");
    unCompleteTODOList.innerHTML="";

    const CompletedTODOList = document.getElementById("complete-toRead");
    CompletedTODOList.innerHTML="";

    for(toReadItem of toRead){
        const toReadElement = makeBook(toReadItem);
        
        if(toReadItem.isComplete == false){
            unCompleteTODOList.append(toReadElement);
        } else{
            CompletedTODOList.append(toReadElement);
        }

    }

});

////////////////// step 2 ////////////////
function makeBook(toReadObject) {
    const textTitle = document.createElement("h2");
    const textAuthor = document.createElement("p");
    const textYear = document.createElement("p");

    textTitle.innerText=toReadObject.bookTitle;
    textAuthor.innerText=toReadObject.bookAuthor;
    textYear.innerText=toReadObject.bookYear;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle,textAuthor,textYear);

    const container = document.createElement("div");
    container.classList.add("item")
    container.append(textContainer);
    container.setAttribute("id", 'todo-${toReadObject.id}');

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function(){
    
        removeTaskFromComplete(toReadObject.id);
    });

    if(toReadObject.isComplete){
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function(){
            undoTaskFromComplete(toReadObject.id);

        });
    
    
    container.append(undoButton,trashButton);
    
    } else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function(){
            addTaskToComplete(toReadObject.id);
        });
        

        
        container.append(checkButton,trashButton);
    }

    return container;
}

function addTaskToComplete(toReadId){
    const toReadTarget = findToRead(toReadId);
    if(toReadTarget==null) return;

    toReadTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromComplete(toReadId){
    const toReadTarget = findToReadIndex(toReadId);
    if(toReadTarget === -1) return;
    toRead.splice(toReadTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromComplete(toReadId){
    const toReadTarget = findToRead(toReadId);
    if(toReadTarget==null) return;

    toReadTarget.isComplete=false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function findToRead(toReadId){
    for(toReadItem of toRead){
        if(toReadItem.id===toReadId){
            return toReadItem;
        }
    }
    return null;
}

function findToReadIndex(toReadId) {
    for(index in toRead){
        if(toRead[index].id === toReadId){
            return index
        }
    }
    return -1
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(toRead);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() /* boolean */ {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
  }


document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
 
  let data = JSON.parse(serializedData);
 
  if(data !== null){
      for(todo of data){
          toRead.push(todo);
      }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}









function checkButtonForm() {
    const cbox = document.getElementById("isComplete");
    const submit = document.getElementById("Submit");
    if (cbox.checked == true){
      submit.innerText = "Sudah selesai dibaca";
    } else {
      submit.innerText = "Belum selesai dibaca";
    }
  };