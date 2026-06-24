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

-- 5. Crear tipos ENUM para las ofertas si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
        CREATE TYPE job_status AS ENUM ('active', 'paused', 'closed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
        CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'freelance');
    END IF;
END $$;

-- 6. Tabla de Ofertas Laborales
CREATE TABLE IF NOT EXISTS job_offers (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    category VARCHAR(100) NOT NULL, -- Ejemplo: 'tecnología', 'administración'
    location VARCHAR(100) NOT NULL,
    work_mode VARCHAR(20) NOT NULL, -- Ejemplo: 'remote', 'onsite', 'hybrid'
    job_type job_type NOT NULL DEFAULT 'full_time',
    salary_min NUMERIC(12, 2),
    salary_max NUMERIC(12, 2),
    status job_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    CONSTRAINT fk_job_company FOREIGN KEY (company_id) REFERENCES company_profiles(id) ON DELETE CASCADE
);


-- 7. Crear tipo ENUM para los estados de la postulación si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
    END IF;
END $$;

-- 8. Tabla de Postulaciones
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    candidate_id INT NOT NULL,
    cover_letter TEXT, -- Carta de presentación opcional
    status application_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Restricción para evitar que aplique más de una vez a la misma oferta
    CONSTRAINT unique_job_candidate UNIQUE (job_id, candidate_id),
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES job_offers(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE
);