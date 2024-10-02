import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { AiOutlineGlobal } from "react-icons/ai";

const Explore = () => {
    const [viewCategory, setViewCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [foodCategories, setFoodCategories] = useState([]);
    const [viewMeals, setViewMeals] = useState(false);
    const [foodLists, setFoodLists] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [viewDetails, setViewDetails] = useState(false);
    const [foodDetails, setFoodDetails] = useState(null);

    const fetchFoodCategories = () => {
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then((res) => res.json())
            .then((data) => setFoodCategories(data.categories))
            .catch((error) => console.error('Error fetching food categories:', error));
    };

    const fetchFoodsByCategory = (category) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then((res) => res.json())
            .then((data) => setFoodLists(data.meals))
            .catch((error) => console.error('Error fetching food lists:', error));
    };

    const fetchFoodDetailsById = (id) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then((res) => res.json())
            .then((data) => setFoodDetails(data.meals[0]))
            .catch((error) => console.error('Error fetching food details:', error));
    };

    const handleExplore = () => {
        setViewCategory(!viewCategory);
        fetchFoodCategories();
        setViewMeals(false);
        setSelectedFood(null);
        setViewDetails(false);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setViewMeals(true);
        setSelectedFood(null);
        setViewDetails(false);
        setFoodDetails(null); // Reset food details when changing category
    };

    const handleViewMeals = () => {
        fetchFoodsByCategory(selectedCategory);
        setViewMeals(false);
    };

    const handleFoodClick = (food) => {
        setSelectedFood(food);
        setViewDetails(true);
    };

    const handleViewDetails = () => {
        if (selectedFood) {
            fetchFoodDetailsById(selectedFood.idMeal);
            setViewDetails(false);
        }
    };

    const handleCloseDetails = () => {
        setFoodDetails(null);
    };

    return (
        <div className='flex items-center h-screen px-5 '>
            {/* Explore Button */}
            <div className="flex-shrink-0 mr-4">
                <Button className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full' onClick={handleExplore}>
                    <div className='flex items-center text-lg font-semibold'>
                        <AiOutlineGlobal /> <h4 className="mx-2">Explore</h4>
                    </div>
                </Button>
            </div>

            {/* Horizontal Scrolling Container */}
            {viewCategory && (
                <div className='flex flex-row overflow-x-auto whitespace-nowrap w-full'>
                    {/* Categories List */}
                    <div className='flex-shrink-0 bg-gray-100 p-4 mr-6 rounded-lg w-[300px]'>
                        <h3 className='text-xl font-semibold mb-4'>Categories</h3>
                        {foodCategories.slice(0, 5).map((item, i) => (
                            <div key={i} className='mb-2'>
                                <div className='p-3 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap'
                                    onClick={() => handleCategoryClick(item.strCategory)}
                                    style={{ wordBreak: 'break-word' }}
                                >
                                    <div className='flex items-center'>
                                        <img style={{ width: "3rem", marginRight: "1rem" }} src={item.strCategoryThumb} alt='category-icon' />
                                        <p className='text-lg font-semibold'>{item.strCategory}</p>
                                    </div>
                                </div>

                                {selectedCategory === item.strCategory && viewMeals && (
                                    <Button className='mt-2 w-full' onClick={handleViewMeals}>
                                        View Meals in {selectedCategory}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Meals List */}
                    {foodLists.length > 0 && !viewMeals && (
                        <div className='flex-shrink-0 bg-gray-100 p-4 mr-6 rounded-lg w-[300px]'>
                            <h3 className='text-xl font-semibold mb-4'>Meals in {selectedCategory}</h3>
                            {foodLists.slice(0, 5).map((food, i) => (
                                <div key={i} className='mb-2'>
                                    <div
                                        className='p-3 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap'
                                        onClick={() => handleFoodClick(food)}
                                        style={{ wordBreak: 'break-word' }} // Ensure long words are wrapped
                                    >
                                        {food.strMeal}
                                    </div>

                                    {selectedFood && selectedFood.idMeal === food.idMeal && viewDetails && (
                                        <div className="mt-2 space-y-2">
                                            <Button className='block w-full'>View Ingredients</Button>
                                            <Button className='block w-full'>View Tags</Button>
                                            <Button className='block w-full' onClick={handleViewDetails}>View Details</Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Meal Details */}
                    {foodDetails && (
                        <div className='flex-shrink-0 bg-white shadow-lg rounded-lg p-6 w-[400px] relative overflow-y-auto' style={{ maxHeight: '90vh' }}>
                            {/* Close Button */}
                            <Button className='absolute top-3 right-3 bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center' onClick={handleCloseDetails}>
                                X
                            </Button>

                            {/* Meal Title */}
                            <h3 className='text-2xl font-bold text-gray-800 mb-4'>
                                {foodDetails.strMeal}
                            </h3>

                            {/* Image */}
                            <img
                                src={foodDetails.strMealThumb}
                                alt='food-img'
                                className='w-full h-60 object-cover mb-6 rounded-lg'
                            />

                            {/* Tags */}
                            <div className='flex flex-wrap gap-2 mb-4'>
                                {(foodDetails.strTags || "").split(",").map((tag, i) => (
                                    <span key={i} className='bg-purple-200 text-purple-900 px-3 py-1 rounded-lg text-sm'>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Category & Area */}
                            <div className='mb-4 text-left'>
                                <p><strong>Category:</strong> {foodDetails.strCategory}</p>
                                <p><strong>Area:</strong> {foodDetails.strArea}</p>
                                <p><strong>YouTube:</strong> <a href={foodDetails.strYoutube} target='_blank' className='text-blue-500 underline'>Watch Video</a></p>
                                <p><strong>Recipe:</strong> <a href={foodDetails.strSource} target='_blank' className='text-blue-500 underline'>View Recipe</a></p>
                            </div>

                            {/* Instructions */}
                            <div className='border-2 text-left p-2'>
                                <h4 className='font-bold text-lg mb-2'>Instructions</h4>
                                <p className='text-gray-600 leading-6 text-left' style={{ whiteSpace: 'normal' }}>
                                    {foodDetails.strInstructions}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Explore;
