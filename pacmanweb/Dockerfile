FROM mambaorg/micromamba:1.5.6
COPY --chown=$MAMBA_USER:$MAMBA_USER ../conda-osx-64.lock /tmp/env.lock
RUN micromamba create --name pacmanweb --yes --file /tmp/env.lock \
    && micromamba clean --all --yes

