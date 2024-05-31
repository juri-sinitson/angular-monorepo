pnpm nx affected -t lint --parallel=true && \
pnpm nx run central-backend:build --parallel=true --skip-nx-cache && \
pnpm nx run shared-business-examples:test --parallel=true --skip-nx-cache && \
pnpm nx run examples-frontend:build --parallel=true --skip-nx-cache && \

pnpm ci:storybook && \
pnpm ci:helper:wait-for-storybook && \
pnpm nx run shared-business-feature-examples:test-storybook --parallel=true --skip-nx-cache -- -u && \
pnpm ci:kill-storybook && \

pnpm build-backend && \
pnpm ci:start-backend && \
pnpm ci:helper:wait-for-backend && \
pnpm nx run examples-frontend-e2e:e2e --parallel=true --skip-nx-cache && \
pnpm ci:kill-backend
