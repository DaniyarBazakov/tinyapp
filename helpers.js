const getUserByEmail = function(email, database) {
  for (let userId in database) {
    if (database[userId].email === email) {
      return database[userId]; 
    }
  }
  return null; 
}

const getUrlById = function(urlID, obj) {
  urls = Object.keys(obj)
  for (const item of urls) {
    if (item === urlID) {
      return obj[item];
    }
  }
  return null; 
}

const urlsForUser = function(user_ID, obj) {
  const userUrls = {};
  for (let key in obj) {
    if (obj[key]["userID"] === user_ID) {
      userUrls[key] = obj[key];
    }
  }
  return userUrls;
}

module.exports = { getUserByEmail, getUrlById, urlsForUser };