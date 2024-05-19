pnpm nx run central-backend:build --parallel=true --skip-nx-cache && \
pnpm nx run shared-business-examples:test --parallel=true --skip-nx-cache && \
pnpm nx run examples-frontend:build --parallel=true --skip-nx-cache && \
pnpm start-server-and-test ci:helper:start-backend http://localhost:3000 \
  'pnpm nx run examples-frontend-e2e:e2e --parallel=true --skip-nx-cache' && \
pnpm pnpm start-server-and-test ci:helper:storybook http://localhost:4400 \
  'nx run shared-business-feature-examples:test-storybook --parallel=true --skip-nx-cache';
