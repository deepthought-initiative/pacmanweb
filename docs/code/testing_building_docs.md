# Running Tests and Building Docs

Here are instructions to update docs and tests.

#### Running tests
Tests are available at `pacmanweb/pacmanweb/tests`. The data folder contains sample proposal files and panelist files for testing purposes and copies over the model files from the PACMan folder(assumes PACMan has model files in its models folder).

To run tests do-
```bash
docker compose -f docker-compose-test.yml run --rm test 
```

#### Building Docs
Building docs requires the `jupyter-book` package which is by default not present in the environment file. To install the package, please visit the documentation- [https://jupyterbook.org/en/stable/start/overview.html#install-jupyter-book](https://jupyterbook.org/en/stable/start/overview.html#install-jupyter-book)

To build the documentation, move to the root of the application and do-
```bash
jupyter-book build --all docs
```

```{note}
A docs workflow automatically runs on main branch whenever docs are updated and updates documentation here-
[deepthought-initiative.github.io/pacmanweb/](https://deepthought-initiative.github.io/pacmanweb/)
```