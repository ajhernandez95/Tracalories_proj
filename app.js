// Item Controller where data is handled
const ItemCtrl = (function() {
  function Item(name, calories, id) {
    (this.name = name), (this.calories = calories), (this.id = id);
  }
  let data = {
    items: [],
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
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    itemList: "#item-list"
  };
  return {
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
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller where everything comes together...
const App = (function(ItemCtrl, UICtrl) {
  const UISelectors = UICtrl.getSelectors();
  function loadEventListeners() {
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", addItemSubmit);
  }
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
  return {
    init: function() {
      if (ItemCtrl.logData().items.length < 1) {
        UICtrl.hideList();
      }
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
