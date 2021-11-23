---
categories: blog linux
---
<style>
p {
	display: block;
}

</style>

<p>I recently decided to switch over to using Linux as my daily driver. However, several of our enterprise apps simply don't work on Linux, and I'd rather not faf about trying to use Wine. To that end, I decided VirtualBox would be the best option over VMware Workstation, mostly because it's free.

I go in and set the VM up, everything is fairly straightforward. As I come to start getting ready to install apps and login to sites for downloads, I find the copy/paste between guest and host doesn't work. Simple enough, I go through the menus and enable bidirectional, restart the VM, and... nothing.

Turns out, I have to download the Oracle equivalent of VMware Tools. Sounds simple enough, however basically no one online has a simple enough description that works for my use case.

It seems most people who are experiencing this problem either run Ubuntu or are smarter than me and can figure it out easily.

The version of VirtualBox that installs to Kali, for whatever reason, seems to lack the simple "devices -> CD -> Guest Additionas" menu option entirely.

After several attempts, multiple VM crashes, and a few reboots, I found the solution that fit my scenario.

First: perform the following commands in your terminal of choice:
`sudo apt-get upgrade -y`
`sudo apt-get install virtualbox-guest-additions-iso -y`
`sudo apt-get install virtualbox-guest-utils -y`

Restart your virtual machine, if it's powered on.

Second: ensure you have an available virtual CD drive. This can be the `Controller: SATA` or something else, but it needs to have the CD option and be set to empty.
This can be done by first powering off your VM, selecting your VM, going to `options -> storage` and either add an optical drive, or just clear the ISO image from the one that presumable came configured OOB.

Once that is done, You can select the CD icon and click "Choose a disk file...", the VBoxGuestAdditions.iso is located at `/usr/share/virtualbox/VBoxGuestAdditions.iso` (At least it was on my version).

Power on your VM, if it isn't already, and Windows should immediately detect the CD, prompting you to run the guest additions installer. Once that is done, restart one last time and copy/paste is yours.

It seems to me that this should work and be applicable to any Linux-based VirtualBox install, but I'm far from an expert on the subject.
Ultimately, I can now copy/paste between systems. I hope it was worth it.

<a href src='https://askubuntu.com/a/681829'>Stack overflow solution</a>
<a href src='https://docs.oracle.com/en/virtualization/virtualbox/6.0/user/settings-storage.html'>Oracle Storage Document</a>
</p>

