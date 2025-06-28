// Product data for both menu (food) and shop (pet products)

export const menuProducts = [
  // Burgers
  {
    id: 1,
    category: "burgers",
    name: "Classic Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce",
    fullDescription: "Our signature Classic Beef Burger features a perfectly seasoned 6oz beef patty, cooked to perfection and served on a toasted brioche bun. Topped with crisp lettuce, fresh tomato, red onion, and our house-made special sauce.",
    price: 12.99,
    isPopular: true,
    isNew: false,
    rating: 4.8,
    reviews: 127,
    prepTime: "12-15 min",
    calories: 650,
    images: [
      "/placeholder-burger-1.jpg",
      "/placeholder-burger-2.jpg",
      "/placeholder-burger-3.jpg"
    ],
    ingredients: [
      "6oz Beef Patty",
      "Brioche Bun",
      "Lettuce",
      "Tomato", 
      "Red Onion",
      "Special Sauce",
      "Pickles"
    ],
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 650,
      protein: "35g",
      carbs: "45g",
      fat: "35g",
      sodium: "1200mg"
    },
    sizes: [
      { name: "Regular", price: 0, description: "Standard 6oz patty" },
      { name: "Large", price: 3.00, description: "8oz patty" },
      { name: "XL", price: 5.00, description: "Double 6oz patties" }
    ],
    extras: [
      { name: "Extra Cheese", price: 1.50 },
      { name: "Bacon", price: 2.50 },
      { name: "Avocado", price: 2.00 },
      { name: "Extra Patty", price: 4.00 },
      { name: "Mushrooms", price: 1.00 },
      { name: "Jalapeños", price: 0.75 }
    ]
  },
  {
    id: 2,
    category: "burgers",
    name: "BBQ Bacon Burger",
    description: "Beef patty with crispy bacon, BBQ sauce, and caramelized onions",
    fullDescription: "A mouth-watering combination of our signature beef patty topped with crispy applewood smoked bacon, tangy BBQ sauce, and perfectly caramelized onions on a toasted sesame bun.",
    price: 15.99,
    isPopular: false,
    isNew: true,
    rating: 4.6,
    reviews: 89,
    prepTime: "15-18 min",
    calories: 780,
    images: [
      "/placeholder-bbq-burger-1.jpg",
      "/placeholder-bbq-burger-2.jpg"
    ],
    ingredients: [
      "6oz Beef Patty",
      "Sesame Bun",
      "Applewood Bacon",
      "BBQ Sauce",
      "Caramelized Onions",
      "Lettuce"
    ],
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 780,
      protein: "42g",
      carbs: "48g",
      fat: "45g",
      sodium: "1450mg"
    },
    sizes: [
      { name: "Regular", price: 0, description: "Standard 6oz patty" },
      { name: "Large", price: 3.00, description: "8oz patty" }
    ],
    extras: [
      { name: "Extra Bacon", price: 2.50 },
      { name: "Cheese", price: 1.50 },
      { name: "Extra BBQ Sauce", price: 0.50 },
      { name: "Onion Rings", price: 2.00 }
    ]
  },
  {
    id: 3,
    category: "burgers",
    name: "Chicken Deluxe",
    description: "Grilled chicken breast with avocado, lettuce, and mayo",
    fullDescription: "Tender grilled chicken breast seasoned with herbs and spices, topped with fresh avocado, crisp lettuce, tomato, and creamy mayo on a whole wheat bun.",
    price: 13.99,
    isPopular: true,
    isNew: false,
    rating: 4.7,
    reviews: 156,
    prepTime: "14-16 min",
    calories: 590,
    images: [
      "/placeholder-chicken-burger-1.jpg",
      "/placeholder-chicken-burger-2.jpg"
    ],
    ingredients: [
      "Grilled Chicken Breast",
      "Whole Wheat Bun",
      "Avocado",
      "Lettuce",
      "Tomato",
      "Mayo"
    ],
    allergens: ["Gluten", "Eggs"],
    nutritionalInfo: {
      calories: 590,
      protein: "38g",
      carbs: "42g",
      fat: "28g",
      sodium: "980mg"
    },
    sizes: [
      { name: "Regular", price: 0, description: "Standard chicken breast" },
      { name: "Large", price: 2.50, description: "Double chicken breast" }
    ],
    extras: [
      { name: "Extra Avocado", price: 2.00 },
      { name: "Cheese", price: 1.50 },
      { name: "Bacon", price: 2.50 },
      { name: "Spicy Mayo", price: 0.50 }
    ]
  },
  {
    id: 4,
    category: "burgers",
    name: "Veggie Supreme",
    description: "Plant-based patty with fresh vegetables and tahini sauce",
    fullDescription: "Our house-made plant-based patty featuring a blend of quinoa, black beans, and vegetables, topped with fresh lettuce, tomato, cucumber, sprouts, and creamy tahini sauce.",
    price: 11.99,
    isPopular: false,
    isNew: true,
    rating: 4.3,
    reviews: 67,
    prepTime: "12-14 min",
    calories: 520,
    images: [
      "/placeholder-veggie-burger-1.jpg"
    ],
    ingredients: [
      "Plant-based Patty",
      "Whole Grain Bun",
      "Lettuce",
      "Tomato",
      "Cucumber",
      "Sprouts",
      "Tahini Sauce"
    ],
    allergens: ["Gluten", "Sesame"],
    nutritionalInfo: {
      calories: 520,
      protein: "22g",
      carbs: "58g",
      fat: "18g",
      sodium: "890mg"
    },
    sizes: [
      { name: "Regular", price: 0, description: "Standard patty" },
      { name: "Large", price: 2.00, description: "Double patty" }
    ],
    extras: [
      { name: "Vegan Cheese", price: 2.00 },
      { name: "Extra Vegetables", price: 1.50 },
      { name: "Hummus", price: 1.00 },
      { name: "Avocado", price: 2.00 }
    ]
  },
  // Sides
  {
    id: 5,
    category: "sides",
    name: "Crispy Fries",
    description: "Golden crispy fries seasoned with sea salt",
    fullDescription: "Our signature crispy fries are cut fresh daily and cooked to golden perfection. Seasoned with sea salt and served hot.",
    price: 4.99,
    isPopular: true,
    isNew: false,
    rating: 4.5,
    reviews: 203,
    prepTime: "8-10 min",
    calories: 320,
    images: [
      "/placeholder-fries-1.jpg"
    ],
    ingredients: [
      "Potatoes",
      "Sea Salt",
      "Vegetable Oil"
    ],
    allergens: [],
    nutritionalInfo: {
      calories: 320,
      protein: "4g",
      carbs: "42g",
      fat: "15g",
      sodium: "580mg"
    },
    sizes: [
      { name: "Regular", price: 0, description: "Standard portion" },
      { name: "Large", price: 2.00, description: "Extra portion" }
    ],
    extras: [
      { name: "Cheese Sauce", price: 1.50 },
      { name: "Bacon Bits", price: 2.00 },
      { name: "Truffle Oil", price: 3.00 }
    ]
  },
  // Add more menu items...
];

export const shopProducts = [
  {
    id: 101,
    category: "treats",
    name: "Premium Dog Treats",
    description: "Delicious and healthy treats made with real chicken and vegetables",
    fullDescription: "Our premium dog treats are made with real chicken as the first ingredient, combined with sweet potatoes, carrots, and peas. These treats are grain-free, gluten-free, and perfect for training or rewarding your furry friend.",
    price: 12.99,
    inStock: true,
    rating: 4.8,
    reviews: 89,
    badge: "bestseller",
    images: [
      "/placeholder-dog-treats-1.jpg",
      "/placeholder-dog-treats-2.jpg"
    ],
    ingredients: [
      "Real Chicken",
      "Sweet Potatoes",
      "Carrots",
      "Peas",
      "Natural Flavors"
    ],
    benefits: [
      "High protein content",
      "Grain-free formula",
      "Supports healthy digestion",
      "Great for training"
    ],
    petSizes: ["Small", "Medium", "Large"],
    nutritionalInfo: {
      protein: "28%",
      fat: "12%",
      fiber: "4%",
      moisture: "10%"
    },
    sizes: [
      { name: "Small Bag", weight: "8oz", price: 0, description: "Perfect for trying" },
      { name: "Medium Bag", weight: "1lb", price: 5.00, description: "Most popular" },
      { name: "Large Bag", weight: "2lb", price: 12.00, description: "Best value" }
    ]
  },
  {
    id: 102,
    category: "treats",
    name: "Peanut Butter Biscuits",
    description: "Crunchy dog biscuits with natural peanut butter flavor",
    fullDescription: "These crunchy biscuits are baked with natural peanut butter and oats, creating a delicious treat that dogs absolutely love. Made with wholesome ingredients and no artificial preservatives.",
    price: 9.99,
    inStock: true,
    rating: 4.6,
    reviews: 67,
    badge: null,
    images: [
      "/placeholder-pb-biscuits-1.jpg"
    ],
    ingredients: [
      "Whole Wheat Flour",
      "Natural Peanut Butter",
      "Oats",
      "Honey",
      "Eggs"
    ],
    benefits: [
      "Natural peanut butter flavor",
      "Crunchy texture for dental health",
      "Made with wholesome ingredients",
      "No artificial preservatives"
    ],
    petSizes: ["Small", "Medium", "Large"],
    nutritionalInfo: {
      protein: "18%",
      fat: "8%",
      fiber: "3%",
      moisture: "8%"
    },
    sizes: [
      { name: "Small Box", weight: "12oz", price: 0, description: "24 biscuits" },
      { name: "Large Box", weight: "24oz", price: 6.00, description: "48 biscuits" }
    ]
  },
  {
    id: 103,
    category: "dental",
    name: "Dental Chew Bones",
    description: "Long-lasting chew bones that help clean teeth naturally",
    fullDescription: "These dental chew bones are designed to help clean your dog's teeth and freshen breath naturally. Made with natural ingredients and shaped to reach back teeth for thorough cleaning.",
    price: 15.99,
    inStock: true,
    rating: 4.7,
    reviews: 134,
    badge: null,
    images: [
      "/placeholder-dental-bones-1.jpg",
      "/placeholder-dental-bones-2.jpg"
    ],
    ingredients: [
      "Rice Flour",
      "Chicken Meal",
      "Natural Mint",
      "Parsley",
      "Calcium Carbonate"
    ],
    benefits: [
      "Helps clean teeth",
      "Freshens breath",
      "Long-lasting chew",
      "Supports dental health"
    ],
    petSizes: ["Small", "Medium", "Large"],
    nutritionalInfo: {
      protein: "15%",
      fat: "2%",
      fiber: "1%",
      moisture: "12%"
    },
    sizes: [
      { name: "Small Dogs", weight: "Under 25lbs", price: 0, description: "4 bones" },
      { name: "Medium Dogs", weight: "25-50lbs", price: 3.00, description: "3 bones" },
      { name: "Large Dogs", weight: "Over 50lbs", price: 5.00, description: "2 bones" }
    ]
  },
  {
    id: 104,
    category: "cat",
    name: "Organic Cat Treats",
    description: "Premium organic treats made specifically for cats",
    fullDescription: "These organic cat treats are made with wild-caught salmon and organic ingredients. Perfect for training, rewarding, or just showing your cat some love.",
    price: 11.99,
    inStock: true,
    rating: 4.5,
    reviews: 78,
    badge: "organic",
    images: [
      "/placeholder-cat-treats-1.jpg"
    ],
    ingredients: [
      "Wild-caught Salmon",
      "Organic Brown Rice",
      "Organic Sweet Potato",
      "Natural Flavors"
    ],
    benefits: [
      "Made with organic ingredients",
      "High in protein",
      "Irresistible salmon flavor",
      "Perfect size for cats"
    ],
    petSizes: ["Kitten", "Adult Cat"],
    nutritionalInfo: {
      protein: "35%",
      fat: "15%",
      fiber: "2%",
      moisture: "8%"
    },
    sizes: [
      { name: "Small Pouch", weight: "3oz", price: 0, description: "Trial size" },
      { name: "Regular Pouch", weight: "6oz", price: 4.00, description: "Standard size" }
    ]
  },
  {
    id: 105,
    category: "supplements",
    name: "Senior Dog Supplements",
    description: "Nutritional supplements designed for senior dogs",
    fullDescription: "These supplements are specially formulated for senior dogs to support joint health, cognitive function, and overall vitality. Contains glucosamine, omega-3 fatty acids, and antioxidants.",
    price: 24.99,
    inStock: true,
    rating: 4.6,
    reviews: 92,
    badge: "senior",
    images: [
      "/placeholder-supplements-1.jpg"
    ],
    ingredients: [
      "Glucosamine HCl",
      "Chondroitin Sulfate",
      "Omega-3 Fatty Acids",
      "Vitamin E",
      "Turmeric"
    ],
    benefits: [
      "Supports joint health",
      "Promotes cognitive function",
      "Rich in antioxidants",
      "Easy-to-give soft chews"
    ],
    petSizes: ["Medium", "Large"],
    nutritionalInfo: {
      glucosamine: "500mg per chew",
      chondroitin: "400mg per chew",
      omega3: "200mg per chew"
    },
    sizes: [
      { name: "30 Count", weight: "1 month supply", price: 0, description: "Try it out" },
      { name: "90 Count", weight: "3 month supply", price: 15.00, description: "Best value" }
    ]
  }
  // Add more shop items...
];

// Combine all products for easy access
export const allProducts = [...menuProducts, ...shopProducts];
