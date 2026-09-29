const bcrypt = require('bcryptjs');

// Standard bcrypt hash for 'password123'
const DEFAULT_HASH = bcrypt.hashSync('password123', 10);

const seedUsers = [
  { id: 1, name: 'System Administrator', email: 'admin@jobportal.com', password: DEFAULT_HASH, role: 'admin', phone: '+91 9876543210', created_at: '2026-09-01T08:00:00Z' },
  { id: 2, name: 'Sarah Jenkins', email: 'sarah.jenkins@techcorp.com', password: DEFAULT_HASH, role: 'recruiter', phone: '+91 9876543211', created_at: '2026-09-01T08:30:00Z' },
  { id: 3, name: 'Michael Chang', email: 'michael.chang@innovatesoft.com', password: DEFAULT_HASH, role: 'recruiter', phone: '+91 9876543212', created_at: '2026-09-02T09:00:00Z' },
  { id: 4, name: 'Priya Sharma', email: 'priya.sharma@cloudscale.io', password: DEFAULT_HASH, role: 'recruiter', phone: '+91 9876543213', created_at: '2026-09-02T09:30:00Z' },
  { id: 5, name: 'Alex Morgan', email: 'alex.morgan@example.com', password: DEFAULT_HASH, role: 'seeker', phone: '+91 9876543214', created_at: '2026-09-03T10:00:00Z' },
  { id: 6, name: 'Rahul Verma', email: 'rahul.verma@example.com', password: DEFAULT_HASH, role: 'seeker', phone: '+91 9876543215', created_at: '2026-09-03T10:30:00Z' },
  { id: 7, name: 'Emily Watson', email: 'emily.watson@example.com', password: DEFAULT_HASH, role: 'seeker', phone: '+91 9876543216', created_at: '2026-09-04T11:00:00Z' },
  { id: 8, name: 'David Kumar', email: 'david.kumar@example.com', password: DEFAULT_HASH, role: 'seeker', phone: '+91 9876543217', created_at: '2026-09-04T11:30:00Z' }
];

const seedRecruiters = [
  { id: 1, user_id: 2, company_name: 'TechCorp Solutions', company_description: 'Global enterprise IT consulting and digital transformation leader with over 5,000 employees worldwide.', company_location: 'Bangalore, Karnataka', website: 'https://techcorp.example.com' },
  { id: 2, user_id: 3, company_name: 'InnovateSoft Systems', company_description: 'Next-generation product engineering and SaaS platform innovator building intelligent cloud systems.', company_location: 'Hyderabad, Telangana', website: 'https://innovatesoft.example.com' },
  { id: 3, user_id: 4, company_name: 'CloudScale Technologies', company_description: 'High-growth cloud infrastructure and microservices engineering firm with offices across India.', company_location: 'Pune, Maharashtra', website: 'https://cloudscale.example.com' }
];

const seedSeekers = [
  {
    id: 1,
    user_id: 5,
    skills: 'React.js, Node.js, Express.js, JavaScript, MySQL, HTML5, CSS3, Bootstrap',
    education: 'B.Tech in Computer Science, National Institute of Technology (2019-2023)',
    experience: '3 years experience building full-stack web applications and microservices at WebSolutions Inc.',
    resume_headline: 'Passionate Full Stack Developer specializing in React and Node.js ecosystems',
    bio: 'Dedicated engineer focused on writing clean, scalable, and maintainable software with responsive UI.'
  },
  {
    id: 2,
    user_id: 6,
    skills: 'Java, JDBC, Servlets, MySQL, Spring concepts, REST APIs, Git',
    education: 'Master of Computer Applications (MCA), Osmania University (2020-2022)',
    experience: '2 years backend engineering experience developing transactional systems and REST APIs at CoreTech',
    resume_headline: 'Java Backend Engineer with strong database and API development background',
    bio: 'Enthusiastic Java and database developer committed to reliable enterprise architecture.'
  },
  {
    id: 3,
    user_id: 7,
    skills: 'React.js, JavaScript, HTML5, CSS3, Bootstrap 5, Chart.js, Responsive Design',
    education: 'B.Sc in Computer Science, St. Xavier College (2020-2023)',
    experience: '1 year frontend development experience developing responsive dashboards and interactive UI',
    resume_headline: 'Frontend Developer focused on modern UI/UX and React state management',
    bio: 'Creative frontend developer with an eye for pixel-perfect design and responsive layouts.'
  },
  {
    id: 4,
    user_id: 8,
    skills: 'Python, Data Analysis, SQL, MySQL, Chart.js, Excel, REST APIs',
    education: 'B.Tech in Information Technology, Anna University (2018-2022)',
    experience: '2.5 years experience as a Data Analyst crafting insightful reports and SQL pipelines at MetricLab',
    resume_headline: 'Analytical Data Professional experienced in SQL pipelines and visualization',
    bio: 'Results-driven analyst skilled in extracting actionable insights and displaying data visually.'
  }
];

const seedJobs = [
  {
    id: 1,
    recruiter_id: 1,
    title: 'Java Developer',
    company_name: 'TechCorp Solutions',
    description: 'We are looking for an experienced Java Developer to develop enterprise backend services, database connectors via JDBC, and robust REST APIs. You will collaborate with cross-functional teams to build high-throughput applications.',
    requirements: 'Strong proficiency in Core Java, JDBC, Servlets, and MySQL. Experience with RESTful Web Services, JSON processing, and Git version control.',
    skills: 'Java, JDBC, MySQL, REST API, Git',
    location: 'Bangalore, India',
    employment_type: 'Full Time',
    salary: '8 - 12 LPA',
    experience_required: '2 - 4 Years',
    posted_date: '2026-09-01',
    last_date: '2026-10-30',
    status: 'Active',
    created_at: '2026-09-01T09:00:00Z'
  },
  {
    id: 2,
    recruiter_id: 2,
    title: 'Frontend Developer (React)',
    company_name: 'InnovateSoft Systems',
    description: 'Join our frontend team to build modern, responsive web portals using React.js and Bootstrap. You will be translating Figma UI designs into interactive React components and integrating REST endpoints.',
    requirements: 'Expert in React.js, React Router, JavaScript ES6+, HTML5, CSS3, and Bootstrap. Experience with Chart.js visualization is a plus.',
    skills: 'React.js, JavaScript, Bootstrap, CSS3, Chart.js',
    location: 'Hyderabad, India',
    employment_type: 'Full Time',
    salary: '6 - 10 LPA',
    experience_required: '1 - 3 Years',
    posted_date: '2026-09-05',
    last_date: '2026-11-15',
    status: 'Active',
    created_at: '2026-09-05T09:00:00Z'
  },
  {
    id: 3,
    recruiter_id: 3,
    title: 'Backend Developer (Node.js)',
    company_name: 'CloudScale Technologies',
    description: 'We are seeking a talented Node.js Backend Developer to architect and maintain scalable REST APIs, JWT authentication systems, and MySQL database schemas.',
    requirements: 'Solid hands-on experience with Node.js, Express.js, MySQL queries, JWT authentication, and secure password hashing with bcrypt.',
    skills: 'Node.js, Express.js, MySQL, JWT, REST API',
    location: 'Pune, India',
    employment_type: 'Full Time',
    salary: '9 - 14 LPA',
    experience_required: '3 - 5 Years',
    posted_date: '2026-09-10',
    last_date: '2026-10-25',
    status: 'Active',
    created_at: '2026-09-10T09:00:00Z'
  },
  {
    id: 4,
    recruiter_id: 1,
    title: 'Full Stack Developer',
    company_name: 'TechCorp Solutions',
    description: 'Exciting opportunity for a Full Stack Developer proficient in both React frontend and Node/Express backend. You will have full ownership of features from database schema design to responsive UI delivery.',
    requirements: 'Comprehensive knowledge of React.js, Node.js, Express, MySQL, Bootstrap, and RESTful API architecture.',
    skills: 'React.js, Node.js, Express, MySQL, Bootstrap',
    location: 'Mumbai, India',
    employment_type: 'Full Time',
    salary: '10 - 16 LPA',
    experience_required: '3 - 6 Years',
    posted_date: '2026-09-12',
    last_date: '2026-11-01',
    status: 'Active',
    created_at: '2026-09-12T09:00:00Z'
  },
  {
    id: 5,
    recruiter_id: 2,
    title: 'Data Analyst',
    company_name: 'InnovateSoft Systems',
    description: 'We are looking for an analytical Data Analyst to query transactional MySQL databases, generate metrics, and build visual dashboards using Chart.js.',
    requirements: 'Proficiency in complex SQL queries, data aggregation, Chart.js, and data visualization. Good communication skills.',
    skills: 'SQL, MySQL, Data Analysis, Chart.js',
    location: 'Gurgaon, India',
    employment_type: 'Full Time',
    salary: '7 - 11 LPA',
    experience_required: '2 - 4 Years',
    posted_date: '2026-09-15',
    last_date: '2026-10-20',
    status: 'Active',
    created_at: '2026-09-15T09:00:00Z'
  },
  {
    id: 6,
    recruiter_id: 3,
    title: 'Software Engineer - Core Services',
    company_name: 'CloudScale Technologies',
    description: 'Join our core platform engineering team to build scalable microservices, manage database transactions, and ensure 99.99% system availability.',
    requirements: 'Strong foundation in algorithms, databases (MySQL), Java/Node.js backend stacks, and API security practices.',
    skills: 'Java, Node.js, MySQL, REST API',
    location: 'Remote',
    employment_type: 'Full Time',
    salary: '12 - 18 LPA',
    experience_required: '3 - 5 Years',
    posted_date: '2026-09-18',
    last_date: '2026-11-30',
    status: 'Active',
    created_at: '2026-09-18T09:00:00Z'
  },
  {
    id: 7,
    recruiter_id: 1,
    title: 'Web Developer Intern',
    company_name: 'TechCorp Solutions',
    description: 'Kickstart your tech career with our 6-month intensive web development internship! You will work on real client web applications under senior mentorship.',
    requirements: 'Basic knowledge of HTML5, CSS3, JavaScript ES6, and Bootstrap. Willingness to learn React.js and backend concepts.',
    skills: 'HTML5, CSS3, JavaScript, Bootstrap',
    location: 'Hyderabad, India',
    employment_type: 'Internship',
    salary: '25,000 / month',
    experience_required: 'Fresher',
    posted_date: '2026-09-20',
    last_date: '2026-10-15',
    status: 'Active',
    created_at: '2026-09-20T09:00:00Z'
  },
  {
    id: 8,
    recruiter_id: 2,
    title: 'UI Developer (Contract)',
    company_name: 'InnovateSoft Systems',
    description: 'Immediate requirement for a contract UI Developer to build pixel-perfect responsive components using Bootstrap 5 and modern CSS3 for our enterprise portal.',
    requirements: 'Exceptional skills in HTML5, CSS3 Flexbox/Grid, Bootstrap 5, and JavaScript. Prior experience in job portals or enterprise SaaS.',
    skills: 'Bootstrap 5, CSS3, HTML5, JavaScript',
    location: 'Bangalore, India',
    employment_type: 'Contract',
    salary: '60,000 / month',
    experience_required: '2+ Years',
    posted_date: '2026-09-22',
    last_date: '2026-10-10',
    status: 'Active',
    created_at: '2026-09-22T09:00:00Z'
  }
];

const seedApplications = [
  { id: 1, job_id: 2, seeker_id: 1, applied_date: '2026-09-06 10:15:00', status: 'Shortlisted', cover_note: 'I have extensive experience building responsive React applications and would love to bring my skills to InnovateSoft.' },
  { id: 2, job_id: 4, seeker_id: 1, applied_date: '2026-09-13 14:30:00', status: 'Under Review', cover_note: 'Excited about the Full Stack role at TechCorp. My stack aligns directly with your React and Node requirements.' },
  { id: 3, job_id: 1, seeker_id: 2, applied_date: '2026-09-02 11:20:00', status: 'Selected', cover_note: 'With 2 years of Java, JDBC and REST API development, I can make immediate contributions to your enterprise backend team.' },
  { id: 4, job_id: 6, seeker_id: 2, applied_date: '2026-09-19 16:45:00', status: 'Applied', cover_note: 'Interested in Core Services engineering at CloudScale. Ready to take on distributed systems challenges.' },
  { id: 5, job_id: 2, seeker_id: 3, applied_date: '2026-09-07 09:00:00', status: 'Under Review', cover_note: 'Specialized in React.js and Bootstrap UI development. Looking forward to discussing how I can contribute.' },
  { id: 6, job_id: 7, seeker_id: 3, applied_date: '2026-09-21 15:10:00', status: 'Shortlisted', cover_note: 'Eager to join the internship program and learn from TechCorp senior engineers.' },
  { id: 7, job_id: 5, seeker_id: 4, applied_date: '2026-09-16 12:00:00', status: 'Applied', cover_note: 'Experienced Data Analyst with deep SQL querying and Chart.js reporting capabilities.' }
];

module.exports = {
  DEFAULT_HASH,
  seedUsers,
  seedRecruiters,
  seedSeekers,
  seedJobs,
  seedApplications
};
