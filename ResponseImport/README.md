# Response Import

## USE CASE

- Lets you import responses from csv file. The responses from the csv can be mapped as a response to the questions of your choice.

## LOCAL SETUP

- In Order to run this app in your local machine, you need to have ssdk installed. For detailed information about how to run an appnest app in local machine refer [this](https://sparrowssdk.surveysparrow.dev/docs/serverless/)

- Only the UI till the mapping will work in local. As of now ssdk doesn't support some of the methods used in this app both the frontend and backend. 

- This can be tested directly in staging only. For that, do ssdk run -> ssdk pack -> upload to developer portal.

## SETUP IN STAGING AND PRODUCTION

- googlephonenumberlib, axios and response-import layers need to be added.
- Check the envs are correct accordingly.

