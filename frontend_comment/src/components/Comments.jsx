import { useState, useRef, useEffect } from 'react';
import './comments.css'


const Comments = () => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const replyTextareaRef = useRef(null);
    const [replies, setReplies] = useState([]);
    // Add these new state variables at the top of your component
    const [editingComment, setEditingComment] = useState(null);
    const [editingReply, setEditingReply] = useState(null);
    const [editText, setEditText] = useState('');
    const editTextareaRef = useRef(null);

    // Add these new functions to handle comment actions

    const handleCommentDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
        try {
        const response = await fetch(`http://localhost:8000/api/comments/${commentId}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete comment: ${response.status}`);
        }
        
        // Remove comment from state
        setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
        console.error('Error deleting comment:', error);
        }
    }
    };

    const handleCommentEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
    };

    const handleEditSubmit = async (commentId) => {
    if (!editText.trim()) return;
    
    try {
        const comment = comments.find(c => c.id === commentId);
        
        const response = await fetch(`http://localhost:8000/api/comments/${commentId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            text: editText,
            author: comment.author,
            date: comment.date,
            likes: comment.likes,
            image: comment.image
        })
        });
        
        if (!response.ok) {
        throw new Error(`Failed to update comment: ${response.status}`);
        }
        
        // Update comment in state
        setComments(comments.map(c => 
        c.id === commentId ? {...c, text: editText} : c
        ));
        
        setEditingComment(null);
        setEditText('');
    } catch (error) {
        console.error('Error updating comment:', error);
    }
    };

    // Add these functions for reply actions
    const handleReplyDelete = async (replyId, commentId) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
        try {
        const response = await fetch(`http://localhost:8000/api/replies/${replyId}/`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete reply: ${response.status}`);
        }
        
        // Remove reply from state
        setReplies(prev => ({
            ...prev,
            [commentId]: prev[commentId].filter(r => r.id !== replyId)
        }));
        } catch (error) {
        console.error('Error deleting reply:', error);
        }
    }
    };

    const handleReplyEdit = (reply, commentId) => {
    setEditingReply(reply.id);
    setEditText(reply.text);
    };

    const handleReplyEditSubmit = async (replyId, commentId) => {
    if (!editText.trim()) return;
    
    try {
        const reply = replies[commentId].find(r => r.id === replyId);
        
        const response = await fetch(`http://localhost:8000/api/replies/${replyId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            text: editText,
            author: reply.author,
            date: reply.date,
            likes: reply.likes,
            parent: reply.parent
        })
        });
        
        if (!response.ok) {
        throw new Error(`Failed to update reply: ${response.status}`);
        }
        
        // Update reply in state
        setReplies(prev => ({
        ...prev,
        [commentId]: prev[commentId].map(r => 
            r.id === replyId ? {...r, text: editText} : r
        )
        }));
        
        setEditingReply(null);
        setEditText('');
    } catch (error) {
        console.error('Error updating reply:', error);
    }
    };

    // Add a useEffect for the edit textarea
    useEffect(() => {
    if (editTextareaRef.current) {
        editTextareaRef.current.style.height = '0px';
        const scrollHeight = editTextareaRef.current.scrollHeight;
        editTextareaRef.current.style.height = scrollHeight + 'px';
    }
    }, [editText]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/comments/')
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchReplies = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/comments/${commentId}/replies/`);
            if(!response.ok) {
                throw new Error('Failed to fetch replies');
            }
            const data = await response.json();
            return data;
        } catch (error){
            console.error('Error fetching replies', error);
            return [];
        }
    }

    const toggleReplies = async (commentId) => {
        if (replies[commentId]) {
            setReplies(prev => ({
                ...prev,  // This was missing - need to preserve all previous state
                [`${commentId}_visible`]: !prev[`${commentId}_visible`]
            }));
        } else {
            const commentReplies = await fetchReplies(commentId);
            setReplies(prev => ({
                ...prev,
                [commentId]: commentReplies,
                [`${commentId}_visible`]: true
            }));
        }
    }
    
    const formatDate = (dateString) => {
        const commentDate = new Date(dateString);
        
        // Format: "YYYY-MM-DD HH:MM"
        const year = commentDate.getFullYear();
        const month = String(commentDate.getMonth() + 1).padStart(2, '0');
        const day = String(commentDate.getDate()).padStart(2, '0');
        const hours = String(commentDate.getHours()).padStart(2, '0');
        const minutes = String(commentDate.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    const handleLike = async (id) => {
        try {
            // Find the comment
            const comment = comments.find(c => c.id === id);
            
            // Toggle liked state and update likes count
            const isLiked = comment.liked || false;
            const newLikes = isLiked ? comment.likes - 1 : comment.likes + 1;
            
            // Update comments state with toggled like
            const updatedComments = comments.map(c => 
                c.id === id ? {...c, likes: newLikes, liked: !isLiked} : c
            );
            setComments(updatedComments);
    
            // Send update to backend with all required fields
            const response = await fetch(`http://localhost:8000/api/comments/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    likes: newLikes,
                    author: comment.author,
                    text: comment.text,
                    date: comment.date,
                    image: comment.image
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Server response:', errorData);
                throw new Error(`Failed to update likes in database: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating likes:', error);
            // Revert to original state by fetching fresh data
            fetchComments();
        }
    }

    const handleReplyLike = async (replyId, commentId) => {
        try {
            // Find the reply
            const reply = replies[commentId].find(r => r.id === replyId);
            
            // Toggle liked state and update likes count
            const isLiked = reply.liked || false;
            const newLikes = isLiked ? reply.likes - 1 : reply.likes + 1;
            
            // Update replies state with toggled like
            const updatedReplies = replies[commentId].map(r => 
                r.id === replyId ? {...r, likes: newLikes, liked: !isLiked} : r
            );
            
            setReplies(prev => ({
                ...prev,
                [commentId]: updatedReplies
            }));
    
            // Send update to backend
            const response = await fetch(`http://localhost:8000/api/replies/${replyId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    likes: newLikes,
                    author: reply.author,
                    text: reply.text,
                    date: reply.date,
                    parent: reply.parent
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update reply likes: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating reply likes:', error);
            // Refresh replies if there's an error
            const freshReplies = await fetchReplies(commentId);
            setReplies(prev => ({
                ...prev,
                [commentId]: freshReplies
            }));
        }
    }

    const handleReplySubmit = async (commentId) => {
        if (!replyText.trim()) {
            return;
        }

        try {
            const replyData = {
                parent: commentId,
                author: 'admin',
                text: replyText,
                date: new Date().toISOString(),
                likes: 0
            };

            const response = await fetch('http://localhost:8000/api/replies/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(replyData)
            });

            if(!response.ok) {
                throw new Error(`Failed to submit reply: ${response.status}`);
            }

            setReplyText('');
            setReplyingTo(null);

            const updatedReplies = await fetchReplies(commentId);
            setReplies(prev => ({
                ...prev,
                [commentId]: updatedReplies
            }));
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    }

    const checkForReplies = async () => {
        if (comments.length > 0) {
            for (const comment of comments) {
                const commentReplies = await fetchReplies(comment.id);
                if (commentReplies.length > 0) {
                    setReplies(prev => ({
                        ...prev,
                        [comment.id]: commentReplies
                    }));
                }
            }
        }
    };

    const handleReplyClick = (commentId) => {
        setReplyingTo(replyingTo === commentId ? null : commentId);
        setReplyText('');
    }

    useEffect(() => {
        fetchComments();
    }, []);

    useEffect(() => {
        if (comments.length > 0) {
            checkForReplies();
        }
    }, [comments]);

    useEffect(() => {
    }, [replies]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '0px';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + 'px';
        }
    }, [text]);

    useEffect(() => {
        if (replyTextareaRef.current) {
            replyTextareaRef.current.style.height = '0px';
            const scrollHeight = replyTextareaRef.current.scrollHeight;
            replyTextareaRef.current.style.height = scrollHeight + 'px';
        }
    }, [replyText]);

    return (
        <div className='comments'>
            <div className='comments-main'>
                <h1>Comments Page</h1>
                <div className='comment-list'>
                    {loading ? (
                        <div className='loading'>Loading comments..</div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className='comment-item'> 
                                <div className='comment-content'>
                                    <div className='comment-order'>
                                        <div className='comment-author'>
                                            <span>@{comment.author}</span>
                                            <span>{formatDate(comment.date)}</span>
                                        </div>
                                        
                                        {editingComment === comment.id ? (
                                            <div className='edit-form'>
                                                <textarea
                                                    className='edit-textarea'
                                                    ref={editTextareaRef}
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                />
                                                <div className='edit-actions'>
                                                    <button
                                                        className='cancel-edit'
                                                        onClick={() => setEditingComment(null)}
                                                    >Cancel</button>
                                                    <button
                                                        className='submit-edit'
                                                        onClick={() => handleEditSubmit(comment.id)}
                                                    >Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Fix the nested comment-text div structure
                                            <div className='comment-text'>
                                                <span>{comment.text}</span>
                                                <div className="comment-actions">
                                                    <button className="actions-button">⋮</button>
                                                    <div className="actions-dropdown">
                                                        <button onClick={() => handleCommentEdit(comment)}>Edit</button>
                                                        <button onClick={() => handleCommentDelete(comment.id)}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {comment.image && comment.image.trim() !== '' ? (
                                            <div className='comment-image'>
                                                <img
                                                    src={comment.image.toLowerCase().endsWith('.png') 
                                                        ? `https://images.weserv.nl/?url=${encodeURIComponent(comment.image)}&output=jpg` 
                                                        : comment.image}
                                                    alt={`${comment.author}'s image`}
                                                    onLoad={(e) => {
                                                        // Image loaded successfully, ensure it's visible
                                                        e.target.style.display = 'block';
                                                    }}
                                                    onError={(e) => {
                                                        console.error("Image failed to load:", comment.image);
                                                        // If the proxy also fails, hide the container
                                                        e.target.parentElement.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                        <div className='comment-like'>
                                            <button
                                                className={`like-button ${comment.liked ? 'active' : ''}`}
                                                onClick={() => handleLike(comment.id)}
                                            >
                                                <span className='like-icon'></span>
                                                <span className='like-count'>{comment.likes}</span>
                                            </button>
                                            <button
                                                className={`reply-button ${replyingTo === comment.id ? 'active' : ''}`}
                                                onClick={() => handleReplyClick(comment.id)}
                                            >Reply</button>
                                        </div>
                                        {replyingTo === comment.id && (
                                            <div className='reply-form'>
                                                <textarea
                                                    className='reply-textarea'
                                                    ref={replyTextareaRef}
                                                    value={replyText}
                                                    placeholder="Add a reply..."
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                />
                                                <div className='reply-actions'>
                                                    <button
                                                        className='cancel-reply'
                                                        onClick={() => setReplyingTo(null)}
                                                    >Cancel</button>
                                                    <button
                                                        className='submit-reply'
                                                        onClick={() => handleReplySubmit(comment.id)}
                                                    >Reply</button>
                                                </div>
                                            </div>
                                        )}
                                        {replies[comment.id] && replies[comment.id].length > 0 && (
                                            <div className='replies-section'>
                                                <button
                                                    className='view-replies-button' // Fix the class name to match your CSS
                                                    onClick={() => toggleReplies(comment.id)}
                                                >
                                                    {replies[`${comment.id}_visible`] ? 'Hide replies' : `View ${replies[comment.id].length} ${replies[comment.id].length === 1 ? 'reply' : 'replies'}`}
                                                </button>
                                                {replies[`${comment.id}_visible`] && (
                                                    <div className='replies-list'>
                                                        {replies[comment.id].map(reply => (
                                                            <div 
                                                                key={reply.id}
                                                                className='reply-item'
                                                            >
                                                                <div className='reply-author'>
                                                                  <span>@{reply.author}</span>
                                                                  <span>{formatDate(reply.date)}</span>
                                                                </div>
                                                                
                                                                {editingReply === reply.id ? (
                                                                  <div className='edit-form'>
                                                                    <textarea
                                                                      className='edit-textarea'
                                                                      ref={editTextareaRef}
                                                                      value={editText}
                                                                      onChange={(e) => setEditText(e.target.value)}
                                                                    />
                                                                    <div className='edit-actions'>
                                                                      <button
                                                                        className='cancel-edit'
                                                                        onClick={() => setEditingReply(null)}
                                                                      >Cancel</button>
                                                                      <button
                                                                        className='submit-edit'
                                                                        onClick={() => handleReplyEditSubmit(reply.id, comment.id)}
                                                                      >Save</button>
                                                                    </div>
                                                                  </div>
                                                                ) : (
                                                                    <div className='reply-text'>
                                                                        <span>{reply.text}</span>
                                                                        <div className="reply-actions">
                                                                            <button className="actions-button">⋮</button>
                                                                            <div className="actions-dropdown">
                                                                                <button onClick={() => handleReplyEdit(reply, comment.id)}>Edit</button>
                                                                                <button onClick={() => handleReplyDelete(reply.id, comment.id)}>Delete</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className='reply-like'>
                                                                    <button 
                                                                        className={`like-button ${reply.liked ? 'active' : ''}`}
                                                                        onClick={() => handleReplyLike(reply.id, comment.id)}
                                                                    >
                                                                        <span className='like-icon'></span>
                                                                        <span className='like-count'>{reply.likes}</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Comments;