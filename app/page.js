"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [rssItems, setRssItems] = useState([]);
  const [filterWords, setFilterWords] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleItem, setVisibleItem] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  // При монтировании загружаем данные из localStorage
  useEffect(() => {
    const savedFilterWords = localStorage.getItem('filterWords');
    if (savedFilterWords) {
      setFilterWords(savedFilterWords);
    }
  }, []);

  // Сохраняем данные в localStorage при каждом изменении filterWords
  useEffect(() => {
    if (filterWords) {
      localStorage.setItem('filterWords', filterWords);
    }
  }, [filterWords]);

  const fetchRssFeed = async () => {
    try {
      const response = await axios.get('/api/rss');
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, 'application/xml');

      const items = Array.from(xml.querySelectorAll('item')).map((item) => ({
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        pubDate: item.querySelector('pubDate').textContent,
        description: item.querySelector('description')?.textContent || 'Нет описания',
        category: item.querySelector('category')?.textContent || 'Без категории',
      }));

      setRssItems(items);
      setShowMessage(true); // Показать сообщение "обновлено"
    setTimeout(() => setShowMessage(false), 2000); // Скрыть через 2 секунды
    } catch (err) {
      setError('Не удалось загрузить RSS ленту');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRssFeed();
  }, []);

  useEffect(() => {
    if (filterWords) {
      const words = filterWords
        .split('\n')
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean);

      const filtered = rssItems.filter((item) =>
        words.some((word) =>
          item.title.toLowerCase().includes(word) ||
          item.description.toLowerCase().includes(word) ||
          item.category.toLowerCase().includes(word)
        )
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(rssItems);
    }
  }, [filterWords, rssItems]);

  const handleFilterChange = (event) => {
    setFilterWords(event.target.value);
  };

  const toggleVisibility = (index) => {
    setVisibleItem((prevIndex) => (prevIndex === index ? null : index));
  };

  const highlightText = (text, words) => {
    if (!words.length) return text;

    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  };

  const highlightedTitle = (title, words) => {
    const safeWords = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Экранирование спецсимволов
    return <span dangerouslySetInnerHTML={{ __html: highlightText(title, safeWords) }} />;
  };

  const highlightedDescription = (description, words) => {
    const safeWords = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Экранирование спецсимволов
    return <span dangerouslySetInnerHTML={{ __html: highlightText(description, safeWords) }} />;
  }

  const highlightedCategory = (category, words) => {
    const safeWords = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Экранирование спецсимволов
    return <span className="category" dangerouslySetInnerHTML={{ __html: highlightText(category, safeWords) }} />;
  }

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const filterWordsArray = filterWords
    .split('\n')
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);

  return (
    <div className="page">
      {showMessage && <div className="update-message fade-in">Обновлено</div>}
      <h1 className="mb-20">Фильтр новостей MK.ru по ключевым словам</h1>
      
      <textarea
        placeholder="Введите ключевые слова (одно на строке)"
        value={filterWords}
        onChange={handleFilterChange}
        rows={5}
        style={{ width: '100%', marginBottom: '20px' }}
      />

      <div className="mb-20" style={{ display: 'flex', gap: '10px' }}>
        <button className="btn" onClick={() => setFilterWords('')}>Сбросить фильтр</button>
        <button className="btn btn-primary" onClick={() => fetchRssFeed()}>Обновить</button>
      </div>

      <h2>Новости:</h2>

      <ul>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <li key={index}>
              <div className={`newsItem ${visibleItem === index ? 'selected' : ''}`}>
                <h3
                  onClick={() => toggleVisibility(index)}
                  style={{ cursor: 'pointer', marginBottom: '10px' }}
                >
                  {highlightedTitle(item.title, filterWordsArray)}
                </h3>
                <div>
                  Категория: <span className="category">{highlightedCategory(item.category, filterWordsArray)}</span>
                  <a href={item.link} className="btn btn-sm" target="_blank" rel="noopener noreferrer">🌐 Открыть ссылку</a>
                </div>
                {visibleItem === index && (
                  <div>
                    <p>{highlightedDescription(item.description, filterWordsArray)}</p>
                    <small>{new Date(item.pubDate).toLocaleString()}</small>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>Нет новостей по заданным ключевым словам.</p>
        )}
      </ul>
    </div>
  );
}
