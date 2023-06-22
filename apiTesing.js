
const axios = require('axios');
const assert = require('chai').assert

async function fetchYearFact() {
  try {
    const response = await axios.get('http://numbersapi.com/random/year');
    return response.data;
  } catch (error) {
    console.error('Error fetching year fact:', error.message);
    throw error;
  }
}

// Function to check if the fact contains a month and date
function hasMonthAndDate(fact) {
  const pattern = /[A-Za-z]{3}\s\d{1,2}(?:st|nd|rd|th)?\b/;
  return pattern.test(fact);
}

// Perform 100 requests and store facts with month and date
const facts = [];

before(async function () {
  this.timeout(0); // Disable timeout

  const batchSize = 10;
  const totalRequests = 100;

  for (let i = 0; i < totalRequests; i += batchSize) {
    const batchPromises = [];

    for (let j = i; j < i + batchSize; j++) {
      batchPromises.push(fetchYearFact());
    }

    const batchResults = await Promise.all(batchPromises);

    for (const result of batchResults) {
      if (hasMonthAndDate(result)) {
        facts.push(result);
      }
    }
  }
});


// Test the array
describe('Array Tests', () => {
  it('should not be empty', () => {
    assert.notStrictEqual(facts.length, 0);
  });

  // it('should be empty', () => {
  //   assert.strictEqual(facts.length, 0);
  // });

  it('should contain more than 5 elements', () => {
    assert.strictEqual(facts.length > 5, true);
  });

  it('should have each element length >= 10 characters', () => {
    const allElementsLengthGreaterThanTen = facts.every(fact => fact.length >= 10);
    assert.strictEqual(allElementsLengthGreaterThanTen, true);
  });
});
