const { firestore } = require('../src/config/firebase');

const chefs = [
  {
    id: 'chef_kavita_delhi',
    name: 'Kavita Sharma',
    kitchenName: 'Kavita\'s Royal Kitchen',
    specialty: 'Mughlai & North Indian',
    rating: 4.9,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1589187151032-573a91317445?w=600&q=80',
    avatar: 'https://i.pravatar.cc/150?img=48',
    bio: 'Preserving Mughlai Dum Pukht traditions passed down through four generations.',
    specialties: ['Mughlai', 'North-Indian', 'Punjabi'],
    location: 'Delhi',
    isVeg: false,
    menu: {
      title: 'Daryaganj Dum Biryani Feast',
      description: 'Slow-cooked aromatic basmati rice with marinated meat, served with garlic burani raita and salan.',
      price: 349,
      starter: 'Galouti Kebab',
      mainCourse: 'Mutton Dum Biryani',
      accompaniments: 'Burani Raita, Onions',
      isVeg: false,
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'chef_priya_mumbai',
    name: 'Priya Deshmukh',
    kitchenName: 'The Maharashtrian Studio',
    specialty: 'Authentic Konkani Flavors',
    rating: 4.8,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    avatar: 'https://i.pravatar.cc/150?img=45',
    bio: 'Freshly ground masalas and coastal seafood recipes from the heart of Konkan.',
    specialties: ['Maharashtrian', 'Goan'],
    location: 'Mumbai',
    isVeg: false,
    menu: {
      title: 'Traditional Malvani Thali',
      description: 'Spicy coastal curry served with kombdi vade and sol kadhi.',
      price: 299,
      starter: 'Fried Bombil',
      mainCourse: 'Malvani Chicken Curry & Vade',
      accompaniments: 'Sol Kadhi, Pickle',
      isVeg: false,
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: 'chef_anand_bangalore',
    name: 'Anand Viswanathan',
    kitchenName: 'Sattvic Soul',
    specialty: 'South Indian & Sattvic',
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&q=80',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Healing through food. Organic, seasonal, and strictly Sattvic preparations.',
    specialties: ['Sattvic', 'South-Indian', 'Jain'],
    location: 'Bangalore',
    isVeg: true,
    menu: {
      title: 'Grand Heritage Thali',
      description: 'A balanced meal consisting of 11 items served in traditional style.',
      price: 249,
      starter: 'Medovada',
      mainCourse: 'Bisi Bele Bath & Avial',
      accompaniments: 'Papad, Curd, Payasam',
      isVeg: true,
      updatedAt: new Date().toISOString()
    }
  }
];

const reviews = [
  { chefId: 'chef_kavita_delhi', customerName: 'Rohan M.', rating: 5, comment: 'The biryani aroma was incredible. Truly authentic!' },
  { chefId: 'chef_kavita_delhi', customerName: 'Sraavya K.', rating: 4, comment: 'Very generous portions. Loved the kebabs.' },
  { chefId: 'chef_priya_mumbai', customerName: 'Amit G.', rating: 5, comment: 'The kombdi vade was exactly like my mother makes.' },
  { chefId: 'chef_anand_bangalore', customerName: 'Deepa L.', rating: 5, comment: 'So light and fresh. Perfect for a healthy lunch.' }
];

async function seed() {
  console.log('🌱 Starting database seed...');
  
  try {
    // 1. Seed Chefs & Menus
    for (const chef of chefs) {
      await firestore.collection('chefs').doc(chef.id).set(chef);
      console.log(`✅ Seeded Chef: ${chef.kitchenName}`);
      
      // Also sync to users collection if needed (for login simulations)
      await firestore.collection('users').doc(chef.id).set({
        uid: chef.id,
        name: chef.name,
        role: 'chef',
        email: `${chef.id}@swaad.com`,
        specialties: chef.specialties,
        updatedAt: new Date().toISOString()
      });
    }

    // 2. Seed Reviews
    for (const review of reviews) {
      await firestore.collection('reviews').add({
        ...review,
        createdAt: new Date().toISOString()
      });
    }
    console.log(`✅ Seeded ${reviews.length} reviews`);

    console.log('✨ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
