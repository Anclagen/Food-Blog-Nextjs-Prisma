import { Router, Request, Response } from "express";
import { ShoppingList, ShoppingListItem } from "../models";
import { SubstitutionSetting } from "../models/ShoppingListItem";

const router = Router();

// GET /api/lists — get all lists for the current user
router.get("/", async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const lists = await ShoppingList.findAll({
    where: { userId },
    include: [{ model: ShoppingListItem, as: "items" }],
    order: [["createdAt", "DESC"]],
  });
  res.json({ data: lists });
});

// POST /api/lists — create a new list
router.post("/", async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const { title } = req.body as { title?: string };
  if (!title?.trim()) return res.status(400).json({ error: "title is required" });

  const list = await ShoppingList.create({ title: title.trim(), userId });
  res.status(201).json({ data: list });
});

// DELETE /api/lists/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const list = await ShoppingList.findOne({ where: { id: req.params.id, userId } });
  if (!list) return res.status(404).json({ error: "List not found" });

  await ShoppingListItem.destroy({ where: { listId: list.id } });
  await list.destroy();
  res.status(204).send();
});

// POST /api/lists/:id/items — add item to a list
router.post("/:id/items", async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const list = await ShoppingList.findOne({ where: { id: req.params.id, userId } });
  if (!list) return res.status(404).json({ error: "List not found" });

  const { ean, kassalProductId, name, image, quantity } = req.body as {
    ean?: string;
    kassalProductId?: number;
    name?: string;
    image?: string;
    quantity?: number;
  };

  if (!name?.trim()) return res.status(400).json({ error: "name is required" });

  const item = await ShoppingListItem.create({
    listId: list.id,
    ean: ean ?? null,
    kassalProductId: kassalProductId ?? null,
    name: name.trim(),
    image: image ?? null,
    quantity: quantity ?? 1,
  });
  res.status(201).json({ data: item });
});

// PATCH /api/lists/:id/items/:itemId — update checked / substitution setting
router.patch("/:id/items/:itemId", async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const list = await ShoppingList.findOne({ where: { id: req.params.id, userId } });
  if (!list) return res.status(404).json({ error: "List not found" });

  const item = await ShoppingListItem.findOne({
    where: { id: req.params.itemId, listId: list.id },
  });
  if (!item) return res.status(404).json({ error: "Item not found" });

  const { checked, substitutionSetting, quantity } = req.body as {
    checked?: boolean;
    substitutionSetting?: SubstitutionSetting;
    quantity?: number;
  };

  const validSettings: SubstitutionSetting[] = ["allow_any", "no_store_brand", "exact_only"];
  if (substitutionSetting && !validSettings.includes(substitutionSetting)) {
    return res.status(400).json({ error: "Invalid substitutionSetting" });
  }

  if (checked !== undefined) item.checked = checked;
  if (substitutionSetting !== undefined) item.substitutionSetting = substitutionSetting;
  if (quantity !== undefined) item.quantity = quantity;

  await item.save();
  res.json({ data: item });
});

// DELETE /api/lists/:id/items/:itemId
router.delete("/:id/items/:itemId", async (req: Request, res: Response) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(401).json({ error: "Unauthorised" });

  const list = await ShoppingList.findOne({ where: { id: req.params.id, userId } });
  if (!list) return res.status(404).json({ error: "List not found" });

  const item = await ShoppingListItem.findOne({
    where: { id: req.params.itemId, listId: list.id },
  });
  if (!item) return res.status(404).json({ error: "Item not found" });

  await item.destroy();
  res.status(204).send();
});

export default router;
