# Installation Prerequisites

```{note}
Before starting, ensure git is installed on your machine-
https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu 

Since PACManWeb is hosted as a private repository on GitHub, you might need to pull frequently for testing. Doing the following will make sure your credentials persist-
```bash
git config --global credential.helper store
```


Start off by cloning the GitHub repo-
```bash
git clone git@github.com:deepthought-initiative/pacmanweb.git
```

PACMan is already added to the PACManWeb repository as a submodule. To update it, do
```bash
git submodule update --init
```

The web app can be installed using Docker Compose or manually. For production, Docker Compose is recommended while manual installation is recommended for local deployment and testing.

#### For Docker Compose Setup
The Docker Compose setup instructions are mentioned here-
[](./docker_setup.md)

#### For Manual Installation
For manual installation docs, please visit [](./manual_installation.md)
