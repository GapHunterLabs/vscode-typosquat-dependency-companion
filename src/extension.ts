import * as vscode from 'vscode';
import { findTyposquatSuspects } from './typosquatDetector';
import { POPULAR_PACKAGES } from './popularPackages';
import { recordHit } from './reviewPrompt';

let diagnostics: vscode.DiagnosticCollection;

function dependencyNames(rootPackageJson: unknown): string[] {
  if (typeof rootPackageJson !== 'object' || rootPackageJson === null) return [];
  const obj = rootPackageJson as Record<string, unknown>;
  const names = new Set<string>();
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    const section = obj[field];
    if (typeof section === 'object' && section !== null) {
      for (const name of Object.keys(section)) names.add(name);
    }
  }
  return [...names];
}

function lineOfDependency(packageJsonText: string, name: string): number {
  const lines = packageJsonText.split('\n');
  const needle = `"${name}"`;
  const index = lines.findIndex((line) => line.trimStart().startsWith(needle));
  return index === -1 ? 0 : index;
}

function refresh(context: vscode.ExtensionContext, document: vscode.TextDocument): void {
  const path = document.uri.path;
  if (!path.endsWith('package.json') || path.includes('/node_modules/')) {
    diagnostics.delete(document.uri);
    return;
  }

  const text = document.getText();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    diagnostics.delete(document.uri);
    return;
  }

  const names = dependencyNames(parsed);
  const suspects = findTyposquatSuspects(names, POPULAR_PACKAGES);

  const result = suspects.map((suspect) => {
    const line = lineOfDependency(text, suspect.dependencyName);
    const range = new vscode.Range(line, 0, line, Number.MAX_SAFE_INTEGER);
    const diagnostic = new vscode.Diagnostic(
      range,
      `"${suspect.dependencyName}" is ${suspect.distance} character(s) away from the popular package "${suspect.similarTo}" -- if this wasn't intentional, it could be a typosquat.`,
      vscode.DiagnosticSeverity.Warning,
    );
    diagnostic.source = 'Typosquat Dependency Companion';
    recordHit(context, `${document.uri.toString()}:${suspect.dependencyName}`);
    return diagnostic;
  });
  diagnostics.set(document.uri, result);
}

export function activate(context: vscode.ExtensionContext): void {
  diagnostics = vscode.languages.createDiagnosticCollection('typosquatDependencyCompanion');
  context.subscriptions.push(diagnostics);

  vscode.workspace.textDocuments.forEach((document) => refresh(context, document));

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) => refresh(context, document)),
    vscode.workspace.onDidChangeTextDocument((event) => refresh(context, event.document)),
    vscode.workspace.onDidCloseTextDocument((document) => diagnostics.delete(document.uri)),
  );
}

export function deactivate(): void {
  diagnostics?.dispose();
}
