import db from "../config/db.js";

// Get products by category
export const getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;
  const { sort = 'newest' } = req.query;

  try {
    let orderBy = 'p.id DESC'; // default newest
    if (sort === 'oldest') orderBy = 'p.id ASC';
    else if (sort === 'name-asc') orderBy = 'p.name ASC';
    else if (sort === 'name-desc') orderBy = 'p.name DESC';

    const products = await db.any(`
      SELECT p.*, c.name as category_name, f.extension as format_extension, l.name as logiciel_name
      FROM products p
      LEFT JOIN categories c ON p.id_category = c.id
      LEFT JOIN formats f ON p.id_format = f.id
      LEFT JOIN logiciels l ON p.id_logiciel = l.id
      WHERE c.name ILIKE $1
      ORDER BY ${orderBy}
    `, [categoryName]);

    res.json(products);
  } catch (error) {
    console.log('Error fetching products by category:', error);
    res.status(500).json({ error: 'Error fetching products by category' });
  }
};

// Get products by Format
export const getProductsByFormat = async (req, res) => {
  const { formatName } = req.params;
  const { sort = 'newest' } = req.query;

  try {
    let orderBy = 'p.id DESC'; // default newest
    if (sort === 'oldest') orderBy = 'p.id ASC';
    else if (sort === 'name-asc') orderBy = 'p.name ASC';
    else if (sort === 'name-desc') orderBy = 'p.name DESC';

    const products = await db.any(`
      SELECT p.*, c.name as category_name, f.extension as format_extension, l.name as logiciel_name
      FROM products p
      LEFT JOIN categories c ON p.id_category = c.id
      LEFT JOIN formats f ON p.id_format = f.id
      LEFT JOIN logiciels l ON p.id_logiciel = l.id
      WHERE f.extension ILIKE $1
      ORDER BY ${orderBy}
    `, [formatName]);

    res.json(products);
  } catch (error) {
    console.log('Error fetching products by Format:', error);
    res.status(500).json({ error: 'Error fetching products by format' });
  }
};

// Get products by logiciel
export const getProductsByLogiciel = async (req, res) => {
  const { logicielName } = req.params;
  const { sort = 'newest' } = req.query;

  try {
    let orderBy = 'p.id DESC'; // default newest
    if (sort === 'oldest') orderBy = 'p.id ASC';
    else if (sort === 'name-asc') orderBy = 'p.name ASC';
    else if (sort === 'name-desc') orderBy = 'p.name DESC';

    const products = await db.any(`
      SELECT p.*, c.name as category_name, f.extension as format_extension, l.name as logiciel_name
      FROM products p
      LEFT JOIN categories c ON p.id_category = c.id
      LEFT JOIN formats f ON p.id_format = f.id
      LEFT JOIN logiciels l ON p.id_logiciel = l.id
      WHERE l.name ILIKE $1
      ORDER BY ${orderBy}
    `, [logicielName]);

    res.json(products);
  } catch (error) {
    console.log('Error fetching products by logiciel:', error);
    res.status(500).json({ error: 'Error fetching products by logiciel' });
  }
};

// Get all products with sorting
export const getProductsWithSort = async (req, res) => {
  const { sort = 'newest' } = req.query;

  try {
    let orderBy = 'product_id DESC'; // default newest
    if (sort === 'oldest') orderBy = 'product_id ASC';
    else if (sort === 'name-asc') orderBy = 'name ASC';
    else if (sort === 'name-desc') orderBy = 'name DESC';

    const products = await db.any(`
      SELECT *
      FROM Full_product
      ORDER BY ${orderBy}
    `);

    res.json(products);
  } catch (error) {
    console.log('Error fetching products with sort:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
}; 