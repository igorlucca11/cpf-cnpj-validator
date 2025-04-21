import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Octokit } from '@octokit/rest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CoverageMetric {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

interface CoverageSummary {
  total: {
    lines: CoverageMetric;
    statements: CoverageMetric;
    functions: CoverageMetric;
    branches: CoverageMetric;
  };
}

const MIN_COVERAGE = 75;

async function postCommentToPR(message: string) {
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_PULL_REQUEST_ID) {
    console.log('Not in PR context, skipping comment');
    return;
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = process.env.GITHUB_REPOSITORY!.split('/');

  try {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: Number(process.env.GITHUB_PULL_REQUEST_ID),
      body: message
    });
  } catch (error) {
    console.error('Failed to post comment:', error);
  }
}

async function checkCoverage() {
  try {
    const coveragePath = path.resolve(__dirname, 'coverage', 'coverage-summary.json');
    
    if (!fs.existsSync(coveragePath)) {
      throw new Error(`Coverage file not found at: ${coveragePath}`);
    }

    const rawData = await fs.promises.readFile(coveragePath, 'utf-8');
    const data: CoverageSummary = JSON.parse(rawData);

    const metrics = ['statements', 'branches', 'functions', 'lines'] as const;
    let allPassed = true;

    let commentBody = `## 📊 Test Coverage Report\n\n`;
    commentBody += `| Metric      | Coverage | Status  |\n`;
    commentBody += `|-------------|----------|---------|\n`;

    metrics.forEach(metric => {
      const coverage = data.total[metric].pct;
      const passed = coverage >= MIN_COVERAGE;
      if (!passed) allPassed = false;

      commentBody += `| ${metric.padEnd(11)} | ${coverage.toString().padStart(3)}% | ${passed ? '✅ Pass' : '❌ Fail'} |\n`;
    });

    commentBody += `\n**Minimum required coverage:** ${MIN_COVERAGE}%\n\n`;
    commentBody += `_Generated at ${new Date().toISOString()}_`;

    console.log(commentBody);

    // Post to PR if in CI environment
    if (process.env.CI === 'true') {
      await postCommentToPR(commentBody);
    }

    if (!allPassed) {
      console.error('❌ Some metrics did not meet minimum coverage');
      process.exit(1);
    }

    console.log('✅ All coverage metrics passed!');
  } catch (error) {
    const errorMessage = `⚠️ Error checking coverage: ${error instanceof Error ? error.message : error}`;
    console.error(errorMessage);
    
    if (process.env.CI === 'true') {
      await postCommentToPR(errorMessage);
    }
    
    process.exit(1);
  }
}

checkCoverage();