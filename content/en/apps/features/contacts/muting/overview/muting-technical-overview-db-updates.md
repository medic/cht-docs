# 🧑💻 Muting Technical Overview(DB Updates)

{% hint style="info" %}
**GitBook tip:** A succinct video overview is a great way to introduce folks to your product. Embed a Loom, Vimeo or YouTube video and you're good to go! We love this video from the fine folks at Loom as a perfect example of a succinct feature overview.
{% endhint %}



* Mute state is stored on person and place documents. When a contact is muted, a ‘muted’ key will be added to all relevant contacts. The value of that key will be set to the date that the mute form was synced to the server, not the date that the mute form was submitted. This is because muting is achieved through sentinel transitions and transitions only run on the server. Unmuting a contact will entirely remove the muted key from the contact. To check if a contact is currently muted, you can simply check for the existence of the muted key.
* Mute history is stored on the corresponding -info doc in medic-sentinel. While the mute state is stored on the relevant contact and can tell you the contact’s current mute state, it doesn’t tell you the periods of time the contact was muted. You can see the history of muting and unmuting from the -info doc for the contact. -info docs are stored in the medic-sentinel database in Couch.
* Muting an already muted contact will not update anything. Since we want to know when the contact started to be muted, muting an already muted contact will not update the timestamp on their mute state, nor will it update the mute history. The same is true for unmuting a contact that is not currently muted... we will not update the last unmute timestamp.
