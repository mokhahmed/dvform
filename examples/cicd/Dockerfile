FROM dataformco/dataform:latest

# Set working directory
ENV DATAFORM_DIR /dataform/
RUN mkdir $DATAFORM_DIR
WORKDIR $DATAFORM_DIR

# Copy files to the image
COPY ../* $DATAFORM_DIR

# install dataform dependencies 
RUN dataform install 

# Run dataform
ENTRYPOINT ["dataform"]
