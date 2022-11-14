# How muting/unmuting changes appear in scheduled SMS messages

<img src="../.gitbook/assets/image (26).png" alt="" data-size="original">![](<../.gitbook/assets/image (22).png>)



* When muting/unmuting, related registrations that have“scheduled\_tasks” (SMS messages which are scheduled to be sent) are updated
* The action of muting will update all “scheduled\_tasks” which are in “scheduled” or “pending” state, setting their state to “muted”
* The action of unmuting will update all present or future “muted” “scheduled\_tasks”, setting their state to “scheduled” (messages with a due date in the past will remain “muted”).
