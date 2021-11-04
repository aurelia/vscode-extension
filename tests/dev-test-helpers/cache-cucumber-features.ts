import * as fs from 'fs';
import * as path from 'path';

import { loadFeatures } from 'jest-cucumber';

import { getTestDir } from '../common/files/get-test-dir';

const TEST_PATH = getTestDir();
const CACHE_FILE_PATH = path.resolve(
  TEST_PATH,
  'dev-test-helpers/features-cache.json'
);

export type ParsedFeatures = ReturnType<typeof loadFeatures>;

export function createFeatureCache(features: ParsedFeatures): void {
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(features));
}

export function readFeatureCache(): ParsedFeatures | undefined {
  const data = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
  if (!data || data === '{}') return;

  const parsedFeatures = (JSON.parse(data) as unknown) as ParsedFeatures;
  return parsedFeatures;
}

export function resetFeatureCache(): void {
  fs.writeFileSync(CACHE_FILE_PATH, '{}');
}
