// scripts/quick-test.ts
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function quickTest() {
  console.log('🧪 Quick Blog API Test\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Testing health...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Server is running:', health.data.status);

    // 2. Stats
    console.log('\n2️⃣ Testing stats...');
    const stats = await axios.get(`${API_URL}/blog/posts/stats`);
    console.log('✅ Stats:', JSON.stringify(stats.data.data, null, 2));

    // 3. Categories
    console.log('\n3️⃣ Testing categories...');
    const categories = await axios.get(`${API_URL}/blog/categories`);
    console.log('✅ Categories:', categories.data.data.length, 'found');

    // 4. Posts
    console.log('\n4️⃣ Testing posts...');
    const posts = await axios.get(`${API_URL}/blog/posts`);
    console.log('✅ Posts:', posts.data.data.length, 'found');
    if (posts.data.data.length > 0) {
      console.log('   First post:', posts.data.data[0].title);
    }

    console.log('\n✅ All tests passed!');
    console.log('\n📝 Your API endpoints:');
    console.log('   GET  /api/blog/posts/stats');
    console.log('   GET  /api/blog/categories');
    console.log('   GET  /api/blog/tags');
    console.log('   GET  /api/blog/posts');
    console.log('   GET  /api/blog/posts/:id');
    console.log('   POST /api/blog/posts (requires auth)');
    console.log('   PUT  /api/blog/posts/:id (requires auth)');
    console.log('   DELETE /api/blog/posts/:id (requires auth)');

  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Server is running on port 5001');
    console.log('   2. Database has seeded data');
    console.log('   3. Run: npx prisma db push');
    console.log('   4. Run: npx ts-node scripts/seed-news.ts');
  }
}

quickTest();