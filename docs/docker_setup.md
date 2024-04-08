# Docker Compose Setup

The website can also be setup using docker compose. 

### Local Deployment

Start out by building the containers-
```bash
docker compose -f docker-compose_dev.yml build
```

followed by

```bash
docker compose -f docker-compose_dev.yml up
```

### Production Deployment
Start out by building the containers-
```bash
docker compose -f docker-compose.yml build
```

followed by

```bash
docker compose -f docker-compose.yml up
```

### Common Errors
##### `EOF` Error
This usually indicates internet connectivity issues and can typically look like-
```
failed to solve: node:21-alpine3.18: failed to do request: Head "https://registry-1.docker.io/v2/library/node/manifests/21-alpine3.18": EOF
```
This is mostly fixed by retrying


##### `libmamba` timeout
This can typically look like-
```
critical libmamba Download error (28) Timeout was reached [https://conda.anaconda.org/conda-forge/linux-aarch64/python-3.11.8-h43d1f9e_0_cpython.conda]
100.7     Operation too slow. Less than 30 bytes/sec transferred the last 60 seconds
```
Can also just be fixed by retrying.

#### libmamba Could not solve
```
critical libmamba Could not solve for environment specs
```
Means you will need to to change your backend Dockerfile- pacmanweb/Dockerfile. If your operating system is MacOS, please uncomment the lines as mentioned in the file(or comment them for Linux).

#### Cannot access runs/...
Should be fixed by changing permissions for the PACMan repo.

