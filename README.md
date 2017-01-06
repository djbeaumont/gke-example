# Derbysoft Availability Transformer

This project is a demo of how we could write a dockerised micro-service using nodejs
to run on Google Cloud Platform (GCP).

## Pub/Sub

This application receives messages via subscriptions to Google pub/sub topics rather
than HTTP requests. The build and deployment model should also work for an
HTTP-based micro-service using express or koa, but that is untested.

## Local Development

* You will need to download a key for connecting to the pub/sub topic. This can be done in the api management console for GCP.
* Put the key in this project's root folder and name it `keyfile.json`. This could potentially be tidied up to use environmental variables instead.
* The application can be run as a normal node application using `npm start`.
* Once the application starts up, it will make a connection to pub/sub to setup a subscription. Messages are passed to a stub Derbysoft client that merely prints out the incoming message.

## Manual Deployment

Make sure you have the latest version of the command line tools available:
```
brew install Caskroom/cask/google-cloud-sdk
gcloud components install kubectl
```

Alias kubectl for your sanity:
```
alias kubectl="/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/bin/kubectl"
```

Google don't currently support running arbitrary nodejs applications using App Engine
(their platform-as-a-service offering). Instead, we produce a Docker image which can
run on Google Container Engine (referred to as GKE to distinguish it from Google
Compute Engine). The following commands can either be run on a local laptop, CI
environment or a developer's laptop.

First, login to your Google account with the newly install SDK. This will launch a web browser for a normal OAuth 2 flow:
```
gcloud auth application-default login
```

Build the docker image with a prefix of the GCP region, followed by the project name. Label it with a version string:
```
docker build -t eu.gcr.io/integrations-154709/example-image:1.3 .
```

Then push that labelled image to the Google-hosted docker image registry:
```
gcloud docker -- push eu.gcr.io/integrations-154709/example-image:1.3
```

Connect to the currently running kubernetes cluster (named `cluster-1`) in our test project:
```
gcloud container clusters get-credentials cluster-1 --zone europe-west1-b --project integrations-154709
```

Rollout the new image for our deployment named `deployment/example-image`:
```
kubectl set image deployment/example-image example-image=eu.gcr.io/integrations-154709/example-image:1.3
```

List our pods in the deployment to check everything is running nicely:
```
kubectl get pods
```

You should see something like:
```
NAME                             READY     STATUS    RESTARTS   AGE
example-image-2448862826-1n9aj   1/1       Running   0          19m
```

Try looking at the console of this running container with:
```
kubectl attach example-image-2448862826-1n9aj -c example-image
```

When you publish a message on the pub/sub topic, you should see it printed to the
console of the container running on Google's infrastructure, displayed on your laptop.

### Scale a Deployment

See how many pods are in your deployment currently:
```
kubectl get deployments
```

Scale  the deployment:
```
kubectl scale deployment/example-image --replicas=2
```

See the status of the individual pods:
```
kubectl get pods
```
