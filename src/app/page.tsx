"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Payment = {
  id: string;
  initials: string;
  name: string;
  className: string;
  amount: number;
  method: string;
  date: string;
  color: string;
};

type DemoStudent = {
  id: string;
  name: string;
  className: string;
  guardian: string;
  gpa: string;
  attendance: string;
  feeStatus: "Clear" | "Due" | "Overdue";
  color: string;
};

const demoStudents: DemoStudent[] = [
  { id: "ST-1048", name: "Brian Otieno", className: "Grade 10  Blue", guardian: "Peter Otieno", gpa: "3.62", attendance: "94.6%", feeStatus: "Clear", color: "purple" },
  { id: "ST-1047", name: "Amina Wanjiku", className: "Grade 8  Blue", guardian: "Samir Mohammed", gpa: "3.88", attendance: "97.1%", feeStatus: "Clear", color: "green" },
  { id: "ST-1046", name: "James Mwangi", className: "Grade 11  A", guardian: "Njeri Kamau", gpa: "3.24", attendance: "91.8%", feeStatus: "Due", color: "orange" },
  { id: "ST-1045", name: "Faith Njeri", className: "Grade 6  Green", guardian: "Joseph Njeri", gpa: "3.74", attendance: "96.2%", feeStatus: "Clear", color: "blue" },
  { id: "ST-1044", name: "Daniel Ochieng", className: "Grade 9  Red", guardian: "Grace Ochieng", gpa: "3.41", attendance: "89.4%", feeStatus: "Overdue", color: "pink" },
  { id: "ST-1043", name: "Wanjiku Kamau", className: "Grade 7  Gold", guardian: "Peter Kamau", gpa: "3.56", attendance: "95.0%", feeStatus: "Due", color: "yellow" },
  { id: "ST-1042", name: "Sharon Akinyi", className: "Grade 10  Green", guardian: "Miriam Akinyi", gpa: "3.08", attendance: "86.7%", feeStatus: "Overdue", color: "teal" },
  { id: "ST-1041", name: "Kevin Kiptoo", className: "Grade 12  A", guardian: "Rose Kiptoo", gpa: "3.92", attendance: "98.3%", feeStatus: "Clear", color: "blue" },
];

const initialPayments: Payment[] = [
  { id: "INV-1048", initials: "AM", name: "Amina Wanjiku", className: "Grade 8  Blue", amount: 1250, method: "Bank transfer", date: "Today, 09:42", color: "purple" },
  { id: "INV-1047", initials: "JK", name: "James Mwangi", className: "Grade 11  A", amount: 850, method: "Cash", date: "Today, 09:18", color: "orange" },
  { id: "INV-1046", initials: "SL", name: "Faith Njeri", className: "Grade 6  Green", amount: 2100, method: "Card", date: "Yesterday, 16:24", color: "blue" },
  { id: "INV-1045", initials: "DO", name: "Daniel Ochieng", className: "Grade 9  Red", amount: 600, method: "Mobile money", date: "Yesterday, 14:07", color: "green" },
];

const outstanding = [
  { initials: "EW", name: "Sharon Akinyi", details: "Grade 10  Term 2", amount: 1850, color: "pink" },
  { initials: "BT", name: "Brian Kiptoo", details: "Grade 7  Term 2", amount: 1200, color: "yellow" },
  { initials: "NP", name: "Kevin Kiptoo", details: "Grade 12  Term 2", amount: 980, color: "teal" },
];

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [payments, setPayments] = useState(initialPayments);
  const [query, setQuery] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [toast, setToast] = useState("");
  const [paymentPeriod, setPaymentPeriod] = useState("This month");
  const [chartPeriod, setChartPeriod] = useState("This year");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("clearledger-theme") === "dark");
  const [showReminders, setShowReminders] = useState(false);
  const [parentMode, setParentMode] = useState(false);
  const [showParentPayment, setShowParentPayment] = useState(false);
  const [parentPaymentComplete, setParentPaymentComplete] = useState(false);
  const [parentStudent, setParentStudent] = useState("Wanjiku Kamau");
  const [parentAmount, setParentAmount] = useState("");
  const [parentMethod, setParentMethod] = useState("Card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);
  const [selectedChild, setSelectedChild] = useState("Wanjiku Kamau");
  const [parentSection, setParentSection] = useState("Overview");
  const [authenticated, setAuthenticated] = useState(false);
  const [accountRole, setAccountRole] = useState<"staff" | "teacher" | "parent" | "student">("staff");
  const [loginError, setLoginError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showStudentAi, setShowStudentAi] = useState(false);
  const [studentQuestion, setStudentQuestion] = useState("");
  const [liveClassStarted, setLiveClassStarted] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showStudentCredential, setShowStudentCredential] = useState(false);
  const [generatedCredential, setGeneratedCredential] = useState<{ username: string; password: string } | null>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAccent, setProfileAccent] = useState("green");
  const [profileDigest, setProfileDigest] = useState(true);
  const isAdministrator = authenticated && accountRole === "staff";

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  function toggleTheme() {
    const nextTheme = !darkMode;
    document.documentElement.dataset.theme = nextTheme ? "dark" : "light";
    window.localStorage.setItem("clearledger-theme", nextTheme ? "dark" : "light");
    setDarkMode(nextTheme);
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function navigate(item: string) {
    setActiveNav(item);
    notify(`${item} selected`);
  }

  function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const role = String(data.get("role") || "staff") as "staff" | "teacher" | "parent" | "student";
    const validStaff = role === "staff" && email === "anthony@gmail.com" && password === "12345678";
    const validTeacher = role === "teacher" && email === "teacher@anthony.school" && password === "teacher123";
    const validParent = role === "parent" && email === "parent@anthony.school" && password === "parent123";
    const validStudent = role === "student" && email === "student@anthony.school" && password === "student123";
    if (!validStaff && !validTeacher && !validParent && !validStudent) {
      setLoginError("That email, password, or account type is not correct.");
      return;
    }
    setAccountRole(role);
    setParentMode(role === "parent");
    setAuthenticated(true);
    setLoginError("");
  }

  function signOut() {
    setAuthenticated(false);
    setParentMode(false);
    notify("Signed out securely");
  }

  function openProfileSettings() {
    setProfileDisplayName(accountRole === "staff" ? "Peter Kamau" : accountRole === "teacher" ? "Ms. Njeri" : accountRole === "student" ? "Brian Otieno" : "Grace Wambui");
    setProfilePhone("");
    setShowProfileSettings(true);
  }

  function saveProfileSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowProfileSettings(false);
    setShowProfile(false);
    notify("Profile customizations saved");
  }

  function openParentPayment(student = "Wanjiku Kamau", balance = 1850) {
    setParentStudent(student);
    setParentAmount(String(balance));
    setParentPaymentComplete(false);
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvc("");
    setCardFlipped(false);
    setShowParentPayment(true);
  }

  function submitParentPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount") || 0);
    const student = String(data.get("student") || parentStudent);
    const initials = student.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    setPayments((current) => [{ id: `FF-2026-${131 + current.length}`, initials, name: student, className: "Parent payment", amount, method: String(data.get("method") || parentMethod), date: "Just now", color: "green" }, ...current]);
    setParentPaymentComplete(true);
    notify("Payment recorded and receipt generated");
  }

  const teacherModules = [
    { title: "Todays schedule", detail: "08:00  Grade 8 Mathematics  Room B204", action: "View full timetable" },
    { title: "My attendance", detail: "Clocked in at 07:42  Present 18 days  1 leave", action: "View attendance" },
    { title: "Assigned classes", detail: "Grade 8 Blue  Grade 9 Red  64 students", action: "Manage classes" },
    { title: "Gradebook", detail: "12 submissions awaiting marks  3 assessments open", action: "Enter marks" },
    { title: "Homework", detail: "2 active assignments  87% submitted", action: "Review submissions" },
    { title: "Resources", detail: "18 lesson notes and study materials shared", action: "Share resource" },
  ];

  const studentModules = [
    { title: "Todays schedule", detail: "08:00  Mathematics  Room B204  Ms. Njeri", action: "Open timetable" },
    { title: "Assignments", detail: "3 due this week  1 submission awaiting review", action: "View homework" },
    { title: "Exams & gradebook", detail: "GPA 3.62  Mid-term exam October 7", action: "View results" },
    { title: "Attendance", detail: "94.6% this term  18 present  1 absent", action: "View attendance" },
    { title: "Digital library", detail: "2 books borrowed  1 online resource saved", action: "Search library" },
    { title: "Messages", detail: "2 unread notices from school and teachers", action: "Open inbox" },
  ];

  function launchLiveClass(role: "teacher" | "student") {
    setLiveClassStarted(true);
    notify(role === "teacher" ? "Live classroom created and ready to launch" : "Secure classroom launch opened");
  }

  const studentSectionContent: Record<string, { title: string; description: string; items: string[] }> = {
    Assignments: { title: "Assignments & homework", description: "Track deadlines, download resources, and submit coursework.", items: ["Science lab report  Due tomorrow  Not submitted", "Mathematics worksheet  Due Sep 27  Not submitted", "English reading notes  Submitted  Awaiting feedback"] },
    "Exams & gradebook": { title: "Exams & gradebook", description: "View published marks and download official academic reports.", items: ["Mid-term examinations  October 714", "Mathematics  88%  Published", "Download Term 2 report card"] },
    Attendance: { title: "Attendance records", description: "Review daily attendance and semester progress.", items: ["Current attendance  94.6%", "Present  18 days", "Late  1 day  Absent  1 day"] },
    Timetable: { title: "Timetable matrix", description: "Your weekly subjects, venues, and teachers.", items: ["08:00 Mathematics  Room B204  Ms. Njeri", "09:00 Biology  Lab 2  Mr. Kiptoo", "11:00 English Literature  Room A106  Ms. Akinyi"] },
    "Digital library": { title: "Digital library", description: "Search books, track loans, and access study resources.", items: ["Introduction to Biology  Due October 2", "World History Atlas  Due October 9", "4,820 digital resources available"] },
    Logistics: { title: "Logistics & boarding", description: "Your transport route and boarding information.", items: ["Route 4  Pickup 07:15  Main Gate", "Bus 18  Driver: Mr. Okafor", "Hostel: Block B  Room 204  Bed 2"] },
    Messages: { title: "Messages & announcements", description: "School notices and teacher feedback.", items: ["Mid-term exam notice  Published today", "Science teacher feedback  1 new message", "Founders Day holiday  October 21"] },
  };

  function generateCredential() {
    if (!isAdministrator) {
      notify("Only an administrator can generate student credentials");
      return;
    }
    const password = `Anthony-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const data = document.querySelector<HTMLFormElement>("#student-credential-form");
    const email = data ? String(new FormData(data).get("email") || "parent@example.com") : "parent@example.com";
    setGeneratedCredential({ username: email, password });
  }

  const filteredPayments = useMemo(
    () => payments.filter((payment) => `${payment.name} ${payment.id} ${payment.className}`.toLowerCase().includes(query.toLowerCase())),
    [payments, query],
  );

  const moduleRows: Record<string, { title: string; description: string; rows: string[] }> = {
    Students: { title: "Student Information System", description: "Searchable 360 student records with academic, attendance, fee, and contact data.", rows: ["642 enrolled students  96% profiles complete", "Average GPA 3.42  79.2% fee collection", "Health, guardian, emergency, and attendance data secured"] },
    "Faculty & Staff": { title: "Faculty & Staff", description: "Directory, departments, experience, attendance, contacts, and salary metrics.", rows: ["52 active staff  38 teaching faculty", "94.1% staff attendance this term", "4 leave requests awaiting approval"] },
    "Classes & Subjects": { title: "Classes & Subjects", description: "Map curriculum, sections, subjects, and teaching assignments.", rows: ["24 sections  38 subjects", "52 teacher assignments", "Term 2 curriculum published"] },
    "Attendance Tracker": { title: "Attendance Tracker", description: "Mark Present, Late, or Absent by grade, section, and date.", rows: ["94.6% attendance today", "21 absences  3 late arrivals", "Cumulative attendance updates live"] },
    "Fee & Billing": { title: "Fee & Billing", description: "Central ledger for invoices, collections, outstanding dues, and exports.", rows: ["$48,290 collected this month", "$12,680 outstanding", "86 invoices need attention"] },
    "Exams & Gradebook": { title: "Exams & Gradebook", description: "Enter marks, calculate GPA, and generate academic report cards.", rows: ["18 assessments scheduled", "2 report cards pending", "Gradebook averages calculated automatically"] },
    "Hostel Residency": { title: "Hostel Residency", description: "Track beds, occupancy, vacancies, and room assignments.", rows: ["240 total beds  198 occupied", "42 vacant beds", "6 room transfers awaiting approval"] },
    "Assignments & HW": { title: "Assignments & Homework", description: "Publish assignments, deadlines, submissions, and teacher feedback.", rows: ["34 active assignments", "87% submissions on time", "12 items need grading"] },
    "Timetable Matrix": { title: "Timetable Matrix", description: "View and manage class, teacher, room, and examination schedules.", rows: ["24 class timetables published", "No room conflicts detected", "Next schedule review: October 1"] },
    "Digital Library": { title: "Digital Library", description: "Manage books, lending, returns, and searchable digital resources.", rows: ["4,820 resources catalogued", "126 books currently on loan", "18 overdue returns"] },
    "Transport & Fleet": { title: "Transport & Fleet", description: "Manage routes, vehicles, drivers, and student transport assignments.", rows: ["12 active routes", "18 vehicles  100% inspections current", "9 students awaiting route assignment"] },
    "Inventory & Procurement": { title: "Inventory & Procurement", description: "Track school assets, stock levels, suppliers, and purchase orders across campus.", rows: ["1,284 assets tracked  $284,600 book value", "Stationery stock at 18%  reorder threshold reached", "3 purchase orders awaiting approval"] },
    "Campus Security": { title: "Campus Security & Visitors", description: "Run the visitor register, temporary badges, restricted-list checks, and gate activity.", rows: ["42 visitors checked in today  100% badge scans", "2 visitors awaiting host confirmation", "Restricted-list screening active at all gates"] },
    "Clinic & Health": { title: "Clinic & Health", description: "Protect sensitive student health records, allergies, medication, and vaccination history.", rows: ["96 health profiles reviewed this term", "14 allergy alerts shared with authorized staff", "Medication event notifications ready for guardians"] },
    "Alumni Portal": { title: "Alumni Portal", description: "Connect graduates for networking, reunions, job opportunities, and school giving.", rows: ["3,842 alumni profiles  68% contactable", "Founders Day reunion RSVP is open", "$24,500 pledged through the giving campaign"] },
    "Predictive Analytics": { title: "Predictive Student Analytics", description: "Combine attendance, assessment, and engagement signals to identify students who may need support.", rows: ["18 students flagged for counselor review", "Attendance decline is the leading signal this week", "All risk flags require human review before outreach"] },
    "Admissions & Enrollment": { title: "Admissions & Enrollment", description: "Review applications, collect documents, and prepare merit lists for the next intake.", rows: ["84 applications received for 2027", "61 application files complete", "Merit list review scheduled for October 12"] },
    Payroll: { title: "Payroll & Leave", description: "Coordinate staff attendance, leave approvals, deductions, and salary processing.", rows: ["52 staff payroll profiles active", "4 leave requests awaiting approval", "September payroll preview is ready"] },
    "Direct Messaging": { title: "Direct Messaging", description: "Securely communicate with families, staff, and student groups.", rows: ["6 announcements published", "42 unread parent messages", "2 broadcasts scheduled"] },
    "System Settings": { title: "System Settings", description: "Configure institution details, roles, billing, and integrations.", rows: ["Multi-role access controls enabled", "Audit logging enabled", "PostgreSQL connection ready"] },
  };

  if (!authenticated) {
    return <main className={styles.loginPage}><div className={styles.loginCard}><div className={styles.brand}><span className={styles.brandMark}></span><span>Orangi School</span></div><p className={styles.loginEyebrow}>SCHOOL MANAGEMENT SYSTEM</p><h1>Sign in to your account</h1><p className={styles.loginIntro}>Use the same portal as staff, teacher, parent, or student.</p><form onSubmit={signIn} className={styles.loginForm}><label>Account type<select name="role" defaultValue="staff"><option value="staff">Staff / finance administrator</option><option value="teacher">Teacher / educator</option><option value="parent">Parent / guardian</option><option value="student">Student</option></select></label><label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label><label>Password<input name="password" type="password" placeholder="Enter your password" required /></label>{loginError && <p className={styles.loginError}>{loginError}</p>}<button className={styles.primaryButton} type="submit">Sign in</button></form><div className={styles.demoAccounts}><strong>Demo accounts</strong><small>Admin: anthony@gmail.com  12345678</small><small>Teacher: teacher@anthony.school  teacher123</small><small>Parent: parent@anthony.school  parent123</small><small>Student: student@anthony.school  student123</small></div></div></main>;
  }

  function recordPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("student") || "New student");
    const amount = Number(data.get("amount") || 0);
    const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    setPayments((current) => [{ id: `INV-${1050 + current.length}`, initials, name, className: "New payment", amount, method: String(data.get("method") || "Cash"), date: "Just now", color: "green" }, ...current]);
    setShowPayment(false);
    notify("Payment recorded successfully");
  }

  function renderWorkspace() {
    if (activeNav === "Overview") return null;
    if (activeNav === "Students" && isAdministrator) {
      const visibleStudents = demoStudents.filter((student) => `${student.id} ${student.name} ${student.className} ${student.guardian}`.toLowerCase().includes(studentSearch.toLowerCase()));
      return <section className={styles.workspacePanel}>
        <div className={styles.studentDirectoryHeader}><div><h3>Demo student directory</h3><p>Eight realistic student records are loaded for exploring profiles, attendance, GPA, and fee workflows.</p></div><button className={styles.primaryButton} onClick={() => setShowStudentCredential(true)}><span>+</span> Generate credentials</button></div>
        <div className={styles.studentDirectoryTools}><input aria-label="Search demo students" placeholder="Search by student, ID, class, or guardian..." value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} /><span>{visibleStudents.length} of {demoStudents.length} demo students</span></div>
        <div className={styles.demoStudentTable}><div className={styles.demoStudentHead}><span>STUDENT</span><span>CLASS</span><span>GPA</span><span>ATTENDANCE</span><span>FEES</span><span /></div>
          {visibleStudents.map((student) => <div className={styles.demoStudentRow} key={student.id}><div className={styles.studentCell}><span className={`${styles.avatar} ${styles[student.color]}`}>{student.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{student.name}</strong><small>{student.id}  Guardian: {student.guardian}</small></div></div><span>{student.className}</span><strong>{student.gpa}</strong><span>{student.attendance}</span><span className={`${styles.feePill} ${styles[`fee${student.feeStatus}`]}`}>{student.feeStatus}</span><button className={styles.rowMore} onClick={() => notify(`${student.name}'s 360 profile opened`)} aria-label={`Open ${student.name} profile`}></button></div>)}
          {visibleStudents.length === 0 && <div className={styles.empty}>No demo students match your search.</div>}
        </div>
      </section>;
    }
    const content: Record<string, { title: string; description: string; rows: string[] }> = {
      ...moduleRows,
      Payments: { title: "Payment register", description: "Every payment is searchable and ready for receipt actions.", rows: [`${payments.length} payments loaded`, "4 payment methods in use", "Latest payment recorded just now"] },
      Invoices: { title: "Invoice register", description: "Track issued, paid, and overdue fee invoices.", rows: ["642 invoices issued this term", "79.2% fully paid", "86 invoices need attention"] },
      "Fee structure": { title: "Fee structure", description: "Configure the fees used to create student invoices.", rows: ["Tuition  Term 2  $1,850", "Transport  Term 2  $420", "Lunch programme  Term 2  $260"] },
      Academics: { title: "Academic management", description: "Organize classes, subjects, timetables, and learning progress.", rows: ["24 active classes across Grades 112", "38 subjects and 52 assigned teachers", "Term 2 timetable published"] },
      Attendance: { title: "Attendance register", description: "Monitor daily attendance and follow up absences.", rows: ["94.6% attendance today", "21 students absent", "3 late arrivals need review"] },
      Exams: { title: "Examinations", description: "Manage assessments, marks, report cards, and academic calendars.", rows: ["Mid-term exams begin October 7", "18 assessments scheduled", "Report cards pending for 2 classes"] },
      Staff: { title: "Staff directory", description: "Manage teachers, administrators, and staff assignments.", rows: ["52 active staff members", "38 teachers assigned to classes", "4 leave requests awaiting approval"] },
      Communication: { title: "School communication", description: "Keep staff and families informed from one place.", rows: ["6 announcements published this term", "642 parent contacts available", "2 messages awaiting delivery"] },
      Reports: { title: "Financial reports", description: "Use these summaries to make quick decisions.", rows: ["Collection rate is up 3.6% month over month", "$12,680 remains outstanding", "8 priority reminder accounts"] },
      Settings: { title: "Workspace settings", description: "Control your school profile and dashboard preferences.", rows: ["School: Orangi School", "Currency: USD", `Theme: ${darkMode ? "Dark" : "Light"}`] },
    };
    const panel = content[activeNav];
    if (!panel) return null;
    return <section className={styles.workspacePanel}><div><h3>{panel.title}</h3><p>{panel.description}</p></div><div className={styles.workspaceRows}>{panel.rows.map((row) => <div key={row}><span className={styles.workspaceCheck}></span><span>{row}</span></div>)}</div><button className={styles.primaryButton} onClick={() => activeNav === "Payments" || activeNav === "Fee & Billing" ? setShowPayment(true) : activeNav === "Students" && isAdministrator ? setShowStudentCredential(true) : notify(activeNav === "Students" && !isAdministrator ? "Administrator access is required to generate credentials" : `${activeNav} workspace opened`)}>{activeNav === "Students" ? "Add student" : activeNav === "Payments" || activeNav === "Fee & Billing" ? "Record payment" : activeNav === "Attendance Tracker" ? "Take attendance" : activeNav === "Exams & Gradebook" ? "Create assessment" : activeNav === "Direct Messaging" ? "New message" : "Open workspace"} <span></span></button></section>;
  }

  return (
    <div className={`${styles.appShell} ${parentMode ? styles.parentShell : ""} ${accountRole === "teacher" ? styles.teacherShell : ""} ${accountRole === "student" ? styles.studentShell : ""}`}>
      {accountRole === "student" && <main className={styles.studentMain}>
        <header className={styles.studentHeader}><div><div className={styles.brand}><span className={styles.brandMark}></span><span>Orangi School</span></div><p className={styles.eyebrow}>STUDENT PORTAL  SEPTEMBER 23, 2026</p><h1>Good morning, Alex</h1></div><div className={styles.parentHeaderRight}><button className={styles.themeButton} onClick={() => toggleTheme()} aria-label="Toggle dark mode">{darkMode ? "" : ""}</button><button className={styles.parentAvatar} onClick={() => setShowProfile(true)}>AM</button><button className={styles.switchButton} onClick={signOut}>Sign out</button></div></header>
        <div className={styles.studentContent}><section className={styles.liveClassBanner}><div><span className={styles.liveDot}>?</span><strong>Live classrooms</strong><small>{liveClassStarted ? "Secure room ready  SSO verified" : "Next live class: Mathematics  08:00  Room B204"}</small></div><button className={styles.liveButton} onClick={() => launchLiveClass("student")}>{liveClassStarted ? "Join classroom" : "View live class"} ?</button></section><nav className={styles.studentNav}>{["Dashboard", "Assignments", "Exams & gradebook", "Attendance", "Timetable", "Digital library", "Logistics", "Messages"].map((item) => <button className={activeNav === item ? styles.parentNavActive : ""} key={item} onClick={() => { setActiveNav(item); notify(`${item} opened`); }}>{item}</button>)}</nav><section className={styles.studentIntro}><div><p className={styles.eyebrow}>GRADE 10  BLUE  STUDENT ID ST-1048</p><h2>Brian Otieno&apos;s learning space</h2><p>Stay on top of your classes, deadlines, results, and campus life.</p></div><button className={styles.aiButton} onClick={() => setShowStudentAi(true)}> Ask EduFlow AI</button></section>{activeNav !== "Dashboard" && studentSectionContent[activeNav] && <section className={styles.studentFeature}><h3>{studentSectionContent[activeNav].title}</h3><p>{studentSectionContent[activeNav].description}</p><div>{studentSectionContent[activeNav].items.map((item) => <button key={item} onClick={() => notify(`${item} opened`)}><span></span>{item}<b></b></button>)}</div></section>}<section className={styles.studentStats}><article><span>Current GPA</span><strong>3.62</strong><small> 0.18 this term</small></article><article><span>Attendance</span><strong>94.6%</strong><small>18 present  1 absent</small></article><article><span>Deadlines</span><strong>3</strong><small>Next due tomorrow</small></article><article><span>Fee status</span><strong className={styles.goodText}>Clear</strong><small>Read-only student view</small></article></section><section className={styles.studentGrid}>{studentModules.map((module) => <article className={styles.studentCard} key={module.title}><div className={styles.teacherCardIcon}></div><div><h3>{module.title}</h3><p>{module.detail}</p><button onClick={() => notify(`${module.title}: ${module.action}`)}>{module.action} </button></div></article>)}</section><section className={styles.studentBottom}><article className={styles.teacherPanel}><h3>Upcoming timetable</h3><div className={styles.studentSchedule}><span>08:00</span><strong>Mathematics</strong><small>Room B204  Ms. Njeri</small></div><div className={styles.studentSchedule}><span>09:00</span><strong>Biology</strong><small>Lab 2  Mr. Kiptoo</small></div><div className={styles.studentSchedule}><span>11:00</span><strong>English Literature</strong><small>Room A106  Ms. Akinyi</small></div></article><article className={styles.teacherPanel}><h3>Upcoming deadlines</h3><div className={styles.deadline}><strong>Science lab report</strong><small>Due tomorrow  Submit online</small></div><div className={styles.deadline}><strong>Mathematics worksheet</strong><small>Due Sep 27  Not submitted</small></div><button className={styles.primaryButton} onClick={() => notify("Assignment submission area opened")}>Submit homework </button></article></section></div>
      </main>}
      {accountRole === "teacher" && <main className={styles.teacherMain}>
        <header className={styles.teacherHeader}><div><div className={styles.brand}><span className={styles.brandMark}></span><span>Orangi School</span></div><p className={styles.eyebrow}>TEACHER PORTAL  WEDNESDAY, SEPTEMBER 23, 2026</p><h1>Good morning, Ms. Njeri</h1></div><div className={styles.parentHeaderRight}><button className={styles.themeButton} onClick={() => toggleTheme()} aria-label="Toggle dark mode">{darkMode ? "" : ""}</button><button className={styles.parentAvatar} onClick={() => setShowProfile(true)}>MC</button><button className={styles.switchButton} onClick={signOut}>Sign out</button></div></header>
        <div className={styles.teacherContent}><section className={styles.liveClassBanner}><div><span className={styles.liveDot}>?</span><strong>Live teaching room</strong><small>{liveClassStarted ? "Room created  Meeting ID: ANTHONY-8B204  Webhook tracking active" : "Create a secure room for your next Grade 8 class"}</small></div><button className={styles.liveButton} onClick={() => launchLiveClass("teacher")}>{liveClassStarted ? "Start classroom" : "Create live class"} ?</button></section><section className={styles.teacherIntro}><div><p className={styles.eyebrow}>YOUR TEACHING DAY</p><h2>Teaching overview</h2><p>Manage classes, attendance, assessments, and learning resources.</p></div><div className={styles.teacherClock}><strong>07:42</strong><small>Clocked in today</small><button onClick={() => notify("Clock-out recorded for 15:30")}>Clock out</button></div></section><section className={styles.teacherStats}><article><span>Classes today</span><strong>4</strong><small>Next: Grade 8  Room B204</small></article><article><span>Students</span><strong>64</strong><small>Across 2 assigned classes</small></article><article><span>Attendance</span><strong>96.2%</strong><small>Personal term rate</small></article><article><span>To review</span><strong>15</strong><small>Marks and submissions</small></article></section><section className={styles.teacherGrid}>{teacherModules.map((module) => <article className={styles.teacherCard} key={module.title}><div className={styles.teacherCardIcon}></div><div><h3>{module.title}</h3><p>{module.detail}</p><button onClick={() => notify(`${module.title}: ${module.action}`)}>{module.action} </button></div></article>)}</section><section className={styles.teacherBottom}><article className={styles.teacherPanel}><h3>Attendance tracker</h3><p>Take today&apos;s attendance for your next class.</p><div className={styles.classSelect}><strong>Grade 8  Blue</strong><span>Mathematics  Room B204</span><button onClick={() => navigate("Attendance Tracker")}>Open register </button></div></article><article className={styles.teacherPanel}><h3>Quick communication</h3><p>Send an update to students, parents, or school leadership.</p><button className={styles.primaryButton} onClick={() => notify("New message composer opened")}>Compose message </button></article></section></div>
      </main>}
      {parentMode ? (
        <main className={styles.parentMain}>
          <header className={styles.parentHeader}>
            <div className={styles.brand}><span className={styles.brandMark}></span><span>Orangi School</span></div>
            <div className={styles.parentHeaderRight}><span className={styles.parentWelcome}>Good morning, {accountRole === "parent" ? "Sarah" : "Jordan"}</span><button className={styles.themeButton} onClick={() => toggleTheme()} aria-label="Toggle dark mode">{darkMode ? "" : ""}</button><button className={styles.parentAvatar} onClick={() => setShowProfile(true)} aria-label="Open profile">SM</button><button className={styles.switchButton} onClick={signOut}>Sign out</button></div>
          </header>
          <div className={styles.parentContent}>
            <nav className={styles.parentNav}>{["Overview", "Academics", "Attendance", "Results", "Fees & payments", "Announcements", "Calendar & events", "Guardian settings"].map((item) => <button className={parentSection === item ? styles.parentNavActive : ""} key={item} onClick={() => setParentSection(item)}>{item}</button>)}</nav>
            <section className={styles.parentIntro}><div><p className={styles.eyebrow}>PARENT PORTAL  SEPTEMBER 23, 2026</p><h1>Welcome back, Sarah</h1><p>View your children&apos;s fees, balances, progress, and school updates.</p></div><button className={styles.primaryButton} onClick={() => openParentPayment()}><span></span> Pay school fees</button></section>
            <section className={styles.childSwitcher}><span className={styles.switchLabel}>VIEWING CHILD</span>{[{name:"Wanjiku Kamau",grade:"Grade 8  Blue",initials:"MM"},{name:"Ian Mwangi",grade:"Grade 5  Green",initials:"EM"}].map((child) => <button key={child.name} className={selectedChild === child.name ? styles.childSelected : ""} onClick={() => { setSelectedChild(child.name); notify(`${child.name}'s profile selected`); }}><span className={styles.avatar}>{child.initials}</span><span><strong>{child.name}</strong><small>{child.grade}</small></span></button>)}</section>
            {parentSection !== "Overview" && <section className={styles.parentFeaturePanel}><div><h2>{parentSection}</h2><p>{selectedChild}&apos;s {parentSection.toLowerCase()} at a glance.</p></div><div className={styles.parentFeatureGrid}>{(parentSection === "Academics" ? ["Overall GPA  3.62", "Homework completion  91%", "Assignments submitted  18 / 20"] : parentSection === "Results" ? ["Mathematics  88%", "Science  92%", "Download Term 2 report card"] : parentSection === "Attendance" ? ["September attendance  94%", "Present  18 days", "Absent  1 day  Late  1"] : parentSection === "Fees & payments" ? ["Balance due  $1,850", "Last payment  Sep 18", "UPI  Card  Net banking supported"] : parentSection === "Announcements" ? ["Mid-term exams begin October 7", "School closes for Founders Day  Oct 21", "New parent broadcast  2 hours ago"] : parentSection === "Calendar & events" ? ["October 7  Mid-term exams", "October 21  Founders Day", "Photo gallery  Sports day 2026"] : ["Grace Wambui  Parent", "Phone  +1 555 010 2040", "Email  parent@anthony.school"]).map((item) => <button key={item} onClick={() => notify(`${item} opened`)}><span className={styles.workspaceCheck}></span>{item}<b></b></button>)}</div>{parentSection === "Fees & payments" && <button className={styles.primaryButton} onClick={() => openParentPayment(selectedChild, selectedChild === "Wanjiku Kamau" ? 1850 : 1200)}>Pay outstanding balance </button>}{parentSection === "Results" && <button className={styles.primaryButton} onClick={() => notify("Report card download started")}>Download report card </button>}{parentSection === "Attendance" && <div className={styles.attendanceCalendar}>{["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"].map((day,index) => <span className={index === 5 ? styles.absentDay : index === 11 ? styles.lateDay : styles.presentDay} key={day}>{day}</span>)}</div>}</section>}
            <section className={styles.parentStats}><article><small>Total balance</small><strong>$3,050</strong><span className={styles.warning}>Due this term</span></article><article><small>Next payment due</small><strong>Oct 15</strong><span>18 days remaining</span></article><article><small>Payment status</small><strong className={styles.goodText}>Up to date</strong><span>Last paid Sep 18</span></article></section>
            <section className={styles.parentGrid}>
              <article className={styles.parentPanel}><div className={styles.parentPanelHeader}><div><h2>My children</h2><p>Balances and fee status by student</p></div><button onClick={() => notify("Student details opened")}>View details </button></div>{[{name:"Wanjiku Kamau",grade:"Grade 8  Blue",initials:"MM",balance:1850,color:"purple"},{name:"Ian Mwangi",grade:"Grade 5  Green",initials:"EM",balance:1200,color:"blue"}].map((student) => <div className={styles.childRow} key={student.name}><span className={`${styles.avatar} ${styles[student.color]}`}>{student.initials}</span><div><strong>{student.name}</strong><small>{student.grade}</small></div><div className={styles.childBalance}><strong>{money(student.balance)}</strong><small>Outstanding</small></div><button onClick={() => openParentPayment(student.name, student.balance)}>Pay now</button></div>)}</article>
              <article className={styles.parentPanel}><div className={styles.parentPanelHeader}><div><h2>Fee structure</h2><p>Current term charges</p></div><button onClick={() => notify("Fee structure downloaded")}>Download</button></div><div className={styles.feeRow}><span>Tuition fee</span><strong>$1,850</strong></div><div className={styles.feeRow}><span>Transport</span><strong>$420</strong></div><div className={styles.feeRow}><span>Lunch programme</span><strong>$260</strong></div><div className={styles.feeTotal}><span>Total per student</span><strong>$2,530</strong></div></article>
            </section>
            <section className={styles.parentPanel}><div className={styles.parentPanelHeader}><div><h2>Payment history</h2><p>Your recent receipts</p></div><button onClick={() => notify("All receipts opened")}>View all </button></div>{payments.slice(0, 3).map((payment) => <div className={styles.receiptRow} key={payment.id}><div><strong>{payment.id}</strong><small>{payment.name}  {payment.date}</small></div><strong>{money(payment.amount)}</strong><button onClick={() => notify(`Receipt ${payment.id} downloaded`)}>Download receipt</button></div>)}</section>
          </div>
          {showParentPayment && <div className={styles.modalBackdrop} onClick={() => setShowParentPayment(false)}>{parentPaymentComplete ? <div className={`${styles.modal} ${styles.paymentSuccess}`} onClick={(event) => event.stopPropagation()}><div className={styles.confetti}>  </div><h3>Payment submitted!</h3><p>Your payment was recorded successfully.</p><strong>Receipt FF-2026-0131</strong><div className={styles.receiptSummary}><span>{parentStudent}</span><b>{money(Number(parentAmount))}</b><small>{parentMethod}  September 23, 2026</small></div><button className={styles.primaryButton} onClick={() => { notify("Digital receipt downloaded"); setShowParentPayment(false); }}>Download digital receipt</button><button className={styles.cancelButton} onClick={() => setShowParentPayment(false)}>Close</button></div> : <form className={`${styles.modal} ${styles.paymentModal}`} onSubmit={submitParentPayment} onClick={(event) => event.stopPropagation()}><div className={styles.modalHeader}><div><h3>Pay school fees</h3><p>Fast, secure settlement for your child.</p></div><button type="button" onClick={() => setShowParentPayment(false)}></button></div><div className={styles.paymentColumns}><div className={styles.cardScene}><div className={`${styles.digitalCard} ${cardFlipped ? styles.isFlipped : ""}`}><div className={`${styles.cardFace} ${styles.cardFront}`}><div className={styles.cardBrand}>ANTHONY <span>VISA</span></div><strong className={styles.cardNumber}>{cardNumber || "   "}</strong><div className={styles.cardMeta}><span>{cardName || "CARD HOLDER"}<small>Card holder</small></span><span>{cardExpiry || "MM/YY"}<small>Expires</small></span></div></div><div className={`${styles.cardFace} ${styles.cardBack}`}><div className={styles.cardStripe} /><div className={styles.cardCvc}>{cardCvc || ""}</div><small>Authorized signature</small></div></div><div className={styles.cardAmount}>{parentStudent}<strong>{money(Number(parentAmount || 0))}</strong></div></div><div className={styles.paymentForm}><label>Student<select name="student" value={parentStudent} onChange={(event) => { setParentStudent(event.target.value); setParentAmount(event.target.value === "Wanjiku Kamau" ? "1850" : "1200"); }}><option value="Wanjiku Kamau">Wanjiku Kamau  $1,850 outstanding</option><option value="Ian Mwangi">Ian Mwangi  $1,200 outstanding</option></select></label><label>Amount<input name="amount" type="number" min="1" max={parentStudent === "Wanjiku Kamau" ? 1850 : 1200} value={parentAmount} onChange={(event) => setParentAmount(event.target.value)} required /><button type="button" className={styles.fillBalance} onClick={() => setParentAmount(parentStudent === "Wanjiku Kamau" ? "1850" : "1200")}>Fill full balance</button></label><label>Payment method<select name="method" value={parentMethod} onChange={(event) => setParentMethod(event.target.value)}><option>Card</option><option>UPI</option><option>Net banking</option><option>Bank transfer</option><option>JazzCash</option><option>EasyPaisa</option><option>Cash</option></select></label>{parentMethod === "Card" && <><label>Card number<input name="cardNumber" autoComplete="cc-number" inputMode="numeric" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} required /></label><label>Name on card<input name="cardName" autoComplete="cc-name" placeholder="Grace Wambui" value={cardName} onChange={(event) => setCardName(event.target.value)} required /></label><div className={styles.paymentFields}><label>Expiry<input name="cardExpiry" autoComplete="cc-exp" placeholder="MM/YY" value={cardExpiry} onChange={(event) => setCardExpiry(event.target.value)} required /></label><label>CVC<input name="cardCvc" autoComplete="cc-csc" inputMode="numeric" placeholder="123" value={cardCvc} onFocus={() => setCardFlipped(true)} onBlur={() => setCardFlipped(false)} onChange={(event) => setCardCvc(event.target.value)} required /></label></div></>}<div className={styles.paymentDue}>Remaining after payment <strong>{money(Math.max(0, (parentStudent === "Wanjiku Kamau" ? 1850 : 1200) - Number(parentAmount || 0)))}</strong></div><div className={styles.modalActions}><button type="button" className={styles.cancelButton} onClick={() => setShowParentPayment(false)}>Cancel</button><button className={styles.primaryButton}>Pay {money(Number(parentAmount || 0))}</button></div></div></div></form>}</div>}
        </main>
      ) : null}
      <aside className={styles.sidebar}>
        <div className={styles.brand}><span className={styles.brandMark}></span><span>Orangi School</span></div>
        <button className={styles.schoolSwitcher} onClick={() => notify("School switcher opened")}><div className={styles.schoolIcon}>SA</div><div><strong>Orangi School</strong><small>Administration</small></div><span className={styles.chevron}></span></button>
        <nav className={styles.nav}>
          <p className={styles.navLabel}>WORKSPACE</p>
          {["Overview", "Students", "Faculty & Staff", "Classes & Subjects", "Attendance Tracker", "Fee & Billing", "Exams & Gradebook", "Hostel Residency", "Assignments & HW", "Timetable Matrix", "Digital Library", "Transport & Fleet", "Direct Messaging", "System Settings"].map((item, index) => (
            <button className={`${styles.navItem} ${activeNav === item ? styles.navActive : ""}`} key={item} onClick={() => navigate(item)}>
              <span className={styles.navIcon}>{["", "", "", "", "", "$", "", "", "", "", "", "", "", ""][index]}</span>{item}
              {item === "Fee & Billing" && <span className={styles.navBadge}>86</span>}
            </button>
          ))}
          <p className={`${styles.navLabel} ${styles.navLabelSpaced}`}>CAMPUS OPERATIONS</p>
          {["Inventory & Procurement", "Campus Security", "Clinic & Health", "Alumni Portal", "Predictive Analytics", "Admissions & Enrollment", "Payroll"].map((item) => (
            <button className={`${styles.navItem} ${activeNav === item ? styles.navActive : ""}`} key={item} onClick={() => navigate(item)}>
              <span className={styles.navIcon}></span>{item}
            </button>
          ))}
          <p className={`${styles.navLabel} ${styles.navLabelSpaced}`}>INSIGHTS</p>
          {["Reports", "Settings"].map((item, index) => <button className={`${styles.navItem} ${activeNav === item ? styles.navActive : ""}`} key={item} onClick={() => navigate(item)}><span className={styles.navIcon}>{index === 0 ? "" : ""}</span>{item}</button>)}
        </nav>
        <div className={styles.sidebarBottom}><button className={styles.helpCard} onClick={() => notify("Help center opened")}><span>?</span><div><strong>Need help?</strong><small>Visit the help center</small></div><b></b></button><button className={styles.user} onClick={signOut}><div className={styles.userAvatar}>JM</div><div><strong>Peter Kamau</strong><small>Sign out</small></div><span className={styles.more}></span></button></div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}><div><p className={styles.eyebrow}>WEDNESDAY, SEPTEMBER 23, 2026  {accountRole === "staff" ? "ADMINISTRATOR" : "PARENT"}</p><h1>Good morning, Jordan <span></span></h1></div><div className={styles.headerActions}><div className={styles.globalSearch}><span></span><input aria-label="Universal search" placeholder="Search students, classes, books, invoices..." value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") notify(globalSearch ? `Searching for "${globalSearch}"` : "Enter a search term"); }} /></div><button className={`${styles.iconButton} ${showReminders ? styles.iconActive : ""}`} onClick={() => setShowReminders((current) => !current)} aria-label="Show reminders"><i /></button><button className={styles.themeButton} onClick={() => toggleTheme()} aria-label="Toggle dark mode">{darkMode ? "" : ""}</button><button className={styles.profileAvatar} onClick={() => setShowProfile(true)} aria-label="Open profile">JM</button></div></header>
        <div className={styles.content}>
          <section className={styles.welcomeRow}><div><h2>{activeNav}</h2><p>{activeNav === "Overview" ? "Here&apos;s what&apos;s happening with your school finances." : `${activeNav} tools are ready to use.`}</p></div><button className={styles.primaryButton} onClick={() => setShowPayment(true)}><span></span> Record payment</button></section>
          <section className={styles.statsGrid}>
            <article className={`${styles.statCard} ${styles.statHighlight}`}><div className={styles.statTop}><span>Total collected</span><span className={styles.statIcon}></span></div><strong>$48,290</strong><div className={styles.statFoot}><span className={styles.positive}> 12.8%</span><span>vs last month</span></div><div className={styles.sparkline}><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></article>
            <article className={styles.statCard}><div className={styles.statTop}><span>Outstanding</span><span className={`${styles.statIcon} ${styles.orangeIcon}`}></span></div><strong>$12,680</strong><div className={styles.statFoot}><span className={styles.warning}> 4.2%</span><span>vs last month</span></div><div className={`${styles.sparkline} ${styles.orangeSpark}`}><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div></article>
            <article className={styles.statCard}><div className={styles.statTop}><span>Collection rate</span><span className={`${styles.statIcon} ${styles.blueIcon}`}></span></div><strong>79.2%</strong><div className={styles.statFoot}><span className={styles.positive}> 3.6%</span><span>vs last month</span></div><div className={`${styles.progressTrack}`}><div className={styles.progressValue} /></div></article>
            <article className={styles.statCard}><div className={styles.statTop}><span>Active students</span><span className={`${styles.statIcon} ${styles.purpleIcon}`}></span></div><strong>642</strong><div className={styles.statFoot}><span className={styles.positive}> 18</span><span>this term</span></div><div className={styles.miniAvatars}><span>AM</span><span>JK</span><span>SL</span><span>+639</span></div></article>
          </section>
          <section className={styles.eduMetrics}><article><span>Enrollment</span><strong>642</strong><small> 18 this term</small></article><article><span>Faculty</span><strong>52</strong><small>38 teachers  14 admin</small></article><article><span>Daily attendance</span><strong>94.6%</strong><small> 1.8% this week</small></article><article><span>EduFlow AI</span><strong>Ready</strong><small>Ask about school data</small><button onClick={() => notify("EduFlow AI is ready to summarize your school data")}>Ask AI </button></article></section>
          <section className={styles.analyticsGrid}><article className={styles.panel}><div className={styles.panelHeader}><div><h3>Attendance weekly analysis</h3><p>Present, late, and absent students</p></div><span className={styles.chartTag}>This week</span></div><div className={styles.analyticsBars}>{[82,91,88,95,93,89,96].map((height,index)=><div key={index}><span style={{height:`${height}%`}} /><small>{["M","T","W","T","F","S","S"][index]}</small></div>)}</div></article><article className={styles.panel}><div className={styles.panelHeader}><div><h3>Enrollment by grade</h3><p>642 total students</p></div></div><div className={styles.donutWrap}><div className={styles.donut}><strong>642</strong><small>students</small></div><div className={styles.donutLegend}><span><i />Primary  214</span><span><i />Middle  238</span><span><i />Senior  190</span></div></div></article></section>
          <section className={styles.statusStrip}>
            <div className={styles.statusSummary}><span className={styles.statusPulse} /> <div><strong>Financial status: healthy</strong><small>79.2% collected  $12,680 outstanding  8 accounts need follow-up</small></div></div>
            <div className={styles.statusActions}><button onClick={() => navigate("Students")}>Manage students <span></span></button><button onClick={() => navigate("Invoices")}>Review fee records <span></span></button><button className={styles.reminderButton} onClick={() => { setShowReminders(true); notify("Reminder list opened"); }}>Send reminders <span></span></button></div>
          </section>
          {showReminders && <section className={styles.reminderPanel}><div><strong>8 students need a payment reminder</strong><small>Most urgent: Sharon Akinyi  $1,850 overdue by 12 days</small></div><button onClick={() => { notify("Reminder queue prepared"); setShowReminders(false); }}>Prepare reminder queue</button><button className={styles.closeReminder} onClick={() => setShowReminders(false)}></button></section>}
          {renderWorkspace()}
          <section className={styles.gridLayout}>
            <article className={`${styles.panel} ${styles.paymentsPanel}`}><div className={styles.panelHeader}><div><h3>Recent payments</h3><p>Latest transactions across the school</p></div><button className={styles.textButton} onClick={() => navigate("Payments")}>View all <span></span></button></div><div className={styles.toolbar}><div className={styles.search}><span></span><input aria-label="Search payments" placeholder="Search students or invoices..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><select aria-label="Payment period" className={styles.filterButton} value={paymentPeriod} onChange={(event) => { setPaymentPeriod(event.target.value); notify(`Showing ${event.target.value.toLowerCase()} payments`); }}><option>This month</option><option>Last month</option><option>This term</option><option>This year</option></select></div><div className={styles.table}><div className={styles.tableHead}><span>STUDENT</span><span>AMOUNT</span><span>METHOD</span><span>DATE</span><span /></div>{filteredPayments.map((payment) => <div className={styles.tableRow} key={payment.id}><div className={styles.studentCell}><span className={`${styles.avatar} ${styles[payment.color]}`}>{payment.initials}</span><div><strong>{payment.name}</strong><small>{payment.className}  {payment.id}</small></div></div><strong>{money(payment.amount)}</strong><span className={styles.method}>{payment.method}</span><span className={styles.date}>{payment.date}</span><button className={styles.rowMore} onClick={() => setSelectedPayment(payment.id)} aria-label={`Actions for ${payment.name}`}></button></div>)}{filteredPayments.length === 0 && <div className={styles.empty}>No payments match your search.</div>}</div></article>
            <aside className={`${styles.panel} ${styles.outstandingPanel}`}><div className={styles.panelHeader}><div><h3>Needs attention</h3><p>Outstanding balances</p></div><span className={styles.alertCount}>8</span></div><div className={styles.outstandingTotal}><strong>$12,680</strong><span>across 86 students</span></div><div className={styles.outstandingList}>{outstanding.map((item) => <button className={styles.outstandingItem} key={item.name} onClick={() => notify(`${item.name} has ${money(item.amount)} outstanding`)}><span className={`${styles.avatar} ${styles[item.color]}`}>{item.initials}</span><div><strong>{item.name}</strong><small>{item.details}</small></div><b>{money(item.amount)}</b></button>)}</div><button className={styles.outstandingButton} onClick={() => navigate("Reports")}>View outstanding report <span></span></button></aside>
          </section>
          <section className={styles.bottomGrid}><article className={`${styles.panel} ${styles.chartPanel}`}><div className={styles.panelHeader}><div><h3>Collection overview</h3><p>Monthly revenue performance</p></div><select aria-label="Chart period" className={styles.filterButton} value={chartPeriod} onChange={(event) => { setChartPeriod(event.target.value); notify(`Chart updated to ${event.target.value.toLowerCase()}`); }}><option>This year</option><option>This term</option><option>Last year</option></select></div><div className={styles.chartLegend}><span><i className={styles.legendGreen} />Collected</span><span><i className={styles.legendGray} />Outstanding</span></div><div className={styles.chart}><div className={styles.yAxis}><span>$15k</span><span>$10k</span><span>$5k</span><span>$0</span></div><div className={styles.chartArea}><div className={styles.gridLine} /><div className={styles.gridLine} /><div className={styles.gridLine} /><div className={styles.gridLine} /><div className={styles.bars}>{[55, 62, 68, 65, 73, 80, 88, 72, 78, 86, 93, 76].map((height, index) => <div className={styles.barGroup} key={index}><div className={styles.barGreen} style={{ height: `${height}%` }} /><div className={styles.barGray} style={{ height: `${100 - height + 8}%` }} /><small>{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}</small></div>)}</div></div></div></article><article className={`${styles.panel} ${styles.quickPanel}`}><div className={styles.panelHeader}><div><h3>Quick actions</h3><p>Common tasks</p></div></div><button onClick={() => setShowPayment(true)}><span className={styles.actionIcon}></span><div><strong>Record a payment</strong><small>Add a new student payment</small></div><b></b></button><button onClick={() => navigate("Invoices")}><span className={`${styles.actionIcon} ${styles.actionBlue}`}></span><div><strong>Create an invoice</strong><small>Send a fee invoice to a student</small></div><b></b></button><button onClick={() => navigate("Reports")}><span className={`${styles.actionIcon} ${styles.actionPurple}`}></span><div><strong>View reports</strong><small>Analyze school finances</small></div><b></b></button></article></section>
        </div>
      </main>
      {parentMode ? null : null}
      {showStudentAi && <div className={styles.modalBackdrop} onClick={() => setShowStudentAi(false)}><div className={styles.modal} onClick={(event) => event.stopPropagation()}><div className={styles.modalHeader}><div><h3>EduFlow AI</h3><p>Ask about your classes, assignments, or library.</p></div><button onClick={() => setShowStudentAi(false)}></button></div><div className={styles.aiSuggestions}><button onClick={() => setStudentQuestion("What is my next class?")}>Next class</button><button onClick={() => setStudentQuestion("Which books are overdue?")}>Library books</button><button onClick={() => setStudentQuestion("What assignments are due?")}>Deadlines</button></div><input className={styles.aiInput} value={studentQuestion} onChange={(event) => setStudentQuestion(event.target.value)} placeholder="Ask EduFlow AI..." /><div className={styles.aiAnswer}>{studentQuestion ? `Based on your student record: ${studentQuestion.replace("What is my next class?", "Your next class is Biology at 09:00 in Lab 2 with Mr. Kiptoo.").replace("Which books are overdue?", "No books are overdue. Introduction to Biology is due October 2.").replace("What assignments are due?", "Your Science lab report is due tomorrow and your Mathematics worksheet is due September 27.")}` : "Try asking about your next class, library books, or deadlines."}</div><button className={styles.primaryButton} onClick={() => notify("EduFlow AI response saved")}>Done</button></div></div>}
      {showPayment && <div className={styles.modalBackdrop} onClick={() => setShowPayment(false)}><form className={styles.modal} onSubmit={recordPayment} onClick={(event) => event.stopPropagation()}><div className={styles.modalHeader}><div><h3>Record a payment</h3><p>Add a transaction to the ledger.</p></div><button type="button" onClick={() => setShowPayment(false)}></button></div><label>Student name<input name="student" required placeholder="e.g. Amina Wanjiku" /></label><label>Amount (USD)<input name="amount" type="number" min="1" required placeholder="0.00" /></label><label>Payment method<select name="method" defaultValue="Cash"><option>Cash</option><option>Bank transfer</option><option>Card</option><option>Mobile money</option></select></label><div className={styles.modalActions}><button type="button" className={styles.cancelButton} onClick={() => setShowPayment(false)}>Cancel</button><button className={styles.primaryButton} type="submit">Save payment</button></div></form></div>}
      {selectedPayment && <div className={styles.modalBackdrop} onClick={() => setSelectedPayment(null)}><div className={styles.modal} onClick={(event) => event.stopPropagation()}><div className={styles.modalHeader}><div><h3>Payment actions</h3><p>{selectedPayment} is ready to manage.</p></div><button type="button" onClick={() => setSelectedPayment(null)}></button></div><button className={styles.modalActionButton} onClick={() => { notify("Receipt download started"); setSelectedPayment(null); }}>Download receipt</button><button className={styles.modalActionButton} onClick={() => { notify("Payment details opened"); setSelectedPayment(null); }}>View payment details</button><button className={styles.cancelButton} onClick={() => setSelectedPayment(null)}>Close</button></div></div>}
      {showProfile && <div className={styles.modalBackdrop} onClick={() => setShowProfile(false)}><div className={styles.modal} onClick={(event) => event.stopPropagation()}>{showProfileSettings ? <form className={styles.profileSettings} onSubmit={saveProfileSettings}><div className={styles.modalHeader}><div><h3>Customize your profile</h3><p>Personalize how your account appears across Orangi School.</p></div><button type="button" onClick={() => setShowProfileSettings(false)}></button></div><label>Display name<input value={profileDisplayName} onChange={(event) => setProfileDisplayName(event.target.value)} required /></label><label>Phone number<input type="tel" placeholder="+1 555 0100" value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} /></label><fieldset><legend>Profile color</legend><div className={styles.profileColorOptions}>{["green", "blue", "purple", "orange"].map((color) => <button type="button" key={color} className={`${styles.profileColor} ${styles[`profileColor${color}`]} ${profileAccent === color ? styles.profileColorSelected : ""}`} onClick={() => setProfileAccent(color)} aria-label={`${color} profile color`} />)}</div></fieldset><label className={styles.profileCheck}><input type="checkbox" checked={profileDigest} onChange={(event) => setProfileDigest(event.target.checked)} /> Send me a weekly account activity summary</label><div className={styles.modalActions}><button type="button" className={styles.cancelButton} onClick={() => setShowProfileSettings(false)}>Cancel</button><button className={styles.primaryButton}>Save changes</button></div></form> : <><div className={styles.profileCard}><div className={`${styles.profileLarge} ${styles[`profileLarge${profileAccent}`]}`}>{accountRole === "staff" ? "JM" : accountRole === "teacher" ? "MC" : accountRole === "student" ? "AM" : "SM"}</div><h3>{profileDisplayName || (accountRole === "staff" ? "Peter Kamau" : accountRole === "teacher" ? "Ms. Njeri" : accountRole === "student" ? "Brian Otieno" : "Grace Wambui")}</h3><p>{accountRole === "staff" ? "Finance administrator" : accountRole === "teacher" ? "Teacher / educator" : accountRole === "student" ? "Student" : "Parent / guardian"}</p></div><div className={styles.profileDetails}><div><span>Email</span><strong>{accountRole === "staff" ? "anthony@gmail.com" : accountRole === "teacher" ? "teacher@anthony.school" : accountRole === "student" ? "student@anthony.school" : "parent@anthony.school"}</strong></div><div><span>Access</span><strong>{accountRole === "staff" ? "Finance dashboard" : accountRole === "teacher" ? "Teacher portal" : accountRole === "student" ? "Student portal" : "Parent portal"}</strong></div></div><button className={styles.modalActionButton} onClick={openProfileSettings}>Customize profile</button><button className={styles.cancelButton} onClick={() => { setShowProfile(false); signOut(); }}>Sign out</button></>}</div></div>}
      {showStudentCredential && isAdministrator && <div className={styles.modalBackdrop} onClick={() => setShowStudentCredential(false)}><form id="student-credential-form" className={styles.modal} onSubmit={(event) => { event.preventDefault(); generateCredential(); }} onClick={(event) => event.stopPropagation()}><div className={styles.modalHeader}><div><h3>Add student access</h3><p>Administrator-only action  create a parent login for a new student.</p></div><button type="button" onClick={() => setShowStudentCredential(false)}></button></div><label>Student full name<input name="studentName" required placeholder="e.g. Olivia Mensah" /></label><label>Grade / class<input name="className" required placeholder="e.g. Grade 6  Blue" /></label><label>Parent email / username<input name="email" type="email" required placeholder="parent@example.com" /></label>{generatedCredential ? <div className={styles.credentialResult}><div><span>Username</span><strong>{generatedCredential.username}</strong></div><div><span>Temporary password</span><strong>{generatedCredential.password}</strong></div><small>Share these credentials securely with the parent. They can change the password after signing in.</small><button type="button" className={styles.modalActionButton} onClick={() => { navigator.clipboard?.writeText(`Username: ${generatedCredential.username}\nTemporary password: ${generatedCredential.password}`); notify("Credentials copied"); }}>Copy credentials</button></div> : <div className={styles.credentialHint}>A temporary password will be generated automatically after you save the student.</div>}<div className={styles.modalActions}>{generatedCredential ? <button type="button" className={styles.cancelButton} onClick={() => { setGeneratedCredential(null); setShowStudentCredential(false); notify("Student access created"); }}>Done</button> : <><button type="button" className={styles.cancelButton} onClick={() => setShowStudentCredential(false)}>Cancel</button><button className={styles.primaryButton}>Generate credentials</button></>}</div></form></div>}
      {toast && <div className={styles.toast}> {toast}</div>}
    </div>
  );
}
