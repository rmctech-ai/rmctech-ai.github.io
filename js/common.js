/* Shared header, footer, theme and toast for the hub pages. */
window.HUB = (function () {
  const COURSES = [
    { key: 'linux-explorer-v1', repo: 'Linux-Explorer', name: 'Linux Explorer', em: '🐧', n: 22, sub: 'Shell, files, permissions, processes, networking' },
    { key: 'python-explorer-v1', repo: 'Python-Explorer', name: 'Python Explorer', em: '🐍', n: 22, sub: 'Python for cloud, automation and security' },
    { key: 'iam-explorer-v1', repo: 'IAM-Explorer', name: 'IAM Explorer', em: '🔐', n: 13, sub: 'Policies, roles, SCPs, policy simulator' },
    { key: 'vpc-explorer-v1', repo: 'VPC-Explorer', name: 'VPC Explorer', em: '🌐', n: 13, sub: 'Subnets, routing, SGs, NACLs, packet tracer' },
    { key: 'iac-explorer-v1', repo: 'IaC-Explorer', name: 'IaC Explorer', em: '🏗️', n: 13, sub: 'CloudFormation, SAM, Terraform, CDK' },
    { key: 'serverless-explorer-v1', repo: 'Serverless-Explorer', name: 'Serverless Explorer', em: 'λ', n: 13, sub: 'Lambda, API Gateway, DynamoDB, events' },
    { key: 'cicd-explorer-v1', repo: 'CICD-Explorer', name: 'CI/CD Explorer', em: '🚀', n: 12, sub: 'GitHub Actions, OIDC, DevSecOps' },
    { key: 'cloudsecurity-explorer-v1', repo: 'CloudSecurity-Explorer', name: 'Cloud Security Explorer', em: '🛡️', n: 12, sub: 'CloudTrail hunting, KMS, GuardDuty, IR' },
    { key: 'wellarchitected-explorer-v1', repo: 'WellArchitected-Explorer', name: 'Well-Architected Explorer', em: '🏛️', n: 16, sub: '16 design principles, 6 pillars, review board' },
    { key: 'security-journey-v1', repo: 'aws-security-journey/course', name: 'Security Journey Explorer', em: '🧭', n: 15, sub: 'Attack · Defense · In my world, Python defense lab' },
    { key: 'n8n-explorer-v1', repo: 'N8N-Explorer', name: 'n8n Explorer', em: '🔁', n: 15, sub: 'Process mapping, core nodes, AI agents, RAG' },
    { key: 'claudecode-explorer-v1', repo: 'ClaudeCode-Explorer', name: 'Claude Code Explorer', em: '🤖', n: 14, sub: 'Claude Code, MCP, Claude API, Bedrock' },
    { key: 'saa-explorer-v1', repo: 'SAA-Explorer', name: 'SAA Explorer', em: '🎓', n: 16, sub: 'SAA-C03 + roadmap to master Solutions Architect' }
  ];
  const BASE = 'https://rmctech-ai.github.io/';
  const EXAM_DATE = new Date('2026-12-15T09:00:00+08:00');
  const progress = c => { try { const p = JSON.parse(localStorage.getItem(c.key) || '{}'); const done = Object.keys(p.done || {}).length; return { done, xp: p.xp || 0, pct: Math.min(100, Math.round(done / c.n * 100)), started: !!p.last || done > 0 }; } catch (e) { return { done: 0, xp: 0, pct: 0, started: false }; } };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function theme() { let t = 'dark'; try { t = localStorage.getItem('rmc-theme') || 'dark'; } catch (e) {} document.documentElement.dataset.theme = t; }
  function header(active) {
    theme();
    const links = [['index.html', 'HOME', 'home'], ['exam.html', 'CCP EXAM', 'exam'], ['drill.html', 'SERVICE DRILL', 'drill']];
    const h = document.createElement('header'); h.className = 'top';
    h.innerHTML = `<a class="brand" href="index.html"><span class="lg">RMC</span><span><b>CLOUD LEARNING HUB</b><small>RAUL · RMCTECH-AI</small></span></a>
      <nav class="nav">${links.map(([u, t, k]) => `<a class="tbtn ${k === active ? 'on' : ''}" href="${u}">${t}</a>`).join('')}<span id="stAnchor"></span><button class="tbtn" id="themeBtn" title="Light / dark">◐</button></nav>`;
    document.body.prepend(h);
    h.querySelector('#themeBtn').onclick = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; try { localStorage.setItem('rmc-theme', t); } catch (e) {} };
    const f = document.createElement('footer'); f.className = 'wrap'; f.style.paddingTop = 0;
    f.innerHTML = `<div class="foot"><span>Built by <a href="https://github.com/rmctech-ai">Raul (@rmctech-ai)</a> · Original concept &amp; design by Raul · Only the Explorer course format is inspired by <a href="https://protocol-explorer-alpha.vercel.app/">Protocol Explorer</a></span><span>Practice questions are original study material, not real exam questions. Always confirm details in the AWS docs.</span></div>`;
    document.body.append(f);
  }
  let tt; function toast(t) { let el = document.querySelector('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.append(el); } el.textContent = t; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('show'), 2200); }
  return { COURSES, BASE, EXAM_DATE, progress, esc, header, toast };
})();
