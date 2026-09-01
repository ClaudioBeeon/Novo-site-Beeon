# GitHub Security Review Skill

A Claude Code skill that analyzes GitHub security alerts and generates actionable remediation plans.

## What It Does

When you ask Claude to review security for a GitHub repository, this skill:

1. **Fetches** alerts from Code Scanning, Dependabot, and Secret Scanning
2. **Analyzes** each vulnerability and reads affected source files
3. **Provides specific fixes** - actual code changes, not generic advice
4. **Offers to apply** the fixes directly to your codebase

## Usage in Claude

Simply ask Claude to review security for any GitHub repository:

```
Review security alerts for facebook/react

Check the dependabot alerts on https://github.com/owner/repo

What security vulnerabilities exist in my-org/my-repo?

Run a security audit on this repository
```

Claude will automatically trigger this skill and generate a prioritized remediation plan.

## Installation

### 1. Install Prerequisites

| Tool | Install |
|------|---------|
| [`gh`](https://cli.github.com/) | `brew install gh` |
| `jq` | `brew install jq` |

```bash
# Authenticate with GitHub
gh auth login

# Verify
gh auth status
```

### 2. Add the Skill to Claude Code

Copy the `SKILL.md` and `scripts/` folder to your Claude Code skills directory:

```bash
# Clone this repository
git clone https://github.com/MaTriXy/github-review-skill.git

# Copy to your Claude Code skills location
cp -r github-review-skill ~/.claude/skills/github-security-review
```

Or add it directly to a project's `.claude/skills/` directory.

## How It Works

```
User: "Review security for owner/repo"
                    │
                    ▼
           Claude triggers skill
                    │
                    ▼
┌──────────────────────────────────────────────────────────┐
│                      fetch.sh                            │
│  Fetches via gh CLI:                                     │
│  • /repos/{owner}/{repo}/code-scanning/alerts            │
│  • /repos/{owner}/{repo}/dependabot/alerts               │
│  • /repos/{owner}/{repo}/secret-scanning/alerts          │
└─────────────────────────┬────────────────────────────────┘
                          │ JSON
                          ▼
┌──────────────────────────────────────────────────────────┐
│                     analyze.py                           │
│  • Groups alerts by severity, rule, package              │
│  • Generates fix instructions per ecosystem              │
│  • Outputs markdown remediation plan                     │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
              Claude presents report to user
```

## Sample Output

When you ask Claude to review a repository, you'll get:

```markdown
# Security Review: owner/repo

## Summary
| Category        | Critical | High | Medium | Low |
|-----------------|----------|------|--------|-----|
| Code Scanning   | 0        | 2    | 5      | 3   |
| Dependabot      | 1        | 3    | 2      | 0   |
| Secret Scanning | -        | -    | -      | 2   |

## Critical Issues (Fix Immediately)

### Prototype Pollution in lodash
**Severity:** Critical
**Package:** lodash < 4.17.21

This vulnerability allows attackers to modify Object.prototype,
potentially leading to remote code execution.

**Fix:**
npm install lodash@4.17.21

---

### SQL Injection in user query
**File:** `src/api/users.js:42`
**Severity:** High

**Vulnerable code:**
const query = `SELECT * FROM users WHERE id = ${userId}`;

**Fixed code:**
const query = `SELECT * FROM users WHERE id = ?`;
db.query(query, [userId]);

**Why:** Using parameterized queries prevents SQL injection attacks.

---

## Recommended Actions
1. Run `npm install lodash@4.17.21`
2. Apply the SQL injection fix to src/api/users.js
3. Rotate the exposed AWS key (see Secret Scanning section)

Would you like me to apply any of these fixes?
```

## Trigger Phrases

The skill activates when you mention:
- "security alerts"
- "dependabot alerts"
- "code scanning"
- "secret scanning"
- "vulnerability"
- "security review"
- "security audit"

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Empty results | Enable security features in repo **Settings → Security** |
| Auth errors | Run `gh auth login` |
| Permission denied | You need "Security alerts" read access on the repo |

## Limitations

- Fetches up to 100 alerts per category (GitHub API limit)
- Requires `gh` CLI authentication with access to the target repository
- Repository must have GitHub security features enabled

## License

MIT
