---
title: "Dual Booting"
date: 2026-03-20
description: "I Try to dual boot my computer"
tags: ["yapping", "journey", "Experiment", "Linux", "Windows"]
---

### **Introduction**
</br>

**Hello**, after thinking it over for so long, I finally decided to dual-boot my laptop with Linux and Windows, and it's already up and running.  I'm excited to share my journey and the experiences I've had so far. I hope you enjoy reading this and find it inspiring.
</br>
</br>
To be honest I'm not much of a yapper or a writer, but I do think that writing is an important skill, and I want to practice it here, because I want do it for fun. </br> </br>

### **Chapter 1**: why the consideration? </br> </br>

Why the hesitation?

I've been planning to dual-boot this laptop for quite a while now, but I had some concerns—like what if I mess up the setup, will my Windows OS be safe? Does this laptop even support it? How's the RAM and memory usage when dual-booting, is it safe, etc.? And it turns out... </br> </br>

### **Chapter 2**: Why choose Nobara Linux? </br> </br>
- It turns out it works; I asked a friend and they suggested using Nobara. Why Nobara specifically? Because Nobara is based on Fedora and already has NVIDIA graphics support, so I'll just need to install the drivers later. Why not something else? Because other OSs can be a pain with NVIDIA graphics and don't support them well, leading to errors during installation. Plus, not all Linux distros are great for gaming, haha. So, in the end, I decided to go with Nobara as my OS of choice. </br> </br>

### **Chapter 3**: Installing and Setting Up Dual Boot (Nobara + Windows) </br> </br>

Here is the practical setup flow I used, step by step. </br> </br>

1. **Back up important files first**
   - Before touching partitions, I backed up my documents and game saves to an external drive/cloud.
   - If something goes wrong during partitioning, I can recover quickly. </br> </br>

2. **Prepare Windows before installing Linux**
   - Disable **Fast Startup** in Windows.
   - Suspend/disable **BitLocker** first if your system drive is encrypted.
   - Open **Disk Management** and shrink the Windows partition to create unallocated space for Nobara (I recommend at least 80-120 GB). </br> </br>

3. **Download Nobara ISO and create a bootable USB**
   - Download Nobara ISO from the official page.
   - Burn it to USB using Rufus (Windows) or balenaEtcher. </br> </br>

4. **Boot from the USB installer**
   - Reboot and open BIOS/UEFI boot menu (usually by pressing F2/F12/ESC/DEL depending on laptop brand).
   - Make sure your system is using **UEFI mode**.
   - If needed, temporarily disable **Secure Boot** so the installer and drivers work smoothly. </br> </br>

5. **Install Nobara**
   - Select language, keyboard, timezone.
   - Choose **Custom/Manual partitioning** (recommended for dual boot).
   - Use the unallocated space you created from Windows.
   - Keep the existing **EFI partition** (usually FAT32) and mount it to `/boot/efi` (do not format it).
   - Create Linux partitions, for example:
     - `/` (root): 50-80 GB (or more)
     - `swap`: 4-16 GB (optional, depends on RAM/hibernation needs)
     - `/home`: the rest (optional but recommended)
   - Continue install and let Nobara install GRUB bootloader. </br> </br>

6. **First reboot and boot menu check**
   - After installation, reboot and you should see **GRUB** with entries for Nobara and Windows Boot Manager.
   - Test both entries once to confirm both OS installations are healthy. </br> </br>

7. **Post-install setup (important)**
   - Update packages:

```bash
sudo dnf upgrade --refresh -y
```

   - Install any pending GPU/NVIDIA updates from Nobara tools/software center.
   - Set your default boot OS and timeout in GRUB if needed. </br> </br>

### **Useful Links** </br> </br>

- Nobara official website: [https://nobaraproject.org/](https://nobaraproject.org/)
- Nobara download page: [https://nobaraproject.org/download-nobara/](https://nobaraproject.org/download-nobara/)
- Rufus (bootable USB tool): [https://rufus.ie/](https://rufus.ie/)
- balenaEtcher (bootable USB tool): [https://etcher.balena.io/](https://etcher.balena.io/)
- Microsoft guide (Disk Management): [https://learn.microsoft.com/windows-server/storage/disk-management/overview-of-disk-management](https://learn.microsoft.com/windows-server/storage/disk-management/overview-of-disk-management)
- Microsoft guide (BitLocker): [https://support.microsoft.com/windows/turn-device-encryption-on-or-off](https://support.microsoft.com/windows/turn-device-encryption-on-or-off)
- Nobara New User Guide and General Usage Guidelines [https://wiki.nobaraproject.org](https://wiki.nobaraproject.org/en/new-user-guide-general-guidelines#:~:text=It%20is%20NOT%20recommended%20to,currently%20have%20an%20EFI%20partition.)

That is the full process I used to install and set up dual boot safely. If you want, in the next chapter I can also share troubleshooting (GRUB not showing Windows, black screen after NVIDIA driver, and recovery tips). 
