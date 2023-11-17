import React, { useState, useEffect } from "react";
import { PagesList } from "./PagesList";


// import and prepend the api url to any fetch calls
import apiURL from "../api";

export const App = () => {
  const [pages, setPages] = useState([]);
  const [singlePage, setSinglePage] = useState(null);
  const [addArticle, setAddArticle] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState([]);
  const [newArticle, setNewArticle] = useState({});

  async function fetchPages() {
    try {
      const response = await fetch(`${apiURL}/wiki`);
      const pagesData = await response.json();
      setPages(pagesData);
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  const fetchSinglePage = async (slug) => {
    try {
      const response = await fetch(`${apiURL}/wiki/${slug}`);
      const singlePageData = await response.json();
      setSinglePage(singlePageData);
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  };

  const handleClick = () => {
    setSinglePage(null);
  };

	async function handleSubmit(e) {
		e.preventDefault();
		
		try {
			const response = await fetch(`${apiURL}/wiki`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					content,
					name: author,
					email,
					tags,
				}),
			});
	
			if (response.ok) {
				const newArticleData = await response.json();
				setNewArticle(newArticleData);
				fetchPages();
				setAddArticle(false);
			} else {
				console.log('Failed to add a new article');
			}
		} catch (err) {
			console.error('An error occurred:', err);
		}
	}

	// Delete functionality
	const handleDelete = async (slug) => {
		try {
			const response = await fetch(`${apiURL}/wiki/${slug}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				setSinglePage(null);
				fetchPages();
			} else {
				console.log('Failed to delete article');
			}
		} catch (err) {
			console.error('An error occurred:', err);
		}
	}

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <main>
      {singlePage === null && (
        <>
          <h1>WikiVerse</h1>
          <h2>An interesting 📚</h2>
          <PagesList pages={pages} fetchSinglePage={fetchSinglePage} />
          <button className="add" onClick={() => setAddArticle(!addArticle)}>
            Add Article
          </button>
        </>
      )}

      {singlePage && (
        <div>
          <h2>{singlePage.title}</h2>
          <p>Author: {singlePage.author.name}</p>
          <p>Content: {singlePage.content}</p>
          <p>Tags: {singlePage.tags.map((tag) => tag.name).join(", ")}</p>
          <p>Date: {new Date(singlePage.createdAt).toLocaleDateString()}</p>
          <button onClick={handleClick}>Back to wiki list</button>
					{/* add delete button */}
					<button onClick={() => handleDelete(singlePage.slug)}>Delete</button>
        </div>
      )}

      {addArticle && (
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content</label>
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setAddArticle(false)}>
            Cancel
          </button>
        </form>
      )}
    </main>
  );
};
