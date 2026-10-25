CREATE DATABASE IF NOT EXISTS food_waste_db;
USE food_waste_db;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('donor','receiver','volunteer','admin') NOT NULL,
  approval_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donors (
  donor_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  organization_name VARCHAR(150),
  donor_type ENUM('restaurant','hotel','event','household','store'),
  address VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE receivers (
  receiver_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  organization_name VARCHAR(150) NOT NULL,
  receiver_type ENUM('ngo','shelter','orphanage','other') DEFAULT 'ngo',
  registration_no VARCHAR(100),
  address VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE volunteers (
  volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  vehicle_type ENUM('bike','car','van','none') DEFAULT 'bike',
  service_area VARCHAR(150),
  status ENUM('available','busy','offline') DEFAULT 'available',
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE food_items (
  food_id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  category ENUM('cooked','raw','packaged') NOT NULL,
  quantity_servings INT NOT NULL,
  quantity_kg DECIMAL(8,2),
  preparation_datetime DATETIME,
  expiry_datetime DATETIME NOT NULL,
  pickup_address VARCHAR(255) NOT NULL,
  special_instructions TEXT,
  status ENUM('available','matched','completed','expired') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
  INDEX idx_status_expiry (status, expiry_datetime)
);

CREATE TABLE food_requests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  receiver_id INT NOT NULL,
  category ENUM('cooked','raw','packaged') NOT NULL,
  required_quantity INT NOT NULL,
  urgency ENUM('low','medium','high') DEFAULT 'medium',
  delivery_address VARCHAR(255) NOT NULL,
  status ENUM('pending','matched','out_for_delivery','delivered','cancelled') DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (receiver_id) REFERENCES receivers(receiver_id),
  INDEX idx_status_urgency (status, urgency)
);

CREATE TABLE pickup_deliveries (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  food_id INT NOT NULL,
  request_id INT NOT NULL,
  volunteer_id INT NULL,
  status ENUM('open','accepted','picked_up','delivered','cancelled') DEFAULT 'open',
  scheduled_time DATETIME NULL,
  pickup_time DATETIME NULL,
  delivery_time DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (food_id) REFERENCES food_items(food_id),
  FOREIGN KEY (request_id) REFERENCES food_requests(request_id),
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(volunteer_id),
  UNIQUE KEY uq_food_request (food_id, request_id)
);

CREATE TABLE audit_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);