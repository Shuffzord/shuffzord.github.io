---
title: "Smarter Loan Refactoring Insights"
date: "2025-06-09"
description: "Reflections on refactoring the Smarter Loan project and leveraging AI agents effectively."
tags: [AIagents, vibe_coding, refactoring, promptEngineering]
weight: 2
parent: "smarterloan"
---

[Original Post](https://www.linkedin.com/posts/marvelousmateuszwozniak_mortgage-calculator-plan-your-home-loan-activity-7328723675426263040-qbe8?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAGlPcsBhTG87f6DxBg2vXVcM9gWan9DWpI)

Just three days ago, I posted about my "vibe coding" project https://smarter-loan.com/ where I mentioned that creating with AI agents → easy, and refactoring → hard.
Well, I've changed my mind! 😅

Before diving into specifics, I'd like to thank everyone who used the app and pointed out the numerous bugs 🐛 (fortunately, nothing serious) and also those who suggested improvements and additional solutions. I'm very grateful and thank you—I'm noting everything down and planning ❤️

Generally, the rule with AI agents is that they'll do everything to solve the problem—unfortunately, sometimes this means taking the path of least resistance (e.g., hardcoding values to pass tests 😜). I noticed that working on the code is becoming increasingly difficult—we've reached the typical first stage of every project: the initial architecture wasn't prepared for extensions, time for refactoring! 🛠️ Separations of concerns, decoupling, data structure analysis. I was a bit scared of this undertaking, but...

It turned out to be extremely simple! 🤯 Often when people claim that AI can't do something, it boils down to them not knowing how to use the right model or write the right prompt. I wanted to approach the topic methodically, so I started by preparing a prompt for an AI architect: https://lnkd.in/dDGmbqZT
This prompt—although relatively simple—basically did all the work.

The flow looked as follows:
Architect → Based on the prompt, prepared analyses in .md document formats divided into phases (I can send an example analysis 📝 for those interested) and a hierarchy of changes, along with visualization. The orchestrator sequentially summoned AI agents who checked off tasks from the checklist, and then the architect verified the change process to ensure there were no shortcuts. The entire process essentially ran autonomously after setting initial requirements, and I spent two hours playing hashtag#claireobscur Expedition 33 (which, by the way, I consider a masterpiece 🎮).

The work was done, tests written and run, and the calculation engine significantly simplified. Process cost: ~$30 💰
I'm impressed with the results and can't wait for more people to use the tool—if it helps you save on loans, all the effort will have been worth it! 🔄

What's next? 💎 The next stage I'm tackling is UI tests—similar to the above, shortcuts sometimes lead to issues like formatting not working as intended, so preparing a suite of UI tests will be my priority.

Next, comparative analysis of different overpayments—where the core is already ready, but the visualization layer is still lacking. I encourage everyone interested to test, contact me if they'd like to help with the project or share their experiences with agents! 🙌

Peace ✌️
hashtag#AIagents hashtag#vibe_coding hashtag#refactoring hashtag#promptEngineering