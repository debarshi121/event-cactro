const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Create Users
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@example.com' },
    update: {},
    create: {
      email: 'organizer@example.com',
      name: 'John Organizer',
      password,
      role: 'ORGANIZER',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Jane Customer',
      password,
      role: 'CUSTOMER',
    },
  });

  // Create Event
  const event = await prisma.event.create({
    data: {
      title: 'Tech Conference 2026',
      description: 'The biggest tech conference of the year.',
      location: 'San Francisco, CA',
      eventDate: new Date('2026-06-15T09:00:00Z'),
      totalTickets: 100,
      availableTickets: 100,
      price: 99.99,
      organizerId: organizer.id,
    },
  });

  console.log({ organizer, customer, event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
