### StackEdit
StackEdit is a browser-based tool for editing markdown files.  Files created/edited in StackEdit can be synchronized with or published to a variety of online sources, including Google Drive and Github.  The setup and usage instructions below describe the simplest setup for the one-way publishing of files to the https://github.com/jstor-labs/plant-humanities Github repository.

### Setup
To start using StackEdit to create/edit markdown files navigate to [https://stackedit.io](https://stackedit.io) where you should see a page like the following.

<p align="center">
  <img src="images/stackedit-home.png" style="width:100%;max-width:400px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border:1px solid #aaa;margin-bottom:6px;" ><br/>
  <span style="padding-top:24px;font-size:1.1em;font-weight:bold;">StackEdit Home Page</span>
</p>

On this page click the `START WRITING` header at the top.  The next page displayed should look something like this which is a welcome/help file that is automatically added to the default workspace.

<p align="center">
  <img src="images/stackedit-welcome.png" style="width:100%;max-width:400px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border:1px solid #aaa;margin-bottom:6px;" ><br/>
  <span style="padding-top:24px;font-size:1.1em;font-weight:bold;">StackEdit Welcome File</span>
</p>

This welcome file provides a general overview of how StackEdit can be used to synchronize and/or publish files to/with external locations.  For our purposes we will just be using the `Publish a File` capability to keep things simple, at least initially.

From the Welcome File page select the Folder icon at the top left of the page to open the **file explorer** pane.  From the file explorer files can be deleted, added and otherwise organized.  To add a new essay file click the add file icon at the top of the file explorer pane and give the new file a name.  Note that files published to our Github repository will require a `.md` file extension, adding this extension is optional when naming a file in the explorer.

If the file added to StackEdit already exists in the Github repository you'll need to manually add the file contents to the StackEdit copy.  To do this navigate to [https://github.com/JSTOR-Labs/plant-humanities/tree/master/docs/content](https://github.com/JSTOR-Labs/plant-humanities/tree/master/docs/content)  and select the applicable file.  After selecting the file Github will show the markdown file in a rendered form.  We will need the raw markdown text which can be viewed by selecting the `Raw` option from the toolbar near the top of the page.  From the raw content viewer copy all of the text and paste it into the StackEdit file just created. 

After the new file has been added to the StackEdit workspace (and optionally, any content copied from an existing file in the Github repo), the file will need to be configured for publication to Github.  To do this, first ensure that the newly created file is selected in file explorer pane and the select the menu icon at the top right of the StackEdit screen (the menu icon is a rounded square with the `#` character).  From the menu select the `Publish` menu item.

#### Link Github account to StackEdit
At this point, depending on whether you'd previously linked your Github to StackEdit or not, you may see the `Publish to GitHub` option in the men or just a list of accounts to add (including Github, Dropbox, Google Drive, and others).  
If the `Publish to Github` option is available skip to the **Set publication destination for file** step.  If not, you will need to first add your Github account. 

1. From the next list of menu items select `Publish to GitHub`.  
2. If your Github account had not previously been linked to Github you will be presented with a dialog like that shown below requesting permission to link your Github account to StackEdit.  Ensure the `Grant access to your private repositories` option is checked and press 'OK'.  

	<p align="center">
	  <img src="images/stackedit-link-github.png" style="width:100%;max-width:200px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border:1px solid #aaa;margin-bottom:6px;" ><br/>
	  <span style="padding-top:24px;font-size:1.1em;font-weight:bold;">Link your GitHub account to StackEdit</span>
	</p>

3. At this point you may need to sign in to Github.  If so, a sign in dialog like the following will appear.  Enter your Github credentials and select `Sign In`. 

	<div align="center">
	  <img src="images/stackedit-github-signin.png" style="width:100%;max-width:200px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border:1px solid #aaa;margin-bottom:6px;" ><br/>
	  <p style="padding-top:24px;font-size:1.1em;font-weight:bold;">GitHub Sign In dialog</p>
	</div>

4. If two factor authentication is enabled for your Github account you will probably be presented with another dialog to enter an authentication code sent via SMS.  If so, enter the code and select `Verify`.  

	<p align="center">
	  <img src="images/stackedit-github-signin-2fa.png" style="width:100%;max-width:200px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border:1px solid #aaa;margin-bottom:6px;" ><br/>
	  <span style="padding-top:24px;font-size:1.1em;font-weight:bold;">GitHub two factor authentication dialog</span>
	</p>
	
5. You should now be back in the StackEdit environment. 

#### Set publication destination for file
From the StackEdit `Publish` menu select `Publish to GitHub` (ensure the file to publish is selected in the file explorer pane).  A dialog will appear where the publish destination can be specified.  Enter `https://github.com/jstor-labs/plant-humanities` in the `Repository URL` field.  Enter the Github path for the published file in the `File path` field.  This path must include the prefix `docs/content/` followed by the file name with a `.md` file extension.  The Github file name doesn't necessarily need to match the name of the file name defined in the StackEdit file explorer but using the same name can be helpful if multiple files are being managed.  Also, select `Plain text` from the `Template` menu.  

	<p align="center">
	  <img src="images/stackedit-github-publish.png" style="width:100%;max-width:200px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border:1px solid #aaa;margin-bottom:6px;" ><br/>
	  <span style="padding-top:24px;font-size:1.1em;font-weight:bold;">GitHub file publication dialog</span>
	</p>
	
After selecting 'OK' the Github icon should appear next to the file in the file explorer pane indicating that the publication destination configuration was successful.  After this has been configured updates to the file can be published to Github by selecting the publish icon in the StackEdit toolbar.  The publish icon is the up arrow with a line at the bottom.
