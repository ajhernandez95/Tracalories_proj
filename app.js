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
    updateItem: function(name, calories) {
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          document.querySelector(`#item-${item.id}`).innerHTML = `<strong>${
            item.name
          }: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
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

      let itemToUpdate;
      for (key in items) {
        if (items[key].id === ID) {
          itemToUpdate = items[key];
        }
      }
      document.querySelector(UISelectors.itemNameInput).value =
        itemToUpdate.name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        itemToUpdate.calories;
      UICtrl.showEditState();
      return itemToUpdate;
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
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
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
    // Edit submit event listener
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", editItemSubmit);
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
      const itemToUpdate = UICtrl.updateItem(
        e.target.parentNode.parentNode,
        ItemCtrl.logData().items
      );

      ItemCtrl.setCurrentItem(itemToUpdate);
    }
    e.preventDefault();
  }
  // Edit submit func
  function editItemSubmit(e) {
    const name = document.querySelector(UISelectors.itemNameInput).value;
    const calories = document.querySelector(UISelectors.itemCaloriesInput)
      .value;
    ItemCtrl.updateItem(name, calories);
    UICtrl.clearFormInput();
    UICtrl.hideEditState();
    e.preventDefault();
  }

  return {
    init: function() {
      UICtrl.clearFormInput();
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
