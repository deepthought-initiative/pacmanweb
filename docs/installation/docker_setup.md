# Docker Compose Setup
```{note}
Please refer to the official website to install docker on your (virtual) machine.
https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository 
```
### Prerequisites
#### Frontend Modifications
Head over to `frontend/vite.config.js` and follow the instructions there(only if you edited the file, should work by default on the `main` branch).
You will need to uncomment the line
```js
const { REACT_APP_BASE_URL, REACT_APP_API_URL } = process.env;
```
and comment out these lines
```js
const REACT_APP_BASE_URL = "http://127.0.0.1:8080";
const REACT_APP_API_URL = "http://127.0.0.1:8000";
```

#### Backend Modifications
The file `pacmanweb/config.py` has a variable called `MODE` which should be set to `prod` if using docker.
```py
MODE = "prod"
```


### Production Deployment
Here are all the commands to setup docker containers-
```bash
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up -d # starts the containers in detached mode
```
For shutting them down and removing them and attached volumes
```bash
docker compose -f docker-compose.yml down -v
```


### Common Errors
Below are the errors that you might encounter when running the app with docker.

##### No space left on device
This usually occurs in virtual machines. Ensure that there is appropriate space remaining in the virtual machine using `df -h`. 
```{warning}
You can also clean all the space and do a fresh start with `docker system prune -a --volumes` but you need to careful with it. This will **remove** all containers and attached volumes.
```

##### `EOF` Error
This usually indicates internet connectivity issues and can typically look like-
```
failed to solve: node:21-alpine3.18: failed to do request: Head "https://registry-1.docker.io/v2/library/node/manifests/21-alpine3.18": EOF
```
This is typically fixed by retrying.


##### `libmamba` timeout
This can typically look like-
```
critical libmamba Download error (28) Timeout was reached [https://conda.anaconda.org/conda-forge/linux-aarch64/python-3.11.8-h43d1f9e_0_cpython.conda]
100.7     Operation too slow. Less than 30 bytes/sec transferred the last 60 seconds
```
Can also just be fixed by retrying.

#### `libmamba could not solve`
```
critical libmamba Could not solve for environment specs
```
Means you will need to to change your backend Dockerfile- pacmanweb/Dockerfile. If your operating system is MacOS, please uncomment the lines as mentioned in the file(or comment them for Linux).

#### Cannot access runs/...
Should be fixed by changing permissions for the PACMan repo.

