import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

async function checkCoverage() {
  try {
    const coveragePath = path.resolve(__dirname, 'coverage', 'coverage-final.json');
    
    if (!fs.existsSync(coveragePath)) {
      throw new Error(`Arquivo de cobertura não encontrado em: ${coveragePath}`);
    }

    const rawData = await fs.promises.readFile(coveragePath, 'utf-8');
    const data: CoverageData = JSON.parse(rawData);

    // Agregar métricas de todos os arquivos
    const aggregated = {
      statements: { total: 0, covered: 0, pct: 0 },
      branches: { total: 0, covered: 0, pct: 0 },
      functions: { total: 0, covered: 0, pct: 0 },
      lines: { total: 0, covered: 0, pct: 0 }
    };

    // Calcular totais
    Object.values(data).forEach(file => {
      aggregated.statements.total += Object.keys(file.statementMap).length;
      aggregated.statements.covered += Object.values(file.s).filter(v => v > 0).length;
      
      aggregated.branches.total += Object.keys(file.branchMap).length;
      aggregated.branches.covered += Object.values(file.b).filter(arr => arr.some(v => v > 0)).length;
      
      aggregated.functions.total += Object.keys(file.fnMap).length;
      aggregated.functions.covered += Object.values(file.f).filter(v => v > 0).length;
      
      // Para linhas, usamos as statements como aproximação
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

    // Verificar cobertura mínima
    const metrics = ['statements', 'branches', 'functions', 'lines'] as const;
    let allPassed = true;

    console.log('📊 Resultados da Cobertura de Testes:');
    console.log('----------------------------------');

    metrics.forEach(metric => {
      const coverage = aggregated[metric].pct;
      const passed = coverage >= MIN_COVERAGE;
      
      if (!passed) {
        allPassed = false;
      }

      console.log(
        `${passed ? '✅' : '❌'} ${metric.padEnd(10)}: ${coverage.toString().padStart(3)}%` +
        (passed ? '' : ` (mínimo ${MIN_COVERAGE}%)`)
      );
    });

    console.log('----------------------------------');

    if (!allPassed) {
      console.error('⛔ Algumas métricas não atingiram a cobertura mínima');
      process.exit(1);
    }

    console.log('🎉 Todas as métricas de cobertura foram atingidas!');
  } catch (error) {
    console.error('⚠️ Erro ao verificar cobertura:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

checkCoverage();