import db from "../config/db.js";


export const getAllProducts = async (req, res) =>{
    try {
    const products = await db.any(`
      SELECT * 
      FROM Full_product;
    `);
    res.json(products);

  } catch (err) {
    res.status(500).json({error :'Error fetching products ' });
    console.log(err);
  }
};

export const getProduct = async (req, res) =>{
    const { id } = req.params;
    try {
        const product = await db.oneOrNone(`  
        SELECT * 
        FROM full_product
        WHERE product_id = $1
            `, [id]);
        if (!product) return res.status(404).json({ error: 'User not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({error :'Error fetching product ' });
        console.log(err);
    }
};  

export const createProduct = async (req, res) =>{
  const { name, description, category, format, logiciel } = req.body;
  
  // Check if files were uploaded
  if (!req.files || !req.files.image || !req.files.file) {
    return res.status(400).json({
      error: 'Both image and file are required.'
    });
  }

  if (!name || !category || !format || !logiciel) {
    return res.status(400).json({
      error: 'All fields are required.'
    });
  }

  try {
    // Check for duplicate product name
    const existingProduct = await db.oneOrNone('SELECT * FROM products WHERE name = $1', [name]);
    if (existingProduct) {
      return res.status(409).json({ error: 'A product with this name already exists.' });
    }

    // Get file paths
    const imagePath = `/${req.files.image[0].filename}`;
    const filePath = `/${req.files.file[0].filename}`;

    let id_category;
    if(category){
    const result = await db.one(`
      WITH inserted AS (
        INSERT INTO categories(name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      )
      SELECT id FROM inserted
      UNION
      SELECT id FROM categories WHERE name = $1;
      `,[category]);
      id_category = result.id;
    }
    let id_format;
    if(format){
    const result = await db.one(`
      WITH inserted AS (
        INSERT INTO formats(extension)
        VALUES ($1)
        ON CONFLICT (extension) DO NOTHING
        RETURNING id
      )
      SELECT id FROM inserted
      UNION
      SELECT id FROM formats WHERE extension = $1;
      `,[format]);
      id_format = result.id;
    }
    let id_logiciel;
    if(logiciel){
    const result = await db.one(`
      WITH inserted AS (
        INSERT INTO logiciels(name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      )
      SELECT id FROM inserted
      UNION
      SELECT id FROM logiciels WHERE name = $1;
      `,[logiciel]);
      id_logiciel = result.id;
    }

    // Create image record
    const imageResult = await db.one(`
      INSERT INTO images(path)
      VALUES ($1)
      RETURNING id;
    `, [imagePath]);
    const id_image = imageResult.id;

    const newProduct = await db.one(`
      INSERT INTO products
        (name, description, fichier_path, id_category, id_format, id_image, id_logiciel)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [name, description, filePath, id_category, id_format, id_image, id_logiciel]);

    res.status(201).json(newProduct);

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateProduct = async (req, res) =>{
  const { id } = req.params;
  console.log(req.body)
  const { name, description, category, format, logiciel } = req.body;
  try {
    
    const existingProduct = await db.oneOrNone('SELECT * FROM products WHERE id = $1', [id]);
    console.log(existingProduct);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    let id_category;
    if(category){
    const result = await db.one(`
      WITH inserted AS (
        INSERT INTO categories(name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      )
      SELECT id FROM inserted
      UNION
      SELECT id FROM categories WHERE name = $1;
      `,[category]);
      id_category = result.id;
    }
    let id_format;
    if(format){
    const result = await db.one(`
      WITH inserted AS (
        INSERT INTO formats(extension)
        VALUES ($1)
        ON CONFLICT (extension) DO NOTHING
        RETURNING id
      )
      SELECT id FROM inserted
      UNION
      SELECT id FROM formats WHERE extension = $1;
      `,[format]);
      id_format = result.id;
    }
    let id_logiciel;
    if(logiciel){
    const result = await db.one(`
      WITH inserted AS (
        INSERT INTO logiciels(name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      )
      SELECT id FROM inserted
      UNION
      SELECT id FROM logiciels WHERE name = $1;
      `,[logiciel]);
      id_logiciel = result.id;
    }
    let id_image;
    if(image){
    const result = await db.one(`
      WITH inserted AS (
        INSERT INTO images(path)
        VALUES ($1)
        ON CONFLICT (path) DO NOTHING
        RETURNING id
      )
      SELECT id FROM inserted
      UNION
      SELECT id FROM images WHERE path = $1;
      `,[image]);
      id_image = result.id
    }
    
    // Step 2: Merge provided values with existing
    const updated = {
      name: name ?? existingProduct.name,
      description: description ?? existingProduct.description,
      fichier_path: fichier_path ?? existingProduct.fichier_path,
      id_category: id_category ?? existingProduct.id_category,
      id_format: id_format ?? existingProduct.id_format,
      id_image: id_image ?? existingProduct.id_image,
      id_logiciel: id_logiciel ?? existingProduct.id_logiciel,
    };

    // Step 3: Update only the changed fields
    const updatedProduct = await db.oneOrNone(`
      UPDATE products
      SET name = $1,
          description = $2,
          fichier_path = $3,
          id_category = $4,
          id_format = $5,
          id_image = $6,
          id_logiciel = $7
      WHERE id = $8
      RETURNING *;
    `, [
      updated.name,
      updated.description,
      updated.fichier_path,
      updated.id_category,
      updated.id_format,
      updated.id_image,
      updated.id_logiciel,
      id
    ]);
    res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ "err": error });
  }
}  

export const deleteProduct = async (req, res) =>{
    const { id } = req.params;
    try {
          const result = await db.result(`
            DELETE 
            FROM products 
            WHERE id = $1`, [id]);        
          if (result.rowCount === 0) return res.status(404).json({ error: 'product not found' });
          res.json({ message: 'Product deleted' });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}  

// Search products by title, format, or category
export const searchProducts = async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim() === '') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const searchTerm = `%${q.trim()}%`;
    const products = await db.any(`
      SELECT DISTINCT p.*, c.name as category_name, f.extension as format_extension, l.name as logiciel_name
      FROM products p
      LEFT JOIN categories c ON p.id_category = c.id
      LEFT JOIN formats f ON p.id_format = f.id
      LEFT JOIN logiciels l ON p.id_logiciel = l.id
      WHERE p.name ILIKE $1 
         OR c.name ILIKE $1 
         OR f.extension ILIKE $1
         OR l.name ILIKE $1
      ORDER BY p.name ASC
      LIMIT 10
    `, [searchTerm]);

    res.json(products);
  } catch (error) {
    console.log('Error searching products:', error);
    res.status(500).json({ error: 'Error searching products' });
  }
};  