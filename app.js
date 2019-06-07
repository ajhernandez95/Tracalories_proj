//  {name: 'Steak', calories: 599 id:0}, {name: 'Fish', calories: 400, id:1}
// LocalStorage Controller where data is stored & retrieved
const Storage = (function() {
  return {
    getStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    addToStorage: function(item) {
      let items = Storage.getStorage();
      items.push(item);
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteFromStorage: function(id) {
      let items = Storage.getStorage();
      let newItems = items.filter((item, index) => {
        if (item.id !== id) {
          return item;
        }
      });

      localStorage.setItem("items", JSON.stringify(newItems));
    },
    updateStorage: function(id, newItem) {
      let items = Storage.getStorage();

      items.forEach((item, index) => {
        if (item.id === id) {
          items[index] = newItem;
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearStorage: function() {
      localStorage.clear();
    }
  };
})();

// Item Controller where data is handled
const ItemCtrl = (function() {
  function Item(name, calories, id) {
    (this.name = name), (this.calories = calories), (this.id = id);
  }
  let data = {
    items: Storage.getStorage(),
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
      let newItem;
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = parseInt(calories);

          document.querySelector(`#item-${item.id}`).innerHTML = `<strong>${
            item.name
          }: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
          newItem = item;
        }
      });
      return newItem;
    },
    getCalories: function() {
      let calories = 0;

      data.items.forEach(item => {
        calories += parseInt(item.calories);
      });

      return calories;
    },
    deleteItem: function(id) {
      data.items.forEach((item, index) => {
        if (id === item.id) {
          data.items.splice(index, 1);
        }
      });
    },
    clearItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
      return item;
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
    clearAll: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    itemList: "#item-list",
    totalCalories: ".total-calories"
  };
  return {
    populateList: function(items) {
      items.forEach(item => {
        UICtrl.addItemToList(item);
      });
    },
    setCalories: function(calories) {
      calories = parseInt(calories);
      document.querySelector(UISelectors.totalCalories).textContent = calories;
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
    removeItem: function(id) {
      let item = document.querySelector(`#item-${id}`);
      item.remove();
    },
    clearItems: function() {
      const items = Array.from(
        document.querySelectorAll(`${UISelectors.itemList} li`)
      );

      items.forEach(item => {
        item.remove();
      });

      UICtrl.hideList();
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
    // Disable enter key
    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
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
    // Back btn event listener
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", backBtnFunc);
    // Delete btn event listner
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", deleteItem);
    // Clear all btn event listener
    document
      .querySelector(UISelectors.clearAll)
      .addEventListener("click", clearAll);
  }
  // Add btn func
  function addItemSubmit(e) {
    UICtrl.showList();
    let newItem = ItemCtrl.createNewItem(
      document.querySelector(UISelectors.itemNameInput).value,
      document.querySelector(UISelectors.itemCaloriesInput).value
    );
    UICtrl.addItemToList(newItem);
    Storage.addToStorage(newItem);
    // Update calories
    let totalCalories = ItemCtrl.getCalories();
    UICtrl.setCalories(totalCalories);

    UICtrl.clearFormInput();
    e.preventDefault();
  }
  // Edit btn func
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

    let newItem = ItemCtrl.updateItem(name, calories);
    Storage.updateStorage(ItemCtrl.logData().currentItem.id, newItem);

    const totalCalories = ItemCtrl.getCalories();
    UICtrl.setCalories(totalCalories);
    UICtrl.clearFormInput();
    UICtrl.hideEditState();
    e.preventDefault();
  }

  // Back btn func
  function backBtnFunc(e) {
    UICtrl.hideEditState();
    UICtrl.clearFormInput();

    e.preventDefault();
  }

  // Delete item func
  const deleteItem = function(e) {
    const id = ItemCtrl.logData().currentItem.id;
    ItemCtrl.deleteItem(id);
    UICtrl.removeItem(id);
    Storage.deleteFromStorage(id);
    UICtrl.clearFormInput();
    UICtrl.hideEditState();

    e.preventDefault();
  };

  // Clear all func
  function clearAll(e) {
    UICtrl.clearItems();
    ItemCtrl.clearItems();

    UICtrl.clearFormInput();
    Storage.clearStorage();
    UICtrl.hideEditState();
    e.preventDefault();
  }

  return {
    init: function() {
      UICtrl.clearFormInput();
      if (ItemCtrl.logData().items.length < 1) {
        UICtrl.hideList();
      } else {
        let items = ItemCtrl.logData().items;
        let totalCalories = ItemCtrl.getCalories();
        UICtrl.populateList(items);
        UICtrl.setCalories(totalCalories);
      }
      UICtrl.hideEditState();
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
