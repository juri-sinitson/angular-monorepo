pnpm nx affected -t lint --parallel=true && \
pnpm build-backend -- --parallel=true --skip-nx-cache && \
pnpm nx run persons-management-api-persons:test --parallel=true --skip-nx-cache && \
pnpm build-frontend --skip-nx-cache && \
pnpm start-server-and-test start-backend http://localhost:3000 \
  'pnpm e2e-frontend --parallel=true --skip-nx-cache' && \
pnpm start-server-and-test 'pnpm storybook -- --ci' http://localhost:4400 \
  'nx run persons-management-feature-birthdays:test-storybook --ci --parallel=true --skip-nx-cache';
