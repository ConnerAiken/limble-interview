-- ==========================
-- Populate some workers
-- ==========================
INSERT INTO workers (username, hourly_wage) VALUES ('Conner', 15.00);
INSERT INTO workers (username, hourly_wage) VALUES ('Alice', 16.00); 
DROP PROCEDURE if EXISTS seedWorkers;
DELIMITER $$

CREATE PROCEDURE seedWorkers()
BEGIN 
  	 DECLARE num INT DEFAULT 1; 
    WHILE num <= 1000 DO
	    INSERT INTO workers (username, hourly_wage) VALUES (CONCAT('conners helper #', num), 5.00);
	    INSERT INTO workers (username, hourly_wage) VALUES (CONCAT('alices helper #', num), 6.00); 
    	SET num = num + 1;
    END WHILE;
END;
$$
DELIMITER ;

CALL seedWorkers();

-- ==========================
-- Populate some locations
-- ==========================
DROP PROCEDURE if EXISTS seedLocations;
DELIMITER $$

CREATE PROCEDURE seedLocations()
BEGIN 
  	DECLARE num INT DEFAULT 1; 
    WHILE num <= 1000 DO 
        INSERT INTO locations (name) VALUES (CONCAT('Shop #', num));
    	SET num = num + 1;
    END WHILE;
END;
$$
DELIMITER ;

CALL seedLocations();
 
-- ==========================
-- Populate some tasks
-- ==========================
DROP PROCEDURE if EXISTS seedTasks;
DELIMITER $$

CREATE PROCEDURE seedTasks()
BEGIN 
  	DECLARE num INT DEFAULT 1; 
    WHILE num <= 1000 DO  
        INSERT INTO tasks (description, location_id) VALUES ('Clean the shop floor', num);
        INSERT INTO tasks (description, location_id) VALUES ('Reorganize the tools', num);
    	SET num = num + 1;
    END WHILE;
END;
$$
DELIMITER ;

CALL seedTasks(); 

-- ==========================
-- Add some time logs
-- ==========================
DROP PROCEDURE if EXISTS seedTimeLogs;
DELIMITER $$

CREATE PROCEDURE seedTimeLogs()
BEGIN 
  	DECLARE num INT DEFAULT 1; 
    WHILE num <= 1000 DO    
        -- Conner worked for 1 hour on cleaning the shop floor
        INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (3600, (
            SELECT 
                id
            FROM
                tasks
            WHERE
                description = 'Clean the shop floor' AND
                location_id = num
        ), (
            SELECT 
                id
            FROM
                workers
            WHERE
                username = 'conner'
        ));
        -- Conner worked for a half hour on reorganizing the tools
        INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (1800, (
            SELECT 
                id
            FROM
                tasks
            WHERE
                description = 'Reorganize the tools' AND
                location_id = num
        ), (
            SELECT 
                id
            FROM
                workers
            WHERE
                username = 'conner'
        ));
        -- Alice worked for 30 minutes on reorganizing the tools
        INSERT INTO logged_time (time_seconds, task_id, worker_id) VALUES (1800, (
            SELECT 
                id
            FROM
                tasks
            WHERE
                description = 'Reorganize the tools' AND
                location_id = num
        ), (
            SELECT 
                id
            FROM
                workers
            WHERE
                username = 'alice'
        )); 
    	SET num = num + 1;
    END WHILE;
END;
$$
DELIMITER ;

CALL seedTimeLogs();  


-- Randomy set tasks to completed
UPDATE tasks SET completed = 1 WHERE RAND() < 0.5;