## TODO

There's some issues I noticed with this feature. First, when a card gets dragged from Applied to Followed Up, the followed up date is getting set on the backend. But the card's UI is not updating. Cards in the Followed Up column with the date set should have a date badge. I have to refresh to see this badge after dragging.

Second, the dates are incorrect. I don't know if this is a backend issue or a frontend issue. The PHP `date()` function should be setting it as Jun 24, but it's show Jun 25 on the badges, and June 25 in the form when opened. But the JobProfileCard is showing the correct date (but I don't know if this is just subtracting a day incorrectly). Please help me pinpoint where this issue is coming from, and then plan the necessary corrections so the date is getting stored correctly and shown correctly everywhere it exists on the front-end.


If necessary, check the PHP/Linux settings in the `ats-dev` container's timezone to see if one of those could be the issue.


---
### Review Current Ecosystem

- Have Titan-Reasoner review subagents and skills for improvements, and add any suggestions for new skills or agents
"""
I want to make sure I'm using Claude Code as efficiently and effectivley as possible. Please review my custom skills and agents, and looks for any ways I could improve them. The two areas I'm concerned with the most: conciseness and context awareness. Keep in mind that there are some repetitive instructions across by the skills and agents, and I needed to repeat those parts in order to get them to work correctly.

For each agent found in @agents and each skill found in @skill - spawn a subagent to review and grade that specific skill or agent, and return the summary of ways it can improve.

Spawn the subagents sequentially, NOT in parallel. When all the subagents have completed, review their summaries and strip out any fluff.

Finally, take into account all you know about this project provided in @CLAUDE.md and the current agents and skills and repond with how I can improve my current ecosystem using the following markdown format:
```
## Agents
[Subagent Name] - suggested improvements

## Skills
[Skill Name] - suggested improvements
 
## Summary
[You final list of recommendations to improve my Claude Code ecosystem for this project]
```
"""

### Update ROADMAP.md
- Move new page feature (except DB admin) to phase 3 feature list

### Plan Next Sub-phase
- Use plugin to review interview prep page plan, and walk me through ideas for features, or improvements
    - Use Titan-Reasoner and do the same with no plugin
- Create mockups for interview prep page (Titan-Reasoner)