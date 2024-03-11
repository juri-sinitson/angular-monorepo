<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [What is this repo for?](#what-is-this-repo-for)
- [Is a monorepo an evil?](#is-a-monorepo-an-evil)
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
- [Commits](#commits)
  - [Own additions/modifications](#own-additionsmodifications-1)
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
4. The file without dist shouldn't be versioned! Ensure once more it's really the case!
If not, contact the repo admin. 

<!-- TOC --><a name="the-list"></a>
## The list
1. `nx.json.dist` - this file contains the token for the nx workspace in the cloud


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

<!-- TOC --><a name="commits"></a>
# Commits
See https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines

<!-- TOC --><a name="own-additionsmodifications-1"></a>
## Own additions/modifications
It's reasonable to put the issue/task number direct in front of the description like this:

`feat(some-xyz-lib): T-1256 add xyz functionality`

In this way you will get a good overview over your commits and issues.

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
