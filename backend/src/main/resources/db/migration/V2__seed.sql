-- V2: Seed Data

-- Insert admin user (password: Admin@123)
-- BCrypt hash for Admin@123: $2a$10$XQ5qYqCGH4VvHKqXqJZGe.rZ9YlQdGZ8C8mJ7jJ0xJ4yJ0J0J0J0J
INSERT INTO users (email, password, full_name, role, email_verified, status, created_at, updated_at)
VALUES 
    ('admin@todo.local', '$2a$10$XQ5qYqCGH4VvHKqXqJZGe.rZ9YlQdGZ8C8mJ7jJ0xJ4yJ0J0J0J0J', 'Admin User', 'ADMIN', TRUE, 'ACTIVE', NOW(), NOW()),
    ('user@todo.local', '$2a$10$XQ5qYqCGH4VvHKqXqJZGe.rZ9YlQdGZ8C8mJ7jJ0xJ4yJ0J0J0J0J', 'Demo User', 'USER', TRUE, 'ACTIVE', NOW(), NOW());

-- Insert categories for demo user (user_id = 2)
INSERT INTO categories (user_id, name, color, order_index, created_at, updated_at)
VALUES 
    (2, 'Work', '#3B82F6', 1, NOW(), NOW()),
    (2, 'Personal', '#10B981', 2, NOW(), NOW()),
    (2, 'Shopping', '#F59E0B', 3, NOW(), NOW());

-- Insert tags for demo user
INSERT INTO tags (user_id, name, color, created_at, updated_at)
VALUES 
    (2, 'Urgent', '#EF4444', NOW(), NOW()),
    (2, 'Important', '#F59E0B', NOW(), NOW()),
    (2, 'Meeting', '#8B5CF6', NOW(), NOW()),
    (2, 'Review', '#06B6D4', NOW(), NOW()),
    (2, 'Bug', '#DC2626', NOW(), NOW());

-- Insert todos for demo user
INSERT INTO todos (user_id, title, description, status, priority, due_date, category_id, created_at, updated_at)
VALUES 
    (2, 'Complete project documentation', 'Write comprehensive documentation for the todo app project including API specs and user guide', 'IN_PROGRESS', 'HIGH', DATE_ADD(NOW(), INTERVAL 3 DAY), 1, NOW(), NOW()),
    (2, 'Review pull requests', 'Review and merge pending PRs from team members', 'PENDING', 'HIGH', DATE_ADD(NOW(), INTERVAL 1 DAY), 1, NOW(), NOW()),
    (2, 'Buy groceries', 'Milk, Eggs, Bread, Vegetables, Fruits', 'PENDING', 'MEDIUM', DATE_ADD(NOW(), INTERVAL 2 DAY), 3, NOW(), NOW()),
    (2, 'Gym workout', 'Cardio and strength training session', 'DONE', 'LOW', DATE_SUB(NOW(), INTERVAL 1 DAY), 2, NOW(), NOW()),
    (2, 'Team meeting', 'Discuss Q4 roadmap and sprint planning', 'DONE', 'MEDIUM', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, NOW(), NOW()),
    (2, 'Fix authentication bug', 'Users unable to login with special characters in password', 'IN_PROGRESS', 'HIGH', DATE_ADD(NOW(), INTERVAL 1 DAY), 1, NOW(), NOW()),
    (2, 'Learn TypeScript', 'Complete TypeScript course on Udemy', 'PENDING', 'MEDIUM', DATE_ADD(NOW(), INTERVAL 14 DAY), 2, NOW(), NOW()),
    (2, 'Prepare presentation', 'Create slides for client meeting next week', 'PENDING', 'HIGH', DATE_ADD(NOW(), INTERVAL 5 DAY), 1, NOW(), NOW());

-- Insert subtasks (parent_id references main todo)
INSERT INTO todos (user_id, title, description, status, priority, parent_id, created_at, updated_at)
VALUES 
    (2, 'Write API documentation', 'Document all REST endpoints with examples', 'DONE', 'HIGH', 1, NOW(), NOW()),
    (2, 'Create user guide', 'Step-by-step guide for end users', 'IN_PROGRESS', 'MEDIUM', 1, NOW(), NOW()),
    (2, 'Add code examples', 'Include code snippets and best practices', 'PENDING', 'LOW', 1, NOW(), NOW());

-- Link todos with tags
INSERT INTO todo_tags (todo_id, tag_id)
VALUES 
    (1, 2), -- Complete project documentation: Important
    (2, 1), -- Review pull requests: Urgent
    (2, 3), -- Review pull requests: Meeting
    (5, 3), -- Team meeting: Meeting
    (6, 1), -- Fix authentication bug: Urgent
    (6, 5), -- Fix authentication bug: Bug
    (8, 2), -- Prepare presentation: Important
    (8, 3); -- Prepare presentation: Meeting

-- Insert sample attachments
INSERT INTO attachments (todo_id, file_name, file_url, file_size, created_at, updated_at)
VALUES 
    (1, 'api-specs.pdf', 'https://example.com/files/api-specs.pdf', 245760, NOW(), NOW()),
    (8, 'presentation-template.pptx', 'https://example.com/files/presentation-template.pptx', 512000, NOW(), NOW());
