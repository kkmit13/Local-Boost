const LISTINGS = [
  {
    id: "b1",
    name: "Blue Bird Cafe",
    address: "120 Market St, Austin, TX 78701",
    phone: "(512) 555-0111",
    website: "https://bluebird.example.com",
    category: "Cafe",
    rating: 4.6,
    reviewCount: 312,
    priceRange: 2,
    openedDate: "2014-06-01",
    shortDescription: "Cozy cafe with specialty coffee, pastries and free Wi-Fi.",
    tags: ["coffee", "breakfast", "wifi", "pet-friendly"],
    photos: [],
    hours: {
      monday: [{ open: "07:00", close: "16:00" }],
      tuesday: [{ open: "07:00", close: "16:00" }],
      wednesday: [{ open: "07:00", close: "16:00" }],
      thursday: [{ open: "07:00", close: "16:00" }],
      friday: [{ open: "07:00", close: "18:00" }],
      saturday: [{ open: "08:00", close: "18:00" }],
      sunday: []
    },
    reviews: [
      { id: "r1", userName: "Ava", rating: 5, text: "Great cappuccino!", date: "2025-05-01" }
    ],
    bookmarked: false,
    deal: {
      description: "Free pastry with any coffee (Mon–Fri).",
      expires: "2025-12-31"
    }
  },


  {
    id: "b2",
    name: "Neighborhood Bookstore",
    address: "55 Elm Rd, Austin, TX 78702",
    phone: "(512) 555-0222",
    website: "https://neighbook.example.com",
    category: "Bookstore",
    rating: 4.8,
    reviewCount: 210,
    priceRange: 1,
    openedDate: "2008-11-15",
    shortDescription: "Independent bookstore with curated fiction and regular author events.",
    tags: ["books", "events", "family"],
    photos: [],
    hours: {
      monday: [{ open: "10:00", close: "18:00" }],
      tuesday: [{ open: "10:00", close: "18:00" }],
      wednesday: [{ open: "10:00", close: "18:00" }],
      thursday: [{ open: "10:00", close: "18:00" }],
      friday: [{ open: "10:00", close: "20:00" }],
      saturday: [{ open: "11:00", close: "20:00" }],
      sunday: [{ open: "11:00", close: "17:00" }]
    },
    reviews: [],
    bookmarked: false,
    deal: {
      description: "10% off purchases over $20 (in-store).",
      expires: "2025-11-30"
    }
  },


  {
    id: "b3",
    name: "Solace Yoga Studio",
    address: "900 Lakeside Ave, Austin, TX 78703",
    phone: "(512) 555-0333",
    website: "https://solace.example.com",
    category: "Fitness",
    rating: 4.3,
    reviewCount: 88,
    priceRange: 2,
    openedDate: "2019-02-01",
    shortDescription: "Hot yoga, meditation classes and workshops for all levels.",
    tags: ["yoga", "fitness", "wellness"],
    photos: [],
    hours: {
      monday: [{ open: "06:00", close: "21:00" }],
      tuesday: [{ open: "06:00", close: "21:00" }],
      wednesday: [{ open: "06:00", close: "21:00" }],
      thursday: [{ open: "06:00", close: "21:00" }],
      friday: [{ open: "06:00", close: "21:00" }],
      saturday: [{ open: "08:00", close: "18:00" }],
      sunday: [{ open: "08:00", close: "18:00" }]
    },
    reviews: [],
    bookmarked: false
  },


  {
    id: "b4",
    name: "Ace Plumbing Co.",
    address: "310 Industrial Pkwy, Austin, TX 78704",
    phone: "(512) 555-0444",
    website: "https://aceplumb.example.com",
    category: "Home Services",
    rating: 4.1,
    reviewCount: 46,
    priceRange: 3,
    openedDate: "2002-09-10",
    shortDescription: "Emergency plumbing, repairs and installations — available 24/7.",
    tags: ["plumber", "emergency", "repairs"],
    photos: [],
    hours: {
      monday: [{ open: "00:00", close: "23:59" }],
      tuesday: [{ open: "00:00", close: "23:59" }],
      wednesday: [{ open: "00:00", close: "23:59" }],
      thursday: [{ open: "00:00", close: "23:59" }],
      friday: [{ open: "00:00", close: "23:59" }],
      saturday: [{ open: "00:00", close: "23:59" }],
      sunday: [{ open: "00:00", close: "23:59" }]
    },
    reviews: [],
    bookmarked: false
  },


  {
    id: "b5",
    name: "Green Scissors Salon",
    address: "48 Oak Ln, Austin, TX 78705",
    phone: "(512) 555-0555",
    website: "https://greenscissors.example.com",
    category: "Salon",
    rating: 4.5,
    reviewCount: 142,
    priceRange: 2,
    openedDate: "2016-04-20",
    shortDescription: "Eco-friendly salon specializing in modern cuts and sustainable products.",
    tags: ["salon", "haircut", "styling", "eco"],
    photos: [],
    hours: {
      monday: [{ open: "09:00", close: "19:00" }],
      tuesday: [{ open: "09:00", close: "19:00" }],
      wednesday: [{ open: "09:00", close: "19:00" }],
      thursday: [{ open: "09:00", close: "19:00" }],
      friday: [{ open: "09:00", close: "19:00" }],
      saturday: [{ open: "08:00", close: "17:00" }],
      sunday: []
    },
    reviews: [],
    bookmarked: false,
    deal: {
      description: "20% off first visit (new customers).",
      expires: "2026-01-31"
    }
  },

  {
  id: "b6",
  name: "The Daily Grind Coffee",
  address: "901 Maple Ave, Austin, TX 78702",
  phone: "(512) 555-0666",
  website: "https://dailygrind.example.com",
  category: "Cafe",
  rating: 4.7,
  reviewCount: 288,
  priceRange: 2,
  openedDate: "2018-03-12",
  shortDescription: "Cozy neighborhood cafe known for its artisan coffee and fresh pastries.",
  tags: ["coffee", "bakery", "breakfast", "local"],
  photos: [],
  hours: {
    monday: [{ open: "07:00", close: "17:00" }],
    tuesday: [{ open: "07:00", close: "17:00" }],
    wednesday: [{ open: "07:00", close: "17:00" }],
    thursday: [{ open: "07:00", close: "17:00" }],
    friday: [{ open: "07:00", close: "17:00" }],
    saturday: [{ open: "08:00", close: "15:00" }],
    sunday: []
  },
  reviews: [],
  bookmarked: false,
  deal: {
    description: "Buy one latte, get one 50% off.",
    expires: "2026-02-28"
  }
  },

{
  id: "b7",
  name: "Luna Yoga Studio",
  address: "2300 W 5th St, Austin, TX 78703",
  phone: "(512) 555-0777",
  website: "https://lunayoga.example.com",
  category: "Fitness",
  rating: 4.9,
  reviewCount: 412,
  priceRange: 3,
  openedDate: "2017-10-01",
  shortDescription: "Peaceful yoga studio offering daily classes and mindfulness workshops.",
  tags: ["yoga", "wellness", "fitness", "studio"],
  photos: [],
  hours: {
    monday: [{ open: "06:00", close: "20:00" }],
    tuesday: [{ open: "06:00", close: "20:00" }],
    wednesday: [{ open: "06:00", close: "20:00" }],
    thursday: [{ open: "06:00", close: "20:00" }],
    friday: [{ open: "06:00", close: "19:00" }],
    saturday: [{ open: "08:00", close: "14:00" }],
    sunday: [{ open: "08:00", close: "14:00" }]
  },
  reviews: [],
  bookmarked: false,
  deal: {
    description: "First class free for new students.",
    expires: "2026-04-01"
  }
},

{
  id: "b8",
  name: "TechFix Mobile Repair",
  address: "611 Congress Ave, Austin, TX 78701",
  phone: "(512) 555-0888",
  website: "https://techfix.example.com",
  category: "Electronics Repair",
  rating: 4.4,
  reviewCount: 95,
  priceRange: 2,
  openedDate: "2019-06-15",
  shortDescription: "Quick and affordable phone and tablet repair with same-day service.",
  tags: ["electronics", "repair", "mobile", "tech"],
  photos: [],
  hours: {
    monday: [{ open: "09:00", close: "18:00" }],
    tuesday: [{ open: "09:00", close: "18:00" }],
    wednesday: [{ open: "09:00", close: "18:00" }],
    thursday: [{ open: "09:00", close: "18:00" }],
    friday: [{ open: "09:00", close: "18:00" }],
    saturday: [{ open: "10:00", close: "15:00" }],
    sunday: []
  },
  reviews: [],
  bookmarked: false,
  deal: {
    description: "Free screen protector with any phone repair.",
    expires: "2026-03-31"
  }
},

{
  id: "b9",
  name: "Bloom & Vine Florist",
  address: "4100 N Lamar Blvd, Austin, TX 78756",
  phone: "(512) 555-0999",
  website: "https://bloomandvine.example.com",
  category: "Florist",
  rating: 4.8,
  reviewCount: 175,
  priceRange: 3,
  openedDate: "2015-02-14",
  shortDescription: "Boutique florist crafting elegant arrangements for all occasions.",
  tags: ["florist", "flowers", "gifts", "weddings"],
  photos: [],
  hours: {
    monday: [{ open: "09:00", close: "18:00" }],
    tuesday: [{ open: "09:00", close: "18:00" }],
    wednesday: [{ open: "09:00", close: "18:00" }],
    thursday: [{ open: "09:00", close: "18:00" }],
    friday: [{ open: "09:00", close: "18:00" }],
    saturday: [{ open: "09:00", close: "15:00" }],
    sunday: []
  },
  reviews: [],
  bookmarked: false,
  deal: {
    description: "10% off Valentine’s Day preorders.",
    expires: "2026-02-14"
  }
},

{
  id: "b10",
  name: "Trailside Bistro",
  address: "1620 Barton Springs Rd, Austin, TX 78704",
  phone: "(512) 555-0100",
  website: "https://trailsidebistro.example.com",
  category: "Restaurant",
  rating: 4.6,
  reviewCount: 389,
  priceRange: 3,
  openedDate: "2020-08-22",
  shortDescription: "Modern bistro offering fresh local dishes and outdoor seating by the trail.",
  tags: ["restaurant", "bistro", "local", "outdoor"],
  photos: [],
  hours: {
    monday: [{ open: "11:00", close: "22:00" }],
    tuesday: [{ open: "11:00", close: "22:00" }],
    wednesday: [{ open: "11:00", close: "22:00" }],
    thursday: [{ open: "11:00", close: "22:00" }],
    friday: [{ open: "11:00", close: "23:00" }],
    saturday: [{ open: "10:00", close: "23:00" }],
    sunday: [{ open: "10:00", close: "21:00" }]
  },
  reviews: [],
  bookmarked: false,
  deal: {
    description: "Free dessert with any entrée after 8 PM.",
    expires: "2026-05-15"
  }
}
];


// make available globally in browser (simple offline use)
if (typeof window !== "undefined") {
  window.LISTINGS = LISTINGS;
}
