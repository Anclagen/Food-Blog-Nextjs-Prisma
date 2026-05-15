import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type SubstitutionSetting = "allow_any" | "no_store_brand" | "exact_only";

interface ShoppingListItemAttributes {
  id: string;
  listId: string;
  ean: string | null;
  kassalProductId: number | null;
  name: string;
  image: string | null;
  quantity: number;
  substitutionSetting: SubstitutionSetting;
  checked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ShoppingListItemCreationAttributes
  extends Optional<
    ShoppingListItemAttributes,
    "id" | "ean" | "kassalProductId" | "image" | "quantity" | "substitutionSetting" | "checked"
  > {}

class ShoppingListItem extends Model<
  ShoppingListItemAttributes,
  ShoppingListItemCreationAttributes
> {
  declare id: string;
  declare listId: string;
  declare ean: string | null;
  declare kassalProductId: number | null;
  declare name: string;
  declare image: string | null;
  declare quantity: number;
  declare substitutionSetting: SubstitutionSetting;
  declare checked: boolean;
}

ShoppingListItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    listId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "shopping_lists", key: "id" },
    },
    ean: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kassalProductId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    substitutionSetting: {
      type: DataTypes.ENUM("allow_any", "no_store_brand", "exact_only"),
      defaultValue: "allow_any",
    },
    checked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "ShoppingListItem",
    tableName: "shopping_list_items",
  }
);

export default ShoppingListItem;
