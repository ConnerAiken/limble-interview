-- ==========================
-- Populate some workers
-- ==========================
INSERT INTO workers (username, hourly_wage) VALUES ('Conner', 10.00);
INSERT INTO workers (username, hourly_wage) VALUES ('Alice', 10.00);  
 
-- ==========================
-- Populate some locations
-- ==========================
INSERT INTO locations (name) VALUES (CONCAT('Shop #', 1));
INSERT INTO locations (name) VALUES (CONCAT('Shop #', 2));
 
-- ==========================
-- Populate some tasks
-- ========================== 
INSERT INTO tasks (description, location_id, completed) VALUES ('Clean the shop floor', 1, 1);
INSERT INTO tasks (description, location_id, completed) VALUES ('Reorganize the tools', 1, 1);
INSERT INTO tasks (description, location_id, completed) VALUES ('Clean the shop floor', 2, 0);
INSERT INTO tasks (description, location_id, completed) VALUES ('Reorganize the tools', 2, 0);

-- ==========================
-- Add some time logs
-- ========================== 
-- Conner worked for 2 hours on cleaning the shop floor for shop 1
INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (3600 * 2, (
    SELECT 
        id
    FROM
        tasks
    WHERE
        description = 'Clean the shop floor' AND
        location_id = 1
), (
    SELECT 
        id
    FROM
        workers
    WHERE
        username = 'conner'
)); 
-- Conner worked for 1 hour on cleaning the shop floor for shop 2
INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (3600, (
    SELECT 
        id
    FROM
        tasks
    WHERE
        description = 'Clean the shop floor' AND
        location_id = 2
), (
    SELECT 
        id
    FROM
        workers
    WHERE
        username = 'conner'
)); 
-- Alice worked for 2 hours on reorganizing the tools for shop 1
INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (3600 * 2, (
    SELECT 
        id
    FROM
        tasks
    WHERE
        description = 'Reorganize the tools' AND
        location_id = 1
), (
    SELECT 
        id
    FROM
        workers
    WHERE
        username = 'alice'
)); 
-- Alice worked for 1 hour on reorganizing the tools for shop 2
INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (3600, (
    SELECT 
        id
    FROM
        tasks
    WHERE
        description = 'Reorganize the tools' AND
        location_id = 2
), (
    SELECT 
        id
    FROM
        workers
    WHERE
        username = 'alice'
)); 

 