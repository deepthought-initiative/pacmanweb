# Deployment

```{note}
Before starting, ensure git is installed on your machine-
https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu 
```

Start off by cloning the GitHub repo and updating the PACMan submodule.
```bash
git clone https://github.com/deepthought-initiative/pacmanweb.git
cd pacmanweb
git submodule update --init
```
Further instructions to install PACMan are listed here- https://github.com/spacetelescope/PACMan. 

```{note}
Please also make sure to create the `runs` directory inside `PACMan` containing `input_proposal_data` and `input_panelist_data` folders with the necessary data inside them. You will also require the models in the PACMan/models folder to run PACMan.
```

#### Config Variables
PACManWeb needs access to a `.env` file to work, which needs to be present in the root of the repository. 
The variables in the `.env` file depend on whether you want to deploy in production or in development. Here is for example the `.env` file for production.

```env
SECRET_KEY=
ADS_DEV_KEY=
ENV_NAME=base

# password for the mainadmin user. this can be changed once logged in.
MAINADMIN_USER_PASSWORD=pacman

# available at /flower, userful for monitoring processes
FLOWER_BASIC_AUTH=username:password

# available at /redis-commander, useful for monitoring database
REDIS_COMMANDER_USER=username
REDIS_COMMANDER_PASSWORD=password

# ssl and nginx config
DOMAIN_NAME=yourdomain.com
SSL_CERT_FILE=/path/to/your/certificate.crt
SSL_KEY_FILE=/path/to/your/private.key

# WARNING: do not edit below variables
CELERY_RESULT_BACKEND=redis://redis:6379/0
CELERY_BROKER_URL=amqp://guest:guest@rabbitmq:5672
SUBPROCESS_COMMANDS=micromamba run -n ${ENV_NAME} python run_pacman.py
REACT_APP_BASE_URL=http://0.0.0.0:8080
REACT_APP_API_URL=http://0.0.0.0:8000

``` 
- `ADS_DEV_KEY` is the key that PACMan would use to access the ADS Database. 
- You can also add an optioanl `SECRET_KEY` can be generated with by running `python -c 'import secrets; print(secrets.token_hex())'`. The `SECRET_KEY` will keep your sessions persistent across deployments. In production however we'd recommend you to not use this unless necessary since you'd want to refresh your client side sessions after updates.


#### Production Setup
```{WARNING}
Do not use `.env.dev` as the template file for production!
```
For production deployment:
1. Make a copy of `.env.prod` and enter your values. Make sure there is a password for the the main admin user.
2. For SSL, generate a certificate and key pair and move those to nginx/ssl folder. Provide the name of both in `SSL_CERT_FILE` and `SSL_KEY_FILE` respectfully.
3. Run `docker compose up -d` to start the server. Your production server should be visible at port 80/443. 

#### Local Development
1. Make a copy of `.env.dev` and enter your values. Make sure there is a password for the the main admin user.
2. For dev server there is not auth for /flower or /redis-commander
3. Run `docker compose up -d` to start the server. Your production server should be visible at [http://localhost:8080/](http://localhost:8080/). 
