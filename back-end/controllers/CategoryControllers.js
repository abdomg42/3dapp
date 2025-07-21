import db from "../config/db.js";


export const getAllCategories = async (req, res) =>{
    try {
    const Categories = await db.any(`
        SELECT * 
        FROM Categories
        `);
    res.json(Categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({error :'Error fetching Categories ' });
  }
};

export const getCategory = async (req, res) =>{
    const { id } = req.params;
    try {
        const Category = await db.oneOrNone(`
            SELECT * 
            FROM categories 
            WHERE id = $1`, [id]);
        if (!Category) return res.status(404).json({ error: 'Category not found' });
        res.json(Category);
    } catch (err) {
        console.log(err);
        res.status(500).json({error :'Error fetching Category ' });
    }
};  
export const createCategory = async (req, res) =>{
    const { name } = req.body;
    try {
        const inserted = db.oneOrNone(`
        INSERT into categories(name) 
        values ($1)  
        `
        ,[name]);
        }catch (error) {
        console.log('ERROR:', error);
        res.status(500).json({ error: 'Error creating Category' });

  };
}  
export const updateCategory = async (req, res) =>{
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await db.oneOrNone(
      `UPDATE Categories 
      SET name = $1
      WHERE id = $2 
      RETURNING *
      `,
      [name, id]
    );
    if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
    res.json(updatedCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error updating Category' });
  }
}  

export const deleteCategory = async (req, res) =>{
    const { id } = req.params;
    try {
        
        const result = await db.result(`
            DELETE 
            FROM Categories 
            WHERE id = $1`, [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted' });
    }catch(error){
        res.status(500).json({ error: 'Error deleting user' });
    }
}  