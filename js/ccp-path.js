/* CCP Study Path: 18 numbered modules in exam order, labs and a glossary.
   Numbered-path idea inspired by Thiago-code-lab/aws-certified-cloud-practitioner-brasil (MIT). Content written for this hub. */
(function () {
  const FG = 'https://rmctech-ai.github.io/aws-city-map/field-guide/#';
  const CITY = 'https://rmctech-ai.github.io/aws-city-map/';
  const ATLAS = CITY + 'atlas/';
  const EX = (repo, id) => `https://rmctech-ai.github.io/${repo}/${id ? '#' + id : ''}`;
  const fg = ids => ids.split(' ').map(i => [i, FG + i]);
  const DOM = { concepts: ['Cloud Concepts', '24%'], security: ['Security & Compliance', '30%'], tech: ['Cloud Technology & Services', '34%'], billing: ['Billing, Pricing & Support', '12%'], exam: ['Exam day', ''] };

  const M = [
  { n: '01', t: 'Cloud Concepts & Benefits', d: 'concepts', min: 45,
    know: ['Cloud computing = on-demand IT resources over the internet with <b>pay-as-you-go</b> pricing.',
      'The <b>six advantages</b>: trade fixed expense (CapEx) for variable expense (OpEx) · benefit from massive economies of scale · stop guessing capacity · increase speed and agility · stop spending money running and maintaining data centers · go global in minutes.',
      '<b>Elasticity</b> = automatically grow AND shrink with demand. <b>Scalability</b> = ability to grow (up or out). <b>High availability</b> = keeps running when parts fail (multiple AZs). <b>Fault tolerance</b> = no interruption at all.',
      'Service models: <b>IaaS</b> (EC2: you manage the OS), <b>PaaS</b> (Elastic Beanstalk: you manage the code), <b>SaaS</b> (a finished app like WorkSpaces or Amazon Connect).',
      'Deployment models: <b>cloud</b> (all-in), <b>on-premises / private</b>, <b>hybrid</b> (both, connected).',
      'The <b>five characteristics</b> of cloud computing: on-demand self-service · broad network access · multi-tenancy and resource pooling · rapid elasticity and scalability · measured service (pay for what you use).',
      '<b>Agility</b> = new IT resources are a click away, so experiments take minutes instead of weeks. (Not the same as elasticity or scalability.)'],
    traps: ['"Stop guessing capacity" vs "economies of scale": the first is about planning, the second is about lower prices.', 'High availability ≠ high performance. Multi-AZ is about staying up, not going faster.', 'Elasticity includes scaling <i>in</i>. If the question says "removes servers when traffic drops", it is elasticity.'],
    links: [['AWS City Map', CITY], ['Well-Architected Explorer · Scalability', EX('WellArchitected-Explorer', 'scalability')]],
    checks: ['I can name all six advantages and the five characteristics of cloud computing', 'I can explain elasticity vs scalability vs high availability', 'I can match IaaS / PaaS / SaaS to an AWS example'] },

  { n: '02', t: 'Global Infrastructure', d: 'concepts', min: 35,
    know: ['<b>Region</b> = a geographic area with <b>3 or more Availability Zones</b>. Choose a Region by: compliance/data residency, latency to users, service availability, price.',
      '<b>Availability Zone</b> = one or more discrete data centers with redundant power and networking, isolated from other AZs but connected with low latency.',
      '<b>Edge locations</b> (Points of Presence) serve CloudFront, Route 53 and Global Accelerator close to users.',
      '<b>Local Zones</b> put compute near a big city; <b>Wavelength</b> puts it inside 5G networks; <b>Outposts</b> puts AWS racks in your own data center.',
      'Global services: IAM, Route 53, CloudFront, Organizations. Most others are regional; S3 bucket names are global but each bucket lives in one Region.'],
    traps: ['Region and AZ are not synonyms. "Survive a data center failure" → multiple AZs. "Survive a Region failure / data residency" → Regions.', 'Edge locations do not run EC2 for you; Local Zones and Outposts do.'],
    links: [...fg('outposts cloudfront globalaccelerator'), ['VPC Explorer · What is a VPC', EX('VPC-Explorer', 'what-is-vpc')]],
    checks: ['I can explain Region vs AZ vs edge location', 'I know the four factors for choosing a Region', 'I can tell Local Zones, Wavelength and Outposts apart'] },

  { n: '03', t: 'Cloud Adoption Framework & Migration', d: 'concepts', min: 40,
    know: ['<b>AWS CAF</b> has six perspectives. Business side: <b>Business, People, Governance</b>. Technical side: <b>Platform, Security, Operations</b>.',
      'CAF transformation journey phases: <b>Envision → Align → Launch → Scale</b>.',
      'Business outcomes CAF targets: <b>reduced business risk, improved ESG performance, increased revenue, increased operational efficiency</b>.',
      'Migration strategies (the <b>7 Rs</b>): Retire, Retain, Relocate, Rehost (lift and shift), Replatform (lift, tinker and shift), Repurchase (move to SaaS), Refactor (re-architect).',
      'Tools: <b>Migration Evaluator</b> (business case), <b>Application Discovery Service</b> (inventory; closed to new customers since Nov 2025 but still in the exam guide), <b>Migration Hub</b> (track), <b>Application Migration Service</b> (rehost servers), <b>DMS + SCT</b> (databases), <b>Snow Family</b> and <b>DataSync</b> (data).'],
    traps: ['People perspective = training, culture, org structure. Governance = program management, risk, cost. Platform = architecture. Operations = run and support.', 'Rehost changes nothing; replatform makes a small change (e.g. self-managed DB → RDS); refactor rebuilds.', 'Same DB engine → DMS only. Different engine → SCT first, then DMS.'],
    links: [...fg('mgn dms sct ads evaluator migrationhub snow'), ['SAA Explorer · Migration', EX('SAA-Explorer', 'migration')]],
    checks: ['I can name the 6 CAF perspectives and which are business vs technical', 'I can list the 4 CAF phases in order', 'I can match the 7 Rs to examples', 'I know which tool does discovery, server migration and DB migration'] },

  { n: '04', t: 'Well-Architected Framework', d: 'concepts', min: 35,
    know: ['Six pillars: <b>Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability</b>.',
      'Design principles to recognise: automate, use managed services, loose coupling, scale horizontally, design for failure, use the right resource type, measure and right-size.',
      '<b>AWS Well-Architected Tool</b> (free, in the console) reviews a workload against the pillars. <b>Lenses</b> add guidance for specific workloads (serverless, SaaS, ML…).'],
    traps: ['"Reduce energy / carbon footprint" → Sustainability, not Cost Optimization.', '"Recover automatically from failure" → Reliability. "Run and monitor systems, improve processes" → Operational Excellence.'],
    links: [['Well-Architected Explorer (whole course)', EX('WellArchitected-Explorer')], ...fg('watool')],
    checks: ['I can name all six pillars', 'I can map a design principle to its pillar', 'I know what the Well-Architected Tool does'] },

  { n: '05', t: 'Shared Responsibility Model', d: 'security', min: 30,
    know: ['AWS = security <b>OF</b> the cloud: hardware, data centers, global network, the virtualization layer, managed-service software.',
      'Customer = security <b>IN</b> the cloud: data, IAM users and permissions, encryption choices, security groups, the guest OS and patches on EC2, app code.',
      'The split moves with the service: on <b>EC2</b> you patch the OS; on <b>RDS/Lambda</b> AWS patches it. Your <b>data and access</b> are always yours.',
      'Shared controls: patch management, configuration management, awareness and training (each side for its own layer).'],
    traps: ['"Who patches the EC2 guest OS?" → customer. "Who patches the RDS engine?" → AWS.', 'Physical security of data centers is always AWS.', 'AWS never configures your IAM permissions for you.'],
    links: [['Cloud Security Explorer · Shared responsibility', EX('CloudSecurity-Explorer', 'shared-responsibility')]],
    checks: ['I can sort 10 tasks into AWS vs customer', 'I know how responsibility changes between EC2, RDS and Lambda'] },

  { n: '06', t: 'Identity & Access (IAM)', d: 'security', min: 50,
    know: ['<b>Root user</b>: enable MFA, don\'t use it daily, no access keys. Only a few tasks need it (e.g. change support plan, close the account).',
      '<b>IAM users</b> (people/apps with long-term credentials), <b>groups</b> (attach policies to many users), <b>roles</b> (temporary credentials for services, apps and other accounts), <b>policies</b> (JSON permissions).',
      '<b>Least privilege</b>: grant only what is needed. Explicit <b>Deny</b> always wins.',
      '<b>IAM Identity Center</b> = single sign-on for the workforce across accounts. <b>Cognito</b> = sign-in for your app\'s customers. <b>Directory Service</b> = managed Microsoft AD.',
      '<b>IAM security tools</b>: <b>Credential Report</b> (account level: all users and the status of their passwords, keys and MFA) and <b>Access Advisor</b> (user level: which services they were granted and when they last used them, so you can remove unused permissions). A <b>password policy</b> sets minimum length, character types, expiry and reuse rules.',
      '<b>Organizations</b>: many accounts, <b>consolidated billing</b>, <b>SCPs</b> (maximum permissions per account/OU). <b>Control Tower</b> sets up a governed multi-account landing zone. <b>RAM</b> shares resources across accounts.'],
    traps: ['EC2 needs to call S3 → give the instance an <b>IAM role</b>, never access keys.', 'SCPs limit, they never grant permissions.', 'Audit every user\'s credentials in one file → Credential Report. Find unused permissions for one user → Access Advisor.', 'Cognito is for customers of your app; Identity Center is for employees.'],
    links: [['IAM Explorer (whole course)', EX('IAM-Explorer')], ...fg('iam identitycenter cognito organizations controltower ram')],
    checks: ['I know the root user best practices', 'I can explain user vs group vs role', 'I know when to use Identity Center vs Cognito', 'I know what an SCP does and does not do', 'I know Credential Report vs Access Advisor'] },

  { n: '07', t: 'Security Services', d: 'security', min: 50,
    know: ['<b>Shield</b> = DDoS protection (Standard free and automatic; Advanced paid with response team). <b>WAF</b> = layer-7 web filtering (SQL injection, XSS, rate limits). <b>Firewall Manager</b> = manage WAF/Shield/SG rules across accounts.',
      '<b>GuardDuty</b> = threat detection from logs (malicious IPs, crypto-mining). <b>Inspector</b> = vulnerability scanning (EC2, ECR images, Lambda). <b>Macie</b> = find PII in S3. <b>Detective</b> = investigate root cause. <b>Security Hub</b> = one dashboard of findings.',
      '<b>KMS</b> = managed encryption keys. <b>CloudHSM</b> = your own dedicated hardware security module. <b>Secrets Manager</b> = store and <b>rotate</b> secrets. <b>ACM</b> = free TLS certificates.',
      'Encryption <b>at rest</b> (KMS) and <b>in transit</b> (TLS/ACM).',
      'KMS key types: <b>customer managed</b> (you create, control policy and rotation) · <b>AWS managed</b> (created for you per service, e.g. aws/s3) · <b>AWS owned</b> (used by AWS across many accounts; you never see them). Old notes call these "CMKs".'],
    traps: ['Inspector finds weaknesses; GuardDuty detects active threats.', 'Shield = DDoS; WAF = malicious web requests.', 'Dedicated, single-tenant key hardware or FIPS 140-3 level 3 → CloudHSM, not KMS.'],
    links: [['Cloud Security Explorer · Detection services', EX('CloudSecurity-Explorer', 'detection-services')], ...fg('shield waf firewallmanager guardduty inspector macie detective securityhub kms cloudhsm secretsmanager acm')],
    checks: ['I can match GuardDuty, Inspector, Macie, Detective and Security Hub to a scenario', 'I know Shield vs WAF', 'I know KMS vs CloudHSM vs Secrets Manager'] },

  { n: '08', t: 'Compliance, Audit & Governance', d: 'security', min: 35,
    know: ['<b>AWS Artifact</b> = download AWS\'s own compliance reports (SOC, PCI, ISO) and agreements.',
      '<b>CloudTrail</b> = who did what, when (API calls). <b>AWS Config</b> = what changed and is it compliant (resource configuration history + rules). <b>Audit Manager</b> = collect evidence for audits.',
      '<b>Compliance programs</b> (PCI DSS, HIPAA, GDPR, ISO 27001, SOC) — AWS is certified for its part; you must still configure your workload correctly.',
      '<b>CloudTrail</b> keeps <b>90 days</b> of management events in Event history for free; send a trail to S3 for longer. <b>CloudTrail Insights</b> flags unusual API activity (e.g. a sudden burst of resource creation).',
      '<b>Penetration testing</b>: you may test your own resources on many common services (EC2, RDS, Aurora, CloudFront, API Gateway, Lambda, Lightsail, Beanstalk…) without asking first. Not allowed: DoS/DDoS attacks, flooding, attacking AWS infrastructure itself. DDoS simulation only through an approved partner.',
      'Resources: <b>AWS Security Center</b>, <b>Trust & Safety team</b> (report abuse), <b>Knowledge Center</b>, security blogs.'],
    traps: ['Artifact gives AWS\'s reports; it does not check your resources (that\'s Config / Audit Manager).', 'Audit "who deleted the bucket?" → CloudTrail, not CloudWatch.', 'Report AWS resources used for abuse (spam, attacks) → AWS Trust & Safety.', '"Can I run a vulnerability scan on my own EC2 without permission?" → yes. "Can I DoS-test my site myself?" → no.'],
    links: [['IAM Explorer · CloudTrail audit', EX('IAM-Explorer', 'cloudtrail-audit')], ['Cloud Security Explorer · Config compliance', EX('CloudSecurity-Explorer', 'config-compliance')], ...fg('artifact cloudtrail config auditmanager')],
    checks: ['I know CloudTrail vs Config vs CloudWatch', 'I know what Artifact is for', 'I know how to report abuse', 'I know what penetration testing is allowed without approval'] },

  { n: '09', t: 'Compute', d: 'tech', min: 60,
    know: ['<b>EC2</b> families: general purpose (M, T), compute optimized (C), memory optimized (R, X), storage optimized (I, D), accelerated (P, G).',
      '<b>User data</b> = a script that runs at first boot (install a web server). <b>Instance metadata</b> = info the instance can read about itself at 169.254.169.254 (instance ID, role credentials).',
      'Purchase options: <b>On-Demand</b> (no commitment), <b>Savings Plans</b> and <b>Reserved Instances</b> (1 or 3 years, up to ~72% off), <b>Spot</b> (up to 90% off, can be interrupted), <b>Dedicated Hosts</b> (licensing / compliance), <b>Dedicated Instances</b>, <b>Capacity Reservations</b>.',
      '<b>AMI</b> (Amazon Machine Image) = the template an instance boots from: AWS-provided, your own (custom, faster boot with software pre-installed) or from the Marketplace. AMIs are per Region but can be copied. Connect without SSH keys or open port 22 using <b>EC2 Instance Connect</b> or Systems Manager <b>Session Manager</b>.',
      'Auto Scaling policies: target tracking (keep CPU at 40%), simple/step, <b>scheduled</b> (known events), <b>predictive</b> (ML forecasts the load).',
      '<b>Auto Scaling</b> adds/removes instances; <b>Elastic Load Balancing</b> (ALB for HTTP, NLB for TCP/UDP, GWLB for appliances) spreads traffic and checks health.',
      'Serverless and containers: <b>Lambda</b> (events, max 15 min), <b>Fargate</b> (serverless containers), <b>ECS</b>, <b>EKS</b> (Kubernetes), <b>ECR</b> (images). Easy options: <b>Elastic Beanstalk</b> (PaaS), <b>Lightsail</b> (simple fixed-price VPS). <b>Batch</b> for batch jobs.'],
    traps: ['Steady 24/7 for a year → Savings Plan / RI. Interruptible → Spot. Bring your own per-socket license → Dedicated Host.', 'Lambda can\'t run longer than 15 minutes.', 'Simplest website for a beginner with fixed monthly price → Lightsail.'],
    links: [['Serverless Explorer', EX('Serverless-Explorer')], ['SAA Explorer · Choosing compute', EX('SAA-Explorer', 'compute')], ...fg('ec2 autoscaling elb lambda fargate ecs eks ecr beanstalk lightsail batch')],
    checks: ['I know all EC2 purchase options and when to use each', 'I know what user data and instance metadata are', 'I can choose between EC2, Lambda, Fargate, Beanstalk and Lightsail', 'I know ALB vs NLB'] },

  { n: '10', t: 'Storage', d: 'tech', min: 50,
    know: ['<b>S3</b> = object storage, 11 nines durability, buckets and objects, static websites, <b>versioning</b>, <b>lifecycle rules</b>, Transfer Acceleration, Block Public Access.',
      'S3 classes: Standard · Intelligent-Tiering (unknown patterns) · Standard-IA · One Zone-IA · Glacier Instant Retrieval · Glacier Flexible Retrieval · Glacier Deep Archive (cheapest, hours to retrieve).',
      '<b>EBS</b> = block disk for one EC2 instance in one AZ (snapshots to back up). <b>Instance store</b> = temporary local disk. <b>EFS</b> = shared Linux file system (NFS). <b>FSx</b> = Windows File Server, Lustre (HPC), NetApp ONTAP, OpenZFS.',
      'EBS <b>Delete on Termination</b>: the root volume is deleted with the instance by default; extra volumes are kept by default. <b>EFS-IA</b> = cheaper EFS tier for files not used every day (lifecycle moves them).',
      'S3 <b>Cross-Region Replication</b> copies objects to a bucket in another Region (compliance, low-latency reads in a few Regions). CloudFront instead <b>caches</b> content at edge locations worldwide.',
      '<b>Storage Gateway</b> = hybrid access to cloud storage. <b>Snow Family</b> = physical devices for big offline transfers / edge. <b>AWS Backup</b> = central backups. <b>Elastic Disaster Recovery</b> = replicate servers for DR.'],
    traps: ['Versioning keeps old copies; lifecycle moves or deletes objects over time.', 'Archive classes are cheap to store but charge to retrieve and take time.', 'S3 is not an instance disk; EBS is.'],
    links: [['SAA Explorer · Storage', EX('SAA-Explorer', 'storage')], ...fg('s3 glacier ebs efs fsx storagegateway snow backup drs')],
    checks: ['I can pick the right S3 class from an access pattern', 'I know S3 vs EBS vs EFS vs FSx', 'I know versioning vs lifecycle'] },

  { n: '11', t: 'Databases', d: 'tech', min: 45,
    know: ['<b>RDS</b> = managed relational (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server). <b>Aurora</b> = AWS\'s high-performance MySQL/PostgreSQL-compatible engine.',
      '<b>Multi-AZ</b> = high availability (standby). <b>Read replicas</b> = read scaling.',
      '<b>DynamoDB</b> = serverless NoSQL key-value, millisecond latency at any scale. <b>ElastiCache</b> = in-memory cache (Redis OSS/Valkey, Memcached). <b>Redshift</b> = data warehouse (analytics).',
      '<b>DocumentDB</b> = MongoDB-compatible documents. <b>Neptune</b> = graph. Running a DB yourself on EC2 means you patch and back it up.'],
    traps: ['"Analytics on large historical data" → Redshift, not RDS.', '"Relationships / social graph / fraud rings" → Neptune.', 'Managed DB = less operational overhead than DB on EC2.'],
    links: [['SAA Explorer · Databases', EX('SAA-Explorer', 'databases')], ...fg('rds aurora dynamodb elasticache redshift docdb neptune')],
    checks: ['I can match each database to its data type', 'I know Multi-AZ vs read replica', 'I know who patches a DB on EC2 vs RDS'] },

  { n: '12', t: 'Networking & Content Delivery', d: 'tech', min: 55,
    know: ['<b>VPC</b> = your private network. <b>Subnets</b> live in one AZ; public subnets route to an <b>Internet Gateway</b>; private subnets use a <b>NAT gateway</b> to go out.',
      '<b>Security groups</b> = stateful, allow-only, on instances. <b>Network ACLs</b> = stateless, allow and deny, on subnets.',
      'Connect networks: <b>VPC peering</b> (two VPCs), <b>Transit Gateway</b> (hub for many), <b>Site-to-Site VPN</b> (encrypted over internet, fast to set up), <b>Direct Connect</b> (private dedicated line), <b>Client VPN</b> (laptops), <b>PrivateLink</b> (private access to services).',
      '<b>NAT gateway</b> (managed, highly available in its AZ, scales automatically) vs <b>NAT instance</b> (an EC2 you manage yourself, old way). <b>Elastic IP</b> = a fixed public IPv4 address you own until you release it (charged).',
      'Ports to know: <b>22</b> SSH (Linux login, also SFTP) · <b>21</b> FTP · <b>80</b> HTTP · <b>443</b> HTTPS · <b>3389</b> RDP (Windows login).',
      '<b>Route 53</b> = DNS + routing policies + health checks. <b>CloudFront</b> = CDN caching at edge locations. <b>Global Accelerator</b> = static IPs over the AWS backbone. <b>API Gateway</b> = managed APIs.'],
    traps: ['Block one IP address → NACL (security groups can\'t deny).', 'Need it fast + encrypted → VPN. Consistent private bandwidth → Direct Connect.', 'Cache content near users → CloudFront. Static IP / non-HTTP → Global Accelerator.'],
    links: [['VPC Explorer (whole course)', EX('VPC-Explorer')], ...fg('vpc route53 cloudfront globalaccelerator apigateway directconnect vpn clientvpn transitgateway privatelink')],
    checks: ['I know ports 22, 80, 443 and 3389', 'I know public vs private subnet', 'I know security group vs NACL', 'I can pick VPN vs Direct Connect vs Transit Gateway', 'I know CloudFront vs Global Accelerator'] },

  { n: '13', t: 'Application Integration & Analytics', d: 'tech', min: 40,
    know: ['<b>SQS</b> = message queue (decouple, buffer). <b>SNS</b> = publish/subscribe notifications (fan-out, email, SMS). <b>EventBridge</b> = event bus and schedules. <b>Step Functions</b> = workflows.',
      '<b>Athena</b> = SQL on S3, serverless. <b>Kinesis</b> = real-time streaming. <b>Glue</b> = ETL + data catalog. <b>EMR</b> = Hadoop/Spark. <b>QuickSight</b> = dashboards. <b>OpenSearch</b> = search and log analytics. <b>Redshift</b> = warehouse.'],
    traps: ['Queue (pull, one consumer) = SQS. Notification (push, many subscribers) = SNS.', '"Real-time" → Kinesis. "Query files in S3 with SQL" → Athena. "Business dashboards" → QuickSight.'],
    links: [['Serverless Explorer · SQS / Events / Step Functions', EX('Serverless-Explorer', 'sqs')], ['SAA Explorer · Analytics', EX('SAA-Explorer', 'analytics')], ...fg('sqs sns eventbridge stepfunctions athena kinesis glue emr quicksight opensearch')],
    checks: ['I know SQS vs SNS vs EventBridge', 'I can match Athena, Kinesis, Glue, EMR and QuickSight to a scenario'] },

  { n: '14', t: 'AI/ML & Other In-Scope Services', d: 'tech', min: 40,
    know: ['<b>SageMaker AI</b> = build, train, deploy your own ML models. <b>Bedrock</b> = generative AI foundation models via API. <b>Amazon Q</b> = generative AI assistant for work and developers.',
      'Ready-made AI: <b>Rekognition</b> (images/video), <b>Textract</b> (extract text and forms from documents), <b>Comprehend</b> (sentiment, entities in text), <b>Transcribe</b> (speech → text), <b>Polly</b> (text → speech), <b>Translate</b>, <b>Lex</b> (chatbots), <b>Kendra</b> (intelligent enterprise search).',
      'Business apps: <b>Amazon Connect</b> (contact center), <b>SES</b> (email). End-user computing: <b>WorkSpaces</b> (virtual desktops), <b>AppStream 2.0</b> (stream apps), <b>WorkSpaces Secure Browser</b>. Front end: <b>Amplify</b>, <b>AppSync</b> (GraphQL). IoT: <b>IoT Core</b>.',
      'Also seen in notes and questions: <b>Ground Station</b> (control satellites, ground station as a service) · <b>Device Farm</b> (test mobile/web apps on real devices) · <b>Fault Injection Service (FIS)</b> (chaos engineering: inject failures on purpose) · <b>Elemental MediaConvert</b> (video transcoding) · <b>Managed Blockchain</b> · <b>CodeGuru Profiler</b> (find slow, costly lines of code) · <b>Snow Family OpsHub</b> (app to manage Snow devices).'],
    traps: ['Polly speaks, Transcribe listens.', 'Textract reads documents; Rekognition looks at images; Comprehend understands text.', 'Your own custom model → SageMaker. Ready foundation model → Bedrock.'],
    links: [...fg('sagemaker bedrock q rekognition textract comprehend transcribe polly translate lex kendra connect ses workspaces appstream securebrowser amplify appsync iotcore')],
    checks: ['I can match every AI service to its input (image, text, speech, document)', 'I know SageMaker vs Bedrock vs Q', 'I know WorkSpaces vs AppStream 2.0'] },

  { n: '15', t: 'Management, Monitoring & Developer Tools', d: 'tech', min: 45,
    know: ['<b>CloudWatch</b> = metrics, logs, alarms, dashboards. <b>AWS Health Dashboard</b> = AWS service events that affect you. <b>Trusted Advisor</b> = best-practice checks (cost, security, performance, fault tolerance, service limits, operational excellence).',
      '<b>Systems Manager</b> = operate servers at scale (patch, run commands, Session Manager, Parameter Store). <b>Compute Optimizer</b> = right-sizing recommendations. <b>Service Quotas</b>, <b>License Manager</b>, <b>Service Catalog</b> (approved products).',
      'Infrastructure as code: <b>CloudFormation</b> (templates), <b>CDK</b> (code). Access: <b>Management Console</b>, <b>CLI</b>, <b>SDKs</b>.',
      '<b>Tags</b> (key/value labels) + <b>Resource Groups</b> group resources by tag; <b>Tag Editor</b> adds tags in bulk across services and Regions.',
      'Developer tools: <b>CodeBuild</b> (build/test), <b>CodePipeline</b> (CI/CD), <b>CodeDeploy</b>, <b>X-Ray</b> (trace requests through an app).'],
    traps: ['Performance metrics and alarms → CloudWatch. Audit trail → CloudTrail.', 'Recreate the same environment repeatedly → CloudFormation.', 'Health Dashboard shows AWS-side issues; CloudWatch shows your resources.'],
    links: [['IaC Explorer', EX('IaC-Explorer')], ['CI/CD Explorer', EX('CICD-Explorer')], ...fg('cloudwatch health trustedadvisor ssm computeoptimizer servicequotas licensemanager servicecatalog cloudformation cdk cli console codebuild codepipeline codedeploy xray')],
    checks: ['I know CloudWatch vs CloudTrail vs Config', 'I know the Trusted Advisor check categories', 'I know what CloudFormation and Systems Manager do'] },

  { n: '16', t: 'Pricing & Billing', d: 'billing', min: 40,
    know: ['Pay for <b>compute time, storage, and data transfer out</b>. Data transfer <b>in</b> is free.',
      '<b>Free Tier</b>: accounts created from <b>15 July 2025</b> get a credit-based plan (up to $200 in credits, free plan up to 6 months); older accounts used 12-month offers. Some services are always free up to limits.',
      'Tools: <b>Pricing Calculator</b> (estimate before building), <b>Cost Explorer</b> (visualise and forecast past/current spend), <b>Budgets</b> (alerts when cost/usage crosses a threshold), <b>Cost and Usage Report</b> (most detailed data), <b>Cost Anomaly Detection</b>, <b>Billing dashboard</b>.',
      '<b>Consolidated billing</b> in Organizations: one bill, combined volume discounts, shared RIs/Savings Plans. <b>Cost allocation tags</b> to split costs by project.',
      '<b>AWS Marketplace</b> = buy third-party software that runs on AWS.'],
    traps: ['Estimate a new project → Pricing Calculator (not Cost Explorer).', 'Get notified before overspending → Budgets.', 'Lowest price per hour isn\'t always the lowest total cost (look at commitment and usage).'],
    links: [...fg('pricingcalc costexplorer budgets cur marketplace'), ['SAA Explorer · Cost', EX('SAA-Explorer', 'cost')]],
    checks: ['I know Pricing Calculator vs Cost Explorer vs Budgets vs CUR', 'I know what consolidated billing gives', 'I know the Free Tier basics'] },

  { n: '17', t: 'Support Plans & Resources', d: 'billing', min: 30,
    know: ['<b>Exam names</b> (the CLF-C02 guide was written before 2026, so questions may use these): <b>Basic</b> (free) · <b>Developer</b> (business-hours email) · <b>Business</b> (24/7 phone/chat, full Trusted Advisor) · <b>Enterprise On-Ramp</b> (pool of TAMs, 30-min business-critical response) · <b>Enterprise</b> (designated TAM, Concierge billing team, 15-min business-critical response).',
      '<b>Real world in 2026</b>: AWS now sells <b>Business Support+, Enterprise Support and Unified Operations</b>; Developer, Business and Enterprise On-Ramp stopped taking new customers in Dec 2025 and end on 1 Jan 2027. On the exam, answer with the plan names shown in the options.',
      'Other help: <b>AWS re:Post</b> (community Q&A), <b>Knowledge Center</b>, <b>AWS Partner Network</b> (consulting/technology partners), <b>AWS Professional Services</b>, <b>AWS Skill Builder</b> (training), <b>Trust & Safety</b> (abuse).'],
    traps: ['Designated TAM → Enterprise. Pool of TAMs → Enterprise On-Ramp.', 'Full set of Trusted Advisor checks needs Business or higher.', 'Basic still includes the Health Dashboard, core Trusted Advisor checks and customer service for billing/account.'],
    links: [...fg('support trustedadvisor')],
    checks: ['I can rank the support plans and know which has a TAM', 'I know the 2026 plan change and the exam names', 'I know where to find community help vs partners'] },

  { n: '18', t: 'Exam Day & Final Review', d: 'exam', min: 30,
    know: ['Format: <b>65 questions</b> (50 scored + 15 unscored), <b>90 minutes</b>, multiple choice and multiple response, scaled score 100–1000, <b>pass = 700</b>. Domains: Concepts 24%, Security 30%, Technology 34%, Billing 12%. No penalty for guessing — never leave a blank.',
      '<b>ESL +30</b>: if English is not your first language, AWS gives 30 extra minutes. Request it in your AWS Certification account <b>before</b> scheduling; it can\'t be added to an exam already booked, so adding it means rescheduling.',
      'Test center: arrive 30 minutes early with a valid, unexpired government photo ID whose name <b>exactly matches</b> your AWS Certification account. Check your confirmation email for the center\'s rules.',
      'Read the last sentence first, find the keyword (cheapest, least effort, most secure), eliminate, then pick the most managed option that meets every requirement. Flag and return; don\'t get stuck.'],
    traps: ['Name mismatch between ID and account can get you turned away — check it this week.', 'Don\'t cram new topics the night before: run the checklist below, then sleep.'],
    links: [['CCP Exam Simulator', 'exam.html'], ['"Which service?" Drill', 'drill.html'], ['Service Field Guide · Quiz', FG + 'quiz'], ['Field Guide · Exam traps', FG + 'traps'], ['Architecture Atlas', ATLAS]],
    checks: ['My ID name matches my AWS Certification account', 'I decided about ESL +30', 'I scored 80%+ on two full practice exams', 'I reviewed every mistake in the review deck', 'I know the route and timing to the test center'] }
  ];

  const MISTAKES = [
    ['Region vs AZ', 'Treating them as the same. AZs are inside a Region; multiple AZs = high availability.'],
    ['HA vs performance', 'Multi-AZ keeps you up; it doesn\'t make you faster.'],
    ['CloudTrail vs CloudWatch', 'Audit / "who did it" → CloudTrail. Metrics, logs, alarms → CloudWatch.'],
    ['Config vs Artifact', 'Config checks YOUR resources. Artifact gives AWS\'s compliance reports.'],
    ['Root user', 'Never for daily work. MFA on, no access keys.'],
    ['Keys on EC2', 'Apps on EC2 use an IAM role, not access keys.'],
    ['Inspector vs GuardDuty', 'Inspector = vulnerabilities. GuardDuty = active threats.'],
    ['Shield vs WAF', 'Shield = DDoS. WAF = bad web requests (SQLi, XSS).'],
    ['Versioning vs lifecycle', 'Versioning keeps old copies. Lifecycle moves/expires by age.'],
    ['Archive retrieval', 'Glacier is cheap to store, not to retrieve; Deep Archive takes hours.'],
    ['S3 as a disk', 'S3 is object storage. A server\'s disk is EBS.'],
    ['Multi-AZ vs read replica', 'Multi-AZ = availability. Read replica = read performance.'],
    ['SG vs NACL', 'Only NACLs can deny. SGs are stateful, NACLs stateless.'],
    ['VPN vs Direct Connect', 'Fast + encrypted over internet → VPN. Private, consistent → Direct Connect.'],
    ['SQS vs SNS', 'Queue to pull later → SQS. Push to many → SNS.'],
    ['Polly vs Transcribe', 'Polly talks (text → speech). Transcribe listens (speech → text).'],
    ['Pricing tools', 'Before building → Pricing Calculator. Analyse spend → Cost Explorer. Alerts → Budgets.'],
    ['Spot for critical work', 'Spot can be interrupted; never for databases or must-finish jobs.'],
    ['TAM', 'Designated TAM only on Enterprise. Pool of TAMs on Enterprise On-Ramp.'],
    ['Lambda limit', 'Max 15 minutes per run.']
  ];

  const RETIRED = [
    ['Amazon Elastic Transcoder', 'Shut down 13 Nov 2025 → AWS Elemental MediaConvert.'],
    ['Amazon Pinpoint', 'Support ended 30 Oct 2026. SMS/push/voice live on as AWS End User Messaging; email → SES.'],
    ['Amazon CodeGuru Reviewer', 'Closed to new customers 7 Nov 2025 (Profiler continues). Code review → Amazon Q Developer, Inspector.'],
    ['S3 Glacier (vault service) / Vault Lock', 'The old vault-based Glacier service closed to new customers Nov 2025. The S3 Glacier <i>storage classes</i> are still current; use S3 Object Lock.'],
    ['Application Discovery Service', 'Closed to new customers Nov 2025, but still listed in the CLF-C02 guide. Know what it does.'],
    ['Amazon Sumerian · AWS CodeStar · AWS OpsWorks · AWS Cloud9 (new accounts)', 'Retired or closed to new customers 2023–2024. Older notes still teach them.'],
    ['Renamed', 'CloudWatch Events → EventBridge · Personal Health Dashboard → AWS Health Dashboard · "CMK" → KMS key · Fault Injection Simulator → Fault Injection Service · Developer/Business support → Business Support+ (see 17).']
  ];

  const LABS = [
    { n: 'L1', t: 'Secure your new AWS account (do this first)', min: 25, cost: 'Free',
      steps: ['Create the account and choose the <b>Free plan</b> if offered.', 'Turn on <b>MFA for the root user</b> (authenticator app).', 'In <b>Billing → Budgets</b>, create a monthly cost budget of $1 with an email alert at 80% and 100%.', 'Create an admin identity for daily work (IAM Identity Center user, or an IAM user in an Admins group) and enable MFA on it.', 'Sign out of root. From now on, use only the admin identity.'],
      learn: 'Root best practices, MFA, IAM, Budgets (modules 06 and 16).', clean: 'Nothing to delete. Keep the budget.' },
    { n: 'L2', t: 'Host a static website on S3', min: 30, cost: 'Free tier / a few cents',
      steps: ['Create an S3 bucket in your nearest Region (e.g. ap-southeast-1).', 'Upload an <code>index.html</code> ("Hello from Raul").', 'Enable <b>Static website hosting</b> in the bucket properties.', 'Turn off Block Public Access <b>for this bucket only</b> and add a bucket policy allowing <code>s3:GetObject</code> to everyone.', 'Open the website endpoint URL. Then enable <b>versioning</b>, upload a new version, and see both versions.'],
      learn: 'S3 buckets, objects, bucket policies, Block Public Access, versioning (module 10).', clean: 'Empty the bucket (all versions), then delete it.' },
    { n: 'L3', t: 'Launch EC2 with user data', min: 30, cost: 'Free tier eligible t3.micro / t2.micro',
      steps: ['Launch an Amazon Linux instance (free-tier eligible type) in a public subnet.', 'Security group: allow HTTP (80) from anywhere; no SSH needed.', 'In <b>Advanced details → User data</b>, paste:<br><code>#!/bin/bash<br>dnf install -y httpd<br>echo "Hello from $(hostname)" &gt; /var/www/html/index.html<br>systemctl enable --now httpd</code>', 'Open the public IP in your browser.', 'Look at the instance type, AZ and pricing options in the console.'],
      learn: 'EC2, user data, security groups, AZs, purchase options (modules 09 and 12).', clean: '<b>Terminate</b> the instance (stop is not enough for EBS charges).' },
    { n: 'L4', t: 'CloudWatch alarm + CloudTrail lookup', min: 20, cost: 'Free',
      steps: ['In CloudWatch, create an alarm on an EC2 metric (CPUUtilization > 70% for 5 minutes) that sends an email via SNS (do this during L3).', 'Confirm the SNS subscription email.', 'Open <b>CloudTrail → Event history</b> and find your own <code>RunInstances</code> and <code>CreateBucket</code> events: who, when, from which IP.', 'Open <b>Trusted Advisor</b> and the <b>Health Dashboard</b> and read what Basic support shows you.'],
      learn: 'CloudWatch vs CloudTrail, SNS, Trusted Advisor, Health Dashboard (modules 08, 13, 15).', clean: 'Delete the alarm and the SNS topic.' }
  ];

  const GLOSS = [
    ['Availability Zone', 'One or more data centers in a Region, isolated from other AZs.'], ['Region', 'Geographic area with 3+ AZs.'], ['Edge location', 'Site that caches content near users (CloudFront).'],
    ['Elasticity', 'Automatically add and remove capacity with demand.'], ['Scalability', 'Ability to grow to handle more load.'], ['High availability', 'Keeps working when a component or AZ fails.'], ['Fault tolerance', 'Keeps working with no interruption at all.'],
    ['CapEx / OpEx', 'Up-front buying vs pay-as-you-go spending.'], ['IaaS / PaaS / SaaS', 'You manage OS / you manage code / you just use the app.'], ['Shared responsibility', 'AWS secures OF the cloud; you secure IN the cloud.'],
    ['Least privilege', 'Give only the permissions needed.'], ['MFA', 'Second factor (code from an app/device) at sign-in.'], ['IAM role', 'Identity with temporary credentials that services, apps or other accounts assume.'], ['Policy', 'JSON document that allows or denies actions.'], ['SCP', 'Organizations policy that sets the maximum permissions for accounts.'],
    ['Encryption at rest / in transit', 'Stored data encrypted (KMS) / data moving encrypted (TLS).'], ['DDoS', 'Flood of traffic to take a site down (Shield).'],
    ['AMI', 'Template to launch an EC2 instance.'], ['User data', 'Script that runs at an instance\'s first boot.'], ['Instance metadata', 'Info an instance reads about itself (169.254.169.254).'], ['Auto Scaling group', 'Group of instances that grows/shrinks automatically.'], ['Load balancer', 'Spreads traffic across healthy targets.'], ['Serverless', 'No servers to manage; pay per use (Lambda, Fargate, DynamoDB).'], ['Container', 'Packaged app + dependencies (ECS, EKS, Fargate).'],
    ['Object / block / file storage', 'S3 / EBS / EFS-FSx.'], ['Durability vs availability', 'Data not lost (11 nines for S3) vs data reachable now.'], ['Lifecycle rule', 'Moves or deletes S3 objects by age.'], ['Snapshot', 'Point-in-time backup of an EBS volume.'],
    ['Relational vs NoSQL', 'Tables with SQL joins (RDS) vs flexible key-value/documents (DynamoDB).'], ['Data warehouse', 'Database for analytics on large history (Redshift).'],
    ['VPC', 'Your isolated private network in AWS.'], ['Subnet', 'Range of IPs in one AZ; public or private.'], ['Internet Gateway', 'Lets a VPC talk to the internet.'], ['NAT gateway', 'Lets private subnets reach out to the internet, not the reverse.'], ['Security group', 'Stateful allow-only firewall on an instance.'], ['Network ACL', 'Stateless allow/deny firewall on a subnet.'], ['CDN', 'Content delivery network (CloudFront).'], ['DNS', 'Turns names into IP addresses (Route 53).'],
    ['Decoupling', 'Parts talk through queues/events so one failure doesn\'t break all.'], ['ETL', 'Extract, transform, load data (Glue).'],
    ['On-Demand / Spot / Savings Plan / RI', 'No commitment / spare capacity cheap but interruptible / 1–3 year commitment discounts.'], ['Consolidated billing', 'One bill for all accounts in an Organization, with combined discounts.'], ['Cost allocation tag', 'Label to split costs by project/team.'], ['TCO', 'Total cost of ownership (cloud vs on-premises).'], ['TAM', 'Technical Account Manager (Enterprise support).'],
    ['RTO / RPO', 'How long you can be down / how much data you can lose.'], ['7 Rs', 'Migration strategies: retire, retain, relocate, rehost, replatform, repurchase, refactor.'], ['CAF', 'Cloud Adoption Framework: 6 perspectives, Envision → Align → Launch → Scale.'], ['Well-Architected', '6 pillars to review a workload.'], ['IaC', 'Infrastructure as code (CloudFormation, CDK).'], ['Agility', 'Getting new resources in minutes, so you can experiment fast.'], ['Measured service', 'Usage is metered; you pay for what you use.'], ['Multi-tenancy', 'Many customers share the same hardware, isolated from each other.'], ['Credential Report', 'Account-wide list of IAM users and the status of their credentials.'], ['Access Advisor', 'Shows a user\'s permitted services and when each was last used.'], ['Elastic IP', 'Fixed public IPv4 address you keep until you release it.'], ['Penetration test', 'Authorized simulated attack on your own resources.'], ['Chaos engineering', 'Breaking things on purpose to prove resilience (FIS).']
  ];

  const SHORT = ['Concepts', 'Global infra', 'CAF & migration', 'Well-Architected', 'Shared resp.', 'IAM', 'Security svcs', 'Compliance', 'Compute', 'Storage', 'Databases', 'Networking', 'Integration', 'AI/ML & more', 'Mgmt & dev', 'Pricing', 'Support', 'Exam day'];
  /* ---------- state ---------- */
  const KEY = 'rmc-ccp-path';
  let st = {}; try { st = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const allChecks = M.reduce((a, m) => a + m.checks.length, 0) + LABS.length;
  const doneCount = () => Object.keys(st).filter(k => st[k]).length;

  const app = document.getElementById('app');
  const chip = d => d === 'exam' ? '<span class="tag" style="background:var(--teal)">EXAM DAY</span>' : `<span class="tag" style="background:${{ concepts: 'var(--blue)', security: 'var(--red)', tech: 'var(--purple)', billing: 'var(--green)' }[d]}">${DOM[d][0].toUpperCase()} · ${DOM[d][1]}</span>`;
  const mDone = m => m.checks.every((_, i) => st[m.n + '.' + i]);

  function render() {
    const pct = Math.round(doneCount() / allChecks * 100);
    app.innerHTML = `
      <section class="card" style="padding:22px">
        <p class="kicker">AWS CLOUD PRACTITIONER (CLF-C02) · STUDY PATH</p>
        <h1>01 → 18: one path to pass on the first try</h1>
        <p class="mute">Eighteen numbered modules in exam-guide order. Each has what you must know, the traps the exam sets, links into your Field Guide, City Map and Explorer courses, and an "I can…" checklist. Tick every box, do the four labs, then score 80%+ twice in the simulator.</p>
        <div style="display:flex;gap:14px;align-items:center;margin-top:12px"><div class="bar" style="flex:1"><i style="width:${pct}%"></i></div><b>${doneCount()}/${allChecks} · ${pct}%</b></div>
        <div class="path" style="margin-top:14px">${M.map(m => `<a href="#m${m.n}" style="text-decoration:none"><span class="${mDone(m) ? 'done' : ''}">${m.n} ${SHORT[+m.n - 1]}</span></a>`).join('')}<a href="#labs" style="text-decoration:none"><span>LABS</span></a><a href="#mistakes" style="text-decoration:none"><span>MISTAKES</span></a><a href="#retired" style="text-decoration:none"><span>RETIRED</span></a><a href="#glossary" style="text-decoration:none"><span>GLOSSARY</span></a></div>
      </section>
      ${M.map(m => `
      <section class="card mod" id="m${m.n}" style="margin-top:14px">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span class="num">${m.n}</span><h2 style="margin:0">${m.t}</h2>${chip(m.d)}<span class="mute" style="margin-left:auto;font-size:11px">~${m.min} min ${mDone(m) ? '· <b style="color:var(--green)">✓ DONE</b>' : ''}</span></div>
        <div class="cols">
          <div><h3>MUST KNOW</h3><ul>${m.know.map(k => `<li>${k}</li>`).join('')}</ul></div>
          <div><h3 style="color:var(--red)">EXAM TRAPS</h3><ul>${m.traps.map(k => `<li>${k}</li>`).join('')}</ul>
            <h3 style="margin-top:12px">STUDY WITH</h3><div class="lk">${m.links.map(([t, u]) => `<a href="${u}" target="${u.startsWith('http') ? '_blank' : '_self'}" rel="noopener">${HUB.esc(t)}</a>`).join('')}${m.d !== 'exam' ? `<a href="exam.html#domain=${m.d}">▶ 20 ${DOM[m.d][0]} questions</a>` : ''}</div>
            <h3 style="margin-top:12px">I CAN…</h3>${m.checks.map((c, i) => `<label class="ck"><input type="checkbox" data-k="${m.n}.${i}" ${st[m.n + '.' + i] ? 'checked' : ''}> ${c}</label>`).join('')}</div>
        </div>
      </section>`).join('')}
      <h2 id="mistakes">THE 20 MOST COMMON CCP MISTAKES</h2>
      <div class="grid g3">${MISTAKES.map(([a, b], i) => `<div class="card"><b style="color:var(--red)">${String(i + 1).padStart(2, '0')} · ${a}</b><div class="mute" style="margin-top:4px">${b}</div></div>`).join('')}</div>
      <h2 id="retired">RETIRED OR RENAMED: DON'T OVER-STUDY</h2>
      <p class="mute">Many free notes were written in 2022–2023. If a question shows one of these, answer from what the service did. Don't spend study time on it.</p>
      <div class="card"><table class="hist">${RETIRED.map(([a, b]) => `<tr><td style="width:34%"><b>${a}</b></td><td>${b}</td></tr>`).join('')}</table></div>
      <h2 id="labs">HANDS-ON LABS (FREE-TIER SAFE)</h2>
      <p class="mute">Do L1 before anything else. Always do the clean-up step. A Budget alert warns you, but it does not stop charges.</p>
      <div class="grid g2">${LABS.map(l => `<div class="card"><div style="display:flex;gap:10px;align-items:center"><span class="num">${l.n}</span><h3 style="margin:0">${l.t}</h3></div>
        <p class="mute" style="font-size:11px">~${l.min} min · ${l.cost}</p><ol>${l.steps.map(s => `<li>${s}</li>`).join('')}</ol>
        <p style="font-size:12px"><b>You learn:</b> ${l.learn}<br><b style="color:var(--red)">Clean up:</b> ${l.clean}</p>
        <label class="ck"><input type="checkbox" data-k="${l.n}" ${st[l.n] ? 'checked' : ''}> Done and cleaned up</label></div>`).join('')}</div>
      <h2 id="glossary">GLOSSARY</h2>
      <input id="gq" placeholder="Filter terms…" style="width:100%;padding:9px 12px;border:1.5px solid var(--line);border-radius:6px;background:var(--panel);color:var(--ink);font-family:inherit;margin-bottom:10px">
      <div class="card"><table class="hist" id="gt">${GLOSS.sort((a, b) => a[0].localeCompare(b[0])).map(([a, b]) => `<tr><td style="width:32%"><b>${a}</b></td><td>${b}</td></tr>`).join('')}</table></div>
      <h2>EXAM-EVE CHECKLIST</h2>
      <div class="card"><ol>
        <li>Skim modules 01–18 "Exam traps" only (30 min).</li><li>Read the 20 common mistakes above.</li><li>One last <a href="drill.html">drill</a> round, no new topics.</li>
        <li>Pack: valid government photo ID (name matches your AWS Certification account), confirmation email, directions to the test center.</li>
        <li>Sleep. Arrive 30 minutes early.</li></ol>
        <p class="mute" style="font-size:11px">If you miss more than 2 items in any module checklist the week before, do a 20-question domain practice for that domain before your next full exam.</p></div>
      <p class="mute" style="font-size:11px;margin-top:20px">Numbered-path format inspired by <a href="https://github.com/Thiago-code-lab/aws-certified-cloud-practitioner-brasil" target="_blank" rel="noopener">Thiago-code-lab/aws-certified-cloud-practitioner-brasil</a> (MIT), cross-checked against <a href="https://github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes" target="_blank" rel="noopener">kananinirav/AWS-Certified-Cloud-Practitioner-Notes</a> (MIT). All content written for this hub. Check the <a href="https://aws.amazon.com/certification/certified-cloud-practitioner/" target="_blank" rel="noopener">official exam page</a> for the current guide.</p>`;
    app.querySelectorAll('input[type=checkbox]').forEach(cb => cb.onchange = () => { st[cb.dataset.k] = cb.checked; save(); const y = window.scrollY; render(); window.scrollTo(0, y); });
    const gq = app.querySelector('#gq'); gq.oninput = () => { const v = gq.value.toLowerCase(); app.querySelectorAll('#gt tr').forEach(tr => tr.style.display = tr.textContent.toLowerCase().includes(v) ? '' : 'none'); };
  }
  try { localStorage.setItem('rmc-ccp-total', String(allChecks)); } catch (e) {}
  render();
  if (location.hash) { const el = document.querySelector(location.hash); if (el) el.scrollIntoView(); }
})();
