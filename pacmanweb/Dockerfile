FROM mambaorg/micromamba:1.5.6 

ARG OS_NAME
ENV OS_NAME=${OS_NAME}

COPY --chown=$MAMBA_USER:$MAMBA_USER ./env/macos/env.yml /tmp/env_macos.yml
COPY --chown=$MAMBA_USER:$MAMBA_USER ./env/linux/env.lock /tmp/env_linux.lock

RUN if [ "$OS_NAME" = "macos" ]; then \
        micromamba install --name base --yes --file /tmp/env_macos.yml && \
        micromamba clean --all --yes; \
    fi

RUN if [ "$OS_NAME" = "linux" ]; then \
        micromamba install --name base --yes --file /tmp/env_linux.lock && \
        micromamba clean --all --yes; \
    fi

ARG MAMBA_DOCKERFILE_ACTIVATE=1
ENV PYTHONBUFFERED=1
RUN python3 -m spacy download en_core_web_sm

RUN if [ "$OS_NAME" = "macos" ]; then \
        micromamba install -n base --yes scikit-learn=1.1 --channel conda-forge && \
        micromamba remove -n base --yes pillow && \
        micromamba install -n base --yes matplotlib matplotlib-base --channel conda-forge; \
    fi

RUN pip install ads fingerprint gevent pyyaml
RUN micromamba install conda-forge::flower
COPY ../../../ /app
WORKDIR /app
USER root
