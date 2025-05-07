import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Sidebar from "./SideBar";
import "./css/ClaimedItem.css";
import { useUser } from './userContext'; 

const ItemStorage = () => {
    const { userId } = useUser();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [claimerInfo, setClaimerInfo] = useState('');
    const [timeClaimed, setTimeClaimed] = useState('');
    const [dateClaimed, setDateClaimed] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('datetime_surrendered');
    const [sortDirection, setSortDirection] = useState('desc');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    // Fetch data from Supabase
    useEffect(() => {
        fetchItems();
        fetchCategories();
        fetchLocations();
    }, []);

    // Apply filters and sorting
    useEffect(() => {
        let result = [...items];

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => 
                item.category.toLowerCase().includes(query) 
            
            );
        }

      
        // Apply category filter
        if (categoryFilter !== 'all') {
            result = result.filter(item => item.category === categoryFilter);
        }

        // Apply location filter
        if (locationFilter !== 'all') {
            result = result.filter(item => item.location_found === locationFilter);
        }

        // Apply sorting
        result.sort((a, b) => {
            if (a[sortField] < b[sortField]) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (a[sortField] > b[sortField]) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setFilteredItems(result);
    }, [items, searchQuery, sortField, sortDirection, categoryFilter, locationFilter]);

    // Fetch unique categories
    async function fetchCategories() {
        try {
            const { data, error } = await supabase
                .from("registered_items")
                .select("category")
                .neq("category", null);

            if (error) throw error;
            if (data) {
                const uniqueCategories = [...new Set(data.map(item => item.category))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error.message);
        }
    }

    // Fetch unique locations
    async function fetchLocations() {
        try {
            const { data, error } = await supabase
                .from("registered_items")
                .select("location_found")
                .neq("location_found", null);

            if (error) throw error;
            if (data) {
                const uniqueLocations = [...new Set(data.map(item => item.location_found))];
                setLocations(uniqueLocations);
            }
        } catch (error) {
            console.error("Error fetching locations:", error.message);
        }
    }

    async function fetchItems() {
        try {
            const { data, error } = await supabase
                .from("registered_items")
                .select("*");
    
            if (error) throw error;
    
            if (data) {
                // Map each item to convert image_url path into a full public URL
                const itemsWithPublicUrls = data.map(item => {
                    // Get the public URL from Supabase storage
                    const { data: publicUrlData } = supabase
                        .storage
                        .from('images') // make sure this matches your bucket name
                        .getPublicUrl(item.image_url);
                    return {
                        ...item,
                        image_url: publicUrlData.publicUrl,
                    };
                });
                setItems(itemsWithPublicUrls);
            }
        } catch (error) {
            console.error("Fetch failed:", error.message);
            alert(error.message);
        }
    }
    

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setClaimerInfo('');
        setTimeClaimed('');
        setDateClaimed('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setClaimerInfo('');
        setTimeClaimed('');
        setDateClaimed('');
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datetimeClaimed = `${dateClaimed} ${timeClaimed}`;

        try {
            const { error } = await supabase
                .from("claimed_items")
                .insert([{
                    id: selectedItem.id,
                    category: selectedItem.category,
                    location_found: selectedItem.location_found,
                    datetime_found: selectedItem.datetime_found,
                    datetime_surrendered: selectedItem.datetime_surrendered,
                    description: selectedItem.description,
                    surrendered_by: selectedItem.surrendered_by,
                    claim_status: "claimed",
                    processed_by: selectedItem.processed_by,
                    stored_in: selectedItem.stored_in,
                    claimed_by: claimerInfo,
                    claimed_dateTime: datetimeClaimed,
                    claiming_processed_by: userId,
                    image_url: selectedItem.image_url
                }]);

            if (error) throw error;

            await supabase
                .from("registered_items")
                .delete()
                .eq("id", selectedItem.id);

            handleCloseModal();
            fetchItems();

        } catch (error) {
            console.error("Error marking item as claimed:", error.message);
            alert(error.message);
        }
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setCategoryFilter('all');
        setLocationFilter('all');
        setSortField('datetime_surrendered');
        setSortDirection('desc');
    };

    const SortIcon = ({ field }) => (
        <span className="sort-icon">
            {sortField === field ? (
                sortDirection === 'asc' ? '↑' : '↓'
            ) : '↕'}
        </span>
    );

    return (
        <div className="flex">
            <Sidebar />
            <div className="ClaimedItemContent">
              <div className="top-bar">
                <h1> Item Storage</h1>
              </div>
                <div className="storage-header">
                    <div className="controls-container">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          
                        </div>

                        <div className="filter-controls">
                            <div className="filter-group">
                                <label>Category:</label>
                                <select 
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Location:</label>
                                <select 
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
                                    <option value="all">All Locations</option>
                                    {locations.map(location => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button 
                                className="clear-filters" 
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
                
                {items.length === 0 ? (
                    <p>No items registered yet.</p>
                ) : filteredItems.length === 0 ? (
                    <p>No items match your filters.</p>
                ) : (
                    <table className="item-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('category')}>
                                    Category <SortIcon field="category" />
                                </th>
                                <th onClick={() => handleSort('location_found')}>
                                    Location <SortIcon field="location_found" />
                                </th>

                                <th>Image</th>

                                <th onClick={() => handleSort('datetime_found')}>
                                    Date Found <SortIcon field="datetime_found" />
                                </th>
                                <th onClick={() => handleSort('datetime_surrendered')}>
                                    Date Surrendered <SortIcon field="datetime_surrendered" />
                                </th>
                                <th>Description</th>
                                <th onClick={() => handleSort('claim_status')}>
                                    Status <SortIcon field="claim_status" />
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.category}</td>
                                    <td>{item.location_found}</td>
                                    <td>
                    {/* Render the image */}
                    {item.image_url ? (
                        <img 
                            src={item.image_url} 
                            alt={item.category} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Optional styling
                        />
                    ) : (
                        <div>No Image</div>
                    )}
                </td>

                                    <td>{new Date(item.datetime_found).toLocaleString()}</td>
                                    <td>{new Date(item.datetime_surrendered).toLocaleString()}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <span className={`status-badge ${item.claim_status}`}>
                                            {item.claim_status}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleOpenModal(item)}
                                            disabled={item.claim_status === 'claimed'}
                                        >
                                            {item.claim_status === 'claimed' ? 'Claimed' : 'Mark as Claimed'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal for claiming an item */}
            {showModal && (
                <div className={`modal ${showModal ? 'active' : ''}`}>
                    <div className="modal-content">
                        <h2>Mark Item as Claimed</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Claimer Info:</label>
                                <input
                                    type="text"
                                    value={claimerInfo}
                                    onChange={(e) => setClaimerInfo(e.target.value)}
                                    placeholder="Enter claimer information"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Claim Date:</label>
                                <input
                                    type="date"
                                    value={dateClaimed}
                                    onChange={(e) => setDateClaimed(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Claim Time:</label>
                                <input
                                    type="time"
                                    value={timeClaimed}
                                    onChange={(e) => setTimeClaimed(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="modal-buttons">
                                <button id ="modal-submit" type="submit">Submit</button>
                                <button id="modal-cancel" type="button" onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemStorage;