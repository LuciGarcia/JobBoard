-- 1. Crear tipo ENUM para Roles si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('company', 'candidate');
    END IF;
END $$;

-- 2. Tabla Principal de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Perfiles de Empresas (Relación 1:1 con Users)
CREATE TABLE IF NOT EXISTS company_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(200),
    location VARCHAR(100),
    logo_url VARCHAR(255),
    CONSTRAINT fk_user_company FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tabla de Perfiles de Candidatos (Relación 1:1 con Users)
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    headline VARCHAR(150), -- Ejemplo: "Fullstack Developer"
    bio TEXT,
    location VARCHAR(100),
    cv_url VARCHAR(255),
    CONSTRAINT fk_user_candidate FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);