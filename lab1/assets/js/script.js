let name="BookStore"
let version=1
let indexSn
let ul = document.getElementById("bookList");
let div=document.getElementById("bookViewer")
let p1 = document.createElement('p');
let p2 = document.createElement('p');
let p3 = document.createElement('p');
document.getElementById("addButton").addEventListener("click",function () {
addBook()
})
document.getElementById("searchListButton").addEventListener("click",function () {
   getAll()
})
document.getElementById("clearStoreButton").addEventListener("click",function () {
    deleteAll()
})
document.getElementById("deleteButton").addEventListener("click",function (e) {
    let sn=document.getElementById("snToDelete").value
    let id=document.getElementById("idToDelete").value
    if(id.length>0 && sn.length>0)
        alert("please select one id or sn")
    else if(sn.length>0) deleteSN(sn)
    else if(id.length>0) deleteID(id)
    else alert("please enter id or sn")
})


let db
function startConnect() {
    let openRequest = indexedDB.open(name,version);
    openRequest.onupgradeneeded = function(e) {
        console.log("running onupgradeneeded");
        db = e.target.result;
            if (!db.objectStoreNames.contains('books')) {
               let objStore= db.createObjectStore('books', {keyPath: 'id',autoIncrement : true});
               indexSn = objStore.createIndex('sn', 'sn');
            }
    }
    openRequest.onsuccess = function(e) {
        db = e.target.result;
    }
    openRequest.onerror = function(e) {
        console.log("onerror!");
    }
}
function addBook() {
    let transaction = db.transaction("books", "readwrite");
    let books = transaction.objectStore("books");
    let book = {
        title: document.getElementById("bookTitle").value,
        sn: document.getElementById("bookSn").value,
        year: document.getElementById("bookYear").value
    };
    if(!validateBookData(book)){
        let request = books.add(book);
        request.onsuccess = function() {
            alert("Book Added Successfully")
            getAll()

        };
        request.onerror = function() {
            console.log("Error", request.error);
        };
    }
}

function setHtml() {
    let li = ul.getElementsByTagName("li")
    while(li.length > 0) {
        ul.removeChild(li[0]);
    }
}
function setViewer() {
    let p = div.getElementsByTagName("p")
    while(p.length > 0) {
        div.removeChild(p[0]);
    }
}

function getAll(){
    setHtml()
    setViewer()
    let transaction = db.transaction("books","readonly");
    let books = transaction.objectStore("books");
    let request = books.openCursor();
    request.onsuccess = function() {
        let cursor = request.result;
        if (cursor) {
            let key = cursor.key;
            let value = cursor.value;
            console.log(value);
            let li = document.createElement('li');
            ul.appendChild(li);
            li.innerHTML=value.title
            li.onmousedown=ev =>{
                setViewer()
                div.appendChild(p1)
                p1.innerHTML="id : "+value.id
                div.appendChild(p2)
                p2.innerHTML="title : "+value.title
                div.appendChild(p3)
                p3.innerHTML="serial number : "+value.sn
            }
            cursor.continue();
        }
    };
}
function deleteAll(){
    setHtml()
    let transaction = db.transaction("books", "readwrite");
    let books = transaction.objectStore("books");
    books.clear();
    setViewer()
}
function deleteID(id){
    console.log(id)
    let transaction = db.transaction("books", "readwrite");
    let books = transaction.objectStore("books");
    let request = books.delete(Number(id));
    request.onsuccess=function () {
        getAll()
    }
    request.onerror=function () {
        alert("Id not exist")
    }
    setViewer()
}
function deleteSN(sn){
    console.log("deletesn")
    console.log(sn)
    let transaction = db.transaction("books", "readwrite");
    let books = transaction.objectStore("books");
    let index = books.index("sn");
    let request = index.getKey(sn);
    request.onsuccess = function() {
        let id = request.result;
        books.delete(Number(id));
        getAll()
    };
    request.onerror=function () {
        alert("serial number not exist")
    }
    setViewer()
}
startConnect()





