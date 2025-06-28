#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testAuthentication() {
  console.log('🔐 Testing Authentication System...\n');

  try {
    // Test 1: Invalid login
    console.log('1. Testing invalid credentials...');
    try {
      await axios.post(`${API_BASE}/api/auth/login`, {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed with invalid credentials');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected invalid credentials');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // Test 2: Valid admin login
    console.log('\n2. Testing admin login...');
    const adminResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@burgerapp.com',
      password: 'admin123456'
    });
    console.log('✅ Admin login successful');
    console.log('   User:', adminResponse.data.user.firstName, adminResponse.data.user.lastName);
    console.log('   Role:', adminResponse.data.user.role);
    console.log('   Token received:', !!adminResponse.data.token);

    // Test 3: Valid user login
    console.log('\n3. Testing regular user login...');
    const userResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'john.doe@example.com',
      password: 'password123'
    });
    console.log('✅ User login successful');
    console.log('   User:', userResponse.data.user.firstName, userResponse.data.user.lastName);
    console.log('   Role:', userResponse.data.user.role);
    console.log('   Token received:', !!userResponse.data.token);

    // Test 4: Protected route with token
    console.log('\n4. Testing protected route access...');
    const profileResponse = await axios.get(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${adminResponse.data.token}`
      }
    });
    console.log('✅ Protected route access successful');
    console.log('   Profile data received for:', profileResponse.data.data.email);

    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('\n❌ Authentication test failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to backend. Make sure backend server is running on port 5000');
    } else if (error.response) {
      console.error(`HTTP ${error.response.status}: ${error.response.data?.message || error.message}`);
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

testAuthentication();
