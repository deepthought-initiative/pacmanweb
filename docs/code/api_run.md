# Trying out the API

#### Spawning a new PACMan process 
A new process can be spawned with `/api/run_pacman`. The below table contains description of params-

| Parameter                           | Description                                                   | Required | Options/Format                  |
|-------------------------------------|---------------------------------------------------------------|----------|----------------------------------|
| `main_test_cycle`                   | Number of the main test cycle                                 | Yes      | Integer                          |
| `mode`                              | Mode to run pacman in                                         | Yes      | `PROP`, `DUP`, `MATCH`, or `ALL` |
| `past_cycles`                       | List of cycles                                                | No       | Comma-separated list             |
| `modelfile`                         | Modelfile to use                                              | No       | File name                        |
| `assignment_number_top_reviewers`   | Number of top recommended reviewers to assign                 | No       | Integer                          |
| `close_collaborator_time_frame`     | Number of years over which to check close collaborators       | No       | Integer (years)                  |


Sample response-
```json
{
    "output": "PACMan running with task id 2b87bfe7-eff2-43c2-a0ad-33ad93d3952a",
    "result_id": "2b87bfe7-eff2-43c2-a0ad-33ad93d3952a"
}
```

Sample response if process already running-
```json
{
    "output": "PACMan already running with task id 4eb02d9d-5ebd-45be-b658-301287094a73. New task not started.",
    "result_id": "4eb02d9d-5ebd-45be-b658-301287094a73"
}
```


#### Seeing the progress of the run 
Logs of processes can be seen using- `api/prev_runs/<result_id>`.
Replace the `result_id` above with the hash you got in the previous response. If the process is still going on, it would send you a response like this-
```json
{
    "ready": true,
    "successful": false,
    "value": null
}
```

If it completed, the response would include the traceback of the run, for example-
```json
{
    "ready": true,
    "successful": true,
    "value": "INFO [proposal_scraper.scrape_cycles:576] /Users/PACMan/./runs/input_proposal_data/221026/*txtx\nINFO [proposal_scraper.scrape_cycles:579] Found 7 proposals to scrape\nRunning PACMan...\nLog file can be found at ./runs/logs/PACMan_e7a81b49-4f70-42fa-87fd-0fd112958baf_20240131T155649.log\n\rScraping Proposals:   0%|          | 0/7 [00:00<?, ?it/s]\rScraping Proposals: 100%|##########| 7/7 [00:00<00:00, 2328.69it/s]\nINFO [proposal_scraper.scrape_cycles:576] /Users/PACMan/./runs/input_proposal_data/231026/*txtx\nINFO [proposal_scraper.scrape_cycles:579] Found 6 proposals to scrape\n\rScraping Proposals:   0%|          | 0/6 [00:00<?, ?it/s]\rScraping Proposals: 100%|##########| 6/6 [00:00<00:00, 3131.25it/s]\n"
}
```

#### Terminating a task 
To terminate a task, use `api/terminate/<result_id>`.
You would also need to provide the mode of the process as a param.
```
Task <result_id> terminated
```

#### Streaming Responses
Streaming can be done using `api/stream/<result_id>`

#### Getting Results 
To get results you can use `outputs/<output_mode>/<result_id>` 

You will have to replace the `output_mode` by one of the following- `proposal_cat_output`, `duplicates_output` or `match_reviewers_output`. `result_id` will be the hash(celery ID) from the output.

| Endpoint                                           | HTTP Method | Description                              | Required Parameters | Optional Parameters |
|----------------------------------------------------|-------------|------------------------------------------|-----------------------------|---------------------|
| `/api/outputs/duplicates_output/<result_id>`       | GET         | Retrieves duplicates output              | `cycle_number` | None                |
| `/api/outputs/match_reviewers_output/<result_id>`  | GET         | Retrieves reviewer matching output       | `cycle_number` | None                |
| `/api/outputs/proposal_cat_output/<result_id>`     | GET         | Retrieves proposal categorization output | `cycle_number` | None                |


#### Uploading files
The `/api/upload` endpoint can be used to upload files to the PACMan repo. Unlike other requests, this will be a `POST` request with the files as form data in the body of the URL. There are a few contraints though-
- The file has to be a zip file, or it will be rejected by the API. 
- Panelist and model files can be placed in the root of the zip folder or inside separate folders- but the folder names must contain words "panelist" and "model" respectively.
- Proposal files **need** to be in a separate folder, each proposal file being inside it's cycle folder. For example, for proposal 1 of Cycle 221026, the file path will be `zip_file_root/221026/00001.txtx`

#### Getting available cycles and models
The endpoint `api/get_cycles` will return available cycles in panelist and proposal folders and the models present in the models folder. 
