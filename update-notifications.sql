-- Remove unwanted notifications
DELETE FROM notifications WHERE title = 'Exam Schedule Released';
DELETE FROM notifications WHERE title = 'Welcome to Athena';

-- Update Winning Camp notification to mention DCPD classes
UPDATE notifications
SET message = 'The final sprint begins soon. Join the Winning Camp for DCPD classes to maximize your performance before the break.'
WHERE title LIKE 'Winning Camp%';
