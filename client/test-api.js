// Simple script to test the API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const apiUrl = 'https://the-blood-link.vercel.app/donors';

console.log(`Testing API: ${apiUrl}`);

async function testApi() {
  try {
    const response = await fetch(apiUrl);
    console.log(`Status Code: ${response.status}`);
    
    const data = await response.json();
    console.log('Response data:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

testApi(); 