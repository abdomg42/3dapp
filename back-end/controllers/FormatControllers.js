import db from "../config/db.js";


export const getAllFormats = async (req, res) =>{
    try {
    const Formats = await db.any(`
        SELECT * 
        FROM Formats
        `);
    res.json(Formats);
  } catch (err) {
    console.log(err);
    res.status(500).json({error :'Error fetching Formats ' });
  }
};

export const getFormat = async (req, res) =>{
    const { id } = req.params;
    try {
        const Format = await db.oneOrNone(`
            SELECT * 
            FROM Formats 
            WHERE id = $1`, [id]);
        if (!Format) return res.status(404).json({ error: 'Format not found' });
        res.json(Format);
    } catch (err) {
        console.log(err);
        res.status(500).json({error :'Error fetching Format ' });
    }
};  
export const createFormat = async (req, res) =>{
    const { extension } = req.body;
    try {
        // Check for duplicate format extension
        const existingFormat = await db.oneOrNone('SELECT * FROM formats WHERE extension = $1', [extension]);
        if (existingFormat) {
            return res.status(409).json({ error: 'A format with this extension already exists.' });
        }
        const inserted = await db.oneOrNone(`
        INSERT into Formats(extension) 
        values ($1)  
        RETURNING *
        `, [extension]);
        res.status(201).json(inserted);
    } catch (error) {
        console.log('ERROR:', error);
        res.status(500).json({ error: 'Error creating Format' });
    }
}  
export const updateFormat = async (req, res) =>{
  const { id } = req.params;
  const { extension } = req.body;
  try {
    const updatedFormat = await db.oneOrNone(
      `UPDATE Formats 
      SET extension = $1
      WHERE id = $2 
      RETURNING *
      `,
      [extension, id]
    );
    if (!updatedFormat) return res.status(404).json({ error: 'Format not found' });
    res.json(updatedFormat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error updating Format' });
  }
}  

export const deleteFormat = async (req, res) =>{
    const { id } = req.params;
    try {
        // Check if there are products using this format
        const productsUsingFormat = await db.any(`
            SELECT COUNT(*) as count 
            FROM products 
            WHERE id_format = $1`, [id]);
        
        if (parseInt(productsUsingFormat[0].count) > 0) {
            return res.status(409).json({ 
                error: 'Cannot delete format. There are products using this format. Please delete or update those products first.' 
            });
        }

        const result = await db.result(`
            DELETE 
            FROM Formats 
            WHERE id = $1`, [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Format not found' });
        res.json({ message: 'Format deleted' });
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting Format' });
    }
}  