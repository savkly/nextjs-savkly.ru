import axios from 'axios';

export async function GET() {
  try {
    // const response = await axios.get('https://lenta.ru/rss/news', {
    const response = await axios.get('https://www.mk.ru/rss/news/index.xml', {
      headers: {
        'Content-Type': 'application/xml',
      },
    });

    return new Response(response.data, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    return new Response('Ошибка при получении данных', { status: error.response?.status || 500 });
  }
}
