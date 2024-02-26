#!/bin/bash

set -o errexit
set -o nounset

celery -A pacmanweb.celery_app worker --loglevel=info

exec "$@"