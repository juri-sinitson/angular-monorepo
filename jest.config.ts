import { getJestProjects } from '@nx/jest';

export default {
  projects: getJestProjects(),
  modulePathIgnorePatterns: [
    "<rootDir>/dist/**", 
    "<rootDir>/node_modules/**"
  ],
  roots: ['<rootDir>/libs'],
};
