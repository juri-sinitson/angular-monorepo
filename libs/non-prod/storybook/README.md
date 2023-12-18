# Intro
This library was generated with

`pnpm exec nx generate @nx/angular:library --name=storybook --directory=non-prod --projectNameAndRootFormat=derived --skipTests=true --style=none --no-interactive`.

This command was generated using the VSCode plugin Nx Console.

# Purpose
This library is used ONLY for executing storybook catalogue over
all the libraries.

Thus:
1. There is no index file because nothing should be exported from this lib.
2. There is no map entry in `tsconfig.base.json` or similar config because 
the should be no stuff to import from this lib.
3. The is no `src/lib` directory because there should be no components/interfaces/services of other kind of dev stuff in this lib.
