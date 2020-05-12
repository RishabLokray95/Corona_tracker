// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 const axios = require("axios");
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  
  function give_queried_deaths(agent){
    const country = agent.parameters.country;
    return axios.get(`https://coronavirus-tracker-api.herokuapp.com/v2/locations`)
      .then(result => {
      const {confirmed,deaths,recovered} = result.data.latest;
      agent.add('Number of cases are:'+ confirmed);
      console.log("!!!!"+confirmed);	
    });
  	//agent.add('intent called:'+ country);
  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  
  
  intentMap.set('Deaths', give_queried_deaths);
 
  agent.handleRequest(intentMap);
});




