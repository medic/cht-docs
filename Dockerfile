# Should match the hugo version in .tool-versions
FROM docker.io/hugomods/hugo:0.152.2
LABEL authors="mrjones@medic.org"
RUN apk add --no-cache gfortran bash curl grep
ENTRYPOINT ["hugo", "server", "--buildDrafts", "--buildFuture", "--bind", "0.0.0.0"]
