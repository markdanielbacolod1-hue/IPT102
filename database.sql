CREATE DATABASE document_tracking_system;
USE document_tracking_system;

-- MODULE 1: AUTHENTICATION & USER MANAGEMENT

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    department_id INT,
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE user_activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity VARCHAR(255),
    activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    department_id INT,
    status ENUM('Active','Inactive'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- MODULE 2: DOCUMENT MANAGEMENT

CREATE TABLE document_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100)
);

CREATE TABLE documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    document_code VARCHAR(50) UNIQUE,
    title VARCHAR(255),
    description TEXT,
    category_id INT,
    uploaded_by INT,
    department_id INT,
    status ENUM('Active','Archived','In Transit') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES document_categories(category_id),
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE document_files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (document_id) REFERENCES documents(document_id)
);

-- MODULE 3: QR CODE & TRACKING

CREATE TABLE qr_codes (
    qr_id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT UNIQUE,
    qr_value VARCHAR(255) UNIQUE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (document_id) REFERENCES documents(document_id)
);

CREATE TABLE document_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT,
    from_department INT,
    to_department INT,
    updated_by INT,
    status VARCHAR(100),
    remarks TEXT,
    tracking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (document_id) REFERENCES documents(document_id),
    FOREIGN KEY (from_department) REFERENCES departments(department_id),
    FOREIGN KEY (to_department) REFERENCES departments(department_id),
    FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- MODULE 4: SHARING & NOTIFICATION

CREATE TABLE document_shares (
    share_id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT,
    sender_id INT,
    receiver_department INT,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (document_id) REFERENCES documents(document_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_department) REFERENCES departments(department_id)
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    document_id INT,
    message TEXT,
    notification_type ENUM('Email','System','Status Update'),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (document_id) REFERENCES documents(document_id)
);