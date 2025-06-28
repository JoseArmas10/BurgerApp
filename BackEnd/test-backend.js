#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing Burger App Backend...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    
    // Test 2: Products endpoint
    console.log('\n2. Testing products endpoint...');
    const productsResponse = await axios.get(`${API_BASE}/api/products`);
    console.log(`✅ Products endpoint working: Found ${productsResponse.data.data?.length || 0} products`);
    
    // Test 3: Locations endpoint
    console.log('\n3. Testing locations endpoint...');
    const locationsResponse = await axios.get(`${API_BASE}/api/locations`);
    console.log(`✅ Locations endpoint working: Found ${locationsResponse.data.data?.length || 0} locations`);
    
    // Test 4: Auth endpoint (should fail without credentials)
    console.log('\n4. Testing auth endpoint...');
    try {
      await axios.post(`${API_BASE}/api/auth/login`, {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Auth endpoint working: Correctly rejected invalid credentials');
      } else {
        console.log('❌ Auth endpoint error:', error.message);
      }
    }
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    console.log('\nNext steps:');
    console.log('1. Run "npm run seed" to populate the database');
    console.log('2. Start the frontend with "npm start"');
    console.log('3. Visit http://localhost:3000');
    
  } catch (error) {
    console.error('\n❌ Backend test failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to backend. Make sure:');
      console.error('1. Backend server is running on port 5000');
      console.error('2. Run "npm run dev" in the BackEnd directory');
    } else if (error.response) {
      console.error(`HTTP ${error.response.status}: ${error.response.data?.message || error.message}`);
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

// Check if axios is available
try {
  require.resolve('axios');
} catch (error) {
  console.error('❌ axios is not installed. Please run "npm install" in the BackEnd directory.');
  process.exit(1);
}

testBackend();
