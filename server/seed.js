const sequelize = require('./config/database');
const Product = require('./models/Product');
require('dotenv').config();

const seedProducts = [
    {
        name: "Nilam Signature Black Herbal Oil (500ml)",
        description: "Our flagship product. A potent, dark blend of roasted amla, hibiscus flowers, and secret roots infused in wood-pressed coconut oil. This traditional 'Kanjiram' method creates a nutrient-rich black oil that penetrates deep into the scalp to halt hairfall immediately and darken premature greying.",
        price: 549,
        images: ["/assets/nilam_roots_500ml_v2.jpg"],
        features: ["Stops Hairfall in 7 Days", "Darkens Grey Hair", "Cooling Effect", "Traditional Recipe"],
        inStock: true,
        rating: 4.9,
        reviewsCount: 203
    },
    {
        name: "Nilam Signature Black Herbal Oil (1 Litre)",
        description: "The complete 3-month course for total hair transformation. Our signature black herbal oil in a value saver pack. Ideal for families or long-term treatment. Regular use ensures thick, lustrous, and jet-black hair.",
        price: 999,
        images: ["/assets/nilam_roots_1ltr_v2.jpg"],
        features: ["Best Value", "Long-term Regrowth", "Family Pack", "Free Shipping"],
        inStock: true,
        rating: 5.0,
        reviewsCount: 120
    },
    {
        name: "Nilam Neelibringadi Intensive Oil",
        description: "A classic Ayurvedic formulation prepared with indigo (Neela), false daisy (Bhringraj), and gooseberry (Amla). This greenish-blue oil is the ultimate remedy for severe dandruff, sleeplessness, and scalp infections. It promotes hair growth while calming the mind.",
        price: 450,
        images: ["/assets/nilam_roots_shop.jpg"],
        features: ["Cures Dandruff", "Relieves Headache", "Promotes Deep Sleep", "Cooling Therapy"],
        inStock: true,
        rating: 4.7,
        reviewsCount: 85
    },
    {
        name: "Nilam Onion & Curry Leaf Regrowth Oil",
        description: "A powerful fusion of sulfur-rich small onions and iron-packed curry leaves. Designed specifically for balding spots and thinning hair. This oil stimulates dormant follicles and boosts collagen production for rapid hair regrowth.",
        price: 399,
        images: ["/assets/nilam_roots_shop.jpg"],
        features: ["Boosts Regrowth", "Fights Thinning", "Sulfur Rich", "Volumizing"],
        inStock: true,
        rating: 4.6,
        reviewsCount: 64
    }
];

const seedDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connected for Seeding');

        // Sync to ensure table exists
        await sequelize.sync();

        await Product.destroy({ where: {}, truncate: true });

        // Use bulkCreate for multiple records
        // Note: images and features arrays are automatically handled by JSON DataType in Sequelize
        await Product.bulkCreate(seedProducts);

        console.log('Database Seeded!');
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
};

seedDB();
