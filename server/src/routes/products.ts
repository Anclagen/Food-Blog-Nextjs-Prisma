import { Router, Request, Response } from "express";
import { searchProducts, getProductByEan, getBulkPrices } from "../services/kassal";

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q || q.trim().length < 3) {
    return res.status(400).json({ error: "Query must be at least 3 characters" });
  }
  try {
    const products = await searchProducts(q.trim(), 20);
    res.json({ data: products });
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch products" });
  }
});

router.get("/ean/:ean", async (req: Request, res: Response) => {
  const { ean } = req.params;
  try {
    const product = await getProductByEan(ean);
    res.json({ data: product });
  } catch (err) {
    res.status(404).json({ error: "Product not found" });
  }
});

router.post("/bulk-prices", async (req: Request, res: Response) => {
  const { eans } = req.body as { eans?: string[] };
  if (!Array.isArray(eans) || eans.length === 0) {
    return res.status(400).json({ error: "eans must be a non-empty array" });
  }
  if (eans.length > 100) {
    return res.status(400).json({ error: "Maximum 100 EANs per request" });
  }
  try {
    const prices = await getBulkPrices(eans);
    res.json({ data: prices });
  } catch (err) {
    res.status(502).json({ error: "Failed to fetch prices" });
  }
});

export default router;
