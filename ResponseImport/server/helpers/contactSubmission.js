const getContactPropertyObject = ({curRow, contactMapping }) => {
  const contactPayload = {};
  Object.keys(contactMapping).forEach((mapping) => {
    if(curRow[mapping]?.trim()){
      contactPayload[contactMapping[mapping]] = curRow[mapping];
    }
  });
  if(Object.keys(contactPayload).includes('email')) {
    return contactPayload;
  }
}
module.exports = {
  getContactPropertyObject
};