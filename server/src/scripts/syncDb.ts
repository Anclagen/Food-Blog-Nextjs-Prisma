import "../config/database";
import "../models";
import sequelize from "../config/database";

async function sync() {
  await sequelize.sync({ alter: true });
  console.log("Database synced");
  process.exit(0);
}

sync().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
