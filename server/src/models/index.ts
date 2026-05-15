import User from "./User";
import ShoppingList from "./ShoppingList";
import ShoppingListItem from "./ShoppingListItem";

User.hasMany(ShoppingList, { foreignKey: "userId", as: "lists" });
ShoppingList.belongsTo(User, { foreignKey: "userId", as: "owner" });

ShoppingList.hasMany(ShoppingListItem, { foreignKey: "listId", as: "items", onDelete: "CASCADE" });
ShoppingListItem.belongsTo(ShoppingList, { foreignKey: "listId", as: "list" });

export { User, ShoppingList, ShoppingListItem };
