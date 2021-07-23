FROM python:3.7

WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . ./app
# VOLUME file_uploads:/var/lib/file_uploads

EXPOSE 5000
ENTRYPOINT ["python", "server.py"]
