//  {name: 'Steak', calories: 599 id:0}, {name: 'Fish', calories: 400, id:1}

// Item Controller where data is handled
const ItemCtrl = (function() {
  function Item(name, calories, id) {
    (this.name = name), (this.calories = calories), (this.id = id);
  }
  let data = {
    items: [
      { name: "Steak", calories: 599, id: 0 },
      { name: "Fish", calories: 400, id: 1 }
    ],
    currentItem: null,
    totalCalories: 0
  };
  return {
    createNewItem: function(name, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);
      const newItem = new Item(name, calories, ID);
      data.items.push(newItem);
      return newItem;
    },
    logData: function() {
      return data;
    }
  };
})();

// UI Controller where dynamic rendering happens
const UICtrl = (function() {
  const UISelectors = {
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    itemList: "#item-list"
  };
  return {
    populateList: function(items) {
      items.forEach(item => {
        UICtrl.addItemToList(item);
      });
    },
    addItemToList: function(item) {
      let li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em>${
        item.calories
      } Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateItem: function(targetItem, items) {
      let itemIDArr = targetItem.id.split("-");
      let ID = parseInt(itemIDArr[1]);
      console.log(ID);
      console.log(items);
      let itemToUpdate = items.filter(item => {
        if (item.id === ID) {
          return item;
        }
      });
      //   CONTINUE HERE...YOU HAVE GRABBED THE TARGETED ITEM SO FAR...
    },
    clearFormInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showList: function() {
      document.querySelector(UISelectors.itemList).style.display = "block";
    },
    hideEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller where everything comes together...
const App = (function(ItemCtrl, UICtrl) {
  const UISelectors = UICtrl.getSelectors();
  function loadEventListeners() {
    // Add btn event listener
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", addItemSubmit);
    // Edit btn event listener
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", editItemClick);
  }
  // Add btn func
  function addItemSubmit(e) {
    UICtrl.showList();
    let newItem = ItemCtrl.createNewItem(
      document.querySelector(UISelectors.itemNameInput).value,
      document.querySelector(UISelectors.itemCaloriesInput).value
    );
    UICtrl.addItemToList(newItem);
    UICtrl.clearFormInput();
    e.preventDefault();
  }
  //Edit btn func
  function editItemClick(e) {
    if (e.target.classList.contains("edit-item")) {
      UICtrl.updateItem(
        e.target.parentNode.parentNode,
        ItemCtrl.logData().items
      );
    }
    e.preventDefault();
  }

  return {
    init: function() {
      if (ItemCtrl.logData().items.length < 1) {
        UICtrl.hideList();
      } else {
        UICtrl.populateList(ItemCtrl.logData().items);
      }
      UICtrl.hideEditState();
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
