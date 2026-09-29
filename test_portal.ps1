# ==============================================================
# Comprehensive End-to-End Test Suite for Job Portal Web App
# Verifies all 18 requirements specified in the project prompt
# ==============================================================

$baseUrl = "http://localhost:5000"
$passed = 0
$failed = 0

function Assert-Test {
    param (
        [string]$TestName,
        [bool]$Condition,
        [string]$Details = ""
    )
    if ($Condition) {
        Write-Host "  [PASS] $TestName" -ForegroundColor Green
        if ($Details) { Write-Host "         $Details" -ForegroundColor DarkGray }
        $script:passed++
    } else {
        Write-Host "  [FAIL] $TestName" -ForegroundColor Red
        if ($Details) { Write-Host "         $Details" -ForegroundColor Yellow }
        $script:failed++
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Running Job Portal End-to-End Test Suite" -ForegroundColor Cyan
Write-Host " Target API: $baseUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Backend Server & Health Check
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api" -Method Get
    Assert-Test "1. Backend Server Health Check" ($health.success -eq $true) "Message: $($health.message)"
} catch {
    Assert-Test "1. Backend Server Health Check" $false $_.Exception.Message
}

# 2. Frontend HTML Served
try {
    $ui = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing
    $hasTitle = $ui.Content -match "<title>JobPortal - Career & Recruitment Platform</title>"
    Assert-Test "2. React Frontend Production Bundle Served" ($ui.StatusCode -eq 200 -and $hasTitle) "Title verified in DOM"
} catch {
    Assert-Test "2. React Frontend Production Bundle Served" $false $_.Exception.Message
}

# 3. User Registration (Job Seeker)
$uniqueId = Get-Random -Minimum 1000 -Maximum 9999
$seekerReg = @{
    name = "New Candidate $uniqueId"
    email = "candidate$uniqueId@example.com"
    password = "password123"
    role = "seeker"
    phone = "+91 9988776655"
} | ConvertTo-Json

try {
    $regRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $seekerReg -ContentType "application/json"
    $newSeekerToken = $regRes.token
    Assert-Test "3. Candidate Registration" ($regRes.success -eq $true -and $newSeekerToken) "Created user ID: $($regRes.user.id)"
} catch {
    Assert-Test "3. Candidate Registration" $false $_.Exception.Message
}

# 4. User Registration (Recruiter)
$recReg = @{
    name = "Recruiter $uniqueId"
    email = "recruiter$uniqueId@enterprise.com"
    password = "password123"
    role = "recruiter"
    company_name = "NextGen Tech $uniqueId"
    company_location = "Hyderabad, India"
    phone = "+91 9988776644"
} | ConvertTo-Json

try {
    $regRecRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $recReg -ContentType "application/json"
    $newRecToken = $regRecRes.token
    Assert-Test "4. Recruiter Registration" ($regRecRes.success -eq $true -and $newRecToken) "Created recruiter ID: $($regRecRes.user.id)"
} catch {
    Assert-Test "4. Recruiter Registration" $false $_.Exception.Message
}

# 5. User Login (Admin, Recruiter, Seeker)
$adminBody = @{ email = "admin@jobportal.com"; password = "password123" } | ConvertTo-Json
$recBody = @{ email = "sarah.jenkins@techcorp.com"; password = "password123" } | ConvertTo-Json
$seekerBody = @{ email = "alex.morgan@example.com"; password = "password123" } | ConvertTo-Json

try {
    $adminRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
    $recRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $recBody -ContentType "application/json"
    $seekerRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $seekerBody -ContentType "application/json"

    $adminToken = $adminRes.token
    $recToken = $recRes.token
    $seekerToken = $seekerRes.token

    Assert-Test "5. Authentication for 3 Roles" ($adminRes.user.role -eq "admin" -and $recRes.user.role -eq "recruiter" -and $seekerRes.user.role -eq "seeker") "Tokens obtained for all roles"
} catch {
    Assert-Test "5. Authentication for 3 Roles" $false $_.Exception.Message
}

# 6. JWT Verification (/api/auth/me)
try {
    $me = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
    Assert-Test "6. JWT Verification Middleware" ($me.success -eq $true -and $me.user.email -eq "admin@jobportal.com") "User identity validated"
} catch {
    Assert-Test "6. JWT Verification Middleware" $false $_.Exception.Message
}

# 7. Role-Based Authorization Guard (Forbidden for Seeker accessing Admin API)
try {
    $badAccess = Invoke-RestMethod -Uri "$baseUrl/api/admin/users" -Method Get -Headers @{ Authorization = "Bearer $seekerToken" }
    Assert-Test "7. Role Authorization Protection" $false "Seeker was improperly allowed admin access"
} catch {
    $is403 = $_.Exception.Message -match "403"
    Assert-Test "7. Role Authorization Protection" $is403 "HTTP 403 Forbidden correctly returned"
}

# 8. Recruiter Job Creation
$createdJobId = 0
try {
    $newJob = @{
        title = "Cloud DevOps Specialist $uniqueId"
        company_name = "TechCorp Solutions"
        description = "Maintain AWS cloud pipelines, Terraform automation, and Kubernetes microservices."
        requirements = "Proficient in Docker, Kubernetes, CI/CD, and Linux scripting."
        skills = "AWS, Docker, Kubernetes, CI/CD, Linux"
        location = "Bangalore, India"
        employment_type = "Full Time"
        salary = "14 - 20 LPA"
        experience_required = "3 - 5 Years"
        last_date = "2026-11-30"
        status = "Active"
    } | ConvertTo-Json

    $jobRes = Invoke-RestMethod -Uri "$baseUrl/api/jobs" -Method Post -Body $newJob -ContentType "application/json" -Headers @{ Authorization = "Bearer $recToken" }
    $createdJobId = $jobRes.jobId
    Assert-Test "8. Recruiter Job Posting Creation" ($jobRes.success -eq $true -and $createdJobId -gt 0) "Job ID: $createdJobId"
} catch {
    Assert-Test "8. Recruiter Job Posting Creation" $false $_.Exception.Message
}

# 9. Public Job Search & Filtering
try {
    $searchRes = Invoke-RestMethod -Uri "$baseUrl/api/jobs?search=DevOps&employment_type=Full Time" -Method Get
    $matched = $searchRes.jobs | Where-Object { $_.id -eq $createdJobId }
    Assert-Test "9. Job Search & Filtering by Criteria" ($searchRes.success -eq $true -and $matched) "Found matching job"
} catch {
    Assert-Test "9. Job Search & Filtering by Criteria" $false $_.Exception.Message
}

# 10. Single Job Details
try {
    $detailRes = Invoke-RestMethod -Uri "$baseUrl/api/jobs/$createdJobId" -Method Get
    Assert-Test "10. Public Job Details Lookup" ($detailRes.success -eq $true -and $detailRes.job.title -match "Cloud DevOps Specialist") "Company: $($detailRes.job.company_name)"
} catch {
    Assert-Test "10. Public Job Details Lookup" $false $_.Exception.Message
}

# 11. Candidate Applies for Job
$newAppId = 0
try {
    $applyBody = @{
        jobId = $createdJobId
        cover_note = "I have 4 years of AWS and Docker experience and am very interested in this role."
    } | ConvertTo-Json

    $appRes = Invoke-RestMethod -Uri "$baseUrl/api/applications" -Method Post -Body $applyBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $newSeekerToken" }
    $newAppId = $appRes.applicationId
    Assert-Test "11. Candidate Job Application Submission" ($appRes.success -eq $true -and $newAppId -gt 0) "Application ID: $newAppId"
} catch {
    Assert-Test "11. Candidate Job Application Submission" $false $_.Exception.Message
}

# 12. Prevent Duplicate Application
try {
    $dupRes = Invoke-RestMethod -Uri "$baseUrl/api/applications" -Method Post -Body $applyBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $newSeekerToken" }
    Assert-Test "12. Duplicate Application Prevention" $false "Duplicate was allowed"
} catch {
    $is400 = $_.Exception.Message -match "400"
    Assert-Test "12. Duplicate Application Prevention" $is400 "HTTP 400 correctly rejected duplicate application"
}

# 13. Candidate Profile Update
try {
    $profileUpdate = @{
        name = "Senior Candidate $uniqueId"
        phone = "+91 9123456780"
        resume_headline = "Lead DevOps & Cloud Engineer"
        bio = "Seasoned engineer specializing in robust AWS infrastructures and CI/CD pipelines."
        skills = "AWS, Docker, Kubernetes, Terraform, Python, Git"
        education = "B.Tech in Computer Science, 2021"
        experience = "4 years lead DevOps engineer at CloudLabs"
    } | ConvertTo-Json

    $upRes = Invoke-RestMethod -Uri "$baseUrl/api/users/profile" -Method Put -Body $profileUpdate -ContentType "application/json" -Headers @{ Authorization = "Bearer $newSeekerToken" }
    Assert-Test "13. Candidate Profile Update" ($upRes.success -eq $true) "Profile fields updated"
} catch {
    Assert-Test "13. Candidate Profile Update" $false $_.Exception.Message
}

# 14. Candidate Views My Applications
try {
    $myApps = Invoke-RestMethod -Uri "$baseUrl/api/applications/my" -Method Get -Headers @{ Authorization = "Bearer $newSeekerToken" }
    $foundApp = $myApps.applications | Where-Object { $_.job_id -eq $createdJobId }
    Assert-Test "14. Candidate Application Tracking" ($myApps.success -eq $true -and $foundApp) "Status: $($foundApp.status)"
} catch {
    Assert-Test "14. Candidate Application Tracking" $false $_.Exception.Message
}

# 15. Recruiter Inspects Job Applicants
try {
    $recApps = Invoke-RestMethod -Uri "$baseUrl/api/applications/job/$createdJobId" -Method Get -Headers @{ Authorization = "Bearer $recToken" }
    $applicant = $recApps.applications | Where-Object { $_.id -eq $newAppId }
    Assert-Test "15. Recruiter Applicant Inspection" ($recApps.success -eq $true -and $applicant) "Applicant: $($applicant.applicant_name), Skills: $($applicant.skills)"
} catch {
    Assert-Test "15. Recruiter Applicant Inspection" $false $_.Exception.Message
}

# 16. Recruiter Updates Application Status
try {
    $statusUpdate = @{ status = "Shortlisted" } | ConvertTo-Json
    $stRes = Invoke-RestMethod -Uri "$baseUrl/api/applications/$newAppId/status" -Method Put -Body $statusUpdate -ContentType "application/json" -Headers @{ Authorization = "Bearer $recToken" }
    Assert-Test "16. Recruiter Status Update Workflow" ($stRes.success -eq $true) "Updated stage to 'Shortlisted'"
} catch {
    Assert-Test "16. Recruiter Status Update Workflow" $false $_.Exception.Message
}

# 17. Admin Statistics & Chart.js Aggregations
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/api/admin/statistics" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
    $hasAggregates = $stats.stats.totalUsers -gt 0 -and $stats.stats.totalJobs -gt 0 -and $stats.stats.jobsByEmploymentType
    Assert-Test "17. Admin Statistics & Chart.js Datasets" ($stats.success -eq $true -and $hasAggregates) "Users: $($stats.stats.totalUsers), Jobs: $($stats.stats.totalJobs)"
} catch {
    Assert-Test "17. Admin Statistics & Chart.js Datasets" $false $_.Exception.Message
}

# 18. Candidate Withdraws Application
try {
    $delApp = Invoke-RestMethod -Uri "$baseUrl/api/applications/$newAppId" -Method Delete -Headers @{ Authorization = "Bearer $newSeekerToken" }
    Assert-Test "18. Candidate Application Withdrawal" ($delApp.success -eq $true) "Application withdrawn successfully"
} catch {
    Assert-Test "18. Candidate Application Withdrawal" $false $_.Exception.Message
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Test Summary: $passed PASSED, $failed FAILED" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan
