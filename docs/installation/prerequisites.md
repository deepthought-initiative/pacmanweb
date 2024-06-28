# Installation Prerequisites

```{note}
Before starting, ensure git is installed on your machine-
https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu 

Since PACManWeb is hosted as a private repository on GitHub, you might need to pull frequently for testing. Doing the following will make sure your credentials persist-
```bash
git config --global credential.helper store
```

Start off by cloning the GitHub repo and updating the PACMan submodule.
```bash
git clone git@github.com:deepthought-initiative/pacmanweb.git
git submodule update --init
```

#### Config Variables
PACManWeb needs access to a `secrets.json` file to work, which needs to be present in the root of the repository. 

```json
{
    "SECRET_KEY": "<ENTER_SECRET_KEY>",
    "ADS_DEV_KEY": "<ENTER_ADS_DEV_KEY>",
    "ENV_NAME":"<ENTER_CONDA_ENV_NAME>"
}
``` 
- The `SECRET_KEY` can be generated with by running `python -c 'import secrets; print(secrets.token_hex())'`.  
- `ADS_DEV_KEY` is the key that PACMan would use to access the ADS Database. 
- `ENV_NAME` contains the name of the *conda environment of PACMan*, for example in case of linux, this could be `pacman_linux`. Instructions to install the PACMan environment are listed here- https://github.com/spacetelescope/PACMan?tab=readme-ov-file#installation.

The web app can be installed using Docker Compose or manually. For production, Docker Compose is recommended while manual installation is recommended for local deployment and testing.

#### For Docker Compose Setup
The Docker Compose setup instructions are mentioned here-
[](./docker_setup.md)

#### For Manual Installation
For manual installation docs, please visit [](./manual_installation.md)
