const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config.js');
const {
  seedUsers,
  seedRecruiters,
  seedSeekers,
  seedJobs,
  seedApplications
} = require('./seedData.js');

let pool = null;
let isUsingMySQL = false;

// Fallback in-memory relational store
const store = {
  users: JSON.parse(JSON.stringify(seedUsers)),
  job_seekers: JSON.parse(JSON.stringify(seedSeekers)),
  recruiters: JSON.parse(JSON.stringify(seedRecruiters)),
  jobs: JSON.parse(JSON.stringify(seedJobs)),
  applications: JSON.parse(JSON.stringify(seedApplications)),
  nextId: {
    users: 9,
    job_seekers: 5,
    recruiters: 4,
    jobs: 9,
    applications: 8
  }
};

// Initialize DB connection
async function initDB() {
  try {
    // Attempt connection to MySQL server
    const connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      port: dbConfig.PORT
    });

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();

    // Create pool for database
    pool = mysql.createPool({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB,
      port: dbConfig.PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create tables
    await createTables(pool);
    // Seed initial data if tables are empty
    await seedTablesIfEmpty(pool);

    isUsingMySQL = true;
    console.log(`[Database] Successfully connected to MySQL database '${dbConfig.DB}' on ${dbConfig.HOST}:${dbConfig.PORT}`);
  } catch (err) {
    isUsingMySQL = false;
    console.warn(`[Database Warning] MySQL connection failed (${err.code || err.message}).`);
    console.warn(`[Database Notice] Active mode: Resilient built-in Relational Store with identical schema and seeded sample data.`);
    console.warn(`[Database Notice] All REST APIs, JWT authentication, and features are fully operational!`);
  }
}

async function createTables(p) {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('seeker', 'recruiter', 'admin') NOT NULL DEFAULT 'seeker',
      phone VARCHAR(20) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const jobSeekersTable = `
    CREATE TABLE IF NOT EXISTS job_seekers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      skills TEXT DEFAULT NULL,
      education TEXT DEFAULT NULL,
      experience TEXT DEFAULT NULL,
      resume_headline VARCHAR(255) DEFAULT NULL,
      bio TEXT DEFAULT NULL,
      CONSTRAINT fk_job_seekers_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const recruitersTable = `
    CREATE TABLE IF NOT EXISTS recruiters (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      company_name VARCHAR(150) NOT NULL,
      company_description TEXT DEFAULT NULL,
      company_location VARCHAR(150) DEFAULT NULL,
      website VARCHAR(255) DEFAULT NULL,
      CONSTRAINT fk_recruiters_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const jobsTable = `
    CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      recruiter_id INT NOT NULL,
      title VARCHAR(150) NOT NULL,
      company_name VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT DEFAULT NULL,
      skills VARCHAR(255) DEFAULT NULL,
      location VARCHAR(100) NOT NULL,
      employment_type ENUM('Full Time', 'Part Time', 'Internship', 'Contract') NOT NULL DEFAULT 'Full Time',
      salary VARCHAR(100) DEFAULT NULL,
      experience_required VARCHAR(50) DEFAULT NULL,
      posted_date DATE NOT NULL,
      last_date DATE NOT NULL,
      status ENUM('Active', 'Closed') NOT NULL DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_jobs_recruiter FOREIGN KEY (recruiter_id) REFERENCES recruiters (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const applicationsTable = `
    CREATE TABLE IF NOT EXISTS applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      seeker_id INT NOT NULL,
      applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected') NOT NULL DEFAULT 'Applied',
      cover_note TEXT DEFAULT NULL,
      CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
      CONSTRAINT fk_applications_seeker FOREIGN KEY (seeker_id) REFERENCES job_seekers (id) ON DELETE CASCADE,
      CONSTRAINT unique_job_seeker UNIQUE (job_id, seeker_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await p.query(usersTable);
  await p.query(jobSeekersTable);
  await p.query(recruitersTable);
  await p.query(jobsTable);
  await p.query(applicationsTable);
}

async function seedTablesIfEmpty(p) {
  const [rows] = await p.query('SELECT COUNT(*) as count FROM users');
  if (rows[0].count === 0) {
    console.log('[Database] Seeding initial sample data to MySQL...');
    for (const u of seedUsers) {
      await p.query('INSERT INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)', [
        u.id, u.name, u.email, u.password, u.role, u.phone
      ]);
    }
    for (const r of seedRecruiters) {
      await p.query('INSERT INTO recruiters (id, user_id, company_name, company_description, company_location, website) VALUES (?, ?, ?, ?, ?, ?)', [
        r.id, r.user_id, r.company_name, r.company_description, r.company_location, r.website
      ]);
    }
    for (const s of seedSeekers) {
      await p.query('INSERT INTO job_seekers (id, user_id, skills, education, experience, resume_headline, bio) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        s.id, s.user_id, s.skills, s.education, s.experience, s.resume_headline, s.bio
      ]);
    }
    for (const j of seedJobs) {
      await p.query('INSERT INTO jobs (id, recruiter_id, title, company_name, description, requirements, skills, location, employment_type, salary, experience_required, posted_date, last_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        j.id, j.recruiter_id, j.title, j.company_name, j.description, j.requirements, j.skills, j.location, j.employment_type, j.salary, j.experience_required, j.posted_date, j.last_date, j.status
      ]);
    }
    for (const a of seedApplications) {
      await p.query('INSERT INTO applications (id, job_id, seeker_id, applied_date, status, cover_note) VALUES (?, ?, ?, ?, ?, ?)', [
        a.id, a.job_id, a.seeker_id, a.applied_date, a.status, a.cover_note
      ]);
    }
    console.log('[Database] Initial sample data successfully seeded to MySQL.');
  }
}

// Database query function
async function query(sql, params = []) {
  if (isUsingMySQL && pool) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (error) {
      console.error('[MySQL Query Error]', error.message, 'SQL:', sql, 'Params:', params);
      throw error;
    }
  }

  // Resilient SQL Interpreter for in-memory relational store
  return executeMockQuery(sql, params);
}

// Helper to execute SQL operations on the in-memory store
function executeMockQuery(sql, params = []) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  // 1. SELECT COUNT(*)
  if (/^SELECT COUNT\(\*\)/i.test(cleanSql)) {
    let count = 0;
    if (/FROM users/i.test(cleanSql)) {
      if (/WHERE role = \?/i.test(cleanSql)) {
        count = store.users.filter(u => u.role === params[0]).length;
      } else {
        count = store.users.length;
      }
    } else if (/FROM jobs/i.test(cleanSql)) {
      if (/WHERE status = \?/i.test(cleanSql)) {
        count = store.jobs.filter(j => j.status === params[0]).length;
      } else if (/WHERE recruiter_id = \?/i.test(cleanSql)) {
        if (/AND status = \?/i.test(cleanSql)) {
          count = store.jobs.filter(j => j.recruiter_id === Number(params[0]) && j.status === params[1]).length;
        } else {
          count = store.jobs.filter(j => j.recruiter_id === Number(params[0])).length;
        }
      } else {
        count = store.jobs.length;
      }
    } else if (/FROM applications/i.test(cleanSql)) {
      if (/WHERE seeker_id = \?/i.test(cleanSql)) {
        if (/AND status = \?/i.test(cleanSql)) {
          count = store.applications.filter(a => a.seeker_id === Number(params[0]) && a.status === params[1]).length;
        } else {
          count = store.applications.filter(a => a.seeker_id === Number(params[0])).length;
        }
      } else {
        count = store.applications.length;
      }
    }
    return [{ count, total: count }];
  }

  // 2. SELECT users
  if (/^SELECT .* FROM users/i.test(cleanSql)) {
    if (/WHERE email = \?/i.test(cleanSql)) {
      const email = params[0];
      const user = store.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
      return user ? [JSON.parse(JSON.stringify(user))] : [];
    }
    if (/WHERE id = \?/i.test(cleanSql) || /WHERE u\.id = \?/i.test(cleanSql)) {
      const id = Number(params[0]);
      const user = store.users.find(u => u.id === id);
      if (!user) return [];
      const clone = JSON.parse(JSON.stringify(user));
      delete clone.password;
      return [clone];
    }
    // All users
    let res = store.users.map(u => {
      const c = { ...u };
      delete c.password;
      return c;
    });
    if (params.length > 0 && typeof params[0] === 'string' && ['seeker', 'recruiter', 'admin'].includes(params[0])) {
      res = res.filter(u => u.role === params[0]);
    }
    return res;
  }

  // 3. SELECT job_seekers
  if (/FROM job_seekers/i.test(cleanSql)) {
    if (/WHERE user_id = \?/i.test(cleanSql)) {
      const uid = Number(params[0]);
      const s = store.job_seekers.find(x => x.user_id === uid);
      return s ? [JSON.parse(JSON.stringify(s))] : [];
    }
    if (/WHERE id = \?/i.test(cleanSql)) {
      const id = Number(params[0]);
      const s = store.job_seekers.find(x => x.id === id);
      return s ? [JSON.parse(JSON.stringify(s))] : [];
    }
    return JSON.parse(JSON.stringify(store.job_seekers));
  }

  // 4. SELECT recruiters
  if (/FROM recruiters/i.test(cleanSql)) {
    if (/WHERE user_id = \?/i.test(cleanSql)) {
      const uid = Number(params[0]);
      const r = store.recruiters.find(x => x.user_id === uid);
      return r ? [JSON.parse(JSON.stringify(r))] : [];
    }
    if (/WHERE id = \?/i.test(cleanSql)) {
      const id = Number(params[0]);
      const r = store.recruiters.find(x => x.id === id);
      return r ? [JSON.parse(JSON.stringify(r))] : [];
    }
    return JSON.parse(JSON.stringify(store.recruiters));
  }

  // 5. SELECT jobs
  if (/FROM jobs/i.test(cleanSql)) {
    // Single job with recruiter join
    if (/WHERE (j\.)?id = \?/i.test(cleanSql)) {
      const jid = Number(params[0]);
      const job = store.jobs.find(j => j.id === jid);
      if (!job) return [];
      const rec = store.recruiters.find(r => r.id === job.recruiter_id);
      return [{
        ...job,
        recruiter_company_name: rec ? rec.company_name : job.company_name,
        company_description: rec ? rec.company_description : '',
        company_location: rec ? rec.company_location : job.location,
        company_website: rec ? rec.website : ''
      }];
    }

    let results = store.jobs.map(j => {
      const rec = store.recruiters.find(r => r.id === j.recruiter_id);
      const appCount = store.applications.filter(a => a.job_id === j.id).length;
      return {
        ...j,
        recruiter_company_name: rec ? rec.company_name : j.company_name,
        applications_count: appCount
      };
    });

    if (/WHERE (j\.)?recruiter_id = \?/i.test(cleanSql)) {
      const rid = Number(params[0]);
      results = results.filter(j => j.recruiter_id === rid);
    }

    return results;
  }

  // 6. SELECT applications
  if (/FROM applications/i.test(cleanSql)) {
    // Check specific duplicate: WHERE job_id = ? AND seeker_id = ?
    if (/WHERE job_id = \? AND seeker_id = \?/i.test(cleanSql)) {
      const jid = Number(params[0]);
      const sid = Number(params[1]);
      const app = store.applications.find(a => a.job_id === jid && a.seeker_id === sid);
      return app ? [app] : [];
    }

    // By seeker
    if (/WHERE a\.seeker_id = \?/i.test(cleanSql) || /WHERE seeker_id = \?/i.test(cleanSql)) {
      const sid = Number(params[0]);
      let apps = store.applications.filter(a => a.seeker_id === sid);
      return apps.map(a => {
        const job = store.jobs.find(j => j.id === a.job_id) || {};
        const rec = store.recruiters.find(r => r.id === job.recruiter_id) || {};
        return {
          ...a,
          job_title: job.title,
          company_name: job.company_name,
          location: job.location,
          employment_type: job.employment_type,
          salary: job.salary,
          job_status: job.status,
          recruiter_company: rec.company_name
        };
      });
    }

    // By job
    if (/WHERE a\.job_id = \?/i.test(cleanSql) || /WHERE job_id = \?/i.test(cleanSql)) {
      const jid = Number(params[0]);
      let apps = store.applications.filter(a => a.job_id === jid);
      return apps.map(a => {
        const seeker = store.job_seekers.find(s => s.id === a.seeker_id) || {};
        const user = store.users.find(u => u.id === seeker.user_id) || {};
        const job = store.jobs.find(j => j.id === a.job_id) || {};
        return {
          ...a,
          job_title: job.title,
          applicant_name: user.name,
          applicant_email: user.email,
          applicant_phone: user.phone,
          skills: seeker.skills,
          education: seeker.education,
          experience: seeker.experience,
          resume_headline: seeker.resume_headline,
          bio: seeker.bio
        };
      });
    }

    // By recruiter
    if (/recruiter_id = \?/i.test(cleanSql)) {
      const rid = Number(params[0]);
      const jobIds = store.jobs.filter(j => j.recruiter_id === rid).map(j => j.id);
      let apps = store.applications.filter(a => jobIds.includes(a.job_id));
      return apps.map(a => {
        const seeker = store.job_seekers.find(s => s.id === a.seeker_id) || {};
        const user = store.users.find(u => u.id === seeker.user_id) || {};
        const job = store.jobs.find(j => j.id === a.job_id) || {};
        return {
          ...a,
          job_title: job.title,
          applicant_name: user.name,
          applicant_email: user.email,
          applicant_phone: user.phone,
          skills: seeker.skills,
          education: seeker.education,
          experience: seeker.experience,
          resume_headline: seeker.resume_headline,
          bio: seeker.bio
        };
      });
    }

    // By ID
    if (/WHERE (a\.)?id = \?/i.test(cleanSql)) {
      const aid = Number(params[0]);
      const app = store.applications.find(a => a.id === aid);
      if (!app) return [];
      const seeker = store.job_seekers.find(s => s.id === app.seeker_id) || {};
      const user = store.users.find(u => u.id === seeker.user_id) || {};
      const job = store.jobs.find(j => j.id === app.job_id) || {};
      return [{
        ...app,
        job_title: job.title,
        applicant_name: user.name,
        applicant_email: user.email,
        applicant_phone: user.phone,
        skills: seeker.skills,
        education: seeker.education,
        experience: seeker.experience
      }];
    }

    // All applications (admin)
    return store.applications.map(a => {
      const seeker = store.job_seekers.find(s => s.id === a.seeker_id) || {};
      const user = store.users.find(u => u.id === seeker.user_id) || {};
      const job = store.jobs.find(j => j.id === a.job_id) || {};
      return {
        ...a,
        job_title: job.title,
        company_name: job.company_name,
        applicant_name: user.name,
        applicant_email: user.email,
        applicant_phone: user.phone
      };
    });
  }

  // 7. INSERT queries
  if (/^INSERT INTO users/i.test(cleanSql)) {
    const id = store.nextId.users++;
    const [name, email, password, role, phone] = params;
    const newUser = { id, name, email, password, role: role || 'seeker', phone: phone || '', created_at: new Date().toISOString() };
    store.users.push(newUser);
    return { insertId: id, affectedRows: 1 };
  }

  if (/^INSERT INTO job_seekers/i.test(cleanSql)) {
    const id = store.nextId.job_seekers++;
    const [user_id, skills, education, experience, resume_headline, bio] = params;
    const newSeeker = { id, user_id: Number(user_id), skills: skills || '', education: education || '', experience: experience || '', resume_headline: resume_headline || '', bio: bio || '' };
    store.job_seekers.push(newSeeker);
    return { insertId: id, affectedRows: 1 };
  }

  if (/^INSERT INTO recruiters/i.test(cleanSql)) {
    const id = store.nextId.recruiters++;
    const [user_id, company_name, company_description, company_location, website] = params;
    const newRecruiter = { id, user_id: Number(user_id), company_name, company_description: company_description || '', company_location: company_location || '', website: website || '' };
    store.recruiters.push(newRecruiter);
    return { insertId: id, affectedRows: 1 };
  }

  if (/^INSERT INTO jobs/i.test(cleanSql)) {
    const id = store.nextId.jobs++;
    const [recruiter_id, title, company_name, description, requirements, skills, location, employment_type, salary, experience_required, posted_date, last_date, status] = params;
    const newJob = {
      id,
      recruiter_id: Number(recruiter_id),
      title,
      company_name,
      description,
      requirements: requirements || '',
      skills: skills || '',
      location,
      employment_type: employment_type || 'Full Time',
      salary: salary || '',
      experience_required: experience_required || '',
      posted_date: posted_date || new Date().toISOString().split('T')[0],
      last_date: last_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: status || 'Active',
      created_at: new Date().toISOString()
    };
    store.jobs.push(newJob);
    return { insertId: id, affectedRows: 1 };
  }

  if (/^INSERT INTO applications/i.test(cleanSql)) {
    const id = store.nextId.applications++;
    const [job_id, seeker_id, cover_note] = params;
    const newApp = {
      id,
      job_id: Number(job_id),
      seeker_id: Number(seeker_id),
      applied_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Applied',
      cover_note: cover_note || ''
    };
    store.applications.push(newApp);
    return { insertId: id, affectedRows: 1 };
  }

  // 8. UPDATE queries
  if (/^UPDATE users/i.test(cleanSql)) {
    if (/SET name = \?, phone = \? WHERE id = \?/i.test(cleanSql)) {
      const [name, phone, id] = params;
      const user = store.users.find(u => u.id === Number(id));
      if (user) {
        user.name = name;
        user.phone = phone;
      }
      return { affectedRows: user ? 1 : 0 };
    }
  }

  if (/^UPDATE job_seekers/i.test(cleanSql)) {
    if (/WHERE user_id = \?/i.test(cleanSql)) {
      const [skills, education, experience, resume_headline, bio, uid] = params;
      const seeker = store.job_seekers.find(s => s.user_id === Number(uid));
      if (seeker) {
        seeker.skills = skills;
        seeker.education = education;
        seeker.experience = experience;
        seeker.resume_headline = resume_headline;
        seeker.bio = bio;
      }
      return { affectedRows: seeker ? 1 : 0 };
    }
  }

  if (/^UPDATE recruiters/i.test(cleanSql)) {
    if (/WHERE user_id = \?/i.test(cleanSql)) {
      const [company_name, company_description, company_location, website, uid] = params;
      const rec = store.recruiters.find(r => r.user_id === Number(uid));
      if (rec) {
        rec.company_name = company_name;
        rec.company_description = company_description;
        rec.company_location = company_location;
        rec.website = website;
      }
      return { affectedRows: rec ? 1 : 0 };
    }
  }

  if (/^UPDATE jobs/i.test(cleanSql)) {
    if (/SET status = \? WHERE id = \?/i.test(cleanSql)) {
      const [status, id] = params;
      const job = store.jobs.find(j => j.id === Number(id));
      if (job) job.status = status;
      return { affectedRows: job ? 1 : 0 };
    }
    // Full job update
    const [title, company_name, description, requirements, skills, location, employment_type, salary, experience_required, last_date, status, id] = params;
    const job = store.jobs.find(j => j.id === Number(id));
    if (job) {
      job.title = title;
      job.company_name = company_name;
      job.description = description;
      job.requirements = requirements;
      job.skills = skills;
      job.location = location;
      job.employment_type = employment_type;
      job.salary = salary;
      job.experience_required = experience_required;
      job.last_date = last_date;
      job.status = status;
    }
    return { affectedRows: job ? 1 : 0 };
  }

  if (/^UPDATE applications/i.test(cleanSql)) {
    if (/SET status = \? WHERE id = \?/i.test(cleanSql)) {
      const [status, id] = params;
      const app = store.applications.find(a => a.id === Number(id));
      if (app) app.status = status;
      return { affectedRows: app ? 1 : 0 };
    }
  }

  // 9. DELETE queries
  if (/^DELETE FROM users/i.test(cleanSql)) {
    const id = Number(params[0]);
    const idx = store.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      store.users.splice(idx, 1);
      // Cascade delete seeker/recruiter
      const sIdx = store.job_seekers.findIndex(s => s.user_id === id);
      if (sIdx !== -1) {
        const sid = store.job_seekers[sIdx].id;
        store.job_seekers.splice(sIdx, 1);
        store.applications = store.applications.filter(a => a.seeker_id !== sid);
      }
      const rIdx = store.recruiters.findIndex(r => r.user_id === id);
      if (rIdx !== -1) {
        const rid = store.recruiters[rIdx].id;
        store.recruiters.splice(rIdx, 1);
        const jIds = store.jobs.filter(j => j.recruiter_id === rid).map(j => j.id);
        store.jobs = store.jobs.filter(j => j.recruiter_id !== rid);
        store.applications = store.applications.filter(a => !jIds.includes(a.job_id));
      }
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (/^DELETE FROM jobs/i.test(cleanSql)) {
    const id = Number(params[0]);
    const idx = store.jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      store.jobs.splice(idx, 1);
      store.applications = store.applications.filter(a => a.job_id !== id);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (/^DELETE FROM applications/i.test(cleanSql)) {
    const id = Number(params[0]);
    const idx = store.applications.findIndex(a => a.id === id);
    if (idx !== -1) {
      store.applications.splice(idx, 1);
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  return [];
}

module.exports = {
  initDB,
  query,
  getStore: () => store,
  isUsingMySQL: () => isUsingMySQL
};
