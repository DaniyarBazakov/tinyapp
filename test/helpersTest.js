const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });
  it('should return null', function() {
    const user = getUserByEmail("user3@example.com", testUsers)
    const expectedUserID = null;
    console.log(user)
    assert.equal(user, null);
  });
});


describe('urlsForUser', function() {
  // Test case 1: Return only the URLs that belong to the specified user.
  it('should return urls that belong to the specified user', function() {
    const urlDatabase = {
      'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
      '9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' },
      '6sm5xQ': { longURL: 'http://www.example.com', userID: 'userRandomID' }
    };
    const userID = 'userRandomID';
    const expectedOutput = {
      'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
      '6sm5xQ': { longURL: 'http://www.example.com', userID: 'userRandomID' }
    };
    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, 'The function should return only the URLs belonging to the specified user.');
  });

  // Test case 2: Return an empty object if the urlDatabase does not contain any URLs for the specified user.
  it('should return an empty object if the urlDatabase does not contain any urls that belong to the specified user', function() {
    const urlDatabase = {
      'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'user2RandomID' },
      '9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' }
    };
    const userID = 'userRandomID';
    const expectedOutput = {};
    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, 'The function should return an empty object if there are no URLs for the specified user.');
  });

  // Test case 3: Return an empty object if the urlDatabase is empty.
  it('should return an empty object if the urlDatabase is empty', function() {
    const urlDatabase = {};
    const userID = 'userRandomID';
    const expectedOutput = {};
    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, 'The function should return an empty object if the urlDatabase is empty.');
  });

  // Test case 4: Ensure the function does not return URLs that do not belong to the specified user.
  it('should not return any urls that do not belong to the specified user', function() {
    const urlDatabase = {
      'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' },
      '9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' },
      '6sm5xQ': { longURL: 'http://www.example.com', userID: 'userRandomID' }
    };
    const userID = 'user2RandomID';
    const expectedOutput = {
      '9sm5xK': { longURL: 'http://www.google.com', userID: 'user2RandomID' }
    };
    const result = urlsForUser(userID, urlDatabase);
    assert.deepEqual(result, expectedOutput, 'The function should only return URLs that belong to the specified user and not others.');
  });
});
