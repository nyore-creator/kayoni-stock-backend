import Stock from '../models/Stock.js';

// Record Stock In (purchase)
export const addStockIn = async (req, res) => {
  try {
    const { itemName, quantity, price } = req.body;
    if (!itemName || quantity == null || price == null) {
      return res.status(400).json({ error: 'itemName, quantity, price required' });
    }
    const stock = await Stock.create({ itemName, quantity, price, type: 'in' });
    res.status(201).json({ message: 'Stock In recorded', stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record Stock Out (sale)
export const addStockOut = async (req, res) => {
  try {
    const { itemName, quantity, price } = req.body;
    if (!itemName || quantity == null || price == null) {
      return res.status(400).json({ error: 'itemName, quantity, price required' });
    }
    const stock = await Stock.create({ itemName, quantity, price, type: 'out' });
    res.status(201).json({ message: 'Stock Out recorded', stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Business Matrix Report
export const getReport = async (req, res) => {
  try {
    const stocks = await Stock.find().lean();

    const matrix = {};
    for (const s of stocks) {
      const item = s.itemName;
      if (!matrix[item]) {
        matrix[item] = {
          purchasedQty: 0,
          purchaseCostPerItem: 0,
          totalPurchaseCost: 0,
          soldQty: 0,
          salePricePerItem: 0,
          totalSalesRevenue: 0,
          remainingQty: 0,
          remainingValue: 0,
          cogs: 0,
          profit: 0
        };
      }

      if (s.type === 'in') {
        matrix[item].purchasedQty += s.quantity;
        // For simplicity, we’ll treat the latest purchase price as the current cost per item.
        matrix[item].purchaseCostPerItem = s.price;
        matrix[item].totalPurchaseCost += s.quantity * s.price;
      } else {
        matrix[item].soldQty += s.quantity;
        // Latest sale price as current sale price per item (you can later compute averages if needed)
        matrix[item].salePricePerItem = s.price;
        matrix[item].totalSalesRevenue += s.quantity * s.price;
      }
    }

    // Compute remaining, COGS, and profit
    for (const item in matrix) {
      const m = matrix[item];
      m.remainingQty = Math.max(m.purchasedQty - m.soldQty, 0);
      m.remainingValue = m.remainingQty * m.purchaseCostPerItem;

      // COGS uses purchase cost per item for items sold (bounded by purchased qty)
      const soldForCost = Math.min(m.soldQty, m.purchasedQty);
      m.cogs = soldForCost * m.purchaseCostPerItem;

      m.profit = m.totalSalesRevenue - m.cogs;
    }

    res.json({ matrix });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
