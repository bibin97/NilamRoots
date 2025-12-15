
import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, Plus, Minus, Play } from 'lucide-react';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ProductDetails = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ user: '', rating: 5, comment: '' });
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Get Search Query
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    const handleBuyNow = () => {
        navigate('/checkout', { state: { product: selectedProduct } });
    };

    const mockProducts = [
        {
            _id: '1',
            name: 'Nilam Roots (500ml)',
            price: 800,
            description: 'Experience the power of our authentic dark green herbal oil. Made with wood-pressed coconut oil and slow-cooked with 14 potent ayurvedic herbs effectively stopping hairfall.',
            images: ['/assets/nilam_roots_500ml_v2.jpg'],
            rating: 4.8,
            reviewsCount: 124,
            features: ['Rich Dark Green Color', 'Stops Hairfall', 'Promotes Regrowth', 'Controls Dandruff']
        },
        {
            _id: '2',
            name: 'Nilam Roots (1 Litre)',
            price: 1600,
            description: 'The mega saver pack of our rich dark green miracle oil. Best suited for long-term treatment and family use. 100% natural and preservative-free.',
            images: ['/assets/nilam_roots_1ltr_v2.jpg'],
            rating: 4.9,
            reviewsCount: 89,
            features: ['Best Value', 'Intense Repair', 'Cooling Effect', 'Stress Relief']
        }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                if (res.data && res.data.length > 0) {
                    setProducts(res.data);

                    // Filter by Search Query if exists
                    if (searchQuery) {
                        const found = res.data.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
                        if (found) {
                            setSelectedProduct(found);
                            fetchReviews(found._id);
                        } else {
                            setSelectedProduct(res.data[0]);
                            fetchReviews(res.data[0]._id);
                            // Optional: Show toast "Product not found, showing default"
                        }
                    } else {
                        setSelectedProduct(res.data[0]); // Default to first product
                        fetchReviews(res.data[0]._id);
                    }
                } else {
                    // Fallback to mock data if API returns empty
                    console.log("Using mock data (API returned empty)");
                    setProducts(mockProducts);
                    setSelectedProduct(mockProducts[0]);
                }
            } catch (err) {
                console.error("Error fetching data, using mock data", err);
                // Fallback to mock data on error
                setProducts(mockProducts);
                setSelectedProduct(mockProducts[0]);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const fetchReviews = async (productId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching review", err);
        }
    };

    const handleProductChange = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        fetchReviews(product._id);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!selectedProduct) return;
            const res = await axios.post('http://localhost:5000/api/reviews', {
                productId: selectedProduct._id,
                ...newReview
            });
            setReviews([res.data, ...reviews]);
            setNewReview({ user: '', rating: 5, comment: '' });
        } catch (err) {
            console.error("Error submitting review", err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!selectedProduct) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-stone-900 pt-24 pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <Motion.div
                        key={selectedProduct._id} // Re-animate on change
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl overflow-hidden bg-stone-50 dark:bg-stone-800 p-8 flex items-center justify-center relative h-[400px] md:h-[600px]"
                    >
                        <img
                            src={selectedProduct.images[0] || "/assets/nilam_roots_500ml_v2.jpg"}
                            alt={selectedProduct.name}
                            className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </Motion.div>

                    {/* Details Section */}
                    <Motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        {/* ... (existing code for title/price etc remains same until buttons) ... */}
                        <div>
                            <span className="text-gold-600 font-semibold tracking-widest uppercase text-sm">Best Seller</span>
                            <h1 className="text-4xl font-serif font-bold text-green-900 dark:text-white mt-2">{selectedProduct.name}</h1>
                            <div className="flex items-center space-x-2 mt-4">
                                <div className="flex text-gold-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} fill={i < Math.floor(selectedProduct.rating) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="text-gray-500 dark:text-gray-400">({selectedProduct.reviewsCount} reviews)</span>
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{selectedProduct.price}</div>

                        {/* Product Variants (Now Distinct Products) */}
                        <div className="space-y-3">
                            <span className="text-gray-700 font-medium">Available Varieties:</span>
                            <div className="grid grid-cols-2 gap-3">
                                {products.map((prod) => (
                                    <button
                                        key={prod._id}
                                        onClick={() => handleProductChange(prod)}
                                        className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-3 ${selectedProduct._id === prod._id
                                            ? 'border-green-900 bg-green-50 ring-1 ring-green-900 dark:bg-green-900/20 dark:border-green-500 dark:ring-green-500'
                                            : 'border-gray-200 dark:border-stone-700 hover:border-gold-400 hover:bg-white dark:hover:bg-stone-800'
                                            }`}
                                    >
                                        <img src={prod.images[0]} alt="" className="w-10 h-10 object-contain rounded-full bg-stone-100" />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${selectedProduct._id === prod._id ? 'text-green-900 dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}>
                                                {prod.name.split('(')[0]}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {prod.name.match(/\((.*?)\)/) ? prod.name.match(/\((.*?)\)/)[1] : 'Standard'}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            {selectedProduct.description}
                        </p>

                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900 dark:text-white">Key Benefits:</h3>
                            <ul className="grid grid-cols-2 gap-4">
                                {selectedProduct.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center space-x-2">
                                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                                        <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:space-x-6">
                                {/* Quantity */}
                                <div className="flex items-center justify-center border border-gray-300 dark:border-stone-600 rounded-full text-gray-900 dark:text-white w-full sm:w-auto">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-gold-600"><Minus size={18} /></button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-gold-600"><Plus size={18} /></button>
                                </div>

                                {/* Buy Now */}
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-orange-500 text-white py-4 rounded-full font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 active:scale-95 transform duration-100"
                                >
                                    <ShoppingBag size={20} />
                                    <span>Buy Now</span>
                                </button>

                                {/* Add to Cart */}
                                <button
                                    onClick={() => addToCart(selectedProduct, quantity)}
                                    className="flex-1 bg-green-900 text-white py-4 rounded-full font-medium hover:bg-green-800 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-green-900/20 active:scale-95 transform duration-100"
                                >
                                    <Plus size={20} />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Tabs */}
                        <div className="pt-8">
                            <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto">
                                {['Description', 'Ingredients', 'How to Use', 'Reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`pb-4 px-2 text-sm font-medium tracking-wide whitespace-nowrap ${activeTab === tab.toLowerCase()
                                            ? 'text-green-900 dark:text-white border-b-2 border-green-900 dark:border-white'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                            }`}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                    >
                                        {tab.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            <div className="py-6 min-h-[200px]">
                                {activeTab === 'description' && (
                                    <div className="prose prose-sm text-gray-600 dark:text-gray-300">
                                        <p>{selectedProduct.description}</p>
                                        <p className="mt-4">
                                            <strong>Why it works:</strong> Our formulation is based on 100-year-old Ayurvedic texts.
                                            The herbs are slow-cooked in a bronze vessel for 48 hours to ensure maximum potency.
                                        </p>
                                    </div>
                                )}
                                {activeTab === 'ingredients' && (
                                    <div className="space-y-8">
                                        <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-xl group-hover:scale-110 transition-transform">
                                                    <Play size={32} fill="currentColor" className="text-green-900" />
                                                </div>
                                            </div>
                                            <img
                                                src="/assets/ingredients_pouring.png"
                                                alt="Traditional Ingredients Preparation"
                                                className="w-full h-[400px] object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                <h4 className="text-white font-serif text-xl font-bold">Making of Nilam Roots</h4>
                                                <p className="text-white/80 text-sm">Watch how we prepare our oil using traditional methods</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-bold text-green-900">Key Ingredients</h4>
                                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                                <li><strong>Wood-Pressed Coconut Oil:</strong> Deeply nourishing base</li>
                                                <li><strong>Amla (Indian Gooseberry):</strong> Vitamin C powerhouse</li>
                                                <li><strong>Hibiscus Flowers:</strong> Boosts hair growth</li>
                                                <li><strong>Aloe Vera:</strong> Soothes scalp</li>
                                                <li><strong>Bringraj:</strong> King of herbs for hair</li>
                                                <li><strong>Indigo:</strong> Natural color enhancer</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'how to use' && (
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold">1</div>
                                            <p className="text-gray-600">Apply liberally on scalp and hair roots.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold">2</div>
                                            <p className="text-gray-600">Massage gently for 10-15 minutes using fingertips.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold">3</div>
                                            <p className="text-gray-600">Leave it on for at least 1 hour or overnight for best results.</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold">4</div>
                                            <p className="text-gray-600">Wash off with a mild herbal shampoo.</p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-8">
                                        {/* Add Review Form */}
                                        <form onSubmit={handleReviewSubmit} className="bg-stone-50 dark:bg-stone-800 p-6 rounded-2xl space-y-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white">Write a Review</h3>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Your Name"
                                                    value={newReview.user}
                                                    onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-stone-600 dark:bg-stone-700 dark:text-white focus:outline-none focus:border-gold-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <select
                                                    value={newReview.rating}
                                                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gold-500"
                                                >
                                                    <option value="5">5 Stars - Excellent</option>
                                                    <option value="4">4 Stars - Good</option>
                                                    <option value="3">3 Stars - Average</option>
                                                    <option value="2">2 Stars - Poor</option>
                                                    <option value="1">1 Star - Terrible</option>
                                                </select>
                                            </div>
                                            <div>
                                                <textarea
                                                    placeholder="Your Review"
                                                    value={newReview.comment}
                                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-stone-600 dark:bg-stone-700 dark:text-white focus:outline-none focus:border-gold-500 min-h-[100px]"
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="bg-green-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-colors">
                                                Submit Review
                                            </button>
                                        </form>

                                        {/* Reviews List */}
                                        <div className="space-y-6">
                                            {reviews.length === 0 ? (
                                                <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                                            ) : (
                                                reviews.map((review) => (
                                                    <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <p className="font-bold text-gray-900 dark:text-white">{review.user}</p>
                                                            <div className="flex text-gold-500">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                                                        <p className="text-gray-400 text-xs mt-2">{new Date(review.date).toLocaleDateString()}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
