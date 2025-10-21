export const cleanHtmlDescription = (htmlString: string): string => {
  if (!htmlString) return '';

  return htmlString
    .replace(/<\/p>/gi, '\n\n')
    
    .replace(/<p[^>]*>/gi, '')
    
    .replace(/<br\s*\/?>/gi, '\n')
    
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    
    .replace(/<[^>]*>/g, '')
    
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')

    .replace(/▪/g, '•')
    .replace(/■/g, '•')
    .replace(/▫/g, '◦')
    
    .replace(/ +/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const formatBookDescription = (description: string | undefined): string => {
  if (!description) return 'No description available.';
  
  return cleanHtmlDescription(description);
};
