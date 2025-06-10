---
title: Code Review practices
date: 2025-06-10
publishdate: 2025-06-10
tags: ["codereview"]
---

# Introduction

A code review is a process where someone other than the author(s) of a piece of code examines that code.

At Google, we use code review to maintain the quality of our code and products.

This documentation is based on Google's canonical description of their code review processes and policies.

## Guide Structure

This page provides an overview of the code review process. There are two other comprehensive documents that are part of this guide:

- [How To Do A Code Review](https://google.github.io/eng-practices/review/reviewer/): A detailed guide for code reviewers
- [The CL Author's Guide](https://google.github.io/eng-practices/review/developer/): A detailed guide for developers whose CLs are going through review

## What Do Code Reviewers Look For?

Code reviews should look at:

- **Design**: Is the code well-designed and appropriate for your system?
- **Functionality**: Does the code behave as the author likely intended? Is the way the code behaves good for its users?
- **Complexity**: Could the code be made simpler? Would another developer be able to easily understand and use this code when they come across it in the future?
- **Tests**: Does the code have correct and well-designed automated tests?
- **Naming**: Did the developer choose clear names for variables, classes, methods, etc.?
- **Comments**: Are the comments clear and useful?
- **Style**: Does the code follow our [style guides](http://google.github.io/styleguide/)?
- **Documentation**: Did the developer also update relevant documentation?

For more detailed information, refer to the [How To Do A Code Review](https://google.github.io/eng-practices/review/reviewer/) guide.

## Picking the Best Reviewers

In general, you want to find the best reviewers you can who are capable of responding to your review within a reasonable period of time.

The best reviewer is the person who will be able to give you the most thorough and correct review for the piece of code you are writing. This usually means the owner(s) of the code, who may or may not be the people in the OWNERS file. Sometimes this means asking different people to review different parts of the CL.

If you find an ideal reviewer but they are not available, you should at least CC them on your change.

## In-Person Reviews (and Pair Programming)

If you pair-programmed a piece of code with somebody who was qualified to do a good code review on it, then that code is considered reviewed.

You can also do in-person code reviews where the reviewer asks questions and the developer of the change speaks only when spoken to.

## Additional Resources

- [Google Engineering Practices Documentation](https://google.github.io/eng-practices/)
- [Google Style Guides](http://google.github.io/styleguide/)
- [How To Do A Code Review](https://google.github.io/eng-practices/review/reviewer/)
- [The CL Author's Guide](https://google.github.io/eng-practices/review/developer/)

---
*Content based on [Google's Engineering Practices Documentation](https://google.github.io/eng-practices/review/), used under open source license.*

