# per https://github.com/n-riesco/ijavascript/issues/273
# and https://github.com/paulroth3d/jupyter-ijavascript-utils/issues/4

# as of today this is python-3.7.1
FROM jupyter/base-notebook:latest

# for nbhosting
USER root
COPY start-in-dir-as-uid.sh /usr/local/bin

# prerequisites with apt-get
# we do install python(2) here because
# some npm build part named gyp still requires it
RUN apt-get update && apt-get install -y gcc g++ make python

# !!! dirty trick!!!
# original PATH is
# /opt/conda/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# move conda's path **at the end**
# so that python resolves in /usr/bin/python(2)
# but node is still found in conda
ENV PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/conda/bin"
USER jovyan
RUN npm install -g ijavascript
RUN ijsinstall

# for displaying html fragments
RUN npm install -g jsdom d3

# !!! clean up!!!
USER root
RUN apt-get autoremove -y python
ENV PATH="/opt/conda/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
USER jovyan