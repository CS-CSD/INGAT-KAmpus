import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Sidebar from "./SideBar";
import "./css/ClaimedItem.css";
import { useUser, useRole } from './userContext'; 

const ItemStorage = () => {
    const { userId } = useUser();
    const userRole = useRole();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [claimerInfo, setClaimerInfo] = useState('');
    const [timeClaimed, setTimeClaimed] = useState('');
    const [dateClaimed, setDateClaimed] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Fetch data from Supabase
    useEffect(() => {
        fetchItems();
    }, []);

    // Filter items when searchQuery changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredItems(items);
            setIsSearching(false);
            return;
        }

        const filtered = items.filter(item => 
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location_found.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.claim_status.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setFilteredItems(filtered);
        setIsSearching(true);
    }, [searchQuery, items]);

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

    async function fetchItems() {
        try {
            const { data, error } = await supabase
                .from("registered_items")
                .select("*");

            if (error) throw error;
            if (data) {
                setItems(data);
                setFilteredItems(data); // Initialize filteredItems with all items
            }
        } catch (error) {
            console.error("Fetch failed:", error.message);
            alert(error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const datetimeClaimed = `${dateClaimed} ${timeClaimed}`;

        try {
            const { error } = await supabase
                .from("claimed_items")
                .insert([
                    {
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
                    },
                ]);

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

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
    };

    const itemsToDisplay = isSearching ? filteredItems : items;

    return (
        <div className="flex">
            <Sidebar />
            <div className="ClaimedItemContent">
                <div className="storage-header">
                    <h1>Stored Items</h1>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && setIsSearching(true)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={clearSearch}>
                                ×
                            </button>
                        )}
                    </div>
                </div>
                
                {items.length === 0 ? (
                    <p>No items registered yet.</p>
                ) : (
                    <>
                        {isSearching && filteredItems.length === 0 ? (
                            <p>No items found matching your search.</p>
                        ) : (
                            <table className="item-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Location Found</th>
                                        <th>Date Found</th>
                                        <th>Date Surrendered</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsToDisplay.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.category}</td>
                                            <td>{item.location_found}</td>
                                            <td>{new Date(item.datetime_found).toLocaleString()}</td>
                                            <td>{new Date(item.datetime_surrendered).toLocaleString()}</td>
                                            <td>{item.description}</td>
                                            <td>{item.claim_status}</td>
                                            <td>
                                                <button onClick={() => handleOpenModal(item)}>
                                                    Mark as Claimed
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>

            {/* Modal for claiming an item */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Mark Item as Claimed</h2>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Claimer Info:</label>
                                <input
                                    type="text"
                                    value={claimerInfo}
                                    onChange={(e) => setClaimerInfo(e.target.value)}
                                    placeholder="Enter claimer information"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label>Claim Date:</label>
                                <input
                                    type="date"
                                    value={dateClaimed}
                                    onChange={(e) => setDateClaimed(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Claim Time:</label>
                                <input
                                    type="time"
                                    value={timeClaimed}
                                    onChange={(e) => setTimeClaimed(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="modal-buttons">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemStorage;