pnpm nx run examples-backend:build --parallel=true --skip-nx-cache && \
pnpm nx run shared-business-examples:test --parallel=true --skip-nx-cache && \
pnpm nx run examples-frontend:build --parallel=true --skip-nx-cache && \
pnpm start-server-and-test ci:helper:start-backend http://localhost:3000 \
  'pnpm nx run examples-frontend-e2e:e2e --parallel=true --skip-nx-cache' && \
pnpm nx run shared-ui-menu:test-storybook --parallel=true --skip-nx-cache
