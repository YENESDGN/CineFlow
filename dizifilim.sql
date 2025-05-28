 CREATE TABLE app_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255),
    password VARCHAR(255),
    profile_image VARCHAR(255)
); CREATE TABLE watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content_id VARCHAR(50) NOT NULL,
  content_type VARCHAR(10) NOT NULL,
  UNIQUE(user_id, content_id, content_type),
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    content_type ENUM('movie', 'tv') NOT NULL,
    rating FLOAT CHECK (rating BETWEEN 0 AND 10),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);