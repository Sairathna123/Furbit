import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Community.css";

const CommunityTips = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [petFilter, setPetFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [webTips, setWebTips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    name: "",
    pet: "",
    title: "",
    content: "",
    tags: ""
  });

  // Fetch existing posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data.reverse()); // newest first
      } catch (err) {
        console.error("Error fetching posts", err);
      }
    };
    fetchPosts();
  }, []);

  // Fetch external pet tips (optional)
  useEffect(() => {
    const fetchWebTips = async () => {
      try {
        const res = await axios.get("https://api.geoapify.com/v1/geocode/search?text=pet+tips&apiKey=YOUR_GEOAPIFY_KEY");
        setWebTips(res.data.features.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch web tips", err);
      }
    };
    fetchWebTips();
  }, []);

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPet = petFilter === "All" || post.user.pet === petFilter;
    const matchesTag = tagFilter === "All" || post.tags.includes(tagFilter);
    return matchesSearch && matchesPet && matchesTag;
  });

  // Create post function
  const handlePostSubmit = async () => {
    try {
      const tagsArray = newPost.tags.split(",").map(tag => tag.trim());
      const postToAdd = {
        user: { name: newPost.name, pet: newPost.pet },
        title: newPost.title,
        content: newPost.content,
        likes: 0,
        comments: 0,
        tags: tagsArray
      };

      const res = await axios.post("http://localhost:5000/api/posts", postToAdd);
      setPosts([res.data, ...posts]);
      setShowForm(false);
      setNewPost({ name: "", pet: "", title: "", content: "", tags: "" });
    } catch (err) {
      console.error("Failed to post", err);
      alert("Post failed. See console for error.");
    }
  };

  const openPostInNewTab = (post) => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
      <head>
        <title>${post.title}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { color: #4B0082; }
          .info { color: gray; margin-bottom: 10px; }
          .tags span { margin-right: 5px; background: #eee; padding: 3px 7px; border-radius: 4px; font-size: 14px; }
        </style>
      </head>
      <body>
        <h2>${post.title}</h2>
        <div class="info">By <strong>${post.user.name}</strong> (Pet: ${post.user.pet})</div>
        <p>${post.content}</p>
        <div class="tags">
          ${post.tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
      </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="community-page">
      {/* LEFT FILTER */}
      <div className="sidebar-left">
        <h3>Filter</h3>
        <label>Pet Type</label>
        <select value={petFilter} onChange={(e) => setPetFilter(e.target.value)}>
          <option>All</option>
          <option>Dog</option>
          <option>Cat</option>
          <option>Bird</option>
          <option>Other</option>
        </select>

        <label>Info Type</label>
        <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
          <option>All</option>
          <option>Health</option>
          <option>Training</option>
          <option>Grooming</option>
          <option>Food</option>
        </select>
      </div>

      {/* CENTER FEED */}
      <div className="main-feed">
        <div className="top-bar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>Search</button>
          </div>
          <button className="create-post-btn" onClick={() => setShowForm(true)}>+ Create Post</button>
        </div>

        {filteredPosts.map((post) => (
          <div className="post-card" key={post._id} onClick={() => openPostInNewTab(post)} style={{ cursor: "pointer" }}>
            <div className="post-header">
              <strong>{post.user.name}</strong> owns a <em>{post.user.pet}</em>
            </div>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <div className="post-footer">
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments}</span>
              <div className="tags">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* CREATE POST MODAL */}
        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>Create Post</h3>
              <input
                placeholder="Your Name"
                value={newPost.name}
                onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
              />
              <select
                value={newPost.pet}
                onChange={(e) => setNewPost({ ...newPost, pet: e.target.value })}
              >
                <option value="">Select Pet Type</option>
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
                <option>Other</option>
              </select>
              <input
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <textarea
                placeholder="Post Content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              ></textarea>
              <input
                placeholder="Tags (comma separated)"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              />
              <button onClick={handlePostSubmit}>Post</button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="sidebar-right">
        <h3>Web Resources</h3>
        {webTips.length > 0 ? (
          webTips.map((tip, idx) => (
            <div key={idx} className="web-tip">
              <a href={tip.properties.url || "#"} target="_blank" rel="noreferrer">
                {tip.properties.name || "Pet Tip"}
              </a>
            </div>
          ))
        ) : (
          <p>Loading tips...</p>
        )}
      </div>
    </div>
  );
};

export default CommunityTips;
