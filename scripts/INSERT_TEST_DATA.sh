#!/bin/bash
# Inserts 28 test job records into the ATS database.
# Wipes existing jobs first to avoid duplicates on re-run.

docker exec ats-dev php -r "
\$db = new PDO('sqlite:/var/www/html/data/dev/jobs.db');
\$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Dynamic date helpers so the script works correctly when re-run on any day
\$appliedOld = date('Y-m-d', strtotime('- 36 days'));
\$appliedRecent = date('Y-m-d', strtotime('- 24 days'));

// Clear existing data
\$db->exec('DELETE FROM jobs');
\$db->exec('DELETE FROM sqlite_sequence WHERE name=\"jobs\"');

\$jobs = [
    // --- WISHLIST (5) ---
    ['Google', 'Senior Frontend Engineer', '180,000', 'Wishlist', '2026-06-15', null, 0, null, 'LinkedIn', 'https://careers.google.com/jobs/frontend', 'React, TypeScript, Web Vitals', 0],
    ['Stripe', 'Staff Software Engineer', '220,000', 'Wishlist', '2026-06-14', null, 0, null, 'Company Website', 'https://stripe.com/jobs/engineering', 'Ruby, Go, React, Distributed Systems', 1],
    ['Figma', 'Senior Backend Engineer', '195,000', 'Wishlist', '2026-06-13', null, 0, null, 'Referral', null, 'Go, Rust, WebAssembly, CRDT', 2],
    ['Vercel', 'Senior Fullstack Engineer', '200,000', 'Wishlist', '2026-06-12', null, 0, null, 'GitHub', 'https://vercel.com/careers', 'Next.js, Edge Functions, TypeScript', 3],
    ['Datadog', 'Senior DevOps Engineer', '190,000', 'Wishlist', '2026-06-11', null, 0, null, 'LinkedIn', 'https://www.datadoghq.com/jobs', 'Go, Python, Kubernetes, Terraform', 4],

    // --- APPLIED (10) ---
    ['Microsoft', 'Senior SWE - Azure', '175,000', 'Applied', \$appliedRecent, null, 0, null, 'LinkedIn', 'https://careers.microsoft.com', 'C#, .NET, Azure, Kubernetes', 0],
    ['Amazon', 'Senior SDE II', '195,000', 'Applied', \$appliedRecent, null, 0, null, 'Indeed', 'https://amazon.jobs', 'Java, AWS, DynamoDB, TDD', 1],
    ['Meta', 'Senior Backend Engineer', '210,000', 'Applied', \$appliedRecent, null, 0, null, 'Referral', 'https://metacareers.com', 'PHP, Hack, HHVM, MySQL, React', 2],
    ['Apple', 'Senior iOS Engineer', '185,000', 'Applied', \$appliedRecent, null, 0, null, 'Company Website', 'https://apple.com/careers', 'Swift, Objective-C, SwiftUI, Core Data', 3],
    ['Netflix', 'Senior Platform Engineer', '250,000', 'Applied', \$appliedRecent, null, 0, null, 'LinkedIn', 'https://jobs.netflix.com', 'Java, Node.js, AWS, Microservices', 4],
    ['Shopify', 'Senior Fullstack Developer', '170,000', 'Applied', \$appliedRecent, null, 0, null, 'GitHub', 'https://shopify.com/careers', 'Ruby, GraphQL, React, PostgreSQL', 5],
    ['Spotify', 'Senior Data Engineer', '180,000', 'Applied', \$appliedOld, null, 0, null, 'Indeed', 'https://jobs.lever.co/spotify', 'Python, Spark, Kafka, GCP', 6],
    ['Adobe', 'Senior Frontend Engineer', '165,000', 'Applied', \$appliedOld, null, 0, null, 'LinkedIn', 'https://adobe.com/jobs', 'TypeScript, React, WebGL, Canvas', 7],
    ['Salesforce', 'Senior Cloud Engineer', '170,000', 'Applied', \$appliedOld, null, 0, null, 'Company Website', 'https://salesforce.com/careers', 'Java, Apex, Lightning, SOQL', 8],
    ['Oracle', 'Senior Database Engineer', '160,000', 'Applied', \$appliedOld, null, 0, null, 'Indeed', 'https://oracle.com/careers', 'Java, PL/SQL, Oracle DB, Linux', 9],

    // --- FOLLOWED UP (4) ---
    ['Slack', 'Senior Product Engineer', '185,000', 'Followed Up', \$appliedRecent, \$appliedRecent, 0, null, 'LinkedIn', 'https://slack.com/jobs', 'Elixir, Phoenix, React, WebSocket', 0],
    ['Twilio', 'Senior Backend Engineer', '180,000', 'Followed Up', \$appliedOld, \$appliedOld, 0, null, 'Referral', 'https://twilio.com/jobs', 'Java, Node.js, SIP, REST APIs', 1],
    ['Square', 'Senior Mobile Engineer', '190,000', 'Followed Up', \$appliedRecent, \$appliedRecent, 0, null, 'Company Website', 'https://squareup.com/careers', 'Kotlin, Swift, Kotlin Multiplatform', 2],
    ['Coinbase', 'Senior Protocol Engineer', '200,000', 'Followed Up', \$appliedOld, \$appliedOld, 1, null, 'GitHub', 'https://coinbase.com/jobs', 'Go, Rust, Solidity, P2P', 3],

    // --- INTERVIEWING (2) ---
    ['Airbnb', 'Senior Fullstack Engineer', '195,000', 'Interviewing', '2026-05-01', '2026-05-15', 0, '2026-06-20 14:00:00', 'LinkedIn', 'https://careers.airbnb.com', 'React, Node.js, GraphQL, PostgreSQL', 0],
    ['Uber', 'Senior Backend Engineer', '210,000', 'Interviewing', '2026-05-05', '2026-05-19', 0, '2026-06-22 10:00:00', 'Referral', 'https://uber.com/careers', 'Go, C++, gRPC, Redis', 1],

    // --- OFFER (1) ---
    ['Shopify', 'Principal Engineer', '230,000', 'Offer', '2026-04-20', '2026-05-05', 0, '2026-06-10 11:00:00', 'Company Website', 'https://shopify.com/careers', 'Ruby, GraphQL, React, PostgreSQL', 0],

    // --- REJECTED (6) ---
    ['IBM', 'Senior Software Engineer', '150,000', 'Rejected', '2026-04-01', null, 0, null, 'Indeed', 'https://ibm.com/careers', 'Java, Cloud, Watson, Cognitive', 0],
    ['Cognizant', 'Application Developer', '120,000', 'Rejected', '2026-04-05', null, 0, null, 'LinkedIn', 'https://cognizant.com/careers', 'Java, Angular, SQL, Agile', 1],
    ['Infosys', 'Senior Consultant', '130,000', 'Rejected', '2026-04-10', null, 0, null, 'Company Website', 'https://infosys.com/careers', 'Java, Spring Boot, Azure, DevOps', 2],
    ['TCS', 'Technical Architect', '140,000', 'Rejected', '2026-04-15', null, 0, null, 'Referral', 'https://tcs.com/careers', '.NET, C#, Azure, Microservices', 3],
    ['Wipro', 'Senior Developer', '115,000', 'Rejected', '2026-04-20', null, 0, null, 'Indeed', 'https://wipro.com/careers', 'Python, Django, Docker, Kubernetes', 4],
    ['HCL', 'Lead Engineer', '135,000', 'Rejected', '2026-04-25', null, 0, null, 'LinkedIn', 'https://hcltech.com/careers', 'Java, React, AWS, Agile', 5],
];

\$stmt = \$db->prepare(
    'INSERT INTO jobs (company, position, salary, status, date_applied, followed_up_date, follow_up_dismissed, interview_date, \`source\`, hyperlink, notes, \`order\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

\$count = 0;
foreach (\$jobs as \$job) {
    \$stmt->execute(\$job);
    \$count++;
}

echo \"Inserted \$count test job records.\" . PHP_EOL;
\$total = \$db->query('SELECT COUNT(*) FROM jobs')->fetchColumn();
echo \"Total jobs in database: \$total\" . PHP_EOL;
"
