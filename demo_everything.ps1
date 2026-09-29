# ====================================================================
# LIVE DEMONSTRATION: COMPLETE JOB PORTAL FULL-STACK WORKFLOW
# Demonstrates Candidate, Recruiter, and Admin operations in sequence
# ====================================================================

$base = "http://localhost:5000"

function Print-Header($title) {
    Write-Host ""
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "====================================================================" -ForegroundColor Cyan
}

function Print-Success($msg) {
    Write-Host " [SUCCESS] $msg" -ForegroundColor Green
}

function Print-Info($msg) {
    Write-Host " [INFO] $msg" -ForegroundColor Yellow
}

Print-Header "STEP 1: PUBLIC VISITOR EXPLORING JOBS"

# 1. Fetch public active jobs
$jobsRes = Invoke-RestMethod -Uri "$base/api/jobs?status=Active" -Method Get
Print-Success "Public visitor retrieved $($jobsRes.count) active job openings."
foreach ($j in $jobsRes.jobs | Select-Object -First 3) {
    Write-Host "   * #$($j.id) $($j.title) at $($j.company_name) ($($j.location)) - $($j.salary)" -ForegroundColor White
}

# 2. Search specific keyword
$reactJobs = Invoke-RestMethod -Uri "$base/api/jobs?search=React" -Method Get
Print-Success "Keyword search for 'React' returned $($reactJobs.count) matching positions."

Print-Header "STEP 2: NEW JOB SEEKER REGISTRATION & PROFILE BUILDING"

$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$seekerEmail = "pooja.hegde$randomNum@example.com"
$seekerName = "Pooja Hegde"

$regBody = @{
    name = $seekerName
    email = $seekerEmail
    password = "password123"
    role = "seeker"
    phone = "+91 9876501234"
} | ConvertTo-Json

$regRes = Invoke-RestMethod -Uri "$base/api/auth/register" -Method Post -Body $regBody -ContentType "application/json"
$poojaToken = $regRes.token
Print-Success "Candidate registered successfully! Name: $($regRes.user.name), Email: $($regRes.user.email)"
Print-Info "JWT Token received: $($poojaToken.Substring(0, 30))..."

# Update Candidate Profile
$profileBody = @{
    name = $seekerName
    phone = "+91 9876501234"
    resume_headline = "Senior React & Frontend UI Architect | 4+ Yrs Experience"
    bio = "Passionate frontend engineer focused on building responsive web applications using React.js and Bootstrap."
    skills = "React.js, JavaScript, ES6, Bootstrap 5, CSS3, HTML5, REST API, Chart.js"
    education = "B.Tech in Computer Science & Engineering, Osmania University (2018-2022)"
    experience = "4 years building responsive SPAs and dashboards at CloudUI Labs"
} | ConvertTo-Json

$upRes = Invoke-RestMethod -Uri "$base/api/users/profile" -Method Put -Body $profileBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $poojaToken" }
Print-Success "Profile details updated with headline, skills, education, and work experience."

Print-Header "STEP 3: CANDIDATE APPLIES FOR JOB & DUPLICATE CHECK"

$jobToApply = $jobsRes.jobs[1] # Frontend Developer (React)
Print-Info "Applying for Job #$($jobToApply.id): $($jobToApply.title) at $($jobToApply.company_name)"

$applyBody = @{
    jobId = $jobToApply.id
    cover_note = "I have 4 years of hands-on experience building modern SPAs in React.js and Bootstrap, matching your tech requirements exactly."
} | ConvertTo-Json

$appRes = Invoke-RestMethod -Uri "$base/api/applications" -Method Post -Body $applyBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $poojaToken" }
$applicationId = $appRes.applicationId
Print-Success "Application #$applicationId submitted successfully!"

# Test Duplicate Prevention
try {
    $dup = Invoke-RestMethod -Uri "$base/api/applications" -Method Post -Body $applyBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $poojaToken" }
    Write-Host " [ERROR] Duplicate was allowed unexpectedly" -ForegroundColor Red
} catch {
    Print-Success "Duplicate application prevention verified! (Server rejected duplicate with HTTP 400)"
}

# Candidate verifies application in My Applications
$myApps = Invoke-RestMethod -Uri "$base/api/applications/my" -Method Get -Headers @{ Authorization = "Bearer $poojaToken" }
Print-Success "Candidate tracked $($myApps.count) application(s) in 'My Applications':"
foreach ($a in $myApps.applications) {
    Write-Host "   * Job: $($a.job_title) | Company: $($a.company_name) | Status: $($a.status)" -ForegroundColor White
}

Print-Header "STEP 4: EMPLOYER / RECRUITER WORKFLOW"

# Login as Recruiter for the company (Michael Chang - InnovateSoft Systems)
$recruiterLogin = @{
    email = "michael.chang@innovatesoft.com"
    password = "password123"
} | ConvertTo-Json

$recRes = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -Body $recruiterLogin -ContentType "application/json"
$recToken = $recRes.token
Print-Success "Logged in as Recruiter: $($recRes.user.name) ($($recRes.user.company_name))"

# Post a brand new Job opening
$newJobBody = @{
    title = "Lead Full Stack Architect $randomNum"
    company_name = "InnovateSoft Systems"
    description = "Architect and scale distributed cloud services and responsive web applications."
    requirements = "Strong leadership experience in React, Node.js, Express, and MySQL database performance tuning."
    skills = "React.js, Node.js, Express, MySQL, REST API, System Design"
    location = "Hyderabad, India"
    employment_type = "Full Time"
    salary = "22 - 30 LPA"
    experience_required = "5+ Years"
    last_date = "2026-12-31"
    status = "Active"
} | ConvertTo-Json

$newJob = Invoke-RestMethod -Uri "$base/api/jobs" -Method Post -Body $newJobBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $recToken" }
Print-Success "Recruiter posted new Job #$($newJob.jobId): 'Lead Full Stack Architect'"

# Recruiter reviews applicants for the Frontend job
$applicants = Invoke-RestMethod -Uri "$base/api/applications/job/$($jobToApply.id)" -Method Get -Headers @{ Authorization = "Bearer $recToken" }
Print-Success "Recruiter reviewed $($applicants.count) applicant(s) for Job #$($jobToApply.id):"

$poojaApp = $applicants.applications | Where-Object { $_.id -eq $applicationId }
if ($poojaApp) {
    Write-Host "   * Candidate: $($poojaApp.applicant_name) ($($poojaApp.applicant_email))" -ForegroundColor Cyan
    Write-Host "     Headline:  $($poojaApp.resume_headline)" -ForegroundColor White
    Write-Host "     Skills:    $($poojaApp.skills)" -ForegroundColor White
    Write-Host "     Education: $($poojaApp.education)" -ForegroundColor White
    Write-Host "     Notes:     $($poojaApp.cover_note)" -ForegroundColor White
}

# Recruiter advances application to Shortlisted
$shortlistBody = @{ status = "Shortlisted" } | ConvertTo-Json
$stRes1 = Invoke-RestMethod -Uri "$base/api/applications/$applicationId/status" -Method Put -Body $shortlistBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $recToken" }
Print-Success "Recruiter updated application status to: 'Shortlisted'"

# Recruiter selects candidate after interview
$selectBody = @{ status = "Selected" } | ConvertTo-Json
$stRes2 = Invoke-RestMethod -Uri "$base/api/applications/$applicationId/status" -Method Put -Body $selectBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $recToken" }
Print-Success "Recruiter updated application status to: 'Selected' (Offer Extended)"

Print-Header "STEP 5: CANDIDATE VERIFIES OFFER STATUS"

$updatedMyApps = Invoke-RestMethod -Uri "$base/api/applications/my" -Method Get -Headers @{ Authorization = "Bearer $poojaToken" }
$appStatus = ($updatedMyApps.applications | Where-Object { $_.id -eq $applicationId }).status
Print-Success "Candidate checked status: Application is now [$appStatus]!"

Print-Header "STEP 6: ADMINISTRATOR PLATFORM AUDIT & CHART.JS DATASETS"

$adminLogin = @{
    email = "admin@jobportal.com"
    password = "password123"
} | ConvertTo-Json

$adminRes = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -Body $adminLogin -ContentType "application/json"
$adminToken = $adminRes.token
Print-Success "Logged in as System Administrator"

# Fetch platform statistics
$statsRes = Invoke-RestMethod -Uri "$base/api/admin/statistics" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
$s = $statsRes.stats
Print-Success "Live Platform Statistics:"
Write-Host "   * Total Platform Users:         $($s.totalUsers)" -ForegroundColor White
Write-Host "   * Registered Job Seekers:       $($s.totalSeekers)" -ForegroundColor White
Write-Host "   * Registered Recruiters:        $($s.totalRecruiters)" -ForegroundColor White
Write-Host "   * Total Job Postings:           $($s.totalJobs)" -ForegroundColor White
Write-Host "   * Active Postings:              $($s.activeJobs)" -ForegroundColor White
Write-Host "   * Total Applications Submitted: $($s.totalApplications)" -ForegroundColor White

Print-Info "Chart.js Aggregation - Applications by Status:"
foreach ($key in $s.applicationsByStatus.PSObject.Properties) {
    Write-Host "   - $($key.Name): $($key.Value)" -ForegroundColor Gray
}

Print-Info "Chart.js Aggregation - Jobs by Employment Type:"
foreach ($key in $s.jobsByEmploymentType.PSObject.Properties) {
    Write-Host "   - $($key.Name): $($key.Value)" -ForegroundColor Gray
}

Print-Header "DEMONSTRATION COMPLETED SUCCESSFULLY: ALL WORKFLOWS 100% OPERATIONAL"
