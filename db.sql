CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'graphiste', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE formats (
    id SERIAL PRIMARY KEY,
    extension VARCHAR(10) UNIQUE NOT NULL
);
CREATE TABLE logiciels(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    path VARCHAR(100) UNIQUE NOT NULL,
);

CREATE TABLE Products(
    id SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    description TEXT,
    fichier_path TEXT NOT NULL,
    id_logiciel INT REFERENCES logiciels(id),
    id_Image INT REFERENCES images(id),
    id_format INT REFERENCES formats(id),
    id_category int REFERENCES categories(id),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telechargements INT DEFAULT 0
);

CREATE TABLE favorite (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES Products(id) ON DELETE CASCADE,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, product_id)
);


CREATE VIEW full_product AS
SELECT
        p.id AS product_id,
        p.name,
        p.description,
        p.fichier_path,
        p.date_created as date_created,

        c.name as category,

        f.extension  as extension,
        
        i.path as path,

        l.name as logiciel

FROM	products p
        LEFT JOIN categories c ON p.id_category  = c.id
        LEFT JOIN formats f ON p.id_format = f.id
        LEFT JOIN images i ON p.id_image = i.id
        LEFT JOIN logiciels l ON p.id_logiciel = l.id;
