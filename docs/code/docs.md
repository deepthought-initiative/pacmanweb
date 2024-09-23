# Building Docs

Building docs requires the `jupyter-book` package which is by default not present in the environment file. To install the package, please visit the documentation- [https://jupyterbook.org/en/stable/start/overview.html#install-jupyter-book](https://jupyterbook.org/en/stable/start/overview.html#install-jupyter-book)

To build the documentation, move to the root of the application and do-
```bash
jupyter-book build --all docs
```

```{note}
A docs workflow automatically runs on main branch whenever docs are updated and updates documentation here-
[deepthought-initiative.github.io/pacmanweb/](https://deepthought-initiative.github.io/pacmanweb/)
```