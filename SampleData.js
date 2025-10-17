// Sample Business Data for LocalBoost
// FBLA Coding & Programming 2025-2026: Byte-Sized Business Boost

/**
 * Sample business data structure for development and testing
 * Each business includes all required fields for the competition requirements
 */

const sampleBusinesses = [
    {
        id: "biz001",
        name: "Maria's Authentic Tacos",
        category: "food",
        description: "Family-owned Mexican restaurant serving authentic street tacos and traditional dishes since 1995.",
        address: "123 Main Street, Downtown",
        phone: "(555) 123-4567",
        email: "info@mariastacos.com",
        website: "www.mariastacos.com",
        hours: {
            monday: "11:00 AM - 9:00 PM",
            tuesday: "11:00 AM - 9:00 PM", 
            wednesday: "11:00 AM - 9:00 PM",
            thursday: "11:00 AM - 9:00 PM",
            friday: "11:00 AM - 10:00 PM",
            saturday: "10:00 AM - 10:00 PM",
            sunday: "12:00 PM - 8:00 PM"
        },
        rating: 4.7,
        reviewCount: 127,
        priceRange: "$$",
        tags: ["mexican", "tacos", "family-owned", "authentic", "outdoor-seating"],
        image: "assets/images/marias-tacos.jpg",
        verified: true,
        dateAdded: "2024-01-15"
    },
    {
        id: "biz002", 
        name: "TechFix Solutions",
        category: "services",
        description: "Professional computer and smartphone repair services with same-day turnaround for most issues.",
        address: "456 Tech Avenue, Suite 200",
        phone: "(555) 234-5678",
        email: "support@techfixsolutions.com", 
        website: "www.techfixsolutions.com",
        hours: {
            monday: "9:00 AM - 6:00 PM",
            tuesday: "9:00 AM - 6:00 PM",
            wednesday: "9:00 AM - 6:00 PM", 
            thursday: "9:00 AM - 6:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "10:00 AM - 4:00 PM",
            sunday: "Closed"
        },
        rating: 4.9,
        reviewCount: 89,
        priceRange: "$$$",
        tags: ["computer-repair", "phone-repair", "same-day", "warranty", "certified"],
        image: "assets/images/techfix-solutions.jpg",
        verified: true,
        dateAdded: "2024-02-03"
    },
    {
        id: "biz003",
        name: "Bloom & Petal Florist", 
        category: "retail",
        description: "Local florist specializing in custom arrangements for weddings, events, and everyday occasions.",
        address: "789 Garden Lane",
        phone: "(555) 345-6789",
        email: "orders@bloomandpetal.com",
        website: "www.bloomandpetal.com",
        hours: {
            monday: "8:00 AM - 5:00 PM",
            tuesday: "8:00 AM - 5:00 PM",
            wednesday: "8:00 AM - 5:00 PM",
            thursday: "8:00 AM - 5:00 PM", 
            friday: "8:00 AM - 6:00 PM",
            saturday: "8:00 AM - 6:00 PM",
            sunday: "10:00 AM - 3:00 PM"
        },
        rating: 4.5,
        reviewCount: 156,
        priceRange: "$$",
        tags: ["flowers", "weddings", "events", "custom", "delivery"],
        image: "assets/images/bloom-petal.jpg",
        verified: true,
        dateAdded: "2024-01-22"
    },
    {
        id: "biz004",
        name: "Retro Gaming Arcade",
        category: "entertainment", 
        description: "Classic arcade games, pinball machines, and modern gaming in a nostalgic atmosphere. Perfect for all ages!",
        address: "321 Entertainment Blvd",
        phone: "(555) 456-7890",
        email: "fun@retrogamingarcade.com",
        website: "www.retrogamingarcade.com",
        hours: {
            monday: "2:00 PM - 10:00 PM",
            tuesday: "2:00 PM - 10:00 PM",
            wednesday: "2:00 PM - 10:00 PM",
            thursday: "2:00 PM - 10:00 PM",
            friday: "2:00 PM - 12:00 AM", 
            saturday: "12:00 PM - 12:00 AM",
            sunday: "12:00 PM - 9:00 PM"
        },
        rating: 4.8,
        reviewCount: 203,
        priceRange: "$",
        tags: ["arcade", "gaming", "family-fun", "retro", "tournaments"],
        image: "assets/images/retro-arcade.jpg",
        verified: true,
        dateAdded: "2024-03-10"
    },
    {
        id: "biz005",
        name: "Java Junction Coffee",
        category: "food",
        description: "Artisan coffee shop with locally roasted beans, fresh pastries, and cozy study spaces for students.",
        address: "654 University Avenue",
        phone: "(555) 567-8901", 
        email: "hello@javajunction.com",
        website: "www.javajunction.com",
        hours: {
            monday: "6:00 AM - 8:00 PM",
            tuesday: "6:00 AM - 8:00 PM",
            wednesday: "6:00 AM - 8:00 PM",
            thursday: "6:00 AM - 8:00 PM",
            friday: "6:00 AM - 9:00 PM",
            saturday: "7:00 AM - 9:00 PM", 
            sunday: "7:00 AM - 7:00 PM"
        },
        rating: 4.6,
        reviewCount: 312,
        priceRange: "$$",
        tags: ["coffee", "study-space", "wifi", "pastries", "local-roasted"],
        image: "assets/images/java-junction.jpg",
        verified: true,
        dateAdded: "2024-01-08"
    }
];

/**
 * Sample reviews data structure
 * Demonstrates the review and rating system functionality
 */
const sampleReviews = [
    {
        id: "rev001",
        businessId: "biz001", 
        userName: "FoodLover23",
        rating: 5,
        title: "Absolutely amazing authentic tacos!",
        comment: "Best Mexican food in town! The carnitas tacos are incredible and the staff is so friendly. Definitely coming back!",
        date: "2024-10-10",
        helpful: 12,
        verified: true
    },
    {
        id: "rev002",
        businessId: "biz001",
        userName: "LocalEats",
        rating: 4,
        title: "Great food, busy location",
        comment: "Really good tacos and fair prices. Can get crowded during lunch rush but worth the wait. Love supporting local businesses!",
        date: "2024-10-05", 
        helpful: 8,
        verified: true
    },
    {
        id: "rev003",
        businessId: "biz002",
        userName: "TechGuru42",
        rating: 5,
        title: "Saved my laptop!",
        comment: "My laptop crashed right before a big presentation. They fixed it in 2 hours and saved all my data. Lifesavers!",
        date: "2024-09-28",
        helpful: 15,
        verified: true
    },
    {
        id: "rev004",
        businessId: "biz003",
        userName: "BrideToBe2024", 
        rating: 5,
        title: "Perfect wedding flowers",
        comment: "Bloom & Petal created the most beautiful arrangements for my wedding. Everything was exactly as I envisioned!",
        date: "2024-09-15",
        helpful: 22,
        verified: true
    },
    {
        id: "rev005",
        businessId: "biz004",
        userName: "GameMaster",
        rating: 5,
        title: "Nostalgic gaming paradise",
        comment: "Brought back so many childhood memories! Great selection of classic games and the new ones too. Clean and well-maintained.",
        date: "2024-10-12",
        helpful: 6,
        verified: true
    }
];

/**
 * Sample deals and coupons data structure
 * Shows special offers and promotional content
 */
const sampleDeals = [
    {
        id: "deal001",
        businessId: "biz001",
        title: "Taco Tuesday Special", 
        description: "Buy 2 tacos, get 1 free every Tuesday!",
        discountType: "buy-x-get-y",
        discountValue: "Buy 2 Get 1 Free",
        validFrom: "2024-10-01",
        validUntil: "2024-12-31",
        terms: "Valid on Tuesdays only. Dine-in or takeout. Cannot be combined with other offers.",
        active: true,
        category: "weekly-special"
    },
    {
        id: "deal002", 
        businessId: "biz002",
        title: "Student Discount",
        description: "15% off all repair services for students with valid ID",
        discountType: "percentage",
        discountValue: 15,
        validFrom: "2024-09-01", 
        validUntil: "2025-05-31",
        terms: "Must present valid student ID. Cannot be combined with other promotions.",
        active: true,
        category: "student-discount"
    },
    {
        id: "deal003",
        businessId: "biz003",
        title: "Wedding Package Discount",
        description: "$50 off wedding arrangements over $300",
        discountType: "fixed-amount",
        discountValue: 50,
        validFrom: "2024-10-01",
        validUntil: "2025-06-30", 
        terms: "Minimum order $300. Must book 2 weeks in advance. Valid for weddings only.",
        active: true,
        category: "wedding-special"
    },
    {
        id: "deal004",
        businessId: "biz004",
        title: "Family Fun Package", 
        description: "4 hours of gaming for just $25 (reg. $40)",
        discountType: "package",
        discountValue: 25,
        validFrom: "2024-10-15",
        validUntil: "2024-11-15",
        terms: "Valid for up to 4 people. Weekdays only. Must mention deal when visiting.",
        active: true,
        category: "family-package"
    },
    {
        id: "deal005",
        businessId: "biz005",
        title: "Coffee Loyalty Card",
        description: "Buy 10 coffees, get the 11th free!",
        discountType: "loyalty", 
        discountValue: "Free Coffee",
        validFrom: "2024-01-01",
        validUntil: "2024-12-31",
        terms: "Physical loyalty card required. Valid on regular coffee drinks only.",
        active: true,
        category: "loyalty-program"
    }
];

/**
 * Business categories for filtering and organization
 */
const businessCategories = [
    {
        id: "food",
        name: "Food & Dining", 
        icon: "🍽️",
        description: "Restaurants, cafes, bakeries, and food services",
        count: 0 // Will be calculated dynamically
    },
    {
        id: "retail",
        name: "Retail & Shopping",
        icon: "🛍️", 
        description: "Stores, boutiques, and retail businesses",
        count: 0
    },
    {
        id: "services", 
        name: "Professional Services",
        icon: "🔧",
        description: "Repair services, consulting, and professional help",
        count: 0
    },
    {
        id: "entertainment",
        name: "Entertainment & Recreation", 
        icon: "🎮",
        description: "Gaming, sports, recreation, and entertainment venues",
        count: 0
    }
];

/**
 * Export all sample data for use in the application
 * This data will be used to populate the application during development
 */
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        sampleBusinesses,
        sampleReviews, 
        sampleDeals,
        businessCategories
    };
} else {
    // Browser environment - make available globally
    window.sampleData = {
        businesses: sampleBusinesses,
        reviews: sampleReviews,
        deals: sampleDeals,
        categories: businessCategories
    };
}

/**
 * Utility functions for working with sample data
 */
const dataUtils = {
    /**
     * Get businesses by category
     * @param {string} category - Category to filter by
     * @returns {Array} Filtered businesses
     */
    getBusinessesByCategory: function(category) {
        return sampleBusinesses.filter(business => business.category === category);
    },

    /**
     * Get businesses with rating above threshold  
     * @param {number} minRating - Minimum rating threshold
     * @returns {Array} Filtered businesses
     */
    getTopRatedBusinesses: function(minRating = 4.5) {
        return sampleBusinesses.filter(business => business.rating >= minRating);
    },

    /**
     * Get reviews for a specific business
     * @param {string} businessId - Business ID to get reviews for
     * @returns {Array} Business reviews
     */
    getReviewsForBusiness: function(businessId) {
        return sampleReviews.filter(review => review.businessId === businessId);
    },

    /**
     * Get active deals for a business
     * @param {string} businessId - Business ID to get deals for  
     * @returns {Array} Active deals
     */
    getDealsForBusiness: function(businessId) {
        const currentDate = new Date().toISOString().split('T')[0];
        return sampleDeals.filter(deal => 
            deal.businessId === businessId && 
            deal.active && 
            deal.validFrom <= currentDate && 
            deal.validUntil >= currentDate
        );
    },

    /**
     * Search businesses by name or description
     * @param {string} searchTerm - Term to search for
     * @returns {Array} Matching businesses
     */
    searchBusinesses: function(searchTerm) {
        const term = searchTerm.toLowerCase();
        return sampleBusinesses.filter(business => 
            business.name.toLowerCase().includes(term) ||
            business.description.toLowerCase().includes(term) ||
            business.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }
};

// Make utility functions available globally if in browser
if (typeof window !== 'undefined') {
    window.dataUtils = dataUtils;
}