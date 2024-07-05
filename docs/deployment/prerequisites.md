# Prerequisites

```{note}
Before starting, ensure git is installed on your machine-
https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu 
```

Start off by cloning the GitHub repo and updating the PACMan submodule.
```bash
git clone git@github.com:deepthought-initiative/pacmanweb.git
git submodule update --init
```
Further instructions to install PACMan are listed here- https://github.com/spacetelescope/PACMan. 

#### Config Variables
PACManWeb needs access to a `secrets.json` file to work, which needs to be present in the root of the repository. 

```json
{
    "ADS_DEV_KEY": "<ENTER_ADS_DEV_KEY>",
    "ENV_NAME":"<ENTER_CONDA_ENV_NAME>"
}
``` 
- `ADS_DEV_KEY` is the key that PACMan would use to access the ADS Database. 
- `ENV_NAME` contains the name of the *conda environment of PACMan*, for example in case of linux, this could be `pacman_linux`. Instructions to install the PACMan environment are listed here- https://github.com/spacetelescope/PACMan?tab=readme-ov-file#installation.
- You can also add an optioanl `SECRET_KEY` can be generated with by running `python -c 'import secrets; print(secrets.token_hex())'`. The `SECRET_KEY` will keep your sessions persistent across deployments. In production however we'd recommend you to not use this unless necessary since you'd want to refresh your client side sessions after updates.

Docker Compose is recommended for production purposes. For local deployment and testing, there is a manual installation method as well.

#### Production Setup
The Docker Compose setup instructions are mentioned here-
[](./production.md)

#### Local Development
For manual installation docs, please visit [](./local.md)
