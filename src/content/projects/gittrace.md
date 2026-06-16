---
title: "GitTrace"
year: "2026"
description: "A Flutter Desktop application that generates monthly internship reports based on local Git activity with interactive calendar visualization and multi-format export."
fullDescription: "GitTrace is a Flutter Desktop app (Windows, macOS, Linux) designed to help interns and professionals generate monthly reports from local Git activity. It detects your Git activity, visualizes it into an interactive calendar, allows working hours and activity adjustments, and automatically generates formatted reports."
image: "/images/gittrace.png"
projectLink: "https://github.com/ekyaaa/git_trace/releases/tag/v2.0.0"
repoLink: "https://github.com/ekyaaa/git_trace"
technologies:
  - name: "Flutter"
    icon: "simple-icons:flutter"
    docLink: "https://docs.flutter.dev/"
  - name: "Dart"
    icon: "simple-icons:dart"
    docLink: "https://dart.dev/"
  - name: "Git"
    icon: "simple-icons:git"
    docLink: "https://git-scm.com/doc"
---

## The Problem
During internships, students and professionals are often required to submit monthly activity reports based on their Git commits. However, manually compiling these reports is tedious and error-prone. There was no easy way to automatically track Git activity and generate a well-formatted report in standard formats like Excel, Word, or PDF.

## The Solution
I developed GitTrace, a Flutter Desktop application that automatically scans local Git repositories, visualizes commit activity in an interactive calendar, and generates professional monthly reports in multiple formats (Excel, Word, PDF). The app also supports working hour tracking, duplicate commit resolution, and custom Word templates for institutional requirements.

## Project Overview
GitTrace is a cross-platform Flutter Desktop application built to simplify the process of creating monthly internship or work reports from local Git activity. The app recursively scans your project directories, detects all Git repositories, and compiles your commit history into an interactive monthly calendar. It allows you to adjust working hours, edit activity descriptions, and export reports in Excel, Word, or PDF formats with proper formatting.

## Key Features
- Interactive calendar dashboard with daily commit statistics
- Automatic Git repository scanning and detection
- Working hours tracking with bulk set functionality
- Activity description editing with auto-save draft
- Duplicate commit merging or separation
- Multi-format export: Excel (.xlsx), Word (.docx), and PDF (.pdf)
- Custom Word template support with variable substitution
- Post-export file manager integration
- Premium dark mode theme
- CI/CD automation with GitHub Actions for releases

## Contributors
- [AlexanderDev2004](https://github.com/AlexanderDev2004)
- [ekyaaa](https://github.com/ekyaaa)

## Technologies Used
- [Flutter](https://docs.flutter.dev/) - A UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.
- [Dart](https://dart.dev/) - A client-optimized programming language for apps on any platform.
- [Git](https://git-scm.com/doc) - A free and open source distributed version control system designed to handle everything from small to very large projects.
