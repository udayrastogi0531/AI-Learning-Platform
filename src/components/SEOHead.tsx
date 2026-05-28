import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'AI-Driven Skill Learning Platform',
  description = 'Personalized AI learning that adapts to every skill level. Faster outcomes through intelligent education.'
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI Learning Platform",
    "description": description,
    "url": "https://ailearning.com"
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="AI learning, personalized education, adaptive learning" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
};

export default SEOHead;
