const pubsub = require('@google-cloud/pubsub')({
  projectId: 'integrations-154709',
  keyFilename: './keyfile.json' // relative to the project root, not this file
});

const TOPIC_NAME = 'dummy-topic';
const SUBSCRIPTION_NAME = 'dummy-subscription';

const topic = pubsub.topic(TOPIC_NAME);

const subscriber = {

  init() {
    // pubsub methods return a promise if you don't provide a callback
    return topic.subscribe(SUBSCRIPTION_NAME).then(results => {
      const [subscription] = results;
      return subscription;
    });
  }
};

module.exports = subscriber;
