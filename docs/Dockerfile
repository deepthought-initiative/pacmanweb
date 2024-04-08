FROM python:3.11
RUN pip install -U jupyter-book
WORKDIR /docs
COPY . .
RUN jupyter-book build --all .
