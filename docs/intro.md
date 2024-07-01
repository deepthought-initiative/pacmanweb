# Welcome to PACMan Web Docs

PACMANweb is a web app designed to run [PACMan](https://github.com/spacetelescope/PACMan) online. The following text will tell you the key features of PACManWeb. Head over to the [](./installation/prerequisites.md) for installation instructions and more.

###### Dedicated Pages for PACMan Tasks
PACManWeb contains specialized pages for different types of tasks, including proposal categorization, matching reviewers to proposals, and finding duplicates among proposals. PACMANweb also offers a secure REST API, providing users with full control over tasks. The API allows users to track ongoing tasks, spawn new tasks, and terminate tasks.

<figure style="margin: auto; display: flex; flex-direction: column; align-items: center;">
  <video width="800" height="400" autoplay muted playsinline style="outline: none; border: none; padding: 0;">
    <source src="proposals.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption style="text-align: center; margin: 0;">Proposal Categorisor Demo</figcaption>
</figure>

###### Log Streaming and Output Management
The website streams logs from PACMan, allowing users to monitor the process in real-time. Users can download the outputs and also upload proposal files and panelist files. The website is built on Celery and Redis which enable PACMANweb to handle multiple tasks simultaneously and efficiently.
<figure style="margin: auto; display: flex; flex-direction: column; align-items: center;">
  <video width="800" height="300" autoplay muted playsinline style="outline: none; border: none; padding: 0;">
    <source src="logs.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption style="text-align: center; margin: 0;">Live Logs Streaming</figcaption>
</figure>

###### User Management
PACMANweb features user authentication and registration system, ensuring that only authorized users can access and utilize the platform. 
<figure style="margin: auto; display: flex; flex-direction: column; align-items: center;">
  <video width="800" height="300" autoplay muted playsinline style="outline: none; border: none; padding: 0;">
    <source src="admins.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <figcaption style="text-align: center; margin: 0;">Admin Dashboard</figcaption>
</figure>

