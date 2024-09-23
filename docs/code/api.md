# RESTful endpoints

This section provides comprehensive documentation for the PACManWeb API, detailing the available endpoints, their purposes, required parameters, and expected responses, along with cURL examples using Basic Authentication.

## Authentication

All API endpoints require Basic Authentication. Replace `username:password` in the cURL examples with your actual credentials.

## Process Management

### Initiate PACMan Process

**Endpoint:** `/api/run_pacman`

Initiates a new PACMan process.

**Parameters:**

| Parameter                           | Description                                   | Required | Format                           |
|-------------------------------------|-----------------------------------------------|----------|----------------------------------|
| `main_test_cycle`                   | Main test cycle number                        | Yes      | Integer                          |
| `mode`                              | PACMan operation mode                         | Yes      | `PROP`, `DUP`, `MATCH`, or `ALL` |
| `past_cycles`                       | List of past cycles                           | No       | Comma-separated list             |
| `modelfile`                         | Model file to use                             | No       | File name                        |
| `assignment_number_top_reviewers`   | Number of top recommended reviewers           | No       | Integer                          |
| `close_collaborator_time_frame`     | Years to check for close collaborators        | No       | Integer                          |

**cURL Example:**
```bash
curl -G "https://pacmanweb.live/api/run_pacman" \
    -u "username:password" \
    --data-urlencode "main_test_cycle=221026" \
    --data-urlencode "mode=PROP" \
    --data-urlencode "assignment_number_top_reviewers=5" \
    --data-urlencode "close_collaborator_time_frame=3"
```

**Response:**
```json
{
    "output": "PACMan running with task id 2b87bfe7-eff2-43c2-a0ad-33ad93d3952a",
    "result_id": "2b87bfe7-eff2-43c2-a0ad-33ad93d3952a"
}
```

### Monitor Process Progress

**Endpoint:** `api/prev_runs/<result_id>`

Retrieves the current status of a PACMan process.

**cURL Example:**
```bash
curl -u "username:password"  -G "https://pacmanweb.live/api/prev_runs/3164e355-06a2-4dbd-9ffd-a1177754d5df"
```

**Response:**
```json
{
    "ready": true,
    "successful": true,
    "value": "Process log details..."
}
```

### Terminate Process

**Endpoint:** `api/terminate/<result_id>`

Terminates an ongoing PACMan process.

**Parameters:**
- `mode`: Process mode (required)

**cURL Example:**
```bash
curl -X POST "https://pacmanweb.live/api/terminate/720c5c7a-4226-47a8-9fe6-6d2d7297f7c6?mode=PROP" \
     -u "username:password"
```

**Response:**
```
Task 2b87bfe7-eff2-43c2-a0ad-33ad93d3952a terminated
```

### Stream Process Output

**Endpoint:** `api/stream/<result_id>`

Provides a real-time stream of process output.

**cURL Example:**
```bash
curl -u "username:password" "https://pacmanweb.live/api/stream/2b87bfe7-eff2-43c2-a0ad-33ad93d3952a"
```

## Result Retrieval

**Base Endpoint:** `outputs/<output_mode>/<result_id>`

Retrieves process results based on the specified output mode.

| Endpoint                                           | HTTP Method | Description                       | Required Parameters |
|----------------------------------------------------|-------------|-----------------------------------|---------------------|
| `/api/outputs/duplicates_output/<result_id>`       | GET         | Duplicates output                 | `cycle_number`      |
| `/api/outputs/match_reviewers_output/<result_id>`  | GET         | Reviewer matching output          | `cycle_number`      |
| `/api/outputs/proposal_cat_output/<result_id>`     | GET         | Proposal categorization output    | `cycle_number`      |

**cURL Example (Duplicates Output):**
```bash
curl -u "username:password" "https://pacmanweb.live/api/outputs/duplicates_output/2b87bfe7-eff2-43c2-a0ad-33ad93d3952a?cycle_number=221026"
```

## File Management

### Upload Files

**Endpoint:** `/api/upload`

Uploads files to the PACMan repository.

**Method:** POST

**cURL Example:**
```bash
curl -X POST "https://pacmanweb.live/api/upload" \
     -u "username:password" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@/path/to/your/pacman_data.zip"
```

**File Upload Guidelines**

[The file upload guidelines remain the same as in the original document.]

### Retrieve Available Cycles and Models

**Endpoint:** `api/get_cycles`

Returns available cycles in panelist and proposal folders, and models in the models folder.

**cURL Example:**
```bash
curl -u "username:password" "https://pacmanweb.live/api/get_cycles"
```