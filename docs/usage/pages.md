# Running PACMan

PACManWeb contains specialized pages for different types of PACMan tasks, including proposal categorization, matching reviewers to proposals, and finding duplicates among proposals. The website allows full control and live monitoring of each process and you can download the data that you see here on the website and also the raw one produced by PACMan.

#### Proposal Categorisation
The below screencast is running PACMan to categorise proposals of Cycle 221026. Please note that the proposals used here are not real proposals but were constructed just for demo puposes.

````{div} full-width
<figure style="margin: auto; display: flex; flex-direction: column; align-items: left; padding: 0;">
  <video height="550" autoplay muted playsinline loop style="outline: 1px solid rgba(0, 0, 0, 0.2); border: none; padding: 0;">
    <source src="../proposals.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption style="text-align: center; margin: 0;">Proposal Categorisor Demo</figcaption>
</figure>
````

#### Duplication Checker
This is an example output of the duplication checker process. The website highlights the CS Score indicating how much a proposal is similar to another in the current cycle or in the past cycles.

````{div} full-width
<figure style="margin: auto; display: flex; flex-direction: column; align-items: center;">
  <video height="550" autoplay muted playsinline loop style="outline: 1px solid rgba(0, 0, 0, 0.2); border: none; padding: 0;">
    <source src="../duplication_out.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption style="text-align: center; margin: 0;">Duplication Checker Demo</figcaption>
</figure>

````

#### Match Reviewers
The Match Reviewers Page matches panelists to proposals. You can also add new panelist names in the text box after selecting the current cycle. Below is a demo of the output of the Match Reviewer process.

````{div} full-width
<figure style="margin: auto; display: flex; flex-direction: column; align-items: center;">
  <video height="550" autoplay muted playsinline loop style="outline: 1px solid rgba(0, 0, 0, 0.2); border: none; padding: 0;">
    <source src="../match.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption style="text-align: center; margin: 0;">Match Reviewers Demo</figcaption>
</figure>

````

#### Configuring PACMan Runs
PACManWeb allows configuring each PACMan run from the GUI. You can upload model files, edit panelist names for the match reviewers process, set logging, among others.
````{div} full-width
<figure style="margin: auto; display: flex; flex-direction: column; align-items: center;">
  <video height="550" autoplay muted loop style="outline: 1px solid rgba(0, 0, 0, 0.2); border: none; padding: 0;">
    <source src="../options.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption style="text-align: center; margin: 0;">PACMan Config Options</figcaption>
</figure>
````