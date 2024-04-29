# Running Tests and Building Docs

Here are instructions to update docs and tests.

#### Running tests
A tests infrastructure is available inside `pacmanweb/pacmanweb/tests`. The data folder contains sample proposal files and panelist files for testing purposes and copies over the model files from the PACMan folder(assumes PACMan has model files in its models folder).
To run tests, move inside the tests and do-
```bash
pytest .
```

#### Building Docs
Building docs requires the `jupyter-book` package which is by default not present in the environment file. To install the package, do
```bash
mamba install jupyter-book
```

To build the documentation, move to the root of the application and do-
```bash
jupyter-book build --all docs
```

```{note}
Docs can also be updated on pull requests. Once you have opened the pull request, you can label it with the `docs` label to run the `docs` workflow. Updated docs will automatically be committed to the branch of the pull request and appear in files changed.
```