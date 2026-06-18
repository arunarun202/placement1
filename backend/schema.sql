-- Idempotent schema: safe to run on every startup (IF NOT EXISTS on all statements)

CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL, 
	username VARCHAR(150) NOT NULL, 
	password VARCHAR(128) NOT NULL, 
	email VARCHAR(254), 
	first_name VARCHAR(150), 
	last_name VARCHAR(150), 
	is_active BOOLEAN, 
	is_superuser BOOLEAN, 
	date_joined TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS ix_users_id ON users (id);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON users (username);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email);

CREATE TABLE IF NOT EXISTS chatbots (
	id SERIAL NOT NULL, 
	message TEXT NOT NULL, 
	PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS ix_chatbots_id ON chatbots (id);

CREATE TABLE IF NOT EXISTS profiles (
	id SERIAL NOT NULL, 
	user_id INTEGER NOT NULL, 
	avatar VARCHAR(255), 
	bio TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_profiles_id ON profiles (id);

CREATE TABLE IF NOT EXISTS user_predict_models (
	id SERIAL NOT NULL, 
	user_id INTEGER NOT NULL, 
	age FLOAT NOT NULL, 
	gender VARCHAR(20) NOT NULL, 
	qualification VARCHAR(50) NOT NULL, 
	year FLOAT NOT NULL, 
	cgpa FLOAT NOT NULL, 
	job_role VARCHAR(50) NOT NULL, 
	post_graduation VARCHAR(20) NOT NULL, 
	ten_percentage FLOAT NOT NULL, 
	twelth_percentage FLOAT NOT NULL, 
	salary FLOAT NOT NULL, 
	soft_skills VARCHAR(50) NOT NULL, 
	internship VARCHAR(50) NOT NULL, 
	experience FLOAT NOT NULL, 
	round INTEGER NOT NULL, 
	company_name VARCHAR(100) NOT NULL, 
	label TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_user_predict_models_id ON user_predict_models (id);
CREATE INDEX IF NOT EXISTS ix_user_predict_models_user_id ON user_predict_models (user_id);

CREATE TABLE IF NOT EXISTS resume_uploads (
	id SERIAL NOT NULL, 
	user_id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	email VARCHAR(254), 
	job_role VARCHAR(255), 
	uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	file VARCHAR(255) NOT NULL, 
	processed BOOLEAN, 
	ats_score FLOAT, 
	gemini_response JSONB, 
	suggestions TEXT, 
	course_products JSONB, 
	alternative_roles JSONB, 
	role_courses JSONB, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ix_resume_uploads_user_id ON resume_uploads (user_id);
CREATE INDEX IF NOT EXISTS ix_resume_uploads_id ON resume_uploads (id);
