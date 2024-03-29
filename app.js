//storage controller

const StorageCtrl = (function(){
    //public methods
    return{
        storeItem: function(item){
            let items = [];
            //check if there is any item in local storage
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);

                //set local storage
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));

                //push the new item
                items.push(item);

                //reset localstorage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
               
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();




//item controller
const ItemCtrl = (function(){
    //Item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories =calories;
    }

    //data structure /state
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    //public methods
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            //create id
            if(data.items.length >0){
                ID = data.items[data.items.length-1].id+1;
            }else{
                ID = 0;
            }

            //calories to number
            calories = parseInt(calories);

            //create new item
            newItem = new Item(ID, name, calories);

            //add to items array
            data.items.push(newItem);

            return newItem;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        updateItem: function(name, calories){
            //calories to number
            calories = parseInt(calories);

            let found =null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                
                }
            });
            return found;
        },
        deleteItem: function(id){
            //get ids

            ids = data.items.map(function(item){
                return item.id;
            });

            //get the index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        getTotalCalories: function(){
            let total = 0;
            //loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories;
            });
            //set total calories in data structure
            data.totalCalories = total;

            return data.totalCalories;
        },
        getItemByID: function(id){
            let found = null;

            //loop through items
            data.items.forEach(function(item){
                if(item.id===id){
                    found = item;
                }
                
            });
            return found;

        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        
        logData : function(){
            return data;
        }
        
    }
})();





//ui controller
const UICtrl = (function(){

        const UISelectors = {
            itemList: '#item-list',
            addBtn: '.add-btn',
            itemNameInput: '#item-name',
            itemCaloriesInput: '#item-calories',
            totalCalories: '.total-calories',
            updateBtn: '.update-btn',
            deleteBtn: '.delete-btn',
            backBtn : '.back-btn',
            listItems: '#item-list li',
            clearBtn: '.clear-btn'
        }

        //public methods
        return{
            populateItemList: function(items){
                let html = '';
                items.forEach(function(item){
                    html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`
                });
                
                //insert list items 
                document.querySelector(UISelectors.itemList).innerHTML = html;
            },
            getItemInput: function(){
                return{
                    name: document.querySelector(UISelectors.itemNameInput).value,
                    calories: document.querySelector(UISelectors.itemCaloriesInput).value
                }
            },
            addListItem: function(item){
                //show the list
                document.querySelector(UISelectors.itemList).style.display = 'block'
                //create li element
                const li = document.createElement('li');
                // add class
                li.className = 'collection-item';
                //add id
                li.id = `item-${item.id}`;
                //add html
                li.innerHTML = `<strong>${item.name}:</strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>`;
                //insert item
                document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
            },
            updateListItem: function(item){
                let listItems = document.querySelectorAll(UISelectors.listItems);

                //Turn nodelist into array
                listItems = Array.from(listItems);

                listItems.forEach(function(listItem){
                    const itemID = listItem.getAttribute('id');
                    console.log(itemID);
                    console.log(item.id);
                    if(itemID === `item-${item.id}`){
                        document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong><em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>`;
                    }
                });
            },
            deleteListItem: function(id){
                const itemID = `#item-${id}`;
                const item = document.querySelector(itemID);
                item.remove();
            },
            removeItems: function(){
                let listItems = document.querySelectorAll(UISelectors.listItems);
                //turn node list into array
                listItems = Array.from(listItems);

                listItems.forEach(function(item){
                    item.remove();
                })
            },
            addItemtoForm: function(){
                document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
                document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
                UICtrl.showEditState();
            },
            clearInput : function(){
                document.querySelector(UISelectors.itemNameInput).value = '';
                document.querySelector(UISelectors.itemCaloriesInput).value = '';
            },
            hideList: function(){
                document.querySelector(UISelectors.itemList).style.display = 'none';
            },
            showTotalCalories: function(totalCalories){
                
                document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
            },
            clearEditState: function(){
                UICtrl.clearInput();
                document.querySelector(UISelectors.addBtn).style.display = 'inline';
                document.querySelector(UISelectors.backBtn).style.display = 'none';
                document.querySelector(UISelectors.deleteBtn).style.display = 'none';
                document.querySelector(UISelectors.updateBtn).style.display = 'none';
            },
            
            showEditState: function(){
                
                document.querySelector(UISelectors.addBtn).style.display = 'none';
                document.querySelector(UISelectors.backBtn).style.display = 'inline';
                document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
                document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            },
            getSelectors: function(){
                return UISelectors;
            }
        }
})();



//app controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    //load eventlisteners
    const loadEventListeners = function(){
        //get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })
        
        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)
    
        //update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)
    
        //backbutton event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)
    
        //delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)
        
        //clear button item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems)
    
    }

    //add item submit
    const itemAddSubmit =  function(e){
        
        //get form input from ui controller
        const input = UICtrl.getItemInput();

        //check for name and calories input
        if(input.name !== '' && input.calories !== ''){
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //add item to UI list
             UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total calories into the UI
            UICtrl.showTotalCalories(totalCalories);

            //store in loca storage
            StorageCtrl.storeItem(newItem);

             //clear input fields
             UICtrl.clearInput();
        }

        

        e.preventDefault();
    }

    //click edit item
    const itemEditClick = function(e){

        if(e.target.classList.contains('edit-item')){
            //get list item id
            const listId = e.target.parentNode.parentNode.id;
            
            //break into an array
            const listIdArr = listId.split('-');
            
            //get the actual id
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemByID(id);

            //set currentitem
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemtoForm();
        }
        
        e.preventDefault();
    }

    //item update submit
    const itemUpdateSubmit = function(e){

        //get item input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem =ItemCtrl.updateItem(input.name, input.calories);

        //update UI
        //console.log(updatedItem);
        UICtrl.updateListItem(updatedItem);

         //get total calories
         const totalCalories = ItemCtrl.getTotalCalories();

         //add total calories into the UI
         UICtrl.showTotalCalories(totalCalories);

         //update local storage
         StorageCtrl.updateItemStorage(updatedItem);

         UICtrl.clearEditState();

        e.preventDefault();
    }

    const itemDeleteSubmit = function(e){
        
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from the data structure
        ItemCtrl.deleteItem(currentItem.id);

        //delete from ui
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories into the UI
        UICtrl.showTotalCalories(totalCalories);

        //delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
        e.preventDefault();

    }

    const clearAllItems = function(e){
        //delete all items from data structure

        ItemCtrl.clearAllItems();

       //remove items from ui
        UICtrl.removeItems(); 
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories into the UI
        UICtrl.showTotalCalories(totalCalories);

        //remove items from ui
        UICtrl.removeItems();

        //remove from local storage
        StorageCtrl.clearItemsFromStorage();

        //hide ul
        UICtrl.hideList();
    }
    //public methods
    return{
        init: function(){
           
            //clear edit state / set initial state
            UICtrl.clearEditState();


            //Fetch items from datastructure
            const items = ItemCtrl.getItems();

            //check if any items 
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                 //Populate list with items
            UICtrl.populateItemList(items);

            }

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total calories into the UI
            UICtrl.showTotalCalories(totalCalories);
            
           
            //call load event listener
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();