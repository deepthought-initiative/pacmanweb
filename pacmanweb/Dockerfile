FROM mambaorg/micromamba:1.5.6 
COPY --chown=$MAMBA_USER:$MAMBA_USER ../docker_env.yml /tmp/env.yml
RUN micromamba install --name base --yes --file /tmp/env.yml \
    && micromamba clean --all --yes
ARG MAMBA_DOCKERFILE_ACTIVATE=1
ENV PYTHONBUFFERED=1
RUN python3 -m spacy download en_core_web_sm
RUN pip install ads fingerprint
COPY ../../../ /app
WORKDIR /app
USER root
