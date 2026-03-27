import Product from '../models/product.model';

export const checkLowStock = async () => {
  try {
    // Utilize MongoDB explicit aggregation pipelines organically parsing thresholds
    const lowStockProducts = await Product.aggregate([
      {
        $match: {
          $expr: {
            $lte: ["$stock", "$lowStockThreshold"]
          }
        }
      },
      {
         $project: {
             _id: 1,
             name: 1,
             stock: 1,
             lowStockThreshold: 1,
             category: 1
         }
      }
    ]);
    
    return lowStockProducts;
  } catch (error) {
    console.error("[StockChecker] Fatal analysis failure:", error);
    return [];
  }
};
