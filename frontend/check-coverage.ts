import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Octokit } from '@octokit/rest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tipos para cobertura
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

// Tipos para resultados de testes
type TestResult = {
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'skipped';
  duration?: number;
  errors?: string[];
};

type TestSuite = {
  name: string;
  status: 'passed' | 'failed';
  tests: TestResult[];
};

type TestReport = {
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  testResults: TestSuite[];
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

async function getTestResults(): Promise<TestReport> {
  const testResultsPath = path.resolve(__dirname, 'test-results.json');
  
  if (!fs.existsSync(testResultsPath)) {
    throw new Error(`Test results file not found at: ${testResultsPath}`);
  }

  const rawData = await fs.promises.readFile(testResultsPath, 'utf-8');
  return JSON.parse(rawData);
}

async function checkCoverageAndTests() {
  try {
    // 1. Processar resultados dos testes
    const testReport = await getTestResults();

    // 2. Processar cobertura
    const coveragePath = path.resolve(__dirname, 'coverage', 'coverage-final.json');
    const rawCoverageData = await fs.promises.readFile(coveragePath, 'utf-8');
    const coverageData: CoverageData = JSON.parse(rawCoverageData);

    // Calcular métricas de cobertura
    const aggregated = {
      statements: { total: 0, covered: 0, pct: 0 },
      branches: { total: 0, covered: 0, pct: 0 },
      functions: { total: 0, covered: 0, pct: 0 },
      lines: { total: 0, covered: 0, pct: 0 }
    };

    Object.values(coverageData).forEach(file => {
      aggregated.statements.total += Object.keys(file.statementMap).length;
      aggregated.statements.covered += Object.values(file.s).filter(v => v > 0).length;
      
      aggregated.branches.total += Object.keys(file.branchMap).length;
      aggregated.branches.covered += Object.values(file.b).filter(arr => arr.some(v => v > 0)).length;
      
      aggregated.functions.total += Object.keys(file.fnMap).length;
      aggregated.functions.covered += Object.values(file.f).filter(v => v > 0).length;
      
      aggregated.lines.total += Object.keys(file.statementMap).length;
      aggregated.lines.covered += Object.values(file.s).filter(v => v > 0).length;
    });

    // Calcular porcentagens
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

    // 3. Gerar relatório detalhado
    let commentBody = `## 🧪 Test Results\n\n`;
    commentBody += `✅ ${testReport.numPassedTests} passed | ❌ ${testReport.numFailedTests} failed | ⏩ ${testReport.numPendingTests} skipped\n\n`;

    // Agrupar testes por status
    const failedTests: TestResult[] = [];
    const pendingTests: TestResult[] = [];

    testReport.testResults.forEach(suite => {
      suite.tests.forEach(test => {
        if (test.status === 'failed') failedTests.push(test);
        else if (test.status === 'pending' || test.status === 'skipped') pendingTests.push(test);
      });
    });

    // Seção de testes que falharam
    if (failedTests.length > 0) {
      commentBody += `### ❌ Failed Tests:\n`;
      failedTests.forEach(test => {
        commentBody += `- **${test.name}**\n`;
        if (test.errors?.length) {
          commentBody += `  \`\`\`\n${test.errors.join('\n')}\n  \`\`\`\n`;
        }
      });
      commentBody += '\n';
    }

    // Seção de testes ignorados
    if (pendingTests.length > 0) {
      commentBody += `### ⏩ Skipped Tests:\n`;
      pendingTests.forEach(test => {
        commentBody += `- ${test.name}\n`;
      });
      commentBody += '\n';
    }

    // 4. Adicionar relatório de cobertura
    commentBody += `## 📊 Code Coverage Report\n\n`;
    commentBody += `| Metric      | Coverage | Status  |\n`;
    commentBody += `|-------------|----------|---------|\n`;

    const metrics = ['statements', 'branches', 'functions', 'lines'] as const;
    let allCoveragePassed = true;

    metrics.forEach(metric => {
      const coverage = aggregated[metric].pct;
      const passed = coverage >= MIN_COVERAGE;
      if (!passed) allCoveragePassed = false;

      commentBody += `| ${metric.padEnd(11)} | ${coverage.toString().padStart(3)}% | ${passed ? '✅ Pass' : '❌ Fail'} |\n`;
    });

    commentBody += `\n**Minimum required coverage:** ${MIN_COVERAGE}%\n\n`;
    commentBody += `_Generated at ${new Date().toISOString()}_`;

    console.log(commentBody);

    // 5. Postar no PR se estiver em CI
    if (process.env.CI === 'true') {
      await postCommentToPR(commentBody);
    }

    // 6. Finalizar com status adequado
    if (testReport.numFailedTests > 0 || !allCoveragePassed) {
      console.error('❌ Some tests failed or coverage metrics did not meet minimum');
      process.exit(1);
    }

    console.log('✅ All tests passed and coverage metrics met!');
  } catch (error) {
    const errorMessage = `⚠️ Error: ${error instanceof Error ? error.message : error}`;
    console.error(errorMessage);
    
    if (process.env.CI === 'true') {
      await postCommentToPR(errorMessage);
    }
    
    process.exit(1);
  }
}

// Executar a verificação
checkCoverageAndTests();