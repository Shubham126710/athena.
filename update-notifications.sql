-- Remove unwanted notifications
DELETE FROM notifications WHERE title = 'Exam Schedule Released';

-- Re-add Welcome message (if it was deleted)
INSERT INTO notifications (title, message, type)
SELECT 'Welcome to Athena', 'Thank you for trying out the platform! Your centralized academic hub is ready. Manage your timetable, track attendance, and access resources seamlessly.', 'info'
WHERE NOT EXISTS (
    SELECT 1 FROM notifications WHERE title = 'Welcome to Athena'
);

-- Update Winning Camp notification to mention DCPD classes
UPDATE notifications
SET message = 'The final sprint begins soon. Join the Winning Camp for DCPD classes to maximize your performance before the break.'
WHERE title LIKE 'Winning Camp%';
