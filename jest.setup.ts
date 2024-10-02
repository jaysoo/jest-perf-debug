/**
 * @description Jest does not clean the JSDOM document after each test run. It only clears the DOM after all tests inside an entire file are completed. We are making sure to clean it after each test
 */
import { log } from 'node:console';
import { env } from 'node:process';
import {
  getHeapSpaceStatistics,
  getHeapStatistics,
  HeapSpaceInfo,
} from 'node:v8';

type Space = Omit<HeapSpaceInfo, 'space_name'>;

export function cleanStylesFromDOM(): void {
  const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
  const styles: HTMLCollectionOf<HTMLStyleElement> | [] =
    head.getElementsByTagName('style');
  for (let i = 0; i < styles.length; i++) {
    head.removeChild(styles[i]);
  }
}

/**
 @description Used to convert bytes to megabytes for human readable outputs.
 */
function btomb(bytes: number): string {
  return `${(bytes / 1024 ** 2).toFixed(2)}MB`;
}

/**
 @description V8 heap spaces are returned in a Space[] format. This converts it to a Record<SpaceName, SpaceValues>
 */
function objectifySpaces(spaces: HeapSpaceInfo[]): {
  [space_name: string]: Space;
} {
  return spaces.reduce((spacesObject, { space_name, ...sizes }) => {
    return { ...spacesObject, [space_name]: sizes };
  }, {});
}

/**
 @returns `Size/Used/Available/%Used`
 */
function strigifySpaceData(space: Space): string {
  return `${btomb(space.space_size)}/${btomb(space.space_used_size)}/${btomb(
    space.space_available_size
  )}/${calculateUsedPart(space)}`;
}

function calculateUsedPart(space: Space): string {
  return `${((space.space_used_size / space.space_size) * 100).toFixed()}%`;
}

function reportV8Metrics(): void {
  const {
    heap_size_limit,
    total_physical_size,
    total_heap_size,
    used_heap_size,
  } = getHeapStatistics();

  const { code_space, old_space, large_object_space, code_large_object_space } =
    objectifySpaces(getHeapSpaceStatistics());

  log(`
    -HEAP-
    Limit: ${btomb(heap_size_limit)};
    Used/Total: ${btomb(used_heap_size)}/${btomb(total_heap_size)};
    Committed: ${btomb(total_physical_size)};
    `);

  log(`
    -SPACES-(size/used/available/%)-
    code: ${strigifySpaceData(code_space)};
    old: ${strigifySpaceData(old_space)};
    large_object: ${strigifySpaceData(large_object_space)};
    code_large_object: ${strigifySpaceData(code_large_object_space)};
    `);
}

afterAll(() => {
  if (typeof window !== 'object') {
    return;
  }

  if (env['DEBUG']) reportV8Metrics();

  cleanStylesFromDOM();

  if (global.gc) {
    global.gc();
  }
});
