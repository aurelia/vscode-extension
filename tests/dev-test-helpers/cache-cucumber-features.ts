import * as fs from 'fs';
import * as path from 'path';
import { loadFeatures } from 'jest-cucumber';

const TEST_PATH = path.resolve(__dirname, '..');
const CACHE_FILE_PATH = path.resolve(
  TEST_PATH,
  'dev-test-helpers/features-cache.json'
);

export type ParsedFeatures = ReturnType<typeof loadFeatures>;

export function createFeatureCache(features: ParsedFeatures) {
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(features));
}

export function readFeatureCache(): ParsedFeatures | undefined {
  const data = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
  if (!data || data === '{}') return;

  const parsedFeatures = (JSON.parse(data) as unknown) as ParsedFeatures;
  return parsedFeatures;
}

export function resetFeatureCache(): void {
  fs.writeFileSync(CACHE_FILE_PATH, `{}`);
}
