FROM python:3.7

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages
RUN pip install -r requirements.txt

# Make port 8080 available to the world outside this container
EXPOSE 8080

ENTRYPOINT python app/main.py