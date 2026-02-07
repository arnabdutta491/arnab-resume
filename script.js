/* ==========================================================================
   ARNAB DUTTA — PREMIUM PORTFOLIO ENGINE
   Data-driven rendering from resume-data.json.
   Scroll-reveal, micro-interactions, premium motion — zero libraries.
   ========================================================================== */

'use strict';

/* ===================== HELPERS ===================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Throttle — limits execution rate of a function.
 * @param {Function} fn
 * @param {number} ms
 * @returns {Function}
 */
function throttle(fn, ms = 80) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Sanitize text to prevent XSS when inserting into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function esc(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

/* ===================== SVG ICON LIBRARY ===================== */
const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
  layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
};

/** Map skill-group keys to readable titles and icons */
const SKILL_META = {
  programming_languages: { title: 'Languages',          icon: 'code' },
  frameworks_libraries:  { title: 'Frameworks & Libs',   icon: 'server' },
  frontend:              { title: 'Frontend',            icon: 'layout' },
  databases:             { title: 'Databases',           icon: 'database' },
  devops_cloud:          { title: 'DevOps & Cloud',      icon: 'cloud' },
  tools:                 { title: 'Tools & Platforms',   icon: 'tool' },
  operating_systems:     { title: 'Operating Systems',   icon: 'monitor' },
};

/* ===================== DOM CACHE ===================== */
const DOM = {
  header:       $('#header'),
  navToggle:    $('#navToggle'),
  navList:      $('#navList'),
  navLinks:     $$('[data-nav]'),
  navResume:    $('#navResume'),
  backToTop:    $('#backToTop'),
  yearEl:       $('#currentYear'),
  loader:       $('#loader'),
  cursorGlow:   $('#cursorGlow'),
  heroName:     $('#heroName'),
  heroRole:     $('#heroRole'),
  heroTagline:  $('#heroTagline'),
  heroCode:     $('#heroCode'),
  heroResume:   $('#heroResume'),
  aboutContent: $('#aboutContent'),
  aboutStats:   $('#aboutStats'),
  skillsGrid:   $('#skillsGrid'),
  projectsGrid: $('#projectsGrid'),
  timeline:     $('#timeline'),
  resumeCta:    $('#resumeCta'),
  contactInfo:  $('#contactInfo'),
  contactForm:  $('#contactForm'),
  footerSocials:$('#footerSocials'),
};

/* ===================== EMBEDDED FALLBACK DATA ===================== */
/* Used when fetch() fails (e.g. opening index.html directly via file://) */
const FALLBACK_DATA = {
  "personal": {
    "name": "Arnab Dutta",
    "role": "Senior Software Developer",
    "location": "Kolkata, India",
    "phone": "8777598412",
    "emails": ["arnabdutta491@gmail.com", "arnab.dutta.official491@gmail.com"],
    "linkedin": "LinkedIn"
  },
  "summary": "IT professional with 4+ years of hands-on industry experience specializing in Python and JavaScript technologies. Experienced in building high-performance web applications, large-scale enterprise systems, POS platforms, and AI-driven analytics solutions. Strong understanding of SDLC, Agile methodologies, and cross-functional collaboration with a clear aspiration to grow as a full-stack engineer.",
  "skills": {
    "programming_languages": ["Python", "JavaScript", "TypeScript"],
    "frameworks_libraries": ["Django", "FastAPI", "Angular", "Node.js", "Pandas"],
    "frontend": ["HTML", "CSS", "Electron", "Ionic"],
    "databases": ["MySQL", "PostgreSQL", "MongoDB", "Elasticsearch"],
    "devops_cloud": ["Docker", "Jenkins", "AWS", "Azure", "CI/CD"],
    "tools": ["Git", "Bitbucket", "GitLab", "Postman", "Jira", "Slack", "Zoho", "SonarQube"],
    "operating_systems": ["Linux", "Windows"]
  },
  "experience": [
  {
    "company": "ETIOT | InWork Global",
    "role": "Senior Software Developer",
    "duration": "January 2026 – Present",
    "description": [
      "Leading backend development for a large-scale Gas Pipeline Operations & Maintenance platform for a major Indian PSU (BPCL).",
      "Architected scalable backend services using FastAPI and Python to handle high-volume industrial datasets for 1,000+ pipeline assets.",
      "Integrated advanced GIS mapping using ESRI Maps with multi-layer architecture for real-time asset tracking and visualization.",
      "Improved system performance by optimizing PostgreSQL queries, heavy data tables, and GIS layers, reducing initial load time by 40%.",
      "Collaborated with product, QA, and operations teams to deliver production-grade, high-availability systems."
    ],
    "tech_stack": ["Python", "FastAPI", "PostgreSQL", "ESRI GIS", "Docker", "REST APIs"]
  },
  {
    "company": "Shyam Steel Manufacturing Limited",
    "role": "Software Developer",
    "duration": "June 2024 – January 2026",
    "description": [
      "Led development of an enterprise-grade HRMS product covering payroll, attendance, leave management, recruitment, performance appraisal, training, and document management.",
      "Built and maintained HRMS, DMS, and internal admin modules using Django with role-based access control and audit logging.",
      "Developed real-time dashboards and MIS reports to support data-driven HR, compliance, and management decisions.",
      "Integrated SAP-based systems and third-party services for payroll compliance, attendance synchronization, and enterprise workflows.",
      "Implemented CI/CD pipelines using Docker and automation tools to enable seamless backend and frontend deployments.",
      "Optimized complex database queries and background jobs, improving overall system performance and stability.",
      "Worked closely with HR stakeholders, compliance teams, and management to gather requirements and deliver scalable solutions."
    ],
    "tech_stack": [
      "Python",
      "Django",
      "PostgreSQL",
      "JavaScript",
      "SAP Integration",
      "Docker",
      "CI/CD",
      "REST APIs",
      "RBAC"
    ]
  },
  {
    "company": "Navigators Software Pvt. Ltd.",
    "role": "System Engineer",
    "duration": "July 2022 – June 2024",
    "description": [
      "Contributed to multiple enterprise and AI-driven projects as part of a cross-functional product engineering team.",
      "Developed NavAI, an AI-powered analytics platform enabling natural language queries over structured and unstructured enterprise data.",
      "Designed and optimized prompt engineering strategies for Large Language Models (LLMs) to improve response accuracy and contextual relevance.",
      "Built scalable backend APIs for data ingestion, processing, and analytics using Django and Python.",
      "Worked on Retail POS (Point of Sale) systems involving billing, inventory, and payment processing workflows.",
      "Integrated Elasticsearch to improve product search performance, reducing query response time by approximately 30%.",
      "Optimized PostgreSQL queries and indexing strategies, improving API response times and system throughput.",
      "Developed secure RESTful APIs with authentication, authorization, and role-based access control.",
      "Collaborated closely with Business Analysts, QA engineers, and Project Managers following agile and sprint-based development practices."
    ],
    "tech_stack": [
      "Python",
      "Django",
      "PostgreSQL",
      "MongoDB",
      "Elasticsearch",
      "Angular",
      "Docker",
      "Jenkins",
      "AWS",
      "Machine Learning",
      "NLP",
      "LLMs",
      "REST APIs"
    ]
  },
  {
    "company": "RightEpay Corp. Pvt. Ltd.",
    "role": "Software Intern",
    "duration": "November 2020 – May 2022",
    "description": [
      "Supported development of a digital payments and utility payment platform.",
      "Worked on backend services for transaction processing, user management, and reporting.",
      "Assisted in API development and integration using Django and Java Spring Boot.",
      "Gained hands-on experience with full-stack development and agile delivery practices."
    ],
    "tech_stack": ["Python", "Django", "Angular", "Ionic", "Java (Spring Boot)", "REST APIs"]
  }
],
  "projects": [
  {
    "title": "BPCL Gas Pipeline Operations & Maintenance Platform",
    "organization": "ETIOT | InWork Global",
    "description": "Large-scale industrial web application for monitoring and maintaining gas pipeline assets for BPCL.",
    "key_contributions": [
      "Developed scalable backend services using FastAPI to handle large industrial datasets.",
      "Integrated ESRI GIS maps with multi-layer architecture for real-time asset tracking.",
      "Enabled real-time monitoring for patrolmen, contractors, and field engineers across 1,000+ assets.",
      "Optimized heavy data tables and GIS layers, reducing initial load time by 40%."
    ],
    "tech_stack": ["Python", "FastAPI", "PostgreSQL", "ESRI GIS", "Docker"]
  },
  {
    "title": "HRMS Product (SFTEVOLVE)",
    "organization": "Shyam Steel Manufacturing Limited",
    "description": "End-to-end enterprise Human Resource Management System supporting core HR operations.",
    "key_contributions": [
      "Developed modules for payroll, attendance, leave, recruitment, performance management, and training.",
      "Integrated compliance checks and SAP-based external systems.",
      "Implemented real-time reports and analytics for management decision-making.",
      "Configured CI/CD pipelines for smooth backend and frontend deployments."
    ],
    "tech_stack": ["Python", "Django", "JavaScript", "Docker", "CI/CD", "SAP Integration"]
  },
  {
    "title": "Document Management System (DMS)",
    "organization": "Shyam Steel Manufacturing Limited",
    "description": "Centralized and secure document management platform for enterprise usage.",
    "key_contributions": [
      "Designed secure document upload, version control, and access management.",
      "Implemented role-based access control (RBAC) for sensitive documents.",
      "Improved document retrieval efficiency and reduced manual document handling."
    ],
    "tech_stack": ["Python", "Django", "PostgreSQL", "RBAC"]
  },
  {
    "title": "E-Recruitment CV Parser & Resume Analysis System",
    "organization": "Internal Product R&D",
    "description": "Automated system for parsing and analyzing resumes to support recruitment workflows.",
    "key_contributions": [
      "Built a CV parsing engine to extract structured data from resumes.",
      "Implemented scoring logic for skills, experience, and keyword relevance.",
      "Enabled automated candidate shortlisting to reduce recruiter effort.",
      "Designed the system to integrate seamlessly with ATS platforms."
    ],
    "tech_stack": ["Python", "NLP", "Machine Learning", "FastAPI", "REST APIs"]
  },
  {
    "title": "NavAI – AI Driven Analytics Platform",
    "organization": "Navigators Software Pvt. Ltd.",
    "description": "AI-powered analytics platform enabling natural language interaction with enterprise data.",
    "key_contributions": [
      "Designed and optimized LLM prompts to improve accuracy and contextual relevance.",
      "Developed scalable backend services for data ingestion and analytics.",
      "Collaborated in an agile, cross-functional team with BA, QA, and project managers."
    ],
    "tech_stack": ["Python", "Django", "PostgreSQL", "MongoDB", "Angular", "Docker", "Jenkins", "AWS"]
  },
  {
    "title": "Retail POS (Point of Sale) System",
    "organization": "Navigators Software Pvt. Ltd.",
    "description": "Full-scale retail POS system supporting billing, inventory, and payment processing.",
    "key_contributions": [
      "Integrated Elasticsearch, reducing product search response time by 30%.",
      "Optimized PostgreSQL queries to improve system performance by 20%.",
      "Integrated credit card payments with Pin Pad devices."
    ],
    "tech_stack": ["Python", "Django", "PostgreSQL", "Elasticsearch", "Angular", "Electron", "Docker", "Jenkins", "AWS"]
  },
  {
    "title": "D&B Supply – E-commerce Admin Panel",
    "organization": "Navigators Software Pvt. Ltd.",
    "description": "Admin panel for managing inventory, orders, analytics, and user roles.",
    "key_contributions": [
      "Developed secure REST APIs with role-based access control.",
      "Implemented caching strategies to improve responsiveness and scalability."
    ],
    "tech_stack": ["Python", "Django", "PostgreSQL", "Elasticsearch", "Docker", "AWS"]
  },
  {
    "title": "RightEpay",
    "organization": "RightEpay Corp. Pvt. Ltd.",
    "description": "Payment Gateway",
    "key_contributions": [
     "Contributed to the development of a digital payments platform.",
      "Worked on transaction processing, utility payments, and user management modules.",
      "Collaborated within an agile team under senior guidance."
    ],
    "tech_stack":  ["Python", "Django",'MySql', "Angular", "Ionic", "Java (Spring Boot)"]
  }
],
  "education": [
    {
      "degree": "Bachelor of Computer Application",
      "institution": "Indira Gandhi National Open University",
      "status": "Pursuing"
    },
    {
      "degree": "Diploma in Computer Programming & Applications",
      "institution": "Ramakrishna Mission Shilpamandira Computer Centre, Belur Math",
      "duration": "May 2019 \u2013 May 2021",
      "result": "Passed with 89%"
    },
    {
      "degree": "Higher Secondary Education (Commerce)",
      "institution": "Jetia High School",
      "duration": "2017 \u2013 2019",
      "result": "Passed with 64.8%"
    }
  ],
  "resume": {
    "file": "Arnab_Dutta_Resume.pdf",
    "download_label": "Download Resume"
  }
};

/* ===================== DATA FETCH ===================== */

/**
 * Fetch resume-data.json and boot the entire site.
 * Falls back to embedded FALLBACK_DATA if fetch fails
 * (e.g. when opening index.html directly via file:// protocol).
 */
async function init() {
  render(FALLBACK_DATA);
  boot();
}

/* ===================== RENDER ENGINE ===================== */

/**
 * Master render — populates every section from JSON data.
 * @param {Object} data — parsed resume-data.json
 */
function render(data) {
  renderHero(data);
  renderAbout(data);
  renderSkills(data.skills);
  renderProjects(data.projects);
  renderTimeline(data.experience, data.education);
  renderResumeCta(data.resume);
  renderContact(data.personal);
  renderFooter(data.personal);
}

/* ---------- Hero ---------- */
function renderHero(data) {
  const { personal, summary } = data;
  if (DOM.heroName)    DOM.heroName.textContent = personal.name;
  if (DOM.heroRole)    DOM.heroRole.textContent = personal.role;
  if (DOM.heroTagline) DOM.heroTagline.textContent = summary;

  // Dynamic code block
  if (DOM.heroCode) {
    const firstName = personal.name.split(' ')[0].toLowerCase();
    DOM.heroCode.innerHTML = [
      `<span class="hl-kw">interface</span> <span class="hl-type">Developer</span> <span class="hl-punc">{</span>`,
      `  <span class="hl-key">name</span><span class="hl-punc">:</span>       <span class="hl-str">"${esc(personal.name)}"</span><span class="hl-punc">;</span>`,
      `  <span class="hl-key">role</span><span class="hl-punc">:</span>       <span class="hl-str">"${esc(personal.role)}"</span><span class="hl-punc">;</span>`,
      `  <span class="hl-key">experience</span><span class="hl-punc">:</span> <span class="hl-str">"4+ years"</span><span class="hl-punc">;</span>`,
      `  <span class="hl-key">location</span><span class="hl-punc">:</span>   <span class="hl-str">"${esc(personal.location)}"</span><span class="hl-punc">;</span>`,
      `  <span class="hl-key">passion</span><span class="hl-punc">:</span>    <span class="hl-bool">Infinity</span><span class="hl-punc">;</span>`,
      `<span class="hl-punc">}</span>`,
      ``,
      `<span class="hl-kw">const</span> ${esc(firstName)}<span class="hl-punc">:</span> <span class="hl-type">Developer</span><span class="hl-punc">;</span>`,
    ].join('\n');
  }

  // Set resume download paths
  if (data.resume && data.resume.file) {
    if (DOM.navResume)  DOM.navResume.href  = data.resume.file;
    if (DOM.heroResume) DOM.heroResume.href = data.resume.file;
  }
}

/* ---------- About ---------- */
function renderAbout(data) {
  const { summary, experience, skills } = data;

  // Text
  if (DOM.aboutContent) {
    // Split long summary into 2 paragraphs for readability
    const mid = summary.indexOf('. ', Math.floor(summary.length / 2));
    const p1 = summary.slice(0, mid + 1);
    const p2 = summary.slice(mid + 2);
    DOM.aboutContent.innerHTML = `
      <p class="about__text">${esc(p1)}</p>
      ${p2 ? `<p class="about__text">${esc(p2)}</p>` : ''}
    `;
  }

  // Stats
  if (DOM.aboutStats) {
    const totalSkills = Object.values(skills).flat().length;
    const years = experience.length > 0 ? '4' : '0';

    DOM.aboutStats.innerHTML = `
      <div class="stat-card">
        <span class="stat-card__number" data-count="${experience.length}">0</span><span class="stat-card__plus">+</span>
        <span class="stat-card__label">Companies</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__number" data-count="${totalSkills}">0</span><span class="stat-card__plus">+</span>
        <span class="stat-card__label">Technologies</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__number" data-count="${years}">0</span><span class="stat-card__plus">+</span>
        <span class="stat-card__label">Years Experience</span>
      </div>
    `;
  }
}

/* ---------- Skills ---------- */
function renderSkills(skills) {
  if (!DOM.skillsGrid || !skills) return;

  DOM.skillsGrid.classList.add('reveal-stagger');

  DOM.skillsGrid.innerHTML = Object.entries(skills).map(([key, items]) => {
    const meta = SKILL_META[key] || { title: key.replace(/_/g, ' '), icon: 'code' };
    const icon = ICONS[meta.icon] || ICONS.code;

    return `
      <div class="skill-group reveal">
        <h3 class="skill-group__title">
          <span class="skill-group__icon">${icon}</span>
          ${esc(meta.title)}
        </h3>
        <div class="skill-group__items">
          ${items.map(s => `<span class="skill-chip">${esc(s)}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- Projects ---------- */
function renderProjects(projects) {
  if (!DOM.projectsGrid || !projects) return;

  DOM.projectsGrid.classList.add('reveal-stagger');

  DOM.projectsGrid.innerHTML = projects.map(p => `
    <article class="project-card reveal">
      <div class="project-card__icon">${ICONS.folder}</div>
      <h3 class="project-card__title">${esc(p.title)}</h3>
      ${p.organization ? `<p class="project-card__org">${esc(p.organization)}</p>` : ''}
      <p class="project-card__desc">${esc(p.description)}</p>
      ${p.key_contributions && p.key_contributions.length ? `
        <div class="project-card__highlights">
          ${p.key_contributions.map(c => `<span class="project-card__highlight">${esc(c)}</span>`).join('')}
        </div>
      ` : ''}
      <div class="project-card__tags">
        ${p.tech_stack.map(t => `<span class="project-card__tag">${esc(t)}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

/* ---------- Timeline ---------- */
function renderTimeline(experience, education) {
  if (!DOM.timeline) return;

  // Experience items
  const expHtml = (experience || []).map(exp => {
    // Some entries have nested projects
    const descriptions = exp.description || [];
    const nestedProjects = exp.projects || [];

    let descHtml = '';
    if (descriptions.length) {
      descHtml = `<div class="timeline__desc">
        ${descriptions.map(d => `<p class="timeline__desc-item">${esc(d)}</p>`).join('')}
      </div>`;
    }
    if (nestedProjects.length) {
      descHtml += nestedProjects.map(np => `
        <div class="timeline__desc" style="margin-top: 0.75rem;">
          <p class="timeline__desc-item"><strong>${esc(np.name)}</strong> — ${esc(np.description)}</p>
          ${(np.responsibilities || []).map(r => `<p class="timeline__desc-item">${esc(r)}</p>`).join('')}
        </div>
      `).join('');
    }

    const techTags = (exp.tech_stack || nestedProjects.flatMap(np => np.tech_stack || []));

    return `
      <div class="timeline__item reveal">
        <div class="timeline__marker timeline__marker--work"></div>
        <div class="timeline__content">
          <span class="timeline__badge timeline__badge--work">Experience</span>
          <h3 class="timeline__title">${esc(exp.role)}</h3>
          <p class="timeline__company">${esc(exp.company)}</p>
          <span class="timeline__date">${ICONS.calendar} ${esc(exp.duration)}</span>
          ${descHtml}
          ${techTags.length ? `
            <div class="timeline__tech">
              ${techTags.map(t => `<span class="timeline__tech-tag">${esc(t)}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Education items
  const eduHtml = (education || []).map(edu => {
    const info = [];
    if (edu.duration) info.push(edu.duration);
    if (edu.status) info.push(edu.status);
    if (edu.result) info.push(edu.result);

    return `
      <div class="timeline__item reveal">
        <div class="timeline__marker timeline__marker--edu"></div>
        <div class="timeline__content">
          <span class="timeline__badge timeline__badge--edu">Education</span>
          <h3 class="timeline__title">${esc(edu.degree)}</h3>
          <p class="timeline__company">${esc(edu.institution)}</p>
          ${info.length ? `<span class="timeline__date">${ICONS.calendar} ${esc(info.join(' · '))}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  DOM.timeline.innerHTML = expHtml + eduHtml;
}

/* ---------- Resume CTA ---------- */
function renderResumeCta(resume) {
  if (!DOM.resumeCta || !resume) return;

  DOM.resumeCta.innerHTML = `
    <div class="resume-cta__text">
      <h2 class="resume-cta__title">Want the full picture?</h2>
      <p class="resume-cta__subtitle">Download my resume for a comprehensive overview of my experience, skills, and education.</p>
    </div>
    <a href="${esc(resume.file)}" download class="btn btn--primary btn--lg btn--glow resume-cta__btn">
      ${ICONS.download}
      <span>${esc(resume.download_label)}</span>
    </a>
  `;
}

/* ---------- Contact ---------- */
function renderContact(personal) {
  if (!DOM.contactInfo || !personal) return;

  const cards = [];

  // Emails
  if (personal.emails && personal.emails.length) {
    cards.push(`
      <a href="mailto:${esc(personal.emails[0])}" class="contact-card">
        <div class="contact-card__icon">${ICONS.mail}</div>
        <div>
          <p class="contact-card__label">Email</p>
          <p class="contact-card__value">${esc(personal.emails[0])}</p>
        </div>
      </a>
    `);
  }

  // Phone
  if (personal.phone) {
    cards.push(`
      <a href="tel:+91${esc(personal.phone)}" class="contact-card">
        <div class="contact-card__icon">${ICONS.phone}</div>
        <div>
          <p class="contact-card__label">Phone</p>
          <p class="contact-card__value">+91 ${esc(personal.phone)}</p>
        </div>
      </a>
    `);
  }

  // LinkedIn
  if (personal.linkedin) {
    cards.push(`
      <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" class="contact-card">
        <div class="contact-card__icon">${ICONS.linkedin}</div>
        <div>
          <p class="contact-card__label">LinkedIn</p>
          <p class="contact-card__value">${esc(personal.linkedin)}</p>
        </div>
      </a>
    `);
  }

  // Location
  if (personal.location) {
    cards.push(`
      <div class="contact-card">
        <div class="contact-card__icon">${ICONS.location}</div>
        <div>
          <p class="contact-card__label">Location</p>
          <p class="contact-card__value">${esc(personal.location)}</p>
        </div>
      </div>
    `);
  }

  DOM.contactInfo.innerHTML = `
    <p class="contact__text">
      I'm always open to discussing new opportunities, interesting projects, or 
      just having a conversation about technology. Feel free to reach out!
    </p>
    <div class="contact__cards">${cards.join('')}</div>
  `;
}

/* ---------- Footer ---------- */
function renderFooter(personal) {
  if (!DOM.footerSocials || !personal) return;

  const socials = [];

  if (personal.emails && personal.emails.length) {
    socials.push(`<a href="mailto:${esc(personal.emails[0])}" aria-label="Email" class="footer__social">${ICONS.mail}</a>`);
  }
  if (personal.linkedin) {
    socials.push(`<a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="footer__social">${ICONS.linkedin}</a>`);
  }
  if (personal.phone) {
    socials.push(`<a href="tel:+91${esc(personal.phone)}" aria-label="Phone" class="footer__social">${ICONS.phone}</a>`);
  }

  DOM.footerSocials.innerHTML = socials.join('');
}

/* ===================== BOOT SEQUENCE ===================== */

/**
 * Boot — runs after data render. Sets up all interactions.
 */
function boot() {
  // Year
  if (DOM.yearEl) DOM.yearEl.textContent = new Date().getFullYear();

  // Remove loader
  requestAnimationFrame(() => {
    if (DOM.loader) DOM.loader.classList.add('hidden');
    document.body.classList.remove('loading');
    // Remove loader from DOM after transition
    setTimeout(() => DOM.loader && DOM.loader.remove(), 600);
  });

  setupScroll();
  setupMobileNav();
  setupSmoothScroll();
  setupRevealObserver();
  setupCounterObserver();
  setupTimelineAnimation();
  setupDividerAnimation();
  setupCursorGlow();
  setupContactForm();
  setupResumeTracking();
  setupKeyboardA11y();
}

/* ===================== SCROLL HANDLING ===================== */

function setupScroll() {
  const onScroll = throttle(() => {
    updateHeader();
    updateActiveLink();
    updateBackToTop();
  }, 40);

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();
  updateActiveLink();
}

function updateHeader() {
  if (!DOM.header) return;
  DOM.header.classList.toggle('header--scrolled', window.scrollY > 40);
}

function updateActiveLink() {
  const scrollY = window.scrollY + 140;
  const sections = $$('section[id]');

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < bottom) {
      DOM.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

function updateBackToTop() {
  if (!DOM.backToTop) return;
  DOM.backToTop.classList.toggle('visible', window.scrollY > 500);
}

/* ===================== MOBILE NAV ===================== */

function setupMobileNav() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.classList.add('nav__overlay');
  document.body.appendChild(overlay);

  function open() {
    DOM.navList.classList.add('open');
    DOM.navToggle.classList.add('active');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    DOM.navList.classList.remove('open');
    DOM.navToggle.classList.remove('active');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (DOM.navToggle) {
    DOM.navToggle.addEventListener('click', () => {
      DOM.navList.classList.contains('open') ? close() : open();
    });
  }

  overlay.addEventListener('click', close);

  DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (DOM.navList.classList.contains('open')) close();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && DOM.navList.classList.contains('open')) close();
  });
}

/* ===================== SMOOTH SCROLL ===================== */

function setupSmoothScroll() {
  // Back to top
  if (DOM.backToTop) {
    DOM.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // All anchor links
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();

      // Use actual header element height for accuracy
      const headerH = DOM.header ? DOM.header.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ===================== INTERSECTION OBSERVERS ===================== */

/** Scroll-reveal for .reveal elements */
function setupRevealObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}

/** Animated stat counters */
function setupCounterObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  $$('.stat-card__number[data-count]').forEach(el => observer.observe(el));
}

/**
 * Animate number from 0 → target with eased curve.
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/** Timeline vertical line animation */
function setupTimelineAnimation() {
  if (!DOM.timeline) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        DOM.timeline.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(DOM.timeline);
}

/** Section divider line animations */
function setupDividerAnimation() {
  const lines = $$('.section-divider__line');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  lines.forEach(line => observer.observe(line));
}

/* ===================== CURSOR GLOW ===================== */

function setupCursorGlow() {
  const glow = DOM.cursorGlow;
  if (!glow || window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = -1000, mouseY = -1000;
  let glowX = -1000, glowY = -1000;
  let active = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!active) {
      active = true;
      glow.classList.add('active');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    active = false;
    glow.classList.remove('active');
  });

  // Smooth follow with lerp
  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* ===================== CONTACT FORM ===================== */

function setupContactForm() {
  const form = DOM.contactForm;
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = $('#formName').value.trim();
    const email   = $('#formEmail').value.trim();
    const message = $('#formMessage').value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span>';

    // Simulated send (replace with real API)
    setTimeout(() => {
      showFeedback("Message sent successfully! I'll get back to you soon.", 'success');
      form.reset();
      btn.disabled = false;
      btn.innerHTML = `
        <span>Send Message</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      `;
    }, 1200);
  });
}

/**
 * Show temporary feedback below the form.
 * @param {string} msg
 * @param {'success'|'error'} type
 */
function showFeedback(msg, type) {
  const existing = $('.form-feedback');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = `form-feedback form-feedback--${type}`;
  el.textContent = msg;
  DOM.contactForm.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 5000);
}

/* ===================== RESUME TRACKING ===================== */

function setupResumeTracking() {
  $$('a[download]').forEach(link => {
    link.addEventListener('click', () => {
      console.log('[Portfolio] Resume download initiated.');
    });
  });
}

/* ===================== KEYBOARD ACCESSIBILITY ===================== */

function setupKeyboardA11y() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab' && DOM.navList.classList.contains('open')) {
      const focusable = DOM.navList.querySelectorAll('a, button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ===================== LAUNCH ===================== */
init();
