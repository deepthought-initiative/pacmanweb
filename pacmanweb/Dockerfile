FROM mambaorg/micromamba:1.5.6
COPY --chown=$MAMBA_USER:$MAMBA_USER ../env.yml /tmp/env.yml
RUN micromamba install --name base --yes --file /tmp/env.yml \
    && micromamba clean --all --yes
ARG MAMBA_DOCKERFILE_ACTIVATE=1
ENV PYTHONBUFFERED=1
COPY ../ /app
WORKDIR /app
