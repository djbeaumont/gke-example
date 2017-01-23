const subscriber = require('./subscriber');
const dummyHttpClient = require('./dummy_http_client');

console.log('~~gke-example~~');

subscriber.init().then(subscription => {
  // subscription objects have stream style listeners
  subscription.on('message', message => {
    dummyHttpClient.action(message);
    // Remember to ack the message, otherwise it will keep being put back on the topic.
    message.ack();
  });
});
