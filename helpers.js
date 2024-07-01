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

const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

module.exports = { getUserByEmail, getUrlById, urlsForUser, generateRandomString };