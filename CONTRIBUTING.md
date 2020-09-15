# Contributing to the Plant Humanities site

The [Plant Humanities](https://plant-humanities.app) site is home to a set of visual essays in the field of botany.  This document describes the process for contributing new content to the site.

## Quick start

This section defines the basic process for adding or modifying content on the liave site.  Each of the steps in this quick start are descibed in more detail later in the document.

1. **[Create a copy of the master repository](#user-content-create-a-copy-of-the-master-plant-humanities-repository) in your personal GitHub account**.  Fork the master repository at https://github.com/JSTOR-Labs/plant-humanities
2. **Modify content** on the _develop_ branch in your personal copy of the master repository.  Content may be added/removed/modified in any number of ways, including cloning the forked repository to your local computer and using an editor or IDE.  The [Adding and editing content](#user-content-adding-and-editing-content) section below describes a simple approach using an online Markdown editor.
3. **[Submit a pull request](#user-content-submitting-changes-for-inclusion-in-the-plant-humanities-site)** to request that your changes be added to the master repository.

## Create a GitHub account

If you already have a GitHub accout and are familiar with basic version control concepts like _commits_, _forking_, _branching_, _pull requests_, etc this section can be skipped.

1. Create a GitHub account at https://github.com.  They're free.
2. Familiarize yourself with version control concepts and GitHub. If you're new to Github, below are a couple resources explaining some basic concepts that will be helpful to know: 
    - The [Hello World](https://guides.github.com/activities/hello-world/) tutorial available on the [GitHub Guides](https://guides.github.com/) site.
    - The first three videos in the [Git and GitHub for Poets](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZF9C0YMKuns9sLDzK6zoiV) series.  This series is intended for non-technical users of GitHub and includes 10 short videos explaining core concepts and typical use cases for GitHub.  The first 3 videos in the series cover the basic concepts and provide enough of a foundation for what is needed here.

## Create a copy of the master Plant Humanities repository

The process of creating a copy of a GitHub repository is called `forking`.  This forking process creates an exact copy of an external repository (in this case, the master repository for the Plant Humanities site)in a separate account, typically your personal GitHub account.  With this copy you have the freedom of adding or modifying content without affecting the source respository.  Using the process defined in this document one can also see changes in the context of a fully operational site.

**To create your copy of the master repository:**

Go to the [plant-humanities master repository](https://github.com/JSTOR-Labs/plant-humanities) and fork the `develop` branch.  The active branch can be seen at the top left of the page and should default to _develop_.  If _develop_ is not the active branch it can be changed by clicking on the button displaying the current active branch name.  After ensuring that _develop_ is the active branch click on the `Fork` button located at the top right of the page.  The forking process will only take a few seconds and when completed will open the main page of the forked repository.

## Adding and editing content

Adding or modifying content in the forked repository can be accomplished in a number of ways.  In the sections below a few approaches are described.  Many users will find the combination of the GitHub web site and an external Markdown editor as the most convenient approach.
- The GitHub site can be used to upload content to the forked repository and delete, move, or rename existing content.
- An external tool, like StackEdit (described below) can be used to edit the main visual essay file.

[_Note that the JSTOR Markdown Editor is not currently an option here.  It will be added after support for non-master branch reading/saving is added_]

### The GitHub web site

The GitHub web site can be used to add and modify content.  Since the visual essay files are simple text files (with some custom tags) they can easily be edited using the GitHub built-in editor.  New files can also be created (or uploaded) from the GitHub site.

### StackEdit

[StackEdit](https://stackedit.io) is a web-based [Markdown](https://en.wikipedia.org/wiki/Markdown#:~:text=Markdown%20is%20a%20lightweight%20markup,using%20a%20plain%20text%20editor.) editor that is able to synchronize content with a GitHub repository.  While content can be created and modified using nothing more than the GitHub web interface, it is often convenient to use more purpose-built sites and tools for editing the Markdown text.

#### Configuring StackEdit

When using StackEdit a few initial steps are needed to authorize access to a users GitHub account and link to a specific repository.  Below are the basic steps required:

1. Go to [https://stackedit.io/app#](https://stackedit.io/app#)
2. If not opened automatically, open the right sidebar menu by selecting the `#` button located in the toolbar at the top right of the page
3. In the right sidebar menu select `Workspaces` and then select `Add a GitHub workspace` in the next menu.
4. In the form that is presented enter the following info and press OK:
    - **Repository URL:** https://github.com/YOUR-GITHUB-USERNAME/FORKED-REPO-NAME, replacing `YOUR-GITHUB-USERNAME` and `FORKED-REPO-NAME` with the appropriate values.
    - **Folder path:** `/docs`
    - **Branch:** `develop`
5. If prompted, Link your GitHub account to StackEdit
        - Check the _Grant access to your private repositories_ checkbox
        - Press OK button to complete the setup process
6. After StackEdit has been configured an initial Welcome file is displayed.  If not automatically opened the file browser for the linked repository can be seen by clicking on the folder button located in the toolbar at the top left of the page.  When open the file browser will display the contents of the `/docs` folder in forked copy of the plant-humanities repository. 

#### Using StackEdit

After StackEdit has been configured with a workspace that is linked to your forked GitHub repository edits in the StackEdit tool are automatically synchronized with the forked GitHub repository.  Changes can be also manually synchronized by clicking the `Synchronize now` button in the toolbar located in the top right area of the page.

StackEdit provides helpful online documentation that can be accessed from the right sidebar menu.  Documentation for using StackEdit is found in the _Table of contents_ section.  A handy _Markdown cheat sheet_ is also available from this menu.

## Creating a new visual essay

A visual essay is a Markdown file that is located in the top-level `/docs` folder or child folders.  Visual essay text is formatted using standard Markdown tags and conventions.  Visual components can be associated with each text element using simple HTML tags.  The tags available for use are defined on the [Visual essays help page](https://visual-essays.app/help).

An optional `ve-config` tag is often included at the top of the essay to define a title, the essay author(s), and essay layout.  A custom banner image can also be defined.

### Using a starter template

A simple essay starter template is available in the [essay-template.md](https://raw.githubusercontent.com/jstor-labs/plant-humanities/develop/docs/essay-template.md) found in the `/docs` folder.  The Markdown source text for a sample essay can be seen in the [sample.md](https://raw.githubusercontent.com/jstor-labs/plant-humanities/develop/docs/sample.md) file in the same folder.  The sample essay can be viewed at https://plant-humanities.app/sample.

#### Using the GitHub web interface

Open the file https://raw.githubusercontent.com/JSTOR-Labs/plant-humanities/develop/docs/essay-template.md and select/copy all text.

Go to the `/docs` folder from the main page in the forked repository and click the `Add file` button located in the top right third of the `/docs` page.  From the popup menu select `Create new file`.  Enter the name of the essay file to be created.  This file should include the `.md` file extension.  Since this filename is also used as a path element in the essay URL it is recommended that the name be all lowercase characters and use hyphens in the place of spaces (for instance `my-new-essay.md`) to conform to URL conventions (A proper title for the page is included in the `ve-config` tag in the essay Markdown text).  After the name has been entered paste the contents of the _essay-template.md_ into the `Edit new file` input area and modify as needed.  The green `Commit` button located at the bottom of the screen is used to save the new/modified file contents.

#### Using StackEdit

To create a new essay using the starter template, first create an empty markdown file.  This is accomplished by clicking the `New file` button in the toolbar at the top left of the page.  Note that when using StackEdit the `.md` file extension will be automatically added and should not be included when naming the new file.

After the new file has been created, open the `essay-template` file and using copy/paste commands transfer the text from the template into the newly created essay file.

## Previewing changes

In-process changes can be previewed in the context of the base Plant Humanities site.  To do that use the URL https://visual-essays.app/YOUR-GITHUB-USERNAME/FORKED-REPO-NAME/NEW-ESSAY-NAME, replacing the placeholders `YOUR-GITHUB-USERNAME`, `FORKED-REPO-NAME`, and `FORKED-REPO-NAME` with the appropriate values.

For instance, to see the sample essay from the GitHub account for `rsnyder` the link https://visual-essays.app/rsnyder/plant-humanities/sample would be used.  If a new essay named `a-new-essay.md` had been created the link would be https://visual-essays.app/rsnyder/plant-humanities/a-new-essay


## Updating Plant Humanities home page to add link to new essay

Adding an essay to the Plant Humanities site will typically include adding a link to the site home page located at https://raw.githubusercontent.com/jstor-labs/plant-humanities/develop/docs/index.md.  This file can also be updated and synchronized using StackEdit.

## Submitting changes for inclusion in the Plant Humanities site

When the new content is ready to be added to the master repository (and for subsequent inclusion in the live site) a `pull request` must be generated.

To create a pull request:

1. First ensure that all changes made in StackEdit (or elsewhere) have been saved to the _develop__ in the forked repository.
2. Go to the main page of the forked repository and click the `Pull request` button located in the top right area of the page.
3. Ensure that the values in the `base repository` and `base` fields are `JSTOR-Labs/plant-humanities` and `develop`.  The values in the `head repository` and `compare` fields should also consist of the account and repository name for the forked repository and the _develop_ branch name. 
4. Modify the pull request subject and add any additional comments, as needed.
5. Click the green `Create pull request` button to submit the request to the master repository admins for consideration.
