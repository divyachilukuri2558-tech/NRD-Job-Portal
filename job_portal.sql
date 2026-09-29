-- =======================================================
-- Job Portal Web Application Database Schema & Sample Data
-- Database: job_portal
-- Technology: MySQL
-- =======================================================

CREATE DATABASE IF NOT EXISTS `job_portal` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `job_portal`;

-- Drop existing tables if needed (in reverse dependency order)
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `recruiters`;
DROP TABLE IF EXISTS `job_seekers`;
DROP TABLE IF EXISTS `users`;

-- 1. USERS TABLE
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('seeker', 'recruiter', 'admin') NOT NULL DEFAULT 'seeker',
  `phone` VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. JOB SEEKERS TABLE
CREATE TABLE `job_seekers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `skills` TEXT DEFAULT NULL,
  `education` TEXT DEFAULT NULL,
  `experience` TEXT DEFAULT NULL,
  `resume_headline` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  CONSTRAINT `fk_job_seekers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. RECRUITERS TABLE
CREATE TABLE `recruiters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `company_name` VARCHAR(150) NOT NULL,
  `company_description` TEXT DEFAULT NULL,
  `company_location` VARCHAR(150) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_recruiters_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. JOBS TABLE
CREATE TABLE `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recruiter_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `requirements` TEXT DEFAULT NULL,
  `skills` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(100) NOT NULL,
  `employment_type` ENUM('Full Time', 'Part Time', 'Internship', 'Contract') NOT NULL DEFAULT 'Full Time',
  `salary` VARCHAR(100) DEFAULT NULL,
  `experience_required` VARCHAR(50) DEFAULT NULL,
  `posted_date` DATE NOT NULL,
  `last_date` DATE NOT NULL,
  `status` ENUM('Active', 'Closed') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_jobs_recruiter` FOREIGN KEY (`recruiter_id`) REFERENCES `recruiters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. APPLICATIONS TABLE
CREATE TABLE `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `seeker_id` INT NOT NULL,
  `applied_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected') NOT NULL DEFAULT 'Applied',
  `cover_note` TEXT DEFAULT NULL,
  CONSTRAINT `fk_applications_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_applications_seeker` FOREIGN KEY (`seeker_id`) REFERENCES `job_seekers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `unique_job_seeker` UNIQUE (`job_id`, `seeker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================
-- SAMPLE DATA INSERTIONS
-- Default Password for all demo accounts: 'password123'
-- Bcrypt Hash for 'password123': $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- =======================================================

-- Users (1 Admin, 3 Recruiters, 4 Job Seekers)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`) VALUES
(1, 'System Administrator', 'admin@jobportal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '+91 9876543210'),
(2, 'Sarah Jenkins', 'sarah.jenkins@techcorp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'recruiter', '+91 9876543211'),
(3, 'Michael Chang', 'michael.chang@innovatesoft.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'recruiter', '+91 9876543212'),
(4, 'Priya Sharma', 'priya.sharma@cloudscale.io', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'recruiter', '+91 9876543213'),
(5, 'Alex Morgan', 'alex.morgan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seeker', '+91 9876543214'),
(6, 'Rahul Verma', 'rahul.verma@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seeker', '+91 9876543215'),
(7, 'Emily Watson', 'emily.watson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seeker', '+91 9876543216'),
(8, 'David Kumar', 'david.kumar@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seeker', '+91 9876543217');

-- Recruiters Profile
INSERT INTO `recruiters` (`id`, `user_id`, `company_name`, `company_description`, `company_location`, `website`) VALUES
(1, 2, 'TechCorp Solutions', 'Global enterprise IT consulting and digital transformation leader with over 5,000 employees.', 'Bangalore, Karnataka', 'https://techcorp.example.com'),
(2, 3, 'InnovateSoft Systems', 'Next-generation product engineering and SaaS platform innovator building intelligent cloud systems.', 'Hyderabad, Telangana', 'https://innovatesoft.example.com'),
(3, 4, 'CloudScale Technologies', 'High-growth cloud infrastructure and microservices engineering firm with offices across India.', 'Pune, Maharashtra', 'https://cloudscale.example.com');

-- Job Seekers Profile
INSERT INTO `job_seekers` (`id`, `user_id`, `skills`, `education`, `experience`, `resume_headline`, `bio`) VALUES
(1, 5, 'React.js, Node.js, Express.js, JavaScript, MySQL, HTML5, CSS3, Bootstrap', 'B.Tech in Computer Science, National Institute of Technology (2019-2023)', '3 years experience building full-stack web applications and microservices at WebSolutions Inc.', 'Passionate Full Stack Developer specializing in React and Node.js ecosystems', 'Dedicated engineer focused on writing clean, scalable, and maintainable software with responsive UI.'),
(2, 6, 'Java, JDBC, Servlets, MySQL, Spring concepts, REST APIs, Git', 'Master of Computer Applications (MCA), Osmania University (2020-2022)', '2 years backend engineering experience developing transactional systems and REST APIs at CoreTech', 'Java Backend Engineer with strong database and API development background', 'Enthusiastic Java and database developer committed to reliable enterprise architecture.'),
(3, 7, 'React.js, JavaScript, HTML5, CSS3, Bootstrap 5, Chart.js, Responsive Design', 'B.Sc in Computer Science, St. Xavier College (2020-2023)', '1 year frontend development experience developing responsive dashboards and interactive UI', 'Frontend Developer focused on modern UI/UX and React state management', 'Creative frontend developer with an eye for pixel-perfect design and responsive layouts.'),
(4, 8, 'Python, Data Analysis, SQL, MySQL, Chart.js, Excel, REST APIs', 'B.Tech in Information Technology, Anna University (2018-2022)', '2.5 years experience as a Data Analyst crafting insightful reports and SQL pipelines at MetricLab', 'Analytical Data Professional experienced in SQL pipelines and visualization', 'Results-driven analyst skilled in extracting actionable insights and displaying data visually.');

-- Jobs (8 diverse listings)
INSERT INTO `jobs` (`id`, `recruiter_id`, `title`, `company_name`, `description`, `requirements`, `skills`, `location`, `employment_type`, `salary`, `experience_required`, `posted_date`, `last_date`, `status`) VALUES
(1, 1, 'Java Developer', 'TechCorp Solutions', 'We are looking for an experienced Java Developer to develop enterprise backend services, database connectors via JDBC, and robust REST APIs. You will collaborate with cross-functional teams to build high-throughput applications.', 'Strong proficiency in Core Java, JDBC, Servlets, and MySQL. Experience with RESTful Web Services, JSON processing, and Git version control.', 'Java, JDBC, MySQL, REST API, Git', 'Bangalore, India', 'Full Time', '8 - 12 LPA', '2 - 4 Years', '2026-09-01', '2026-10-30', 'Active'),
(2, 2, 'Frontend Developer (React)', 'InnovateSoft Systems', 'Join our frontend team to build modern, responsive web portals using React.js and Bootstrap. You will be translating Figma UI designs into interactive React components and integrating REST endpoints.', 'Expert in React.js, React Router, JavaScript ES6+, HTML5, CSS3, and Bootstrap. Experience with Chart.js visualization is a plus.', 'React.js, JavaScript, Bootstrap, CSS3, Chart.js', 'Hyderabad, India', 'Full Time', '6 - 10 LPA', '1 - 3 Years', '2026-09-05', '2026-11-15', 'Active'),
(3, 3, 'Backend Developer (Node.js)', 'CloudScale Technologies', 'We are seeking a talented Node.js Backend Developer to architect and maintain scalable REST APIs, JWT authentication systems, and MySQL database schemas.', 'Solid hands-on experience with Node.js, Express.js, MySQL queries, JWT authentication, and secure password hashing with bcrypt.', 'Node.js, Express.js, MySQL, JWT, REST API', 'Pune, India', 'Full Time', '9 - 14 LPA', '3 - 5 Years', '2026-09-10', '2026-10-25', 'Active'),
(4, 1, 'Full Stack Developer', 'TechCorp Solutions', 'Exciting opportunity for a Full Stack Developer proficient in both React frontend and Node/Express backend. You will have full ownership of features from database schema design to responsive UI delivery.', 'Comprehensive knowledge of React.js, Node.js, Express, MySQL, Bootstrap, and RESTful API architecture.', 'React.js, Node.js, Express, MySQL, Bootstrap', 'Mumbai, India', 'Full Time', '10 - 16 LPA', '3 - 6 Years', '2026-09-12', '2026-11-01', 'Active'),
(5, 2, 'Data Analyst', 'InnovateSoft Systems', 'We are looking for an analytical Data Analyst to query transactional MySQL databases, generate metrics, and build visual dashboards using Chart.js.', 'Proficiency in complex SQL queries, data aggregation, Chart.js, and data visualization. Good communication skills.', 'SQL, MySQL, Data Analysis, Chart.js', 'Gurgaon, India', 'Full Time', '7 - 11 LPA', '2 - 4 Years', '2026-09-15', '2026-10-20', 'Active'),
(6, 3, 'Software Engineer - Core Services', 'CloudScale Technologies', 'Join our core platform engineering team to build scalable microservices, manage database transactions, and ensure 99.99% system availability.', 'Strong foundation in algorithms, databases (MySQL), Java/Node.js backend stacks, and API security practices.', 'Java, Node.js, MySQL, REST API', 'Remote', 'Full Time', '12 - 18 LPA', '3 - 5 Years', '2026-09-18', '2026-11-30', 'Active'),
(7, 1, 'Web Developer Intern', 'TechCorp Solutions', 'Kickstart your tech career with our 6-month intensive web development internship! You will work on real client web applications under senior mentorship.', 'Basic knowledge of HTML5, CSS3, JavaScript ES6, and Bootstrap. Willingness to learn React.js and backend concepts.', 'HTML5, CSS3, JavaScript, Bootstrap', 'Hyderabad, India', 'Internship', '25,000 / month', 'Fresher', '2026-09-20', '2026-10-15', 'Active'),
(8, 2, 'UI Developer (Contract)', 'InnovateSoft Systems', 'Immediate requirement for a contract UI Developer to build pixel-perfect responsive components using Bootstrap 5 and modern CSS3 for our enterprise portal.', 'Exceptional skills in HTML5, CSS3 Flexbox/Grid, Bootstrap 5, and JavaScript. Prior experience in job portals or enterprise SaaS.', 'Bootstrap 5, CSS3, HTML5, JavaScript', 'Bangalore, India', 'Contract', '60,000 / month', '2+ Years', '2026-09-22', '2026-10-10', 'Active');

-- Applications (Sample application records with diverse statuses)
INSERT INTO `applications` (`id`, `job_id`, `seeker_id`, `applied_date`, `status`, `cover_note`) VALUES
(1, 2, 1, '2026-09-06 10:15:00', 'Shortlisted', 'I have extensive experience building responsive React applications and would love to bring my skills to InnovateSoft.'),
(2, 4, 1, '2026-09-13 14:30:00', 'Under Review', 'Excited about the Full Stack role at TechCorp. My stack aligns directly with your React and Node requirements.'),
(3, 1, 2, '2026-09-02 11:20:00', 'Selected', 'With 2 years of Java, JDBC and REST API development, I can make immediate contributions to your enterprise backend team.'),
(4, 6, 2, '2026-09-19 16:45:00', 'Applied', 'Interested in Core Services engineering at CloudScale. Ready to take on distributed systems challenges.'),
(5, 2, 3, '2026-09-07 09:00:00', 'Under Review', 'Specialized in React.js and Bootstrap UI development. Looking forward to discussing how I can contribute.'),
(6, 7, 3, '2026-09-21 15:10:00', 'Shortlisted', 'Eager to join the internship program and learn from TechCorp senior engineers.'),
(7, 5, 4, '2026-09-16 12:00:00', 'Applied', 'Experienced Data Analyst with deep SQL querying and Chart.js reporting capabilities.');
