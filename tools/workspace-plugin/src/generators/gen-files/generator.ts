import { getProjects, Tree } from '@nx/devkit';

export async function genFilesGenerator(tree: Tree) {
  const projects = getProjects(tree);
  for (const [, config] of projects.entries()) {
    for (let i = 0; i < 100; i++) {
      tree.write(
        `${config.root}/src/files/file-${i}.ts`,
        `export const file${i} = 'file${i}';`
      );
    }
  }
}

export default genFilesGenerator;
