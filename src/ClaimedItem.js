import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import { supabase } from "./supabase";
import "./css/ClaimedItem.css";

const ClaimedItem = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('claimed_dateTime');
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

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...items];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.category && item.category.toLowerCase().includes(query))

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
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredItems(result);
  }, [items, searchQuery, sortField, sortDirection, categoryFilter, locationFilter]);

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from("claimed_items")
        .select("*");

      if (error) throw error;
      if (data) {
        setItems(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error.message);
      alert(error.message);
    }
  }

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from("claimed_items")
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

  async function fetchLocations() {
    try {
      const { data, error } = await supabase
        .from("claimed_items")
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
    setSortField('claimed_dateTime');
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
        <div className="storage-header">
         <div className="top-bar">
            <h1>Claimed Items</h1>
         </div>
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
          <p>No claimed items yet.</p>
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
                <th onClick={() => handleSort('datetime_found')}>
                  Date Found <SortIcon field="datetime_found" />
                </th>
                <th onClick={() => handleSort('datetime_surrendered')}>
                  Date Surrendered <SortIcon field="datetime_surrendered" />
                </th>
                <th>Description</th>
                <th>Status</th>
                <th onClick={() => handleSort('claimed_by')}>
                  Claimed By <SortIcon field="claimed_by" />
                </th>
                <th onClick={() => handleSort('claimed_dateTime')}>
                  Claim Date <SortIcon field="claimed_dateTime" />
                </th>
                <th>Processed By</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.location_found}</td>
                  <td>{item.datetime_found ? new Date(item.datetime_found).toLocaleString() : 'N/A'}</td>
                  <td>{item.datetime_surrendered ? new Date(item.datetime_surrendered).toLocaleString() : 'N/A'}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`status-badge ${item.claim_status}`}>
                      {item.claim_status}
                    </span>
                  </td>
                  <td>{item.claimed_by}</td>
                  <td>{item.claimed_dateTime ? new Date(item.claimed_dateTime).toLocaleString() : 'N/A'}</td>
                  <td>{item.claiming_processed_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClaimedItem;