import db from "../config/db.js";

// Add a product to user's favorites
export const addToFavorites = async (req, res) => {
  const { productId  } = req.body;
  const userId = req.user.id;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    // Check if product exists
    const product = await db.oneOrNone('SELECT * FROM products WHERE id = $1', [productId]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in favorites
    const existingFavorite = await db.oneOrNone(
      'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingFavorite) {
      return res.status(409).json({ error: 'Product already in favorites' });
    }

    // Add to favorites
    await db.none(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)',
      [userId, productId]
    );

    res.status(201).json({ message: 'Product added to favorites' });
  } catch (error) {
    console.log('Error adding to favorites:', error);
    res.status(500).json({ error: 'Error adding to favorites' });
  }
};

// Remove a product from user's favorites
export const removeFromFavorites = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const result = await db.result(
      'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    console.log('Error removing from favorites:', error);
    res.status(500).json({ error: 'Error removing from favorites' });
  }
};

// Get user's favorite products
export const getUserFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await db.any(`
      SELECT p.*, c.name as category_name, f.extension as format_extension, l.name as logiciel_name
      FROM favorites fav
      JOIN products p ON fav.product_id = p.id
      LEFT JOIN categories c ON p.id_category = c.id
      LEFT JOIN formats f ON p.id_format = f.id
      LEFT JOIN images i ON p.id_image = i.id
      LEFT JOIN logiciels l ON p.id_logiciel = l.id
      WHERE fav.user_id = $1
      ORDER BY fav.date_created DESC
    `, [userId]);

    res.json(favorites);
  } catch (error) {
    console.log('Error fetching favorites:', error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};

// Check if a product is in user's favorites
export const checkFavorite = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const favorite = await db.oneOrNone(
      'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.log('Error checking favorite:', error);
    res.status(500).json({ error: 'Error checking favorite status' });
  }
}; 