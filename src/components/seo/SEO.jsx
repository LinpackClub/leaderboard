import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'VITB GOT LATENT — Season 2 | Leaderboard',
  description = 'Official live leaderboard for VITB GOT LATENT Season 2. Track every team, every score, in real-time.',
  name = 'VITB GOT LATENT',
  type = 'website',
  image = '/og-leaderboard.svg'
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const ogImage = image && image.startsWith('http') ? image : `${siteUrl}${image || '/og-leaderboard.svg'}`;

  return (
    <Helmet>
      {/* Standard */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* OpenGraph (Facebook / LinkedIn / WhatsApp) */}
      <meta property="og:site_name" content="VITB GOT LATENT" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
