import db from "../config/db.js";
import EmbeddingService from '../services/EmbeddingService.js';
import CompressionService from '../services/CompressionService.js';
import path from 'path';
import fs from 'fs';

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

// Helper function to find the correct image path
const findImagePath = (filename) => {
  const possiblePaths = [
    path.join(process.cwd(), 'upload', filename),
    path.join(process.cwd(), 'upload', 'images', filename),
    path.join(process.cwd(), 'upload', 'images', filename.replace('image-', '')),
    path.join(process.cwd(), 'upload', 'images', filename.replace('/', ''))
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }
  
  // If still not found, try to find by filename in images directory
  const imagesDir = path.join(process.cwd(), 'upload', 'images');
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    const matchingFile = files.find(file => file.includes(filename.replace('image-', '')));
    if (matchingFile) {
      return path.join(imagesDir, matchingFile);
    }
  }
  
  return null;
};

export const createProduct = async (req, res) =>{
  const { name, description, category, format, logiciel } = req.body;
  
  // Check if required files were uploaded
  if (!req.files || !req.files.image || !req.files.modelFiles || req.files.modelFiles.length === 0) {
    return res.status(400).json({
      error: 'Both image and at least one model file are required.'
    });
  }

  if (!name || !category || !format || !logiciel) {
    return res.status(400).json({
      error: 'All fields are required.'
    });
  }

  try {
    console.log('🔄 Starting product creation...');
    
    // Check for duplicate product name
    const existingProduct = await db.oneOrNone('SELECT * FROM products WHERE name = $1', [name]);
    if (existingProduct) {
      return res.status(409).json({ error: 'A product with this name already exists.' });
    }

    console.log('✅ Duplicate check passed');

    // Get file paths
    const imagePath = `/${req.files.image[0].filename}`;
    let filePath;
    let filesToCleanup = [];

    // Get all uploaded files
    const modelFiles = req.files.modelFiles || [];
    const textureFiles = req.files.textureFiles || [];
    
    console.log(`📁 Processing ${modelFiles.length} model files and ${textureFiles.length} texture files`);

    // Add full paths to files for compression
    const modelFilesWithPaths = modelFiles.map(file => ({
      ...file,
      path: path.join(process.cwd(), 'upload', 'files', file.filename)
    }));

    const textureFilesWithPaths = textureFiles.map(file => ({
      ...file,
      path: path.join(process.cwd(), 'upload', 'files', file.filename)
    }));

    // Create compressed archive with all files
    const archivePath = await CompressionService.createMultiFileArchive(
      modelFilesWithPaths,
      textureFilesWithPaths,
      name // use product name for archive
    );
    
    // Get relative path for database
    filePath = `/${path.basename(archivePath)}`;
    
    // Mark all individual files for cleanup
    filesToCleanup = [...modelFilesWithPaths, ...textureFilesWithPaths];
    
    console.log('✅ Compressed archive created with all files');

    console.log('🔄 Processing categories, formats, and logiciels...');

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

    console.log('✅ Database records created');

    // Create image record
    const imageResult = await db.one(`
      INSERT INTO images(path)
      VALUES ($1)
      RETURNING id;
    `, [imagePath]);
    const id_image = imageResult.id;

    // Create product record
    const newProduct = await db.one(`
      INSERT INTO products
        (name, description, fichier_path, id_category, id_format, id_image, id_logiciel)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [name, description, filePath, id_category, id_format, id_image, id_logiciel]);

    console.log('✅ Product created in database');

    // Clean up individual files after compression
    if (filesToCleanup.length > 0) {
      setImmediate(async () => {
        try {
          await CompressionService.cleanupMultipleFiles(modelFilesWithPaths, textureFilesWithPaths);
          console.log('✅ Individual files cleaned up');
        } catch (error) {
          console.error('❌ Error cleaning up files:', error);
        }
      });
    }

    // Return success immediately
    res.status(201).json({
      ...newProduct,
      message: `Product created successfully with compressed archive containing ${modelFiles.length + textureFiles.length} files. FAISS embedding will be generated in the background.`,
      embedding_status: 'pending',
      file_count: {
        models: modelFiles.length,
        textures: textureFiles.length,
        total: modelFiles.length + textureFiles.length
      }
    });

    // Generate FAISS embedding asynchronously (non-blocking)
    const fullImagePath = findImagePath(req.files.image[0].filename);
    if (fullImagePath) {
      // Use setImmediate to run this after the response is sent
      setImmediate(async () => {
        try {
          console.log(`🔄 Generating FAISS embedding for image ${id_image} in background...`);
          await EmbeddingService.addEmbedding(fullImagePath, id_image);
          console.log(`✅ Added MobileNet embedding to FAISS index for image ${id_image}`);
        } catch (error) {
          console.error(`❌ Error adding to FAISS index for image ${id_image}:`, error);
        }
      });
    }

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
    
    // Step 2: Merge provided values with existing
    const updated = {
      name: name ?? existingProduct.name,
      description: description ?? existingProduct.description,
      id_category: id_category ?? existingProduct.id_category,
      id_format: id_format ?? existingProduct.id_format,
      id_logiciel: id_logiciel ?? existingProduct.id_logiciel,
    };

    // Step 3: Update only the changed fields
    const updatedProduct = await db.oneOrNone(`
      UPDATE products 
      SET name = $1,
          description = $2,
          id_category = $3,
          id_format = $4,
          id_logiciel = $5
      WHERE id = $6
      RETURNING *;
    `, [
      updated.name,
      updated.description,
      updated.id_category,
      updated.id_format,
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
      SELECT DISTINCT p.*, c.name as category_name, f.extension as format_extension, l.name as logiciel_name ,i.path as path
        FROM products p
        LEFT JOIN categories c ON p.id_category = c.id
        LEFT JOIN formats f ON p.id_format = f.id
        LEFT JOIN logiciels l ON p.id_logiciel = l.id
        LEFT JOIN images i ON p.id_image = i.id
      WHERE p.name ILIKE $1
         OR c.name ILIKE $1
         OR f.extension ILIKE $1
         OR l.name ILIKE $1
      ORDER BY p.name ASC
    `, [searchTerm]);

    res.json(products);
  } catch (error) {
    console.log('Error searching products:', error);
    res.status(500).json({ error: 'Error searching products' });
  }
};

// Search products by image similarity using FAISS
export const searchByImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    const uploadedImage = req.file;
    const fullImagePath = findImagePath(uploadedImage.filename);
    
    if (!fullImagePath) {
      return res.status(400).json({ error: 'Uploaded image file not found' });
    }

    console.log(`🔍 Searching FAISS index for similar images to: ${uploadedImage.filename}`);
    
    // Search FAISS index
    const similarResults = await EmbeddingService.searchSimilar(fullImagePath, 15);

    console.log(`✅ Found ${similarResults.length} similar images in FAISS index`);

    // Get product details for similar images
    const productsWithSimilarity = [];
    for (const result of similarResults) {
      const product = await db.oneOrNone(`
        SELECT p.*, c.name as category_name, f.extension as format_extension, 
               l.name as logiciel_name, i.path as path
        FROM products p
        LEFT JOIN categories c ON p.id_category = c.id
        LEFT JOIN formats f ON p.id_format = f.id
        LEFT JOIN logiciels l ON p.id_logiciel = l.id
        LEFT JOIN images i ON p.id_image = i.id
        WHERE i.id = $1
      `, [result.image_id]);
      
      if (product) {
        productsWithSimilarity.push({
          ...product,
          id: product.product_id,
          similarity_score: result.similarity
        });
      }
    }

    console.log(`✅ Found ${productsWithSimilarity.length} similar products`);

    // Clean up uploaded file immediately after search
    fs.unlink(fullImagePath, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
      else console.log('✅ Search image deleted successfully');
    });
    
    res.json({
      message: 'FAISS image search completed successfully',
      results: productsWithSimilarity,
      uploadedImage: {
        filename: uploadedImage.filename,
        mimetype: uploadedImage.mimetype,
        size: uploadedImage.size
      },
      searchStats: {
        found_products: similarResults.length,
        similar_products: productsWithSimilarity.length,
        min_similarity: productsWithSimilarity.length > 0 ? Math.min(...productsWithSimilarity.map(p => p.similarity_score)) : 0,
        max_similarity: productsWithSimilarity.length > 0 ? Math.max(...productsWithSimilarity.map(p => p.similarity_score)) : 0
      }
    });
    
  } catch (error) {
    console.error('FAISS image search error:', error);
    res.status(500).json({ error: 'Error processing FAISS image search' });
  }
};  