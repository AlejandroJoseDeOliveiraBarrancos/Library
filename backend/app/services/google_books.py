import httpx
from typing import List, Dict, Any, Optional
from app.config import settings


class GoogleBooksService:
    def __init__(self):
        self.base_url = settings.GOOGLE_BOOKS_API_URL
        self.api_key = settings.GOOGLE_BOOKS_API_KEY

    async def search_books(
        self,
        query: Optional[str] = None,
        author: Optional[str] = None,
        category: Optional[str] = None,
        sort_by: str = "relevance",
        max_results: int = 20,
        start_index: int = 0,
    ) -> Dict[str, Any]:
        """
        Search for books using Google Books API
        """
        print(f"DEBUG: search_books called with query='{query}', author='{author}', category='{category}', sort_by='{sort_by}'")
        
        search_terms = []
        if query:
            search_terms.append(query)
        if author:
            search_terms.append(f"inauthor:{author}")
        if category:
            search_terms.append(f"subject:{category}")

        search_query = " ".join(search_terms) if search_terms else ""
        print(f"DEBUG: Final search query: '{search_query}'")

        if not search_query:
            print("DEBUG: No search query, showing newest books as default")
            search_query = "a"

        params = {
            "q": search_query,
            "maxResults": min(max_results, 40),
            "startIndex": start_index,
            "orderBy": sort_by if sort_by == "newest" else "relevance",
            "printType": "books",
        }

        if self.api_key:
            params["key"] = self.api_key

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/volumes",
                params=params,
                timeout=10.0,
            )
            response.raise_for_status()
            data = response.json()

        items = []
        for item in data.get("items", []):
            volume_info = item.get("volumeInfo", {})
            items.append(self._transform_book(item["id"], volume_info))

        return {
            "items": items,
            "totalItems": data.get("totalItems", 0),
        }

    async def get_book(self, book_id: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific book
        """
        params = {}
        if self.api_key:
            params["key"] = self.api_key

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/volumes/{book_id}",
                params=params,
                timeout=10.0,
            )
            response.raise_for_status()
            data = response.json()

        volume_info = data.get("volumeInfo", {})
        return self._transform_book(data["id"], volume_info)

    def _transform_book(self, book_id: str, volume_info: Dict) -> Dict[str, Any]:
        """
        Transform Google Books API response to our book format
        """
        image_links = volume_info.get("imageLinks", {})
        cover_image = (
            image_links.get("large")
            or image_links.get("medium")
            or image_links.get("thumbnail")
            or None
        )
        
        # Fix HTTP to HTTPS for cover images to avoid mixed content issues
        if cover_image and cover_image.startswith("http://"):
            cover_image = cover_image.replace("http://", "https://")

        isbn = None
        for identifier in volume_info.get("industryIdentifiers", []):
            if identifier.get("type") in ["ISBN_13", "ISBN_10"]:
                isbn = identifier.get("identifier")
                break

        return {
            "id": book_id,
            "title": volume_info.get("title", "Unknown Title"),
            "authors": volume_info.get("authors", []),
            "description": volume_info.get("description"),
            "coverImage": cover_image,
            "categories": volume_info.get("categories", []),
            "publishedDate": volume_info.get("publishedDate"),
            "pageCount": volume_info.get("pageCount"),
            "language": volume_info.get("language"),
            "publisher": volume_info.get("publisher"),
            "isbn": isbn,
            "averageRating": volume_info.get("averageRating"),
            "ratingsCount": volume_info.get("ratingsCount"),
            "previewLink": volume_info.get("previewLink"),
            "infoLink": volume_info.get("infoLink"),
            "availability": "available",  # Default availability
        }


google_books_service = GoogleBooksService()

