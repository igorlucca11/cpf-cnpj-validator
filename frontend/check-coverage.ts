import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Octokit } from '@octokit/rest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CoverageMetric = {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
};

type FileCoverage = {
  path: string;
  statementMap: Record<string, any>;
  s: Record<string, number>;
  fnMap: Record<string, any>;
  f: Record<string, number>;
  branchMap: Record<string, any>;
  b: Record<string, number[]>;
};

type CoverageData = {
  [filePath: string]: FileCoverage;
};

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
    const coveragePath = path.resolve(__dirname, 'coverage', 'coverage-final.json');
    
    if (!fs.existsSync(coveragePath)) {
      throw new Error(`Coverage file not found at: ${coveragePath}`);
    }

    const rawData = await fs.promises.readFile(coveragePath, 'utf-8');
    const data: CoverageData = JSON.parse(rawData);

    // Aggregate metrics from all files
    const aggregated = {
      statements: { total: 0, covered: 0, pct: 0 },
      branches: { total: 0, covered: 0, pct: 0 },
      functions: { total: 0, covered: 0, pct: 0 },
      lines: { total: 0, covered: 0, pct: 0 }
    };

    // Calculate totals
    Object.values(data).forEach(file => {
      aggregated.statements.total += Object.keys(file.statementMap).length;
      aggregated.statements.covered += Object.values(file.s).filter(v => v > 0).length;
      
      aggregated.branches.total += Object.keys(file.branchMap).length;
      aggregated.branches.covered += Object.values(file.b).filter(arr => arr.some(v => v > 0)).length;
      
      aggregated.functions.total += Object.keys(file.fnMap).length;
      aggregated.functions.covered += Object.values(file.f).filter(v => v > 0).length;
      
      // For lines, we use statements as approximation
      aggregated.lines.total += Object.keys(file.statementMap).length;
      aggregated.lines.covered += Object.values(file.s).filter(v => v > 0).length;
    });

    // Calculate percentages
    aggregated.statements.pct = aggregated.statements.total > 0 
      ? Math.round((aggregated.statements.covered / aggregated.statements.total) * 100)
      : 0;
      
    aggregated.branches.pct = aggregated.branches.total > 0
      ? Math.round((aggregated.branches.covered / aggregated.branches.total) * 100)
      : 0;
      
    aggregated.functions.pct = aggregated.functions.total > 0
      ? Math.round((aggregated.functions.covered / aggregated.functions.total) * 100)
      : 0;
      
    aggregated.lines.pct = aggregated.lines.total > 0
      ? Math.round((aggregated.lines.covered / aggregated.lines.total) * 100)
      : 0;

    // Check minimum coverage
    const metrics = ['statements', 'branches', 'functions', 'lines'] as const;
    let allPassed = true;

    let commentBody = `## 📊 Test Coverage Report\n\n`;
    commentBody += `| Metric      | Coverage | Status  |\n`;
    commentBody += `|-------------|----------|---------|\n`;

    metrics.forEach(metric => {
      const coverage = aggregated[metric].pct;
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