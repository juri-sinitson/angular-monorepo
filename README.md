<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [What is this repo for?](#what-is-this-repo-for)
- [Is a monorepo an evil?](#is-a-monorepo-an-evil)
- [What frameworks are supported?](#what-frameworks-are-supported)
- [Before execution](#before-execution)
  - [Intro](#intro)
  - [Creating configs](#creating-configs)
  - [The list](#the-list)
- [Execution](#execution)
  - [Own additions](#own-additions)
- [Architecture](#architecture)
  - [Main Goals](#main-goals)
  - [General](#general)
  - [Own additions/modifications](#own-additionsmodifications)
    - [UI](#ui)
    - [UI: Stylesheets](#ui-stylesheets)
    - [UI: Icons](#ui-icons)
    - [Catalogue the UI components with Storybook](#catalogue-the-ui-components-with-storybook)
    - [Developing process](#developing-process)
    - [The domain `non-prod`](#the-domain-non-prod)
    - [The domain `shared`](#the-domain-shared)
    - [The domain `shared-business`](#the-domain-shared-business)
    - [Side effects](#side-effects)
    - [State Management](#state-management)
    - [Unit tests](#unit-tests)
    - [E2E tests and Storybook interaction tests](#e2e-tests-and-storybook-interaction-tests)
    - [DRY](#dry)
  - [CI](#ci)
    - [What to do to by changes in a shared library?](#what-to-do-to-by-changes-in-a-shared-library)
- [Commits](#commits)
  - [Own additions/modifications](#own-additionsmodifications-1)
- [Not yet documented/hard to find](#not-yet-documentedhard-to-find)
  - [Adding of missing plugins to reduce the configuration](#adding-of-missing-plugins-to-reduce-the-configuration)
- [Troubleshooting](#troubleshooting)
  - [Execution](#execution-1)
    - [Nx Cloud tries to execute a payed plan instead of the free one and fails](#nx-cloud-tries-to-execute-a-payed-plan-instead-of-the-free-one-and-fails)
- [Update](#update)
  - [Additions](#additions)
- [Generated documentation](#generated-documentation)
  - [Start the app](#start-the-app)
  - [Generate code](#generate-code)
  - [Running tasks](#running-tasks)
  - [Want better Editor Integration?](#want-better-editor-integration)
  - [Ready to deploy?](#ready-to-deploy)
  - [Set up CI!](#set-up-ci)
  - [Connect with us!](#connect-with-us)

<!-- TOC end -->

<!-- TOC --><a name="what-is-this-repo-for"></a>
# What is this repo for?
It's an example (it may be even used as a skeleton) for an enterprise monorepo 
(what?! monorepo?! you might ask, but don't feel confused, keep on reading a 
little further) which can (most probably will) have multiple apps. It might contain 
some example implementations to get a general idea of e.g. the architecture 
used here.

<!-- TOC --><a name="is-a-monorepo-an-evil"></a>
# Is a monorepo an evil?
With the [modern technologies](https://nx.dev/) and a proper modern architecture 
(see below) it's not at all. It has great advantages for a modern enterprise 
frontend/fullstack project.

# What frameworks are supported?
Not only [Angular](https://nx.dev/nx-api/angular), [React](https://nx.dev/nx-api/react) and [Next.js](https://nx.dev/nx-api/next). See the the [full list](https://nx.dev/plugin-registry).

<!-- TOC --><a name="before-execution"></a>
# Before execution

Create configs from their dist files.

<!-- TOC --><a name="intro"></a>
## Intro
Some config files are versioned like this `file.extension.dist`, e.g. `nx.json.dist`.
while the original (in this example `nx.json`) is ignored.

Why?

To avoid the exposing by such sensitive data like tokes, passwords, etc. by versioning and 
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
1. `nx.json.dist` - this file contains the [access token](https://nx.dev/ci/recipes/security/access-tokens) by in key `nxCloudAccessToken` for the nx workspace in the [nx cloud](nx.app/).

   > **NOTE!**
   >
   > You can leave the token empty for this file and add it at some later point. Everything should
   still work fine. If you just want to take a closer look to this repo, you most probably even
   don't need a token now.
   >
   > If you want to see [remote caching](https://nx.dev/ci/features/remote-cache) in action as the case
   may be with a team mate on your and her/his machine, than you need to obtain the token now. 
   This is and most probably will be in the future included in the free plan of [nx cloud](nx.app/). 
   >
   > See also the [security considerations](https://nx.dev/ci/concepts/cache-security) before using an access token.


<!-- TOC --><a name="execution"></a>
# Execution
We execute in general as described in the generated documentation below.
Use the `npx` command in front of the `nx` e.g. `npx nx serve app1` to be 
sure you use the nx executable from the current repo!

<!-- TOC --><a name="own-additions"></a>
## Own additions
1. To execute the global [Storybook](https://storybook.js.org/) catalogue we use `nx run non-prod-storybook:storybook`. 
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
We follow the architecture described by [M. Steyer](https://www.angulararchitects.io/en/ebooks/micro-frontends-and-moduliths-with-angular/).
As also mentioned in this book we use the [ddd plugin](https://www.npmjs.com/package/@angular-architects/ddd).

<!-- TOC --><a name="own-additionsmodifications"></a>
## Own additions/modifications

<!-- TOC --><a name="ui"></a>
### UI
We use component based approach with [PrimeNG](https://primeng.org/) and utility first approach with [PrimeFlex](PrimeFlex).

Goals:

1. Create business UI components based on general components
2. Use instant styling
3. Use theme switching on the global level
4. Avoid SCSS/CSS tinkering especially on component level
5. Instead of pixel pushing you use [padding](https://primeflex.org/padding)- and 
[margin](https://primeflex.org/margin)-classes instead.

We abstract a component of the UI library wrapping it in a component with the input parameters.

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

Example of the implementation (error handling and other stuff are omitted for the sake of simplicity):
```html
<p-tabMenu [model]="items" [activeItem]="items[0]">
    <ng-template pTemplate="item" let-item>
        <a class="p-menuitem-link flex justify-content-between align-items-center p-3">
            <div>
                <span [class]="item.icon"></span>
                <span> {{ item.label }}</span>
            </div>
            <div>
                <span *ngIf="item.shortcut" [class]="item.shortcutClass">{{ item.shortcut }}</span>
                <p-badge *ngIf="item.badge" [value]="item.badge" [severity]="item.badgeSeverity"></p-badge>
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
We abstract the icons for better readability and decoupling from the current UI library.
So instead of `pi pi-fw pi-home` we use `icon-home`. The abstraction is made in 
`styles.scss` in the root directory.

**NOTE!**

We make the abstraction of the icons on demand instead of in advance to avoid
a work which can be (partially) useless.

<!-- TOC --><a name="catalogue-the-ui-components-with-storybook"></a>
### Catalogue the UI components with Storybook
1. To catalogue and test the components (business and basic ones) we use [Storybook](https://storybook.js.org/).

**Goals**
>1. Increased agility because UI part can be approved during/before the service/backend part is being developed.
>2. Every component can be found quickly. No knowledge and credentials of the real app is needed. This is very 
handy for designers, POs, C-Level and other decision parties.
>3. The UI components are production ready. No rewriting for use in the production is needed.

**Possible downsides/limitations**
1. The bumping up to the next Angular major version might need a high refactoring effort.

<!-- TOC --><a name="developing-process"></a>
### Developing process
We go top down. This means we first develop the UI part using storybook and review it during or before 
the service/backend part is being developed.

<!-- TOC --><a name="the-domain-non-prod"></a>
### The domain `non-prod`
1. We use this domain to store the stuff which is not thought for prod use. The examples are:
>1. Storybook library which catalogues all libraries containing stories. The goal is to have a global storybook catalogue additionally to countless catalogues per library.
>2. In the future we may store common testing routines or even testing scenarios in a library of that domain.

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

### Side effects
Side effects are separated from the rest of the code into a (signal) store.
A method of the store should then have a prefix or postfix `sideEffects`.
A typical side effect is a network request. A side effect is generally 
everything which delivers different results (also theoretically) if
executed multiple times with the same input. So no matter how reliable
a backend is, an endpoint can at least theoretically deliver different 
results when called multiple times with the same input (bugs, failures, 
unavailability, an attack, (buggy) updates, 
changes by normal usage, etc.).

The better side effects are separated from the rest of the code,
the better testable and reliable it will be.

### State Management
The state management is currently (2024-03-16) implemented using a
[signal store](https://ngrx.io/guide/signals/signal-store) of NGRX. To provide an abstraction, the signal store is not available from the outside. Instead a service is used which provides the access to the pieces of the state and as the case may be triggers some side effects on the store.

The goal of this approach is a better predictability and better debugability with e.g. Redux DevTools
(an addon for a popular browser). It's may also come in very handy if you know that all 
the network requests are made as side effects on the appropriate store and that a store is the single
source of truth.

### Unit tests
Unit tests are made to ensure a service behaves as expected. If the service to be tested 
acts as a proxy to a store with side effects, than those side effects are mocked for different scenarios. E.g. in case of a GET network request the following scenarios are emulated: happy case, loading, error and no data (in case of angular with [this](https://angular.io/guide/http-test-requests#http-testing-library) testing library). For every scenario the behavior of the service or in other words its API to the outside is tested. Implementation details are 
not tested to keep the tests immune against refactoring (the changes which don't affect 
the behavior to the outside).

There is also a [video](https://www.youtube.com/watch?v=EZ05e7EMOLM) from 2017 which is still current regarding this topic.

### E2E tests and Storybook interaction tests
The same principle as for unit tests: the implementation details are not tested.
The implementation details in this case are css classes, ids and other stuff which
will or theoretically can be changed or removed to improve the template. Thus a
separate marker should be used for E2E tests and Storybook interaction tests,
e.g. the `testid` attribute which works on both cypress and storybook.

The goal of storybook interaction tests is to make sure every entry in 
storybook behaves as expected and is generally there (e.g. instead of an ugly black-red
error message).

The goal of E2E tests is to make sure the app behaves for the end user as expected.
If they are performant they save a lot of work for manual testing. E2E tests should be 
made economically to provide a good performance.

E.g. in case of a table it should be enough to test if the header row and first two data rows are there. 

When you test if the data was loaded on the page correctly is't usually not necessary to call visit for every component. Same when you test the loading, error and no data states on the page. It usually should be enough to make one visit for each state instead of one visit for
each component.

If you have a lot of combinations to check, fill and post some data, it's reasonable to test e.g. the most important ten ones instead of 200 of them.

To make a test better readable the page object approach is used.

### DRY
To avoid repeating e.g. for such standard states like, loading, error and no data, a wrapper
(here [`common-wrapper.component`](https://github.com/juri-sinitson/angular-monorepo/blob/main/libs/shared/ui-common/src/lib/components/common-wrapper/common-wrapper.component.ts)) is used. The goals:
1. The depiction of states is unified and can be changed in one place
2. One saves time just wrapping the data component instead of writing those 
   routines again and again.

## CI
Currently (2024-03-18) [github actions](https://docs.github.com/en/actions) for a 
pull request are used. Especially the [cache](https://github.com/actions/cache) in combination with the [affected](https://nx.dev/nx-api/nx/documents/affected) tool of [nx](nx.dev). You will find the configuration [here](https://github.com/juri-sinitson/angular-monorepo/blob/main/.github/workflows/ci.yml).

Goals:
1. The pipeline becomes much faster, because:
>1. With the cache mentioned above the dependencies, especially `node_modules` are reused by the subsequent CI executions instead of
   redownloading them every time.
>2. With the affected command mentioned above only the changes and their dependencies are processed instead of processing everything.

### What to do to by changes in a shared library?
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

# Not yet documented/hard to find
## Adding of missing plugins to reduce the configuration
This seems not yet (2024-03-19) to be documented in nx 18.x and is made with the command `pnpm dlx nx@latest init` according to [this](https://youtu.be/PzCgpM7qtTU?t=1363) source. So if you issue this command in an existing monorepo nx asks you
what configuration plugins you would like to install and adds the default config of them. If you don't understand why is configuration by plugins useful, it's most probably worth for you to watch the whole video.

# Troubleshooting
## Execution
### Nx Cloud tries to execute a payed plan instead of the free one and fails
**Cause**

This seems to appear du to a an outdated free plan organization or workspace in the cloud profile. 

**Solution**

Delete the organization and recreate. Try to avoid multiple organization in case
of the free plan.

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
