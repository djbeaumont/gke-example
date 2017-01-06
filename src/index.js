const subscriber = require('./subscriber');
const derbysoftGoClient = require('./derbysoft_go_client');

console.log('~~derbysoft-availability-transformer~~');

subscriber.init().then(subscription => {
  // subscription objects have stream style listeners
  subscription.on('message', message => {
    derbysoftGoClient.action(message);
    // Remember to ack the message, otherwise it will keep being put back on the topic.
    message.ack();
  });
});
