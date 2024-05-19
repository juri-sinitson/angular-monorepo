import { getJestProjects } from '@nx/jest';

export default {
  projects: getJestProjects(),
  modulePathIgnorePatterns: ["<rootDir>/dist/*"],
};
