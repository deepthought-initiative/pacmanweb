# Prerequisites

Before starting, ensure git and docker is installed on your machine-
1. https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu 
2. https://docs.docker.com/engine/install/

Clone the GitHub repository and update the PACMan submodule.
```bash
git clone https://github.com/deepthought-initiative/pacmanweb.git
cd pacmanweb
git submodule update --init
```

Further instructions to install PACMan are listed here- https://github.com/spacetelescope/PACMan. However there is no need to install PACMan environment unless you plan to use it outside of PACManWeb since PACManWeb will handle environments on its own.

Please also make sure to create the `runs` directory inside `PACMan` containing `input_proposal_data` and `input_panelist_data` folders with the necessary data inside them. You will also require the models in the PACMan/models folder to run PACMan.

