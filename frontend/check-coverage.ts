import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getOctokit } from '@actions/github';

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

async function postCommentToPR(coverageResults: string) {
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_PULL_REQUEST_ID) {
    console.log('Not in PR context, skipping comment');
    return;
  }

  const octokit = getOctokit(process.env.GITHUB_TOKEN);
  const [owner, repo] = process.env.GITHUB_REPOSITORY!.split('/');

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: parseInt(process.env.GITHUB_PULL_REQUEST_ID!),
    body: coverageResults
  });
}

async function checkCoverage() {
  try {
    const coveragePath = path.resolve(__dirname, 'coverage', 'coverage-summary.json');
    
    if (!fs.existsSync(coveragePath)) {
      throw new Error(`Arquivo de cobertura não encontrado em: ${coveragePath}`);
    }

    const rawData = await fs.promises.readFile(coveragePath, 'utf-8');
    const data: CoverageSummary = JSON.parse(rawData);

    const metrics = ['statements', 'branches', 'functions', 'lines'] as const;
    let allPassed = true;
    let coverageMessage = '## 📊 Test Coverage Results\n\n';

    coverageMessage += '| Metric      | Coverage | Status |\n';
    coverageMessage += '|-------------|----------|--------|\n';

    metrics.forEach(metric => {
      const coverage = data.total[metric].pct;
      const passed = coverage >= MIN_COVERAGE;
      
      if (!passed) {
        allPassed = false;
      }

      coverageMessage += `| ${metric.padEnd(11)} | ${coverage.toString().padStart(3)}% | ${passed ? '✅' : '❌'} |\n`;
    });

    coverageMessage += `\n**Minimum required coverage:** ${MIN_COVERAGE}%`;

    console.log(coverageMessage);

    // Post to GitHub PR if in CI environment
    if (process.env.CI && process.env.GITHUB_ACTIONS) {
      await postCommentToPR(coverageMessage);
    }

    if (!allPassed) {
      console.error('⛔ Algumas métricas não atingiram a cobertura mínima');
      process.exit(1);
    }

    console.log('🎉 Todas as métricas de cobertura foram atingidas!');
  } catch (error) {
    const errorMessage = `⚠️ Erro ao verificar cobertura: ${error instanceof Error ? error.message : error}`;
    console.error(errorMessage);
    
    if (process.env.CI && process.env.GITHUB_ACTIONS) {
      await postCommentToPR(errorMessage);
    }
    
    process.exit(1);
  }
}

checkCoverage();