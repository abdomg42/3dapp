import db from "../config/db.js";


export const getAllUsers = async (req, res) =>{
    try {
    const users = await db.any(`
      SELECT * 
      FROM users 
    `);
    res.json(users);

  } catch (err) {
    res.status(500).json({error :'Error fetching users ' });
    console.log(err);
  }
};

export const getUser = async (req, res) =>{
    const { id } = req.params;
    try {
        const user = await db.oneOrNone(`  
         SELECT * 
        FROM users 
        WHERE id = $1
            `, [id]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({error :'Error fetching user ' });
        console.log(err);
    }
};  
export const createUser = async (req, res) =>{
    const {name, email, password } = req.body;
    try {
        if(!name || !email || !password){
            return res.status(501).json({ error: 'Missing required fields' });
        }
        const inserted = db.oneOrNone(`
        INSERT into users(name, email, password) 
        VALUES ($1,$2,$3)  
        RETURNING *
        `
        ,[name, email, password]);
        }catch (error) {
        console.log('ERROR:', error);
        res.status(500).json({ error: 'Error creating User' });

  };
}  
export const updateUser = async (req, res) =>{
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
        const existingUser = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
        if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
        }

    const update = {
        name : name ?? existingUser.name,
        email : email ?? existingUser.email,
        password : password ?? existingUser.password,
    }
    const updatedUser = await db.oneOrNone(
      `UPDATE users 
      SET name = $1, email = $2, password = $3 
      WHERE id = $4 
      RETURNING *
      `,
      [name, email, password, id]
    );
    
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error updating user' });
  }
}  

export const deleteUser = async (req, res) =>{
    const { id } = req.params;
    try {
        const result = await db.result(`
            DELETE 
            FROM users 
            WHERE id = $1`, [id]);        
        if (result.rowCount === 0) return res.status(404).json({ error: 'user not found' });
        res.json({ message: 'user deleted' });
    } catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}  