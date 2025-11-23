// server/scripts/seed-news.ts
// Run with: npx ts-node server/scripts/seed-news.ts

import { PrismaClient, ContentType, ContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNews() {
  try {
    console.log('🌱 Seeding news articles...');

    // Get a user to be the author (use superadmin from your seed)
    const author = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    });

    if (!author) {
      console.error('❌ No superadmin user found. Please run: npx prisma db seed');
      process.exit(1);
    }

    console.log('✅ Found author:', author.email);

    // Create categories if they don't exist
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'technology' },
        update: {},
        create: {
          name: 'Technology',
          slug: 'technology',
          description: 'Latest tech news and updates',
          color: '#3B82F6',
          active: true
        }
      }),
      prisma.category.upsert({
        where: { slug: 'business' },
        update: {},
        create: {
          name: 'Business',
          slug: 'business',
          description: 'Business news and insights',
          color: '#10B981',
          active: true
        }
      }),
      prisma.category.upsert({
        where: { slug: 'announcements' },
        update: {},
        create: {
          name: 'Announcements',
          slug: 'announcements',
          description: 'Company announcements',
          color: '#F59E0B',
          active: true
        }
      })
    ]);

    console.log('✅ Categories created/updated');

    // Create sample news articles
    const newsArticles = [
      {
        title: 'SL Brothers Expands Operations to New Markets',
        slug: 'sl-brothers-expands-operations',
        excerpt: 'We are excited to announce our expansion into three new international markets, strengthening our global presence.',
        content: `
          <p>SL Brothers Ltd is thrilled to announce a significant milestone in our company's growth trajectory. 
          After careful market analysis and strategic planning, we are expanding our operations into three new 
          international markets.</p>
          
          <p>This expansion represents our commitment to providing exceptional services to a broader client base 
          and reinforces our position as an industry leader. Our teams have been working diligently to ensure 
          a smooth transition and maintain the high standards our clients have come to expect.</p>
          
          <p>The new markets include strategic locations that align with our long-term vision and will enable 
          us to better serve our growing customer base. We look forward to the opportunities this expansion 
          will bring to both our company and our valued clients.</p>
        `,
        type: ContentType.NEWS,
        status: ContentStatus.PUBLISHED,
        featured: true,
        featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
        categoryId: categories[1].id,
        authorId: author.id,
        metaTitle: 'SL Brothers Expands to New Markets | Company News',
        metaDescription: 'SL Brothers Ltd announces expansion into three new international markets.',
        publishedAt: new Date(),
        readTime: 3,
        views: Math.floor(Math.random() * 1000) + 500
      },
      {
        title: 'Introducing Our New AI-Powered Solutions',
        slug: 'new-ai-powered-solutions',
        excerpt: 'Discover how our latest AI-powered solutions are revolutionizing the industry and helping businesses achieve unprecedented efficiency.',
        content: `
          <p>At SL Brothers, we're constantly pushing the boundaries of what's possible with technology. 
          Today, we're proud to introduce our latest suite of AI-powered solutions designed to transform 
          how businesses operate.</p>
          
          <p>These innovative solutions leverage cutting-edge artificial intelligence and machine learning 
          technologies to provide unprecedented insights, automation, and efficiency. Our development team 
          has spent countless hours perfecting these tools to ensure they meet the highest standards.</p>
          
          <p>Key features include real-time data analysis, predictive modeling, and intelligent automation 
          that can significantly reduce operational costs while improving outcomes. We invite you to learn 
          more about how these solutions can benefit your organization.</p>
        `,
        type: ContentType.NEWS,
        status: ContentStatus.PUBLISHED,
        featured: true,
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
        categoryId: categories[0].id,
        authorId: author.id,
        metaTitle: 'AI-Powered Solutions by SL Brothers | Innovation',
        metaDescription: 'Learn about SL Brothers\' new AI-powered solutions revolutionizing the industry.',
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        readTime: 5,
        views: Math.floor(Math.random() * 800) + 300
      },
      {
        title: 'Q4 Results Exceed Expectations',
        slug: 'q4-results-exceed-expectations',
        excerpt: 'SL Brothers reports record-breaking Q4 results, demonstrating strong growth across all business segments.',
        content: `
          <p>SL Brothers Ltd is pleased to announce outstanding Q4 results that have exceeded market 
          expectations. Our strong performance across all business segments reflects the dedication 
          of our team and the trust our clients place in us.</p>
          
          <p>Revenue growth was particularly strong in our core service areas, with double-digit increases 
          year-over-year. This success is attributed to our strategic initiatives, operational excellence, 
          and unwavering commitment to client satisfaction.</p>
          
          <p>Looking ahead, we remain optimistic about continued growth and are well-positioned to 
          capitalize on emerging opportunities in our markets. We thank our stakeholders for their 
          continued support.</p>
        `,
        type: ContentType.NEWS,
        status: ContentStatus.PUBLISHED,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
        categoryId: categories[1].id,
        authorId: author.id,
        metaTitle: 'SL Brothers Q4 Results | Financial News',
        metaDescription: 'SL Brothers reports record-breaking Q4 results exceeding market expectations.',
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
        readTime: 4,
        views: Math.floor(Math.random() * 600) + 200
      },
      {
        title: 'Sustainability Initiative Launch',
        slug: 'sustainability-initiative-launch',
        excerpt: 'SL Brothers commits to ambitious sustainability goals as part of our environmental responsibility program.',
        content: `
          <p>As part of our commitment to environmental stewardship, SL Brothers is launching a 
          comprehensive sustainability initiative. This program reflects our dedication to reducing 
          our environmental footprint while maintaining operational excellence.</p>
          
          <p>Our sustainability goals include significant reductions in carbon emissions, increased 
          use of renewable energy, and implementation of circular economy principles throughout our 
          operations. We believe that businesses have a responsibility to protect our planet for 
          future generations.</p>
          
          <p>This initiative will be rolled out across all our facilities globally, with measurable 
          targets and regular progress reporting. We invite our partners and clients to join us on 
          this important journey.</p>
        `,
        type: ContentType.ANNOUNCEMENT,
        status: ContentStatus.PUBLISHED,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200',
        categoryId: categories[2].id,
        authorId: author.id,
        metaTitle: 'SL Brothers Sustainability Initiative | Environment',
        metaDescription: 'SL Brothers launches comprehensive sustainability program with ambitious environmental goals.',
        publishedAt: new Date(Date.now() - 259200000), // 3 days ago
        readTime: 4,
        views: Math.floor(Math.random() * 500) + 150
      },
      {
        title: 'New Partnership with Leading Tech Firm',
        slug: 'new-partnership-tech-firm',
        excerpt: 'SL Brothers announces strategic partnership with industry-leading technology company to enhance service offerings.',
        content: `
          <p>We are excited to announce a strategic partnership with a leading technology firm that 
          will significantly enhance our service offerings and capabilities. This collaboration brings 
          together two industry leaders committed to innovation and excellence.</p>
          
          <p>The partnership will enable us to integrate advanced technologies into our solutions, 
          providing our clients with even more value and competitive advantages. Both companies share 
          a vision of leveraging technology to solve complex business challenges.</p>
          
          <p>Through this partnership, we will co-develop innovative solutions, share best practices, 
          and create new opportunities for growth. We're confident this collaboration will benefit 
          all our stakeholders.</p>
        `,
        type: ContentType.NEWS,
        status: ContentStatus.PUBLISHED,
        featured: false,
        featuredImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200',
        categoryId: categories[0].id,
        authorId: author.id,
        metaTitle: 'SL Brothers New Tech Partnership | Collaboration',
        metaDescription: 'SL Brothers partners with leading tech firm to enhance service offerings.',
        publishedAt: new Date(Date.now() - 345600000), // 4 days ago
        readTime: 3,
        views: Math.floor(Math.random() * 400) + 100
      }
    ];

    // Create news articles
    for (const article of newsArticles) {
      const created = await prisma.content.create({
        data: article
      });
      console.log(`✅ Created: ${created.title}`);
    }

    console.log('\n🎉 Successfully seeded', newsArticles.length, 'news articles!');
    console.log('\n📝 You can now:');
    console.log('1. View them in superadmin: http://localhost:3000/superadmin/news-management');
    console.log('2. See them on public page: http://localhost:3000/news');
    console.log('3. Access via API: http://localhost:5000/api/blog/posts?status=PUBLISHED');

  } catch (error) {
    console.error('❌ Error seeding news:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedNews()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });