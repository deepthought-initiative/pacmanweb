FROM mambaorg/micromamba:1.5.6 
# change to mac_env if using macos
COPY --chown=$MAMBA_USER:$MAMBA_USER ../linux_env.yml /tmp/env.yml
RUN micromamba install --name base --yes --file /tmp/env.yml \
    && micromamba clean --all --yes
ARG MAMBA_DOCKERFILE_ACTIVATE=1
ENV PYTHONBUFFERED=1
RUN python3 -m spacy download en_core_web_sm
# uncomment if using macos
# RUN micromamba install -n base --yes scikit-learn=1.1 --channel conda-forge
# RUN micromamba remove -n base --yes pillow
# RUN micromamba install -n base --yes matplotlib matplotlib-base --channel conda-forge
RUN pip install ads fingerprint gevent pyyaml
RUN micromamba install conda-forge::flower
COPY ../../../ /app
WORKDIR /app
USER root
