<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [READ THIS FIRST](#read-this-first)
  - [Setup: Single steps](#setup-single-steps)
  - [Execution: Single steps](#execution-single-steps)
    - [Execution in a Docker container](#execution-in-a-docker-container)
    - [On the host (recommended for the current Ubuntu LTS)](#on-the-host-recommended-for-the-current-ubuntu-lts)
      - [Start the app](#start-the-app)
      - [Start Storybook](#start-storybook)
      - [Storybook Interaction Tests](#storybook-interaction-tests)
        - [NOTE!](#note)
      - [Unit tests](#unit-tests)
      - [E2E](#e2e)
      - [Lint](#lint)
      - [Build](#build)
      - [Dependency Graph](#dependency-graph)
      - [NOTE!](#note-1)
  - [Limitations](#limitations)
    - [General](#general)
    - [Docker](#docker)
  - [Important notes](#important-notes)
  - [Other notes](#other-notes)
- [What is this repo for?](#what-is-this-repo-for)
- [Is a monorepo an evil?](#is-a-monorepo-an-evil)
- [You're talking about angular here, what about other frameworks?](#youre-talking-about-angular-here-what-about-other-frameworks)
- [Before execution](#before-execution)
  - [Intro](#intro)
  - [Creating configs](#creating-configs)
  - [The list](#the-list)
- [Execution](#execution)
  - [Local machine](#local-machine)
  - [Own additions](#own-additions)
- [Architecture](#architecture)
  - [Main Goals](#main-goals)
  - [General](#general-1)
  - [Own additions/modifications](#own-additionsmodifications)
    - [Dependency constraints](#dependency-constraints)
    - [UI](#ui)
    - [UI: Stylesheets](#ui-stylesheets)
    - [UI: Icons](#ui-icons)
    - [Catalogue the UI components with Storybook](#catalogue-the-ui-components-with-storybook)
    - [Developing process](#developing-process)
    - [The domain `non-prod`](#the-domain-non-prod)
    - [The domain `shared`](#the-domain-shared)
    - [The domain `shared-business`](#the-domain-shared-business)
    - [Side effects](#side-effects)
      - [What is a side effect?](#what-is-a-side-effect)
      - [How to handle side effects in the code?](#how-to-handle-side-effects-in-the-code)
      - [How to handle side effects in the catalogue?](#how-to-handle-side-effects-in-the-catalogue)
      - [How to handle side effects in the unit tests?](#how-to-handle-side-effects-in-the-unit-tests)
      - [How to handle side effects in E2E?](#how-to-handle-side-effects-in-e2e)
    - [State Management](#state-management)
    - [Unit tests](#unit-tests-1)
    - [E2E tests and Storybook interaction tests](#e2e-tests-and-storybook-interaction-tests)
      - [For E2E tests](#for-e2e-tests)
    - [How deal with manual tests?](#how-deal-with-manual-tests)
      - [Short answer](#short-answer)
      - [Detailed answer](#detailed-answer)
    - [Which art of testing how much?](#which-art-of-testing-how-much)
      - [Typical scenarios for intensive manual testing](#typical-scenarios-for-intensive-manual-testing)
    - [DRY by single common component](#dry-by-single-common-component)
    - [Generators](#generators)
      - [Is it still copy-paste?](#is-it-still-copy-paste)
      - [Be careful](#be-careful)
  - [SSR/SSG](#ssrssg)
  - [CI](#ci)
    - [Handling changes in a shared library](#handling-changes-in-a-shared-library)
- [Commits](#commits)
  - [Own additions/modifications](#own-additionsmodifications-1)
- [Not yet documented/hard to find](#not-yet-documentedhard-to-find)
  - [Adding of missing plugins to reduce the configuration](#adding-of-missing-plugins-to-reduce-the-configuration)
- [Handling vulnerability fixes](#handling-vulnerability-fixes)
- [Troubleshooting](#troubleshooting)
  - [Execution](#execution-1)
    - [Nx mixes up the local machine with the CI one](#nx-mixes-up-the-local-machine-with-the-ci-one)
    - [Nx Cloud tries to execute a payed plan instead of the free one and fails](#nx-cloud-tries-to-execute-a-payed-plan-instead-of-the-free-one-and-fails)
- [Update](#update)
  - [Additions](#additions)
- [Generated documentation](#generated-documentation)
  - [Start the app](#start-the-app-1)
  - [Generate code](#generate-code)
  - [Running tasks](#running-tasks)
  - [Want better Editor Integration?](#want-better-editor-integration)
  - [Ready to deploy?](#ready-to-deploy)
  - [Set up CI!](#set-up-ci)
  - [Connect with us!](#connect-with-us)

<!-- TOC end -->

# READ THIS FIRST
## Setup: Single steps
1. Install the current stable NodeJS and git. In case of Windows 10 (probably also 11)  
   GitBash is also needed (it's usually included in the git installation for Windows).
2. Install Docker (for the current Ubuntu LTS it's optional)
3. Install pnpm with `npm install -g pnpm`, with `pnpm --version` make sure it's there.
4. `git clone https://github.com/juri-sinitson/angular-monorepo.git`
5. `code angular-monorepo` or `cd angular-monorepo`
6. You should be now on the branch `main`
7. `pnpm install`
8. `cp nx.json.dist nx.json`. Put an [access token](https://nx.dev/ci/recipes/security/access-tokens) there if you have got one. If you like, you can obtain one [here](nx.app). Otherwise
   replace the string `YOUR-SENSITIVE-VALUE-HERE` with an empty one.
9.  `cp nx-cloud-access-token.dist nx-cloud-access-token`. If you have an 
   [access token](https://nx.dev/ci/recipes/security/access-tokens), put it to 
   the file you just created, otherwise leave the file empty.
10. If you decided to use Docker, do these steps additionally to the steps above. Otherwise skip this step.
    
    **NOTE!**
    
    The steps previous to this one are obligatory no matter, if you use docker or not.

    The steps for docker:
    >1. Make sure Docker us up and running
    >2. `pnpm container:rebuild`
    >3. `pnpm container:enter`, if you want to execute the commands in the container
    > you can stay in this container terminal or execute `exit` if you to leave that 
    terminal for now.

## Execution: Single steps

### Execution in a Docker container
In this case you need to enter the terminal of the container with the command `pnpm container:enter` first. The commands to start the backend, frontend, storybook and depgraph should be postfixed with `:container`, e.g. `pnpm start-backend:container` instead of `pnpm start-backend`. The ports of the postfixed commands above are
forwarded to the host, so you can access e.g. `localhost:4200` for the app served from the browser of your host.

### On the host (recommended for the current Ubuntu LTS)

#### Start the app
1. Start the backend with `pnpm start-backend`
2. Start the frontend with `pnpm start-frontend`.

#### Start Storybook
1. `pnpm storybook`

#### Storybook Interaction Tests
Start storybook, then execute `pnpm test-storybook`.
Most probably it will fail because of missing installation fist time.
In this case follow the instructions in the terminal.

##### NOTE!
Due to issues with the Jest artifacts storybook tests may return an error
although they all pass. This is caused by warnings about Jest artifacts.
In this case execute `pnpm test-storybook+clean` (even if it has errors
it still cleans). Then reexecute `pnpm test-storybook`, now all the 
tests will have no Jest warnings any more.

#### Unit tests
`pnpm unit-test`

#### E2E
`pnpm start-backend` and then `pnpm e2e`

#### Lint
`pnpm lint`

#### Build
`pnpm build-frontend` or `pnpm build` if you want to build all the apps and
libraries affected.

#### Dependency Graph
`pnpm depgraph`

#### NOTE!
The command `pnpm depgraph:container` seems to execute with no issues in a docker container,
however the the server it starts is not accessible on the host most probably
due to some issues.

## Limitations
### General
1. Some interactions in storybook fail from time to time
   when you browse the stories. If this happens, just reload the page.
   Such spontaneous failures don't seem to occur on CI or when 
   executed in a terminal.

### Docker
1. There is currently some issue with `node_modules` from time to time. Thus you suddenly
   may get strange errors e.g. when executing `pnpm ci:storybook` or its respective subcommand.
   Restarting the container should usually help.

## Important notes
The info above should be usually enough to execute the most important commands.
You can read the section "Other notes" directly below if you want and omit the rest of this 
documentation.

## Other notes
1. The commands shown above are the basic ones (you need both the feature branch 
   and the main branch to execute them).
   If you want to know all the variants and the structure of the commands in an 
   nx monorepo, either read this documentation further or visit [this](nx.dev) and 
   optionally [this](nx.app).

<!-- TOC --><a name="what-is-this-repo-for"></a>
# What is this repo for?
It's an example (it may be even used as a skeleton) of an enterprise monorepo 
(what?! monorepo?! you might ask, but don't feel confused, keep on reading a 
little further) which can (most probably will) have multiple apps. It might contain 
some example implementations to get a general idea of e.g. the architecture 
used here.

This repo can also be seen as sharing of knowledge by hands-on examples or
even a help to avoid certain stumbles.

<!-- TOC --><a name="is-a-monorepo-an-evil"></a>
# Is a monorepo an evil?
With the [modern technologies](https://nx.dev/) and a proper modern architecture 
(see below) it's not at all. It has great advantages for a modern enterprise 
frontend/fullstack project.

<!-- TOC --><a name="what-frameworks-are-supported"></a>
# You're talking about angular here, what about other frameworks?
You can transfer the most or even most probably all the ideas and principles described in this
document to other frameworks, especially to React and Vue. E.g. the counterparts of 
[PrimeNG](https://primeng.org/) are [PrimeReact](https://primereact.org/) and [PrimeVue](https://primevue.org/). Regarding [storybook](https://storybook.js.org) you can also see [here](https://storybook.js.org/docs/get-started#install-storybook), that especially React and Vue are also supported.

And here is the [full list](https://nx.dev/plugin-registry) of the frameworks supported by [nx](https://nx.dev/).

<!-- TOC --><a name="before-execution"></a>
# Before execution

Create configs from their dist files.

<!-- TOC --><a name="intro"></a>
## Intro
Some config files are versioned like this `file.extension.dist`, e.g. `nx.json.dist`.
while the original (in this example `nx.json`) is ignored.

Why?

To avoid the exposing of such sensitive data like tokes, passwords, etc. by versioning and 
publishing to a repo.

So instead of the sensitive value you will find the placeholder "YOUR-SENSITIVE-VALUE-HERE" 
in a config file with the dist extension (in this example `nx.json.dist`).

<!-- TOC --><a name="creating-configs"></a>
## Creating configs
1. Check the list of the config files below to create from the respective dist file
2. Create the copy of the dist-file without dist (in this example copy `nx.json.dist`  to 
`nx.json`).
3. Replace the placeholder mentioned above with your sensitive value.
4. The file without dist shouldn't be versioned! If it's somewhere not the case e.g. because of overlooking, contact the admin of this repo and/or make ap pull request.

<!-- TOC --><a name="the-list"></a>
## The list
1. `nx.json.dist` - this file contains the [access token](https://nx.dev/ci/recipes/security/access-tokens) in 
    the key `nxCloudAccessToken` for the nx workspace in the [nx cloud](nx.app/).

   > **NOTE!**
   >
   > You can replace the token placeholder with an empty string and optionally add it at some later point. 
   Everything should still work fine. If you just want to take a closer look to this repo, you most probably even
   don't need a token now.
   >
   > If you want to see [remote cache](https://nx.dev/ci/features/remote-cache) in action as the case
   may be with a team mate on your and her/his machine, than you need to obtain the token now. 
   This is and most probably will be in the future included in the free plan of [nx cloud](nx.app/). 
   >
   > See also the [security considerations](https://nx.dev/ci/concepts/cache-security) before using an access token.


<!-- TOC --><a name="execution"></a>
# Execution
Execution is made in general as described in the generated documentation below.
Use the `npx` command in front of the `nx` e.g. `npx nx serve app1` to be 
sure you use the nx executable from the current repo!

**NOTE!**

For execution use either a Linux machine 
(directly or e.g. in a docker container) with a bash terminal or 
a Windows machine with [GitBash](https://git-scm.com/download/win).
The latter is usually included in the git installer for Windows
and is installed together with git by default.


## Local machine
To have as less overhead as possible, execute the commands directly in your 
operation system as much as possible. If you have issues executing the one 
or another command, use the commands in `package.json` which are prepared 
for a container (e.g. a Linux container). See also the 
troubleshooting section for this case for more details.

<!-- TOC --><a name="own-additions"></a>
## Own additions
1. To execute the global [Storybook](https://storybook.js.org/) catalogue `nx run non-prod-storybook:storybook` is used. 
See also other relevant executable commands in the config of the lib `non-prod-storybook`.

**NOTE!**

The lib `non-prod-storybook` doesn't contain any implementations. The only aim of this 
lib is to execute storybook over all the libraries to get the whole catalogue at once.

<!-- TOC --><a name="architecture"></a>
# Architecture
<!-- TOC --><a name="main-goals"></a>
## Main Goals
1. Create the future proof, flexible and reliable code structure 
2. Concentrate on business and regular delivery as much as possible amongst others by avoiding as much possible:
>1. Tinkering/Reinventing/Boilerplating
>2. Long execution times by CI/CD
>3. Repeating
>4. Searching
3. Encapsulation/hiding of implementation details

<!-- TOC --><a name="general"></a>
## General
The architecture used here is described by [M. Steyer](https://www.angulararchitects.io/en/ebooks/micro-frontends-and-moduliths-with-angular/).
As also mentioned in this book the [ddd plugin](https://www.npmjs.com/package/@angular-architects/ddd)
is used.

<!-- TOC --><a name="own-additionsmodifications"></a>
## Own additions/modifications

### Dependency constraints
Dependency is here an app or a library.
To avoid "anything can depend on anything" and bring some
order and structure to the local dependencies, dependency constraints are used. 
When a dependency constraint is violated, you get the linting error as of the 
current [configuration](https://github.com/juri-sinitson/angular-monorepo/blob/main/.eslintrc.json).

Feel free to adjust [the configuration](https://github.com/juri-sinitson/angular-monorepo/blob/main/.eslintrc.json) to your needs
in case you use this repo as a base of your project.

See also [this](https://nx.dev/features/enforce-module-boundaries) documentation.

<!-- TOC --><a name="ui"></a>
### UI
Component based approach with [PrimeNG](https://primeng.org/) and utility first approach with [PrimeFlex](PrimeFlex) are used here.

Goals:

1. Create business UI components based on general components
2. Use instant styling
3. Use theme switching on the global level
4. Avoid SCSS/CSS tinkering especially on component level
5. Instead of pixel pushing you use [padding](https://primeflex.org/padding)- and 
[margin](https://primeflex.org/margin)-classes instead.

A component of the UI library is abstracted by wrapping it in a component with the input parameters.

Goals:

1. The UI library components are globally exchangeable
2. Decoupling from the UI framework
3. Reduce/avoid lookups to the API of the UI framework
4. Reducing the original catalogue of the current UI framework
5. Knowing which general components are used in the whole monorepo
6. Highly improved readability in the template

Example of usage of a vertical tabbed menu:
```html
<vertical-tab-menu [model]><vertical-tab-menu>
```

Example of the (theoretical) implementation (error handling and other stuff are omitted for the sake of simplicity):
```html
<p-tabMenu [model]="items" [activeItem]="items[0]">
    <ng-template pTemplate="item" let-item>
        <a class="p-menuitem-link flex justify-content-between align-items-center p-3">
            <div>
                <span [class]="item.icon"></span>
                <span> {{ item.label }}</span>
            </div>
            <div>
                @if(item.shortcut) {
                  <span [class]="item.shortcutClass">{{ item.shortcut }}</span>
                }
                @if(item.badge) {
                  <p-badge [value]="item.badge" [severity]="item.badgeSeverity"></p-badge>
                }                
            </div>
        </a>
    </ng-template>
</p-tabMenu>
```

**Possible limitations**

1. For a very complex CRUD table (e.g. with a very complex custom sorting logic) or a very complex
form (e.g. with a very complex custom validation logic) it might be reasonable to use
the components of the UI library directly to avoid too high abstraction effort caused by
>1. Abstraction itself
>2. Bugfixes of the abstraction
>3. Problems with a high complexity of the input mechanism (e.g. if you need to put in such 
stuff like sorting or validation functions instead of just a sync data or 
some simple control params)
2. The are cases where the granularity of components being customizable might be too limited in such 
   a library like PrimeNG. You will most probably need such a framework like [Tailwindcss](https://tailwindcss.com/) instead.

<!-- TOC --><a name="ui-stylesheets"></a>
### UI: Stylesheets
All the stylesheets are defined/used in `styles.scss` in the root directory.
This file is then used in the configurations of the apps, catalogue (e.g. 
[Storybook](https://storybook.js.org/)), E2E-Tools, etc.

<!-- TOC --><a name="ui-icons"></a>
### UI: Icons
The icons are abstracted for better readability and decoupling from the current UI library.
So e.g. instead of `pi pi-fw pi-home` `icon-home` is used. The abstraction is made in 
`styles.scss` in the root directory.

**NOTE!**

The abstraction of the icons is made on demand instead of in advance to avoid
a work which is no necessary at the moment.

<!-- TOC --><a name="catalogue-the-ui-components-with-storybook"></a>
### Catalogue the UI components with Storybook
1. To catalogue and test the components (business and basic ones) [Storybook](https://storybook.js.org/)
   is used.

**Goals**
>1. Increased agility because UI part can be approved during/before the service/backend part is being developed.
>2. Every UI component can be found quickly. No knowledge and credentials of the real app is needed. This is very 
handy for designers, POs, C-Level and other decision/developing parties.
>3. The UI components are production ready. No rewriting for use in the production is needed.
>4. The UI components are free of any side effects.
>5. The UI components don't need any service mocks, they just use the hardcoded data, with which one 
can play around in such a catalogue like storybook.
>6. In case of the local form validation (a side-effect free and sync which is most often the case) you
have the best chances to ship an already completely tested form in storybook.

**Possible downsides/limitations**
1. The bumping up to the next Angular major version might need a high refactoring effort.

<!-- TOC --><a name="developing-process"></a>
### Developing process
The direction is top down. This means first the UI part using storybook is developed 
and reviewed during or before the service/backend part is being developed.

<!-- TOC --><a name="the-domain-non-prod"></a>
### The domain `non-prod`
1. This domain is used to store the stuff which is not thought to be used in the productive code. The examples are:
>1. Storybook library which catalogues all libraries containing stories. The goal is to have a global storybook catalogue additionally to countless catalogues per library.
>1. Code generators (the generators themselves are not thought for productive code, but the code they generate is).

<!-- TOC --><a name="the-domain-shared"></a>
### The domain `shared`
Put only the business agnostic stuff which can or theoretically could be shared with 
the open source community.

**Examples**
1. You need a menu (e.g. a vertical one), which will be used on many places with different 
entries.
2. You need a chart to depict some data. You need it (potentially) for different data in
different libs/apps.

<!-- TOC --><a name="the-domain-shared-business"></a>
### The domain `shared-business`
Put the business logic there, which will be shared amongst other libs.
Examples for possible candidates: 
1. The person or address interfaces and most probably the routines for fetching this data
2. Some statistics data on charts

<!-- TOC --><a name="side-effects"></a>
### Side effects
#### What is a side effect?
A typical side effect is a network request or querying the date.

A side effect is generally everything which is theoretically 
(in most cases practically) not deterministic.

In other words, it's a functionality, which when executed multiple times 
with the same input produces (or can at least theoretically produce) 
different output.

A network request is obviously a side effect.
No matter how reliable the backend is, an endpoint can at least theoretically 
return different results when called multiple times with the 
same input (because of bugs, failures, unavailability, an attack, (buggy) updates, 
changes by normal usage, etc.).

A code without side effects is easier to test, no matter by
which test art. For unit tests and the tests in a catalogue (e.g. Storybook),
it's even required.

The better side effects are separated from the rest of the code,
the better testable, reliable, predictable and readable it will be.

#### How to handle side effects in the code?
Side effects should be separated from the rest of the code 
into places where they are easy to find. A (signal) store is a good candidate.
A method/function of the store with a side effect should then have a prefix or 
a postfix `sideEffect` for the one to immediately see where the side effects in the 
given store are.

See also [this](https://github.com/juri-sinitson/angular-monorepo/blob/main/libs/persons-management/api-persons/src/lib/stores/person-entity-store.service.ts) example and its [unit tests](https://github.com/juri-sinitson/angular-monorepo/blob/main/libs/persons-management/api-persons/src/lib/stores/person-entity-store.service.spec.ts).

Ideally the store of your choice supports such tool like Redux [DevTools](https://github.com/reduxjs/redux-devtools). In this case you have a very handy and effective tool to debug the side effects
in your code.

#### How to handle side effects in the catalogue?
**Short answer:** by not having them at all.

**Detailed Answer**:

For tests in the catalogue (e.g. [interaction tests in Storybook](https://storybook.js.org/docs/writing-tests/interaction-testing)) 
you organize your UI components that they have a sync input and send their data by the output. 

Those components are then fed with the data by the smart components in your app. In case of a catalogue, 
the story de-facto mocks the smart component by providing the hardcoded sync data.

A catalogue shouldn't have to deal with the component output. At least not, 
if this output is aimed to produce side effects directly or indirectly. 
Instead you either ignore the output in the catalogue or put a message on it, 
which tells the catalogue user that this functionality is not supported in the catalogue 
context.

#### How to handle side effects in the unit tests?
By not having them. You mock all the side effects with the hardcoded data. Typical cases are network requests and date requests.

#### How to handle side effects in E2E?
By partially mocking them. In case of a date request or provoking an error you
have to mock with the hardcoded data anyway. For a happy case and most often other cases you need 
to deal with the side effects, because you want to simulate and test the end user
using your app in a real environment. Thus a certain part of indeterminism, so-called flakyness
is at least theoretically unavoidable.

<!-- TOC --><a name="state-management"></a>
### State Management
The state management is currently implemented using a
[signal store](https://ngrx.io/guide/signals/signal-store) of NGRX. To provide an abstraction, 
the signal store is not accessible directly from the outside. Instead a service is used which 
provides the access to the pieces of the state and triggers some side effects on the store.

The goal of this approach is a better predictability and better debugability with e.g. 
[Redux DevTools](https://github.com/reduxjs/redux-devtools?tab=readme-ov-file)
(an addon for most popular browsers). It's may also come in very handy if you know that all 
the network requests are made as side effects on the appropriate store and that a store is the single
source of truth.

See [this](https://github.com/juri-sinitson/angular-monorepo/blob/main/libs/persons-management/api-persons/src/lib/stores/person-entity-store.service.ts) example.

<!-- TOC --><a name="unit-tests"></a>
### Unit tests
Unit tests are made to ensure e.g. a service behaves as expected. If the service to be tested 
acts as a proxy to a store with side effects, than those side effects are mocked for different scenarios. 
E.g. in case of a GET network request the following scenarios are emulated: happy case, loading, 
error and no data (in case of angular with like [this](https://angular.dev/guide/http/testing) testing library). 
For every scenario the behavior of the service or in other words its API to the outside is tested. Implementation details are 
not tested to keep the tests immune against refactoring (the changes which don't affect 
the behavior to the outside).

There is also a [video](https://www.youtube.com/watch?v=EZ05e7EMOLM) from 2017 which is still current regarding this topic.

See [this](https://github.com/juri-sinitson/angular-monorepo/blob/main/libs/persons-management/api-persons/src/lib/stores/person-entity-store.service.spec.ts) example.

<!-- TOC --><a name="e2e-tests-and-storybook-interaction-tests"></a>
### E2E tests and Storybook interaction tests
The same principle as for unit tests: the implementation details are not tested.
The implementation details in this case are css classes, ids and other stuff which
will or theoretically can be changed or removed to improve the template. Thus a
separate marker should be used for E2E tests and Storybook interaction tests,
e.g. the `testid` attribute which looks like an optimal choice for both cypress and storybook.
In some cases it's also reasonable to wrap the element to be tested e.g. in a `div` container
and assign the `testid` attribute to the container.

The goal of storybook interaction tests is to make sure every entry in 
storybook behaves as expected and is generally there (e.g. instead of an ugly black-red
error message).

The goal of E2E tests is to make sure the app behaves for the end user as expected.
If they are performant they save a lot of work for manual testing. E2E tests should be 
made economically to provide a good performance.

To make a test better readable the page object approach is used.

See [this example of E2E](https://github.com/juri-sinitson/angular-monorepo/blob/main/apps/persons-management-frontend-e2e/src/e2e/main-page.cy.ts) 
and this [example of interaction tests](https://github.com/juri-sinitson/angular-monorepo/blob/main/libs/persons-management/feature-birthdays/src/lib/components/persons/person-form.component.stories.ts).


#### For E2E tests
E.g. in case of a table it should be enough to test if the header row and first two data rows are there. 
You should try to save the visit calls to make your e2e tests faster. 
If you have a lot of combinations to check, fill and post some data, it's reasonable to test e.g. 
the most important ten ones instead of 200 of them.

To make your test reliable you should reset the data in the backend (so called [seeding](https://learn.cypress.io/advanced-cypress-concepts/database-initialization-and-seeding)). See also [this implementation](https://github.com/juri-sinitson/angular-monorepo/blob/main/apps/central-backend/src/persons-management-routes.ts) to get a better idea.


### How deal with manual tests?
#### Short answer 
Postpone them as far as possible and do as less as possible.

#### Detailed answer 
On one hand they are intuitive and obvious and it's the first thing most of us wanna do after completing
something which can be executed or seen in such catalogue like [Storybook](https://storybook.js.org/).
While being straight forward for a very small app or lib which is not aimed for production, 
they are extremely time consuming and disturb the flow if you app gets even a little bit complexer.

If you have a small form with multiple validation scenarios, clicking through them every time 
you think you could break it is a bad idea in terms of time. It's even a worse idea if
you adjust something in your common libs and wanna make sure you haven't broken anything
in your not-that-small-any-more-app(s), which is/are already in production.

If you develop something where you need an evidence, that you have tested it...
If you say "Hey, I'll show you it works.", you may get such answer like
"It's a coincidence. Where is the evidence?".
It may get even worse for you when a manually only tested part you developed has made 
a damage in production and you get into the dialog like the one above...

**What to do instead then?**

Habit to 
1. Start writing automatic tests in the moment when you usually would test
   manually
2. Run your automatic tests in background in watch mode 
   >You may need to and often should run only a small part of tests or even only one    
   >or two tests to save unnecessary noise produced by the output of the tests not affected.
   >Use `xit`, `xdescribe`, `it.only`, `describe.only` in you test 
   >suite to narrow down the tests run currently in background even more.
3. Test external behavior instead of such implementation details like:
  >1. private and protected values and methods/functions
  >2. when, which method or function how much is called with which value
  >>
  >> **NOTE!**
  >>
  >>Testing how the logging methods were called can be seen as an exception
  >>of the recommendations above. But the controlling of logging is rather
  >>an external behavior than implementations details. Especially when you
  >>e.g. provoke an error and want to assert it's logged as expected.
4. Not to test the functionality already tested
   > It's totally fine to test if e.g. a button wrapper renders the 
   > button correctly. Or when your wrapper activates the pagination 
   > to test if it's really there. But don't test e.g. the button of 
   > the UI library you use directly. They have already made if for you.
   > Same applies for the internal dependencies in your project.
5. Generate the tests by an AI (assistant)
   > An AI assistant (e.g. Copilot or Phind) will very often save a lot of 
   > your typing. Of course you should have read, understood and 
   > very often improved and/or corrected those generated tests. Sometimes
   > you will even need to write your tests yourself completely before an 
   > AI (assistant) has the correct idea, how you want to get your tests 
   > generated.

While this work flow might still have a steep curve at the beginning, you later 
(approximately in a month) will spend the same time for writing tests
as making a single shot of manual tests. In this case manual tests will 
not be worth it any more. Why make manual test shots, when you have 
your automated tests running in background in watch mode?
Sometimes there are situations where you have to trigger your automated
tests manually. But it's still much faster then making manual tests.

This is true for all these steps: 
1. After/while developing UI components:
[Interaction tests](https://storybook.js.org/docs/writing-tests/interaction-testing) tests in the catalogue (e.g. [Storybook](https://storybook.js.org/))
1. After/while developing the service(s): unit tests
2. Putting all together in a smart component and putting this component to an app: E2E tests

**What/when to test manually?**

When you can't find any bugs with automated testing any more in you code and you are about to ship it.

In this case you wanna be sure, that the happy case works as expected in the end user role.
Clicking through the catalogue a little bit might also be reasonable.

So it's kind of spot testing, to get a good feeling, that there is no bad surprizes 
for typical cases (or at least for a part of them) any more...

### Which art of testing how much?
From more to less:

1. **Unit tests**:
   
   Try to reach 100% coverage (if you e.g. have some functionality in 
   a library, which is used and not used any more and then used again, you have to 
   consider to take something less then 100).
   You definitely need to cover all the cases in the new implementations. An edge case which is 
   not covered by a test, but is reachable by the code is a very, very, very bad practice...

2. **[Interaction tests](https://storybook.js.org/docs/writing-tests/interaction-testing) in the catalogue (e.g. [Storybook](https://storybook.js.org/))**:
   
   Here you try to cover the most
   user and validation scenarios, but you can omit one where the probability of an error or mistake is very low.

3. **E2E tests**:
   
   Covering all the possibilities the user can click and interact with is ideal, but 
   is not realistic due to time and hardware reasons. So here you have to consider what is most 
   important to test, what is less and what can be omitted. It's usually not necessary to test 
   validation here, when you have done it in the catalogue. I you have a large amount 
   of combinations a user can click or select, testing them all will most probably overheat you, 
   your local machine, the CI and very often even the management of your company.

4. **Manual tests**:
   
   Click through the typical scenarios and the new entries you made in the catalogue of the components. It will give you a good feeling, seeing the happy cases 
   (or part of them) work as expected before you ship it.

#### Typical scenarios for intensive manual testing
Usually those scenarios are applied to non-developers.

To such scenarios are especially:
1. Because of security reasons the app should be additionally clicked though after all of the automatic tests passed.
2. Approvement of a feature in the end user role. This is usually also done after all of the automatic tests passed.

<!-- TOC --><a name="dry"></a>
### DRY by single common component
To avoid repeating e.g. for such standard states like, loading, error and no data, a wrapper
(here [`common-wrapper.component`](https://github.com/juri-sinitson/angular-monorepo/blob/main/libs/shared/ui-common/src/lib/components/common-wrapper/common-wrapper.component.ts)) is used. The goals:
1. The depiction of states is unified and can be changed in one place
2. One saves time just wrapping the data component instead of writing those 
   routines again and again.

### Generators
You will see them in this repository as `@angular-monorepo/generators - X` in the [NX Console UI](https://www.youtube.com/watch?v=IIetmfgozgI), where X is currently the generator for the parts needed for an editable list of an entity (e.g. list of products, list of persons etc..).

The big goal is that you don't need to copy-paste different parts from different files, 
which is extremely time consuming when using an architecture which is based on separation
of components, catalogue stories like in e.g. [Storybook](storybook.js.org/) and 
different kinds of automatic tests. This copy-pasting is made for you in less than
a second.

The rest of work for you to do is:
1. Fill in the fields in the [NX Console UI](https://www.youtube.com/watch?v=IIetmfgozgI)
2. Adjust the code places marked with something like `// -- STEP`.
3. Adjust the logic if it differs from the logic generated
4. Add some unique functionality if required (generators can't and shouldn't cover everything possible in this world)
5. Improve the generators (the effort is usually very small if any)

#### Is it still copy-paste?
Yes. BUT: The code is generalized as much as possible, so only the 
stuff is copied which is not reasonable/too complicated to generalize 
and thus would be copy-pasted anyway.

#### Be careful
Avoid generating multiple parts first and then adjusting them.
Thus you can mess up the code and goal of generators might not be achieved at all 
because of debugging and other error struggling.

Instead it's recommended to generate e.g. the UI-Components first, adjust them and
even make them production ready. And then generate the next part with the same steps.
From which part to begin is up to you.

## SSR/SSG
Examples are currently [in progress](https://github.com/juri-sinitson/angular-monorepo/issues/44).

SSR/SSG is especially important in a shop system and other systems where the content
to be loaded can be more or less predicted. And thus the data can be delivered directly 
in the DOM instead of being loaded by a separate network request.

<!-- TOC --><a name="ci"></a>
## CI
Currently (2024-03-18) [github actions](https://docs.github.com/en/actions) for a 
pull request are used. Especially the [cache](https://github.com/actions/cache) in combination with the [affected](https://nx.dev/nx-api/nx/documents/affected) tool of [nx](nx.dev). You will find the configuration [here](https://github.com/juri-sinitson/angular-monorepo/blob/main/.github/workflows/ci.yml).

Goals:
1. The pipeline becomes much faster, because:
>1. With the cache mentioned above the dependencies, especially `node_modules` are reused by the subsequent CI executions instead of
   redownloading them every time.
>2. With the affected command mentioned above only the changes and their dependencies are processed instead of processing everything.

<!-- TOC --><a name="what-to-do-to-by-changes-in-a-shared-library"></a>
### Handling changes in a shared library
Often the whole codebase depends on a shared library. If you make changes to a library where it's
the case, then you run into the worst case of a CI pipeline execution time. Because the whole code base has to be processed.

To gain a significant speed up especially for the worst case, there is such a solution like [distributed task execution](https://nx.dev/ci/features/distribute-task-execution) from [nx](nx.dev).
There seems to be no free plan though.

It's imaginable that there are other providers of such a solution or other solutions with the same goals. It's also imaginable that there are even solutions with a free plan. Which solution is the best is currently the subject of research and depends on the project.

The goals of such a solution like the one of [nx](nx.dev) e.g. for E2E:
1. E2E tasks are parallelized on file level (the specs of E2E will be run on different machines in the cloud).
2. An automatic machine allocation and deallocation is used.

**NOTE!**

The [distributed task execution](https://nx.dev/ci/features/distribute-task-execution)
by the command `nx-cloud` is already put to the 
[ci configuration](https://github.com/juri-sinitson/angular-monorepo/blob/main/.github/workflows/ci.yml), 
but is commented out because no payed plan is currently used in this repo. If you decide to use a payed plan of [nx](nx.dev) you are free to uncomment and test this line (you may need to fork this repo also). The same is valid for another
payed solution. In case of the payed [nx](nx.dev) solution you also may need to check the documentation of [nx](nx.dev), especially [these](https://nx.dev/ci/intro/tutorials/github-actions) instructions if 
you are using [github actions](https://docs.github.com/en/actions).

<!-- TOC --><a name="commits"></a>
# Commits
See https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines

<!-- TOC --><a name="own-additionsmodifications-1"></a>
## Own additions/modifications
It's reasonable to put the issue/task number direct in front of the description like this:

`feat(some-xyz-lib): T-1256 add xyz functionality`

In this way you will get a good overview over your commits and issues.

<!-- TOC --><a name="not-yet-documentedhard-to-find"></a>
# Not yet documented/hard to find
<!-- TOC --><a name="adding-of-missing-plugins-to-reduce-the-configuration"></a>
## Adding of missing plugins to reduce the configuration
This seems not yet (2024-03-19) to be documented in nx 18.x and is made with the command `pnpm dlx nx@latest init` according to [this](https://youtu.be/PzCgpM7qtTU?t=1363) source. So if you issue this command in an existing monorepo nx asks you
what configuration plugins you would like to install and adds the default config of them. If you don't understand why is configuration by plugins useful, it's most probably worth for you to watch the whole video.

<!-- TOC --><a name="troubleshooting"></a>

# Handling vulnerability fixes
If your dependency vulnerabilities are fixed (e.g. manually or by
[dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot)),
it's reasonable to test if you code base still works. In this case the 
[nx cache](https://nx.dev/features/cache-task-results) will not be invalidated 
automatically because there are no changes in the code base.

The options to test if your code still works as expected are:

1. Make a spot check by running the typical tasks for selected projects with 
   the [nx cache](https://nx.dev/features/cache-task-results) deactivated.
   
   Pros: although the cache is deactivated it's still fast.
   
   Cons: there is still a certain possibility that some tasks in some 
   libraries will not work as expected, especially in case of 
   [Independently Maintained Dependencies](https://nx.dev/concepts/more-concepts/dependency-management#independently-maintained-dependencies)

2. Testing the whole code base. 
   
   Pros: high fidelity.

   Cons: depending on the size of the code base and usage of 
   [nx agents](https://nx.dev/ci/features/distribute-task-execution)
   (currently (2024-03-25) it's a payed feature) the testing can last from 
   10 minutes till over an hour.

**NOTE!**

Currently (2024-03-25) this repo uses [Single Version Policy](https://nx.dev/concepts/more-concepts/dependency-management#single-version-policy),
thus the spot check approach is used in this repo. You can run the spot
check by `pnpm spot-check`.

# Troubleshooting
<!-- TOC --><a name="execution-1"></a>
## Execution
### Nx mixes up the local machine with the CI one
In this case nx will ask you to set some variables which you most probably
have never heard about and which may not even appear in the official documentation.
See below the solutions.

### Nx Cloud tries to execute a payed plan instead of the free one and fails
**Causes**
1. There seem to be issues on Windows 10 (other versions were not yet tested) 
   when sending the cache of nx 18.x to the nx cloud. The cloud command mixes up the 
   local machine environment with the CI one. At the same time the free plan
   is mixed up with a payed one which also leads to a failure.
2. Much less probably: due to a an outdated free plan organization or workspace 
   in the cloud profile. Or some out-of-sync with the current tokens you have in 
   your nx cloud profile.

**Possible solutions**
1. Try it in the current Ubuntu with the current stable NodeJS, the issue was 
   not observed there.
2. You can also try to delete the organization and recreate it in your nx cloud profile.
Try to avoid multiple organizations in case of the free plan.
3. Disable the [remote cache](https://nx.dev/ci/features/remote-cache) by 
   leaving the [access token](https://nx.dev/ci/recipes/security/access-tokens) 
   empty
4. If the [remote cache](https://nx.dev/ci/features/remote-cache) is disabled in you local
   machine, than the issue is solved. To although use [remote cache](https://nx.dev/ci/features/remote-cache) you can install docker and use the commands for a container in `package.json` which were prepared for you. The issue was not observed on the container commands also.
   > **NOTE!**
   >
   >1. Copy `nx-cloud-access-token.dist` to `nx-cloud-access-token` and put 
   the [access token](https://nx.dev/ci/recipes/security/access-tokens) if not yet the case.
   Remove this token from `nx.json` to not provoke this issue once more.
   >2. The container commands mentioned above may affect your existing images 
   and containers. So use them with caution. It's highly
   recommended to understand well what those commands do exactly before executing
   them. Especially the commands to stop the container, recreate the image and prune.
   >3. When images and containers are used incorrectly, the amount of unused
   images, containers and volumes grows pretty fast. This may lead to such inconsistencies like e.g. unintentional wiping of the packages from the user cache which were preinstalled during the build phase. It's also a problem, when the amount of running images goes out of control.
   >When you explicitly use named images and containers, the amount of them 
   is usually under control. It's although highly recommended to observe the containers, images and volumes in e.g. a docker client like Docker Desktop and as the case may be [prune](https://docs.docker.com/config/pruning/) them. You can also manually prune in a docker client like e.g. Docker Desktop by selecting and deleting. 
   >
   > If [prune](https://docs.docker.com/reference/cli/docker/system/prune/) works too
   slow for you, you can prune single parts. Pruning of a single part is usually very
   fast:
   >
   > https://docs.docker.com/reference/cli/docker/image/prune/
   > 
   > https://docs.docker.com/reference/cli/docker/container/prune/
   > 
   > https://docs.docker.com/reference/cli/docker/network/prune/
   > 
   > https://docs.docker.com/reference/cli/docker/volume/prune/
   > 
   > https://docs.docker.com/reference/cli/docker/buildx/prune/
   >
   >4. Don't mix up the usage of [.dockerignore](https://docs.docker.com/build/building/context/#dockerignore-files) and an anonymous volume.
   > While the first one is used at the building stage, the latter one
   > is used at runtime. See also [this](https://stackoverflow.com/a/78205816) 
   post regarding an anonymous volume.

# Update
See [this](https://nx.dev/recipes/tips-n-tricks/advanced-update)

## Additions
1. Don't forget to update the dist files and their derivates e.g. `nx.json.dist` and its
derivate `nx.json`.

<!-- TOC --><a name="generated-documentation"></a>
# Generated documentation

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨


<!-- TOC --><a name="start-the-app"></a>
## Start the app

To start the development server run `nx serve app1`. Open your browser and navigate to http://localhost:4200/. Happy coding!


<!-- TOC --><a name="generate-code"></a>
## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

<!-- TOC --><a name="running-tasks"></a>
## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

<!-- TOC --><a name="want-better-editor-integration"></a>
## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

<!-- TOC --><a name="ready-to-deploy"></a>
## Ready to deploy?

Just run `nx build demoapp` to build the application. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

<!-- TOC --><a name="set-up-ci"></a>
## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/core-features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

<!-- TOC --><a name="connect-with-us"></a>
## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
