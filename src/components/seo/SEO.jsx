import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, image }) => {
  return (
    <Helmet>
      { /* Standard metadata tags */ }
      <title>{title}</title>
      <meta name='description' content={description} />
      
      { /* End standard metadata tags */ }
      
      { /* Facebook tags */ }
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      { /* End Facebook tags */ }
      
      { /* Twitter tags */ }
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      { /* End Twitter tags */ }
    </Helmet>
  );
};

SEO.defaultProps = {
  title: 'VITB GOT LATENT - Season 2 | Leaderboard',
  description: 'Official Leaderboard for VITB GOT LATENT Season 2.',
  name: 'VITB GOT LATENT',
  type: 'website',
  image: '/image.png'
};

export default SEO;
