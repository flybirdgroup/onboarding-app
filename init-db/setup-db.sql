CREATE TABLE IF NOT EXISTS project_statuses (
  eim VARCHAR PRIMARY KEY,
  pr VARCHAR,
  projectid VARCHAR,
  cr VARCHAR,
  github VARCHAR,
  cyberflow VARCHAR,
  sonartypeiqscan VARCHAR,
  ice INTEGER
);

-- Insert initial data
INSERT INTO project_statuses (eim, pr, projectid, cr, github, cyberflow, sonartypeiqscan, ice) VALUES
('24520458723', 'PR-123', 'BProject', 'CR-35739583', 'https://hello1.com', 'pass', 'pass', 90),
('38520458729', 'PR-146', 'LProject', 'CR-35739582', 'https://hello2.com', 'pass', 'pass', 88),
('56520458753', 'PR-346', 'MProject', 'CR-35739581', 'https://hello3.com', 'failed', 'pass', 76),
('24566458721', 'PR-776', 'MVProject', 'CR-35739580', 'https://hello4.com', 'failed', 'pass', 70),
('94520458456', 'PR-466', 'GProject', 'CR-35739579', 'https://hello5.com', 'failed', 'pass', 75);