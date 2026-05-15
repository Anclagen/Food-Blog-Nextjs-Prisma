import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ShoppingListAttributes {
  id: string;
  title: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ShoppingListCreationAttributes extends Optional<ShoppingListAttributes, "id"> {}

class ShoppingList extends Model<ShoppingListAttributes, ShoppingListCreationAttributes> {
  declare id: string;
  declare title: string;
  declare userId: string;
}

ShoppingList.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "ShoppingList",
    tableName: "shopping_lists",
  }
);

export default ShoppingList;
