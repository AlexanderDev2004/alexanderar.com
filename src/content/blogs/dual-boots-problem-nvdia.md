---
title: "Dual-Boot Problem - NVIDIA"
date: 2026-04-01
description: "Why my laptop screen goes black when using Linux"
tags: ["yapping", "journey", "experiment", "linux"]
---

## Introduction

After setting up a dual-boot system with Windows and Linux, I ran into a major issue: the screen went black every time I booted into Linux.

At first, I had no idea what caused it. If you are curious about my dual-booting process, you can check it here:

- [Dual-booting process](/blogs/dual-boot)

## Chapter 1: Why did this problem happen?

I use an ASUS TUF Gaming F15 with:

- NVIDIA GeForce GTX 1650
- Windows 11

After discussing with a friend, we found that the issue was related to the NVIDIA driver. This often happens because NVIDIA drivers are proprietary and are not fully integrated with the Linux kernel by default.

## Chapter 2: How to fix the problem?

Here are the steps I used to fix it:

### 1. Update the system

```bash
sudo dnf update -y
```

Purpose:

- Update all packages
- Synchronize the system with repositories
- Resolve dependency conflicts

### 2. Reinstall KDE Plasma and SDDM

```bash
sudo dnf reinstall plasma-desktop sddm -y
```

Purpose:

- Reinstall KDE (Plasma desktop environment)
- Reinstall SDDM (login manager)
- Fix broken GUI components

### 3. Install NVIDIA driver (akmod version)

```bash
sudo dnf install akmod-nvidia -y
```

Purpose:

- Install NVIDIA driver with akmod support
- Automatically rebuild the driver when the kernel updates

### 4. Rebuild NVIDIA driver

```bash
sudo akmods --force
```

Purpose:

- Force rebuild NVIDIA driver for the current kernel
- Ensure compatibility with the installed kernel

### 5. Rebuild initramfs

```bash
sudo dracut --force
```

Purpose:

- Rebuild boot image (initramfs)
- Ensure NVIDIA driver loads during boot

## Conclusion

### Initial problem

- Kernel and NVIDIA driver were not synchronized

### Solution summary

1. Synchronize the system
2. Reinstall GUI components
3. Install NVIDIA driver
4. Rebuild the driver
5. Rebuild the boot system

### Simple analogy

- Kernel = new engine
- NVIDIA driver = adapter
- KDE = dashboard

### What happened

- The engine was updated
- The adapter was not compatible
- The dashboard did not work

### What we did

- Installed the correct adapter
- Matched everything again
- Restarted the system

### Why does this happen often?

- Linux kernel updates frequently
- NVIDIA uses proprietary drivers (not native to Linux)

Because of that, manual bridging using tools like akmod is often required.

## Useful Links

1. [NVIDIA official website](https://www.nvidia.com/)
2. [Fedora discussion](https://discussion.fedoraproject.org/t/installing-nvidia-on-a-dual-linux-setup/112335)
3. [Linux.org discussion](https://www.linux.org/threads/issue-with-nvidia-driver-message-nobara-and-i-cant-seem-to-get-rid-of-it.42506/)
4. [Nobara user guide](https://wiki.nobaraproject.org/en/new-user-guide-general-guidelines)