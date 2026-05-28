import { StartupStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../src/utils/prisma';

async function main() {
  console.log('Seeding startups...');
  
  // Clean up existing dummy startups and founders if they exist to avoid unique constraint errors
  const dummyEmails = [
    'founder1@nexus.ai',
    'founder2@finflow.com',
    'founder3@logistech.net',
    'founder4@cloudsync.io'
  ];

  await prisma.startup.deleteMany({
    where: {
      founder: {
        email: { in: dummyEmails }
      }
    }
  });

  await prisma.user.deleteMany({
    where: {
      email: { in: dummyEmails }
    }
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Startup in REQUESTED
  const user1 = await prisma.user.create({
    data: {
      email: dummyEmails[0],
      passwordHash,
      role: 'STARTUP_FOUNDER',
      isVerified: true
    }
  });

  await prisma.startup.create({
    data: {
      name: 'Nexus AI',
      industry: 'SaaS',
      stage: 'Pre-Seed',
      status: StartupStatus.REQUESTED,
      founderId: user1.id
    }
  });

  // 2. Startup in AI_PROFILED
  const user2 = await prisma.user.create({
    data: {
      email: dummyEmails[1],
      passwordHash,
      role: 'STARTUP_FOUNDER',
      isVerified: true
    }
  });

  await prisma.startup.create({
    data: {
      name: 'FinFlow',
      industry: 'Fintech',
      stage: 'Seed',
      status: StartupStatus.AI_PROFILED,
      founderId: user2.id,
      aiProfileData: {
        industry: "Fintech",
        stage: "Seed",
        confidenceScore: 92,
        strengths: ["Strong B2B focus", "Experienced founding team in banking"],
        risks: ["Regulatory hurdles", "High customer acquisition cost"]
      }
    }
  });

  // 3. Startup in UNDER_REVIEW
  const user3 = await prisma.user.create({
    data: {
      email: dummyEmails[2],
      passwordHash,
      role: 'STARTUP_FOUNDER',
      isVerified: true
    }
  });

  await prisma.startup.create({
    data: {
      name: 'LogisTech',
      industry: 'Logistics',
      stage: 'Series A',
      status: StartupStatus.UNDER_REVIEW,
      founderId: user3.id,
      allocatedHours: 20,
      remainingHours: 12,
      onboardingDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      aiProfileData: {
        industry: "Logistics",
        stage: "Series A",
        confidenceScore: 88,
        strengths: ["Proven unit economics", "Proprietary routing algorithm"],
        risks: ["Capital intensive expansion", "Driver retention"]
      }
    }
  });

  // 4. Startup in ONBOARDED
  const user4 = await prisma.user.create({
    data: {
      email: dummyEmails[3],
      passwordHash,
      role: 'STARTUP_FOUNDER',
      isVerified: true
    }
  });

  await prisma.startup.create({
    data: {
      name: 'CloudSync',
      industry: 'Enterprise',
      stage: 'Seed',
      status: StartupStatus.ONBOARDED,
      founderId: user4.id,
      aiProfileData: {
        industry: "Enterprise SaaS",
        stage: "Seed",
        confidenceScore: 95,
        strengths: ["High switching costs for users", "Strong data security compliance"],
        risks: ["Long sales cycles", "Integration dependencies"]
      }
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
