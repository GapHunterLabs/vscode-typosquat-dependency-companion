import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levenshteinDistance, findTyposquatSuspects } from '../typosquatDetector';

test('levenshteinDistance is 0 for identical strings', () => {
  assert.equal(levenshteinDistance('react', 'react'), 0);
});

test('levenshteinDistance counts a single substitution', () => {
  assert.equal(levenshteinDistance('react', 'reqct'), 1);
});

test('levenshteinDistance counts a single insertion', () => {
  assert.equal(levenshteinDistance('lodash', 'lodashh'), 1);
});

test('levenshteinDistance counts a single deletion', () => {
  assert.equal(levenshteinDistance('express', 'expres'), 1);
});

test('levenshteinDistance counts 2 edits correctly', () => {
  assert.equal(levenshteinDistance('axios', 'axioz1'), 2); // substitution + insertion
});

const POPULAR = ['react', 'lodash', 'express', 'axios', 'chalk'];

test('findTyposquatSuspects does not flag the exact popular package name', () => {
  assert.deepEqual(findTyposquatSuspects(['react', 'lodash'], POPULAR), []);
});

test('findTyposquatSuspects flags a 1-character-off name (insertion)', () => {
  const suspects = findTyposquatSuspects(['lodashh'], POPULAR);
  assert.equal(suspects.length, 1);
  assert.equal(suspects[0].similarTo, 'lodash');
  assert.equal(suspects[0].distance, 1);
});

test('findTyposquatSuspects flags a 1-character-off name (substitution)', () => {
  const suspects = findTyposquatSuspects(['reqct'], POPULAR);
  assert.equal(suspects.length, 1);
  assert.equal(suspects[0].similarTo, 'react');
});

test('findTyposquatSuspects flags a 2-character-off name', () => {
  const suspects = findTyposquatSuspects(['axioz1'], POPULAR);
  assert.equal(suspects.length, 1);
  assert.equal(suspects[0].similarTo, 'axios');
  assert.equal(suspects[0].distance, 2);
});

test('findTyposquatSuspects does not flag a name more than 2 edits away', () => {
  const suspects = findTyposquatSuspects(['expresssssss'], POPULAR);
  assert.deepEqual(suspects, []);
});

test('findTyposquatSuspects does not flag a genuinely unrelated name', () => {
  assert.deepEqual(findTyposquatSuspects(['my-internal-utils'], POPULAR), []);
});

test('findTyposquatSuspects skips very short names entirely (too many legitimate near-neighbors)', () => {
  assert.deepEqual(findTyposquatSuspects(['ax'], POPULAR), []);
});

test('findTyposquatSuspects reports the closest match when multiple are within range', () => {
  const suspects = findTyposquatSuspects(['chalkk'], POPULAR);
  assert.equal(suspects.length, 1);
  assert.equal(suspects[0].similarTo, 'chalk');
});
