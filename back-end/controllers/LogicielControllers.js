import db from "../config/db.js";


export const getAllLogiciels = async (req, res) =>{
    try {
    const Logiciels = await db.any(`
        SELECT * 
        FROM Logiciels
        `);
    res.json(Logiciels);
  } catch (err) {
    console.log(err);
    res.status(500).json({error :'Error fetching Logiciels ' });
  }
};

export const getLogiciel = async (req, res) =>{
    const { id } = req.params;
    try {
        const Logiciel = await db.oneOrNone(`
            SELECT * 
            FROM Logiciels 
            WHERE id = $1`, [id]);
        if (!Logiciel) return res.status(404).json({ error: 'Logiciel not found' });
        res.json(Logiciel);
    } catch (err) {
        console.log(err);
        res.status(500).json({error :'Error fetching Logiciel ' });
    }
};  
export const createLogiciel = async (req, res) =>{
    const { name } = req.body;
    try {
        // Check for duplicate logiciel name
        const existingLogiciel = await db.oneOrNone('SELECT * FROM logiciels WHERE name = $1', [name]);
        if (existingLogiciel) {
            return res.status(409).json({ error: 'A logiciel with this name already exists.' });
        }
        const inserted = await db.oneOrNone(`
        INSERT into Logiciels(name) 
        values ($1)  
        RETURNING *
        `, [name]);
        res.status(201).json(inserted);
    } catch (error) {
        console.log('ERROR:', error);
        res.status(500).json({ error: 'Error creating Logiciel' });
    }
}  
export const updateLogiciel = async (req, res) =>{
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedLogiciel = await db.oneOrNone(
      `UPDATE Logiciels 
      SET name = $1
      WHERE id = $2 
      RETURNING *
      `,
      [name, id]
    );
    if (!updatedLogiciel) return res.status(404).json({ error: 'Logiciel not found' });
    res.json(updatedLogiciel);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error updating Logiciel' });
  }
}  

export const deleteLogiciel = async (req, res) =>{
    const { id } = req.params;
    try {
        // Check if there are products using this logiciel
        const productsUsingLogiciel = await db.any(`
            SELECT COUNT(*) as count 
            FROM products 
            WHERE id_logiciel = $1`, [id]);
        
        if (parseInt(productsUsingLogiciel[0].count) > 0) {
            return res.status(409).json({ 
                error: 'Cannot delete logiciel. There are products using this logiciel. Please delete or update those products first.' 
            });
        }

        const result = await db.result(`
            DELETE 
            FROM Logiciels 
            WHERE id = $1`, [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Logiciel not found' });
        res.json({ message: 'Logiciel deleted' });
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting Logiciel' });
    }
}  