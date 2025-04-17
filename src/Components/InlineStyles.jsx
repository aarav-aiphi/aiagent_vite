// src/components/InlineStyles.js
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

const InlineStyles = () => {
  const [styles, setStyles] = useState('');

  useEffect(() => {
    // Fetch the aggregated CSS from the custom REST endpoint.
    fetch('http://localhost/blog/wp-json/selectedcss/v1/css')
      .then(response => response.text())
      .then(text => setStyles(text))
      .catch(error => console.error('Error fetching aggregated styles:', error));
  }, []);

  return (
    <Helmet>
      <style type="text/css">{styles}</style>
    </Helmet>
  );
};

export default InlineStyles;
