I recently was tasked with recovering access to a colleague's desktop PC. I understood this was possible through the widely known Windows 10 recovery exploit.

However, doing this was much harder than it should have been, mostly due to the fact every tutorial I could find online had incomplete instructions.

I hope to have this be fairly comprehensive and complete as far as a Windows *X* local password reset exploit goes.

Some disclaimers:
* I'm not responsible for you bricking your device, data loss, or otherwise any damage to your computer/data/reputation/ego.
* I only attempted this on Windows 10, but this can allegedly work on any version of Windows.
* This will only work for LOCAL WINDOWS USERS. This CANNOT be used to recover Windows Live logins.

#Step 1 - Windows Install CD
First step is to insert a Windows Installer CD or USB. If I'm feeling generous, I'll link to a resource to help make one.

Once you've inserted the install media, reboot, and enter your boot menu (Usually ESC on HP, F12 on Dell)

Boot to the CD/USB

#Step 2 - Administrator Commandline
Once you've loaded into Windows, you can ignore the Install prompt and just hit SHIFT+F10, this should bring up an Administrator Command Prompt.

The prompt should say something like "X:\Windows\". You will need to get to your main OS disk. If you don't know what your disk letter is, you probably shouldn't be attempting this tutorial, but what do I know?

## Step 2.5 - Identify OS disk
Type `DISKPART` and hit ENTER. This will bring up the Disk Partitioning Utility.

Next type `detail disk` and hit ENTER. This will show you the volumes on the disk. Your OS volume should be under "Boot" in the Info Column.

Once you have identified the disk Windows is installed on, type the following into the command prompt:
`C:`
* replace "C" with whatever letter your disk is.

#Step 3 - Edit files
Next we need to modify two files: `cmd.exe` and `Utilman.exe`.

Type: `cd C:\Windows\System32\` and hit ENTER.
Type: `move Utilman.exe Utilman.exe.bak` and hit ENTER.
Type: `move cmd.exe Utilman.exe` and hit ENTER.

In order
* We have navigated to the System32 folder
* Renamed UtilMan.exe so we don't lose or delete it
* And renamed cmd.exe to UtilMan.exe so we can access the command prompt from the login screen.

Once this is done, we can reboot the PC using: `wpeutil reboot` and hit ENTER.

Boot into the main OS login screen and we're almost through.

#Step 4 - Regain access
Once at the login screen, hit the icon that looks like this <image1> or this <image2> (usually at the bottom left or bottom right-hand corner).

This should bring up an Administrator Command Prompt.

Depending on your PC setup, you may have to enable local admin, or add a new admin user. For now, I'm only going to cover changing your user password.

Type: `net user` and hit ENTER. This will bring up a list of all local user accounts.
Find the account which is locked out.

Type: `net user USERNAME "NEWPASSWORD"` and hit ENTER.
* ACCOUNTNAME needs to be the username you are modifying
* NEWPASSWORD will be the new password. I suggest using double-quotes to help avoid syntax issues.
* Example: `net user Administrator "IAmTheGreatestAdminEver12@"

Once that is done, you should be able to login to the account using that password.

#Step 5 - Clean-up
One last thing you need to do is clean up the file changes you made. You *may* have to boot back into the install disk to do this.

At the command prompt, simply reverse what file changes you made earlier.

Type:
* `C:`
* `cd C:\Windows\System32`
* `move Utilman.exe cmd.exe`
* `move Utilman.exe.bak Utilman.exe`

Once that is done, you can boot back into your PC and use it normally.

Hope this helps you, but in all likelihood, I'll be the only one using this for reference when I have to do this again.
