# Trying out the API
To try out the API yourself, we'd recommend using [Postman](https://www.postman.com/). However you can also see the results in your browswer.  
```{note}
- There are three modes, `PROP`, `DUP` and `MATCH`. The cycles mentioned here are for demonstration purposes, you can replace them with the names of the cycles in your PACMan folder.
- Before heading on, make sure that Celery and Flask and running and there are no error messages.
```

#### Spawning a new PACMan process 
A new process can be spawned with- \
[http://127.0.0.1:8000/api/run_pacman?mode=DUP&past_cycles=221026,231026](http://127.0.0.1:8000/api/run_pacman?mode=DUP&past_cycles=221026,231026) \
This should get you the following response-
```json
{
    "output": "PACMan running with task id 2b87bfe7-eff2-43c2-a0ad-33ad93d3952a",
    "result_id": "2b87bfe7-eff2-43c2-a0ad-33ad93d3952a"
}
```
```{note}
At the moment, to prevent spamming, each user can only run process of one mode at a time. If they try to spawn another process, the code will say that a process is already running and it'll return the task id of the existing process. 
```

#### Seeing the progress of the run 
You can see the progress of the run in your Celery logs terminal or by sending another request-
[http://127.0.0.1:8000/api/prev_runs/<result_id>](http://127.0.0.1:8000/api/prev_runs/<result_id>) \
Replace the `result_id` above with the hash you got in the previous response. If the process is still going on, it would send you a response like this-
```json
{
    "ready": true,
    "successful": false,
    "value": null
}
```

If it completed, the response would include the traceback of the run.
```json
{
    "ready": true,
    "successful": true,
    "value": "INFO [proposal_scraper.scrape_cycles:576] /Users/PACMan/./runs/input_proposal_data/221026/*txtx\nINFO [proposal_scraper.scrape_cycles:579] Found 7 proposals to scrape\nRunning PACMan...\nLog file can be found at ./runs/logs/PACMan_e7a81b49-4f70-42fa-87fd-0fd112958baf_20240131T155649.log\n\rScraping Proposals:   0%|          | 0/7 [00:00<?, ?it/s]\rScraping Proposals: 100%|##########| 7/7 [00:00<00:00, 2328.69it/s]\nINFO [proposal_scraper.scrape_cycles:576] /Users/PACMan/./runs/input_proposal_data/231026/*txtx\nINFO [proposal_scraper.scrape_cycles:579] Found 6 proposals to scrape\n\rScraping Proposals:   0%|          | 0/6 [00:00<?, ?it/s]\rScraping Proposals: 100%|##########| 6/6 [00:00<00:00, 3131.25it/s]\n"
}
```

#### Terminating a task 
To terminate a task, run- [http://127.0.0.1:8000/api/terminate/<result_id>](http://127.0.0.1:8000/api/terminate/<result_id>). Please ensure to provide the mode of the process as params too.

#### Streaming Responses
Unfortunately, you cannot test streaming APIs on PACMan, but you can try them in your web browser- \
[http://127.0.0.1:8000/api/stream/<result_id>](http://127.0.0.1:8000/api/stream/<result_id>)

#### Getting Results 
To get results you can do [http://127.0.0.1:8000/api/outputs/<output_mode>/<result_id>?cycle_number=221026](http://127.0.0.1:8000/api/outputs/<output_mode>/<result_id>?cycle_number=221026) 

You will have to replace the `output_mode` by one of the following- `proposal_cat_output`, `duplicates_output` or `match_reviewers_output`. `result_id` will be the hash from the output. Cycle number here is 221026 but that can be changed to something else.


#### Uploading files
The API- http://127.0.0.1:8000/api/upload can be used to upload files to the PACMan repo. Unlike other requests, this will be a `POST` request with the files as form data in the body of the URL. There are a few contraints though-
- The file has to be a zip file, or it will be rejected by the API. 
- Panelist and model files can be placed in the root of the zip folder or inside separate folders- but the folder names must contain words "panelist" and "model" respectively.
- Proposal files **need** to be in a separate folder, each proposal file being inside it's cycle folder. For example, for proposal 1 of Cycle 221026, the file path will be `zip_file_root/221026/00001.txtx`

#### Getting available cycles and models
The API- http://127.0.0.1:8000/api/get_cycles will return available cycles in panelist and proposal folders and the models present in the models folder. 

