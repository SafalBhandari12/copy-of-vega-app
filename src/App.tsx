import React, {useState} from 'react';
import './App.css';
import {modMovies} from './mod';
import {Post, Info, Stream} from './mod/types';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Post | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(null);
    setInfo(null);
    setStreams([]);
    try {
      const posts = await modMovies.GetSearchPosts(query, 1, '', undefined);
      setResults(posts);
    } catch (err) {
      setError('Search failed.');
    }
    setLoading(false);
  };

  const handleSelect = async (post: Post) => {
    setSelected(post);
    setInfo(null);
    setStreams([]);
    setLoading(true);
    setError(null);
    try {
      const meta = await modMovies.GetMetaData(post.link);
      setInfo(meta);
    } catch (err) {
      setError('Failed to fetch info.');
    }
    setLoading(false);
  };

  const handleDownload = async (link: string, type: string) => {
    setLoading(true);
    setStreams([]);
    setError(null);
    try {
      const streamLinks = await modMovies.GetStream(link, type);
      setStreams(streamLinks);
    } catch (err) {
      setError('Failed to extract download links.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Movies Mod Downloader</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          required
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      <div className="results">
        {results.map(post => (
          <div
            key={post.link}
            className={`result-card${
              selected?.link === post.link ? ' selected' : ''
            }`}
            onClick={() => handleSelect(post)}>
            <img src={post.image} alt={post.title} />
            <div>{post.title}</div>
          </div>
        ))}
      </div>
      {info && (
        <div className="info-card">
          <h2>{info.title}</h2>
          <img src={info.image} alt={info.title} />
          <p>{info.synopsis}</p>
          <div className="links">
            {info.linkList.map(link => (
              <div key={link.title} className="link-group">
                <div className="quality">{link.quality || ''}</div>
                {link.directLinks.map(dl => (
                  <button
                    key={dl.link}
                    onClick={() => handleDownload(dl.link, dl.type)}
                    disabled={loading}>
                    Download {dl.title}
                  </button>
                ))}
                {link.episodesLink && (
                  <button
                    onClick={() => handleDownload(link.episodesLink!, 'series')}
                    disabled={loading}>
                    Download Episodes
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {streams.length > 0 && (
        <div className="streams">
          <h3>Download Links</h3>
          <ul>
            {streams.map(s => (
              <li key={s.link}>
                <a href={s.link} target="_blank" rel="noopener noreferrer">
                  {s.server} ({s.type})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
