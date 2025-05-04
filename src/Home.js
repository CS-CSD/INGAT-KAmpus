import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar.js";
import "./css/Home.css";
import { supabase } from './supabase';

const HomePage = () => {
    const navigate = useNavigate();
    const [recentItems, setRecentItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItemsCount, setNewItemsCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        async function fetchRecentItems() {
            try {
                setLoading(true);
                
                const { data, error } = await supabase
                    .from("registered_items")
                    .select("*")
                    .eq("claim_status", "unclaimed")
                    .order("datetime_surrendered", { ascending: false }) 
                    .limit(5); 
                
                if (error) throw error;
                
                setRecentItems(data || []);
                
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString();
                
                const { count, error: countError } = await supabase
                    .from("registered_items")
                    .select("*", { count: "exact" })
                    .eq("claim_status", "unclaimed")
                    .gt("datetime_surrendered", yesterdayStr);
                
                if (countError) throw countError;
                
                setNewItemsCount(count || 0);
                
            } catch (error) {
                console.error("Error fetching recent items:", error.message);
            } finally {
                setLoading(false);
            }
        }
        
        fetchRecentItems();
        
        const subscription = supabase
            .channel('registered_items_changes')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'registered_items' 
            }, (payload) => {
                fetchRecentItems();
            })
            .subscribe();
            
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    
    

  

    const handleViewAllItems = () => {
        navigate("/items");
    };

   
    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Items to display - either search results or recent items
    const itemsToDisplay = isSearching ? searchResults : recentItems;

    return (
        <div className="HomePage">
            <Sidebar />
            <div className="Content">
                <div className="TopBar">
                    <h2>Dashboard</h2>
                    
                </div>

                {/* Announcements Section */}
                <div className="Announcements">
                    <h3>Announcements</h3>
                    <div className="AnnouncementBox">
                        Announcement from SDFO
                    </div>
                </div>

                {/* Lost Items Section */}
                <div className="LostItems">
                    <h3>
                        {isSearching ? 
                            `Search Results for "${searchQuery}"` : 
                            "Recently Registered Lost Items"}
                    </h3>
                    
                    {loading ? (
                        <div className="loading">Loading items...</div>
                    ) : itemsToDisplay.length === 0 ? (
                        <div className="no-items">
                            {isSearching ? 
                                "No items found matching your search." : 
                                "No lost items registered yet."}
                        </div>
                    ) : (
                        <div className="ItemsContainer">
                            {itemsToDisplay.map((item) => (
                                <div className="LostItemCard" key={item.id}>
                                    <div className="ItemImage">
                                        {item.image_url ? (
                                            <img 
                                                src={item.image_url} 
                                                alt={item.category} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/placeholder-image.png";
                                                }}
                                            />
                                        ) : (
                                            <div className="NoImage">No Image</div>
                                        )}
                                    </div>
                                    <div className="ItemInfo">
                                        <h4>{item.category}</h4>
                                        <p><strong>Found at:</strong> {item.location_found}</p>
                                        <p><strong>Date:</strong> {formatDate(item.datetime_found)}</p>
                                        <p className="ItemDescription">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Show new items count only when not searching */}
                    {!isSearching && (
                        <div className="NewLostItems">
                            <span className="Count">{newItemsCount}</span>
                            <p>New Lost Items</p>
                            <button onClick={handleViewAllItems}>View All</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;